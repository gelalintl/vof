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
  const time = iso.slice(11, 16);
  if (!time) {
    return "";
  }
  return time.replace(":", "h");
}
