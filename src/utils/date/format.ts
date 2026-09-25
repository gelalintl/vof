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

export function formatEventDate(isoOrDate: string | Date): string {
  const date = typeof isoOrDate === "string" ? parseIsoDate(isoOrDate) : isoOrDate;
  return new Intl.DateTimeFormat("fr-FR", {
    weekday: "long",
    day: "numeric",
    month: "long",
  }).format(date);
}

export function formatEventTime(iso: string): string {
  if (iso.includes("T")) {
    const date = new Date(iso);
    if (!Number.isNaN(date.getTime())) {
      const hours = String(date.getHours()).padStart(2, "0");
      const minutes = String(date.getMinutes()).padStart(2, "0");
      return `${hours}h${minutes}`;
    }
  }

  const time = iso.slice(11, 16);
  if (!time) {
    return "";
  }
  return time.replace(":", "h");
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
