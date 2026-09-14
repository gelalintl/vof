import { homeHighlights } from "@/datas/gallery";
import {
  homeGalleryHeader,
  homeHero,
  homeInfoTiles,
  homeWelcomeHeader,
  homeWelcomeQuote,
} from "@/datas/home";
import { InfoTileGrid } from "@/ui/components/cards";
import { QuoteBlock } from "@/ui/components/content";
import { ContentSection, PageHero, SectionHeader } from "@/ui/components/layout";
import { GalleryGrid } from "@/ui/components/media";
import { MainLayout } from "@/ui/layouts/MainLayout";

export default function HomePage() {
  return (
    <MainLayout>
      <PageHero {...homeHero} />
      <ContentSection id="infos-pratiques" tone="muted" padding="compact">
        <InfoTileGrid tiles={homeInfoTiles} />
      </ContentSection>
      <ContentSection width="prose" align="center">
        <SectionHeader {...homeWelcomeHeader} />
        <QuoteBlock {...homeWelcomeQuote} />
      </ContentSection>
      <ContentSection tone="muted" labelledBy="galerie-vof">
        <SectionHeader {...homeGalleryHeader} />
        <GalleryGrid images={homeHighlights} layout="bento" />
      </ContentSection>
    </MainLayout>
  );
}
