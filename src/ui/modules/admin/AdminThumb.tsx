import { ImageIcon } from "lucide-react";
import { cn } from "@/utils/cn";

interface AdminThumbProps {
  src?: string | null;
  alt: string;
  className?: string;
}

export function AdminThumb({ src, alt, className }: AdminThumbProps) {
  if (!src) {
    return (
      <span
        className={cn(
          "inline-flex size-14 shrink-0 items-center justify-center border border-burgundy/15 bg-cream text-burgundy/40",
          className,
        )}
      >
        <ImageIcon className="size-5" aria-hidden="true" />
      </span>
    );
  }

  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={src}
      alt={alt}
      className={cn(
        "size-14 shrink-0 object-cover border border-burgundy/15 bg-cream",
        className,
      )}
    />
  );
}
