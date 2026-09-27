import { formatFcfa } from "@/utils/formatters/currency";

interface ProjectProgressProps {
  currentAmount: number;
  targetAmount: number;
  progress: number;
  compact?: boolean;
}

export function ProjectProgress({
  currentAmount,
  targetAmount,
  progress,
  compact = false,
}: ProjectProgressProps) {
  return (
    <div>
      <div className="h-2 overflow-hidden rounded-full bg-slate-100">
        <div
          className="h-full rounded-full bg-[#6d28d9] transition-[width]"
          style={{ width: `${Math.min(100, Math.max(0, progress))}%` }}
        />
      </div>
      <p
        className={
          compact
            ? "mt-1.5 font-sans text-xs text-slate-600"
            : "mt-2 font-sans text-sm text-slate-600"
        }
      >
        <span className="font-heading font-bold text-slate-900">
          {formatFcfa(currentAmount)}
        </span>
        {" / "}
        {formatFcfa(targetAmount)}
        <span className="ml-2 font-heading font-bold text-[#6d28d9]">{progress}%</span>
      </p>
    </div>
  );
}
