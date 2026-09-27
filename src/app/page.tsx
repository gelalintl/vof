import { homeGalleryHeader } from "@/datas/home";
import { buildHomeHero, buildHomeInfoTiles, buildHomeWelcome } from "@/lib/homeContent";
import {
  getFeaturedHomeMedia,
  getActivePublicProjects,
  getPublishedArticles,
  getRecurringGatherings,
  getUpcomingEvents,
} from "@/lib/publicContent";
import { contactFromSettings, getSiteSettings, identityFromSettings } from "@/lib/settings";
import { InfoTileGrid } from "@/ui/components/cards";
import { QuoteBlock } from "@/ui/components/content";
import { ContentSection, PageHero, SectionHeader } from "@/ui/components/layout";
import { GalleryGrid } from "@/ui/components/media";
import { MainLayout } from "@/ui/layouts/MainLayout";
import { FeaturedTeachingSection } from "@/ui/modules/enseignements";
import { EventSlider } from "@/ui/modules/events";
import { FeaturedProjectsSection } from "@/ui/modules/projets";

export default async function HomePage() {
  const [settings, upcomingEvents, gallery, gatherings, articles, projects] = await Promise.all([
    getSiteSettings(),
    getUpcomingEvents(6),
    getFeaturedHomeMedia(),
    getRecurringGatherings(),
    getPublishedArticles(),
    getActivePublicProjects(),
  ]);
  const featuredTeaching = articles.find((article) => article.isFeatured) ?? articles[0] ?? null;
  const identity = identityFromSettings(settings);
  const contact = contactFromSettings(settings);
  const welcome = buildHomeWelcome(settings);

  return (
    <MainLayout>
      <PageHero {...buildHomeHero(identity, contact, settings.featured_youtube_url)} />
      <ContentSection id="infos-pratiques" tone="muted" padding="compact">
        <InfoTileGrid tiles={buildHomeInfoTiles(identity, contact, gatherings, settings)} />
      </ContentSection>
      <ContentSection width="prose" align="center">
        <SectionHeader {...welcome.header} />
        <QuoteBlock {...welcome.quote} />
      </ContentSection>
      {upcomingEvents.length > 0 ? (
        <EventSlider events={upcomingEvents} />
      ) : null}
      <FeaturedProjectsSection projects={projects.slice(0, 3)} />
      <FeaturedTeachingSection article={featuredTeaching} />
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
