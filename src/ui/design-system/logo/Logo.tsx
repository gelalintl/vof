import Image from "next/image";
import { cn } from "@/utils/cn";

export interface LogoProps {
  className?: string;
  markClassName?: string;
  showWordmark?: boolean;
  inverted?: boolean;
  imageSrc?: string | null;
  wordmark?: string;
}

export function Logo({
  className,
  markClassName,
  showWordmark = true,
  inverted = false,
  imageSrc,
  wordmark = "Voice Of Freedom",
}: LogoProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-2.5",
        inverted ? "text-white" : "text-sky-600",
        className,
      )}
    >
      {imageSrc ? (
        <span className={cn("relative size-9 shrink-0 overflow-hidden", markClassName)}>
          <Image
            src={imageSrc}
            alt={`Logo ${wordmark}`}
            fill
            className="object-contain"
            sizes="80px"
          />
        </span>
      ) : (
        <svg
          viewBox="0 0 48 48"
          aria-hidden="true"
          className={cn("size-9 shrink-0", markClassName)}
        >
          <circle cx="24" cy="24" r="23" fill="currentColor" />
          <circle cx="24" cy="24" r="18" fill={inverted ? "#0284C7" : "#6D28D9"} />
          <path
            d="M14 31 L20 17 H24 L18.5 31 H14 Z M24 17 L30 31 H26.2 L25.1 28 H21.6 L24 17 Z M27.2 31 L33 17 H37 L31 31 H27.2 Z"
            fill="white"
          />
        </svg>
      )}
      {showWordmark ? (
        <span className="leading-tight">
          <span
            className={cn(
              "block font-heading text-sm font-extrabold tracking-tight sm:text-base",
              inverted ? "text-white" : "text-violet-700",
            )}
          >
            {wordmark}
          </span>
          <span
            className={cn(
              "block font-sans text-[11px] font-medium uppercase tracking-[0.16em]",
              inverted ? "text-white/80" : "text-sky-600",
            )}
          >
            Église VOF
          </span>
        </span>
      ) : null}
    </span>
  );
}
