import Link from "next/link";
import { CalendarDays, UserRound } from "lucide-react";
import type { Locale } from "@/i18n/config";
import type { PublicArticle } from "@/types";
import { excerpt } from "@/ui/modules/enseignements/excerpt";
import { formatPublicationDate } from "@/utils/date/format";
import { Badge } from "@/ui/design-system/badge";
import { Typography } from "@/ui/design-system/typography";
import { cn } from "@/utils/cn";
import { interactiveCardClass } from "@/utils/theme/interactiveCard";

const PLACEHOLDER_SRC = "/assets/pastors/placeholder.svg";

interface TeachingsCatalogProps {
  articles: PublicArticle[];
  locale?: Locale;
  labels: {
    word: string;
    title: string;
    empty: string;
    featured: string;
    featuredTitle: string;
    featuredByTeam: string;
    latestPublished: string;
    allTitle: string;
    allDescription: string;
    readMore: string;
  };
}

export function TeachingsCatalog({
  articles,
  locale = "fr",
  labels,
}: TeachingsCatalogProps) {
  const [featured, ...others] = articles;

  if (!featured) {
    return (
      <section className="bg-white" aria-labelledby="enseignements-title">
        <div className="mx-auto max-w-6xl px-4 py-14 sm:px-6">
          <Badge variant="accent">{labels.word}</Badge>
          <Typography id="enseignements-title" variant="h2" className="mt-3 text-slate-900">
            {labels.title}
          </Typography>
          <p className="mt-6 font-sans text-sm text-slate-600">{labels.empty}</p>
        </div>
      </section>
    );
  }

  return (
    <>
      <section className="bg-white" aria-labelledby="enseignement-phare">
        <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 sm:py-14">
          <Badge variant="accent">{labels.featured}</Badge>
          <Typography id="enseignement-phare" variant="h2" className="mt-3 text-slate-900">
            {labels.featuredTitle}
          </Typography>
          <Typography variant="body" className="mt-3 max-w-2xl text-slate-600">
            {featured.isFeatured ? labels.featuredByTeam : labels.latestPublished}
          </Typography>

          <Link
            href={`/enseignements/${featured.slug}`}
            className={cn(
              interactiveCardClass,
              "mt-8 block overflow-hidden lg:grid lg:grid-cols-[1.15fr_0.85fr]",
            )}
          >
            <div className="relative min-h-56 bg-slate-50 lg:min-h-full">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={featured.coverImage || PLACEHOLDER_SRC}
                alt={featured.title}
                className="h-56 w-full object-cover lg:absolute lg:inset-0 lg:h-full"
              />
            </div>
            <div className="flex flex-col justify-center bg-white px-6 py-8 sm:px-8">
              <Typography variant="h3" className="text-slate-900">
                {featured.title}
              </Typography>
              <p className="mt-4 flex items-center gap-2 font-sans text-sm text-slate-600">
                <UserRound className="size-4 text-[#6d28d9]" aria-hidden />
                {featured.author}
              </p>
              <p className="mt-1.5 flex items-center gap-2 font-sans text-sm text-slate-600">
                <CalendarDays className="size-4 text-[#6d28d9]" aria-hidden />
                {formatPublicationDate(featured.publishedAt, locale)}
              </p>
              <p className="mt-4 font-sans text-sm leading-relaxed text-slate-800">
                {excerpt(featured.content)}
              </p>
              <span className="mt-6 inline-flex h-9 w-fit items-center rounded-full bg-[#6d28d9] px-3 font-heading text-sm font-bold tracking-tight text-white">
                {labels.readMore}
              </span>
            </div>
          </Link>
        </div>
      </section>

      {others.length > 0 ? (
        <section className="bg-slate-50" aria-labelledby="tous-les-enseignements">
          <div className="mx-auto max-w-6xl px-4 py-14 sm:px-6">
            <Typography id="tous-les-enseignements" variant="h2" className="text-slate-900">
              {labels.allTitle}
            </Typography>
            <Typography variant="body" className="mt-3 max-w-2xl text-slate-600">
              {labels.allDescription}
            </Typography>

            <div className="mt-10 grid gap-5 overflow-visible sm:grid-cols-2 lg:grid-cols-3">
              {others.map((article) => (
                <Link
                  key={article.id}
                  href={`/enseignements/${article.slug}`}
                  className={cn(interactiveCardClass, "flex flex-col overflow-hidden")}
                >
                  <div className="relative aspect-[16/10] bg-slate-50">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={article.coverImage || PLACEHOLDER_SRC}
                      alt={article.title}
                      className="h-full w-full object-cover"
                    />
                  </div>
                  <div className="flex flex-1 flex-col px-5 py-5">
                    <p className="font-heading text-[11px] font-bold uppercase tracking-[0.16em] text-[#6d28d9]">
                      {formatPublicationDate(article.publishedAt, locale)}
                    </p>
                    <Typography variant="h3" className="mt-2 text-slate-900">
                      {article.title}
                    </Typography>
                    <p className="mt-2 font-sans text-sm text-slate-600">
                      {article.author}
                    </p>
                    <p className="mt-3 flex-1 font-sans text-sm leading-relaxed text-slate-800">
                      {excerpt(article.content, 140)}
                    </p>
                    <span className="mt-5 inline-flex h-9 w-fit items-center rounded-full bg-[#6d28d9] px-3 font-heading text-sm font-bold tracking-tight text-white">
                      {labels.readMore}
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      ) : null}
    </>
  );
}
