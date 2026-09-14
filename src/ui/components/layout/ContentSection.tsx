import type { ReactNode } from "react";
import type {
  ContentSectionGap,
  ContentSectionPadding,
  ContentSectionTone,
  ContentSectionWidth,
} from "@/types";
import { cn } from "@/utils/cn";

export interface ContentSectionProps {
  children: ReactNode;
  tone?: ContentSectionTone;
  width?: ContentSectionWidth;
  padding?: ContentSectionPadding;
  gap?: ContentSectionGap;
  align?: "left" | "center";
  stack?: boolean;
  id?: string;
  labelledBy?: string;
  className?: string;
  innerClassName?: string;
}

const toneClass: Record<ContentSectionTone, string> = {
  white: "bg-white",
  muted: "bg-slate-50",
};

const widthClass: Record<ContentSectionWidth, string> = {
  default: "max-w-6xl",
  narrow: "max-w-xl",
  prose: "max-w-3xl",
  article: "max-w-4xl",
};

const paddingClass: Record<ContentSectionPadding, string> = {
  default: "py-14",
  compact: "py-8 sm:py-10",
};

const gapClass: Record<ContentSectionGap, string> = {
  md: "gap-8",
  lg: "gap-12",
};

export function ContentSection({
  children,
  tone = "white",
  width = "default",
  padding = "default",
  gap = "md",
  align = "left",
  stack = true,
  id,
  labelledBy,
  className,
  innerClassName,
}: ContentSectionProps) {
  return (
    <section
      id={id}
      aria-labelledby={labelledBy}
      className={cn(toneClass[tone], className)}
    >
      <div
        className={cn(
          "mx-auto px-4 sm:px-6",
          paddingClass[padding],
          widthClass[width],
          stack && "flex flex-col",
          stack && gapClass[gap],
          align === "center" && "text-center",
          innerClassName,
        )}
      >
        {children}
      </div>
    </section>
  );
}
