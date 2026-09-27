"use client";

import { useEffect, useState } from "react";
import { X } from "lucide-react";
import { cn } from "@/utils/cn";
import { adminPrimaryButtonClass } from "./adminStyles";

interface AdminDrawerProps {
  isOpen: boolean;
  title: string;
  description?: string;
  onClose: () => void;
  children: React.ReactNode;
  footer?: React.ReactNode;
}

export function AdminDrawer({
  isOpen,
  title,
  description,
  onClose,
  children,
  footer,
}: AdminDrawerProps) {
  useEffect(() => {
    if (!isOpen) {
      return;
    }

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    document.addEventListener("keydown", onKeyDown);
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = "";
    };
  }, [isOpen, onClose]);

  if (!isOpen) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-[90] flex justify-end">
      <button
        type="button"
        aria-label="Fermer le panneau"
        className="absolute inset-0 bg-slate-900/40"
        onClick={onClose}
      />
      <aside
        role="dialog"
        aria-modal="true"
        aria-labelledby="admin-drawer-title"
        className="relative flex h-full w-full max-w-xl flex-col border-l border-slate-200 bg-white shadow-2xl"
      >
        <div className="flex items-start justify-between gap-4 border-b border-slate-200 bg-[#6d28d9] px-5 py-4 text-white">
          <div>
            <h2 id="admin-drawer-title" className="font-heading text-xl font-extrabold tracking-tight">
              {title}
            </h2>
            {description ? (
              <p className="mt-1 text-sm text-white/80">{description}</p>
            ) : null}
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-2 text-white/80 hover:bg-white/10 hover:text-white"
            aria-label="Fermer"
          >
            <X className="size-5" />
          </button>
        </div>
        <div className="min-h-0 flex-1 overflow-y-auto px-5 py-5">{children}</div>
        {footer ? <div className="border-t border-slate-200 px-5 py-4">{footer}</div> : null}
      </aside>
    </div>
  );
}

interface AdminConfirmDialogProps {
  isOpen: boolean;
  title: string;
  message: string;
  onClose: () => void;
  onConfirm: () => void | Promise<void>;
}

export function AdminConfirmDialog({
  isOpen,
  title,
  message,
  onClose,
  onConfirm,
}: AdminConfirmDialogProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (!isOpen) {
      setIsSubmitting(false);
    }
  }, [isOpen]);

  if (!isOpen) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-[95] flex items-center justify-center p-4">
      <button
        type="button"
        aria-label="Annuler"
        className="absolute inset-0 bg-slate-900/50"
        disabled={isSubmitting}
        onClick={onClose}
      />
      <div
        role="alertdialog"
        aria-modal="true"
        aria-labelledby="admin-confirm-title"
        className={cn("relative w-full max-w-md border border-slate-200 bg-white p-6 shadow-2xl")}
      >
        <h2 id="admin-confirm-title" className="font-heading text-xl font-extrabold text-slate-900">
          {title}
        </h2>
        <p className="mt-3 text-sm leading-relaxed text-slate-600">{message}</p>
        <div className="mt-6 flex justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            disabled={isSubmitting}
            className="h-10 border border-slate-200 px-4 font-heading text-sm font-bold text-slate-800 disabled:opacity-50"
          >
            Annuler
          </button>
          <button
            type="button"
            disabled={isSubmitting}
            onClick={async () => {
              setIsSubmitting(true);
              try {
                await onConfirm();
              } finally {
                setIsSubmitting(false);
              }
            }}
            className={cn(adminPrimaryButtonClass, "h-10 px-4")}
          >
            {isSubmitting ? "Suppression…" : "Supprimer"}
          </button>
        </div>
      </div>
    </div>
  );
}
