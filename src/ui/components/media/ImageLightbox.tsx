"use client";

import { useEffect, useState, type MouseEvent } from "react";
import { createPortal } from "react-dom";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import type { GalleryImage } from "@/types";
import { cn } from "@/utils/cn";

interface ImageLightboxProps {
  images: GalleryImage[];
  index: number | null;
  onClose: () => void;
  onIndexChange: (index: number) => void;
}

export function ImageLightbox({
  images,
  index,
  onClose,
  onIndexChange,
}: ImageLightboxProps) {
  const [mounted, setMounted] = useState(false);
  const current = index !== null ? images[index] : undefined;
  const hasNav = images.length > 1;

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (index === null) {
      return;
    }

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
      }
      if (event.key === "ArrowRight" && hasNav) {
        onIndexChange((index + 1) % images.length);
      }
      if (event.key === "ArrowLeft" && hasNav) {
        onIndexChange((index - 1 + images.length) % images.length);
      }
    };

    document.addEventListener("keydown", onKeyDown);
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = "";
    };
  }, [hasNav, images.length, index, onClose, onIndexChange]);

  if (!mounted) {
    return null;
  }

  return createPortal(
    <AnimatePresence>
      {current ? (
        <motion.div
          key="lightbox"
          role="dialog"
          aria-modal="true"
          aria-label={current.alt}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[90] flex items-center justify-center bg-black/80 p-4 backdrop-blur-md"
          onClick={onClose}
        >
          <button
            type="button"
            onClick={onClose}
            aria-label="Fermer"
            className="absolute top-4 right-4 rounded-full p-2 text-white/80 transition-colors hover:bg-white/10 hover:text-white"
          >
            <X className="size-6" />
          </button>

          {hasNav ? (
            <>
              <NavButton
                label="Image précédente"
                className="left-3 sm:left-6"
                onClick={(event) => {
                  event.stopPropagation();
                  onIndexChange((index! - 1 + images.length) % images.length);
                }}
              >
                <ChevronLeft className="size-6" />
              </NavButton>
              <NavButton
                label="Image suivante"
                className="right-3 sm:right-6"
                onClick={(event) => {
                  event.stopPropagation();
                  onIndexChange((index! + 1) % images.length);
                }}
              >
                <ChevronRight className="size-6" />
              </NavButton>
            </>
          ) : null}

          <motion.figure
            key={current.id}
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="relative max-h-[85vh] max-w-5xl"
            onClick={(event) => event.stopPropagation()}
          >
            {/* Native img: no extra optimizer hop on 3G/4G */}
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={current.src}
              alt={current.alt}
              className="max-h-[80vh] w-auto max-w-full rounded-xl object-contain"
            />
            {current.caption ? (
              <figcaption className="mt-3 text-center font-sans text-sm text-white/80">
                {current.caption}
              </figcaption>
            ) : null}
          </motion.figure>
        </motion.div>
      ) : null}
    </AnimatePresence>,
    document.body,
  );
}

function NavButton({
  label,
  className,
  onClick,
  children,
}: {
  label: string;
  className: string;
  onClick: (event: MouseEvent<HTMLButtonElement>) => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      aria-label={label}
      onClick={onClick}
      className={cn(
        "absolute top-1/2 z-10 -translate-y-1/2 rounded-full bg-white/10 p-2 text-white backdrop-blur-sm hover:bg-white/20",
        className,
      )}
    >
      {children}
    </button>
  );
}
