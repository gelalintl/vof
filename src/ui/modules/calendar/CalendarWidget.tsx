"use client";

import { useMemo, useState } from "react";
import { ChevronLeft, ChevronRight, Clock, MapPin } from "lucide-react";
import { loadCalendarMonth } from "@/app/calendar-actions";
import { eventKindLabels } from "@/lib/eventPresentation";
import type { CalendarEventPayload, EventColorToken, MonthlyGeneratedEvent } from "@/types";
import { cn } from "@/utils/cn";
import { formatEventDate, toDateKey } from "@/utils/date/format";
import {
  calendarAccentToken,
  calendarDotClass,
  formatMonthTitle,
  getCalendarMonthCells,
  hydrateCalendarEvents,
  monthlyEventTypeLabels,
  shiftCalendarMonth,
} from "@/utils/date/getMonthlyEvents";
import { Badge } from "@/ui/design-system/badge";
import { Typography } from "@/ui/design-system/typography";

const WEEKDAYS = ["Lun", "Mar", "Mer", "Jeu", "Ven", "Sam", "Dim"];

const tokenSoft: Record<EventColorToken, string> = {
  brand: "border-violet-700 bg-violet-50",
  secondary: "border-sky-600 bg-sky-50",
  accent: "border-amber-500 bg-amber-50",
  impact: "border-red-600 bg-red-50",
};

const badgeVariant: Record<EventColorToken, "brand" | "secondary" | "accent" | "impact"> = {
  brand: "brand",
  secondary: "secondary",
  accent: "accent",
  impact: "impact",
};

interface CalendarWidgetProps {
  initialYear: number;
  initialMonth: number;
  initialEvents: CalendarEventPayload[];
}

