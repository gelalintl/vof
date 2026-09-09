"use client";

import { useState } from "react";
import type { GalleryImage } from "@/types";
import { homeHighlights } from "@/datas/gallery";
import { cn } from "@/utils/cn";
import { Badge } from "@/ui/design-system/badge";
import { Typography } from "@/ui/design-system/typography";
import { ImageLightbox } from "@/ui/components/ImageLightbox";

export function HighlightsGallery() {
  const [index, setIndex] = useState<number | null>(null);

  return (
    <section className="bg-slate-50" aria-labelledby="galerie-vof">
      <div className="mx-auto max-w-6xl px-4 py-14 sm:px-6">
        <Badge variant="accent">Galerie</Badge>
        <Typography id="galerie-vof" variant="h2" className="mt-3">
          Vivre l&apos;expérience VOF
        </Typography>
        <Typography variant="body" className="mt-3 max-w-2xl text-slate-600">
          Un aperçu de nos cultes, prières et temps forts. Touchez une image
          pour l&apos;afficher en grand.
        </Typography>

        <div className="mt-8 grid grid-cols-2 gap-3 md:grid-cols-4 md:grid-rows-2">
          {homeHighlights.map((image, imageIndex) => (
            <GalleryTile
              key={image.id}
              image={image}
              featured={imageIndex === 0}
              onOpen={() => setIndex(imageIndex)}
            />
          ))}
        </div>
      </div>

      <ImageLightbox
        images={homeHighlights}
        index={index}
        onClose={() => setIndex(null)}
        onIndexChange={setIndex}
      />
    </section>
  );
}

function GalleryTile({
  image,
  featured,
  onOpen,
}: {
  image: GalleryImage;
  featured: boolean;
  onOpen: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onOpen}
      className={cn(
        "group relative overflow-hidden rounded-2xl text-left",
        featured
          ? "col-span-2 row-span-2 min-h-[16rem] md:min-h-[22rem]"
          : "min-h-[8rem] md:min-h-[10.5rem]",
      )}
    >
      {/* Native img: no extra optimizer hop on 3G/4G */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={image.src}
        alt={image.alt}
        loading="lazy"
        decoding="async"
        className="size-full object-cover transition-transform duration-300 group-hover:scale-105"
      />
      {image.caption ? (
        <span className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-slate-950/70 to-transparent px-3 py-3 font-heading text-sm font-bold tracking-tight text-white">
          {image.caption}
        </span>
      ) : null}
    </button>
  );
}
