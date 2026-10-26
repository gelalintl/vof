import type { MetadataRoute } from "next";
import { publicSiteUrl } from "@/lib/socialMetadata";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: "/sacristie",
    },
    sitemap: `${publicSiteUrl()}/sitemap.xml`,
  };
}
