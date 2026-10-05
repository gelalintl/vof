import type { QuoteBlockData } from "@/types";
import { cn } from "@/utils/cn";
import { Typography } from "@/ui/design-system/typography";

export type QuoteBlockProps = QuoteBlockData;

export function QuoteBlock({
  quote,
  caption,
  imageSrc,
  imageAlt,
  attribution,
  note,
  align = "left",
  attributionVariant = "muted",
}: QuoteBlockProps) {
  return (
    <div className={cn(align === "center" && "text-center")}>
      <Typography variant="quote" className={cn(align === "left" && "max-w-3xl")}>
        {quote}
      </Typography>
      {caption ? (
        <Typography variant="caption" className="mt-2">
          {caption}
        </Typography>
      ) : null}
      {imageSrc ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={imageSrc}
          alt={imageAlt ?? ""}
          className="mx-auto my-6 max-h-48 w-auto rounded-2xl border border-slate-100 object-cover shadow-md"
        />
      ) : null}
      {attribution ? (
        <p
          className={cn(
            attributionVariant === "brand"
              ? cn(
                  "font-heading text-sm font-bold tracking-tight text-violet-700",
                  imageSrc ? "mt-0" : "mt-6",
                )
              : cn("font-sans text-sm text-slate-600", imageSrc ? "mt-0" : "mt-2"),
          )}
        >
          {attribution}
        </p>
      ) : null}
      {note ? (
        <p className="mt-2 font-sans text-sm text-slate-600">{note}</p>
      ) : null}
    </div>
  );
}
