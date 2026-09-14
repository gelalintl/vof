import type {
  FeatureCardData,
  PageHeroData,
  PortraitBlockData,
  QuoteBlockData,
  SectionHeaderData,
} from "@/types";
import { siteConfig } from "@/config/site";
import { pastors } from "@/datas/pastors";

export const aboutHero: PageHeroData = {
  badge: "À propos",
  title: "La vision Voice Of Freedom",
  description: `${siteConfig.tagline}. Nous bâtissons une église familiale où l'adoration, la Parole et le service libèrent une génération.`,
};

export const aboutVisionHeader: SectionHeaderData = {
  title: "Ce qui nous anime",
};

export const aboutVerse: QuoteBlockData = {
  quote: "« Verset annuel de l'église »",
  caption: "Référence biblique du verset annuel de l'église",
};

export const aboutPillars: FeatureCardData[] = [
  {
    id: "adorer",
    title: "Adorer",
    text: "Un culte vivant, centré sur Christ, chaque dimanche à 9h00.",
    tone: "brand",
  },
  {
    id: "grandir",
    title: "Grandir",
    text: "La Parole enseignée pour former des disciples libres et enracinés.",
    tone: "secondary",
  },
  {
    id: "servir",
    title: "Servir",
    text: "Une famille qui aime la ville et porte l'Évangile avec compassion.",
    tone: "accent",
  },
];

export const aboutPastoralHeader: SectionHeaderData = {
  badge: "Équipe pastorale",
  title: "Ceux qui portent la maison",
  titleId: "equipe-pastorale",
  align: "center",
  titleStyle: "display",
};

export const pastoralPortraits: PortraitBlockData[] = pastors.map((pastor) => {
  const name = `${pastor.title} ${pastor.firstName}`.trim();

  return {
    name,
    role: pastor.role,
    bio: pastor.bio,
    photoSrc: pastor.photoUrl ?? `/assets/pastors/${pastor.id}.svg`,
    photoAlt: name,
    quote: pastor.quote,
  };
});
