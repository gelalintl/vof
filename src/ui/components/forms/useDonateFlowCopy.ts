"use client";

import { usePathname } from "next/navigation";
import { getDictionary, type Dictionary } from "@/i18n/getDictionary";
import { localeFromPathname } from "@/i18n/routing";
import type { Locale } from "@/i18n/config";

export type DonateFlowCopy = Dictionary["donateFlow"];

export function useDonateFlowCopy() {
  const pathname = usePathname();
  const locale: Locale = localeFromPathname(pathname) ?? "fr";
  const messages = getDictionary(locale).donateFlow;

  function t<K extends keyof DonateFlowCopy>(key: K): DonateFlowCopy[K] {
    return messages[key];
  }

  return { locale, t };
}
