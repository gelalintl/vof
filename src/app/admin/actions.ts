"use server";

import { prisma } from "@/lib/prisma";
import {
  requireRecordId,
  revalidateArticleContent,
  revalidateDepartmentContent,
  revalidateEventContent,
  revalidateMediaContent,
  revalidatePastorContent,
  revalidateProjectContent,
  revalidateDonationContent,
  revalidateSettingsContent,
  runPrismaWrite,
} from "@/lib/adminActionUtils";
import {
  CHURCH_LOGO_KEY,
  getChurchLogo,
  jsonToDisplay,
  parseSettingValue,
  PAYMENT_QR_KEY_BY_OPERATOR,
  PAYMENT_QR_KEYS,
  UPSERTABLE_SETTING_KEYS,
  type PaymentOperatorSlug,
} from "@/lib/siteSettings";
import { logoutAction, requireAdmin } from "@/lib/auth";
import { deleteLocalFile, uploadLocalFile } from "@/lib/storage/localUpload";
import { normalizeYoutubeUrl } from "@/lib/youtube";
import type {
  AdminArticleRecord,
  AdminCommentRecord,
  AdminDepartmentRecord,
  AdminDonationRecord,
  AdminEventCategory,
  AdminEventRecord,
  AdminMediaRecord,
  AdminPastorRecord,
  AdminProjectRecord,
  AdminRecurrenceType,
  AdminSettingRecord,
  CreateAdminEventInput,
  CreateAdminPastorInput,
  DonationListFilters,
  DonationPromiseStatus,
} from "@/types";
import {
  isDonationStatus,
  isProjectStatus,
  projectProgress,
} from "@/lib/donations";
import { parseExcludedDateList, slugifyEventTitle } from "@/lib/eventRecurrence";

const ADMIN_EVENT_CATEGORIES: AdminEventCategory[] = [
  "ROUTINE",
  "FASTING",
  "VIGIL",
  "SPECIAL",
];

const ADMIN_RECURRENCE_TYPES: AdminRecurrenceType[] = [
  "NONE",
  "DAILY",
  "WEEKLY",
  "MONTHLY",
  "FIRST_3_DAYS_MONTH",
  "SECOND_AND_LAST_FRIDAY",
];

function readString(formData: FormData, key: string) {
  return String(formData.get(key) ?? "").trim();
}

function toDate(value: string) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    throw new Error("Date invalide.");
  }
  return date;
}

const CLOCK_PATTERN = /^([01]\d|2[0-3]):([0-5]\d)$/;

function padClock(value: number) {
  return String(value).padStart(2, "0");
}

function parseClock(value: string) {
  const match = CLOCK_PATTERN.exec(value.trim());
  if (!match) {
    return null;
  }
  return { hours: Number(match[1]), minutes: Number(match[2]) };
}

function clockFromDateString(value: string) {
  if (!value.includes("T") && !value.includes(" ")) {
    return "";
  }
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return "";
  }
  return `${padClock(date.getHours())}:${padClock(date.getMinutes())}`;
}

function combineDateAndTime(dateValue: string, timeValue: string) {
  const datePart = dateValue.trim().slice(0, 10);
  const [year, month, day] = datePart.split("-").map(Number);
  const clock = parseClock(timeValue);
  if (!year || !month || !day || !clock) {
    throw new Error("Date ou horaire invalide.");
  }
  return new Date(year, month - 1, day, clock.hours, clock.minutes, 0, 0);
}

function parseDurationDays(value: string | number | null | undefined) {
  const parsed = typeof value === "number" ? value : Number.parseInt(String(value ?? ""), 10);
  if (!Number.isInteger(parsed) || parsed < 1) {
    return 1;
  }
  return Math.min(31, parsed);
}

function eventScheduleFromInput(input: CreateAdminEventInput) {
  const startTime = input.startTime?.trim() || clockFromDateString(input.startDate);
  if (!startTime || !parseClock(startTime)) {
    throw new Error("L'heure de début est obligatoire (ex. 09:00).");
  }

  const startDate = combineDateAndTime(input.startDate, startTime);
  const endTime = input.endTime?.trim() || (input.endDate ? clockFromDateString(input.endDate) : "");
  const durationDays = parseDurationDays(input.durationDays);

  if (!endTime) {
    if (durationDays <= 1) {
      return { startDate, endDate: null as Date | null, durationDays };
    }
    const lastDay = new Date(startDate);
    lastDay.setDate(lastDay.getDate() + durationDays - 1);
    return { startDate, endDate: lastDay, durationDays };
  }

  if (!parseClock(endTime)) {
    throw new Error("L'heure de fin est invalide (ex. 11:30).");
  }

  const lastCalendarDay = new Date(startDate);
  if (durationDays > 1) {
    lastCalendarDay.setDate(lastCalendarDay.getDate() + durationDays - 1);
  }
  const endDay =
    durationDays > 1
      ? `${lastCalendarDay.getFullYear()}-${padClock(lastCalendarDay.getMonth() + 1)}-${padClock(lastCalendarDay.getDate())}`
      : input.endDate?.trim() || input.startDate;
  let endDate = combineDateAndTime(endDay, endTime);
  if (endDate.getTime() <= startDate.getTime()) {
    endDate = new Date(endDate);
    endDate.setDate(endDate.getDate() + 1);
  }

  return { startDate, endDate, durationDays };
}

function parseEventCategory(value: string): AdminEventCategory {
  if (ADMIN_EVENT_CATEGORIES.includes(value as AdminEventCategory)) {
    return value as AdminEventCategory;
  }
  throw new Error("Catégorie d'événement invalide.");
}

