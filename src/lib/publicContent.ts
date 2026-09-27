import { unstable_cache } from "next/cache";
import { prisma } from "@/lib/prisma";
import {
  categoryToColor,
  categoryToKind,
  categoryToMonthlyType,
} from "@/lib/eventPresentation";
import { getMonthlyEvents as getProjectedMonthlyEvents } from "@/lib/getMonthlyEvents";
import type { AdminEventCategory, AdminRecurrenceType } from "@/types";
import type {
  CalendarEventPayload,
  Department,
  Event,
  GalleryImage,
  PublicArticle,
  PublicPastor,
  PublicProject,
  PublicRecurringGathering,
} from "@/types";
import { formatEventTime, toDateKey } from "@/utils/date/format";
import { extractYoutubeId } from "@/lib/youtube";
import { isProjectStatus, projectProgress } from "@/lib/donations";

export const PUBLIC_EVENTS_CACHE_TAG = "public-events";
export const PUBLIC_MEDIA_CACHE_TAG = "public-media";
export const PUBLIC_ARTICLES_CACHE_TAG = "public-articles";
export const PUBLIC_PASTORS_CACHE_TAG = "public-pastors";
export const PUBLIC_DEPARTMENTS_CACHE_TAG = "public-departments";
export const PUBLIC_PROJECTS_CACHE_TAG = "public-projects";

const PUBLIC_EVENT_SELECT = {
  id: true,
  slug: true,
  title: true,
  description: true,
  startDate: true,
  endDate: true,
  location: true,
  category: true,
  isSpecial: true,
  isFeatured: true,
  image: true,
  youtubeUrl: true,
} as const;

interface EventRow {
  id: string;
  slug?: string | null;
  title: string;
  description: string;
  startDate: Date;
  endDate: Date | null;
  location: string;
  category: AdminEventCategory;
  isSpecial: boolean;
  isFeatured: boolean;
  image: string | null;
  youtubeUrl: string | null;
}

function toPublicEvent(row: EventRow): Event {
  return {
    id: row.id,
    slug: row.slug || row.id,
    title: row.title,
    description: row.description,
    body: row.description,
    startsAt: row.startDate.toISOString(),
    endsAt: row.endDate?.toISOString(),
    location: row.location,
    kind: categoryToKind(row.category, row.isSpecial),
    colorToken: categoryToColor(row.category, row.isSpecial),
    imageUrl: row.image ?? undefined,
    youtubeId: extractYoutubeId(row.youtubeUrl) ?? undefined,
    isFeatured: row.isFeatured,
  };
}

