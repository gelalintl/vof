import type { QuoteBlockData } from "@/types";
import { cn } from "@/utils/cn";
import { Typography } from "@/ui/design-system/typography";

export type QuoteBlockProps = QuoteBlockData;

export function QuoteBlock({
  quote,
  caption,
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
      {attribution ? (
        <p
          className={cn(
            attributionVariant === "brand"
              ? "mt-6 font-heading text-sm font-bold tracking-tight text-violet-700"
              : "mt-2 font-sans text-sm text-slate-600",
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
