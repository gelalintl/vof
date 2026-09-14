import Image from "next/image";
import type { PortraitBlockData } from "@/types";
import type { BadgeVariant } from "@/ui/design-system/badge";
import { Badge } from "@/ui/design-system/badge";
import { Typography } from "@/ui/design-system/typography";
import { cn } from "@/utils/cn";

export interface PortraitBlockProps extends PortraitBlockData {
  badgeVariant?: BadgeVariant;
  priority?: boolean;
}

export function PortraitBlock({
  name,
  role,
  bio,
  photoSrc,
  photoAlt,
  quote,
  reversed = false,
  badgeVariant = "accent",
  priority = false,
}: PortraitBlockProps) {
  return (
    <article
      className={cn(
        "flex flex-col items-start gap-8 lg:flex-row lg:gap-14",
        reversed && "lg:flex-row-reverse",
      )}
    >
      <div className="relative h-96 w-72 shrink-0 overflow-hidden rounded-2xl lg:h-[400px] lg:w-80">
        <Image
          src={photoSrc}
          alt={photoAlt}
          fill
          sizes="(min-width: 1024px) 320px, 288px"
          className="object-cover"
          unoptimized={photoSrc.endsWith(".svg")}
          priority={priority}
        />
      </div>
      <div className="min-w-0 flex-1">
        <Badge variant={badgeVariant} size="md">
          {role}
        </Badge>
        <Typography variant="h3" className="mt-3">
          {name}
        </Typography>
        <Typography variant="body" className="mt-4 text-justify text-slate-600">
          {bio}
        </Typography>
        {quote ? (
          <Typography variant="quote" className="mt-6">
            « {quote} »
          </Typography>
        ) : null}
      </div>
    </article>
  );
}

export interface PortraitBlockListProps {
  portraits: PortraitBlockData[];
  className?: string;
}

export function PortraitBlockList({ portraits, className }: PortraitBlockListProps) {
  return (
    <div className={cn("space-y-16", className)}>
      {portraits.map((portrait, index) => {
        const reversed = portrait.reversed ?? index % 2 === 1;

        return (
          <PortraitBlock
            key={portrait.name}
            {...portrait}
            reversed={reversed}
            badgeVariant={reversed ? "secondary" : "accent"}
            priority={index === 0}
          />
        );
      })}
    </div>
  );
}
