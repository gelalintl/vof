import { homeGalleryHeader } from "@/datas/home";
import { HomeGallery } from "@/ui/modules/home";
import { buildHomeHero, buildHomeInfoTiles, buildHomeWelcome } from "@/lib/homeContent";
import {
  getFeaturedHomeMedia,
  getActivePublicProjects,
  getPublishedArticles,
  getPublishedTestimonials,
  getUpcomingEvents,
} from "@/lib/publicContent";
import { contactFromSettings, getSiteSettings, identityFromSettings } from "@/lib/settings";
import type { ContentSectionTone } from "@/types";
import { InfoTileGrid } from "@/ui/components/cards";
import { QuoteBlock } from "@/ui/components/content";
import { ContentSection, PageHero, SectionHeader, SeeAllLink } from "@/ui/components/layout";
import { MainLayout } from "@/ui/layouts/MainLayout";
import { FeaturedTeachingSection } from "@/ui/modules/enseignements";
import { EventSlider } from "@/ui/modules/events";
import { FeaturedProjectsSection } from "@/ui/modules/projets";
import { HomeTestimonialsSection } from "@/ui/modules/temoignages";

type HomeSectionKey =
  | "infos"
  | "welcome"
  | "events"
  | "teaching"
  | "projects"
  | "gallery"
  | "testimonials";

export default async function HomePage() {
  const [settings, upcomingEvents, gallery, articles, projects, testimonials] =
    await Promise.all([
      getSiteSettings(),
      getUpcomingEvents(6),
      getFeaturedHomeMedia(),
      getPublishedArticles(),
      getActivePublicProjects(),
      getPublishedTestimonials(3),
    ]);
  const featuredTeaching = articles.find((article) => article.isFeatured) ?? articles[0] ?? null;
  const featuredProjects = projects.slice(0, 3);
  const identity = identityFromSettings(settings);
  const contact = contactFromSettings(settings);
  const welcome = buildHomeWelcome(settings);

  // Alternance stricte gris / blanc, calculée sur les sections réellement affichées
  // (une section vide ne casse donc jamais le rythme).
  const visibleSections: HomeSectionKey[] = [
    "infos",
    "welcome",
    ...(upcomingEvents.length > 0 ? (["events"] as const) : []),
    ...(featuredTeaching ? (["teaching"] as const) : []),
    ...(featuredProjects.length > 0 ? (["projects"] as const) : []),
    ...(gallery.length > 0 ? (["gallery"] as const) : []),
    "testimonials",
  ];
  const toneOf = (key: HomeSectionKey): ContentSectionTone =>
    visibleSections.indexOf(key) % 2 === 0 ? "muted" : "white";

  return (
    <MainLayout>
      <PageHero {...buildHomeHero(identity, settings)} />
      <ContentSection id="infos-pratiques" tone={toneOf("infos")}>
        <InfoTileGrid tiles={buildHomeInfoTiles(identity, contact, settings)} />
      </ContentSection>
      <ContentSection width="prose" align="center" tone={toneOf("welcome")}>
        <SectionHeader {...welcome.header} />
        <QuoteBlock {...welcome.quote} />
      </ContentSection>
      {upcomingEvents.length > 0 ? (
        <EventSlider events={upcomingEvents} tone={toneOf("events")} />
      ) : null}
      <FeaturedTeachingSection article={featuredTeaching} tone={toneOf("teaching")} />
      <FeaturedProjectsSection projects={featuredProjects} tone={toneOf("projects")} />
      {gallery.length > 0 ? (
        <ContentSection tone={toneOf("gallery")} labelledBy="galerie-vof">
          <SectionHeader {...homeGalleryHeader} />
          <HomeGallery images={gallery} />
          <SeeAllLink href="/galerie">Voir la galerie</SeeAllLink>
        </ContentSection>
      ) : null}
      <HomeTestimonialsSection testimonials={testimonials} tone={toneOf("testimonials")} />
    </MainLayout>
  );
}
