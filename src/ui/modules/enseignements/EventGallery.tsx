"use client";

import { useState } from "react";
import type { GalleryImage } from "@/types";
import { ImageLightbox } from "@/ui/components/media/ImageLightbox";
import { Typography } from "@/ui/design-system/typography";

interface EventGalleryProps {
  images: string[];
  title?: string;
}

export function EventGallery({ images, title = "Galerie de l'événement" }: EventGalleryProps) {
  const [index, setIndex] = useState<number | null>(null);
  const gallery: GalleryImage[] = images
    .filter((src) => src.trim().length > 0)
    .map((src, imageIndex) => ({
      id: `${src}-${imageIndex}`,
      src,
      alt: `${title} ${imageIndex + 1}`,
    }));

  if (gallery.length === 0) {
    return null;
  }

  return (
    <section className="mt-10 border-t border-slate-200 pt-8" aria-labelledby="galerie-evenement">
      <Typography id="galerie-evenement" variant="h3" className="text-slate-900">
        {title}
      </Typography>
      <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
        {gallery.map((image, imageIndex) => (
          <button
            key={image.id}
            type="button"
            onClick={() => setIndex(imageIndex)}
            className="overflow-hidden border border-slate-200 bg-slate-50"
            aria-label={`Agrandir ${image.alt}`}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={image.src}
              alt={image.alt}
              className="aspect-square h-full w-full cursor-pointer object-cover transition-transform hover:scale-[1.02]"
            />
          </button>
        ))}
      </div>
      <ImageLightbox
        images={gallery}
        index={index}
        onClose={() => setIndex(null)}
        onIndexChange={setIndex}
      />
    </section>
  );
}
