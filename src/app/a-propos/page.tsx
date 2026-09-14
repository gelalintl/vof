import type { Metadata } from "next";
import {
  aboutHero,
  aboutPastoralHeader,
  aboutPillars,
  aboutVerse,
  aboutVisionHeader,
  pastoralPortraits,
} from "@/datas/about";
import { CalendarWidget } from "@/ui/components/CalendarWidget";
import { ContentSection } from "@/ui/components/ContentSection";
import { FeatureCardGrid } from "@/ui/components/FeatureCard";
import { PageHero } from "@/ui/components/PageHero";
import { PortraitBlockList } from "@/ui/components/PortraitBlock";
import { QuoteBlock } from "@/ui/components/QuoteBlock";
import { SectionHeader } from "@/ui/components/SectionHeader";
import { MainLayout } from "@/ui/layouts/MainLayout";

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
