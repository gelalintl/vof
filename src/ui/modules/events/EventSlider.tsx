"use client";

import { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import type { ContentSectionTone, Event, EventKind } from "@/types";
import { ContentSection } from "@/ui/components/layout/ContentSection";
import { SectionHeader } from "@/ui/components/layout/SectionHeader";
import type { Locale } from "@/i18n/config";
import { formatMessage } from "@/i18n/getDictionary";
import { cn } from "@/utils/cn";
import { formatEventDate, formatEventTime } from "@/utils/date/format";
import { eventColorStyles } from "@/utils/theme/eventColors";
import { Badge } from "@/ui/design-system/badge";
import { Button } from "@/ui/design-system/button";
import { MediaCover } from "@/ui/components/media/MediaCover";

interface EventSliderProps {
  events: Event[];
  tone?: ContentSectionTone;
  locale?: Locale;
  labels: {
    badge: string;
    title: string;
    description: string;
    seeAnnouncement: string;
    carouselLabel: string;
    previous: string;
    next: string;
    goTo: string;
    kinds: Record<EventKind, string>;
  };
}

export function EventSlider({
  events,
  tone = "muted",
  locale = "fr",
  labels,
}: EventSliderProps) {
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
    <ContentSection tone={tone} labelledBy="evenements-a-venir">
      <SectionHeader
        titleId="evenements-a-venir"
        badge={labels.badge}
        title={labels.title}
        description={labels.description}
      />
      <div aria-roledescription="carousel" aria-label={labels.carouselLabel}>
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
                    {labels.kinds[event.kind]}
                  </Badge>
                  <h3 className="mt-3 max-w-xl font-heading text-2xl font-extrabold tracking-tight text-white sm:text-3xl">
                    {event.title}
                  </h3>
                  <p className="mt-2 max-w-xl font-sans text-sm text-white/85 sm:text-base">
                    {formatEventDate(event.startsAt, locale)}
                    {formatEventTime(event.startsAt, locale)
                      ? ` · ${formatEventTime(event.startsAt, locale)}`
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
                    {labels.seeAnnouncement}
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
                aria-label={labels.previous}
              >
                <ChevronLeft className="size-5" />
              </button>
              <button
                type="button"
                onClick={() => go(1)}
                className="absolute right-3 top-1/2 z-10 flex size-10 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 text-violet-700 shadow sm:right-4"
                aria-label={labels.next}
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
              aria-label={formatMessage(labels.goTo, { title: event.title })}
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
    </ContentSection>
  );
}
