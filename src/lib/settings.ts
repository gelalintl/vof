import { unstable_cache } from "next/cache";
import { siteConfig } from "@/config/site";
import { prisma } from "@/lib/prisma";
import { jsonToDisplay, normalizeMapsEmbedUrl } from "@/lib/siteSettingsKeys";
import type { PublicSiteContact, PublicSiteIdentity } from "@/types";

export const SITE_SETTINGS_CACHE_TAG = "site-settings";

export function siteSettingsFallbacks(): Record<string, string> {
  return {
    church_name: siteConfig.legalName,
    church_logo: "",
    church_tagline: siteConfig.tagline,
    sunday_service_time: `${siteConfig.worship.sunday.day} · ${siteConfig.worship.sunday.time}`,
    contact_phone: siteConfig.contacts.phone,
    contact_email: siteConfig.contacts.email,
    social_facebook: siteConfig.social.facebook,
    social_instagram: siteConfig.social.instagram,
    social_youtube: siteConfig.social.youtube,
    social_tiktok: "",
    social_whatsapp: siteConfig.contacts.whatsapp.href,
    location_address: siteConfig.location.address,
    location_city: siteConfig.location.country,
    location_google_maps_url: siteConfig.location.mapsShareUrl,
    location_iframe_url: siteConfig.location.mapsEmbedUrl,
  };
}

async function loadSiteSettings(): Promise<Record<string, string>> {
  const fallbacks = siteSettingsFallbacks();

  try {
    const rows = await prisma.siteSettings.findMany();
    const fromDb = Object.fromEntries(
      rows.map((row) => [row.key, jsonToDisplay(row.value)]),
    );
    return { ...fallbacks, ...fromDb };
  } catch {
    return fallbacks;
  }
}

export const getSiteSettings = unstable_cache(loadSiteSettings, ["site-settings"], {
  tags: [SITE_SETTINGS_CACHE_TAG],
  revalidate: 120,
});

export function readSetting(
  settings: Record<string, string>,
  key: string,
  fallback = "",
) {
  const value = settings[key]?.trim();
  return value || fallback;
}

export function identityFromSettings(
  settings: Record<string, string>,
): PublicSiteIdentity {
  const fallbacks = siteSettingsFallbacks();

  return {
    churchName: readSetting(settings, "church_name", fallbacks.church_name),
    tagline: readSetting(settings, "church_tagline", fallbacks.church_tagline),
    logoSrc: readSetting(settings, "church_logo") || null,
    sundayLabel: siteConfig.worship.sunday.label,
    sundayTime: readSetting(
      settings,
      "sunday_service_time",
      fallbacks.sunday_service_time,
    ),
  };
}

export function contactFromSettings(
  settings: Record<string, string>,
): PublicSiteContact {
  const fallbacks = siteSettingsFallbacks();

  return {
    social: {
      facebook: readSetting(settings, "social_facebook", fallbacks.social_facebook),
      instagram: readSetting(settings, "social_instagram", fallbacks.social_instagram),
      youtube: readSetting(settings, "social_youtube", fallbacks.social_youtube),
      tiktok: readSetting(settings, "social_tiktok"),
      whatsapp: readSetting(settings, "social_whatsapp", fallbacks.social_whatsapp),
    },
    location: {
      address: readSetting(settings, "location_address", fallbacks.location_address),
      city: readSetting(settings, "location_city", fallbacks.location_city),
      googleMapsUrl: readSetting(
        settings,
        "location_google_maps_url",
        fallbacks.location_google_maps_url,
      ),
      iframeUrl: normalizeMapsEmbedUrl(
        readSetting(settings, "location_iframe_url", fallbacks.location_iframe_url),
      ),
      phone: readSetting(settings, "contact_phone", fallbacks.contact_phone),
      email: readSetting(settings, "contact_email", fallbacks.contact_email),
    },
  };
}
