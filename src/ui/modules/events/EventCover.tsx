import type { EventColorToken } from "@/types";
import { cn } from "@/utils/cn";
import { eventColorStyles } from "@/utils/theme/eventColors";

interface EventCoverProps {
  title: string;
  colorToken: EventColorToken;
  imageUrl?: string;
  className?: string;
  rounded?: string;
}

export function EventCover({
  title,
  colorToken,
  imageUrl,
  className,
  rounded = "rounded-2xl",
}: EventCoverProps) {
  const colors = eventColorStyles[colorToken];

  return (
    <div
      className={cn(
        "relative aspect-video overflow-hidden bg-slate-900",
        rounded,
        className,
      )}
    >
      {imageUrl ? (
        // Native img: no extra optimizer hop on 3G/4G
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={imageUrl}
          alt=""
          width={640}
          height={360}
          loading="lazy"
          decoding="async"
          className="size-full object-cover"
        />
      ) : (
        <div
          className={cn("absolute inset-0 bg-gradient-to-br", colors.gradient)}
          aria-hidden="true"
        />
      )}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_#0284C7_0%,_transparent_55%)] opacity-30" />
      <span className="sr-only">{title}</span>
    </div>
  );
}
