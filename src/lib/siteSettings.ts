import { siteConfig } from "@/config/site";
import { prisma } from "@/lib/prisma";
import {
  mergePaymentSettings,
  paymentConfigFromSettings,
} from "@/lib/paymentConfig";
import {
  contactFromSettings,
  getSiteSettings,
  identityFromSettings,
  homeEditorialFallbacks,
} from "@/lib/settings";
import {
  CHURCH_LOGO_KEY,
  emptyManagedSettings,
  jsonToDisplay,
  MANAGED_SETTING_KEYS,
  PAYMENT_SETTING_KEYS,
  PRINT_SETTING_KEYS,
  emptyPrintSettings,
  type ManagedSettingKey,
  type PaymentSettingKey,
  type PrintSettingKey,
} from "@/lib/siteSettingsKeys";
import type { PublicPaymentConfig, PublicSiteContact } from "@/types";

export {
  CHURCH_LOGO_KEY,
  FEATURED_YOUTUBE_URL_KEY,
  HOME_ADDRESS_KEY,
  WELCOME_AUTHOR_KEY,
  WELCOME_CONTENT_KEY,
  WELCOME_SUBTEXT_KEY,
  WELCOME_TAGLINE_KEY,
  WHATSAPP_CHANNEL_URL_KEY,
  WHATSAPP_NUMBER_KEY,
  emptyManagedSettings,
  emptyPaymentSettings,
  emptyPrintSettings,
  jsonToDisplay,
  LOCATION_SETTING_KEYS,
  MANAGED_SETTING_KEYS,
  normalizeMapsEmbedUrl,
  parseSettingValue,
  PAYMENT_QR_KEY_BY_OPERATOR,
  PAYMENT_QR_KEYS,
  PAYMENT_SETTING_KEYS,
  PRINT_SETTING_KEYS,
  SOCIAL_SETTING_KEYS,
  toWhatsAppHref,
  whatsappPrefillHref,
  UPSERTABLE_SETTING_KEYS,
} from "@/lib/siteSettingsKeys";
export type {
  ManagedSettingKey,
  PaymentOperatorSlug,
  PaymentSettingKey,
  PrintSettingKey,
} from "@/lib/siteSettingsKeys";

export async function getSettingsMap(keys?: readonly string[]): Promise<Record<string, string>> {
  const all = await getSiteSettings();
  if (!keys) {
    return all;
  }

  const result: Record<string, string> = {};
  for (const key of keys) {
    if (Object.hasOwn(all, key)) {
      result[key] = all[key];
    }
  }
  return result;
}

export async function getChurchLogo(): Promise<string | null> {
  const identity = identityFromSettings(await getSiteSettings());
  return identity.logoSrc;
}

export async function getPublicSiteContact(): Promise<PublicSiteContact> {
  return contactFromSettings(await getSiteSettings());
}

export async function getManagedSettings(): Promise<Record<ManagedSettingKey, string>> {
  const map = await getSettingsMap(MANAGED_SETTING_KEYS);
  const defaults = emptyManagedSettings();
  const copy = homeEditorialFallbacks();

  return {
    church_name: map.church_name || siteConfig.legalName,
    church_tagline: map.church_tagline || siteConfig.tagline,
    social_facebook: map.social_facebook ?? siteConfig.social.facebook,
    social_instagram: map.social_instagram ?? siteConfig.social.instagram,
    social_youtube: map.social_youtube ?? siteConfig.social.youtube,
    social_tiktok: map.social_tiktok ?? defaults.social_tiktok,
    social_whatsapp: map.social_whatsapp ?? siteConfig.contacts.phone,
    location_address: map.location_address ?? siteConfig.location.address,
    location_city: map.location_city ?? siteConfig.location.country,
    location_google_maps_url: map.location_google_maps_url ?? siteConfig.location.mapsShareUrl,
    location_iframe_url: map.location_iframe_url ?? siteConfig.location.mapsEmbedUrl,
    contact_phone: map.contact_phone ?? siteConfig.contacts.phone,
    contact_email: map.contact_email ?? siteConfig.contacts.email,
    featured_youtube_url: map.featured_youtube_url ?? defaults.featured_youtube_url,
    address: map.address || copy.address,
    whatsapp_number: map.whatsapp_number || copy.whatsapp_number,
    whatsapp_channel_url: map.whatsapp_channel_url || copy.whatsapp_channel_url,
    welcome_tagline: map.welcome_tagline || copy.welcome_tagline,
    welcome_author: map.welcome_author || copy.welcome_author,
    welcome_content: map.welcome_content || copy.welcome_content,
    welcome_subtext: map.welcome_subtext || copy.welcome_subtext,
  };
}

export async function getPaymentSettings(): Promise<Record<PaymentSettingKey, string>> {
  const map = await getSettingsMap(PAYMENT_SETTING_KEYS);
  const merged = mergePaymentSettings(map);
  const missing = PAYMENT_SETTING_KEYS.filter((key) => !Object.hasOwn(map, key));

  if (missing.length > 0) {
    try {
      await prisma.siteSettings.createMany({
        data: missing.map((key) => ({ key, value: merged[key] })),
        skipDuplicates: true,
      });
    } catch {
      // La lecture publique ne doit pas échouer si l'écriture des défauts est indisponible.
    }
  }

  return merged;
}

export async function getPublicPaymentConfig(): Promise<PublicPaymentConfig> {
  const settings = await getPaymentSettings();
  return paymentConfigFromSettings(settings);
}

export async function getPrintSettings(): Promise<Record<PrintSettingKey, string>> {
  const map = await getSettingsMap(PRINT_SETTING_KEYS);
  const merged = { ...emptyPrintSettings(), ...map };
  const missing = PRINT_SETTING_KEYS.filter((key) => !Object.hasOwn(map, key));

  if (missing.length > 0) {
    try {
      await prisma.siteSettings.createMany({
        data: missing.map((key) => ({ key, value: merged[key] })),
        skipDuplicates: true,
      });
    } catch {
      // La lecture admin ne doit pas échouer si l'écriture des défauts est indisponible.
    }
  }

  return merged;
}
