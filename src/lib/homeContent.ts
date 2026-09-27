import { siteConfig } from "@/config/site";
import { homeWelcomeHeader, homeWelcomeQuote } from "@/datas/home";
import { homeEditorialFallbacks, readSetting } from "@/lib/settings";
import { extractYoutubeId } from "@/lib/youtube";
import type {
  InfoTileData,
  PageHeroData,
  PublicRecurringGathering,
  PublicSiteContact,
  PublicSiteIdentity,
  QuoteBlockData,
  SectionHeaderData,
} from "@/types";

export function buildHomeHero(
  identity: PublicSiteIdentity,
  contact: PublicSiteContact,
  featuredYoutubeUrl?: string | null,
): PageHeroData {
  return {
    badge: identity.sundayLabel,
    title: `Bienvenue à ${identity.churchName}`,
    description: `${identity.tagline}. Venez adorer avec nous — ${identity.sundayTime}. ${contact.location.address}.`,
    glow: "sky",
    actions: [
      { href: "#infos-pratiques", label: "Rejoindre le culte", variant: "accent" },
      { href: "/a-propos", label: "Découvrir VOF", variant: "outlineLight" },
    ],
    media: {
      videoId:
        extractYoutubeId(featuredYoutubeUrl) ??
        extractYoutubeId(siteConfig.media.featuredYoutubeId) ??
        undefined,
      videoTitle: siteConfig.media.featuredYoutubeTitle,
      fallbackDay: siteConfig.worship.sunday.day,
      fallbackTime: identity.sundayTime,
      fallbackText:
        "Le replay du culte sera bientôt disponible ici, en lecture différée pour les connexions 3G/4G.",
    },
  };
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
