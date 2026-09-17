import type { MonthlyGeneratedEvent, MonthlyEventType } from "@/types";
import { siteConfig } from "@/config/site";
import { parseIsoDate, toDateKey } from "@/utils/date/format";
import { getMonthlyFastingDates } from "@/utils/date/getMonthlyFastingDates";

export const monthlyEventTypeLabels: Record<MonthlyEventType, string> = {
  prayer: "Prière",
  testimony: "Témoignages",
  vigil: "Veillée",
  fasting: "Jeûne",
  special: "Temps fort",
};

const LOCATION = `${siteConfig.location.address}, ${siteConfig.location.country}`;

const WEEKLY_PRAYER = {
  title: "Etude biblique",
  weekday: 2,
  time: "19h00",
  type: "prayer" as const,
  colorToken: "brand" as const,
};

const WEEKLY_TESTIMONY = {
  title: "Prière et témoignages",
  weekday: 4,
  time: "19h00",
  type: "testimony" as const,
  colorToken: "accent" as const,
};

/**
 * Génère tous les événements récurrents d'un mois (1 = janvier … 12 = décembre).
 * Le jeûne à 19h00 remplace l'etude biblique (mardi) ou de
 * prière et témoignages (jeudi) lorsqu'ils tombent le même jour.
 */
export function generateMonthlyEvents(
  year: number,
  month: number,
): MonthlyGeneratedEvent[] {
  if (month < 1 || month > 12) {
    throw new RangeError("month must be between 1 and 12");
  }

  const fastingDates = getMonthlyFastingDates(year, month).map(toDateKey);
  const fastingKeys = new Set(fastingDates);

  const fasting: MonthlyGeneratedEvent[] = fastingDates.map((date, index) =>
    buildEvent({
      type: "fasting",
      title: "Jeûne et prière",
      date,
      time: "19h00",
      colorToken: "impact",
      suffix: String(index + 1),
    }),
  );

  const prayers = datesForWeekday(year, month, WEEKLY_PRAYER.weekday)
    .filter((date) => !fastingKeys.has(date))
    .map((date) =>
      buildEvent({
        type: WEEKLY_PRAYER.type,
        title: WEEKLY_PRAYER.title,
        date,
        time: WEEKLY_PRAYER.time,
        colorToken: WEEKLY_PRAYER.colorToken,
      }),
    );

  const testimonies = datesForWeekday(year, month, WEEKLY_TESTIMONY.weekday)
    .filter((date) => !fastingKeys.has(date))
    .map((date) =>
      buildEvent({
        type: WEEKLY_TESTIMONY.type,
        title: WEEKLY_TESTIMONY.title,
        date,
        time: WEEKLY_TESTIMONY.time,
        colorToken: WEEKLY_TESTIMONY.colorToken,
      }),
    );

  const vigils = secondAndLastWeekdays(year, month, 5).map((date) =>
    buildEvent({
      type: "vigil",
      title: "Veillée de prière",
      date,
      time: "23h00",
      timeEnd: "05h00",
      colorToken: "impact",
    }),
  );

  return [...fasting, ...prayers, ...testimonies, ...vigils].sort((a, b) => {
    const byDate = a.date.getTime() - b.date.getTime();
    if (byDate !== 0) {
      return byDate;
    }
    return a.time.localeCompare(b.time);
  });
}

/**
 * Un seul événement par jour : spécial > jeûne > hebdo / veillée.
 */
export function mergeCalendarEvents(
  routineEvents: MonthlyGeneratedEvent[],
  specificEvents: MonthlyGeneratedEvent[],
): MonthlyGeneratedEvent[] {
  const byDay = new Map<string, MonthlyGeneratedEvent>();

  for (const event of [...routineEvents, ...specificEvents]) {
    const key = toDateKey(event.date);
    const current = byDay.get(key);
    if (!current || precedesEvent(event, current)) {
      byDay.set(key, event);
    }
  }

  return [...byDay.values()].sort((a, b) => {
    const byDate = a.date.getTime() - b.date.getTime();
    if (byDate !== 0) {
      return byDate;
    }
    return a.time.localeCompare(b.time);
  });
}

