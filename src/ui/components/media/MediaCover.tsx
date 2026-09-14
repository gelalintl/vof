import type { EventColorToken } from "@/types";
import { cn } from "@/utils/cn";
import { eventColorStyles } from "@/utils/theme/eventColors";

export interface MediaCoverProps {
  alt: string;
  src?: string;
  colorToken?: EventColorToken;
  className?: string;
  rounded?: string;
}

export function MediaCover({
  alt,
  src,
  colorToken = "brand",
  className,
  rounded = "rounded-2xl",
}: MediaCoverProps) {
  const colors = eventColorStyles[colorToken];

  return (
    <div
      className={cn(
        "relative aspect-video overflow-hidden bg-slate-900",
        rounded,
        className,
      )}
    >
      {src ? (
        // Native img: no extra optimizer hop on 3G/4G
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={src}
          alt={alt}
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
      <div
        className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_#0284C7_0%,_transparent_55%)] opacity-30"
        aria-hidden="true"
      />
    </div>
  );
}
