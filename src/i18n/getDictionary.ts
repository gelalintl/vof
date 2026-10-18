import type { Locale } from "@/i18n/config";
import fr from "@/messages/fr.json";
import en from "@/messages/en.json";

const dictionaries = { fr, en } as const;

export type Dictionary = (typeof dictionaries)["fr"];

export function getDictionary(locale: Locale): Dictionary {
  return dictionaries[locale];
}

export function formatMessage(template: string, values: Record<string, string>) {
  return template.replace(/\{(\w+)\}/g, (_, key: string) => values[key] ?? "");
}
