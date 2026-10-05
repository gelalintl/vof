import { aboutPillars, aboutVerse } from "@/datas/about";
import {
  ABOUT_ANNUAL_VERSE_REF_KEY,
  ABOUT_ANNUAL_VERSE_TEXT_KEY,
  ABOUT_PILLAR_1_DESC_KEY,
  ABOUT_PILLAR_1_TITLE_KEY,
  ABOUT_PILLAR_2_DESC_KEY,
  ABOUT_PILLAR_2_TITLE_KEY,
  ABOUT_PILLAR_3_DESC_KEY,
  ABOUT_PILLAR_3_TITLE_KEY,
  type AboutSettingKey,
} from "@/lib/siteSettingsKeys";
import type { FeatureCardData, QuoteBlockData } from "@/types";

const PILLAR_FIELDS = [
  {
    id: aboutPillars[0]?.id ?? "adorer",
    tone: aboutPillars[0]?.tone ?? "brand",
    titleKey: ABOUT_PILLAR_1_TITLE_KEY,
    descKey: ABOUT_PILLAR_1_DESC_KEY,
    fallback: aboutPillars[0] ?? {
      id: "adorer",
      title: "Adorer",
      text: "Un culte vivant, centré sur Christ, chaque dimanche à 9h00.",
      tone: "brand" as const,
    },
  },
  {
    id: aboutPillars[1]?.id ?? "grandir",
    tone: aboutPillars[1]?.tone ?? "secondary",
    titleKey: ABOUT_PILLAR_2_TITLE_KEY,
    descKey: ABOUT_PILLAR_2_DESC_KEY,
    fallback: aboutPillars[1] ?? {
      id: "grandir",
      title: "Grandir",
      text: "La Parole enseignée pour former des disciples libres et enracinés.",
      tone: "secondary" as const,
    },
  },
  {
    id: aboutPillars[2]?.id ?? "servir",
    tone: aboutPillars[2]?.tone ?? "accent",
    titleKey: ABOUT_PILLAR_3_TITLE_KEY,
    descKey: ABOUT_PILLAR_3_DESC_KEY,
    fallback: aboutPillars[2] ?? {
      id: "servir",
      title: "Servir",
      text: "Une famille qui aime la ville et porte l'Évangile avec compassion.",
      tone: "accent" as const,
    },
  },
] as const;

export type AboutVisionContent = {
  verse: QuoteBlockData;
  pillars: FeatureCardData[];
};

export function emptyAboutSettings(): Record<AboutSettingKey, string> {
  return {
    [ABOUT_ANNUAL_VERSE_TEXT_KEY]: aboutVerse.quote,
    [ABOUT_ANNUAL_VERSE_REF_KEY]: aboutVerse.caption ?? "",
    [ABOUT_PILLAR_1_TITLE_KEY]: PILLAR_FIELDS[0].fallback.title,
    [ABOUT_PILLAR_1_DESC_KEY]: PILLAR_FIELDS[0].fallback.text,
    [ABOUT_PILLAR_2_TITLE_KEY]: PILLAR_FIELDS[1].fallback.title,
    [ABOUT_PILLAR_2_DESC_KEY]: PILLAR_FIELDS[1].fallback.text,
    [ABOUT_PILLAR_3_TITLE_KEY]: PILLAR_FIELDS[2].fallback.title,
    [ABOUT_PILLAR_3_DESC_KEY]: PILLAR_FIELDS[2].fallback.text,
  };
}

export function aboutVisionFromSettings(
  settings: Record<string, string>,
): AboutVisionContent {
  const fallbacks = emptyAboutSettings();

  return {
    verse: {
      quote: readAboutSetting(
        settings,
        ABOUT_ANNUAL_VERSE_TEXT_KEY,
        fallbacks[ABOUT_ANNUAL_VERSE_TEXT_KEY],
      ),
      caption: readAboutSetting(
        settings,
        ABOUT_ANNUAL_VERSE_REF_KEY,
        fallbacks[ABOUT_ANNUAL_VERSE_REF_KEY],
      ),
    },
    pillars: PILLAR_FIELDS.map((pillar) => ({
      id: pillar.id,
      tone: pillar.tone,
      title: readAboutSetting(settings, pillar.titleKey, pillar.fallback.title),
      text: readAboutSetting(settings, pillar.descKey, pillar.fallback.text),
    })),
  };
}

function readAboutSetting(
  settings: Record<string, string>,
  key: AboutSettingKey,
  fallback: string,
) {
  const value = settings[key]?.trim();
  return value || fallback;
}
