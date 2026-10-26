import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { isLocale } from "@/i18n/config";
import { getDictionary } from "@/i18n/getDictionary";
import { toEventDetailView } from "@/lib/eventPresentation";
import { getApprovedEventComments, getEventBySlug } from "@/lib/publicContent";
import { excerptRichText } from "@/lib/richText";
import { socialMetadata } from "@/lib/socialMetadata";
import { getChurchLogo } from "@/lib/siteSettings";
import { AuthorSignature, EventHeadline, ProseHtml } from "@/ui/components/content";
import { ContentSection } from "@/ui/components/layout";
import { GalleryGrid, MediaCover, YoutubeLiteEmbed } from "@/ui/components/media";
import { MainLayout } from "@/ui/layouts/MainLayout";
import { CommentsSection } from "@/ui/modules/enseignements";

interface EventDetailPageProps {
  params: Promise<{ locale: string; slug: string }>;
}

export async function generateMetadata({
  params,
}: EventDetailPageProps): Promise<Metadata> {
  const { locale, slug } = await params;
  const resolvedLocale = isLocale(locale) ? locale : "fr";
  const event = await getEventBySlug(slug);

  if (!event) {
    return { title: getDictionary(resolvedLocale).seo.eventNotFound };
  }

  const description = excerptRichText(event.description, 160);
  const logo = await getChurchLogo();
  return {
    title: event.title,
    description,
    ...socialMetadata({
      title: event.title,
      description,
      image: event.imageUrl || logo,
      type: "article",
      locale: resolvedLocale,
    }),
  };
}

export default async function EventDetailPage({ params }: EventDetailPageProps) {
  const { locale: localeParam, slug } = await params;
  const locale = isLocale(localeParam) ? localeParam : "fr";
  const { teachings, churchLife } = getDictionary(locale);
  const event = await getEventBySlug(slug);

  if (!event) {
    notFound();
  }

  const view = toEventDetailView(event, locale);
  const comments = await getApprovedEventComments(event.id);

  return (
    <MainLayout>
      <ContentSection width="article" padding="compact">
        <EventHeadline {...view.headline} />
        {view.youtubeId ? (
          <YoutubeLiteEmbed videoId={view.youtubeId} title={view.title} />
        ) : (
          <MediaCover
            alt={view.cover.alt}
            src={view.cover.src}
            colorToken={view.cover.colorToken}
          />
        )}
        <ProseHtml html={view.body} className="mt-8" />
        {view.author ? <AuthorSignature {...view.author} /> : null}
        <CommentsSection
          eventId={event.id}
          initialComments={comments}
          locale={locale}
          labels={{
            title: teachings.commentsTitle,
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
          }}
        />
        <GalleryGrid
          images={view.gallery}
          layout="grid"
          title={churchLife.photoGallery}
          titleId="galerie-event"
        />
      </ContentSection>
    </MainLayout>
  );
}
