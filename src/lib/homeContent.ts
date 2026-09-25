import { siteConfig } from "@/config/site";
import type {
  InfoTileData,
  PageHeroData,
  PublicSiteContact,
  PublicSiteIdentity,
} from "@/types";

export function buildHomeHero(
  identity: PublicSiteIdentity,
  contact: PublicSiteContact,
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
      videoId: siteConfig.media.featuredYoutubeId || undefined,
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
): InfoTileData[] {
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
        ...siteConfig.worship.gatherings
          .filter((gathering) => gathering.id !== "sunday")
          .map((gathering) => ({
            title: gathering.label,
            detail: `${gathering.day} · ${gathering.time}`,
          })),
      ],
    },
    {
      id: "adresse",
      title: siteConfig.location.label,
      icon: "map",
      description: [contact.location.address, contact.location.city]
        .filter(Boolean)
        .join(", "),
    },
    {
      id: "whatsapp",
      title: siteConfig.contacts.whatsappChannel.label,
      icon: "message",
      description: contact.location.phone
        ? `Nous appeler : ${contact.location.phone}`
        : "Rejoindre le canal WhatsApp",
      href: siteConfig.contacts.whatsappChannel.href,
    },
  ];
}
