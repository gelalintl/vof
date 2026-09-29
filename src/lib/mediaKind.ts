import { extractYoutubeId } from "@/lib/youtube";

export type AdminMediaKind = "image" | "video";

export function isVideoMediaUrl(url: string) {
  if (extractYoutubeId(url)) {
    return true;
  }
  return /vimeo\.com|\.mp4(\?|$)/i.test(url);
}

export function mediaKindFromUrl(url: string): AdminMediaKind {
  return isVideoMediaUrl(url) ? "video" : "image";
}

export function mediaThumbSrc(url: string) {
  const youtubeId = extractYoutubeId(url);
  if (youtubeId) {
    return `https://img.youtube.com/vi/${youtubeId}/hqdefault.jpg`;
  }
  return url;
}
