import type {
  Event,
  EventColorToken,
  EventHeadlineData,
  EventKind,
  GalleryImage,
  MediaCardData,
  MonthlyEventType,
} from "@/types";
import type { AdminEventCategory } from "@/types";
import { formatEventDate, formatEventTime } from "@/utils/date/format";

export const eventKindLabels: Record<EventKind, string> = {
  culte: "Culte",
  enseignement: "Enseignement",
  seminaire: "Séminaire",
  conference: "Conférence",
  jeunesse: "Jeunesse",
  special: "Temps fort",
  priere: "Rassemblement",
};

export function categoryToKind(
  category: AdminEventCategory,
  isSpecial: boolean,
): EventKind {
  if (isSpecial || category === "SPECIAL") {
    return "special";
  }
  return "priere";
}

export function categoryToColor(
  category: AdminEventCategory,
  isSpecial: boolean,
): EventColorToken {
  if (category === "FASTING") {
    return "impact";
  }
  if (category === "VIGIL") {
    return "secondary";
  }
  if (category === "SPECIAL" || isSpecial) {
    return "impact";
  }
  return "brand";
}

export function categoryToMonthlyType(
  category: AdminEventCategory,
  isSpecial: boolean,
): MonthlyEventType {
  if (category === "FASTING") {
    return "fasting";
  }
  if (category === "VIGIL") {
    return "vigil";
  }
  if (category === "SPECIAL" || isSpecial) {
    return "special";
  }
  return "prayer";
}

export function toMediaCard(event: Event): MediaCardData {
  const time = formatEventTime(event.startsAt);

  return {
    href: `/vie-de-leglise/${event.slug}`,
    title: event.title,
    imageAlt: event.title,
    imageSrc: event.imageUrl,
    badge: eventKindLabels[event.kind],
    description: event.description,
    location: event.location,
    dateLabel: `${formatEventDate(event.startsAt)}${time ? ` · ${time}` : ""}`,
    colorToken: event.colorToken,
  };
}

export function toEventHeadline(event: Event): EventHeadlineData {
  const time = formatEventTime(event.startsAt);

  return {
    badge: eventKindLabels[event.kind],
    title: event.title,
    dateLabel: `${formatEventDate(event.startsAt)}${time ? ` · ${time}` : ""}`,
    location: event.location,
    colorToken: event.colorToken,
  };
}

export function toEventDetailView(event: Event) {
  const gallery: GalleryImage[] = event.imageUrl
    ? [{ id: event.id, src: event.imageUrl, alt: event.title }]
    : event.gallery
      ? event.gallery.map((item) => ({
          id: item.id,
          src: item.imageUrl ?? event.imageUrl ?? "",
          alt: item.alt || event.title,
          caption: item.caption,
        })).filter((item) => item.src)
      : [];

  return {
    headline: toEventHeadline(event),
    body: event.body ?? event.description,
    gallery,
    author: event.author,
    youtubeId: event.youtubeId,
    cover: {
      alt: event.title,
      src: event.imageUrl,
      colorToken: event.colorToken,
    },
    comments: event.comments ?? [],
    title: event.title,
  };
}
