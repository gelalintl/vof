import type { AdminEventCategory } from "@/types";
import { cn } from "@/utils/cn";

export const EVENT_CATEGORY_LABELS: Record<AdminEventCategory, string> = {
  ROUTINE: "Routine",
  FASTING: "Jeûne",
  VIGIL: "Veillée",
  SPECIAL: "Spécial",
};

const categoryStyles: Record<AdminEventCategory, string> = {
  ROUTINE: "border-violet-200 bg-violet-50 text-[#6d28d9]",
  FASTING: "border-amber-200 bg-amber-50 text-amber-800",
  VIGIL: "border-sky-200 bg-sky-50 text-sky-700",
  SPECIAL: "border-amber-200 bg-amber-50 text-amber-800",
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
