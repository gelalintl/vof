import { unstable_cache } from "next/cache";
import type { Locale } from "@/i18n/config";
import { getRequestLocale, localizedOptional, localizedText } from "@/i18n/localized";
import { prisma } from "@/lib/prisma";
import {
  categoryToColor,
  categoryToKind,
  categoryToMonthlyType,
} from "@/lib/eventPresentation";
import {
  getMonthlyEvents as getProjectedMonthlyEvents,
  nextRecurringOccurrence,
  type RecurringEventRow,
} from "@/lib/getMonthlyEvents";
import type { AdminEventCategory, AdminRecurrenceType } from "@/types";
import type {
  CalendarEventPayload,
  Department,
  Event,
  GalleryImage,
  PublicArticle,
  PublicArticleComment,
  PublicPastor,
  PublicProject,
  PublicRecurringGathering,
  PublicTestimonial,
} from "@/types";
import { formatEventTime, formatPublicationDate, toDateKey } from "@/utils/date/format";
import { extractYoutubeId } from "@/lib/youtube";
import { isProjectStatus, projectProgress } from "@/lib/donations";

export const PUBLIC_EVENTS_CACHE_TAG = "public-events";
export const PUBLIC_MEDIA_CACHE_TAG = "public-media";
export const PUBLIC_ARTICLES_CACHE_TAG = "public-articles";
export const PUBLIC_PASTORS_CACHE_TAG = "public-pastors";
export const PUBLIC_DEPARTMENTS_CACHE_TAG = "public-departments";
export const PUBLIC_PROJECTS_CACHE_TAG = "public-projects";
export const PUBLIC_TESTIMONIALS_CACHE_TAG = "public-testimonials";

const PUBLIC_EVENT_SELECT = {
  id: true,
  slug: true,
  title: true,
  titleEn: true,
  description: true,
  descriptionEn: true,
  startDate: true,
  endDate: true,
  location: true,
  locationEn: true,
  theme: true,
  themeEn: true,
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
  titleEn: string | null;
  description: string;
  descriptionEn: string | null;
  startDate: Date;
  endDate: Date | null;
  location: string;
  locationEn: string | null;
  theme: string | null;
  themeEn: string | null;
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
    titleEn: row.titleEn,
    description: row.description,
    descriptionEn: row.descriptionEn,
    body: row.description,
    startsAt: row.startDate.toISOString(),
    endsAt: row.endDate?.toISOString(),
    location: row.location,
    locationEn: row.locationEn,
    theme: row.theme,
    themeEn: row.themeEn,
    kind: categoryToKind(row.category, row.isSpecial),
    colorToken: categoryToColor(row.category, row.isSpecial),
    imageUrl: row.image ?? undefined,
    youtubeId: extractYoutubeId(row.youtubeUrl) ?? undefined,
    isFeatured: row.isFeatured,
  };
}

