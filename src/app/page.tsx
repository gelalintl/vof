import { homeGalleryHeader, homeWelcomeHeader, homeWelcomeQuote } from "@/datas/home";
import { buildHomeHero, buildHomeInfoTiles } from "@/lib/homeContent";
import { getFeaturedHomeMedia, getUpcomingEvents } from "@/lib/publicContent";
import { contactFromSettings, getSiteSettings, identityFromSettings } from "@/lib/settings";
import { InfoTileGrid } from "@/ui/components/cards";
import { QuoteBlock } from "@/ui/components/content";
import { ContentSection, PageHero, SectionHeader } from "@/ui/components/layout";
import { GalleryGrid } from "@/ui/components/media";
import { MainLayout } from "@/ui/layouts/MainLayout";
import { EventSlider } from "@/ui/modules/events";

export default async function HomePage() {
  const [settings, upcomingEvents, gallery] = await Promise.all([
    getSiteSettings(),
    getUpcomingEvents(6),
    getFeaturedHomeMedia(),
  ]);
  const identity = identityFromSettings(settings);
  const contact = contactFromSettings(settings);

  return (
    <MainLayout>
      <PageHero {...buildHomeHero(identity, contact)} />
      <ContentSection id="infos-pratiques" tone="muted" padding="compact">
        <InfoTileGrid tiles={buildHomeInfoTiles(identity, contact)} />
      </ContentSection>
      <ContentSection width="prose" align="center">
        <SectionHeader {...homeWelcomeHeader} />
        <QuoteBlock {...homeWelcomeQuote} />
      </ContentSection>
      {upcomingEvents.length > 0 ? (
        <EventSlider events={upcomingEvents} />
      ) : null}
      <ContentSection tone="muted" labelledBy="galerie-vof">
        <SectionHeader {...homeGalleryHeader} />
        {gallery.length > 0 ? (
          <GalleryGrid images={gallery} layout="bento" />
        ) : (
          <p className="font-sans text-sm text-slate-600">
            Les images mises en avant apparaîtront ici dès qu&apos;elles seront
            publiées depuis l&apos;administration.
          </p>
        )}
      </ContentSection>
    </MainLayout>
  );
}
