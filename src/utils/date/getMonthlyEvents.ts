import type { CalendarEventPayload, MonthlyGeneratedEvent, MonthlyEventType } from "@/types";
import { parseIsoDate, toDateKey } from "@/utils/date/format";

export const monthlyEventTypeLabels: Record<MonthlyEventType, string> = {
  prayer: "Prière",
  testimony: "Témoignages",
  vigil: "Veillée",
  fasting: "Jeûne",
  special: "Temps fort",
};

export function hydrateCalendarEvents(
  payloads: CalendarEventPayload[],
): MonthlyGeneratedEvent[] {
  return payloads.map((item) => ({
    id: item.id,
    title: item.title,
    date: parseIsoDate(item.dateKey),
    time: item.time,
    timeEnd: item.timeEnd,
    type: item.type,
    colorToken: item.colorToken,
    location: item.location,
    kind: item.kind,
    imageUrl: item.imageUrl,
  }));
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
