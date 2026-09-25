"use server";

import { getMonthlyEvents } from "@/lib/publicContent";
import type { CalendarEventPayload } from "@/types";

export async function loadCalendarMonth(
  year: number,
  month: number,
): Promise<CalendarEventPayload[]> {
  return getMonthlyEvents(year, month);
}
