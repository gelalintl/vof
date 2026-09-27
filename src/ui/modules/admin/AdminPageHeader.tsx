import { cn } from "@/utils/cn";

interface AdminPageHeaderProps {
  kicker: string;
  title: string;
  description?: string;
}

export function AdminPageHeader({ kicker, title, description }: AdminPageHeaderProps) {
  return (
    <div>
      <p className="font-heading text-xs font-bold uppercase tracking-[0.22em] text-[#f59e0b]">
        {kicker}
      </p>
      <h1 className="mt-2 font-heading text-4xl font-extrabold tracking-tight text-slate-900">
        {title}
      </h1>
      {description ? (
        <p className="mt-3 max-w-2xl text-sm leading-relaxed text-slate-600">{description}</p>
      ) : null}
    </div>
  );
}

export function AdminEmptyState({ children }: { children: React.ReactNode }) {
  return (
    <div className="border border-dashed border-slate-200 bg-white px-4 py-10 text-center text-sm text-slate-600">
      {children}
    </div>
  );
}

export function AdminLabel({ children }: { children: React.ReactNode }) {
  return (
    <span className="font-heading text-xs font-bold uppercase tracking-[0.16em] text-[#6d28d9]">
      {children}
    </span>
  );
}

export function AdminPanel({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("border border-slate-200 bg-white p-5 shadow-sm", className)}>{children}</div>
  );
}
