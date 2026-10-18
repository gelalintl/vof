"use server";

import type { Locale } from "@/i18n/config";
import { getMonthlyEvents } from "@/lib/publicContent";
import type { CalendarEventPayload } from "@/types";

export async function loadCalendarMonth(
  year: number,
  month: number,
  locale?: Locale,
): Promise<CalendarEventPayload[]> {
  return getMonthlyEvents(year, month, locale);
}
