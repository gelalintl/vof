"use client";

import { useMemo, useState } from "react";
import type { EventGalleryItem } from "@/types";
import { resolveGallerySrc } from "@/datas/gallery";
import { Typography } from "@/ui/design-system/typography";
import { ImageLightbox } from "@/ui/components/ImageLightbox";

interface EventPhotoGalleryProps {
  items: EventGalleryItem[];
}

export function EventPhotoGallery({ items }: EventPhotoGalleryProps) {
  const [index, setIndex] = useState<number | null>(null);
  const images = useMemo(
    () =>
      items.map((item, itemIndex) => ({
        id: item.id,
        src: resolveGallerySrc(item.imageUrl, itemIndex),
        alt: item.alt,
        caption: item.caption,
      })),
    [items],
  );

  if (images.length === 0) {
    return null;
  }

  return (
    <section className="mt-12" aria-labelledby="galerie-event">
      <Typography id="galerie-event" variant="h3">
        Galerie photo
      </Typography>
      <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-3">
        {images.map((image, imageIndex) => (
          <button
            key={image.id}
            type="button"
            onClick={() => setIndex(imageIndex)}
            className="group overflow-hidden rounded-2xl"
          >
            {/* Native img: no extra optimizer hop on 3G/4G */}
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={image.src}
              alt={image.alt}
              loading="lazy"
              decoding="async"
              className="aspect-[4/3] w-full object-cover transition-transform duration-300 group-hover:scale-105"
            />
          </button>
        ))}
      </div>

      <ImageLightbox
        images={images}
        index={index}
        onClose={() => setIndex(null)}
        onIndexChange={setIndex}
      />
    </section>
  );
}
