import type { ReactNode } from "react";

export interface SoftPanelProps {
  children: ReactNode;
}

export function SoftPanel({ children }: SoftPanelProps) {
  return (
    <div className="rounded-3xl bg-slate-50 p-5 text-left ring-1 ring-violet-100 sm:p-8">
      {children}
    </div>
  );
}
