import type { Event } from "@/types";
import { parseIsoDate, toDateKey } from "@/utils/date/format";
import { generateMonthlyEvents } from "@/utils/date/getMonthlyEvents";

function startOfDay(date: Date) {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate());
}

function addDays(date: Date, days: number) {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate() + days);
}

export function toLocalIso(date: Date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  const hours = String(date.getHours()).padStart(2, "0");
  const minutes = String(date.getMinutes()).padStart(2, "0");
  return `${year}-${month}-${day}T${hours}:${minutes}:00`;
}

function monthsInRange(start: Date, end: Date) {
  const months: { year: number; month: number }[] = [];
  const seen = new Set<string>();

  for (let cursor = new Date(start); cursor <= end; cursor = addDays(cursor, 1)) {
    const stamp = `${cursor.getFullYear()}-${cursor.getMonth() + 1}`;
    if (seen.has(stamp)) {
      continue;
    }
    seen.add(stamp);
    months.push({ year: cursor.getFullYear(), month: cursor.getMonth() + 1 });
  }

  return months;
}

/**
 * Combine les événements ponctuels d'un catalogue avec les récurrents
 * produits par `generateMonthlyEvents` (source unique des règles métier).
 */
export function expandEventsInRange(
  events: Event[],
  rangeStart: Date,
  rangeEnd: Date,
): Event[] {
  const start = startOfDay(rangeStart);
  const end = startOfDay(rangeEnd);
  const startKey = toDateKey(start);
  const endKey = toDateKey(end);
  const expanded: Event[] = [];

  for (const event of events) {
    if (event.recurrence) {
      continue;
    }
    const day = startOfDay(parseIsoDate(event.startsAt));
    if (day >= start && day <= end) {
      expanded.push(event);
    }
  }

  for (const { year, month } of monthsInRange(start, end)) {
    for (const item of generateMonthlyEvents(year, month)) {
      if (toDateKey(item.date) < startKey || toDateKey(item.date) > endKey) {
        continue;
      }
      const dateKey = toDateKey(item.date);
      const startClock = item.time.replace("h", ":");
      const timeEnd = item.timeEnd;
      expanded.push({
        id: item.id,
        slug: item.id,
        title: item.title,
        description: item.title,
        startsAt: `${dateKey}T${startClock}:00`,
        endsAt: timeEnd
          ? `${toDateKey(addDays(item.date, 1))}T${timeEnd.replace("h", ":")}:00`
          : undefined,
        location: item.location,
        kind: "priere",
        colorToken: item.colorToken,
      });
    }
  }

  return expanded.sort((a, b) => a.startsAt.localeCompare(b.startsAt));
}
