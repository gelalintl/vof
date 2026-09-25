export const CHURCH_LOGO_KEY = "church_logo";

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

export const MANAGED_SETTING_KEYS = [
  ...SOCIAL_SETTING_KEYS,
  ...LOCATION_SETTING_KEYS,
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

export const PAYMENT_QR_KEY_BY_OPERATOR: Record<PaymentOperatorSlug, PaymentQrKey> = {
  amana: "payment_amana_qr",
  nita: "payment_nita_qr",
  wave: "payment_wave_qr",
};

export const UPSERTABLE_SETTING_KEYS = [
  ...MANAGED_SETTING_KEYS,
  ...PAYMENT_SETTING_KEYS,
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

export function emptyManagedSettings(): Record<ManagedSettingKey, string> {
  return {
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
