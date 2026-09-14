import Link from "next/link";
import { Clock, MapPin } from "lucide-react";
import type { MediaCardData } from "@/types";
import { cn } from "@/utils/cn";
import { eventColorStyles } from "@/utils/theme/eventColors";
import { Badge } from "@/ui/design-system/badge";
import { Typography } from "@/ui/design-system/typography";
import { MediaCover } from "@/ui/components/MediaCover";

export interface MediaCardProps {
  card: MediaCardData;
}

export function MediaCard({ card }: MediaCardProps) {
  const colors = eventColorStyles[card.colorToken ?? "brand"];

  return (
    <Link
      href={card.href}
      className={cn(
        "group flex h-full flex-col overflow-hidden rounded-3xl border-l-4 bg-white shadow-sm ring-1 ring-slate-100 transition-shadow hover:shadow-md",
        colors.bar,
      )}
    >
      <MediaCover
        src={card.imageSrc}
        alt={card.imageAlt}
        colorToken={card.colorToken}
        rounded="rounded-none"
      />
      <div className="flex flex-1 flex-col p-5">
        {card.badge ? (
          <Badge variant={colors.badge} size="sm">
            {card.badge}
          </Badge>
        ) : null}
        <Typography variant="h4" className="mt-3 group-hover:text-violet-700">
          {card.title}
        </Typography>
        {card.description ? (
          <Typography variant="body" className="mt-2 line-clamp-2 text-sm text-slate-600">
            {card.description}
          </Typography>
        ) : null}
        {card.dateLabel ? (
          <p className="mt-4 flex items-center gap-2 font-sans text-sm text-slate-600">
            <Clock className={cn("size-4", colors.text)} />
            {card.dateLabel}
          </p>
        ) : null}
        {card.location ? (
          <p className="mt-1 flex items-center gap-2 font-sans text-sm text-slate-600">
            <MapPin className={cn("size-4", colors.text)} />
            {card.location}
          </p>
        ) : null}
      </div>
    </Link>
  );
}

export interface MediaCardGridProps {
  cards: MediaCardData[];
  className?: string;
}

export function MediaCardGrid({ cards, className }: MediaCardGridProps) {
  return (
    <div className={cn("grid gap-6 sm:grid-cols-2 lg:grid-cols-3", className)}>
      {cards.map((card) => (
        <MediaCard key={card.href} card={card} />
      ))}
    </div>
  );
}