export function CalendarWidget({
  initialYear,
  initialMonth,
  initialEvents,
}: CalendarWidgetProps) {
  const todayKey = toDateKey(new Date());
  const [year, setYear] = useState(initialYear);
  const [month, setMonth] = useState(initialMonth);
  const [payloads, setPayloads] = useState(initialEvents);
  const [loading, setLoading] = useState(false);
  const [selectedKey, setSelectedKey] = useState<string | null>(todayKey);

  const allEvents = useMemo(
    () => hydrateCalendarEvents(payloads),
    [payloads],
  );

  const cells = useMemo(() => getCalendarMonthCells(year, month), [year, month]);
  const monthLabel = formatMonthTitle(year, month);

  const eventByDay = useMemo(() => {
    const map = new Map<string, MonthlyGeneratedEvent>();
    for (const event of allEvents) {
      map.set(toDateKey(event.date), event);
    }
    return map;
  }, [allEvents]);

  const fastingCaption = fastingCaptionFromEvents(allEvents);
  const selectedEvent = selectedKey ? eventByDay.get(selectedKey) : undefined;
  const upcoming = allEvents
    .filter((event) => toDateKey(event.date) >= todayKey)
    .slice(0, 6);

  async function goToMonth(delta: number) {
    const next = shiftCalendarMonth(year, month, delta);
    setYear(next.year);
    setMonth(next.month);
    setLoading(true);
    try {
      const nextEvents = await loadCalendarMonth(next.year, next.month);
      setPayloads(nextEvents);
    } finally {
      setLoading(false);
    }
  }

  const listedEvents = selectedEvent ? [selectedEvent] : upcoming;

  return (
    <section className="bg-slate-50" aria-labelledby="agenda-vof">
      <div className="mx-auto grid max-w-6xl gap-8 px-4 py-14 sm:px-6 lg:grid-cols-[1.1fr_0.9fr]">
        <div>
          <Badge variant="secondary">Agenda</Badge>
          <Typography id="agenda-vof" variant="h2" className="mt-3">
            Calendrier de l&apos;église
          </Typography>
          <Typography variant="body" className="mt-3 text-slate-600">
            Les rendez-vous du mois, lus depuis l&apos;agenda de l&apos;église.
          </Typography>

          <div className="mt-6 rounded-3xl bg-white p-4 shadow-sm ring-1 ring-violet-100 sm:p-6">
            <div className="mb-4 flex items-center justify-between">
              <button
                type="button"
                onClick={() => goToMonth(-1)}
                className="rounded-full p-2 text-violet-700 hover:bg-violet-50"
                aria-label="Mois précédent"
              >
                <ChevronLeft className="size-5" />
              </button>
              <p className="font-heading text-base font-bold capitalize tracking-tight text-slate-800">
                {monthLabel}
              </p>
              <button
                type="button"
                onClick={() => goToMonth(1)}
                className="rounded-full p-2 text-violet-700 hover:bg-violet-50"
                aria-label="Mois suivant"
              >
                <ChevronRight className="size-5" />
              </button>
            </div>
            {fastingCaption ? (
              <p className="mb-4 text-center font-sans text-xs text-slate-600">
                {fastingCaption}
              </p>
            ) : null}

            <div className="grid grid-cols-7 gap-1 text-center">
              {WEEKDAYS.map((day) => (
                <span
                  key={day}
                  className="py-2 font-heading text-[11px] font-bold uppercase tracking-wide text-sky-600"
                >
                  {day}
                </span>
              ))}
              {cells.map((cell, index) => {
                if (!cell) {
                  return <span key={`pad-${index}`} className="h-11" />;
                }
                const event = eventByDay.get(cell.dateKey);
                const isSelected = selectedKey === cell.dateKey;
                const isToday = cell.dateKey === todayKey;

                return (
                  <button
                    key={cell.dateKey}
                    type="button"
                    onClick={() => setSelectedKey(cell.dateKey)}
                    className={cn(
                      "flex h-11 flex-col items-center justify-center rounded-lg font-sans text-sm",
                      isSelected
                        ? "font-bold text-violet-700"
                        : isToday
                          ? "font-semibold text-slate-800"
                          : "text-slate-800 hover:bg-slate-50",
                    )}
                  >
                    {cell.day}
                    {event ? (
                      <span
                        className={cn(
                          "mt-0.5 h-1.5 w-1.5 rounded-full",
                          calendarDotClass(event),
                        )}
                      />
                    ) : (
                      <span className="mt-0.5 h-1.5 w-1.5" />
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <Typography variant="h3">
            {selectedEvent && selectedKey
              ? formatEventDate(selectedKey)
              : "Prochains rendez-vous"}
          </Typography>

          {loading ? (
            <p className="font-sans text-sm text-slate-500">Chargement de l&apos;agenda…</p>
          ) : listedEvents.length === 0 ? (
            <p className="font-sans text-sm text-slate-500">
              Aucun rendez-vous enregistré pour cette période.
            </p>
          ) : (
            listedEvents.map((event) => {
              const accent = calendarAccentToken(event);
              return (
                <article
                  key={event.id}
                  className={cn(
                    "overflow-hidden rounded-2xl border-l-4 bg-white shadow-sm",
                    tokenSoft[accent],
                  )}
                >
                  {event.imageUrl ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={event.imageUrl}
                      alt={event.title}
                      className="h-32 w-full object-cover"
                    />
                  ) : null}
                  <div className="p-4">
                    <Badge variant={badgeVariant[accent]} size="sm">
                      {event.type === "special" && event.kind
                        ? eventKindLabels[event.kind]
                        : monthlyEventTypeLabels[event.type]}
                    </Badge>
                    <Typography variant="h4" className="mt-2">
                      {event.title}
                    </Typography>
                    <p className="mt-1 flex items-center gap-2 font-sans text-sm text-slate-600">
                      <Clock className="size-4 text-sky-600" />
                      {formatEventDate(event.date)}
                      {` · ${event.time}`}
                      {event.timeEnd ? ` – ${event.timeEnd}` : ""}
                    </p>
                    <p className="mt-1 flex items-center gap-2 font-sans text-sm text-slate-600">
                      <MapPin className="size-4 text-sky-600" />
                      {event.location}
                    </p>
                  </div>
                </article>
              );
            })
          )}
        </div>
      </div>
    </section>
  );
}

function fastingCaptionFromEvents(events: MonthlyGeneratedEvent[]) {
  const fasting = events.filter((event) => event.type === "fasting");
  if (fasting.length === 0) {
    return null;
  }
  const days = fasting.map((event) => event.date.getDate());
  const postponed = days[0] !== 1;
  const range = days.join(", ");
  return postponed
    ? `Jeûne reporté au mardi : ${range}`
    : `Jeûne et prière : ${range}`;
}