function parseRecurrenceType(value: string): AdminRecurrenceType {
  const normalized = value.trim().toUpperCase();
  if (ADMIN_RECURRENCE_TYPES.includes(normalized as AdminRecurrenceType)) {
    return normalized as AdminRecurrenceType;
  }
  return "NONE";
}

function parseDaysOfWeek(values: Iterable<FormDataEntryValue> | number[] | undefined) {
  if (!values) {
    return [];
  }

  const unique = new Set<number>();
  for (const value of values) {
    const parts = String(value)
      .split(",")
      .map((part) => Number.parseInt(part.trim(), 10));
    for (const day of parts) {
      if (Number.isInteger(day) && day >= 0 && day <= 6) {
        unique.add(day);
      }
    }
  }

  return [...unique].sort((a, b) => a - b);
}

function recurrenceFromInput(input: CreateAdminEventInput) {
  const recurrenceType = parseRecurrenceType(
    input.recurrenceType ?? input.recurrenceRule ?? "NONE",
  );
  return {
    recurrenceType,
    daysOfWeek: recurrenceType === "WEEKLY" ? parseDaysOfWeek(input.daysOfWeek) : [],
    recurrenceEndDate: input.recurrenceEndDate ? toDate(input.recurrenceEndDate) : null,
    excludedDates: input.excludedDates ?? [],
  };
}

function recurrenceFromForm(formData: FormData) {
  const recurrenceType = parseRecurrenceType(
    readString(formData, "recurrenceType") || readString(formData, "recurrenceRule"),
  );
  return {
    recurrenceType,
    daysOfWeek: recurrenceType === "WEEKLY" ? parseDaysOfWeek(formData.getAll("daysOfWeek")) : [],
    recurrenceEndDate: readString(formData, "recurrenceEndDate") || null,
    excludedDates: parseExcludedDateList(formData.getAll("excludedDates").join("\n")),
  };
}

async function uniqueEventSlug(base: string, excludeId?: string) {
  let slug = slugifyEventTitle(base);
  let suffix = 2;
  while (
    await prisma.event.findFirst({
      where: excludeId ? { slug, NOT: { id: excludeId } } : { slug },
      select: { id: true },
    })
  ) {
    slug = `${slugifyEventTitle(base)}-${suffix}`;
    suffix += 1;
  }
  return slug;
}

async function optionalUploadedUrl(formData: FormData, field = "file") {
  const file = formData.get(field);
  if (file instanceof File && file.size > 0) {
    return uploadLocalFile(file);
  }
  return null;
}

async function uploadedUrlsFromForm(formData: FormData, field: string) {
  const urls: string[] = [];
  for (const entry of formData.getAll(field)) {
    if (entry instanceof File && entry.size > 0) {
      urls.push(await uploadLocalFile(entry));
    }
  }
  return urls;
}

function readStringList(formData: FormData, key: string) {
  return formData
    .getAll(key)
    .map((value) => String(value).trim())
    .filter(Boolean);
}

async function replaceArticleGallery(articleId: string, nextImages: string[]) {
  const current = await prisma.article.findUnique({
    where: { id: articleId },
    select: { galleryImages: true },
  });
  if (!current) {
    throw new Error("Article introuvable.");
  }

  const uniqueNext = [...new Set(nextImages)];
  for (const url of current.galleryImages) {
    if (!uniqueNext.includes(url)) {
      await deleteLocalFile(url);
    }
  }

  await runPrismaWrite(
    () =>
      prisma.article.update({
        where: { id: articleId },
        data: { galleryImages: uniqueNext },
      }),
    "Article introuvable.",
  );

  return uniqueNext;
}

function serializeEvent(event: {
  id: string;
  title: string;
  slug?: string | null;
  description: string;
  startDate: Date;
  endDate: Date | null;
  durationDays?: number;
  location: string;
  category: AdminEventCategory;
  isSpecial: boolean;
  isExclusive?: boolean;
  isFeatured?: boolean;
  image: string | null;
  youtubeUrl?: string | null;
  recurrenceType: AdminRecurrenceType;
  daysOfWeek: number[];
  recurrenceEndDate: Date | null;
  excludedDates?: string[];
  createdAt: Date;
}): AdminEventRecord {
  return {
    id: event.id,
    title: event.title,
    slug: event.slug ?? null,
    description: event.description,
    startDate: event.startDate.toISOString(),
    endDate: event.endDate?.toISOString() ?? null,
    durationDays: event.durationDays ?? 1,
    location: event.location,
    category: event.category,
    isSpecial: event.isSpecial,
    isExclusive: event.isExclusive ?? false,
    isFeatured: event.isFeatured ?? false,
    image: event.image,
    youtubeUrl: event.youtubeUrl ?? null,
    recurrenceType: event.recurrenceType,
    daysOfWeek: event.daysOfWeek,
    recurrenceEndDate: event.recurrenceEndDate?.toISOString() ?? null,
    excludedDates: event.excludedDates ?? [],
    createdAt: event.createdAt.toISOString(),
  };
}

export async function createEvent(input: CreateAdminEventInput) {
  await requireAdmin();
  const title = input.title.trim();
  const description = input.description.trim();
  const location = input.location.trim();

  if (!title || !description || !location) {
    throw new Error("Titre, description et lieu sont obligatoires.");
  }

  const recurrence = recurrenceFromInput(input);
  const schedule = eventScheduleFromInput(input);
  const image = input.image?.trim() || null;
  const youtubeUrl = normalizeYoutubeUrl(input.youtubeUrl);
  const isFeatured = input.isFeatured ?? false;
  const slug = await uniqueEventSlug(input.slug?.trim() || title);

  if (isFeatured) {
    await exclusiveEventFeatured();
  }

  const event = await prisma.event.create({
    data: {
      title,
      slug,
      description,
      startDate: schedule.startDate,
      endDate: schedule.endDate,
      durationDays: schedule.durationDays,
      location,
      category: input.category,
      isSpecial: input.isSpecial ?? input.category === "SPECIAL",
      isExclusive: input.isExclusive ?? false,
      isFeatured,
      image,
      youtubeUrl,
      ...recurrence,
    },
  });

  revalidateEventContent(event.slug ?? event.id);
  return serializeEvent(event);
}

