import { revalidatePath, revalidateTag } from "next/cache";
import {
  PUBLIC_ARTICLES_CACHE_TAG,
  PUBLIC_DEPARTMENTS_CACHE_TAG,
  PUBLIC_EVENTS_CACHE_TAG,
  PUBLIC_PROJECTS_CACHE_TAG,
  PUBLIC_MEDIA_CACHE_TAG,
  PUBLIC_PASTORS_CACHE_TAG,
} from "@/lib/publicContent";
import { SITE_SETTINGS_CACHE_TAG } from "@/lib/settings";

export function isPrismaNotFound(error: unknown) {
  return (
    typeof error === "object" &&
    error !== null &&
    "code" in error &&
    (error as { code?: string }).code === "P2025"
  );
}

export async function runPrismaWrite<T>(
  operation: () => Promise<T>,
  notFoundMessage: string,
): Promise<T> {
  try {
    return await operation();
  } catch (error) {
    if (isPrismaNotFound(error)) {
      throw new Error(notFoundMessage);
    }
    throw error;
  }
}

export function requireRecordId(id: string, message = "Identifiant manquant.") {
  const trimmed = id.trim();
  if (!trimmed) {
    throw new Error(message);
  }
  return trimmed;
}

function revalidateAdminPath(path: string) {
  revalidatePath("/admin");
  revalidatePath(path);
  revalidatePath("/admin", "layout");
}

export function revalidateEventContent(slug?: string) {
  revalidateTag(PUBLIC_EVENTS_CACHE_TAG, "max");
  revalidatePath("/");
  revalidatePath("/vie-de-leglise");
  if (slug) {
    revalidatePath(`/vie-de-leglise/${slug}`);
  }
  revalidateAdminPath("/admin/evenements");
  revalidatePath("/admin/evenements", "layout");
}

export function revalidateArticleContent(slug?: string) {
  revalidateTag(PUBLIC_ARTICLES_CACHE_TAG, "max");
  revalidatePath("/enseignements");
  if (slug) {
    revalidatePath(`/enseignements/${slug}`);
  }
  revalidateAdminPath("/admin/enseignements");
}

export function revalidateMediaContent() {
  revalidateTag(PUBLIC_MEDIA_CACHE_TAG, "max");
  revalidatePath("/");
  revalidateAdminPath("/admin/medias");
  revalidatePath("/admin/medias", "layout");
}

export function revalidatePastorContent() {
  revalidateTag(PUBLIC_PASTORS_CACHE_TAG, "max");
  revalidatePath("/a-propos");
  revalidateAdminPath("/admin/pasteurs");
  revalidatePath("/admin/pasteurs", "layout");
}

export function revalidateDepartmentContent() {
  revalidateTag(PUBLIC_DEPARTMENTS_CACHE_TAG, "max");
  revalidatePath("/departements");
  revalidateAdminPath("/admin/departements");
}

export function revalidateProjectContent() {
  revalidateTag(PUBLIC_PROJECTS_CACHE_TAG, "max");
  revalidatePath("/");
  revalidatePath("/projets");
  revalidatePath("/don");
  revalidateAdminPath("/admin/projets");
  revalidateAdminPath("/admin/dons");
}

export function revalidateDonationContent() {
  revalidateTag(PUBLIC_PROJECTS_CACHE_TAG, "max");
  revalidatePath("/");
  revalidatePath("/projets");
  revalidatePath("/don");
  revalidateAdminPath("/admin/dons");
  revalidateAdminPath("/admin/projets");
}

export function revalidateSettingsContent() {
  revalidateTag(SITE_SETTINGS_CACHE_TAG, "max");
  revalidatePath("/", "layout");
  revalidatePath("/");
  revalidatePath("/contact");
  revalidatePath("/don");
  revalidateAdminPath("/admin/parametres");
  revalidatePath("/admin/parametres", "layout");
}
