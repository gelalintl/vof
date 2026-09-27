import { ArrowLeft, CalendarDays, UserRound } from "lucide-react";
import type { PublicArticle } from "@/types";
import { extractYoutubeId } from "@/lib/youtube";
import { ProseBlocks } from "@/ui/components/content";
import { YoutubeLiteEmbed } from "@/ui/components/media";
import { formatPublicationDate } from "@/utils/date/format";
import { Button } from "@/ui/design-system/button";
import { Typography } from "@/ui/design-system/typography";
import { CommentsSection } from "./CommentsSection";
import { EventGallery } from "./EventGallery";

const PLACEHOLDER_SRC = "/assets/pastors/placeholder.svg";

interface TeachingDetailProps {
  article: PublicArticle;
}

export function TeachingDetail({ article }: TeachingDetailProps) {
  const youtubeId = extractYoutubeId(article.youtubeUrl);

  return (
    <article className="bg-white">
      <div className="mx-auto max-w-3xl px-4 py-10 sm:px-6 sm:py-14">
        <Button
          href="/enseignements"
          variant="ghost"
          size="sm"
          className="w-fit px-0 text-[#6d28d9] hover:bg-transparent hover:text-violet-800"
        >
          <ArrowLeft className="size-4" aria-hidden />
          Retour aux enseignements
        </Button>

        <div className="mt-8">
          {youtubeId ? (
            <YoutubeLiteEmbed videoId={youtubeId} title={article.title} />
          ) : (
            <div className="relative aspect-[16/9] overflow-hidden border border-slate-200 bg-slate-50">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={article.coverImage || PLACEHOLDER_SRC}
                alt={article.title}
                className="h-full w-full object-cover"
              />
            </div>
          )}
        </div>

        <Typography variant="h1" className="mt-8 text-slate-900">
          {article.title}
        </Typography>
        <p className="mt-4 flex items-center gap-2 font-sans text-sm text-slate-600">
          <UserRound className="size-4 text-[#6d28d9]" aria-hidden />
          {article.author}
        </p>
        <p className="mt-1.5 flex items-center gap-2 font-sans text-sm text-slate-600">
          <CalendarDays className="size-4 text-[#6d28d9]" aria-hidden />
          {formatPublicationDate(article.createdAt)}
        </p>

        <div className="mt-8 border-t border-slate-200 pt-8 text-slate-800">
          <ProseBlocks text={article.content} />
        </div>

        <EventGallery images={article.galleryImages} />
        <CommentsSection articleId={article.id} initialComments={article.comments} />
      </div>
    </article>
  );
}
