export const MEDIA_BUCKET = "vof-medias";

/** Origine de l'API Supabase. Accepte une URL sans protocole et l'hôte `db.` par erreur. */
export function supabaseProjectOrigin() {
  const raw = process.env.NEXT_PUBLIC_SUPABASE_URL?.trim();
  if (!raw) {
    return "";
  }

  const withProtocol = /^https?:\/\//i.test(raw) ? raw : `https://${raw}`;
  try {
    const url = new URL(withProtocol);
    if (url.hostname.startsWith("db.")) {
      url.hostname = url.hostname.slice(3);
    }
    return url.origin;
  } catch {
    return "";
  }
}

export function publicMediaPrefix() {
  const base = supabaseProjectOrigin();
  if (!base) {
    return "";
  }
  return `${base}/storage/v1/object/public/${MEDIA_BUCKET}/`;
}

export function isPersistedMediaUrl(url: string | null | undefined) {
  if (!url) {
    return false;
  }
  if (url.startsWith("/uploads/")) {
    return true;
  }
  const prefix = publicMediaPrefix();
  return prefix.length > 0 && url.startsWith(prefix);
}

export function objectPathFromPublicUrl(url: string) {
  const prefix = publicMediaPrefix();
  if (!prefix || !url.startsWith(prefix)) {
    return null;
  }

  const objectPath = decodeURIComponent(url.slice(prefix.length).split("?")[0] ?? "");
  if (!objectPath || objectPath.startsWith("/") || objectPath.includes("..")) {
    return null;
  }
  return objectPath;
}
