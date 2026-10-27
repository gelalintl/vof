export const dynamic = "force-dynamic";

import type { MetadataRoute } from "next";
import { locales } from "@/i18n/config";
import { prisma } from "@/lib/prisma";
import { publicSiteUrl } from "@/lib/socialMetadata";

const STATIC_PATHS = [
  "",
  "/contact",
  "/don",
  "/enseignements",
  "/projets",
  "/vie-de-leglise",
] as const;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = publicSiteUrl();

  const staticEntries: MetadataRoute.Sitemap = locales.flatMap((locale) =>
    STATIC_PATHS.map((path) => ({
      url: `${base}/${locale}${path}`,
      lastModified: new Date(),
      changeFrequency: path === "" ? "daily" : "weekly",
    })),
  );

  const [articles, projects, events] = await Promise.all([
    prisma.article.findMany({
      where: { isPublished: true },
      select: { slug: true, publishedAt: true, createdAt: true },
    }),
    prisma.project.findMany({
      where: { status: "IN_PROGRESS" },
      select: { slug: true, updatedAt: true },
    }),
    prisma.event.findMany({
      select: { id: true, slug: true, createdAt: true },
    }),
  ]);

  const articleEntries: MetadataRoute.Sitemap = articles.flatMap((article) =>
    locales.map((locale) => ({
      url: `${base}/${locale}/enseignements/${encodeURIComponent(article.slug)}`,
      lastModified: article.publishedAt ?? article.createdAt,
      changeFrequency: "weekly",
    })),
  );

  const projectEntries: MetadataRoute.Sitemap = projects.flatMap((project) =>
    locales.map((locale) => ({
      url: `${base}/${locale}/don?projet=${encodeURIComponent(project.slug)}`,
      lastModified: project.updatedAt,
      changeFrequency: "weekly",
    })),
  );

  const eventEntries: MetadataRoute.Sitemap = events.flatMap((event) => {
    const slug = event.slug?.trim() || event.id;
    return locales.map((locale) => ({
      url: `${base}/${locale}/vie-de-leglise/${encodeURIComponent(slug)}`,
      lastModified: event.createdAt,
      changeFrequency: "weekly",
    }));
  });

  return [...staticEntries, ...articleEntries, ...projectEntries, ...eventEntries];
}