export async function createEventFromForm(formData: FormData) {
  await requireAdmin();
  const category = parseEventCategory(readString(formData, "category"));
  const uploaded = await optionalUploadedUrl(formData, "imageFile");

  await createEvent({
    title: readString(formData, "title"),
    slug: readString(formData, "slug") || null,
    description: readString(formData, "description"),
    startDate: readString(formData, "startDate"),
    endDate: readString(formData, "endDate") || null,
    startTime: readString(formData, "startTime"),
    endTime: readString(formData, "endTime") || null,
    durationDays: parseDurationDays(readString(formData, "durationDays")),
    location: readString(formData, "location"),
    category,
    isSpecial: formData.get("isSpecial") === "on" || category === "SPECIAL",
    isExclusive: formData.get("isExclusive") === "on",
    isFeatured: formData.get("isFeatured") === "on",
    image: uploaded || readString(formData, "image") || null,
    youtubeUrl: readString(formData, "youtubeUrl") || null,
    ...recurrenceFromForm(formData),
  });
}

export async function updateEvent(id: string, input: CreateAdminEventInput) {
  await requireAdmin();

  const title = input.title.trim();
  const description = input.description.trim();
  const location = input.location.trim();

  if (!title || !description || !location) {
    throw new Error("Titre, description et lieu sont obligatoires.");
  }

  const current = await prisma.event.findUnique({ where: { id } });
  if (!current) {
    throw new Error("Événement introuvable.");
  }

  const recurrence = recurrenceFromInput(input);
  const schedule = eventScheduleFromInput(input);
  const image = input.image?.trim() || null;
  const youtubeUrl = normalizeYoutubeUrl(input.youtubeUrl);
  const isFeatured = input.isFeatured ?? false;
  const slug = await uniqueEventSlug(input.slug?.trim() || title, id);

  if (isFeatured) {
    await exclusiveEventFeatured(id);
  }

  const event = await runPrismaWrite(
    () =>
      prisma.event.update({
        where: { id },
        data: {
          title,
          slug,
          description,
          startDate: schedule.startDate,
          endDate: schedule.endDate,
          durationDays: schedule.durationDays,
          location,
          category: input.category,
          isSpecial: input.isSpecial ?? input.category === "SPECIAL",
          isExclusive: input.isExclusive ?? false,
          isFeatured,
          image,
          youtubeUrl,
          ...recurrence,
        },
      }),
    "Événement introuvable.",
  );

  revalidateEventContent(event.slug ?? event.id);
  return serializeEvent(event);
}

export async function updateEventFromForm(formData: FormData) {
  await requireAdmin();
  const id = readString(formData, "id");
  if (!id) {
    throw new Error("Identifiant manquant.");
  }

  const current = await prisma.event.findUnique({ where: { id } });
  if (!current) {
    throw new Error("Événement introuvable.");
  }

  const category = parseEventCategory(readString(formData, "category"));
  const uploaded = await optionalUploadedUrl(formData, "imageFile");
  const nextImage = uploaded || readString(formData, "image") || null;

  if (uploaded && current.image && current.image !== nextImage) {
    await deleteLocalFile(current.image);
  }

  await updateEvent(id, {
    title: readString(formData, "title"),
    slug: readString(formData, "slug") || null,
    description: readString(formData, "description"),
    startDate: readString(formData, "startDate"),
    endDate: readString(formData, "endDate") || null,
    startTime: readString(formData, "startTime"),
    endTime: readString(formData, "endTime") || null,
    durationDays: parseDurationDays(readString(formData, "durationDays")),
    location: readString(formData, "location"),
    category,
    isSpecial: formData.get("isSpecial") === "on" || category === "SPECIAL",
    isExclusive: formData.get("isExclusive") === "on",
    isFeatured: formData.get("isFeatured") === "on",
    image: nextImage,
    youtubeUrl: readString(formData, "youtubeUrl") || null,
    ...recurrenceFromForm(formData),
  });
}

export async function deleteEvent(formData: FormData) {
  await requireAdmin();
  const id = requireRecordId(readString(formData, "id"));

  const current = await prisma.event.findUnique({
    where: { id },
    select: { image: true },
  });
  if (current?.image) {
    await deleteLocalFile(current.image);
  }

  await prisma.event.deleteMany({ where: { id } });
  revalidateEventContent(id);
}

export async function uploadAdminImage(file: File) {
  await requireAdmin();
  const url = await uploadLocalFile(file);
  revalidateMediaContent();
  return url;
}

export async function uploadAdminImageFromForm(formData: FormData) {
  await requireAdmin();
  const uploaded = await optionalUploadedUrl(formData, "file");
  const existingUrl = readString(formData, "url");
  const url = uploaded || existingUrl;

  if (!url) {
    throw new Error("Aucun fichier fourni.");
  }

  await prisma.media.create({
    data: {
      title: readString(formData, "title") || "Média",
      url,
      category: readString(formData, "category") || "galerie",
      eventId: readString(formData, "eventId") || null,
      isFeaturedHome: formData.get("isFeaturedHome") === "on",
    },
  });

  revalidateMediaContent();
}

