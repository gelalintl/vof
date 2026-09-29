"use client";

import { useMemo, useState } from "react";
import { updateSiteSettings } from "@/app/admin/actions";
import { pageHeroFromDraft } from "@/lib/homeHero";
import {
  FEATURED_YOUTUBE_URL_KEY,
  HERO_BADGE_KEY,
  HERO_DESCRIPTION_KEY,
  HERO_PRIMARY_CTA_LINK_KEY,
  HERO_PRIMARY_CTA_TEXT_KEY,
  HERO_SECONDARY_CTA_LINK_KEY,
  HERO_SECONDARY_CTA_TEXT_KEY,
  HERO_TITLE_KEY,
} from "@/lib/siteSettingsKeys";
import { normalizeYoutubeUrl } from "@/lib/youtube";
import type { HomeHeroDraft } from "@/types";
import { PageHero } from "@/ui/components/layout/PageHero";
import { AdminSubmitButton } from "./AdminSubmitButton";
import { AdminLabel } from "./AdminPageHeader";
import { adminFieldClass } from "./adminStyles";
import { notifyAdminAction } from "./notifyAdminAction";

interface HeroVisualEditorProps {
  values: HomeHeroDraft;
  fallbackTime?: string;
}

export function HeroVisualEditor({ values, fallbackTime }: HeroVisualEditorProps) {
  const [draft, setDraft] = useState<HomeHeroDraft>(values);

  function update<K extends keyof HomeHeroDraft>(key: K, value: HomeHeroDraft[K]) {
    setDraft((current) => ({ ...current, [key]: value }));
  }

  const preview = useMemo(
    () => pageHeroFromDraft(draft, fallbackTime),
    [draft, fallbackTime],
  );

  const handleSubmit = notifyAdminAction(async (formData) => {
    const rawYoutube = String(formData.get(FEATURED_YOUTUBE_URL_KEY) ?? "");
    await updateSiteSettings({
      [HERO_BADGE_KEY]: String(formData.get(HERO_BADGE_KEY) ?? ""),
      [HERO_TITLE_KEY]: String(formData.get(HERO_TITLE_KEY) ?? ""),
      [HERO_DESCRIPTION_KEY]: String(formData.get(HERO_DESCRIPTION_KEY) ?? ""),
      [HERO_PRIMARY_CTA_TEXT_KEY]: String(formData.get(HERO_PRIMARY_CTA_TEXT_KEY) ?? ""),
      [HERO_PRIMARY_CTA_LINK_KEY]: String(formData.get(HERO_PRIMARY_CTA_LINK_KEY) ?? ""),
      [HERO_SECONDARY_CTA_TEXT_KEY]: String(formData.get(HERO_SECONDARY_CTA_TEXT_KEY) ?? ""),
      [HERO_SECONDARY_CTA_LINK_KEY]: String(formData.get(HERO_SECONDARY_CTA_LINK_KEY) ?? ""),
      [FEATURED_YOUTUBE_URL_KEY]: rawYoutube.trim()
        ? (normalizeYoutubeUrl(rawYoutube) ?? "")
        : "",
    });
  }, "Hero d'accueil mis à jour avec succès !");

  return (
    <div className="flex w-full flex-col gap-6">
      <div className="w-full overflow-hidden rounded-2xl border border-slate-200 bg-slate-900 shadow-xl">
        <div className="flex items-center gap-3 bg-slate-800 px-4 py-2.5">
          <div className="flex shrink-0 items-center gap-1.5" aria-hidden>
            <span className="size-2.5 rounded-full bg-red-500" />
            <span className="size-2.5 rounded-full bg-amber-400" />
            <span className="size-2.5 rounded-full bg-emerald-500" />
          </div>
          <p className="min-w-0 flex-1 truncate rounded-md bg-slate-700/80 px-3 py-1 text-center font-sans text-xs text-slate-300">
            https://eglisevof.org
          </p>
        </div>
        <div className="overflow-x-hidden">
          <div className="pointer-events-none">
            <PageHero {...preview} />
          </div>
        </div>
      </div>

      <form
        action={handleSubmit}
        className="rounded-2xl border border-slate-200 bg-white p-6"
      >
        <div className="space-y-6">
          <div>
            <h2 className="font-heading text-lg font-bold text-slate-900">
              Éditeur du Hero d’accueil
            </h2>
            <p className="mt-1 text-sm text-slate-600">
              Modifiez les champs ci-dessous : l’aperçu se met à jour immédiatement.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <label className="block">
              <AdminLabel>Surtitre / Badge</AdminLabel>
              <input
                name={HERO_BADGE_KEY}
                value={draft.hero_badge}
                onChange={(event) => update("hero_badge", event.target.value)}
                className={adminFieldClass}
              />
            </label>
            <label className="block">
              <AdminLabel>Lien / ID de la vidéo YouTube</AdminLabel>
              <input
                name={FEATURED_YOUTUBE_URL_KEY}
                value={draft.featured_youtube_url}
                onChange={(event) => update("featured_youtube_url", event.target.value)}
                placeholder="https://www.youtube.com/watch?v=…"
                className={adminFieldClass}
              />
            </label>
          </div>

          <label className="block">
            <AdminLabel>Titre principal</AdminLabel>
            <input
              name={HERO_TITLE_KEY}
              value={draft.hero_title}
              onChange={(event) => update("hero_title", event.target.value)}
              className={adminFieldClass}
            />
          </label>

          <label className="block">
            <AdminLabel>Paragraphe de description</AdminLabel>
            <textarea
              name={HERO_DESCRIPTION_KEY}
              rows={4}
              value={draft.hero_description}
              onChange={(event) => update("hero_description", event.target.value)}
              className={adminFieldClass}
            />
          </label>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <label className="block">
              <AdminLabel>Bouton principal — texte</AdminLabel>
              <input
                name={HERO_PRIMARY_CTA_TEXT_KEY}
                value={draft.hero_primary_cta_text}
                onChange={(event) => update("hero_primary_cta_text", event.target.value)}
                className={adminFieldClass}
              />
            </label>
            <label className="block">
              <AdminLabel>Bouton principal — lien</AdminLabel>
              <input
                name={HERO_PRIMARY_CTA_LINK_KEY}
                value={draft.hero_primary_cta_link}
                onChange={(event) => update("hero_primary_cta_link", event.target.value)}
                className={adminFieldClass}
              />
            </label>
            <label className="block">
              <AdminLabel>Bouton secondaire — texte</AdminLabel>
              <input
                name={HERO_SECONDARY_CTA_TEXT_KEY}
                value={draft.hero_secondary_cta_text}
                onChange={(event) => update("hero_secondary_cta_text", event.target.value)}
                className={adminFieldClass}
              />
            </label>
            <label className="block">
              <AdminLabel>Bouton secondaire — lien</AdminLabel>
              <input
                name={HERO_SECONDARY_CTA_LINK_KEY}
                value={draft.hero_secondary_cta_link}
                onChange={(event) => update("hero_secondary_cta_link", event.target.value)}
                className={adminFieldClass}
              />
            </label>
          </div>
        </div>

        <div className="mt-6 flex items-center justify-end gap-3 border-t border-slate-100 pt-6">
          <AdminSubmitButton className="w-full sm:w-auto">
            Enregistrer et publier le Hero
          </AdminSubmitButton>
        </div>
      </form>
    </div>
  );
}
