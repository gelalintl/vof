import { unstable_cache } from "next/cache";
import { prisma } from "@/lib/prisma";
import {
  categoryToColor,
  categoryToKind,
  categoryToMonthlyType,
} from "@/lib/eventPresentation";
import type { AdminEventCategory } from "@/types";
import type {
  CalendarEventPayload,
  Event,
  GalleryImage,
  PublicArticle,
} from "@/types";
import { formatEventTime, toDateKey } from "@/utils/date/format";

export const PUBLIC_EVENTS_CACHE_TAG = "public-events";
export const PUBLIC_MEDIA_CACHE_TAG = "public-media";
export const PUBLIC_ARTICLES_CACHE_TAG = "public-articles";

interface EventRow {
  id: string;
  title: string;
  description: string;
  startDate: Date;
  endDate: Date | null;
  location: string;
  category: AdminEventCategory;
  isSpecial: boolean;
  image: string | null;
}

function toPublicEvent(row: EventRow): Event {
  return {
    id: row.id,
    slug: row.id,
    title: row.title,
    description: row.description,
    body: row.description,
    startsAt: row.startDate.toISOString(),
    endsAt: row.endDate?.toISOString(),
    location: row.location,
    kind: categoryToKind(row.category, row.isSpecial),
    colorToken: categoryToColor(row.category, row.isSpecial),
    imageUrl: row.image ?? undefined,
    isFeatured: row.isSpecial,
  };
}

function expandRowToCalendarPayloads(row: EventRow): CalendarEventPayload[] {
  const start = new Date(row.startDate);
  const end = row.endDate ? new Date(row.endDate) : start;
  const sameDay = toDateKey(start) === toDateKey(end);
  const time = formatEventTime(row.startDate.toISOString()) || "09h00";
  const timeEnd =
    sameDay && row.endDate ? formatEventTime(row.endDate.toISOString()) : undefined;
  const type = categoryToMonthlyType(row.category, row.isSpecial);
  const colorToken = categoryToColor(row.category, row.isSpecial);
  const kind = categoryToKind(row.category, row.isSpecial);
  const items: CalendarEventPayload[] = [];
  const cursor = new Date(start.getFullYear(), start.getMonth(), start.getDate());
  const last = new Date(end.getFullYear(), end.getMonth(), end.getDate());

  while (cursor <= last) {
    items.push({
      id: `${row.id}-${toDateKey(cursor)}`,
      title: row.title,
      dateKey: toDateKey(cursor),
      time,
      timeEnd,
      type,
      colorToken,
      location: row.location,
      kind,
      imageUrl: row.image ?? undefined,
    });
    cursor.setDate(cursor.getDate() + 1);
  }

  return items;
}

async function loadPublicEvents(): Promise<Event[]> {
  try {
    const rows = await prisma.event.findMany({
      orderBy: { startDate: "asc" },
    });
    return rows.map(toPublicEvent);
  } catch {
    return [];
  }
}

export const getPublicEvents = unstable_cache(loadPublicEvents, ["public-events"], {
  tags: [PUBLIC_EVENTS_CACHE_TAG],
  revalidate: 60,
});

export async function getUpcomingEvents(limit = 6): Promise<Event[]> {
  const now = new Date();
  const events = await getPublicEvents();
  return events.filter((event) => new Date(event.startsAt) >= now).slice(0, limit);
}

export async function getFeaturedPublicEvents(limit = 6): Promise<Event[]> {
  const upcoming = await getUpcomingEvents(50);
  const featured = upcoming.filter((event) => event.isFeatured);
  return (featured.length > 0 ? featured : upcoming).slice(0, limit);
}

export async function getEventBySlug(slug: string): Promise<Event | null> {
  try {
    const row = await prisma.event.findUnique({ where: { id: slug } });
    return row ? toPublicEvent(row) : null;
  } catch {
    return null;
  }
}

export async function getMonthlyEvents(
  year: number,
  month: number,
): Promise<CalendarEventPayload[]> {
  if (month < 1 || month > 12) {
    throw new RangeError("month must be between 1 and 12");
  }

  const rangeStart = new Date(year, month - 1, 1);
  const rangeEnd = new Date(year, month, 1);

  try {
    const rows = await prisma.event.findMany({
      where: {
        OR: [
          { startDate: { gte: rangeStart, lt: rangeEnd } },
          {
            AND: [
              { startDate: { lt: rangeEnd } },
              { endDate: { gte: rangeStart } },
            ],
          },
        ],
      },
      orderBy: { startDate: "asc" },
    });

    return rows
      .flatMap(expandRowToCalendarPayloads)
      .filter((item) => {
        const [itemYear, itemMonth] = item.dateKey.split("-").map(Number);
        return itemYear === year && itemMonth === month;
      })
      .sort((a, b) => {
        const byDate = a.dateKey.localeCompare(b.dateKey);
        if (byDate !== 0) {
          return byDate;
        }
        return a.time.localeCompare(b.time);
      });
  } catch {
    return [];
  }
}

async function loadFeaturedHomeMedia(): Promise<GalleryImage[]> {
  try {
    const rows = await prisma.media.findMany({
      where: { isFeaturedHome: true },
      orderBy: { createdAt: "desc" },
    });

    return rows.map((item) => ({
      id: item.id,
      src: item.url,
      alt: item.title,
      caption: item.title,
    }));
  } catch {
    return [];
  }
}

export const getFeaturedHomeMedia = unstable_cache(
  loadFeaturedHomeMedia,
  ["featured-home-media"],
  { tags: [PUBLIC_MEDIA_CACHE_TAG], revalidate: 60 },
);

async function loadPublishedArticles(): Promise<PublicArticle[]> {
  try {
    const rows = await prisma.article.findMany({
      where: { isPublished: true },
      orderBy: { createdAt: "desc" },
    });

    return rows.map((article) => ({
      id: article.id,
      slug: article.slug,
      title: article.title,
      content: article.content,
      author: article.author,
      coverImage: article.coverImage,
      createdAt: article.createdAt.toISOString(),
    }));
  } catch {
    return [];
  }
}

export const getPublishedArticles = unstable_cache(
  loadPublishedArticles,
  ["published-articles"],
  { tags: [PUBLIC_ARTICLES_CACHE_TAG], revalidate: 60 },
);

export async function getArticleBySlug(slug: string): Promise<PublicArticle | null> {
  try {
    const article = await prisma.article.findFirst({
      where: { slug, isPublished: true },
    });

    if (!article) {
      return null;
    }

    return {
      id: article.id,
      slug: article.slug,
      title: article.title,
      content: article.content,
      author: article.author,
      coverImage: article.coverImage,
      createdAt: article.createdAt.toISOString(),
    };
  } catch {
    return null;
  }
}
