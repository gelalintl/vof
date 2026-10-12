"use client";

import { useState } from "react";
import { HOME_GALLERY_MAX_COUNT } from "@/datas/home";
import type { GalleryImage } from "@/types";
import { ImageLightbox } from "@/ui/components/media/ImageLightbox";
import { cn } from "@/utils/cn";

interface HomeGalleryProps {
  images: GalleryImage[];
}

export function HomeGallery({ images }: HomeGalleryProps) {
  // Uniquement les images réelles issues de la base de données (aucun placeholder).
  const gallery = images.slice(0, HOME_GALLERY_MAX_COUNT);
  const featured = gallery[0];
  const thumbnails = gallery.slice(1);
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  if (!featured) {
    return null;
  }

  return (
    <>
      <div className="grid grid-cols-1 items-stretch gap-6 lg:grid-cols-12">
        <div
          className={cn(
            "relative min-h-[380px]",
            thumbnails.length > 0 ? "lg:col-span-5" : "lg:col-span-12",
          )}
        >
          <button
            type="button"
            onClick={() => setLightboxIndex(0)}
            aria-haspopup="dialog"
            aria-label={featured.caption ?? featured.alt}
            className="absolute inset-0 cursor-pointer overflow-hidden rounded-2xl border border-slate-100 shadow-md"
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={featured.src}
              alt={featured.alt}
              className="h-full min-h-[380px] w-full object-cover lg:min-h-full"
            />
            {featured.caption ? (
              <span className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-slate-950/75 to-transparent px-4 py-4 text-left font-heading text-sm font-bold tracking-tight text-white sm:text-base">
                {featured.caption}
              </span>
            ) : null}
          </button>
        </div>

        {thumbnails.length > 0 ? (
          <div className="grid h-full grid-cols-2 gap-4 sm:grid-cols-3 lg:col-span-7">
            {thumbnails.map((image, thumbnailIndex) => {
              const galleryIndex = thumbnailIndex + 1;
              return (
                <button
                  key={image.id}
                  type="button"
                  onClick={() => setLightboxIndex(galleryIndex)}
                  aria-haspopup="dialog"
                  aria-label={image.caption ?? image.alt}
                  className="cursor-pointer overflow-hidden rounded-xl border border-slate-100 shadow-sm transition-transform duration-200 hover:scale-[1.03]"
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={image.src}
                    alt={image.alt}
                    className="aspect-square w-full cursor-pointer object-cover"
                  />
                </button>
              );
            })}
          </div>
        ) : null}
      </div>

      <ImageLightbox
        images={gallery}
        index={lightboxIndex}
        onClose={() => setLightboxIndex(null)}
        onIndexChange={setLightboxIndex}
      />
    </>
  );
}
