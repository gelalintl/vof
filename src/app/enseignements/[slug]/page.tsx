import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getArticleBySlug } from "@/lib/publicContent";
import { MainLayout } from "@/ui/layouts/MainLayout";
import { TeachingDetail } from "@/ui/modules/enseignements";

interface TeachingDetailPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({
  params,
}: TeachingDetailPageProps): Promise<Metadata> {
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

export default async function TeachingDetailPage({ params }: TeachingDetailPageProps) {
  const { slug } = await params;
  const article = await getArticleBySlug(slug);

  if (!article) {
    notFound();
  }

  return (
    <MainLayout>
      <TeachingDetail article={article} />
    </MainLayout>
  );
}
