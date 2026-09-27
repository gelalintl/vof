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
import { interactiveCardClass } from "@/utils/theme/interactiveCard";

const WEEKDAYS = ["Lun", "Mar", "Mer", "Jeu", "Ven", "Sam", "Dim"];

const tokenSoft: Record<EventColorToken, string> = {
  brand: "border-l-violet-700",
  secondary: "border-l-sky-600",
  accent: "border-l-amber-500",
  impact: "border-l-red-600",
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
    () =>
      hydrateCalendarEvents(payloads).sort((left, right) => {
        const byDate = left.date.getTime() - right.date.getTime();
        if (byDate !== 0) {
          return byDate;
        }
        return left.time.localeCompare(right.time);
      }),
    [payloads],
  );

  const cells = useMemo(() => getCalendarMonthCells(year, month), [year, month]);
  const monthLabel = formatMonthTitle(year, month);

  const eventsByDay = useMemo(() => {
    const map = new Map<string, MonthlyGeneratedEvent[]>();
    for (const event of allEvents) {
      const key = toDateKey(event.date);
      const bucket = map.get(key);
      if (bucket) {
        bucket.push(event);
      } else {
        map.set(key, [event]);
      }
    }
    for (const bucket of map.values()) {
      bucket.sort((left, right) => left.time.localeCompare(right.time));
    }
    return map;
  }, [allEvents]);

  const fastingCaption = fastingCaptionFromEvents(allEvents);
  const selectedEvents = selectedKey ? (eventsByDay.get(selectedKey) ?? []) : [];
  const upcoming = allEvents
    .filter((event) => toDateKey(event.date) >= todayKey)
    .slice(0, 6);

  async function goToMonth(delta: number) {
    const next = shiftCalendarMonth(year, month, delta);
    setYear(next.year);
    setMonth(next.month);
    setSelectedKey((current) => {
      if (current) {
        const [selectedYear, selectedMonth] = current.split("-").map(Number);
        if (selectedYear === next.year && selectedMonth === next.month) {
          return current;
        }
      }
      return `${next.year}-${String(next.month).padStart(2, "0")}-01`;
    });
    setLoading(true);
    try {
      const nextEvents = await loadCalendarMonth(next.year, next.month);
      setPayloads(nextEvents);
    } finally {
      setLoading(false);
    }
  }

  const listedEvents = selectedKey ? selectedEvents : upcoming;
  const listingADay = Boolean(selectedKey);

  return (
    <section className="bg-slate-50" aria-labelledby="agenda-vof">
      <div className="mx-auto grid max-w-6xl gap-8 px-4 py-14 sm:px-6 lg:grid-cols-[1.1fr_0.9fr]">
        <div>
          <Badge variant="secondary">Agenda</Badge>
          <Typography id="agenda-vof" variant="h2" className="mt-3">
            Calendrier &amp; agenda mensuel
          </Typography>
          <Typography variant="body" className="mt-3 text-slate-600">
            Sélectionnez un jour pour voir tous les rendez-vous, dans l’ordre horaire.
          </Typography>

          <div className="mt-6 rounded-3xl border border-slate-200 bg-white p-4 shadow-sm sm:p-6">
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

            <div className="mx-auto grid w-full max-w-sm grid-cols-7 place-items-center gap-1 sm:max-w-md sm:gap-1.5">
              {WEEKDAYS.map((day) => (
                <span
                  key={day}
                  className="py-1 font-heading text-[11px] font-bold uppercase tracking-wide text-sky-600"
                >
                  {day}
                </span>
              ))}
              {cells.map((cell, index) => {
                if (!cell) {
                  return (
                    <span
                      key={`pad-${index}`}
                      className="h-10 w-10 sm:h-12 sm:w-12"
                    />
                  );
                }
                const dayEvents = eventsByDay.get(cell.dateKey) ?? [];
                const isSelected = selectedKey === cell.dateKey;
                const isToday = cell.dateKey === todayKey;

                return (
                  <button
                    key={cell.dateKey}
                    type="button"
                    onClick={() => setSelectedKey(cell.dateKey)}
                    aria-label={
                      dayEvents.length > 0
                        ? `${cell.day} : ${dayEvents.length} rendez-vous`
                        : `${cell.day}`
                    }
                    className={cn(
                      "mx-auto flex aspect-square h-10 w-10 flex-col items-center justify-center rounded-xl font-sans text-sm sm:h-12 sm:w-12",
                      isSelected
                        ? "bg-violet-50 font-bold text-violet-700 ring-2 ring-violet-700"
                        : isToday
                          ? "font-semibold text-slate-800 ring-1 ring-sky-600"
                          : "text-slate-800 hover:bg-slate-50",
                    )}
                  >
                    <span>{cell.day}</span>
                    {dayEvents.length > 0 ? (
                      <span className="mt-0.5 flex items-center justify-center gap-0.5">
                        {dayEvents.slice(0, 3).map((event) => (
                          <span
                            key={event.id}
                            className={cn("h-1 w-1 rounded-full", calendarDotClass(event))}
                          />
                        ))}
                      </span>
                    ) : (
                      <span className="mt-0.5 h-1 w-1" />
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        <div className="space-y-4 overflow-visible">
          <Typography variant="h3">
            {listingADay && selectedKey
              ? formatEventDate(selectedKey)
              : "Prochains rendez-vous"}
          </Typography>
          {listingADay && selectedEvents.length > 1 ? (
            <p className="font-sans text-sm text-slate-500">
              {selectedEvents.length} rendez-vous ce jour, par ordre horaire
            </p>
          ) : null}

          {loading ? (
            <p className="font-sans text-sm text-slate-500">Chargement de l&apos;agenda…</p>
          ) : listedEvents.length === 0 ? (
            <p className="font-sans text-sm text-slate-500">
              {listingADay
                ? "Aucun rendez-vous enregistré pour cette journée."
                : "Aucun rendez-vous enregistré pour cette période."}
            </p>
          ) : (
            listedEvents.map((event) => {
              const accent = calendarAccentToken(event);
              return (
                <article
                  key={event.id}
                  className={cn(
                    interactiveCardClass,
                    "overflow-hidden rounded-2xl border-l-4",
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
