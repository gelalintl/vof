import type { Metadata } from "next";
import { headers } from "next/headers";
import type { Locale } from "@/i18n/config";

/** Image de repli quand la page n'a ni visuel ni logo téléversé. */
export const FALLBACK_OG_IMAGE = "/apple-icon";

export function socialMetadata(options: {
  title: string;
  description?: string;
  image?: string | null;
  type?: "website" | "article";
  locale: Locale;
}): Pick<Metadata, "openGraph" | "twitter"> {
  const image = options.image?.trim() || FALLBACK_OG_IMAGE;
  const description = options.description?.trim() || undefined;

  return {
    openGraph: {
      title: options.title,
      description,
      type: options.type ?? "website",
      locale: options.locale === "en" ? "en_US" : "fr_FR",
      images: [{ url: image, alt: options.title }],
    },
    twitter: {
      card: "summary_large_image",
      title: options.title,
      description,
      images: [image],
    },
  };
}

/** Origine publique du site. `NEXT_PUBLIC_SITE_URL` en production, localhost sinon. */
export function publicSiteUrl() {
  const raw = process.env.NEXT_PUBLIC_SITE_URL?.trim() || "http://localhost:3000";
  return raw.replace(/\/$/, "");
}

/** Origine absolue des images Open Graph (les chemins /uploads et /apple-icon restent relatifs). */
export async function requestMetadataBase(): Promise<URL> {
  const headerList = await headers();
  const host = headerList.get("x-forwarded-host") ?? headerList.get("host") ?? "localhost:3000";
  const forwarded = headerList.get("x-forwarded-proto");
  const proto = forwarded ?? (host.includes("localhost") ? "http" : "https");
  return new URL(`${proto}://${host}`);
}
