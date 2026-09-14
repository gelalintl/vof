import type { GalleryImage as GalleryImageData, GalleryLayout } from "@/types";
import { cn } from "@/utils/cn";

export interface GalleryImageProps {
  image: GalleryImageData;
  featured?: boolean;
  layout?: GalleryLayout;
  onOpen?: () => void;
}

export function GalleryImage({
  image,
  featured = false,
  layout = "grid",
  onOpen,
}: GalleryImageProps) {
  const frameClass = cn(
    "group relative overflow-hidden rounded-2xl text-left",
    layout === "bento" && featured
      ? "col-span-2 row-span-2 min-h-[16rem] md:min-h-[22rem]"
      : layout === "bento"
        ? "min-h-[8rem] md:min-h-[10.5rem]"
        : "aspect-[4/3] w-full",
  );

  const media = (
    <>
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
    </>
  );

  if (!onOpen) {
    return <figure className={frameClass}>{media}</figure>;
  }

  return (
    <button
      type="button"
      onClick={onOpen}
      aria-haspopup="dialog"
      aria-label={image.caption ?? image.alt}
      className={frameClass}
    >
      {media}
    </button>
  );
}
