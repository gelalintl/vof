import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getArticleBySlug } from "@/lib/publicContent";
import { formatEventDate } from "@/utils/date/format";
import { AuthorSignature, ProseBlocks } from "@/ui/components/content";
import { ContentSection } from "@/ui/components/layout";
import { MediaCover } from "@/ui/components/media";
import { MainLayout } from "@/ui/layouts/MainLayout";
import { Typography } from "@/ui/design-system/typography";

interface ArticleDetailPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({
  params,
}: ArticleDetailPageProps): Promise<Metadata> {
  const { slug } = await params;
  const article = await getArticleBySlug(slug);

  if (!article) {
    return { title: "Enseignement introuvable" };
  }

  return {
    title: article.title,
    description: article.content.slice(0, 160),
  };
}

export default async function ArticleDetailPage({ params }: ArticleDetailPageProps) {
  const { slug } = await params;
  const article = await getArticleBySlug(slug);

  if (!article) {
    notFound();
  }

  return (
    <MainLayout>
      <ContentSection width="article" padding="compact">
        <p className="font-heading text-xs font-bold uppercase tracking-widest text-violet-700">
          Enseignement · {formatEventDate(article.createdAt)}
        </p>
        <Typography variant="h1" className="mt-3">
          {article.title}
        </Typography>
        <div className="mt-6">
          <MediaCover
            alt={article.title}
            src={article.coverImage ?? undefined}
            colorToken="brand"
          />
        </div>
        <div className="mt-8">
          <ProseBlocks text={article.content} />
        </div>
        <AuthorSignature name={article.author} role="Enseignement VOF" />
      </ContentSection>
    </MainLayout>
  );
}
