import { siteConfig } from "@/config/site";
import { extractYoutubeId } from "@/lib/youtube";
import type { HomeHeroDraft, PageHeroData } from "@/types";

export function pageHeroFromDraft(
  draft: HomeHeroDraft,
  fallbackTime?: string,
): PageHeroData {
  const actions: PageHeroData["actions"] = [];
  if (draft.hero_primary_cta_text.trim() && draft.hero_primary_cta_link.trim()) {
    actions.push({
      href: draft.hero_primary_cta_link.trim(),
      label: draft.hero_primary_cta_text.trim(),
      variant: "accent",
    });
  }
  if (draft.hero_secondary_cta_text.trim() && draft.hero_secondary_cta_link.trim()) {
    actions.push({
      href: draft.hero_secondary_cta_link.trim(),
      label: draft.hero_secondary_cta_text.trim(),
      variant: "outlineLight",
    });
  }

  return {
    badge: draft.hero_badge,
    title: draft.hero_title,
    description: draft.hero_description,
    glow: "sky",
    actions,
    media: {
      videoId:
        extractYoutubeId(draft.featured_youtube_url) ??
        extractYoutubeId(siteConfig.media.featuredYoutubeId) ??
        undefined,
      videoTitle: siteConfig.media.featuredYoutubeTitle,
      fallbackDay: siteConfig.worship.sunday.day,
      fallbackTime,
      fallbackText:
        "Le replay du culte sera bientôt disponible ici, en lecture différée pour les connexions 3G/4G.",
    },
  };
}