export async function updateMediaFromForm(formData: FormData) {
  await requireAdmin();
  const id = requireRecordId(readString(formData, "id"));

  const current = await prisma.media.findUnique({ where: { id } });
  if (!current) {
    throw new Error("Média introuvable.");
  }

  const uploaded = await optionalUploadedUrl(formData, "file");
  const nextUrl = uploaded || readString(formData, "url") || current.url;

  if (uploaded && current.url !== nextUrl) {
    await deleteLocalFile(current.url);
  }

  await runPrismaWrite(
    () =>
      prisma.media.update({
        where: { id },
        data: {
          title: readString(formData, "title") || current.title,
          url: nextUrl,
          category: readString(formData, "category") || current.category,
          eventId: readString(formData, "eventId") || null,
          isFeaturedHome: formData.get("isFeaturedHome") === "on",
        },
      }),
    "Média introuvable.",
  );

  revalidateMediaContent();
}

export async function deleteMedia(formData: FormData) {
  await requireAdmin();
  const id = requireRecordId(readString(formData, "id"));

  const current = await prisma.media.findUnique({
    where: { id },
    select: { url: true },
  });
  if (current) {
    await deleteLocalFile(current.url);
    await prisma.media.deleteMany({ where: { id } });
  }

  revalidateMediaContent();
}

export async function createArticleFromForm(formData: FormData) {
  await requireAdmin();
  const title = readString(formData, "title");
  const slug = readString(formData, "slug");
  const content = readString(formData, "content");
  const author = readString(formData, "author");

  if (!title || !slug || !content || !author) {
    throw new Error("Titre, slug, contenu et auteur sont obligatoires.");
  }

  const uploaded = await optionalUploadedUrl(formData, "coverFile");
  const galleryImages = [
    ...readStringList(formData, "galleryImages"),
    ...(await uploadedUrlsFromForm(formData, "galleryFiles")),
  ];
  const isFeatured = formData.get("isFeatured") === "on";

  if (isFeatured) {
    await exclusiveArticleFeatured();
  }

  await prisma.article.create({
    data: {
      title,
      slug,
      content,
      author,
      coverImage: uploaded || readString(formData, "coverImage") || null,
      galleryImages,
      youtubeUrl: normalizeYoutubeUrl(readString(formData, "youtubeUrl")),
      isPublished: formData.get("isPublished") === "on",
      isFeatured,
    },
  });

  revalidateArticleContent();
}

export async function updateArticleFromForm(formData: FormData) {
  await requireAdmin();
  const id = requireRecordId(readString(formData, "id"));

  const current = await prisma.article.findUnique({ where: { id } });
  if (!current) {
    throw new Error("Article introuvable.");
  }

  const uploaded = await optionalUploadedUrl(formData, "coverFile");
  const nextCover = uploaded || readString(formData, "coverImage") || null;

  if (uploaded && current.coverImage && current.coverImage !== nextCover) {
    await deleteLocalFile(current.coverImage);
  }

  const isFeatured = formData.get("isFeatured") === "on";
  if (isFeatured) {
    await exclusiveArticleFeatured(id);
  }

  await runPrismaWrite(
    () =>
      prisma.article.update({
        where: { id },
        data: {
          title: readString(formData, "title"),
          slug: readString(formData, "slug"),
          content: readString(formData, "content"),
          author: readString(formData, "author"),
          coverImage: nextCover,
          youtubeUrl: normalizeYoutubeUrl(readString(formData, "youtubeUrl")),
          isPublished: formData.get("isPublished") === "on",
          isFeatured,
        },
      }),
    "Article introuvable.",
  );

  await replaceArticleGallery(id, [
    ...readStringList(formData, "galleryImages"),
    ...(await uploadedUrlsFromForm(formData, "galleryFiles")),
  ]);

  revalidateArticleContent(readString(formData, "slug"));
}

export async function deleteArticle(formData: FormData) {
  await requireAdmin();
  const id = requireRecordId(readString(formData, "id"));

  const current = await prisma.article.findUnique({ where: { id } });
  if (current?.coverImage) {
    await deleteLocalFile(current.coverImage);
  }
  for (const url of current?.galleryImages ?? []) {
    await deleteLocalFile(url);
  }

  await prisma.article.deleteMany({ where: { id } });
  revalidateArticleContent();
}

export async function updateArticleGallery(articleId: string, galleryImages: string[]) {
  await requireAdmin();
  const id = requireRecordId(articleId);

  const article = await prisma.article.findUnique({
    where: { id },
    select: { slug: true },
  });
  if (!article) {
    throw new Error("Article introuvable.");
  }

  await replaceArticleGallery(id, galleryImages);
  revalidateArticleContent(article.slug);
}

export async function toggleCommentApproval(commentId: string, isApproved: boolean) {
  await requireAdmin();
  const id = requireRecordId(commentId);

  const comment = await runPrismaWrite(
    () =>
      prisma.comment.update({
        where: { id },
        data: { isApproved },
        select: { article: { select: { slug: true } } },
      }),
    "Commentaire introuvable.",
  );

  revalidateArticleContent(comment.article?.slug ?? undefined);
}

export async function deleteComment(commentId: string) {
  await requireAdmin();
  const id = requireRecordId(commentId);

  const comment = await prisma.comment.findUnique({
    where: { id },
    include: { article: { select: { slug: true } } },
  });

  await prisma.comment.deleteMany({ where: { id } });
  revalidateArticleContent(comment?.article?.slug ?? undefined);
}

export async function updateSiteSettings(settings: Record<string, string>) {
  await requireAdmin();
  const allowed = new Set<string>(UPSERTABLE_SETTING_KEYS);
  const entries = Object.entries(settings).filter(([key]) => allowed.has(key));

  await prisma.$transaction(
    entries.map(([key, value]) =>
      prisma.siteSettings.upsert({
        where: { key },
        create: { key, value: value.trim() },
        update: { value: value.trim() },
      }),
    ),
  );

  revalidateSettingsContent();
}

