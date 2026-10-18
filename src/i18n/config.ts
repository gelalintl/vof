export const locales = ["fr", "en"] as const;

export type Locale = (typeof locales)[number];

export const defaultLocale: Locale = "fr";

/** Choix explicite du visiteur. Lu par le proxy avant l'en-tête Accept-Language. */
export const LOCALE_COOKIE = "vof_locale";

export const LOCALE_HEADER = "x-vof-locale";

export const LOCALE_COOKIE_MAX_AGE = 60 * 60 * 24 * 365;

export function isLocale(value: string | null | undefined): value is Locale {
  return value === "fr" || value === "en";
}
