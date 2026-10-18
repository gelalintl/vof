import { defaultLocale, isLocale, type Locale } from "@/i18n/config";

/** Retire le préfixe /fr ou /en. Renvoie toujours un chemin commençant par /. */
export function stripLocale(pathname: string): string {
  const stripped = pathname.replace(/^\/(fr|en)(?=\/|$)/, "");
  return stripped === "" ? "/" : stripped;
}

/** Préfixe un chemin interne. Les URL externes sont renvoyées telles quelles. */
export function withLocale(locale: Locale, pathname: string): string {
  if (!pathname.startsWith("/")) {
    return pathname;
  }
  const path = stripLocale(pathname);
  return path === "/" ? `/${locale}` : `/${locale}${path}`;
}

export function localeFromPathname(pathname: string): Locale | null {
  const match = pathname.match(/^\/(fr|en)(?=\/|$)/);
  return match && isLocale(match[1]) ? match[1] : null;
}

/**
 * Francophone → fr, tout autre langue déclarée → en.
 * Sans en-tête, on reste sur le français (langue par défaut du site).
 */
export function localeFromAcceptLanguage(header: string | null): Locale {
  if (!header) {
    return defaultLocale;
  }

  const tags = header
    .split(",")
    .map((part) => {
      const [tag, ...params] = part.trim().split(";");
      const q = params
        .map((param) => param.trim())
        .find((param) => param.startsWith("q="));
      const quality = q ? Number(q.slice(2)) : 1;
      return { tag: tag.toLowerCase(), quality: Number.isFinite(quality) ? quality : 0 };
    })
    .filter((item) => item.tag)
    .sort((a, b) => b.quality - a.quality);

  const preferred = tags[0]?.tag ?? "";
  if (preferred.startsWith("fr")) {
    return "fr";
  }
  if (preferred) {
    return "en";
  }
  return defaultLocale;
}
