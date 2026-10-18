import { cookies, headers } from "next/headers";
import { isLocale, LOCALE_COOKIE, LOCALE_HEADER, type Locale } from "@/i18n/config";
import { BILINGUAL_SETTING_KEYS, englishSettingKey } from "@/lib/siteSettingsKeys";

/** Locale de la requête : en-tête posé par le proxy, sinon le cookie du visiteur. */
export async function getRequestLocale(): Promise<Locale> {
  const header = (await headers()).get(LOCALE_HEADER);
  if (isLocale(header)) {
    return header;
  }
  const cookie = (await cookies()).get(LOCALE_COOKIE)?.value;
  if (isLocale(cookie)) {
    return cookie;
  }
  return "fr";
}

/** Texte affiché : anglais s'il est renseigné, sinon le français. */
export function localizedText(
  locale: Locale,
  french: string,
  english?: string | null,
): string {
  const translation = english?.trim();
  return locale === "en" && translation ? translation : french;
}

export function localizedOptional(
  locale: Locale,
  french: string | null | undefined,
  english?: string | null,
): string | null {
  if (!french && !english) {
    return null;
  }
  return localizedText(locale, french ?? "", english);
}

/** Recouvre les textes français par leur version anglaise quand elle existe. */
export function localizeSettings(
  settings: Record<string, string>,
  locale: Locale,
): Record<string, string> {
  if (locale !== "en") {
    return settings;
  }
  const next = { ...settings };
  for (const key of BILINGUAL_SETTING_KEYS) {
    const translation = settings[englishSettingKey(key)]?.trim();
    if (translation) {
      next[key] = translation;
    }
  }
  return next;
}
