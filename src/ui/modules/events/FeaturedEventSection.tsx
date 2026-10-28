import Link from "next/link";
import { CalendarDays, Clock, MapPin } from "lucide-react";
import type { Locale } from "@/i18n/config";
import type { Event, EventKind } from "@/types";
import { excerptRichText } from "@/lib/richText";
import { showsEventAnnouncement } from "@/lib/eventPresentation";
import { formatEventDate, formatEventTime } from "@/utils/date/format";
import { Badge } from "@/ui/design-system/badge";
import { Typography } from "@/ui/design-system/typography";
import { cn } from "@/utils/cn";
import { interactiveCardClass } from "@/utils/theme/interactiveCard";

interface FeaturedEventSectionProps {
  event: Event | null;
  locale?: Locale;
  labels: {
    badge: string;
    title: string;
    description: string;
    seeAnnouncement: string;
  };
  kindLabels: Record<EventKind, string>;
}

export function FeaturedEventSection({
  event,
  locale = "fr",
  labels,
  kindLabels,
}: FeaturedEventSectionProps) {
  if (!event) {
    return null;
  }

  const time = formatEventTime(event.startsAt, locale);
  const announcementHref = showsEventAnnouncement(event)
    ? `/vie-de-leglise/${event.slug}`
    : null;
  const cardClassName = cn(
    announcementHref
      ? interactiveCardClass
      : "border border-slate-200 bg-white shadow-sm",
    "mt-8 block overflow-hidden rounded-3xl lg:grid lg:grid-cols-[1.15fr_0.85fr]",
  );

  const card = (
    <>
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
          {kindLabels[event.kind]}
        </Badge>
        <Typography variant="h3" className="mt-3 text-slate-900">
          {event.title}
        </Typography>
        {event.theme ? (
          <p className="mt-1 font-serif text-sm italic text-violet-700">{event.theme}</p>
        ) : null}
        {event.description ? (
          <p className="mt-3 font-sans text-sm leading-relaxed text-slate-800">
            {excerptRichText(event.description, 180)}
          </p>
        ) : null}
        <p className="mt-4 flex items-center gap-2 font-sans text-sm text-slate-600">
          <CalendarDays className="size-4 text-[#6d28d9]" />
          {formatEventDate(event.startsAt, locale)}
        </p>
        {time ? (
          <p className="mt-1.5 flex items-center gap-2 font-sans text-sm text-slate-600">
            <Clock className="size-4 text-[#6d28d9]" />
            {time}
            {event.endsAt ? ` – ${formatEventTime(event.endsAt, locale)}` : ""}
          </p>
        ) : null}
        <p className="mt-1.5 flex items-center gap-2 font-sans text-sm text-slate-600">
          <MapPin className="size-4 text-[#6d28d9]" />
          {event.location}
        </p>
        {announcementHref ? (
          <span className="mt-6 inline-flex h-9 w-fit items-center rounded-full bg-amber-500 px-3 font-heading text-sm font-bold tracking-tight text-slate-900">
            {labels.seeAnnouncement}
          </span>
        ) : null}
      </div>
    </>
  );

  return (
    <section className="bg-white" aria-labelledby="a-la-une">
      <div className="mx-auto max-w-6xl px-4 py-14 sm:px-6">
        <Badge variant="accent">{labels.badge}</Badge>
        <Typography id="a-la-une" variant="h2" className="mt-3">
          {labels.title}
        </Typography>
        <Typography variant="body" className="mt-3 max-w-2xl text-slate-600">
          {labels.description}
        </Typography>

        {announcementHref ? (
          <Link href={announcementHref} className={cardClassName}>
            {card}
          </Link>
        ) : (
          <article className={cardClassName}>{card}</article>
        )}
      </div>
    </section>
  );
}
