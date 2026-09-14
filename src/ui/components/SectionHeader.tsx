import type { SectionHeaderData } from "@/types";
import type { BadgeVariant } from "@/ui/design-system/badge";
import type { TypographyVariant } from "@/ui/design-system/typography";
import { Badge } from "@/ui/design-system/badge";
import { Typography } from "@/ui/design-system/typography";
import { cn } from "@/utils/cn";

export interface SectionHeaderProps extends SectionHeaderData {
  badgeVariant?: BadgeVariant;
  heading?: Extract<TypographyVariant, "h2" | "h3">;
}

export function SectionHeader({
  badge,
  kicker,
  title,
  titleId,
  description,
  align = "left",
  titleStyle = "default",
  badgeVariant = "accent",
  heading = "h2",
}: SectionHeaderProps) {
  return (
    <div className={cn(align === "center" && "text-center")}>
      {badge ? <Badge variant={badgeVariant}>{badge}</Badge> : null}
      {!badge && kicker ? (
        <Typography variant="caption" className="uppercase tracking-[0.2em] text-sky-600">
          {kicker}
        </Typography>
      ) : null}
      <Typography
        id={titleId}
        variant={heading}
        className={cn(
          (badge || kicker) && "mt-3",
          titleStyle === "display" && "uppercase tracking-wider",
        )}
      >
        {title}
      </Typography>
      {description ? (
        <Typography variant="body" className="mt-3 max-w-2xl text-slate-600">
          {description}
        </Typography>
      ) : null}
    </div>
  );
}
