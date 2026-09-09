import type { EventColorToken, EventKind } from "@/types";

export const eventColorStyles: Record<
  EventColorToken,
  {
    bar: string;
    solid: string;
    gradient: string;
    text: string;
    soft: string;
    ring: string;
    badge: "brand" | "secondary" | "accent" | "impact";
  }
> = {
  brand: {
    bar: "border-violet-700",
    solid: "bg-violet-700",
    gradient: "from-violet-700 to-violet-950",
    text: "text-violet-700",
    soft: "bg-violet-50",
    ring: "ring-violet-700",
    badge: "brand",
  },
  secondary: {
    bar: "border-sky-600",
    solid: "bg-sky-600",
    gradient: "from-sky-600 to-sky-900",
    text: "text-sky-600",
    soft: "bg-sky-50",
    ring: "ring-sky-600",
    badge: "secondary",
  },
  accent: {
    bar: "border-amber-500",
    solid: "bg-amber-500",
    gradient: "from-amber-500 to-amber-800",
    text: "text-amber-600",
    soft: "bg-amber-50",
    ring: "ring-amber-500",
    badge: "accent",
  },
  impact: {
    bar: "border-red-600",
    solid: "bg-red-600",
    gradient: "from-red-600 to-red-950",
    text: "text-red-600",
    soft: "bg-red-50",
    ring: "ring-red-600",
    badge: "impact",
  },
};

export function colorTokenFromKind(kind: EventKind): EventColorToken {
  switch (kind) {
    case "jeunesse":
      return "secondary";
    case "seminaire":
    case "special":
      return "impact";
    case "conference":
      return "accent";
    default:
      return "brand";
  }
}
