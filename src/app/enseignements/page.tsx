import type { Metadata } from "next";
import { getPublishedArticles } from "@/lib/publicContent";
import { MainLayout } from "@/ui/layouts/MainLayout";
import { TeachingsCatalog } from "@/ui/modules/enseignements";

export const metadata: Metadata = {
  title: "Enseignements",
  description:
    "Prédications et enseignements publiés de l'Église Voice Of Freedom.",
};

export default async function TeachingsPage() {
  const articles = await getPublishedArticles();

  return (
    <MainLayout>
      <TeachingsCatalog articles={articles} />
    </MainLayout>
  );
}