async function loadPublicEvents(): Promise<Event[]> {
  try {
    const rows = await prisma.event.findMany({
      select: PUBLIC_EVENT_SELECT,
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
  const featured = events.find((event) => event.isFeatured);
  const upcoming = events.filter(
    (event) => new Date(event.startsAt) >= now && event.id !== featured?.id,
  );
  const list = featured ? [featured, ...upcoming] : upcoming;
  return list.slice(0, limit);
}

export async function getSpotlightEvent(): Promise<Event | null> {
  const events = await getPublicEvents();
  const featured = events.find((event) => event.isFeatured);
  if (featured) {
    return featured;
  }

  const now = new Date();
  const upcoming = events.filter((event) => new Date(event.startsAt) >= now);
  if (upcoming.length === 0) {
    return null;
  }

  return (
    upcoming.find((event) => event.kind === "special") ??
    upcoming.find((event) => event.colorToken === "secondary" || event.colorToken === "impact") ??
    upcoming[0]
  );
}

export async function getEventBySlug(slug: string): Promise<Event | null> {
  try {
    const row = await prisma.event.findFirst({
      where: { OR: [{ slug }, { id: slug }] },
      select: PUBLIC_EVENT_SELECT,
    });
    return row ? toPublicEvent(row) : null;
  } catch {
    return null;
  }
}

const WEEKDAY_LABELS_FR = [
  "Dimanche",
  "Lundi",
  "Mardi",
  "Mercredi",
  "Jeudi",
  "Vendredi",
  "Samedi",
] as const;

const RECURRENCE_SORT_RANK: Record<Exclude<AdminRecurrenceType, "NONE">, number> = {
  DAILY: 0,
  WEEKLY: 1,
  MONTHLY: 2,
  FIRST_3_DAYS_MONTH: 3,
  SECOND_AND_LAST_FRIDAY: 4,
};

function mondayFirst(day: number) {
  return (day + 6) % 7;
}

function recurrenceRank(type: AdminRecurrenceType) {
  if (type === "NONE") {
    return 99;
  }
  return RECURRENCE_SORT_RANK[type];
}

function formatTimeRange(startDate: Date, endDate: Date | null) {
  const startLabel = formatEventTime(startDate.toISOString());
  const endLabel = endDate ? formatEventTime(endDate.toISOString()) : "";
  if (startLabel && endLabel && endLabel !== startLabel) {
    return `${startLabel} – ${endLabel}`;
  }
  return startLabel;
}

export function formatRecurrenceLabel(
  recurrenceType: AdminRecurrenceType,
  daysOfWeek: number[] = [],
  startDate?: Date,
) {
  if (recurrenceType === "WEEKLY") {
    const days = (
      daysOfWeek.length > 0 ? daysOfWeek : startDate ? [startDate.getDay()] : []
    )
      .slice()
      .sort((left, right) => mondayFirst(left) - mondayFirst(right));
    if (days.length === 0) {
      return "Hebdomadaire";
    }
    return days.map((day) => WEEKDAY_LABELS_FR[day]).join(", ");
  }
  if (recurrenceType === "FIRST_3_DAYS_MONTH") {
    return "1er, 2e et 3e du mois";
  }
  if (recurrenceType === "SECOND_AND_LAST_FRIDAY") {
    return "2e et dernier vendredi du mois";
  }
  if (recurrenceType === "DAILY") {
    return "Tous les jours";
  }
  if (recurrenceType === "MONTHLY") {
    return "Mensuel";
  }
  return "";
}

function primaryWeekday(row: {
  recurrenceType: AdminRecurrenceType;
  daysOfWeek: number[];
  startDate: Date;
}) {
  if (row.recurrenceType === "WEEKLY") {
    const days = row.daysOfWeek.length > 0 ? row.daysOfWeek : [row.startDate.getDay()];
    return Math.min(...days.map(mondayFirst));
  }
  if (row.recurrenceType === "SECOND_AND_LAST_FRIDAY") {
    return mondayFirst(5);
  }
  if (row.recurrenceType === "DAILY") {
    return 0;
  }
  return mondayFirst(row.startDate.getDay());
}

async function loadRecurringGatherings(): Promise<PublicRecurringGathering[]> {
  try {
    const rows = await prisma.event.findMany({
      where: { recurrenceType: { not: "NONE" } },
      select: {
        id: true,
        title: true,
        startDate: true,
        endDate: true,
        recurrenceType: true,
        daysOfWeek: true,
      },
      orderBy: { startDate: "asc" },
    });

    return rows
      .map((row) => ({
        id: row.id,
        title: row.title,
        scheduleLabel: formatRecurrenceLabel(
          row.recurrenceType,
          row.daysOfWeek,
          row.startDate,
        ),
        timeLabel: formatTimeRange(row.startDate, row.endDate),
        recurrenceType: row.recurrenceType,
        daysOfWeek: row.daysOfWeek,
        startDate: row.startDate,
      }))
      .sort((left, right) => {
        const byType = recurrenceRank(left.recurrenceType) - recurrenceRank(right.recurrenceType);
        if (byType !== 0) {
          return byType;
        }
        const byDay = primaryWeekday(left) - primaryWeekday(right);
        if (byDay !== 0) {
          return byDay;
        }
        return left.startDate.getTime() - right.startDate.getTime();
      })
      .map(({ startDate: _startDate, ...gathering }) => gathering);
  } catch {
    return [];
  }
}

export const getRecurringGatherings = unstable_cache(
  loadRecurringGatherings,
  ["recurring-gatherings"],
  { tags: [PUBLIC_EVENTS_CACHE_TAG], revalidate: 60 },
);

export async function getMonthlyEvents(
  year: number,
  month: number,
): Promise<CalendarEventPayload[]> {
  const projected = await getProjectedMonthlyEvents(year, month);

  return projected.map((event) => {
    return {
      id: event.id,
      title: event.title,
      dateKey: toDateKey(event.startDate),
      time: formatEventTime(event.startDate.toISOString()) || "09h00",
      timeEnd: event.endDate
        ? formatEventTime(event.endDate.toISOString())
        : undefined,
      type: categoryToMonthlyType(event.category, event.isSpecial),
      colorToken: categoryToColor(event.category, event.isSpecial),
      location: event.location,
      kind: categoryToKind(event.category, event.isSpecial),
      imageUrl: event.image ?? undefined,
    };
  });
}

async function loadFeaturedHomeMedia(): Promise<GalleryImage[]> {
  try {
    const rows = await prisma.media.findMany({
      where: { isFeaturedHome: true },
      select: { id: true, url: true, title: true },
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
      select: {
        id: true,
        slug: true,
        title: true,
        content: true,
        author: true,
        coverImage: true,
        galleryImages: true,
        youtubeUrl: true,
        isFeatured: true,
        createdAt: true,
      },
      orderBy: [{ isFeatured: "desc" }, { createdAt: "desc" }],
    });

    return rows.map((article) => ({
      id: article.id,
      slug: article.slug,
      title: article.title,
      content: article.content,
      author: article.author,
      coverImage: article.coverImage,
      galleryImages: article.galleryImages ?? [],
      youtubeUrl: article.youtubeUrl ?? null,
      isFeatured: article.isFeatured,
      comments: [],
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

async function loadPublicPastors(): Promise<PublicPastor[]> {
  try {
    const rows = await prisma.pastor.findMany({
      select: {
        id: true,
        name: true,
        role: true,
        bio: true,
        quote: true,
        image: true,
        order: true,
      },
      orderBy: [{ order: "asc" }, { name: "asc" }],
    });

    return rows.map((pastor) => ({
      id: pastor.id,
      name: pastor.name,
      role: pastor.role,
      bio: pastor.bio,
      quote: pastor.quote,
      image: pastor.image,
      order: pastor.order,
    }));
  } catch {
    return [];
  }
}

export const getPublicPastors = unstable_cache(loadPublicPastors, ["public-pastors"], {
  tags: [PUBLIC_PASTORS_CACHE_TAG],
  revalidate: 60,
});

async function loadPublicDepartments(): Promise<Department[]> {
  try {
    const rows = await prisma.department.findMany({
      select: {
        id: true,
        slug: true,
        name: true,
        description: true,
        responsible: true,
        contact: true,
        image: true,
      },
      orderBy: { order: "asc" },
    });

    return rows.map((department) => ({
      id: department.id,
      slug: department.slug,
      name: department.name,
      description: department.description,
      leader: department.responsible ?? undefined,
      contact: department.contact ?? undefined,
      image: department.image ?? undefined,
    }));
  } catch {
    return [];
  }
}

export const getPublicDepartments = unstable_cache(
  loadPublicDepartments,
  ["public-departments"],
  { tags: [PUBLIC_DEPARTMENTS_CACHE_TAG], revalidate: 60 },
);

function toPublicProject(row: {
  id: string;
  title: string;
  slug: string;
  description: string;
  category: string | null;
  targetAmount: number;
  currentAmount: number;
  image: string | null;
  status: string;
  isFeatured: boolean;
}): PublicProject {
  return {
    id: row.id,
    title: row.title,
    slug: row.slug,
    description: row.description,
    category: row.category,
    targetAmount: row.targetAmount,
    currentAmount: row.currentAmount,
    image: row.image,
    status: isProjectStatus(row.status) ? row.status : "IN_PROGRESS",
    isFeatured: row.isFeatured,
    progress: projectProgress(row.currentAmount, row.targetAmount),
  };
}

async function loadPublicProjects(activeOnly = false): Promise<PublicProject[]> {
  try {
    const rows = await prisma.project.findMany({
      where: activeOnly ? { status: "IN_PROGRESS" } : undefined,
      orderBy: [{ isFeatured: "desc" }, { order: "asc" }, { createdAt: "desc" }],
    });
    return rows.map(toPublicProject);
  } catch {
    return [];
  }
}

export const getPublicProjects = unstable_cache(
  () => loadPublicProjects(false),
  ["public-projects"],
  { tags: [PUBLIC_PROJECTS_CACHE_TAG], revalidate: 60 },
);

export const getActivePublicProjects = unstable_cache(
  () => loadPublicProjects(true),
  ["public-projects-active"],
  { tags: [PUBLIC_PROJECTS_CACHE_TAG], revalidate: 60 },
);

export async function getArticleBySlug(slug: string): Promise<PublicArticle | null> {
  try {
    const article = await prisma.article.findFirst({
      where: { slug, isPublished: true },
      select: {
        id: true,
        slug: true,
        title: true,
        content: true,
        author: true,
        coverImage: true,
        galleryImages: true,
        youtubeUrl: true,
        isFeatured: true,
        createdAt: true,
        comments: {
          where: { isApproved: true },
          orderBy: { createdAt: "asc" },
          select: {
            id: true,
            authorName: true,
            content: true,
            likesCount: true,
            createdAt: true,
          },
        },
      },
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
      galleryImages: article.galleryImages ?? [],
      youtubeUrl: article.youtubeUrl ?? null,
      isFeatured: article.isFeatured,
      comments: article.comments.map((comment) => ({
        id: comment.id,
        authorName: comment.authorName,
        content: comment.content,
        likesCount: comment.likesCount ?? 0,
        createdAt: comment.createdAt.toISOString(),
      })),
      createdAt: article.createdAt.toISOString(),
    };
  } catch {
    return null;
  }
}
