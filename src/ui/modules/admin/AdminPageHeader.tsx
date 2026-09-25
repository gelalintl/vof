import { cn } from "@/utils/cn";

interface AdminPageHeaderProps {
  kicker: string;
  title: string;
  description?: string;
}

export function AdminPageHeader({ kicker, title, description }: AdminPageHeaderProps) {
  return (
    <div>
      <p className="font-heading text-xs font-bold uppercase tracking-[0.22em] text-gold">
        {kicker}
      </p>
      <h1 className="mt-2 font-heading text-4xl font-extrabold tracking-tight text-burgundy">
        {title}
      </h1>
      {description ? (
        <p className="mt-3 max-w-2xl text-sm leading-relaxed text-[#2C2424]/80">{description}</p>
      ) : null}
    </div>
  );
}

export function AdminEmptyState({ children }: { children: React.ReactNode }) {
  return (
    <div className="border border-dashed border-burgundy/20 bg-white px-4 py-10 text-center text-sm text-[#2C2424]/70">
      {children}
    </div>
  );
}

export function AdminLabel({ children }: { children: React.ReactNode }) {
  return (
    <span className="font-heading text-xs font-bold uppercase tracking-[0.16em] text-burgundy">
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
    <div className={cn("border border-burgundy/15 bg-white p-5", className)}>{children}</div>
  );
}
