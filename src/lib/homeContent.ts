import { siteConfig } from "@/config/site";
import { homeWelcomeHeader, homeWelcomeQuote } from "@/datas/home";
import { pageHeroFromDraft } from "@/lib/homeHero";
import { homeEditorialFallbacks, readSetting } from "@/lib/settings";
import type {
  HomeHeroDraft,
  InfoTileData,
  PageHeroData,
  PublicSiteContact,
  PublicSiteIdentity,
  QuoteBlockData,
  SectionHeaderData,
} from "@/types";

export { pageHeroFromDraft } from "@/lib/homeHero";

export function homeHeroFallbacks(
  identity: PublicSiteIdentity,
): Omit<HomeHeroDraft, "featured_youtube_url" | "hero_bg_image"> {
  return {
    hero_badge: identity.sundayLabel,
    hero_title: `Bienvenue à ${identity.churchName}`,
    hero_description: identity.tagline,
    hero_primary_cta_text: "Découvrir VOF",
    hero_primary_cta_link: "/a-propos",
    hero_secondary_cta_text: "",
    hero_secondary_cta_link: "",
  };
}

export function homeHeroDraftFromSettings(
  identity: PublicSiteIdentity,
  settings: Record<string, string> = {},
): HomeHeroDraft {
  const fallbacks = homeHeroFallbacks(identity);
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
    hero_bg_image: readSetting(settings, "hero_bg_image"),
  };
}

export function buildHomeHero(
  identity: PublicSiteIdentity,
  settings: Record<string, string> = {},
): PageHeroData {
  return pageHeroFromDraft(
    homeHeroDraftFromSettings(identity, settings),
    identity.sundayTime,
  );
}

export function buildHomeInfoTiles(
  identity: PublicSiteIdentity,
  contact: PublicSiteContact,
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
      items: [
        {
          title: identity.sundayLabel,
          detail: identity.sundayTime,
        },
      ],
      link: { href: "/vie-de-leglise", label: "Voir le programme complet" },
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
      imageSrc: readSetting(settings, "pastor_welcome_image") || undefined,
      imageAlt: readSetting(settings, "welcome_author", fallbacks.welcome_author),
      attribution: `— ${readSetting(settings, "welcome_author", fallbacks.welcome_author)}`,
      note: readSetting(settings, "welcome_subtext", fallbacks.welcome_subtext),
    },
  };
}
