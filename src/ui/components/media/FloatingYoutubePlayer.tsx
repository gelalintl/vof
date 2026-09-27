"use client";

import { ArrowUpRight, X } from "lucide-react";
import { cn } from "@/utils/cn";

interface FloatingYoutubePlayerProps {
  active: boolean;
  title: string;
  onClose: () => void;
  onReturnToPlayer: () => void;
  children: React.ReactNode;
  className?: string;
}

export function FloatingYoutubePlayer({
  active,
  title,
  onClose,
  onReturnToPlayer,
  children,
  className,
}: FloatingYoutubePlayerProps) {
  return (
    <div
      className={cn(
        "overflow-hidden bg-black",
        active
          ? "group fixed bottom-5 right-5 z-50 aspect-video w-72 rounded-2xl border border-slate-200 shadow-2xl sm:w-80"
          : "size-full rounded-2xl bg-slate-900",
        className,
      )}
    >
      {children}
      {active ? (
        <div className="absolute inset-x-0 top-0 flex items-start justify-end gap-1.5 bg-gradient-to-b from-black/75 to-transparent p-2 opacity-100 transition-opacity sm:opacity-0 sm:hover:opacity-100 sm:group-hover:opacity-100">
          <button
            type="button"
            onClick={onReturnToPlayer}
            aria-label={`Revenir au lecteur : ${title}`}
            className="inline-flex size-8 items-center justify-center rounded-full bg-white/95 text-slate-900 shadow-sm hover:bg-[#6d28d9] hover:text-white"
          >
            <ArrowUpRight className="size-4" aria-hidden />
          </button>
          <button
            type="button"
            onClick={onClose}
            aria-label="Fermer le mini-lecteur"
            className="inline-flex size-8 items-center justify-center rounded-full bg-white/95 text-slate-900 shadow-sm hover:bg-[#6d28d9] hover:text-white"
          >
            <X className="size-4" aria-hidden />
          </button>
        </div>
      ) : null}
    </div>
  );
}