export async function upsertSiteSettingFromForm(formData: FormData) {
  await requireAdmin();
  const key = readString(formData, "key");
  if (!key) {
    throw new Error("La clé est obligatoire.");
  }

  const value = parseSettingValue(readString(formData, "value"));
  const id = readString(formData, "id");

  if (id) {
    await runPrismaWrite(
      () =>
        prisma.siteSettings.update({
          where: { id },
          data: { key, value },
        }),
      "Paramètre introuvable.",
    );
  } else {
    await prisma.siteSettings.upsert({
      where: { key },
      create: { key, value },
      update: { value },
    });
  }

  revalidateSettingsContent();
}

export async function deleteSiteSetting(formData: FormData) {
  await requireAdmin();
  const id = requireRecordId(readString(formData, "id"));

  const current = await prisma.siteSettings.findUnique({ where: { id } });
  const qrKeys = new Set<string>(PAYMENT_QR_KEYS);
  if (current && (current.key === CHURCH_LOGO_KEY || qrKeys.has(current.key))) {
    await deleteLocalFile(jsonToDisplay(current.value));
  }

  await prisma.siteSettings.deleteMany({ where: { id } });
  revalidateSettingsContent();
}

export async function uploadChurchLogo(formData: FormData) {
  await requireAdmin();
  const file = formData.get("file");
  if (!(file instanceof File) || file.size === 0) {
    throw new Error("Aucun logo fourni.");
  }

  const previous = await getChurchLogo();
  const url = await uploadLocalFile(file);

  await prisma.siteSettings.upsert({
    where: { key: CHURCH_LOGO_KEY },
    create: { key: CHURCH_LOGO_KEY, value: url },
    update: { value: url },
  });

  if (previous && previous !== url) {
    await deleteLocalFile(previous);
  }

  revalidateSettingsContent();
}

const PAYMENT_OPERATORS: PaymentOperatorSlug[] = ["amana", "nita", "wave"];

function readPaymentOperator(formData: FormData): PaymentOperatorSlug {
  const operator = readString(formData, "operator");
  if (!PAYMENT_OPERATORS.includes(operator as PaymentOperatorSlug)) {
    throw new Error("Opérateur Mobile Money invalide.");
  }
  return operator as PaymentOperatorSlug;
}

export async function uploadPaymentQr(formData: FormData) {
  await requireAdmin();
  const operator = readPaymentOperator(formData);
  const file = formData.get("file");
  if (!(file instanceof File) || file.size === 0) {
    throw new Error("Aucun QR code fourni.");
  }

  const key = PAYMENT_QR_KEY_BY_OPERATOR[operator];
  const previous = await prisma.siteSettings.findUnique({ where: { key } });
  const url = await uploadLocalFile(file);

  await prisma.siteSettings.upsert({
    where: { key },
    create: { key, value: url },
    update: { value: url },
  });

  if (previous) {
    await deleteLocalFile(jsonToDisplay(previous.value));
  }

  revalidateSettingsContent();
}

export async function deletePaymentQr(formData: FormData) {
  await requireAdmin();
  const operator = readPaymentOperator(formData);
  const key = PAYMENT_QR_KEY_BY_OPERATOR[operator];
  const current = await prisma.siteSettings.findUnique({ where: { key } });

  if (current) {
    await deleteLocalFile(jsonToDisplay(current.value));
    await runPrismaWrite(
      () =>
        prisma.siteSettings.update({
          where: { key },
          data: { value: "" },
        }),
      "Paramètre introuvable.",
    );
  }

  revalidateSettingsContent();
}

export async function deleteChurchLogo() {
  await requireAdmin();
  const current = await prisma.siteSettings.findUnique({
    where: { key: CHURCH_LOGO_KEY },
  });

  if (current) {
    await deleteLocalFile(jsonToDisplay(current.value));
    await prisma.siteSettings.deleteMany({ where: { id: current.id } });
  }

  revalidateSettingsContent();
}

export async function getEvents(): Promise<AdminEventRecord[]> {
  await requireAdmin();
  const events = await prisma.event.findMany({
    orderBy: { startDate: "desc" },
  });
  return events.map(serializeEvent);
}

export async function getEvent(id: string): Promise<AdminEventRecord | null> {
  await requireAdmin();
  const event = await prisma.event.findUnique({ where: { id } });
  return event ? serializeEvent(event) : null;
}

export async function getMedia(): Promise<AdminMediaRecord[]> {
  await requireAdmin();
  const media = await prisma.media.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      event: {
        select: { id: true, title: true },
      },
    },
  });

  return media.map((item) => ({
    id: item.id,
    title: item.title,
    url: item.url,
    category: item.category,
    eventId: item.eventId,
    eventTitle: item.event?.title ?? null,
    isFeaturedHome: item.isFeaturedHome,
    createdAt: item.createdAt.toISOString(),
  }));
}

export async function getArticles(): Promise<AdminArticleRecord[]> {
  await requireAdmin();
  const articles = await prisma.article.findMany({
    orderBy: { createdAt: "desc" },
  });

  return articles.map((article) => ({
    id: article.id,
    title: article.title,
    slug: article.slug,
    content: article.content,
    author: article.author,
    coverImage: article.coverImage,
    galleryImages: article.galleryImages ?? [],
    youtubeUrl: article.youtubeUrl ?? null,
    isPublished: article.isPublished,
    isFeatured: article.isFeatured,
    createdAt: article.createdAt.toISOString(),
  }));
}

