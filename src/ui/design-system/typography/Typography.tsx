import { cn } from "@/utils/cn";

const variants = {
  h1: "font-heading text-3xl font-extrabold tracking-tight text-slate-800 sm:text-4xl lg:text-5xl",
  h2: "font-heading text-2xl font-bold tracking-tight text-slate-800 sm:text-3xl",
  h3: "font-heading text-xl font-bold tracking-tight text-slate-800 sm:text-2xl",
  h4: "font-heading text-lg font-bold tracking-tight text-slate-800",
  lead: "font-sans text-lg font-medium leading-relaxed text-slate-800",
  body: "font-sans text-base font-normal leading-relaxed text-slate-800",
  caption: "font-sans text-sm font-medium text-slate-600",
  quote: "font-serif text-lg italic leading-relaxed text-slate-800 sm:text-xl",
} as const;

const tags = {
  h1: "h1",
  h2: "h2",
  h3: "h3",
  h4: "h4",
  lead: "p",
  body: "p",
  caption: "p",
  quote: "blockquote",
} as const;

export type TypographyVariant = keyof typeof variants;

export interface TypographyProps {
  variant?: TypographyVariant;
  as?: "h1" | "h2" | "h3" | "h4" | "p" | "span" | "blockquote" | "div";
  className?: string;
  id?: string;
  children: React.ReactNode;
}

export function Typography({
  variant = "body",
  as,
  className,
  id,
  children,
}: TypographyProps) {
  const Component = as ?? tags[variant];

  return (
    <Component id={id} className={cn(variants[variant], className)}>
      {children}
    </Component>
  );
}
