import type { EventGalleryItem, GalleryImage } from "@/types";

export const homeHighlights: GalleryImage[] = [
  {
    id: "culte",
    src: "/assets/gallery/culte.svg",
    alt: "Assemblée en adoration pendant le culte dominical",
    caption: "Culte dominical",
  },
  {
    id: "priere",
    src: "/assets/gallery/priere.svg",
    alt: "Temps de prière dans la famille VOF",
    caption: "Prière",
  },
  {
    id: "jeunesse",
    src: "/assets/gallery/jeunesse.svg",
    alt: "Jeunesse Voice Of Freedom en louange",
    caption: "Jeunesse",
  },
  {
    id: "seminaire",
    src: "/assets/gallery/seminaire.svg",
    alt: "Séminaire d'enseignement et de foi",
    caption: "Séminaire",
  },
  {
    id: "communion",
    src: "/assets/gallery/communion.svg",
    alt: "Communion fraternelle après le culte",
    caption: "Communion",
  },
];

export function resolveGallerySrc(imageUrl: string | undefined, index: number) {
  if (imageUrl) {
    return imageUrl;
  }
  return homeHighlights[index % homeHighlights.length]?.src ?? "/assets/gallery/culte.svg";
}

export function toGalleryImages(
  items: EventGalleryItem[] | undefined,
): GalleryImage[] {
  if (!items || items.length === 0) {
    return [];
  }

  return items.map((item, itemIndex) => ({
    id: item.id,
    src: resolveGallerySrc(item.imageUrl, itemIndex),
    alt: item.alt,
    caption: item.caption,
  }));
}
