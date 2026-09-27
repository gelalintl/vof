import type { Metadata } from "next";
import {
  aboutHero,
  aboutPillars,
  aboutVerse,
  aboutVisionHeader,
} from "@/datas/about";
import { FeatureCardGrid } from "@/ui/components/cards";
import { QuoteBlock } from "@/ui/components/content";
import { ContentSection, PageHero, SectionHeader } from "@/ui/components/layout";
import { MainLayout } from "@/ui/layouts/MainLayout";
import { PastorsSection } from "@/ui/modules/pastors";

export const metadata: Metadata = {
  title: "À propos",
  description:
    "Vision et équipe pastorale de l'Église Voice Of Freedom.",
};

export default async function AboutPage() {
  return (
    <MainLayout>
      <PageHero {...aboutHero} />
      <ContentSection tone="muted">
        <SectionHeader {...aboutVisionHeader} />
        <QuoteBlock {...aboutVerse} />
        <FeatureCardGrid cards={aboutPillars} />
      </ContentSection>
      <PastorsSection />
    </MainLayout>
  );
}
