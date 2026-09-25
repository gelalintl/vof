"use server";

import { revalidatePath, revalidateTag } from "next/cache";
import { prisma } from "@/lib/prisma";
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
import {
  PUBLIC_ARTICLES_CACHE_TAG,
  PUBLIC_EVENTS_CACHE_TAG,
  PUBLIC_MEDIA_CACHE_TAG,
} from "@/lib/publicContent";
import { SITE_SETTINGS_CACHE_TAG } from "@/lib/settings";
import { logoutAction, requireAdmin } from "@/lib/auth";
import { deleteLocalFile, uploadLocalFile } from "@/lib/storage/localUpload";
import type {
  AdminArticleRecord,
  AdminEventCategory,
  AdminEventRecord,
  AdminMediaRecord,
  AdminSettingRecord,
  CreateAdminEventInput,
} from "@/types";

const ADMIN_EVENT_CATEGORIES: AdminEventCategory[] = [
  "ROUTINE",
  "FASTING",
  "VIGIL",
  "SPECIAL",
];

function revalidatePublic() {
  revalidateTag(SITE_SETTINGS_CACHE_TAG, "max");
  revalidateTag(PUBLIC_EVENTS_CACHE_TAG, "max");
  revalidateTag(PUBLIC_MEDIA_CACHE_TAG, "max");
  revalidateTag(PUBLIC_ARTICLES_CACHE_TAG, "max");
  revalidatePath("/", "layout");
  revalidatePath("/");
  revalidatePath("/contact");
  revalidatePath("/don");
  revalidatePath("/vie-de-leglise");
  revalidatePath("/rassemblements");
  revalidatePath("/enseignements");
  revalidatePath("/a-propos");
}

function revalidateAdmin() {
  revalidatePath("/admin");
  revalidatePath("/admin/evenements");
  revalidatePath("/admin/medias");
  revalidatePath("/admin/enseignements");
  revalidatePath("/admin/parametres");
  revalidatePath("/admin", "layout");
  revalidatePublic();
}

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

function parseEventCategory(value: string): AdminEventCategory {
  if (ADMIN_EVENT_CATEGORIES.includes(value as AdminEventCategory)) {
    return value as AdminEventCategory;
  }
  throw new Error("Catégorie d'événement invalide.");
}

async function optionalUploadedUrl(formData: FormData, field = "file") {
  const file = formData.get(field);
  if (file instanceof File && file.size > 0) {
    return uploadLocalFile(file);
  }
  return null;
}

