import type { Metadata } from "next";
import {
  aboutHero,
  aboutPastoralHeader,
  aboutPillars,
  aboutVerse,
  aboutVisionHeader,
  pastoralPortraits,
} from "@/datas/about";
import { FeatureCardGrid, PortraitBlockList } from "@/ui/components/cards";
import { QuoteBlock } from "@/ui/components/content";
import { ContentSection, PageHero, SectionHeader } from "@/ui/components/layout";
import { MainLayout } from "@/ui/layouts/MainLayout";
import { CalendarWidget } from "@/ui/modules/calendar";

export const metadata: Metadata = {
  title: "À propos",
  description:
    "Vision, équipe pastorale et agenda de l'Église Voice Of Freedom.",
};

export default function AboutPage() {
  return (
    <MainLayout>
      <PageHero {...aboutHero} />
      <ContentSection tone="muted">
        <SectionHeader {...aboutVisionHeader} />
        <QuoteBlock {...aboutVerse} />
        <FeatureCardGrid cards={aboutPillars} />
      </ContentSection>
      <ContentSection labelledBy="equipe-pastorale" gap="lg">
        <SectionHeader {...aboutPastoralHeader} />
        <PortraitBlockList portraits={pastoralPortraits} />
      </ContentSection>
      <CalendarWidget />
    </MainLayout>
  );
}
