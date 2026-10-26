import { revalidatePath, revalidateTag } from "next/cache";
import { locales } from "@/i18n/config";
import {
  PUBLIC_ARTICLES_CACHE_TAG,
  PUBLIC_DEPARTMENTS_CACHE_TAG,
  PUBLIC_EVENTS_CACHE_TAG,
  PUBLIC_PROJECTS_CACHE_TAG,
  PUBLIC_MEDIA_CACHE_TAG,
  PUBLIC_PASTORS_CACHE_TAG,
  PUBLIC_TESTIMONIALS_CACHE_TAG,
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
  revalidatePath("/sacristie");
  revalidatePath(path);
  revalidatePath("/sacristie", "layout");
}

/** Rafraîchit une page publique dans les deux langues (/fr/... et /en/...). */
export function revalidatePublicPath(path: string, type?: "layout" | "page") {
  for (const locale of locales) {
    const localized = path === "/" ? `/${locale}` : `/${locale}${path}`;
    revalidatePath(localized, type);
  }
}

export function revalidateEventContent(slug?: string) {
  revalidateTag(PUBLIC_EVENTS_CACHE_TAG, "max");
  revalidatePublicPath("/");
  revalidatePublicPath("/vie-de-leglise");
  if (slug) {
    revalidatePublicPath(`/vie-de-leglise/${slug}`);
  }
  revalidateAdminPath("/sacristie/evenements");
  revalidatePath("/sacristie/evenements", "layout");
}

export function revalidateArticleContent(slug?: string) {
  revalidateTag(PUBLIC_ARTICLES_CACHE_TAG, "max");
  revalidatePublicPath("/enseignements");
  if (slug) {
    revalidatePublicPath(`/enseignements/${slug}`);
  }
  revalidateAdminPath("/sacristie/enseignements");
}

export function revalidateMediaContent() {
  revalidateTag(PUBLIC_MEDIA_CACHE_TAG, "max");
  revalidatePublicPath("/");
  revalidatePublicPath("/galerie");
  revalidateAdminPath("/sacristie/medias");
  revalidatePath("/sacristie/medias", "layout");
}

export function revalidatePastorContent() {
  revalidateTag(PUBLIC_PASTORS_CACHE_TAG, "max");
  revalidatePublicPath("/a-propos");
  revalidateAdminPath("/sacristie/pasteurs");
  revalidatePath("/sacristie/pasteurs", "layout");
}

export function revalidateDepartmentContent() {
  revalidateTag(PUBLIC_DEPARTMENTS_CACHE_TAG, "max");
  revalidatePublicPath("/departements");
  revalidateAdminPath("/sacristie/departements");
}

export function revalidateTestimonialContent() {
  revalidateTag(PUBLIC_TESTIMONIALS_CACHE_TAG, "max");
  revalidatePublicPath("/");
  revalidatePublicPath("/temoignages");
  revalidateAdminPath("/sacristie/temoignages");
}

export function revalidateProjectContent() {
  revalidateTag(PUBLIC_PROJECTS_CACHE_TAG, "max");
  revalidatePublicPath("/");
  revalidatePublicPath("/projets");
  revalidatePublicPath("/don");
  revalidateAdminPath("/sacristie/projets");
  revalidateAdminPath("/sacristie/dons");
}

export function revalidateDonationContent() {
  revalidateTag(PUBLIC_PROJECTS_CACHE_TAG, "max");
  revalidatePublicPath("/");
  revalidatePublicPath("/projets");
  revalidatePublicPath("/don");
  revalidateAdminPath("/sacristie/dons");
  revalidateAdminPath("/sacristie/projets");
}

export function revalidateSettingsContent() {
  revalidateTag(SITE_SETTINGS_CACHE_TAG, "max");
  revalidatePublicPath("/", "layout");
  revalidatePublicPath("/");
  revalidatePath("/icon");
  revalidatePath("/apple-icon");
  revalidatePublicPath("/contact");
  revalidatePublicPath("/don");
  revalidatePublicPath("/a-propos");
  revalidateAdminPath("/sacristie/parametres");
  revalidatePath("/sacristie/parametres", "layout");
}