export async function getComments(): Promise<AdminCommentRecord[]> {
  await requireAdmin();
  const comments = await prisma.comment.findMany({
    select: {
      id: true,
      authorName: true,
      authorEmail: true,
      content: true,
      likesCount: true,
      isApproved: true,
      createdAt: true,
      articleId: true,
      article: { select: { id: true, title: true, slug: true } },
    },
    orderBy: { createdAt: "desc" },
  });

  return comments.map((comment) => ({
    id: comment.id,
    authorName: comment.authorName,
    authorEmail: comment.authorEmail,
    content: comment.content,
    likesCount: comment.likesCount,
    isApproved: comment.isApproved,
    createdAt: comment.createdAt.toISOString(),
    articleId: comment.articleId,
    articleTitle: comment.article?.title ?? null,
    articleSlug: comment.article?.slug ?? null,
  }));
}

function serializePastor(pastor: {
  id: string;
  name: string;
  role: string;
  bio: string | null;
  quote?: string | null;
  image: string | null;
  order: number;
  createdAt: Date;
}): AdminPastorRecord {
  return {
    id: pastor.id,
    name: pastor.name,
    role: pastor.role,
    bio: pastor.bio,
    quote: pastor.quote ?? null,
    image: pastor.image,
    order: pastor.order,
    createdAt: pastor.createdAt.toISOString(),
  };
}

async function exclusiveEventFeatured(excludeId?: string) {
  await prisma.event.updateMany({
    where: excludeId ? { NOT: { id: excludeId } } : {},
    data: { isFeatured: false },
  });
}

async function exclusiveArticleFeatured(excludeId?: string) {
  await prisma.article.updateMany({
    where: excludeId ? { NOT: { id: excludeId } } : {},
    data: { isFeatured: false },
  });
}

function parseDisplayOrder(value: string | number | undefined) {
  const parsed = typeof value === "number" ? value : Number.parseInt(String(value ?? "0"), 10);
  return Number.isInteger(parsed) ? parsed : 0;
}

export async function createPastor(input: CreateAdminPastorInput) {
  await requireAdmin();
  const name = input.name.trim();
  const role = input.role.trim();

  if (!name || !role) {
    throw new Error("Le nom et le rôle sont obligatoires.");
  }

  const pastor = await prisma.pastor.create({
    data: {
      name,
      role,
      bio: input.bio?.trim() || null,
      quote: input.quote?.trim() || null,
      image: input.image?.trim() || null,
      order: parseDisplayOrder(input.order),
    },
  });

  revalidatePastorContent();
  return serializePastor(pastor);
}

export async function createPastorFromForm(formData: FormData) {
  await requireAdmin();
  const uploaded = await optionalUploadedUrl(formData, "imageFile");

  await createPastor({
    name: readString(formData, "name"),
    role: readString(formData, "role"),
    bio: readString(formData, "bio") || null,
    quote: readString(formData, "quote") || null,
    image: uploaded || readString(formData, "image") || null,
    order: parseDisplayOrder(readString(formData, "order")),
  });
}

export async function updatePastor(id: string, input: CreateAdminPastorInput) {
  await requireAdmin();
  const name = input.name.trim();
  const role = input.role.trim();

  if (!name || !role) {
    throw new Error("Le nom et le rôle sont obligatoires.");
  }

  const current = await prisma.pastor.findUnique({ where: { id } });
  if (!current) {
    throw new Error("Pasteur introuvable.");
  }

  const pastor = await runPrismaWrite(
    () =>
      prisma.pastor.update({
        where: { id },
        data: {
          name,
          role,
          bio: input.bio?.trim() || null,
          quote: input.quote?.trim() || null,
          image: input.image?.trim() || null,
          order: parseDisplayOrder(input.order),
        },
      }),
    "Pasteur introuvable.",
  );

  revalidatePastorContent();
  return serializePastor(pastor);
}

export async function updatePastorFromForm(formData: FormData) {
  await requireAdmin();
  const id = readString(formData, "id");
  if (!id) {
    throw new Error("Identifiant manquant.");
  }

  const current = await prisma.pastor.findUnique({ where: { id } });
  if (!current) {
    throw new Error("Pasteur introuvable.");
  }

  const uploaded = await optionalUploadedUrl(formData, "imageFile");
  const nextImage = uploaded || readString(formData, "image") || null;

  if (uploaded && current.image && current.image !== nextImage) {
    await deleteLocalFile(current.image);
  }

  await updatePastor(id, {
    name: readString(formData, "name"),
    role: readString(formData, "role"),
    bio: readString(formData, "bio") || null,
    quote: readString(formData, "quote") || null,
    image: nextImage,
    order: parseDisplayOrder(readString(formData, "order")),
  });
}

export async function deletePastor(formData: FormData) {
  await requireAdmin();
  const id = requireRecordId(readString(formData, "id"));

  const current = await prisma.pastor.findUnique({
    where: { id },
    select: { image: true },
  });
  if (current?.image) {
    await deleteLocalFile(current.image);
  }

  await prisma.pastor.deleteMany({ where: { id } });
  revalidatePastorContent();
}

export async function getPastors(): Promise<AdminPastorRecord[]> {
  await requireAdmin();
  const pastors = await prisma.pastor.findMany({
    orderBy: [{ order: "asc" }, { name: "asc" }],
  });
  return pastors.map(serializePastor);
}

function slugify(value: string) {
  const slug = value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
  return slug || "departement";
}

function serializeDepartment(department: {
  id: string;
  name: string;
  slug: string;
  description: string;
  responsible: string | null;
  contact: string | null;
  image: string | null;
  order: number;
  createdAt: Date;
}): AdminDepartmentRecord {
  return {
    id: department.id,
    name: department.name,
    slug: department.slug,
    description: department.description,
    responsible: department.responsible,
    contact: department.contact,
    image: department.image,
    order: department.order,
    createdAt: department.createdAt.toISOString(),
  };
}

async function uniqueDepartmentSlug(base: string, excludeId?: string) {
  let slug = slugify(base);
  let suffix = 2;
  while (
    await prisma.department.findFirst({
      where: excludeId ? { slug, NOT: { id: excludeId } } : { slug },
      select: { id: true },
    })
  ) {
    slug = `${slugify(base)}-${suffix}`;
    suffix += 1;
  }
  return slug;
}

