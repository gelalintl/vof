import type { Metadata } from "next";
import { isLocale } from "@/i18n/config";
import { getDictionary } from "@/i18n/getDictionary";
import { staticPageMetadata } from "@/i18n/metadata";
import { getAllGalleryMedia } from "@/lib/publicContent";
import { GalleryGrid } from "@/ui/components/media";
import { ContentSection, PageHero } from "@/ui/components/layout";
import { MainLayout } from "@/ui/layouts/MainLayout";

interface GalleryPageProps {
  params: Promise<{ locale: string }>;
}

export async function generateMetadata({ params }: GalleryPageProps): Promise<Metadata> {
  const { locale } = await params;
  return staticPageMetadata(locale, "gallery");
}

export default async function GalleryPage({ params }: GalleryPageProps) {
  const { locale: localeParam } = await params;
  const locale = isLocale(localeParam) ? localeParam : "fr";
  const { gallery } = getDictionary(locale);
  const images = await getAllGalleryMedia();

  return (
    <MainLayout>
      <PageHero
        badge={gallery.badge}
        title={gallery.title}
        description={gallery.description}
      />
      <ContentSection labelledBy="liste-galerie">
        <h2 id="liste-galerie" className="sr-only">
          {gallery.listLabel}
        </h2>
        {images.length > 0 ? (
          <GalleryGrid images={images} />
        ) : (
          <p className="font-sans text-sm text-slate-600">{gallery.empty}</p>
        )}
      </ContentSection>
    </MainLayout>
  );
}
