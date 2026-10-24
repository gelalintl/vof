import type { Metadata } from "next";
import { isLocale, type Locale } from "@/i18n/config";
import { getDictionary } from "@/i18n/getDictionary";

export type StaticSeoPage =
  | "home"
  | "about"
  | "contact"
  | "donate"
  | "churchLife"
  | "teachings"
  | "projects"
  | "testimonials";

export function metadataLocale(value: string | undefined): Locale {
  return isLocale(value) ? value : "fr";
}

export function localeLayoutMetadata(locale: string): Metadata {
  const seo = getDictionary(metadataLocale(locale)).seo;
  return {
    title: {
      default: seo.defaultTitle,
      template: seo.titleTemplate,
    },
    description: seo.defaultDescription,
  };
}

export function staticPageMetadata(
  locale: string,
  page: StaticSeoPage,
  options?: { absolute?: boolean },
): Metadata {
  const seo = getDictionary(metadataLocale(locale)).seo;
  const entry = seo[page];
  // La page d'accueil partage le segment [locale] : le template du layout ne s'y applique pas.
  if (options?.absolute) {
    return {
      title: { absolute: seo.titleTemplate.replace("%s", entry.title) },
      description: entry.description,
    };
  }
  return {
    title: entry.title,
    description: entry.description,
  };
}
