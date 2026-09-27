import type { QuoteBlockData, SectionHeaderData } from "@/types";
import { siteConfig } from "@/config/site";

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