export async function createDepartment(formData: FormData) {
  await requireAdmin();
  const name = readString(formData, "name");
  const description = readString(formData, "description");

  if (!name || !description) {
    throw new Error("Le nom et la description sont obligatoires.");
  }

  const uploaded = await optionalUploadedUrl(formData, "imageFile");

  const department = await prisma.department.create({
    data: {
      name,
      slug: await uniqueDepartmentSlug(name),
      description,
      responsible: readString(formData, "responsible") || null,
      contact: readString(formData, "contact") || null,
      image: uploaded || readString(formData, "image") || null,
      order: parseDisplayOrder(readString(formData, "order")),
    },
  });

  revalidateDepartmentContent();
  return serializeDepartment(department);
}

export async function updateDepartment(id: string, formData: FormData) {
  await requireAdmin();
  const departmentId = requireRecordId(id);

  const current = await prisma.department.findUnique({ where: { id: departmentId } });
  if (!current) {
    throw new Error("Département introuvable.");
  }

  const name = readString(formData, "name") || current.name;
  const description = readString(formData, "description") || current.description;
  const uploaded = await optionalUploadedUrl(formData, "imageFile");
  const nextImage = uploaded || readString(formData, "image") || null;

  if (uploaded && current.image && current.image !== nextImage) {
    await deleteLocalFile(current.image);
  }

  const slug =
    name !== current.name
      ? await uniqueDepartmentSlug(name, departmentId)
      : current.slug;

  const department = await runPrismaWrite(
    () =>
      prisma.department.update({
        where: { id: departmentId },
        data: {
          name,
          slug,
          description,
          responsible: readString(formData, "responsible") || null,
          contact: readString(formData, "contact") || null,
          image: nextImage,
          order: parseDisplayOrder(readString(formData, "order") || String(current.order)),
        },
      }),
    "Département introuvable.",
  );

  revalidateDepartmentContent();
  return serializeDepartment(department);
}

export async function deleteDepartment(id: string) {
  await requireAdmin();
  const departmentId = requireRecordId(id);

  const current = await prisma.department.findUnique({ where: { id: departmentId } });
  if (current?.image) {
    await deleteLocalFile(current.image);
  }

  await prisma.department.deleteMany({ where: { id: departmentId } });
  revalidateDepartmentContent();
}

export async function getDepartments(): Promise<AdminDepartmentRecord[]> {
  await requireAdmin();
  const departments = await prisma.department.findMany({
    orderBy: { order: "asc" },
  });
  return departments.map(serializeDepartment);
}

export async function getSettings(): Promise<AdminSettingRecord[]> {
  await requireAdmin();
  const settings = await prisma.siteSettings.findMany({
    orderBy: { key: "asc" },
  });

  return settings.map((setting) => ({
    id: setting.id,
    key: setting.key,
    value: jsonToDisplay(setting.value),
    updatedAt: setting.updatedAt.toISOString(),
  }));
}

function parseFcfaAmount(value: string, label: string, allowZero = false) {
  const parsed = Number(String(value).replace(/\s/g, "").replace(",", "."));
  if (!Number.isFinite(parsed) || parsed < 0 || (!allowZero && parsed <= 0)) {
    throw new Error(`${label} invalide.`);
  }
  return parsed;
}

function serializeProject(project: {
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
  order: number;
  createdAt: Date;
}): AdminProjectRecord {
  return {
    id: project.id,
    title: project.title,
    slug: project.slug,
    description: project.description,
    category: project.category,
    targetAmount: project.targetAmount,
    currentAmount: project.currentAmount,
    image: project.image,
    status: isProjectStatus(project.status) ? project.status : "IN_PROGRESS",
    isFeatured: project.isFeatured,
    progress: projectProgress(project.currentAmount, project.targetAmount),
    order: project.order,
    createdAt: project.createdAt.toISOString(),
  };
}

async function uniqueProjectSlug(base: string, excludeId?: string) {
  let slug = slugify(base);
  if (slug === "departement") {
    slug = "projet";
  }
  const root = slug;
  let suffix = 2;
  while (
    await prisma.project.findFirst({
      where: excludeId ? { slug, NOT: { id: excludeId } } : { slug },
      select: { id: true },
    })
  ) {
    slug = `${root}-${suffix}`;
    suffix += 1;
  }
  return slug;
}

async function exclusiveProjectFeatured(excludeId?: string) {
  await prisma.project.updateMany({
    where: excludeId ? { NOT: { id: excludeId } } : {},
    data: { isFeatured: false },
  });
}

export async function getProjects(): Promise<AdminProjectRecord[]> {
  await requireAdmin();
  const projects = await prisma.project.findMany({
    orderBy: [{ order: "asc" }, { createdAt: "desc" }],
  });
  return projects.map(serializeProject);
}

export async function createProject(formData: FormData) {
  await requireAdmin();
  const title = readString(formData, "title");
  const description = readString(formData, "description");
  if (!title || !description) {
    throw new Error("Le nom et la description sont obligatoires.");
  }

  const uploaded = await optionalUploadedUrl(formData, "imageFile");
  const requestedSlug = readString(formData, "slug");
  const isFeatured = readString(formData, "isFeatured") === "on";
  const status = readString(formData, "status") || "IN_PROGRESS";
  if (!isProjectStatus(status)) {
    throw new Error("Statut de projet invalide.");
  }

  if (isFeatured) {
    await exclusiveProjectFeatured();
  }

  const project = await prisma.project.create({
    data: {
      title,
      slug: await uniqueProjectSlug(requestedSlug || title),
      description,
      category: readString(formData, "category") || null,
      targetAmount: parseFcfaAmount(readString(formData, "targetAmount"), "Objectif financier"),
      currentAmount: parseFcfaAmount(
        readString(formData, "currentAmount") || "0",
        "Montant actuel",
        true,
      ),
      image: uploaded || readString(formData, "image") || null,
      status,
      isFeatured,
      order: parseDisplayOrder(readString(formData, "order")),
    },
  });

  revalidateProjectContent();
  return serializeProject(project);
}

