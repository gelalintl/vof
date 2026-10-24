import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { isLocale } from "@/i18n/config";
import { getDictionary } from "@/i18n/getDictionary";
import { metadataLocale } from "@/i18n/metadata";
import { getArticleBySlug } from "@/lib/publicContent";
import { MainLayout } from "@/ui/layouts/MainLayout";
import { TeachingDetail } from "@/ui/modules/enseignements";
import { excerpt } from "@/ui/modules/enseignements/excerpt";

interface TeachingDetailPageProps {
  params: Promise<{ locale: string; slug: string }>;
}

export async function generateMetadata({
  params,
}: TeachingDetailPageProps): Promise<Metadata> {
  const { locale, slug } = await params;
  const resolvedLocale = metadataLocale(locale);
  const article = await getArticleBySlug(slug, resolvedLocale);

  if (!article) {
    return { title: getDictionary(resolvedLocale).seo.teachingNotFound };
  }

  const description = excerpt(article.content, 160);
  return {
    title: article.title,
    description: description || undefined,
  };
}

export default async function TeachingDetailPage({ params }: TeachingDetailPageProps) {
  const { locale: localeParam, slug } = await params;
  const locale = isLocale(localeParam) ? localeParam : "fr";
  const { teachings, nav } = getDictionary(locale);
  const article = await getArticleBySlug(slug, locale);

  if (!article) {
    notFound();
  }

  return (
    <MainLayout>
      <TeachingDetail
        article={article}
        locale={locale}
        labels={{
          back: teachings.back,
          eventGallery: teachings.eventGallery,
          enlargeImage: teachings.enlargeImage,
          commentsTitle: teachings.commentsTitle,
          noComments: teachings.noComments,
          oneComment: teachings.oneComment,
          manyComments: teachings.manyComments,
          beFirst: teachings.beFirst,
          leaveComment: teachings.leaveComment,
          fullName: teachings.fullName,
          email: teachings.email,
          optional: teachings.optional,
          message: teachings.message,
          publishing: teachings.publishing,
          publish: teachings.publish,
          thanks: teachings.thanks,
          like: teachings.like,
          callAria: teachings.callAria,
          callQuote: teachings.callQuote,
          shareTestimony: nav.shareTestimony,
        }}
      />
    </MainLayout>
  );
}
