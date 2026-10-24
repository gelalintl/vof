import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { isLocale } from "@/i18n/config";
import { toEventDetailView } from "@/lib/eventPresentation";
import { getEventBySlug } from "@/lib/publicContent";
import { excerptRichText } from "@/lib/richText";
import { AuthorSignature, EventHeadline, ProseHtml } from "@/ui/components/content";
import { ContentSection } from "@/ui/components/layout";
import { GalleryGrid, MediaCover, YoutubeLiteEmbed } from "@/ui/components/media";
import { MainLayout } from "@/ui/layouts/MainLayout";
import { CommentSection } from "@/ui/modules/events";

interface EventDetailPageProps {
  params: Promise<{ locale: string; slug: string }>;
}

export async function generateMetadata({
  params,
}: EventDetailPageProps): Promise<Metadata> {
  const { slug } = await params;
  const event = await getEventBySlug(slug);

  if (!event) {
    return { title: "Événement introuvable" };
  }

  return {
    title: event.title,
    description: excerptRichText(event.description, 160),
  };
}

export default async function EventDetailPage({ params }: EventDetailPageProps) {
  const { locale: localeParam, slug } = await params;
  const locale = isLocale(localeParam) ? localeParam : "fr";
  const event = await getEventBySlug(slug);

  if (!event) {
    notFound();
  }

  const view = toEventDetailView(event, locale);

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
        <CommentSection eventTitle={view.title} comments={view.comments} locale={locale} />
        <GalleryGrid
          images={view.gallery}
          layout="grid"
          title="Galerie photo"
          titleId="galerie-event"
        />
      </ContentSection>
    </MainLayout>
  );
}
