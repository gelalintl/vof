import { prisma } from "@/lib/prisma";
import type { Locale } from "@/i18n/config";
import { getRequestLocale, localizedText } from "@/i18n/localized";
import { isExcludedCalendarDay } from "@/lib/eventRecurrence";
import type { AdminEventCategory, AdminRecurrenceType } from "@/types";

export interface ProjectedMonthlyEvent {
  id: string;
  sourceId: string;
  title: string;
  description: string;
  startDate: Date;
  endDate: Date | null;
  location: string;
  category: AdminEventCategory;
  isSpecial: boolean;
  isExclusive: boolean;
  image: string | null;
  recurrenceType: AdminRecurrenceType;
  theme?: string;
  slug: string | null;
}

interface EventThemePeriod {
  startDate: Date;
  endDate: Date;
  theme: string;
  themeEn: string | null;
}

export interface RecurringEventRow {
  id: string;
  title: string;
  description: string;
  startDate: Date;
  endDate: Date | null;
  location: string;
  category: AdminEventCategory;
  isSpecial: boolean;
  isExclusive: boolean;
  image: string | null;
  slug?: string | null;
  recurrenceType: AdminRecurrenceType;
  daysOfWeek: number[];
  recurrenceEndDate: Date | null;
  durationDays: number;
  excludedDates?: string[];
  theme: string | null;
  themeEn: string | null;
  themes: EventThemePeriod[];
}

function startOfDay(date: Date) {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate());
}

function atClock(day: Date, clock: Date) {
  return new Date(
    day.getFullYear(),
    day.getMonth(),
    day.getDate(),
    clock.getHours(),
    clock.getMinutes(),
    clock.getSeconds(),
    clock.getMilliseconds(),
  );
}

function calendarDayKey(date: Date) {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
}

function storedDateKey(date: Date) {
  return date.toISOString().slice(0, 10);
}

function themeSpanDays(period: EventThemePeriod) {
  const start = Date.parse(`${storedDateKey(period.startDate)}T00:00:00.000Z`);
  const end = Date.parse(`${storedDateKey(period.endDate)}T00:00:00.000Z`);
  return end - start;
}

function resolveOccurrenceTheme(day: Date, row: RecurringEventRow, locale: Locale) {
  const key = calendarDayKey(day);
  const matches = (row.themes ?? []).filter((period) => {
    const start = storedDateKey(period.startDate);
    const end = storedDateKey(period.endDate);
    return key >= start && key <= end;
  });

  if (matches.length > 0) {
    matches.sort((left, right) => {
      const bySpan = themeSpanDays(left) - themeSpanDays(right);
      if (bySpan !== 0) {
        return bySpan;
      }
      return storedDateKey(right.startDate).localeCompare(storedDateKey(left.startDate));
    });
    return localizedText(locale, matches[0].theme, matches[0].themeEn) || undefined;
  }

  const fallback = localizedText(locale, row.theme ?? "", row.themeEn);
  return fallback || undefined;
}

function daysInMonth(year: number, month: number) {
  return new Date(year, month, 0).getDate();
}

function eachDayOfMonth(year: number, month: number) {
  const days: Date[] = [];
  const last = daysInMonth(year, month);
  for (let day = 1; day <= last; day += 1) {
    days.push(new Date(year, month - 1, day));
  }
  return days;
}

/** 1er du mois, ou mardi 3/4 si le 1er tombe un dimanche / samedi. */
function first3DaysMonthStartDay(year: number, month: number) {
  const firstDay = new Date(year, month - 1, 1).getDay();
  if (firstDay === 6) {
    return 4;
  }
  if (firstDay === 0) {
    return 3;
  }
  return 1;
}

function first3DaysOfMonth(year: number, month: number, durationDays = 3) {
  const startDay = first3DaysMonthStartDay(year, month);
  const span = Math.min(31, Math.max(1, durationDays));
  return Array.from({ length: span }, (_, index) => startDay + index);
}

/** 2e et dernier vendredi du mois (veillée de prière). */
function secondAndLastFridays(year: number, month: number) {
  const fridays = eachDayOfMonth(year, month).filter((day) => day.getDay() === 5);
  if (fridays.length === 0) {
    return [];
  }
  const second = fridays[1] ?? fridays[0];
  const last = fridays[fridays.length - 1];
  if (second.getTime() === last.getTime()) {
    return [second];
  }
  return [second, last];
}

function occurrenceSpan(row: RecurringEventRow) {
  if (row.recurrenceType === "SECOND_AND_LAST_FRIDAY") {
    return 1;
  }
  const stored = row.durationDays ?? 1;
  if (row.recurrenceType === "FIRST_3_DAYS_MONTH" && stored <= 1) {
    return 3;
  }
  return Math.min(31, Math.max(1, stored));
}

function occurrenceEnd(start: Date, template: RecurringEventRow) {
  if (!template.endDate) {
    return null;
  }

  const sameDayEnd = atClock(start, template.endDate);
  if (sameDayEnd.getTime() > start.getTime()) {
    return sameDayEnd;
  }

  const nextDay = new Date(start);
  nextDay.setDate(nextDay.getDate() + 1);
  return atClock(nextDay, template.endDate);
}

