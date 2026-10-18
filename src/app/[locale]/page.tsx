import type { Metadata } from "next";
import { isLocale } from "@/i18n/config";
import { getDictionary } from "@/i18n/getDictionary";
import { staticPageMetadata } from "@/i18n/metadata";
import { HomeGallery } from "@/ui/modules/home";
import { buildHomeHero, buildHomeInfoTiles, buildHomeWelcome } from "@/lib/homeContent";
import {
  getFeaturedHomeMedia,
  getActivePublicProjects,
  getPublishedArticles,
  getPublishedTestimonials,
  getUpcomingEvents,
} from "@/lib/publicContent";
import { contactFromSettings, getLocalizedSiteSettings, identityFromSettings } from "@/lib/settings";
import type { ContentSectionTone } from "@/types";
import { InfoTileGrid } from "@/ui/components/cards";
import { QuoteBlock } from "@/ui/components/content";
import { ContentSection, PageHero, SectionHeader, SeeAllLink } from "@/ui/components/layout";
import { MainLayout } from "@/ui/layouts/MainLayout";
import { FeaturedTeachingSection } from "@/ui/modules/enseignements";
import { EventSlider } from "@/ui/modules/events";
import { FeaturedProjectsSection } from "@/ui/modules/projets";
import { HomeTestimonialsSection } from "@/ui/modules/temoignages";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  return staticPageMetadata(locale, "home", { absolute: true });
}

type HomeSectionKey =
  | "infos"
  | "welcome"
  | "events"
  | "teaching"
  | "projects"
  | "gallery"
  | "testimonials";

export default async function HomePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale: localeParam } = await params;
  const locale = isLocale(localeParam) ? localeParam : "fr";
  const dictionary = getDictionary(locale);
  const { home, common } = dictionary;
  const [settings, upcomingEvents, gallery, articles, projects, testimonials] =
    await Promise.all([
      getLocalizedSiteSettings(),
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
        <InfoTileGrid
          tiles={buildHomeInfoTiles(
            identity,
            contact,
            settings,
            {
              schedule: home.schedule,
              sundayService: home.sundayService,
              seeFullSchedule: common.seeFullSchedule,
              address: home.address,
              whatsappChannel: home.whatsappChannel,
              callUs: home.callUs,
              joinWhatsapp: home.joinWhatsapp,
            },
            locale,
          )}
        />
      </ContentSection>
      <ContentSection width="prose" align="center" tone={toneOf("welcome")}>
        <SectionHeader {...welcome.header} />
        <QuoteBlock {...welcome.quote} />
      </ContentSection>
      {upcomingEvents.length > 0 ? (
        <EventSlider
          events={upcomingEvents}
          tone={toneOf("events")}
          locale={locale}
          labels={{
            badge: home.agenda,
            title: home.upcoming,
            description: home.upcomingDescription,
            seeAnnouncement: common.seeAnnouncement,
            carouselLabel: home.carouselLabel,
            previous: home.previousAnnouncement,
            next: home.nextAnnouncement,
            goTo: home.goToAnnouncement,
            kinds: common.eventKinds,
          }}
        />
      ) : null}
      <FeaturedTeachingSection
        article={featuredTeaching}
        tone={toneOf("teaching")}
        locale={locale}
        labels={{
          badge: home.featured,
          title: home.latestTeaching,
          description: home.latestTeachingDescription,
          readMore: common.readMore,
        }}
      />
      <FeaturedProjectsSection
        projects={featuredProjects}
        tone={toneOf("projects")}
        labels={{
          badge: home.projects,
          title: home.churchProjects,
          description: home.churchProjectsDescription,
          seeAll: common.seeAllProjects,
        }}
        statusLabels={{
          IN_PROGRESS: common.inProgress,
          COMPLETED: common.completed,
          PLANNED: common.planned,
        }}
      />
      {gallery.length > 0 ? (
        <ContentSection tone={toneOf("gallery")} labelledBy="galerie-vof">
          <SectionHeader
            badge={home.gallery}
            title={home.galleryTitle}
            titleId="galerie-vof"
            description={home.galleryDescription}
          />
          <HomeGallery images={gallery} />
          <SeeAllLink href="/galerie">{common.seeGallery}</SeeAllLink>
        </ContentSection>
      ) : null}
      <HomeTestimonialsSection
        testimonials={testimonials}
        tone={toneOf("testimonials")}
        locale={locale}
        labels={{
          badge: home.testimonials,
          title: home.transformedLives,
          description: home.transformedLivesDescription,
          seeAll: common.readAllTestimonials,
        }}
      />
    </MainLayout>
  );
}
