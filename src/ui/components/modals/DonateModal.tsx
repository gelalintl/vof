"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { X } from "lucide-react";
import { DonateFlow } from "@/ui/components/forms";

interface DonateModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function DonateModal({ isOpen, onClose }: DonateModalProps) {
  const [flowKey, setFlowKey] = useState(0);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!isOpen) {
      setFlowKey((value) => value + 1);
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

  if (!mounted || !isOpen) {
    return null;
  }

  return createPortal(
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm"
      onClick={(event) => {
        if (event.target === event.currentTarget) {
          onClose();
        }
      }}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="vof-donate-title"
        aria-describedby="vof-donate-description"
        className="relative z-10 max-h-[90vh] w-full max-w-xl overflow-y-auto rounded-2xl bg-white p-6 shadow-2xl"
      >
        <button
          type="button"
          onClick={onClose}
          aria-label="Fermer"
          className="absolute top-4 right-4 rounded-full p-2 text-slate-400 transition-colors hover:bg-red-50 hover:text-red-600"
        >
          <X className="size-5" />
        </button>
        <h2
          id="vof-donate-title"
          className="pr-12 font-heading text-lg font-bold tracking-tight text-slate-800 sm:text-xl"
        >
          Soutenir l&apos;œuvre VOF
        </h2>
        <p
          id="vof-donate-description"
          className="mt-1 font-sans text-sm leading-relaxed text-slate-600"
        >
          Choisissez le type de don, un montant en FCFA, une récurrence, puis
          un moyen de paiement.
        </p>
        <div className="mt-5">
          <DonateFlow key={flowKey} layout="modal" />
        </div>
      </div>
    </div>,
    document.body,
  );
}