function isWithinSeries(day: Date, template: RecurringEventRow) {
  const dayStart = startOfDay(day);
  const seriesStart = startOfDay(template.startDate);
  const seriesEnd = template.recurrenceEndDate
    ? startOfDay(template.recurrenceEndDate)
    : null;

  if (dayStart < seriesStart) {
    return false;
  }
  if (seriesEnd && dayStart > seriesEnd) {
    return false;
  }
  return true;
}

function isAnchorDay(day: Date, template: RecurringEventRow) {
  if (!isWithinSeries(day, template)) {
    return false;
  }

  if (template.recurrenceType === "DAILY") {
    return true;
  }

  if (template.recurrenceType === "WEEKLY") {
    const weekdays =
      template.daysOfWeek.length > 0
        ? template.daysOfWeek
        : [template.startDate.getDay()];
    return weekdays.includes(day.getDay());
  }

  if (template.recurrenceType === "MONTHLY") {
    return day.getDate() === template.startDate.getDate();
  }

  if (template.recurrenceType === "FIRST_3_DAYS_MONTH") {
    return day.getDate() === first3DaysMonthStartDay(day.getFullYear(), day.getMonth() + 1);
  }

  if (template.recurrenceType === "SECOND_AND_LAST_FRIDAY") {
    return secondAndLastFridays(day.getFullYear(), day.getMonth() + 1).some(
      (friday) => friday.getDate() === day.getDate(),
    );
  }

  return false;
}

function projectOneOff(row: RecurringEventRow, year: number, month: number, locale: Locale) {
  const start = startOfDay(row.startDate);
  const span = Math.max(1, Math.min(31, row.durationDays ?? 1));
  const end =
    span > 1
      ? new Date(start.getFullYear(), start.getMonth(), start.getDate() + span - 1)
      : row.endDate
        ? startOfDay(row.endDate)
        : start;

  if (Number.isNaN(start.getTime()) || Number.isNaN(end.getTime()) || end < start) {
    return [];
  }

  const items: ProjectedMonthlyEvent[] = [];
  for (const day of eachDayOfMonth(year, month)) {
    if (day < start || day > end || isExcludedCalendarDay(day, row.excludedDates ?? [])) {
      continue;
    }
    items.push(projectOccurrenceDay(row, day, locale));
  }

  return items;
}

function projectOccurrenceDay(row: RecurringEventRow, day: Date, locale: Locale): ProjectedMonthlyEvent {
  const occurrenceStart = atClock(day, row.startDate);
  return {
    id: `${row.id}-${day.getFullYear()}-${String(day.getMonth() + 1).padStart(2, "0")}-${String(day.getDate()).padStart(2, "0")}`,
    sourceId: row.id,
    title: row.title,
    description: row.description,
    startDate: occurrenceStart,
    endDate: occurrenceEnd(occurrenceStart, row),
    location: row.location,
    category: row.category,
    isSpecial: row.isSpecial,
    isExclusive: row.isExclusive ?? false,
    image: row.image,
    recurrenceType: row.recurrenceType ?? "NONE",
    theme: resolveOccurrenceTheme(day, row, locale),
    slug: row.slug ?? null,
  };
}

function projectRecurring(row: RecurringEventRow, year: number, month: number, locale: Locale) {
  const span = Math.min(31, occurrenceSpan(row));
  const rangeStart = new Date(year, month - 1, 1);
  const rangeEnd = new Date(year, month, 0);
  const seen = new Set<string>();
  const items: ProjectedMonthlyEvent[] = [];

  const lookback: Date[] = [];
  for (let offset = 1; offset < span && offset <= 31; offset += 1) {
    lookback.push(new Date(year, month - 1, 1 - offset));
  }

  const anchors = [...lookback, ...eachDayOfMonth(year, month)].filter((day) =>
    isAnchorDay(day, row),
  );

  for (const anchor of anchors) {
    const days =
      row.recurrenceType === "DAILY" || row.recurrenceType === "SECOND_AND_LAST_FRIDAY"
        ? [anchor]
        : Array.from({ length: span }, (_, index) => {
            const next = new Date(anchor);
            next.setDate(anchor.getDate() + index);
            return next;
          });

    for (const day of days) {
      if (
        day < rangeStart ||
        day > rangeEnd ||
        !isWithinSeries(day, row) ||
        isExcludedCalendarDay(day, row.excludedDates ?? [])
      ) {
        continue;
      }
      const key = `${day.getFullYear()}-${day.getMonth()}-${day.getDate()}`;
      if (seen.has(key)) {
        continue;
      }
      seen.add(key);
      items.push(projectOccurrenceDay(row, day, locale));
    }
  }

  return items;
}

