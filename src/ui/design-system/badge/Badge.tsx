import { cn } from "@/utils/cn";

const variants = {
  brand: "bg-violet-700 text-white",
  secondary: "bg-sky-600 text-white",
  accent: "bg-amber-500 text-slate-900",
  impact: "bg-red-600 text-white",
  outline: "bg-white text-violet-700 ring-1 ring-inset ring-violet-700",
} as const;

const sizes = {
  sm: "px-2 py-0.5 text-xs",
  md: "px-2.5 py-1 text-xs sm:text-sm",
} as const;

export type BadgeVariant = keyof typeof variants;
export type BadgeSize = keyof typeof sizes;

export interface BadgeProps {
  children: React.ReactNode;
  variant?: BadgeVariant;
  size?: BadgeSize;
  className?: string;
}

export function Badge({
  children,
  variant = "accent",
  size = "md",
  className,
}: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full font-heading font-bold tracking-wider uppercase",
        variants[variant],
        sizes[size],
        className,
      )}
    >
      {children}
    </span>
  );
}
