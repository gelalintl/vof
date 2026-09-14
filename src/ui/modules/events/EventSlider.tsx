"use client";

import { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import type { Event } from "@/types";
import { eventKindLabels } from "@/datas/events";
import { cn } from "@/utils/cn";
import { formatEventDate, formatEventTime } from "@/utils/date/format";
import { eventColorStyles } from "@/utils/theme/eventColors";
import { Badge } from "@/ui/design-system/badge";
import { Button } from "@/ui/design-system/button";
import { MediaCover } from "@/ui/components/MediaCover";

interface EventSliderProps {
  events: Event[];
}

export function EventSlider({ events }: EventSliderProps) {
  const [index, setIndex] = useState(0);
  const slides = events.length > 0 ? events : [];
  const current = slides[index];

  if (!current) {
    return null;
  }

  const colors = eventColorStyles[current.colorToken];
  const go = (direction: -1 | 1) => {
    setIndex((value) => (value + direction + slides.length) % slides.length);
  };

  return (
    <section className="bg-slate-50" aria-roledescription="carousel" aria-label="Annonces principales">
      <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
        <div className="relative overflow-hidden rounded-3xl bg-slate-900 shadow-lg">
          <div
            className="flex transition-transform duration-300 ease-out"
            style={{ transform: `translateX(-${index * 100}%)` }}
          >
            {slides.map((event) => (
              <article key={event.id} className="relative w-full shrink-0">
                <MediaCover
                  alt={event.title}
                  src={event.imageUrl}
                  colorToken={event.colorToken}
                  rounded="rounded-none"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/85 via-slate-950/25 to-transparent" />
                <div className="absolute inset-x-0 bottom-0 p-5 sm:p-8">
                  <Badge variant={eventColorStyles[event.colorToken].badge}>
                    {eventKindLabels[event.kind]}
                  </Badge>
                  <h2 className="mt-3 max-w-xl font-heading text-2xl font-extrabold tracking-tight text-white sm:text-3xl">
                    {event.title}
                  </h2>
                  <p className="mt-2 max-w-xl font-sans text-sm text-white/85 sm:text-base">
                    {formatEventDate(event.startsAt)}
                    {formatEventTime(event.startsAt)
                      ? ` · ${formatEventTime(event.startsAt)}`
                      : ""}
                    {" · "}
                    {event.location}
                  </p>
                  <Button
                    href={`/vie-de-leglise/${event.slug}`}
                    variant="accent"
                    size="sm"
                    className="mt-4"
                  >
                    Voir l&apos;annonce
                  </Button>
                </div>
              </article>
            ))}
          </div>

          {slides.length > 1 ? (
            <>
              <button
                type="button"
                onClick={() => go(-1)}
                className="absolute left-3 top-1/2 z-10 flex size-10 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 text-violet-700 shadow sm:left-4"
                aria-label="Annonce précédente"
              >
                <ChevronLeft className="size-5" />
              </button>
              <button
                type="button"
                onClick={() => go(1)}
                className="absolute right-3 top-1/2 z-10 flex size-10 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 text-violet-700 shadow sm:right-4"
                aria-label="Annonce suivante"
              >
                <ChevronRight className="size-5" />
              </button>
            </>
          ) : null}
        </div>

        <div className="mt-4 flex justify-center gap-2">
          {slides.map((event, slideIndex) => (
            <button
              key={event.id}
              type="button"
              aria-label={`Aller à ${event.title}`}
              aria-current={slideIndex === index}
              onClick={() => setIndex(slideIndex)}
              className={cn(
                "h-2.5 rounded-full transition-all",
                slideIndex === index ? `w-8 ${colors.solid}` : "w-2.5 bg-slate-300",
              )}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