function eventPriority(event: MonthlyGeneratedEvent) {
  if (event.type === "special") {
    return 1;
  }
  if (event.type === "fasting") {
    return 2;
  }
  return 3;
}

function precedesEvent(candidate: MonthlyGeneratedEvent, current: MonthlyGeneratedEvent) {
  const nextPriority = eventPriority(candidate);
  const currentPriority = eventPriority(current);
  if (nextPriority !== currentPriority) {
    return nextPriority < currentPriority;
  }
  return candidate.time.localeCompare(current.time) < 0;
}

export function calendarDotClass(event: MonthlyGeneratedEvent) {
  if (event.type === "vigil") {
    return "bg-sky-600";
  }
  if (event.type === "fasting" || event.kind === "enseignement") {
    return "bg-violet-700";
  }
  if (event.type === "special") {
    return event.colorToken === "accent" ? "bg-amber-500" : "bg-red-600";
  }
  return "bg-violet-700";
}

export function calendarAccentToken(
  event: MonthlyGeneratedEvent,
): MonthlyGeneratedEvent["colorToken"] {
  if (event.type === "vigil") {
    return "secondary";
  }
  if (event.type === "fasting" || event.kind === "enseignement") {
    return "brand";
  }
  if (event.type === "special") {
    return event.colorToken === "accent" ? "accent" : "impact";
  }
  return "brand";
}

export function getCalendarMonthCells(year: number, month: number) {
  const firstWeekday = (new Date(year, month - 1, 1).getDay() + 6) % 7;
  const daysInMonth = new Date(year, month, 0).getDate();
  const cells: ({ dateKey: string; day: number } | null)[] = Array.from(
    { length: firstWeekday },
    () => null,
  );

  for (let day = 1; day <= daysInMonth; day += 1) {
    cells.push({ dateKey: toDateKey(new Date(year, month - 1, day)), day });
  }

  return cells;
}

export function shiftCalendarMonth(year: number, month: number, delta: number) {
  const next = new Date(year, month - 1 + delta, 1);
  return { year: next.getFullYear(), month: next.getMonth() + 1 };
}

export function formatMonthTitle(year: number, month: number) {
  return new Intl.DateTimeFormat("fr-FR", {
    month: "long",
    year: "numeric",
  }).format(new Date(year, month - 1, 1));
}

function buildEvent(input: {
  type: MonthlyEventType;
  title: string;
  date: string;
  time: string;
  timeEnd?: string;
  colorToken: MonthlyGeneratedEvent["colorToken"];
  suffix?: string;
}): MonthlyGeneratedEvent {
  return {
    id: `${input.type}-${input.date}${input.suffix ? `-${input.suffix}` : ""}`,
    title: input.title,
    date: parseIsoDate(input.date),
    time: input.time,
    timeEnd: input.timeEnd,
    type: input.type,
    colorToken: input.colorToken,
    location: LOCATION,
    kind: "priere",
  };
}

function datesForWeekday(year: number, month: number, weekday: number) {
  const dates: string[] = [];
  const daysInMonth = new Date(year, month, 0).getDate();

  for (let day = 1; day <= daysInMonth; day += 1) {
    const date = new Date(year, month - 1, day);
    if (date.getDay() === weekday) {
      dates.push(toDateKey(date));
    }
  }

  return dates;
}

function secondAndLastWeekdays(year: number, month: number, weekday: number) {
  const dates = datesForWeekday(year, month, weekday);
  const second = dates[1];
  const last = dates[dates.length - 1];
  if (!second || !last) {
    return [];
  }
  if (second === last) {
    return [last];
  }
  return [second, last];
}
