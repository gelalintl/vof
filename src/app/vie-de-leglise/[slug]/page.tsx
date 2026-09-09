import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Clock, MapPin } from "lucide-react";
import { events, eventKindLabels, getEventBySlug } from "@/datas/events";
import { formatEventDate, formatEventTime } from "@/utils/date/format";
import { eventColorStyles } from "@/utils/theme/eventColors";
import { cn } from "@/utils/cn";
import { MainLayout } from "@/ui/layouts/MainLayout";
import { YoutubeLiteEmbed } from "@/ui/components/YoutubeLiteEmbed";
import { EventCover } from "@/ui/modules/events/EventCover";
import { EventPhotoGallery } from "@/ui/modules/events/EventPhotoGallery";
import { CommentSection } from "@/ui/modules/events/CommentSection";
import { Badge } from "@/ui/design-system/badge";
import { Typography } from "@/ui/design-system/typography";

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

  const colors = eventColorStyles[event.colorToken];
  const paragraphs = (event.body ?? event.description).split("\n\n");

  return (
    <MainLayout>
      <article className="bg-white">
        <div className="mx-auto max-w-4xl px-4 py-10 sm:px-6">
          <Badge variant={colors.badge}>{eventKindLabels[event.kind]}</Badge>
          <Typography variant="h1" className="mt-4">
            {event.title}
          </Typography>
          <p className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-2 font-sans text-sm text-slate-600">
            <span className="inline-flex items-center gap-2">
              <Clock className={cn("size-4", colors.text)} />
              {formatEventDate(event.startsAt)}
              {formatEventTime(event.startsAt)
                ? ` · ${formatEventTime(event.startsAt)}`
                : ""}
            </span>
            <span className="inline-flex items-center gap-2">
              <MapPin className={cn("size-4", colors.text)} />
              {event.location}
            </span>
          </p>

          <div className="mt-8">
            {event.youtubeId ? (
              <YoutubeLiteEmbed videoId={event.youtubeId} title={event.title} />
            ) : (
              <EventCover
                title={event.title}
                colorToken={event.colorToken}
                imageUrl={event.imageUrl}
              />
            )}
          </div>

          <div className="mt-8 space-y-4">
            {paragraphs.map((paragraph) => (
              <Typography key={paragraph.slice(0, 24)} variant="body">
                {paragraph}
              </Typography>
            ))}
          </div>

          {event.author ? (
            <footer className="mt-10 border-t border-violet-100 pt-6">
              <p className="font-sans text-xs font-medium uppercase tracking-[0.18em] text-sky-600">
                Signature de l&apos;auteur
              </p>
              <p className="mt-3 font-serif text-2xl italic text-violet-700">
                {event.author.signature ?? event.author.name}
              </p>
              <p className="mt-1 font-heading text-sm font-bold tracking-tight text-slate-800">
                {event.author.name} — {event.author.role}
              </p>
            </footer>
          ) : null}

          <div className="mt-12">
            <CommentSection
              eventTitle={event.title}
              comments={event.comments}
            />
          </div>

          {event.gallery && event.gallery.length > 0 ? (
            <EventPhotoGallery items={event.gallery} />
          ) : null}
        </div>
      </article>
    </MainLayout>
  );
}
