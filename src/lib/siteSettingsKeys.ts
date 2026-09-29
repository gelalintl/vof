export const CHURCH_LOGO_KEY = "church_logo";
export const CHURCH_NAME_KEY = "church_name";
export const CHURCH_TAGLINE_KEY = "church_tagline";
export const FEATURED_YOUTUBE_URL_KEY = "featured_youtube_url";
export const HOME_ADDRESS_KEY = "address";
export const WHATSAPP_NUMBER_KEY = "whatsapp_number";
export const WHATSAPP_CHANNEL_URL_KEY = "whatsapp_channel_url";
export const WELCOME_TAGLINE_KEY = "welcome_tagline";
export const WELCOME_AUTHOR_KEY = "welcome_author";
export const WELCOME_CONTENT_KEY = "welcome_content";
export const WELCOME_SUBTEXT_KEY = "welcome_subtext";

export const SOCIAL_SETTING_KEYS = [
  "social_facebook",
  "social_instagram",
  "social_youtube",
  "social_tiktok",
  "social_whatsapp",
] as const;

export const LOCATION_SETTING_KEYS = [
  "location_address",
  "location_city",
  "location_google_maps_url",
  "location_iframe_url",
  "contact_phone",
  "contact_email",
] as const;

export const MEDIA_SETTING_KEYS = [FEATURED_YOUTUBE_URL_KEY] as const;

export const HERO_BADGE_KEY = "hero_badge";
export const HERO_TITLE_KEY = "hero_title";
export const HERO_DESCRIPTION_KEY = "hero_description";
export const HERO_PRIMARY_CTA_TEXT_KEY = "hero_primary_cta_text";
export const HERO_PRIMARY_CTA_LINK_KEY = "hero_primary_cta_link";
export const HERO_SECONDARY_CTA_TEXT_KEY = "hero_secondary_cta_text";
export const HERO_SECONDARY_CTA_LINK_KEY = "hero_secondary_cta_link";

export const HERO_SETTING_KEYS = [
  HERO_BADGE_KEY,
  HERO_TITLE_KEY,
  HERO_DESCRIPTION_KEY,
  HERO_PRIMARY_CTA_TEXT_KEY,
  HERO_PRIMARY_CTA_LINK_KEY,
  HERO_SECONDARY_CTA_TEXT_KEY,
  HERO_SECONDARY_CTA_LINK_KEY,
] as const;

export const HOME_INFO_SETTING_KEYS = [
  HOME_ADDRESS_KEY,
  WHATSAPP_NUMBER_KEY,
  WHATSAPP_CHANNEL_URL_KEY,
] as const;

export const WELCOME_SETTING_KEYS = [
  WELCOME_TAGLINE_KEY,
  WELCOME_AUTHOR_KEY,
  WELCOME_CONTENT_KEY,
  WELCOME_SUBTEXT_KEY,
] as const;

export const IDENTITY_SETTING_KEYS = [CHURCH_NAME_KEY, CHURCH_TAGLINE_KEY] as const;

export const MANAGED_SETTING_KEYS = [
  ...IDENTITY_SETTING_KEYS,
  ...SOCIAL_SETTING_KEYS,
  ...LOCATION_SETTING_KEYS,
  ...MEDIA_SETTING_KEYS,
  ...HERO_SETTING_KEYS,
  ...HOME_INFO_SETTING_KEYS,
  ...WELCOME_SETTING_KEYS,
] as const;

export type ManagedSettingKey = (typeof MANAGED_SETTING_KEYS)[number];

export const PAYMENT_ENABLED_KEYS = [
  "payment_amana_enabled",
  "payment_nita_enabled",
  "payment_wave_enabled",
  "payment_card_enabled",
  "payment_bank_enabled",
] as const;

export const PAYMENT_QR_KEYS = [
  "payment_amana_qr",
  "payment_nita_qr",
  "payment_wave_qr",
] as const;

export const PAYMENT_PHONE_KEYS = [
  "payment_amana_phone",
  "payment_nita_phone",
  "payment_wave_phone",
] as const;

export const BANK_SETTING_KEYS = [
  "bank_name",
  "bank_account_name",
  "bank_iban",
  "bank_swift",
  "bank_rib_code",
] as const;

export const PAYMENT_SETTING_KEYS = [
  ...PAYMENT_ENABLED_KEYS,
  ...PAYMENT_QR_KEYS,
  ...PAYMENT_PHONE_KEYS,
  ...BANK_SETTING_KEYS,
] as const;

export type PaymentSettingKey = (typeof PAYMENT_SETTING_KEYS)[number];
export type PaymentQrKey = (typeof PAYMENT_QR_KEYS)[number];
export type PaymentOperatorSlug = "amana" | "nita" | "wave";

export const PRINT_SIGNATORY_TITLE_KEY = "print_signatory_title";
export const PRINT_HEADER_TITLE_KEY = "print_header_title";
export const PRINT_HEADER_SUBTITLE_KEY = "print_header_subtitle";
export const PRINT_USE_LOGO_KEY = "print_use_logo";