function localizeEvent(event: Event, locale: Locale): Event {
  return {
    ...event,
    title: localizedText(locale, event.title, event.titleEn),
    description: localizedText(locale, event.description, event.descriptionEn),
    body: localizedText(locale, event.body ?? event.description, event.descriptionEn),
    location: localizedText(locale, event.location, event.locationEn),
    theme: localizedOptional(locale, event.theme, event.themeEn),
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

/** Encore affichable : fin non dépassée, ou début encore à venir s'il n'y a pas de fin. */
function isCurrentEvent(event: Pick<Event, "startsAt" | "endsAt">, now: Date) {
  if (event.endsAt) {
    return new Date(event.endsAt).getTime() >= now.getTime();
  }
  return new Date(event.startsAt).getTime() >= now.getTime();
}

const FEATURED_EVENT_SELECT = {
  ...PUBLIC_EVENT_SELECT,
  isExclusive: true,
  recurrenceType: true,
  daysOfWeek: true,
  recurrenceEndDate: true,
  durationDays: true,
  excludedDates: true,
  themes: {
    select: { startDate: true, endDate: true, theme: true, themeEn: true },
  },
} as const;

type SpotlightRow = RecurringEventRow & {
  slug: string | null;
  titleEn: string | null;
  descriptionEn: string | null;
  locationEn: string | null;
  isFeatured: boolean;
  youtubeUrl: string | null;
};

function projectRowForDisplay(row: SpotlightRow, now: Date, locale: Locale): Event | null {
  if (row.recurrenceType !== "NONE") {
    const next = nextRecurringOccurrence(row, now, locale);
    if (!next) {
      return null;
    }
    return localizeEvent(
      {
        ...toPublicEvent(row),
        startsAt: next.startDate.toISOString(),
        endsAt: next.endDate?.toISOString(),
        theme: next.theme ?? null,
        themeEn: null,
      },
      locale,
    );
  }

  const event = toPublicEvent(row);
  return isCurrentEvent(event, now) ? localizeEvent(event, locale) : null;
}

async function loadFeaturedEvent(now: Date, locale: Locale): Promise<Event | null> {
  const row = await prisma.event.findFirst({
    where: { isFeatured: true },
    select: FEATURED_EVENT_SELECT,
  });
  return row ? projectRowForDisplay(row, now, locale) : null;
}

async function loadNextSpotlightFallback(now: Date, locale: Locale): Promise<Event | null> {
  const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const rows = await prisma.event.findMany({
    where: {
      OR: [
        {
          recurrenceType: "NONE",
          OR: [{ endDate: { gte: now } }, { endDate: null, startDate: { gte: now } }],
        },
        {
          recurrenceType: { not: "NONE" },
          OR: [{ recurrenceEndDate: null }, { recurrenceEndDate: { gte: startOfToday } }],
        },
      ],
    },
    select: FEATURED_EVENT_SELECT,
  });

  const projected = rows
    .map((row) => projectRowForDisplay(row, now, locale))
    .filter((event): event is Event => Boolean(event))
    .sort((left, right) => new Date(left.startsAt).getTime() - new Date(right.startsAt).getTime());

  return projected[0] ?? null;
}

export async function getUpcomingEvents(limit = 6): Promise<Event[]> {
  const now = new Date();
  const locale = await getRequestLocale();
  const [events, featured] = await Promise.all([
    getPublicEvents(),
    loadFeaturedEvent(now, locale),
  ]);
  const upcoming = events
    .filter((event) => isCurrentEvent(event, now) && event.id !== featured?.id)
    .map((event) => localizeEvent(event, locale));
  const list = featured ? [featured, ...upcoming] : upcoming;
  return list.slice(0, limit);
}

export async function getSpotlightEvent(): Promise<Event | null> {
  const now = new Date();
  const locale = await getRequestLocale();

  try {
    const featured = await loadFeaturedEvent(now, locale);
    if (featured) {
      return featured;
    }

    return await loadNextSpotlightFallback(now, locale);
  } catch {
    return null;
  }
}

export async function getApprovedEventComments(eventId: string): Promise<PublicArticleComment[]> {
  const id = eventId.trim();
  if (!id) {
    return [];
  }
  try {
    const rows = await prisma.comment.findMany({
      where: { eventId: id, isApproved: true },
      orderBy: { createdAt: "asc" },
      select: {
        id: true,
        authorName: true,
        content: true,
        likesCount: true,
        createdAt: true,
      },
    });
    return rows.map((comment) => ({
      id: comment.id,
      authorName: comment.authorName,
      content: comment.content,
      likesCount: comment.likesCount ?? 0,
      createdAt: comment.createdAt.toISOString(),
    }));
  } catch {
    return [];
  }
}

export async function getEventBySlug(slug: string): Promise<Event | null> {
  try {
    const row = await prisma.event.findFirst({
      where: { OR: [{ slug }, { id: slug }] },
      select: PUBLIC_EVENT_SELECT,
    });
    if (!row) {
      return null;
    }
    return localizeEvent(toPublicEvent(row), await getRequestLocale());
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

export type RecurrenceCopy = {
  weekdaysLong: readonly string[];
  weekly: string;
  daily: string;
  monthly: string;
  first3Days: string;
  secondAndLastFriday: string;
};

const FRENCH_RECURRENCE: RecurrenceCopy = {
  weekdaysLong: WEEKDAY_LABELS_FR,
  weekly: "Hebdomadaire",
  daily: "Tous les jours",
  monthly: "Mensuel",
  first3Days: "1er, 2e et 3e du mois",
  secondAndLastFriday: "2e et dernier vendredi du mois",
};

export function formatTimeRange(
  startIso: string,
  endIso: string | null,
  locale: Locale = "fr",
) {
  const startLabel = formatEventTime(startIso, locale);
  const endLabel = endIso ? formatEventTime(endIso, locale) : "";
  if (startLabel && endLabel && endLabel !== startLabel) {
    return `${startLabel} – ${endLabel}`;
  }
  return startLabel;
}

export function formatRecurrenceLabel(
  recurrenceType: AdminRecurrenceType,
  daysOfWeek: number[] = [],
  startDate?: Date,
  copy: RecurrenceCopy = FRENCH_RECURRENCE,
) {
  if (recurrenceType === "WEEKLY") {
    const days = (
      daysOfWeek.length > 0 ? daysOfWeek : startDate ? [startDate.getDay()] : []
    )
      .slice()
      .sort((left, right) => mondayFirst(left) - mondayFirst(right));
    if (days.length === 0) {
      return copy.weekly;
    }
    return days.map((day) => copy.weekdaysLong[day] ?? "").join(", ");
  }
  if (recurrenceType === "FIRST_3_DAYS_MONTH") {
    return copy.first3Days;
  }
  if (recurrenceType === "SECOND_AND_LAST_FRIDAY") {
    return copy.secondAndLastFriday;
  }
  if (recurrenceType === "DAILY") {
    return copy.daily;
  }
  if (recurrenceType === "MONTHLY") {
    return copy.monthly;
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
        titleEn: true,
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
        titleEn: row.titleEn,
        recurrenceType: row.recurrenceType,
        daysOfWeek: row.daysOfWeek,
        startIso: row.startDate.toISOString(),
        endIso: row.endDate ? row.endDate.toISOString() : null,
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

const getRecurringGatheringsCached = unstable_cache(
  loadRecurringGatherings,
  ["recurring-gatherings-raw"],
  { tags: [PUBLIC_EVENTS_CACHE_TAG], revalidate: 60 },
);

export async function getRecurringGatherings() {
  const [gatherings, locale] = await Promise.all([
    getRecurringGatheringsCached(),
    getRequestLocale(),
  ]);
  return gatherings.map((gathering) => ({
    ...gathering,
    title: localizedText(locale, gathering.title, gathering.titleEn),
  }));
}

export async function getMonthlyEvents(
  year: number,
  month: number,
  localeOverride?: Locale,
): Promise<CalendarEventPayload[]> {
  const locale = localeOverride ?? (await getRequestLocale());
  const projected = await getProjectedMonthlyEvents(year, month, locale);
  const fallbackTime = locale === "en" ? "09:00" : "09h00";

  return projected.map((event) => {
    return {
      id: event.id,
      title: event.title,
      dateKey: toDateKey(event.startDate),
      time: formatEventTime(event.startDate.toISOString(), locale) || fallbackTime,
      timeEnd: event.endDate
        ? formatEventTime(event.endDate.toISOString(), locale) || undefined
        : undefined,
      type: categoryToMonthlyType(event.category, event.isSpecial),
      colorToken: categoryToColor(event.category, event.isSpecial),
      location: event.location,
      kind: categoryToKind(event.category, event.isSpecial),
      imageUrl: event.image ?? undefined,
      theme: event.theme || undefined,
    };
  });
}

interface GallerySource {
  id: string;
  src: string;
  mediaTitle: string;
  eventTitle: string | null;
  eventTitleEn: string | null;
  dateIso: string;
}

function toGalleryImage(item: GallerySource, locale: Locale): GalleryImage {
  const eventTitle = item.eventTitle
    ? localizedText(locale, item.eventTitle, item.eventTitleEn)
    : null;
  const title = eventTitle || item.mediaTitle;
  const dateLabel = formatPublicationDate(item.dateIso, locale);
  return {
    id: item.id,
    src: item.src,
    alt: title,
    caption: dateLabel ? `${title} · ${dateLabel}` : title,
  };
}

async function loadFeaturedHomeMedia(): Promise<GallerySource[]> {
  try {
    const rows = await prisma.media.findMany({
      where: { isFeaturedHome: true },
      select: {
        id: true,
        url: true,
        title: true,
        createdAt: true,
        event: {
          select: { title: true, titleEn: true, startDate: true },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    return rows.map((item) => ({
      id: item.id,
      src: item.url,
      mediaTitle: item.title,
      eventTitle: item.event?.title ?? null,
      eventTitleEn: item.event?.titleEn ?? null,
      dateIso: (item.event?.startDate ?? item.createdAt).toISOString(),
    }));
  } catch {
    return [];
  }
}

const getFeaturedHomeMediaCached = unstable_cache(
  loadFeaturedHomeMedia,
  ["featured-home-media"],
  { tags: [PUBLIC_MEDIA_CACHE_TAG], revalidate: 60 },
);

export async function getFeaturedHomeMedia() {
  const [items, locale] = await Promise.all([
    getFeaturedHomeMediaCached(),
    getRequestLocale(),
  ]);
  return items.map((item) => toGalleryImage(item, locale));
}

async function loadAllGalleryMedia(): Promise<GallerySource[]> {
  try {
    const rows = await prisma.media.findMany({
      select: {
        id: true,
        url: true,
        title: true,
        createdAt: true,
        event: {
          select: { title: true, titleEn: true, startDate: true },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    return rows.map((item) => ({
      id: item.id,
      src: item.url,
      mediaTitle: item.title,
      eventTitle: item.event?.title ?? null,
      eventTitleEn: item.event?.titleEn ?? null,
      dateIso: (item.event?.startDate ?? item.createdAt).toISOString(),
    }));
  } catch {
    return [];
  }
}

const getAllGalleryMediaCached = unstable_cache(
  loadAllGalleryMedia,
  ["all-gallery-media"],
  { tags: [PUBLIC_MEDIA_CACHE_TAG], revalidate: 60 },
);

export async function getAllGalleryMedia() {
  const [items, locale] = await Promise.all([
    getAllGalleryMediaCached(),
    getRequestLocale(),
  ]);
  return items.map((item) => toGalleryImage(item, locale));
}

async function loadPublishedArticles(): Promise<PublicArticle[]> {
  try {
    const rows = await prisma.article.findMany({
      where: { isPublished: true },
      select: {
        id: true,
        slug: true,
        title: true,
        titleEn: true,
        content: true,
        contentEn: true,
        author: true,
        coverImage: true,
        galleryImages: true,
        youtubeUrl: true,
        isFeatured: true,
        publishedAt: true,
        createdAt: true,
      },
      orderBy: [{ isFeatured: "desc" }, { publishedAt: "desc" }],
    });

    return rows.map((article) => ({
      id: article.id,
      slug: article.slug,
      title: article.title,
      titleEn: article.titleEn,
      content: article.content,
      contentEn: article.contentEn,
      author: article.author,
      coverImage: article.coverImage,
      galleryImages: article.galleryImages ?? [],
      youtubeUrl: article.youtubeUrl ?? null,
      isFeatured: article.isFeatured,
      comments: [],
      publishedAt: toDateKey(article.publishedAt),
      createdAt: article.createdAt.toISOString(),
    }));
  } catch {
    return [];
  }
}

const getPublishedArticlesCached = unstable_cache(
  loadPublishedArticles,
  ["published-articles"],
  { tags: [PUBLIC_ARTICLES_CACHE_TAG], revalidate: 60 },
);

function localizeArticle<T extends { title: string; titleEn?: string | null; content: string; contentEn?: string | null }>(
  article: T,
  locale: Locale,
): T {
  return {
    ...article,
    title: localizedText(locale, article.title, article.titleEn),
    content: localizedText(locale, article.content, article.contentEn),
  };
}

export async function getPublishedArticles() {
  const [articles, locale] = await Promise.all([
    getPublishedArticlesCached(),
    getRequestLocale(),
  ]);
  return articles.map((article) => localizeArticle(article, locale));
}

async function loadPublicPastors(): Promise<PublicPastor[]> {
  try {
    const rows = await prisma.pastor.findMany({
      select: {
        id: true,
        name: true,
        role: true,
        roleEn: true,
        bio: true,
        bioEn: true,
        quote: true,
        quoteEn: true,
        image: true,
        order: true,
      },
      orderBy: [{ order: "asc" }, { name: "asc" }],
    });

    return rows.map((pastor) => ({
      id: pastor.id,
      name: pastor.name,
      role: pastor.role,
      roleEn: pastor.roleEn,
      bio: pastor.bio,
      bioEn: pastor.bioEn,
      quote: pastor.quote,
      quoteEn: pastor.quoteEn,
      image: pastor.image,
      order: pastor.order,
    }));
  } catch {
    return [];
  }
}

const getPublicPastorsCached = unstable_cache(loadPublicPastors, ["public-pastors-bio-en"], {
  tags: [PUBLIC_PASTORS_CACHE_TAG],
  revalidate: 60,
});

export async function getPublicPastors() {
  return getPublicPastorsCached();
}

async function loadPublicDepartments(): Promise<Department[]> {
  try {
    const rows = await prisma.department.findMany({
      select: {
        id: true,
        slug: true,
        name: true,
        nameEn: true,
        description: true,
        descriptionEn: true,
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
      nameEn: department.nameEn,
      description: department.description,
      descriptionEn: department.descriptionEn,
      leader: department.responsible ?? undefined,
      contact: department.contact ?? undefined,
      image: department.image ?? undefined,
    }));
  } catch {
    return [];
  }
}

const getPublicDepartmentsCached = unstable_cache(
  loadPublicDepartments,
  ["public-departments"],
  { tags: [PUBLIC_DEPARTMENTS_CACHE_TAG], revalidate: 60 },
);

export async function getPublicDepartments() {
  const [departments, locale] = await Promise.all([
    getPublicDepartmentsCached(),
    getRequestLocale(),
  ]);
  return departments.map((department) => ({
    ...department,
    name: localizedText(locale, department.name, department.nameEn),
    description: localizedText(locale, department.description, department.descriptionEn),
  }));
}

async function loadPublishedTestimonials(limit?: number): Promise<PublicTestimonial[]> {
  try {
    const rows = await prisma.testimonial.findMany({
      where: { isPublished: true },
      orderBy: { createdAt: "desc" },
      ...(limit ? { take: limit } : {}),
    });

    return rows.map((row) => ({
      id: row.id,
      authorName: row.authorName,
      authorEn: row.authorEn,
      content: row.content,
      contentEn: row.contentEn,
      imagePath: row.imagePath,
      createdAt: row.createdAt.toISOString(),
    }));
  } catch {
    // Table absente tant que `npx prisma db push` n'a pas été exécuté.
    return [];
  }
}

const getPublishedTestimonialsCached = unstable_cache(
  loadPublishedTestimonials,
  ["public-testimonials-author-en"],
  { tags: [PUBLIC_TESTIMONIALS_CACHE_TAG], revalidate: 60 },
);

export async function getPublishedTestimonials(limit?: number) {
  return getPublishedTestimonialsCached(limit);
}

function toPublicProject(row: {
  id: string;
  title: string;
  titleEn: string | null;
  slug: string;
  description: string;
  descriptionEn: string | null;
  category: string | null;
  categoryEn: string | null;
  targetAmount: number;
  currentAmount: number;
  image: string | null;
  status: string;
  isFeatured: boolean;
}): PublicProject {
  return {
    id: row.id,
    title: row.title,
    titleEn: row.titleEn,
    slug: row.slug,
    description: row.description,
    descriptionEn: row.descriptionEn,
    category: row.category,
    categoryEn: row.categoryEn,
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

const getPublicProjectsCached = unstable_cache(
  () => loadPublicProjects(false),
  ["public-projects"],
  { tags: [PUBLIC_PROJECTS_CACHE_TAG], revalidate: 60 },
);

const getActivePublicProjectsCached = unstable_cache(
  () => loadPublicProjects(true),
  ["public-projects-active"],
  { tags: [PUBLIC_PROJECTS_CACHE_TAG], revalidate: 60 },
);

function localizeProject<T extends {
  title: string;
  titleEn?: string | null;
  description: string;
  descriptionEn?: string | null;
  category: string | null;
  categoryEn?: string | null;
}>(project: T, locale: Locale): T {
  return {
    ...project,
    title: localizedText(locale, project.title, project.titleEn),
    description: localizedText(locale, project.description, project.descriptionEn),
    category: project.category
      ? localizedText(locale, project.category, project.categoryEn)
      : project.category,
  };
}

export async function getPublicProjects() {
  const [projects, locale] = await Promise.all([
    getPublicProjectsCached(),
    getRequestLocale(),
  ]);
  return projects.map((project) => localizeProject(project, locale));
}

export async function getActivePublicProjects() {
  const [projects, locale] = await Promise.all([
    getActivePublicProjectsCached(),
    getRequestLocale(),
  ]);
  return projects.map((project) => localizeProject(project, locale));
}

async function loadHomeProjects(): Promise<PublicProject[]> {
  try {
    const featured = await prisma.project.findMany({
      where: { status: "IN_PROGRESS", isFeatured: true },
      orderBy: [{ order: "asc" }, { createdAt: "desc" }],
    });
    if (featured.length > 0) {
      return featured.map(toPublicProject);
    }

    const recent = await prisma.project.findMany({
      where: { status: "IN_PROGRESS" },
      orderBy: { createdAt: "desc" },
      take: 3,
    });
    return recent.map(toPublicProject);
  } catch {
    return [];
  }
}

const getHomeProjectsCached = unstable_cache(loadHomeProjects, ["home-projects"], {
  tags: [PUBLIC_PROJECTS_CACHE_TAG],
  revalidate: 60,
});

/**
 * Accueil : uniquement les projets en cours cochés « À la une ».
 * S'il n'y en a aucun, les 3 projets en cours les plus récents.
 */
export async function getHomeProjects(): Promise<PublicProject[]> {
  const [projects, locale] = await Promise.all([getHomeProjectsCached(), getRequestLocale()]);
  return projects.map((project) => localizeProject(project, locale));
}

export async function getPublicProjectBySlug(
  slug: string,
  localeOverride?: Locale,
): Promise<PublicProject | null> {
  const normalized = decodeURIComponent(slug).trim();
  if (!normalized) {
    return null;
  }

  try {
    const row = await prisma.project.findUnique({ where: { slug: normalized } });
    if (!row) {
      return null;
    }
    const locale = localeOverride ?? (await getRequestLocale());
    return localizeProject(toPublicProject(row), locale);
  } catch {
    return null;
  }
}

export async function getArticleBySlug(
  slug: string,
  localeOverride?: Locale,
): Promise<PublicArticle | null> {
  const normalizedSlug = decodeURIComponent(slug).trim();
  if (!normalizedSlug) {
    return null;
  }

  const article = await prisma.article.findFirst({
    where: { slug: normalizedSlug, isPublished: true },
    select: {
      id: true,
      slug: true,
      title: true,
      titleEn: true,
      content: true,
      contentEn: true,
      author: true,
      coverImage: true,
      galleryImages: true,
      youtubeUrl: true,
      isFeatured: true,
      publishedAt: true,
      createdAt: true,
    },
  });

  if (!article) {
    return null;
  }

  let comments: PublicArticle["comments"] = [];
  try {
    const rows = await prisma.comment.findMany({
      where: { articleId: article.id, isApproved: true },
      orderBy: { createdAt: "asc" },
      select: {
        id: true,
        authorName: true,
        content: true,
        likesCount: true,
        createdAt: true,
      },
    });
    comments = rows.map((comment) => ({
      id: comment.id,
      authorName: comment.authorName,
      content: comment.content,
      likesCount: comment.likesCount ?? 0,
      createdAt: comment.createdAt.toISOString(),
    }));
  } catch {
    comments = [];
  }

  return localizeArticle(
    {
      id: article.id,
      slug: article.slug,
      title: article.title,
      titleEn: article.titleEn,
      content: article.content,
      contentEn: article.contentEn,
      author: article.author,
      coverImage: article.coverImage,
      galleryImages: article.galleryImages ?? [],
      youtubeUrl: article.youtubeUrl ?? null,
      isFeatured: article.isFeatured,
      comments,
      publishedAt: toDateKey(article.publishedAt),
      createdAt: article.createdAt.toISOString(),
    },
    localeOverride ?? (await getRequestLocale()),
  );
}
