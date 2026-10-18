import type { Metadata } from "next";
import { isLocale } from "@/i18n/config";
import { getDictionary } from "@/i18n/getDictionary";
import { staticPageMetadata } from "@/i18n/metadata";
import { getPublishedArticles } from "@/lib/publicContent";
import { MainLayout } from "@/ui/layouts/MainLayout";
import { TeachingsCatalog } from "@/ui/modules/enseignements";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  return staticPageMetadata(locale, "teachings");
}

export default async function TeachingsPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale: localeParam } = await params;
  const locale = isLocale(localeParam) ? localeParam : "fr";
  const { teachings, common, home } = getDictionary(locale);
  const articles = await getPublishedArticles();

  return (
    <MainLayout>
      <TeachingsCatalog
        articles={articles}
        locale={locale}
        labels={{
          word: teachings.word,
          title: teachings.title,
          empty: teachings.empty,
          featured: home.featured,
          featuredTitle: teachings.featuredTitle,
          featuredByTeam: teachings.featuredByTeam,
          latestPublished: teachings.latestPublished,
          allTitle: teachings.allTitle,
          allDescription: teachings.allDescription,
          readMore: common.readMore,
        }}
      />
    </MainLayout>
  );
}
