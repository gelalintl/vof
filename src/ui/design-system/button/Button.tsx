import Link from "next/link";
import { cn } from "@/utils/cn";

const variants = {
  primary:
    "bg-violet-700 text-white hover:bg-violet-800 focus-visible:ring-violet-700",
  secondary:
    "bg-sky-600 text-white hover:bg-sky-700 focus-visible:ring-sky-600",
  accent:
    "bg-amber-500 text-slate-900 hover:bg-amber-400 focus-visible:ring-amber-500 font-semibold",
  outline:
    "border-2 border-violet-700 text-violet-700 bg-transparent hover:bg-violet-50 focus-visible:ring-violet-700",
  outlineLight:
    "border-2 border-white text-white bg-transparent hover:bg-white/10 focus-visible:ring-white",
  ghost:
    "text-slate-800 hover:bg-slate-50 focus-visible:ring-slate-400",
} as const;

const sizes = {
  sm: "h-9 px-3 text-sm",
  md: "h-11 px-5 text-sm",
  lg: "h-12 px-6 text-base",
} as const;

export type ButtonVariant = keyof typeof variants;
export type ButtonSize = keyof typeof sizes;

type SharedProps = {
  variant?: ButtonVariant;
  size?: ButtonSize;
  className?: string;
  children: React.ReactNode;
};

type ButtonAsButton = SharedProps &
  Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, "className" | "children"> & {
    href?: undefined;
  };

type ButtonAsLink = SharedProps & {
  href: string;
} & Omit<React.AnchorHTMLAttributes<HTMLAnchorElement>, "href" | "className" | "children">;

export type ButtonProps = ButtonAsButton | ButtonAsLink;

export function Button({
  variant = "primary",
  size = "md",
  className,
  children,
  ...props
}: ButtonProps) {
  const classes = cn(
    "inline-flex items-center justify-center gap-2 rounded-full font-heading font-bold tracking-tight transition-colors",
    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2",
    "disabled:pointer-events-none disabled:opacity-50",
    variants[variant],
    sizes[size],
    className,
  );

  if ("href" in props && props.href) {
    const { href, ...linkProps } = props;
    return (
      <Link href={href} className={classes} {...linkProps}>
        {children}
      </Link>
    );
  }

  return (
    <button className={classes} type="button" {...(props as ButtonAsButton)}>
      {children}
    </button>
  );
}
