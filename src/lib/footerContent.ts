import { mainNavigation } from "@/config/navigation";
import { siteConfig } from "@/config/site";
import {
  FOOTER_COPYRIGHT_KEY,
  FOOTER_DESCRIPTION_KEY,
  FOOTER_NAV_LINKS_KEY,
  FOOTER_SCHEDULE_ITEMS_KEY,
  FOOTER_SCHEDULE_TITLE_KEY,
  FOOTER_SHOW_CONTACT_KEY,
  FOOTER_SHOW_SOCIALS_KEY,
  isSettingEnabled,
  type FooterSettingKey,
} from "@/lib/siteSettingsKeys";
import type {
  FooterLink,
  FooterScheduleItem,
  NavItem,
  PublicFooterContent,
  PublicSiteIdentity,
} from "@/types";

function navItemsToFooterLinks(items: NavItem[]): FooterLink[] {
  return items.map((item) => ({ label: item.label, url: item.href }));
}

export const FOOTER_NAV_FALLBACKS: FooterLink[] = navItemsToFooterLinks(mainNavigation);

export const FOOTER_SCHEDULE_TITLE_FALLBACK = "Horaires des cultes";

export const FOOTER_SCHEDULE_FALLBACKS: FooterScheduleItem[] = siteConfig.worship.gatherings.map(
  (gathering) => ({
    label: gathering.label,
    time: `${gathering.day} ${gathering.time}`,
  }),
);

export function parseFooterLinks(raw: string | undefined): FooterLink[] {
  if (!raw?.trim()) {
    return [];
  }

  try {
    const parsed: unknown = JSON.parse(raw);
    if (!Array.isArray(parsed)) {
      return [];
    }

    return parsed
      .map((item) => {
        if (!item || typeof item !== "object") {
          return null;
        }
        const record = item as Record<string, unknown>;
        const label = String(record.label ?? "").trim();
        const url = String(record.url ?? record.href ?? "").trim();
        if (!label || !url) {
          return null;
        }
        return { label, url };
      })
      .filter((item): item is FooterLink => Boolean(item));
  } catch {
    return [];
  }
}

export function serializeFooterLinks(links: FooterLink[]): string {
  return JSON.stringify(
    links
      .map((link) => ({
        label: link.label.trim(),
        url: link.url.trim(),
      }))
      .filter((link) => link.label && link.url),
  );
}

export function parseFooterScheduleItems(raw: string | undefined): FooterScheduleItem[] {
  if (!raw?.trim()) {
    return [];
  }

  try {
    const parsed: unknown = JSON.parse(raw);
    if (!Array.isArray(parsed)) {
      return [];
    }

    return parsed
      .map((item) => {
        if (!item || typeof item !== "object") {
          return null;
        }
        const record = item as Record<string, unknown>;
        const label = String(record.label ?? "").trim();
        const time = String(record.time ?? "").trim();
        if (!label || !time) {
          return null;
        }
        return { label, time };
      })
      .filter((item): item is FooterScheduleItem => Boolean(item));
  } catch {
    return [];
  }
}

export function serializeFooterScheduleItems(items: FooterScheduleItem[]): string {
  return JSON.stringify(
    items
      .map((item) => ({
        label: item.label.trim(),
        time: item.time.trim(),
      }))
      .filter((item) => item.label && item.time),
  );
}

export function emptyFooterSettings(): Record<FooterSettingKey, string> {
  return {
    footer_description: "",
    footer_copyright: "",
    footer_nav_links: serializeFooterLinks(FOOTER_NAV_FALLBACKS),
    footer_schedule_title: FOOTER_SCHEDULE_TITLE_FALLBACK,
    footer_schedule_items: serializeFooterScheduleItems(FOOTER_SCHEDULE_FALLBACKS),
    footer_show_contact: "true",
    footer_show_socials: "true",
  };
}

function readFooterSetting(
  settings: Record<string, string>,
  key: string,
  fallback = "",
) {
  const value = settings[key]?.trim();
  return value || fallback;
}

function listFromSettings<T>(
  raw: string | undefined,
  fallback: T[],
  parse: (value: string | undefined) => T[],
): T[] {
  if (raw == null || raw.trim() === "") {
    return fallback;
  }
  return parse(raw);
}

export function footerDescriptionFallback(identity: PublicSiteIdentity) {
  return `${identity.tagline}. Rejoignez-nous pour le culte — ${identity.sundayTime}.`;
}

export function footerCopyrightFallback(churchName: string) {
  return `© ${new Date().getFullYear()} ${churchName}. Tous droits réservés.`;
}

export function buildPublicFooter(
  settings: Record<string, string>,
  identity: PublicSiteIdentity,
): PublicFooterContent {
  const rawNav = settings[FOOTER_NAV_LINKS_KEY] || settings.footer_col1_links;

  return {
    description: readFooterSetting(
      settings,
      FOOTER_DESCRIPTION_KEY,
      footerDescriptionFallback(identity),
    ),
    copyright: readFooterSetting(
      settings,
      FOOTER_COPYRIGHT_KEY,
      footerCopyrightFallback(identity.churchName),
    ),
    navLinks: listFromSettings(rawNav, FOOTER_NAV_FALLBACKS, parseFooterLinks),
    scheduleTitle: readFooterSetting(
      settings,
      FOOTER_SCHEDULE_TITLE_KEY,
      FOOTER_SCHEDULE_TITLE_FALLBACK,
    ),
    scheduleItems: listFromSettings(
      settings[FOOTER_SCHEDULE_ITEMS_KEY],
      FOOTER_SCHEDULE_FALLBACKS,
      parseFooterScheduleItems,
    ),
    showContact: isSettingEnabled(settings[FOOTER_SHOW_CONTACT_KEY], true),
    showSocials: isSettingEnabled(settings[FOOTER_SHOW_SOCIALS_KEY], true),
  };
}
