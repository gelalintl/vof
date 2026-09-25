import type { Metadata } from "next";
import Link from "next/link";
import { getPublishedArticles } from "@/lib/publicContent";
import { formatEventDate } from "@/utils/date/format";
import { ContentSection, PageHero } from "@/ui/components/layout";
import { MediaCover } from "@/ui/components/media";
import { MainLayout } from "@/ui/layouts/MainLayout";
import { Typography } from "@/ui/design-system/typography";

export const metadata: Metadata = {
  title: "Enseignements",
  description: "Articles et enseignements publiés de l'Église Voice Of Freedom.",
};

function excerpt(content: string, max = 180) {
  const text = content.replace(/\s+/g, " ").trim();
  return text.length > max ? `${text.slice(0, max)}…` : text;
}

export default async function TeachingsPage() {
  const articles = await getPublishedArticles();

  return (
    <MainLayout>
      <PageHero
        badge="Parole"
        title="Enseignements"
        description="Les articles publiés par l'équipe pastorale, du plus récent au plus ancien."
      />
      <ContentSection>
        {articles.length === 0 ? (
          <p className="font-sans text-sm text-slate-600">
            Aucun enseignement publié pour le moment.
          </p>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {articles.map((article) => (
              <Link
                key={article.id}
                href={`/enseignements/${article.slug}`}
                className="group overflow-hidden rounded-3xl bg-white shadow-sm ring-1 ring-slate-100 transition-shadow hover:shadow-md"
              >
                <MediaCover
                  alt={article.title}
                  src={article.coverImage ?? undefined}
                  colorToken="brand"
                  rounded="rounded-none"
                />
                <div className="p-5">
                  <p className="font-heading text-xs font-bold uppercase tracking-widest text-violet-700">
                    {formatEventDate(article.createdAt)}
                  </p>
                  <Typography variant="h4" className="mt-2 group-hover:text-violet-700">
                    {article.title}
                  </Typography>
                  <p className="mt-2 font-sans text-sm text-slate-600">
                    {excerpt(article.content)}
                  </p>
                  <p className="mt-4 font-heading text-sm font-bold text-sky-600">
                    {article.author}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        )}
      </ContentSection>
    </MainLayout>
  );
}
