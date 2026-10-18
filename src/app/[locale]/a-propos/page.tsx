import type { Metadata } from "next";
import { isLocale } from "@/i18n/config";
import { getDictionary } from "@/i18n/getDictionary";
import { staticPageMetadata } from "@/i18n/metadata";
import { aboutVisionFromSettings } from "@/lib/aboutContent";
import { getLocalizedSiteSettings } from "@/lib/settings";
import { FeatureCardGrid } from "@/ui/components/cards";
import { QuoteBlock } from "@/ui/components/content";
import { ContentSection, PageHero, SectionHeader } from "@/ui/components/layout";
import { MainLayout } from "@/ui/layouts/MainLayout";
import { PastorsSection } from "@/ui/modules/pastors";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  return staticPageMetadata(locale, "about");
}

export default async function AboutPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale: localeParam } = await params;
  const locale = isLocale(localeParam) ? localeParam : "fr";
  const { about } = getDictionary(locale);
  const settings = await getLocalizedSiteSettings();
  const { verse, pillars } = aboutVisionFromSettings(settings);

  return (
    <MainLayout>
      <PageHero badge={about.badge} title={about.title} description={about.description} />
      <ContentSection tone="muted">
        <SectionHeader title={about.visionTitle} />
        <QuoteBlock {...verse} />
        <FeatureCardGrid cards={pillars} />
      </ContentSection>
      <PastorsSection
        locale={locale}
        labels={{
          badge: about.pastoralTeam,
          title: about.thoseWhoCarry,
          empty: about.pastorsEmpty,
        }}
      />
    </MainLayout>
  );
}
