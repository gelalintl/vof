"use client";

import { useState } from "react";
import type { GalleryImage as GalleryImageData, GalleryLayout } from "@/types";
import { cn } from "@/utils/cn";
import { ImageLightbox } from "@/ui/components/media/ImageLightbox";
import { GalleryImage } from "./GalleryImage";
import { Typography } from "@/ui/design-system/typography";

export interface GalleryGridProps {
  images: GalleryImageData[];
  layout?: GalleryLayout;
  withLightbox?: boolean;
  className?: string;
  title?: string;
  titleId?: string;
}

export function GalleryGrid({
  images,
  layout = "grid",
  withLightbox = true,
  className,
  title,
  titleId,
}: GalleryGridProps) {
  const [index, setIndex] = useState<number | null>(null);

  if (images.length === 0) {
    return null;
  }

  return (
    <div className="flex flex-col gap-6">
      {title ? (
        <Typography id={titleId} variant="h3">
          {title}
        </Typography>
      ) : null}
      <div
        className={cn(
          layout === "bento"
            ? "grid grid-cols-2 gap-3 md:grid-cols-4 md:grid-rows-2"
            : "grid grid-cols-2 gap-3 sm:grid-cols-3",
          className,
        )}
      >
        {images.map((image, imageIndex) => (
          <GalleryImage
            key={image.id}
            image={image}
            layout={layout}
            featured={layout === "bento" && imageIndex === 0}
            onOpen={withLightbox ? () => setIndex(imageIndex) : undefined}
          />
        ))}
      </div>
      {withLightbox ? (
        <ImageLightbox
          images={images}
          index={index}
          onClose={() => setIndex(null)}
          onIndexChange={setIndex}
        />
      ) : null}
    </div>
  );
}
