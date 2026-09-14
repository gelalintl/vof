import type { PageHeroData, QuoteBlockData } from "@/types";
import { siteConfig } from "@/config/site";

export const contactHero: PageHeroData = {
  badge: "Nous rejoindre",
  title: "Contact",
  description: `${siteConfig.location.address}, ${siteConfig.location.country}. Une colonne, de la carte au message.`,
  width: "narrow",
};

export const donateHero: PageHeroData = {
  badge: "Partenaires",
  title: "Soutenir VOF",
  description:
    "Tous les montants sont en FCFA. Même parcours que la modale Soutenir : montant, récurrence, puis Mobile Money, carte ou RIB.",
  glow: "amber",
  width: "narrow",
};

export const donateQuote: QuoteBlockData = {
  quote: "« Que chacun donne comme il l'a résolu en son cœur. »",
  attribution: `2 Corinthiens 9.7 · ${siteConfig.legalName}`,
  align: "center",
};

export const departmentsHero: PageHeroData = {
  badge: "Servir",
  title: "Les départements VOF",
  description:
    "Une place pour chacun. Découvrez les équipes, les responsables, les horaires, puis envoyez votre demande pour rejoindre un département.",
};

export const churchLifeHero: PageHeroData = {
  badge: "Médias & agenda",
  title: "Vie de l'église",
  description:
    "Annonces, enseignements, soirées jeunesse et séminaires d'impact. Filtrez par couleur : violet, bleu ciel ou rouge.",
};
