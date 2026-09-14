import type {
  InfoTileData,
  PageHeroData,
  QuoteBlockData,
  SectionHeaderData,
} from "@/types";
import { siteConfig } from "@/config/site";

export const homeHero: PageHeroData = {
  badge: siteConfig.worship.sunday.label,
  title: "Bienvenue à l'Église Voice Of Freedom",
  description: `${siteConfig.tagline}. Venez adorer avec nous chaque ${siteConfig.worship.sunday.day.toLowerCase()} à ${siteConfig.worship.sunday.time}.`,
  glow: "sky",
  actions: [
    { href: "#infos-pratiques", label: "Rejoindre le culte", variant: "accent" },
    { href: "/a-propos", label: "Découvrir VOF", variant: "outlineLight" },
  ],
  media: {
    videoId: siteConfig.media.featuredYoutubeId || undefined,
    videoTitle: siteConfig.media.featuredYoutubeTitle,
    fallbackDay: siteConfig.worship.sunday.day,
    fallbackTime: siteConfig.worship.sunday.time,
    fallbackText:
      "Le replay du culte sera bientôt disponible ici, en lecture différée pour les connexions 3G/4G.",
  },
};

export const homeInfoTiles: InfoTileData[] = [
  {
    id: "horaires",
    title: "Horaires",
    icon: "clock",
    items: siteConfig.worship.gatherings.map((gathering) => ({
      title: gathering.label,
      detail: `${gathering.day} · ${gathering.time}`,
    })),
  },
  {
    id: "adresse",
    title: siteConfig.location.label,
    icon: "map",
    description: `${siteConfig.location.address}, ${siteConfig.location.country}`,
  },
  {
    id: "whatsapp",
    title: siteConfig.contacts.whatsappChannel.label,
    icon: "message",
    description: "Rejoindre le canal WhatsApp",
    href: siteConfig.contacts.whatsappChannel.href,
  },
];

export const homeWelcomeHeader: SectionHeaderData = {
  kicker: `Mot du ${siteConfig.pastoral.senior.role.toLowerCase()}`,
  title: siteConfig.pastoral.senior.name,
  align: "center",
};

export const homeWelcomeQuote: QuoteBlockData = {
  quote:
    "« Bienvenue dans la famille Voice Of Freedom. Ici, chacun trouve une place, une parole et une liberté en Christ. Nous vous attendons avec joie, dimanche après dimanche, pour adorer, grandir et servir ensemble. »",
  attribution: `— ${siteConfig.pastoral.senior.name}, ${siteConfig.pastoral.senior.role}`,
  note: `Aux côtés de ${siteConfig.pastoral.associate.name}, ${siteConfig.pastoral.associate.role.toLowerCase()}.`,
  align: "center",
  attributionVariant: "brand",
};

export const homeGalleryHeader: SectionHeaderData = {
  badge: "Galerie",
  title: "Vivre l'expérience VOF",
  titleId: "galerie-vof",
  description:
    "Un aperçu de nos cultes, prières et temps forts. Touchez une image pour l'afficher en grand.",
};
