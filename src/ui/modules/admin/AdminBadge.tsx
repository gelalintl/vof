import type { AdminEventCategory } from "@/types";
import { cn } from "@/utils/cn";

export const EVENT_CATEGORY_LABELS: Record<AdminEventCategory, string> = {
  ROUTINE: "Routine",
  FASTING: "Jeûne",
  VIGIL: "Veillée",
  SPECIAL: "Spécial",
};

const categoryStyles: Record<AdminEventCategory, string> = {
  ROUTINE: "border-burgundy/30 bg-cream text-burgundy",
  FASTING: "border-amber-300 bg-amber-50 text-amber-800",
  VIGIL: "border-burgundy-light bg-burgundy-light/10 text-burgundy-light",
  SPECIAL: "border-gold bg-gold/15 text-[#6B4F1D]",
};

interface AdminBadgeProps {
  children: React.ReactNode;
  className?: string;
}

export function AdminBadge({ children, className }: AdminBadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center border px-2 py-0.5 font-heading text-[10px] font-bold uppercase tracking-[0.14em]",
        className,
      )}
    >
      {children}
    </span>
  );
}

export function EventCategoryBadge({ category }: { category: AdminEventCategory }) {
  return (
    <AdminBadge className={categoryStyles[category]}>{EVENT_CATEGORY_LABELS[category]}</AdminBadge>
  );
}