/** Prochaine occurrence encore en cours ou à venir, avec les mêmes règles que le calendrier. */
export function nextRecurringOccurrence(
  row: RecurringEventRow,
  from: Date,
  locale: Locale,
): ProjectedMonthlyEvent | null {
  const span = Math.min(31, occurrenceSpan(row));
  const cursor = startOfDay(from);
  cursor.setDate(cursor.getDate() - (span - 1));
  const horizon = new Date(from);
  horizon.setDate(horizon.getDate() + 400);

  for (; cursor <= horizon; cursor.setDate(cursor.getDate() + 1)) {
    if (!isAnchorDay(cursor, row)) {
      continue;
    }
    const days =
      row.recurrenceType === "DAILY" || row.recurrenceType === "SECOND_AND_LAST_FRIDAY"
        ? [new Date(cursor)]
        : Array.from({ length: span }, (_, index) => {
            const next = new Date(cursor);
            next.setDate(cursor.getDate() + index);
            return next;
          });

    for (const day of days) {
      if (!isWithinSeries(day, row) || isExcludedCalendarDay(day, row.excludedDates ?? [])) {
        continue;
      }
      const start = atClock(day, row.startDate);
      const end = occurrenceEnd(start, row);
      if ((end ?? start).getTime() < from.getTime()) {
        continue;
      }
      return projectOccurrenceDay(row, day, locale);
    }
  }

  return null;
}

function dayKey(date: Date) {
  return `${date.getFullYear()}-${date.getMonth()}-${date.getDate()}`;
}

function isVigilEvent(event: ProjectedMonthlyEvent) {
  if (event.recurrenceType === "SECOND_AND_LAST_FRIDAY") {
    return true;
  }
  if (event.category === "VIGIL") {
    return true;
  }
  return /veill[eé]e/i.test(event.title);
}

function isPriorityEvent(event: ProjectedMonthlyEvent) {
  return event.isExclusive || isVigilEvent(event);
}

function applyVigilDisplayPriority(events: ProjectedMonthlyEvent[]) {
  const byDay = new Map<string, ProjectedMonthlyEvent[]>();
  for (const event of events) {
    const key = dayKey(event.startDate);
    const bucket = byDay.get(key);
    if (bucket) {
      bucket.push(event);
    } else {
      byDay.set(key, [event]);
    }
  }

  const result: ProjectedMonthlyEvent[] = [];
  for (const dayEvents of byDay.values()) {
    const hasPriority = dayEvents.some(isPriorityEvent);
    if (!hasPriority) {
      result.push(...dayEvents);
      continue;
    }
    result.push(
      ...dayEvents.filter(
        (event) => isPriorityEvent(event) || event.recurrenceType === "NONE",
      ),
    );
  }
  return result;
}

export async function getMonthlyEvents(
  year: number,
  month: number,
  localeOverride?: Locale,
): Promise<ProjectedMonthlyEvent[]> {
  if (month < 1 || month > 12) {
    throw new RangeError("month must be between 1 and 12");
  }

  const rangeStart = new Date(year, month - 1, 1);
  const rangeEnd = new Date(year, month, 1);

  try {
    const rows = await prisma.event.findMany({
      select: {
        id: true,
        title: true,
        titleEn: true,
        description: true,
        descriptionEn: true,
        startDate: true,
        endDate: true,
        location: true,
        locationEn: true,
        category: true,
        isSpecial: true,
        isExclusive: true,
        image: true,
        slug: true,
        recurrenceType: true,
        daysOfWeek: true,
        recurrenceEndDate: true,
        durationDays: true,
        excludedDates: true,
        theme: true,
        themeEn: true,
        themes: {
          select: { startDate: true, endDate: true, theme: true, themeEn: true },
        },
      },
      where: {
        OR: [
          {
            AND: [
              { recurrenceType: "NONE" },
              {
                OR: [
                  { startDate: { gte: rangeStart, lt: rangeEnd } },
                  {
                    AND: [
                      { startDate: { lt: rangeEnd } },
                      { endDate: { gte: rangeStart } },
                    ],
                  },
                ],
              },
            ],
          },
          {
            AND: [
              { recurrenceType: { not: "NONE" } },
              { startDate: { lt: rangeEnd } },
              {
                OR: [
                  { recurrenceEndDate: null },
                  { recurrenceEndDate: { gte: rangeStart } },
                ],
              },
            ],
          },
        ],
      },
      orderBy: { startDate: "asc" },
    });

    const locale = localeOverride ?? (await getRequestLocale());
    const localizedRows = rows.map((row) => ({
      ...row,
      title: localizedText(locale, row.title, row.titleEn),
      description: localizedText(locale, row.description, row.descriptionEn),
      location: localizedText(locale, row.location, row.locationEn),
    }));

    const projected = localizedRows.flatMap((row) => {
      const typed = row as RecurringEventRow;
      if (typed.recurrenceType && typed.recurrenceType !== "NONE") {
        return projectRecurring(typed, year, month, locale);
      }
      return projectOneOff(typed, year, month, locale);
    });

    return applyVigilDisplayPriority(projected).sort(
      (a, b) => a.startDate.getTime() - b.startDate.getTime(),
    );
  } catch {
    return [];
  }
}
