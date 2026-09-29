import { siteConfig } from "@/config/site";
import { homeWelcomeHeader, homeWelcomeQuote } from "@/datas/home";
import { pageHeroFromDraft } from "@/lib/homeHero";
import { homeEditorialFallbacks, readSetting } from "@/lib/settings";
import type {
  HomeHeroDraft,
  InfoTileData,
  PageHeroData,
  PublicRecurringGathering,
  PublicSiteContact,
  PublicSiteIdentity,
  QuoteBlockData,
  SectionHeaderData,
} from "@/types";

export { pageHeroFromDraft } from "@/lib/homeHero";

export function homeHeroFallbacks(
  identity: PublicSiteIdentity,
  contact: PublicSiteContact,
): Omit<HomeHeroDraft, "featured_youtube_url"> {
  return {
    hero_badge: identity.sundayLabel,
    hero_title: `Bienvenue à ${identity.churchName}`,
    hero_description: `${identity.tagline}. Venez adorer avec nous — ${identity.sundayTime}. ${contact.location.address}.`,
    hero_primary_cta_text: "Rejoindre le culte",
    hero_primary_cta_link: "#infos-pratiques",
    hero_secondary_cta_text: "Découvrir VOF",
    hero_secondary_cta_link: "/a-propos",
  };
}

export function homeHeroDraftFromSettings(
  identity: PublicSiteIdentity,
  contact: PublicSiteContact,
  settings: Record<string, string> = {},
): HomeHeroDraft {
  const fallbacks = homeHeroFallbacks(identity, contact);
  return {
    hero_badge: readSetting(settings, "hero_badge", fallbacks.hero_badge),
    hero_title: readSetting(settings, "hero_title", fallbacks.hero_title),
    hero_description: readSetting(settings, "hero_description", fallbacks.hero_description),
    hero_primary_cta_text: readSetting(
      settings,
      "hero_primary_cta_text",
      fallbacks.hero_primary_cta_text,
    ),
    hero_primary_cta_link: readSetting(
      settings,
      "hero_primary_cta_link",
      fallbacks.hero_primary_cta_link,
    ),
    hero_secondary_cta_text: readSetting(
      settings,
      "hero_secondary_cta_text",
      fallbacks.hero_secondary_cta_text,
    ),
    hero_secondary_cta_link: readSetting(
      settings,
      "hero_secondary_cta_link",
      fallbacks.hero_secondary_cta_link,
    ),
    featured_youtube_url: readSetting(settings, "featured_youtube_url"),
  };
}

export function buildHomeHero(
  identity: PublicSiteIdentity,
  contact: PublicSiteContact,
  settings: Record<string, string> = {},
): PageHeroData {
  return pageHeroFromDraft(
    homeHeroDraftFromSettings(identity, contact, settings),
    identity.sundayTime,
  );
}

export function buildHomeInfoTiles(
  identity: PublicSiteIdentity,
  contact: PublicSiteContact,
  gatherings: PublicRecurringGathering[] = [],
  settings: Record<string, string> = {},
): InfoTileData[] {
  const fallbacks = homeEditorialFallbacks();
  const address =
    readSetting(settings, "address") ||
    [contact.location.address, contact.location.city].filter(Boolean).join(", ") ||
    fallbacks.address;
  const whatsappNumber = readSetting(
    settings,
    "whatsapp_number",
    contact.location.phone || fallbacks.whatsapp_number,
  );
  const whatsappHref = readSetting(
    settings,
    "whatsapp_channel_url",
    fallbacks.whatsapp_channel_url,
  );

  return [
    {
      id: "horaires",
      title: "Horaires",
      icon: "clock",
      items:
        gatherings.length > 0
          ? gatherings.map((gathering) => ({
              title: gathering.title,
              detail: `${gathering.scheduleLabel} · ${gathering.timeLabel}`,
            }))
          : [
              {
                title: identity.sundayLabel,
                detail: identity.sundayTime,
              },
            ],
    },
    {
      id: "adresse",
      title: siteConfig.location.label,
      icon: "map",
      description: address,
    },
    {
      id: "whatsapp",
      title: siteConfig.contacts.whatsappChannel.label,
      icon: "message",
      description: whatsappNumber
        ? `Nous appeler : ${whatsappNumber}`
        : "Rejoindre le canal WhatsApp",
      href: whatsappHref,
    },
  ];
}

export function buildHomeWelcome(settings: Record<string, string>): {
  header: SectionHeaderData;
  quote: QuoteBlockData;
} {
  const fallbacks = homeEditorialFallbacks();

  return {
    header: {
      ...homeWelcomeHeader,
      kicker: readSetting(settings, "welcome_tagline", fallbacks.welcome_tagline),
      title: readSetting(settings, "welcome_author", fallbacks.welcome_author),
    },
    quote: {
      ...homeWelcomeQuote,
      quote: readSetting(settings, "welcome_content", fallbacks.welcome_content),
      attribution: `— ${readSetting(settings, "welcome_author", fallbacks.welcome_author)}`,
      note: readSetting(settings, "welcome_subtext", fallbacks.welcome_subtext),
    },
  };
}
