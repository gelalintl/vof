import type { Locale } from "@/i18n/config";

function intlLocale(locale: Locale) {
  return locale === "en" ? "en-GB" : "fr-FR";
}

function formatClock(hours: string, minutes: string, locale: Locale) {
  return locale === "en" ? `${hours}:${minutes}` : `${hours}h${minutes}`;
}

/** Réécrit les heures « 09h00 » d'un texte libre. L'anglais utilise « 09:00 ». */
export function formatClockLabel(value: string, locale: Locale = "fr") {
  if (locale !== "en") {
    return value;
  }
  return value.replace(/(\d{1,2})h(\d{2})/g, "$1:$2");
}

export function parseIsoDate(iso: string): Date {
  const [year, month, day] = iso.slice(0, 10).split("-").map(Number);
  return new Date(year, (month ?? 1) - 1, day ?? 1);
}

export function toDateKey(isoOrDate: string | Date): string {
  if (typeof isoOrDate === "string") {
    return isoOrDate.slice(0, 10);
  }

  const year = isoOrDate.getFullYear();
  const month = String(isoOrDate.getMonth() + 1).padStart(2, "0");
  const day = String(isoOrDate.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

export function formatEventDate(isoOrDate: string | Date, locale: Locale = "fr"): string {
  const date = typeof isoOrDate === "string" ? parseIsoDate(isoOrDate) : isoOrDate;
  return new Intl.DateTimeFormat(intlLocale(locale), {
    weekday: "long",
    day: "numeric",
    month: "long",
  }).format(date);
}

export function formatPublicationDate(
  isoOrDate: string | Date,
  locale: Locale = "fr",
): string {
  const date =
    typeof isoOrDate === "string"
      ? isoOrDate.includes("T") || isoOrDate.includes(" ")
        ? new Date(isoOrDate)
        : parseIsoDate(isoOrDate)
      : isoOrDate;
  if (Number.isNaN(date.getTime())) {
    return "";
  }

  return new Intl.DateTimeFormat(intlLocale(locale), {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(date);
}

export function formatEventTime(iso: string, locale: Locale = "fr"): string {
  if (iso.includes("T")) {
    const date = new Date(iso);
    if (!Number.isNaN(date.getTime())) {
      const hours = String(date.getHours()).padStart(2, "0");
      const minutes = String(date.getMinutes()).padStart(2, "0");
      return formatClock(hours, minutes, locale);
    }
  }

  const time = iso.slice(11, 16);
  if (!time) {
    return "";
  }
  const [hours, minutes] = time.split(":");
  if (!hours || !minutes) {
    return locale === "en" ? time : time.replace(":", "h");
  }
  return formatClock(hours.padStart(2, "0"), minutes, locale);
}

const MONTHS_FR = [
  "Janvier",
  "Février",
  "Mars",
  "Avril",
  "Mai",
  "Juin",
  "Juillet",
  "Août",
  "Septembre",
  "Octobre",
  "Novembre",
  "Décembre",
] as const;

export function formatAdminDateTime(isoOrDate: string | Date): string {
  const date = typeof isoOrDate === "string" ? new Date(isoOrDate) : isoOrDate;
  if (Number.isNaN(date.getTime())) {
    return "";
  }

  const day = date.getDate();
  const month = MONTHS_FR[date.getMonth()];
  const year = date.getFullYear();
  const hours = String(date.getHours()).padStart(2, "0");
  const minutes = String(date.getMinutes()).padStart(2, "0");

  return `${day} ${month} ${year} à ${hours}:${minutes}`;
}

export function toDatetimeLocalValue(isoOrDate: string | Date): string {
  const date = typeof isoOrDate === "string" ? new Date(isoOrDate) : isoOrDate;
  if (Number.isNaN(date.getTime())) {
    return "";
  }

  const pad = (value: number) => String(value).padStart(2, "0");
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}`;
}

export function toDateInputValue(isoOrDate: string | Date): string {
  const date = typeof isoOrDate === "string" ? new Date(isoOrDate) : isoOrDate;
  if (Number.isNaN(date.getTime())) {
    return "";
  }

  const pad = (value: number) => String(value).padStart(2, "0");
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;
}

export function toTimeInputValue(isoOrDate: string | Date): string {
  const date = typeof isoOrDate === "string" ? new Date(isoOrDate) : isoOrDate;
  if (Number.isNaN(date.getTime())) {
    return "";
  }

  const pad = (value: number) => String(value).padStart(2, "0");
  return `${pad(date.getHours())}:${pad(date.getMinutes())}`;
}
