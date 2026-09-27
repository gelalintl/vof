const YOUTUBE_ID_PATTERN = /^[A-Za-z0-9_-]{11}$/;

function validYoutubeId(value: string | undefined): string | null {
  if (!value) {
    return null;
  }
  const id = value.trim();
  return YOUTUBE_ID_PATTERN.test(id) ? id : null;
}

function youtubeHost(hostname: string) {
  return hostname.replace(/^(www|m)\./i, "").toLowerCase();
}

export function extractYoutubeId(urlOrId: string | null | undefined): string | null {
  if (!urlOrId) {
    return null;
  }

  const raw = urlOrId.trim();
  if (!raw) {
    return null;
  }

  const direct = validYoutubeId(raw);
  if (direct) {
    return direct;
  }

  try {
    const url = new URL(raw.includes("://") ? raw : `https://${raw}`);
    const host = youtubeHost(url.hostname);

    if (host === "youtu.be") {
      return validYoutubeId(url.pathname.split("/").filter(Boolean)[0]);
    }

    if (host === "youtube.com" || host === "youtube-nocookie.com") {
      const fromQuery = validYoutubeId(url.searchParams.get("v") ?? undefined);
      if (fromQuery) {
        return fromQuery;
      }

      const segments = url.pathname.split("/").filter(Boolean);
      const [kind, maybeId] = segments;
      if (
        maybeId &&
        (kind === "embed" || kind === "live" || kind === "shorts" || kind === "v")
      ) {
        return validYoutubeId(maybeId);
      }
    }
  } catch {
    return null;
  }

  return null;
}

export function normalizeYoutubeUrl(value: string | null | undefined): string | null {
  const trimmed = value?.trim() ?? "";
  if (!trimmed) {
    return null;
  }
  if (!extractYoutubeId(trimmed)) {
    throw new Error("Lien YouTube invalide.");
  }
  return trimmed;
}
