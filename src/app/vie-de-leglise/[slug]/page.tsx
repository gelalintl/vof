import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { events, getEventBySlug, toEventDetailView } from "@/datas/events";
import { AuthorSignature } from "@/ui/components/AuthorSignature";
import { ContentSection } from "@/ui/components/ContentSection";
import { EventHeadline } from "@/ui/components/EventHeadline";
import { MediaCover } from "@/ui/components/MediaCover";
import { ProseBlocks } from "@/ui/components/ProseBlocks";
import { YoutubeLiteEmbed } from "@/ui/components/YoutubeLiteEmbed";
import { GalleryGrid } from "@/ui/components/gallery";
import { MainLayout } from "@/ui/layouts/MainLayout";
import { CommentSection } from "@/ui/modules/events/CommentSection";

interface EventDetailPageProps {
  params: Promise<{ slug: string }>;
}

export function generateStaticParams() {
  return events.map((event) => ({ slug: event.slug }));
}

export async function generateMetadata({
  params,
}: EventDetailPageProps): Promise<Metadata> {
  const { slug } = await params;
  const event = getEventBySlug(slug);

  if (!event) {
    return { title: "Événement introuvable" };
  }

  return {
    title: event.title,
    description: event.description,
  };
}

export default async function EventDetailPage({ params }: EventDetailPageProps) {
  const { slug } = await params;
  const event = getEventBySlug(slug);

  if (!event) {
    notFound();
  }

  const view = toEventDetailView(event);

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
        <ProseBlocks text={view.body} />
        {view.author ? <AuthorSignature {...view.author} /> : null}
        <CommentSection eventTitle={view.title} comments={view.comments} />
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
