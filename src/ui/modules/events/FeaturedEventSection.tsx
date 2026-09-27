import Link from "next/link";
import { CalendarDays, Clock, MapPin } from "lucide-react";
import type { Event } from "@/types";
import { eventKindLabels } from "@/lib/eventPresentation";
import { formatEventDate, formatEventTime } from "@/utils/date/format";
import { Badge } from "@/ui/design-system/badge";
import { Typography } from "@/ui/design-system/typography";
import { cn } from "@/utils/cn";
import { interactiveCardClass } from "@/utils/theme/interactiveCard";

interface FeaturedEventSectionProps {
  event: Event | null;
}

export function FeaturedEventSection({ event }: FeaturedEventSectionProps) {
  if (!event) {
    return null;
  }

  const time = formatEventTime(event.startsAt);

  return (
    <section className="bg-white" aria-labelledby="a-la-une">
      <div className="mx-auto max-w-6xl px-4 py-14 sm:px-6">
        <Badge variant="accent">À la une</Badge>
        <Typography id="a-la-une" variant="h2" className="mt-3">
          Prochain événement à la une
        </Typography>
        <Typography variant="body" className="mt-3 max-w-2xl text-slate-600">
          Le grand rendez-vous à venir : culte, veillée ou temps fort de Voice of Freedom.
        </Typography>

        <Link
          href={`/vie-de-leglise/${event.slug}`}
          className={cn(
            interactiveCardClass,
            "mt-8 block overflow-hidden rounded-3xl lg:grid lg:grid-cols-[1.15fr_0.85fr]",
          )}
        >
          <div className="relative min-h-56 bg-slate-50 lg:min-h-full">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={event.imageUrl || "/assets/pastors/placeholder.svg"}
              alt={event.title}
              className="h-56 w-full object-cover lg:absolute lg:inset-0 lg:h-full"
            />
          </div>
          <div className="flex flex-col justify-center bg-white px-6 py-8 sm:px-8">
            <Badge variant="brand" size="sm">
              {eventKindLabels[event.kind]}
            </Badge>
            <Typography variant="h3" className="mt-3 text-slate-900">
              {event.title}
            </Typography>
            {event.description ? (
              <p className="mt-3 font-sans text-sm leading-relaxed text-slate-800">
                {event.description}
              </p>
            ) : null}
            <p className="mt-4 flex items-center gap-2 font-sans text-sm text-slate-600">
              <CalendarDays className="size-4 text-[#6d28d9]" />
              {formatEventDate(event.startsAt)}
            </p>
            {time ? (
              <p className="mt-1.5 flex items-center gap-2 font-sans text-sm text-slate-600">
                <Clock className="size-4 text-[#6d28d9]" />
                {time}
                {event.endsAt ? ` – ${formatEventTime(event.endsAt)}` : ""}
              </p>
            ) : null}
            <p className="mt-1.5 flex items-center gap-2 font-sans text-sm text-slate-600">
              <MapPin className="size-4 text-[#6d28d9]" />
              {event.location}
            </p>
            <span className="mt-6 inline-flex h-9 w-fit items-center rounded-full bg-amber-500 px-3 font-heading text-sm font-bold tracking-tight text-slate-900">
              Voir l&apos;annonce
            </span>
          </div>
        </Link>
      </div>
    </section>
  );
}
