"use client";

import { usePathname, useRouter } from "next/navigation";
import { LOCALE_COOKIE, LOCALE_COOKIE_MAX_AGE, locales, type Locale } from "@/i18n/config";
import { getDictionary } from "@/i18n/getDictionary";
import { localeFromPathname, stripLocale, withLocale } from "@/i18n/routing";
import { cn } from "@/utils/cn";

/** Bascule FR / EN en conservant le chemin, et mémorise le choix dans un cookie. */
export function LanguageSwitcher({ className }: { className?: string }) {
  const pathname = usePathname();
  const router = useRouter();
  const current = localeFromPathname(pathname) ?? "fr";
  const label = getDictionary(current).language.label;

  function switchTo(locale: Locale) {
    if (locale === current) {
      return;
    }
    document.cookie = `${LOCALE_COOKIE}=${locale}; Path=/; Max-Age=${LOCALE_COOKIE_MAX_AGE}; SameSite=Lax`;
    const next = withLocale(locale, stripLocale(pathname));
    router.push(`${next}${window.location.search}${window.location.hash}`);
  }

  return (
    <div
      role="group"
      aria-label={label}
      className={cn(
        "inline-flex items-center rounded-full border border-violet-200 p-0.5 font-heading text-xs font-bold tracking-tight",
        className,
      )}
    >
      {locales.map((locale) => {
        const isActive = locale === current;
        return (
          <button
            key={locale}
            type="button"
            onClick={() => switchTo(locale)}
            aria-pressed={isActive}
            className={cn(
              "rounded-full px-2.5 py-1 uppercase",
              isActive ? "bg-violet-700 text-white" : "text-slate-600 hover:text-violet-700",
            )}
          >
            {locale}
          </button>
        );
      })}
    </div>
  );
}
