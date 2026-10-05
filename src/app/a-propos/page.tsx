import type { Metadata } from "next";
import { aboutHero, aboutVisionHeader } from "@/datas/about";
import { aboutVisionFromSettings } from "@/lib/aboutContent";
import { getSiteSettings } from "@/lib/settings";
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
  const settings = await getSiteSettings();
  const { verse, pillars } = aboutVisionFromSettings(settings);

  return (
    <MainLayout>
      <PageHero {...aboutHero} />
      <ContentSection tone="muted">
        <SectionHeader {...aboutVisionHeader} />
        <QuoteBlock {...verse} />
        <FeatureCardGrid cards={pillars} />
      </ContentSection>
      <PastorsSection />
    </MainLayout>
  );
}