function serializeEvent(event: {
  id: string;
  title: string;
  description: string;
  startDate: Date;
  endDate: Date | null;
  location: string;
  category: AdminEventCategory;
  isSpecial: boolean;
  image: string | null;
  createdAt: Date;
}): AdminEventRecord {
  return {
    id: event.id,
    title: event.title,
    description: event.description,
    startDate: event.startDate.toISOString(),
    endDate: event.endDate?.toISOString() ?? null,
    location: event.location,
    category: event.category,
    isSpecial: event.isSpecial,
    image: event.image,
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

  const event = await prisma.event.create({
    data: {
      title,
      description,
      startDate: toDate(input.startDate),
      endDate: input.endDate ? toDate(input.endDate) : null,
      location,
      category: input.category,
      isSpecial: input.isSpecial ?? input.category === "SPECIAL",
      image: input.image?.trim() || null,
    },
  });

  revalidateAdmin();
  return serializeEvent(event);
}

export async function createEventFromForm(formData: FormData) {
  await requireAdmin();
  const category = parseEventCategory(readString(formData, "category"));
  const uploaded = await optionalUploadedUrl(formData, "imageFile");

  await createEvent({
    title: readString(formData, "title"),
    description: readString(formData, "description"),
    startDate: readString(formData, "startDate"),
    endDate: readString(formData, "endDate") || null,
    location: readString(formData, "location"),
    category,
    isSpecial: formData.get("isSpecial") === "on" || category === "SPECIAL",
    image: uploaded || readString(formData, "image") || null,
  });
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

  await prisma.event.update({
    where: { id },
    data: {
      title: readString(formData, "title"),
      description: readString(formData, "description"),
      startDate: toDate(readString(formData, "startDate")),
      endDate: readString(formData, "endDate") ? toDate(readString(formData, "endDate")) : null,
      location: readString(formData, "location"),
      category,
      isSpecial: formData.get("isSpecial") === "on" || category === "SPECIAL",
      image: nextImage,
    },
  });

  revalidateAdmin();
}

export async function deleteEvent(formData: FormData) {
  await requireAdmin();
  const id = readString(formData, "id");
  if (!id) {
    throw new Error("Identifiant manquant.");
  }

  const current = await prisma.event.findUnique({ where: { id } });
  if (current?.image) {
    await deleteLocalFile(current.image);
  }

  await prisma.event.delete({ where: { id } });
  revalidateAdmin();
}

export async function uploadAdminImage(file: File) {
  await requireAdmin();
  const url = await uploadLocalFile(file);
  revalidatePath("/admin/medias");
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

  revalidateAdmin();
}

export async function updateMediaFromForm(formData: FormData) {
  await requireAdmin();
  const id = readString(formData, "id");
  if (!id) {
    throw new Error("Identifiant manquant.");
  }

  const current = await prisma.media.findUnique({ where: { id } });
  if (!current) {
    throw new Error("Média introuvable.");
  }

  const uploaded = await optionalUploadedUrl(formData, "file");
  const nextUrl = uploaded || readString(formData, "url") || current.url;

  if (uploaded && current.url !== nextUrl) {
    await deleteLocalFile(current.url);
  }

  await prisma.media.update({
    where: { id },
    data: {
      title: readString(formData, "title") || current.title,
      url: nextUrl,
      category: readString(formData, "category") || current.category,
      eventId: readString(formData, "eventId") || null,
      isFeaturedHome: formData.get("isFeaturedHome") === "on",
    },
  });

  revalidateAdmin();
}

export async function deleteMedia(formData: FormData) {
  await requireAdmin();
  const id = readString(formData, "id");
  if (!id) {
    throw new Error("Identifiant manquant.");
  }

  const current = await prisma.media.findUnique({ where: { id } });
  if (current) {
    await deleteLocalFile(current.url);
    await prisma.media.delete({ where: { id } });
  }

  revalidateAdmin();
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

  await prisma.article.create({
    data: {
      title,
      slug,
      content,
      author,
      coverImage: uploaded || readString(formData, "coverImage") || null,
      isPublished: formData.get("isPublished") === "on",
    },
  });

  revalidateAdmin();
}

export async function updateArticleFromForm(formData: FormData) {
  await requireAdmin();
  const id = readString(formData, "id");
  if (!id) {
    throw new Error("Identifiant manquant.");
  }

  const current = await prisma.article.findUnique({ where: { id } });
  if (!current) {
    throw new Error("Article introuvable.");
  }

  const uploaded = await optionalUploadedUrl(formData, "coverFile");
  const nextCover = uploaded || readString(formData, "coverImage") || null;

  if (uploaded && current.coverImage && current.coverImage !== nextCover) {
    await deleteLocalFile(current.coverImage);
  }

  await prisma.article.update({
    where: { id },
    data: {
      title: readString(formData, "title"),
      slug: readString(formData, "slug"),
      content: readString(formData, "content"),
      author: readString(formData, "author"),
      coverImage: nextCover,
      isPublished: formData.get("isPublished") === "on",
    },
  });

  revalidateAdmin();
}

export async function deleteArticle(formData: FormData) {
  await requireAdmin();
  const id = readString(formData, "id");
  if (!id) {
    throw new Error("Identifiant manquant.");
  }

  const current = await prisma.article.findUnique({ where: { id } });
  if (current?.coverImage) {
    await deleteLocalFile(current.coverImage);
  }

  await prisma.article.delete({ where: { id } });
  revalidateAdmin();
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

  revalidatePath("/");
  revalidatePath("/contact");
  revalidatePath("/don");
  revalidateAdmin();
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
    await prisma.siteSettings.update({
      where: { id },
      data: { key, value },
    });
  } else {
    await prisma.siteSettings.upsert({
      where: { key },
      create: { key, value },
      update: { value },
    });
  }

  revalidateAdmin();
}

export async function deleteSiteSetting(formData: FormData) {
  await requireAdmin();
  const id = readString(formData, "id");
  if (!id) {
    throw new Error("Identifiant manquant.");
  }

  const current = await prisma.siteSettings.findUnique({ where: { id } });
  const qrKeys = new Set<string>(PAYMENT_QR_KEYS);
  if (current && (current.key === CHURCH_LOGO_KEY || qrKeys.has(current.key))) {
    await deleteLocalFile(jsonToDisplay(current.value));
  }

  await prisma.siteSettings.delete({ where: { id } });
  revalidateAdmin();
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

  revalidateAdmin();
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

  revalidatePath("/don");
  revalidateAdmin();
}

export async function deletePaymentQr(formData: FormData) {
  await requireAdmin();
  const operator = readPaymentOperator(formData);
  const key = PAYMENT_QR_KEY_BY_OPERATOR[operator];
  const current = await prisma.siteSettings.findUnique({ where: { key } });

  if (current) {
    await deleteLocalFile(jsonToDisplay(current.value));
    await prisma.siteSettings.update({
      where: { key },
      data: { value: "" },
    });
  }

  revalidatePath("/don");
  revalidateAdmin();
}

export async function deleteChurchLogo() {
  await requireAdmin();
  const current = await prisma.siteSettings.findUnique({
    where: { key: CHURCH_LOGO_KEY },
  });

  if (current) {
    await deleteLocalFile(jsonToDisplay(current.value));
    await prisma.siteSettings.delete({ where: { id: current.id } });
  }

  revalidateAdmin();
}

export async function getEvents(): Promise<AdminEventRecord[]> {
  await requireAdmin();
  const events = await prisma.event.findMany({
    orderBy: { startDate: "desc" },
  });
  return events.map(serializeEvent);
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
    isPublished: article.isPublished,
    createdAt: article.createdAt.toISOString(),
  }));
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

export async function getAdminOverview() {
  await requireAdmin();
  try {
    const [events, media, articles] = await Promise.all([
      prisma.event.count(),
      prisma.media.count(),
      prisma.article.count(),
    ]);

    return { ok: true as const, events, media, articles };
  } catch {
    return { ok: false as const, events: 0, media: 0, articles: 0 };
  }
}

export async function signOutAdmin() {
  await logoutAction();
}