export const PRINT_SETTING_KEYS = [
  PRINT_SIGNATORY_TITLE_KEY,
  PRINT_HEADER_TITLE_KEY,
  PRINT_HEADER_SUBTITLE_KEY,
  PRINT_USE_LOGO_KEY,
] as const;

export type PrintSettingKey = (typeof PRINT_SETTING_KEYS)[number];

export const FOOTER_DESCRIPTION_KEY = "footer_description";
export const FOOTER_COPYRIGHT_KEY = "footer_copyright";
export const FOOTER_NAV_LINKS_KEY = "footer_nav_links";
export const FOOTER_SCHEDULE_TITLE_KEY = "footer_schedule_title";
export const FOOTER_SCHEDULE_ITEMS_KEY = "footer_schedule_items";
export const FOOTER_SHOW_CONTACT_KEY = "footer_show_contact";
export const FOOTER_SHOW_SOCIALS_KEY = "footer_show_socials";

export const FOOTER_SETTING_KEYS = [
  FOOTER_DESCRIPTION_KEY,
  FOOTER_COPYRIGHT_KEY,
  FOOTER_NAV_LINKS_KEY,
  FOOTER_SCHEDULE_TITLE_KEY,
  FOOTER_SCHEDULE_ITEMS_KEY,
  FOOTER_SHOW_CONTACT_KEY,
  FOOTER_SHOW_SOCIALS_KEY,
] as const;

export type FooterSettingKey = (typeof FOOTER_SETTING_KEYS)[number];

export const PAYMENT_QR_KEY_BY_OPERATOR: Record<PaymentOperatorSlug, PaymentQrKey> = {
  amana: "payment_amana_qr",
  nita: "payment_nita_qr",
  wave: "payment_wave_qr",
};

export const UPSERTABLE_SETTING_KEYS = [
  ...MANAGED_SETTING_KEYS,
  ...PAYMENT_SETTING_KEYS,
  ...PRINT_SETTING_KEYS,
  ...FOOTER_SETTING_KEYS,
] as const;

export function jsonToDisplay(value: unknown): string {
  if (typeof value === "string") {
    return value;
  }
  if (value == null) {
    return "";
  }
  return JSON.stringify(value, null, 2);
}

export function parseSettingValue(raw: string): string | number | boolean | object {
  const trimmed = raw.trim();
  if (!trimmed) {
    return "";
  }
  try {
    return JSON.parse(trimmed) as string | number | boolean | object;
  } catch {
    return trimmed;
  }
}

export function normalizeMapsEmbedUrl(value: string): string {
  const trimmed = value.trim();
  const match = trimmed.match(/src=["']([^"']+)["']/i);
  return match?.[1] ?? trimmed;
}

export function toWhatsAppHref(value: string): string {
  const trimmed = value.trim();
  if (!trimmed) {
    return "";
  }
  if (/^https?:\/\//i.test(trimmed)) {
    return trimmed;
  }
  const digits = trimmed.replace(/\D/g, "");
  return digits ? `https://wa.me/${digits}` : "";
}

export function whatsappPrefillHref(numberOrUrl: string, message: string) {
  const base = toWhatsAppHref(numberOrUrl);
  if (!base) {
    return "";
  }
  const separator = base.includes("?") ? "&" : "?";
  return `${base}${separator}text=${encodeURIComponent(message)}`;
}

export function emptyManagedSettings(): Record<ManagedSettingKey, string> {
  return {
    church_name: "",
    church_tagline: "",
    social_facebook: "",
    social_instagram: "",
    social_youtube: "",
    social_tiktok: "",
    social_whatsapp: "",
    location_address: "",
    location_city: "",
    location_google_maps_url: "",
    location_iframe_url: "",
    contact_phone: "",
    contact_email: "",
    featured_youtube_url: "",
    hero_badge: "",
    hero_title: "",
    hero_description: "",
    hero_primary_cta_text: "",
    hero_primary_cta_link: "",
    hero_secondary_cta_text: "",
    hero_secondary_cta_link: "",
    address: "",
    whatsapp_number: "",
    whatsapp_channel_url: "",
    welcome_tagline: "",
    welcome_author: "",
    welcome_content: "",
    welcome_subtext: "",
  };
}

export function isSettingEnabled(value: string | undefined, fallback = true): boolean {
  if (value == null || value.trim() === "") {
    return fallback;
  }
  return value.trim().toLowerCase() === "true";
}

export function emptyPaymentSettings(): Record<PaymentSettingKey, string> {
  return {
    payment_amana_enabled: "true",
    payment_nita_enabled: "true",
    payment_wave_enabled: "true",
    payment_card_enabled: "true",
    payment_bank_enabled: "true",
    payment_amana_qr: "",
    payment_nita_qr: "",
    payment_wave_qr: "",
    payment_amana_phone: "",
    payment_nita_phone: "",
    payment_wave_phone: "",
    bank_name: "",
    bank_account_name: "",
    bank_iban: "",
    bank_swift: "",
    bank_rib_code: "",
  };
}

export function emptyPrintSettings(): Record<PrintSettingKey, string> {
  return {
    print_signatory_title: "Le Trésorier Général",
    print_header_title: "Église Voice Of Freedom",
    print_header_subtitle: "Reçu de don",
    print_use_logo: "true",
  };
}
