"use client";

import { useEffect } from "react";
import { X } from "lucide-react";
import { cn } from "@/utils/cn";

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
        className="absolute inset-0 bg-burgundy/40"
        onClick={onClose}
      />
      <aside
        role="dialog"
        aria-modal="true"
        aria-labelledby="admin-drawer-title"
        className="relative flex h-full w-full max-w-xl flex-col border-l border-burgundy bg-cream shadow-2xl"
      >
        <div className="flex items-start justify-between gap-4 border-b border-burgundy/15 bg-burgundy px-5 py-4 text-cream">
          <div>
            <h2 id="admin-drawer-title" className="font-heading text-xl font-extrabold tracking-tight">
              {title}
            </h2>
            {description ? (
              <p className="mt-1 text-sm text-cream/75">{description}</p>
            ) : null}
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-2 text-cream/80 hover:bg-white/10 hover:text-cream"
            aria-label="Fermer"
          >
            <X className="size-5" />
          </button>
        </div>
        <div className="min-h-0 flex-1 overflow-y-auto px-5 py-5">{children}</div>
        {footer ? <div className="border-t border-burgundy/15 px-5 py-4">{footer}</div> : null}
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
  if (!isOpen) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-[95] flex items-center justify-center p-4">
      <button
        type="button"
        aria-label="Annuler"
        className="absolute inset-0 bg-burgundy/50"
        onClick={onClose}
      />
      <div
        role="alertdialog"
        aria-modal="true"
        aria-labelledby="admin-confirm-title"
        className={cn("relative w-full max-w-md border border-burgundy bg-cream p-6 shadow-2xl")}
      >
        <h2 id="admin-confirm-title" className="font-heading text-xl font-extrabold text-burgundy">
          {title}
        </h2>
        <p className="mt-3 text-sm leading-relaxed text-[#2C2424]/80">{message}</p>
        <div className="mt-6 flex justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            className="h-10 border border-burgundy/20 px-4 font-heading text-sm font-bold text-burgundy"
          >
            Annuler
          </button>
          <button
            type="button"
            onClick={() => void onConfirm()}
            className="h-10 bg-burgundy px-4 font-heading text-sm font-bold text-cream hover:bg-burgundy-light"
          >
            Supprimer
          </button>
        </div>
      </div>
    </div>
  );
}