export async function updateProject(id: string, formData: FormData) {
  await requireAdmin();
  const projectId = requireRecordId(id);
  const current = await prisma.project.findUnique({ where: { id: projectId } });
  if (!current) {
    throw new Error("Projet introuvable.");
  }

  const title = readString(formData, "title") || current.title;
  const description = readString(formData, "description") || current.description;
  const uploaded = await optionalUploadedUrl(formData, "imageFile");
  const nextImage = uploaded || readString(formData, "image") || null;
  const requestedSlug = readString(formData, "slug");
  const isFeatured = readString(formData, "isFeatured") === "on";
  const status = readString(formData, "status") || current.status;
  if (!isProjectStatus(status)) {
    throw new Error("Statut de projet invalide.");
  }

  if (uploaded && current.image && current.image !== nextImage) {
    await deleteLocalFile(current.image);
  }

  if (isFeatured) {
    await exclusiveProjectFeatured(projectId);
  }

  const slug =
    requestedSlug && requestedSlug !== current.slug
      ? await uniqueProjectSlug(requestedSlug, projectId)
      : title !== current.title && !requestedSlug
        ? await uniqueProjectSlug(title, projectId)
        : current.slug;

  const project = await runPrismaWrite(
    () =>
      prisma.project.update({
        where: { id: projectId },
        data: {
          title,
          slug,
          description,
          category: readString(formData, "category") || null,
          targetAmount: parseFcfaAmount(
            readString(formData, "targetAmount") || String(current.targetAmount),
            "Objectif financier",
          ),
          currentAmount: parseFcfaAmount(
            readString(formData, "currentAmount") || String(current.currentAmount),
            "Montant actuel",
            true,
          ),
          image: nextImage,
          status,
          isFeatured,
          order: parseDisplayOrder(readString(formData, "order") || String(current.order)),
        },
      }),
    "Projet introuvable.",
  );

  revalidateProjectContent();
  return serializeProject(project);
}

export async function deleteProject(id: string) {
  await requireAdmin();
  const projectId = requireRecordId(id);
  const current = await prisma.project.findUnique({ where: { id: projectId } });
  if (current?.image) {
    await deleteLocalFile(current.image);
  }
  await prisma.project.deleteMany({ where: { id: projectId } });
  revalidateProjectContent();
}

function serializeDonation(row: {
  id: string;
  donorName: string | null;
  donorPhone: string | null;
  donorEmail: string | null;
  type: string;
  amount: number;
  paymentMethod: string;
  status: string;
  notes: string | null;
  projectId: string | null;
  createdAt: Date;
  project: { title: string } | null;
}): AdminDonationRecord {
  return {
    id: row.id,
    donorName: row.donorName,
    donorPhone: row.donorPhone,
    donorEmail: row.donorEmail,
    type: row.type,
    amount: row.amount,
    paymentMethod: row.paymentMethod,
    status: isDonationStatus(row.status) ? row.status : "PENDING",
    notes: row.notes,
    projectId: row.projectId,
    projectTitle: row.project?.title ?? null,
    createdAt: row.createdAt.toISOString(),
  };
}

export async function getDonationsList(
  filters: DonationListFilters = {},
): Promise<AdminDonationRecord[]> {
  await requireAdmin();
  const status =
    filters.status && filters.status !== "ALL" && isDonationStatus(filters.status)
      ? filters.status
      : undefined;

  const rows = await prisma.donationPromise.findMany({
    where: {
      ...(status ? { status } : {}),
      ...(filters.projectId ? { projectId: filters.projectId } : {}),
    },
    include: { project: { select: { title: true } } },
    orderBy: { createdAt: "desc" },
  });

  return rows.map(serializeDonation);
}

export async function confirmDonationPromise(donationId: string) {
  await requireAdmin();
  const id = requireRecordId(donationId);

  const updated = await prisma.$transaction(async (tx) => {
    const current = await tx.donationPromise.findUnique({ where: { id } });
    if (!current) {
      throw new Error("Promesse de don introuvable.");
    }

    if (current.status === "CONFIRMED") {
      return current;
    }

    const donation = await tx.donationPromise.update({
      where: { id },
      data: { status: "CONFIRMED" },
    });

    if (donation.projectId) {
      await tx.project.update({
        where: { id: donation.projectId },
        data: { currentAmount: { increment: donation.amount } },
      });
    }

    return donation;
  });

  revalidateDonationContent();
  return { id: updated.id, status: updated.status as DonationPromiseStatus };
}

export async function getAdminOverview() {
  await requireAdmin();
  try {
    const [events, media, articles, pastors, departments, projects, pendingDonations] =
      await Promise.all([
        prisma.event.count(),
        prisma.media.count(),
        prisma.article.count(),
        prisma.pastor.count(),
        prisma.department.count(),
        prisma.project.count(),
        prisma.donationPromise.count({ where: { status: "PENDING" } }),
      ]);

    return {
      ok: true as const,
      events,
      media,
      articles,
      pastors,
      departments,
      projects,
      pendingDonations,
    };
  } catch {
    return {
      ok: false as const,
      events: 0,
      media: 0,
      articles: 0,
      pastors: 0,
      departments: 0,
      projects: 0,
      pendingDonations: 0,
    };
  }
}

export async function signOutAdmin() {
  await logoutAction();
}
