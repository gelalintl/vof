import type { AdminEventRecord, AdminRecurrenceType } from "@/types";

export const RECURRENCE_SHORT_LABELS: Record<AdminRecurrenceType, string> = {
  NONE: "Ponctuel",
  DAILY: "Quotidien",
  WEEKLY: "Hebdomadaire",
  MONTHLY: "Mensuel",
  FIRST_3_DAYS_MONTH: "3 premiers jours du mois",
  SECOND_AND_LAST_FRIDAY: "2e et dernier vendredi",
};

export const RECURRENCE_ADMIN_LABELS: Record<AdminRecurrenceType, string> = {
  NONE: "Ponctuel",
  DAILY: "Quotidien",
  WEEKLY: "Hebdomadaire",
  MONTHLY: "Mensuel",
  FIRST_3_DAYS_MONTH: "Jeûne & Prière (3 premiers jours, ajusté si weekend)",
  SECOND_AND_LAST_FRIDAY: "Veillée de prière (2e et dernier vendredi)",
};

export function isRecurringEvent(
  event: Pick<AdminEventRecord, "recurrenceType">,
) {
  return event.recurrenceType !== "NONE";
}

export function recurrenceBadgeLabel(type: AdminRecurrenceType) {
  return `Récurrence : ${RECURRENCE_SHORT_LABELS[type]}`;
}

export function eventAdminStatus(event: AdminEventRecord) {
  const now = Date.now();
  if (isRecurringEvent(event)) {
    if (event.recurrenceEndDate && new Date(event.recurrenceEndDate).getTime() < now) {
      return "Terminé";
    }
    return "Actif";
  }
  return new Date(event.startDate).getTime() >= now ? "À venir" : "Terminé";
}

export function slugifyEventTitle(value: string) {
  const slug = value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
  return slug || "evenement";
}

export function parseExcludedDateList(raw: string) {
  return [
    ...new Set(
      raw
        .split(/[\s,;]+/)
        .map((value) => value.trim())
        .filter((value) => /^\d{4}-\d{2}-\d{2}$/.test(value)),
    ),
  ].sort();
}

export function isExcludedCalendarDay(day: Date, excludedDates: string[]) {
  const key = `${day.getFullYear()}-${String(day.getMonth() + 1).padStart(2, "0")}-${String(day.getDate()).padStart(2, "0")}`;
  return excludedDates.includes(key);
}
