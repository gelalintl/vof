import type { EventHeadlineData } from "@/types";
import { Clock, MapPin } from "lucide-react";
import { cn } from "@/utils/cn";
import { eventColorStyles } from "@/utils/theme/eventColors";
import { Badge } from "@/ui/design-system/badge";
import { Typography } from "@/ui/design-system/typography";

export type EventHeadlineProps = EventHeadlineData;

export function EventHeadline({
  badge,
  title,
  dateLabel,
  location,
  colorToken = "brand",
}: EventHeadlineProps) {
  const colors = eventColorStyles[colorToken];

  return (
    <header>
      <Badge variant={colors.badge}>{badge}</Badge>
      <Typography variant="h1" className="mt-4">
        {title}
      </Typography>
      <p className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-2 font-sans text-sm text-slate-600">
        <span className="inline-flex items-center gap-2">
          <Clock className={cn("size-4", colors.text)} />
          {dateLabel}
        </span>
        <span className="inline-flex items-center gap-2">
          <MapPin className={cn("size-4", colors.text)} />
          {location}
        </span>
      </p>
    </header>
  );
}
