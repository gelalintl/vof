import Link from "next/link";
import { Clock, MapPin } from "lucide-react";
import type { Event } from "@/types";
import { eventKindLabels } from "@/datas/events";
import { cn } from "@/utils/cn";
import { formatEventDate, formatEventTime } from "@/utils/date/format";
import { eventColorStyles } from "@/utils/theme/eventColors";
import { Badge } from "@/ui/design-system/badge";
import { Typography } from "@/ui/design-system/typography";
import { EventCover } from "@/ui/modules/events/EventCover";

interface EventCardProps {
  event: Event;
}

export function EventCard({ event }: EventCardProps) {
  const colors = eventColorStyles[event.colorToken];
  const time = formatEventTime(event.startsAt);

  return (
    <Link
      href={`/vie-de-leglise/${event.slug}`}
      className={cn(
        "group flex h-full flex-col overflow-hidden rounded-3xl bg-white shadow-sm ring-1 ring-slate-100 transition-shadow hover:shadow-md",
        "border-l-4",
        colors.bar,
      )}
    >
      <EventCover
        title={event.title}
        colorToken={event.colorToken}
        imageUrl={event.imageUrl}
        rounded="rounded-none"
      />
      <div className="flex flex-1 flex-col p-5">
        <Badge variant={colors.badge} size="sm">
          {eventKindLabels[event.kind]}
        </Badge>
        <Typography variant="h4" className="mt-3 group-hover:text-violet-700">
          {event.title}
        </Typography>
        <Typography variant="body" className="mt-2 line-clamp-2 text-sm text-slate-600">
          {event.description}
        </Typography>
        <p className="mt-4 flex items-center gap-2 font-sans text-sm text-slate-600">
          <Clock className={cn("size-4", colors.text)} />
          {formatEventDate(event.startsAt)}
          {time ? ` · ${time}` : ""}
        </p>
        <p className="mt-1 flex items-center gap-2 font-sans text-sm text-slate-600">
          <MapPin className={cn("size-4", colors.text)} />
          {event.location}
        </p>
      </div>
    </Link>
  );
}
