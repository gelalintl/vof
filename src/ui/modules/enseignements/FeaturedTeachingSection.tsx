import Link from "next/link";
import { CalendarDays, UserRound } from "lucide-react";
import type { ContentSectionTone, PublicArticle } from "@/types";
import { ContentSection, SectionHeader } from "@/ui/components/layout";
import { excerpt } from "@/ui/modules/enseignements/excerpt";
import { formatPublicationDate } from "@/utils/date/format";
import { Typography } from "@/ui/design-system/typography";
import { cn } from "@/utils/cn";
import { interactiveCardClass } from "@/utils/theme/interactiveCard";

const PLACEHOLDER_SRC = "/assets/pastors/placeholder.svg";

interface FeaturedTeachingSectionProps {
  article: PublicArticle | null;
  tone?: ContentSectionTone;
}

export function FeaturedTeachingSection({
  article,
  tone = "white",
}: FeaturedTeachingSectionProps) {
  if (!article) {
    return null;
  }

  return (
    <ContentSection tone={tone} labelledBy="enseignement-a-la-une">
      <SectionHeader
        titleId="enseignement-a-la-une"
        badge="À la une"
        title="Dernier enseignement à la une"
        description="La prédication mise en avant par l’équipe pastorale."
      />
      <Link
        href={`/enseignements/${article.slug}`}
        className={cn(
          interactiveCardClass,
          "block overflow-hidden lg:grid lg:grid-cols-[1.15fr_0.85fr]",
        )}
      >
        <div className="relative min-h-56 bg-slate-50 lg:min-h-full">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={article.coverImage || PLACEHOLDER_SRC}
            alt={article.title}
            className="h-56 w-full object-cover lg:absolute lg:inset-0 lg:h-full"
          />
        </div>
        <div className="flex flex-col justify-center bg-white px-6 py-8 sm:px-8">
          <Typography variant="h3" className="text-slate-900">
            {article.title}
          </Typography>
          <p className="mt-4 flex items-center gap-2 font-sans text-sm text-slate-600">
            <UserRound className="size-4 text-[#6d28d9]" aria-hidden />
            {article.author}
          </p>
          <p className="mt-1.5 flex items-center gap-2 font-sans text-sm text-slate-600">
            <CalendarDays className="size-4 text-[#6d28d9]" aria-hidden />
            {formatPublicationDate(article.publishedAt)}
          </p>
          <p className="mt-4 font-sans text-sm leading-relaxed text-slate-800">
            {excerpt(article.content)}
          </p>
          <span className="mt-6 inline-flex h-9 w-fit items-center rounded-full bg-[#6d28d9] px-3 font-heading text-sm font-bold tracking-tight text-white">
            Lire la suite
          </span>
        </div>
      </Link>
    </ContentSection>
  );
}
