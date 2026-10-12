import type { Metadata } from "next";
import { galleryPageHero } from "@/datas/home";
import { getAllGalleryMedia } from "@/lib/publicContent";
import { GalleryGrid } from "@/ui/components/media";
import { ContentSection, PageHero } from "@/ui/components/layout";
import { MainLayout } from "@/ui/layouts/MainLayout";

export const metadata: Metadata = {
  title: "Galerie",
  description: "Les cultes, temps de prière et temps forts de l'Église Voice Of Freedom en images.",
};

export default async function GalleryPage() {
  const images = await getAllGalleryMedia();

  return (
    <MainLayout>
      <PageHero {...galleryPageHero} />
      <ContentSection labelledBy="liste-galerie">
        <h2 id="liste-galerie" className="sr-only">
          Photos de la galerie
        </h2>
        {images.length > 0 ? (
          <GalleryGrid images={images} />
        ) : (
          <p className="font-sans text-sm text-slate-600">
            Les photos apparaîtront ici dès qu’elles seront ajoutées depuis l’administration.
          </p>
        )}
      </ContentSection>
    </MainLayout>
  );
}
