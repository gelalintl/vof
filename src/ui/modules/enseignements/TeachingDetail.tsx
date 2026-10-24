import { ArrowLeft, CalendarDays, UserRound } from "lucide-react";
import type { Locale } from "@/i18n/config";
import type { PublicArticle } from "@/types";
import { extractYoutubeId } from "@/lib/youtube";
import { sanitizeRichText, toEditorHtml } from "@/lib/richText";
import { YoutubeLiteEmbed } from "@/ui/components/media";
import { CallToTestify } from "@/ui/components/testimonials";
import { formatPublicationDate } from "@/utils/date/format";
import { Button } from "@/ui/design-system/button";
import { Typography } from "@/ui/design-system/typography";
import { CommentsSection } from "./CommentsSection";
import { EventGallery } from "./EventGallery";

const PLACEHOLDER_SRC = "/assets/pastors/placeholder.svg";

interface TeachingDetailProps {
  article: PublicArticle;
  locale?: Locale;
  labels: {
    back: string;
    eventGallery: string;
    enlargeImage: string;
    commentsTitle: string;
    noComments: string;
    oneComment: string;
    manyComments: string;
    beFirst: string;
    leaveComment: string;
    fullName: string;
    email: string;
    optional: string;
    message: string;
    publishing: string;
    publish: string;
    thanks: string;
    like: string;
    callAria: string;
    callQuote: string;
    shareTestimony: string;
  };
}

export function TeachingDetail({ article, locale = "fr", labels }: TeachingDetailProps) {
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
          {labels.back}
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
          {formatPublicationDate(article.publishedAt, locale)}
        </p>

        <div
          className="prose prose-purple lg:prose-lg mt-8 max-w-none border-t border-slate-200 pt-8 text-justify text-slate-800"
          dangerouslySetInnerHTML={{
            __html: sanitizeRichText(toEditorHtml(article.content)),
          }}
        />

        <EventGallery
          images={article.galleryImages}
          title={labels.eventGallery}
          enlargeLabel={labels.enlargeImage}
        />
        <CommentsSection
          articleId={article.id}
          initialComments={article.comments}
          locale={locale}
          labels={{
            title: labels.commentsTitle,
            noComments: labels.noComments,
            oneComment: labels.oneComment,
            manyComments: labels.manyComments,
            beFirst: labels.beFirst,
            leaveComment: labels.leaveComment,
            fullName: labels.fullName,
            email: labels.email,
            optional: labels.optional,
            message: labels.message,
            publishing: labels.publishing,
            publish: labels.publish,
            thanks: labels.thanks,
            like: labels.like,
          }}
        />
        <CallToTestify
          className="mt-12"
          labels={{
            aria: labels.callAria,
            quote: labels.callQuote,
            action: labels.shareTestimony,
          }}
        />
      </div>
    </article>
  );
}
