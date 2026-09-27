"use client";

import { useState } from "react";
import { updateSiteSettings } from "@/app/admin/actions";
import { FEATURED_YOUTUBE_URL_KEY, type ManagedSettingKey } from "@/lib/siteSettingsKeys";
import { extractYoutubeId, normalizeYoutubeUrl } from "@/lib/youtube";
import { AdminSubmitButton } from "./AdminSubmitButton";
import { AdminLabel, AdminPanel } from "./AdminPageHeader";
import { adminFieldClass } from "./adminStyles";
import { notifyAdminAction } from "./notifyAdminAction";

interface FeaturedYoutubeFormProps {
  values: Record<ManagedSettingKey, string>;
}

export function FeaturedYoutubeForm({ values }: FeaturedYoutubeFormProps) {
  const [url, setUrl] = useState(values[FEATURED_YOUTUBE_URL_KEY]);
  const videoId = extractYoutubeId(url);
  const channelUrl = values.social_youtube.trim();

  const handleSubmit = notifyAdminAction(async (formData) => {
    const raw = String(formData.get(FEATURED_YOUTUBE_URL_KEY) ?? "");
    await updateSiteSettings({
      [FEATURED_YOUTUBE_URL_KEY]: normalizeYoutubeUrl(raw) ?? "",
      social_youtube: String(formData.get("social_youtube") ?? ""),
    });
  }, "Direct & médias enregistrés.");

  return (
    <AdminPanel>
      <h2 className="font-heading text-lg font-bold text-slate-900">
        Vidéo / Direct YouTube d’accueil
      </h2>
      <p className="mt-1 text-sm text-slate-600">
        Collez l’URL ou l’ID de la vidéo / du direct. L’identifiant est extrait
        automatiquement pour contrôle.
      </p>

      <form action={handleSubmit} className="mt-6 grid gap-4">
        <label className="block">
          <AdminLabel>URL ou ID de la vidéo / du direct</AdminLabel>
          <input
            name={FEATURED_YOUTUBE_URL_KEY}
            type="text"
            value={url}
            onChange={(event) => setUrl(event.target.value)}
            placeholder="https://www.youtube.com/watch?v=… ou https://youtube.com/live/…"
            className={adminFieldClass}
          />
        </label>

        {videoId ? (
          <div className="border border-slate-100 bg-slate-50 p-3">
            <p className="font-heading text-xs font-bold uppercase tracking-[0.16em] text-[#6d28d9]">
              ID extrait : {videoId}
            </p>
            <div className="mt-3 overflow-hidden border border-slate-200 bg-white">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={`https://img.youtube.com/vi/${videoId}/hqdefault.jpg`}
                alt="Aperçu de la vidéo YouTube"
                className="aspect-video w-full object-cover"
              />
            </div>
          </div>
        ) : url.trim() ? (
          <p className="font-sans text-sm text-red-600">
            Aucun identifiant YouTube valide n’a été détecté.
          </p>
        ) : null}

        <label className="block">
          <AdminLabel>Lien vers la chaîne officielle</AdminLabel>
          <input
            name="social_youtube"
            type="url"
            defaultValue={values.social_youtube}
            placeholder="https://www.youtube.com/@…"
            className={adminFieldClass}
          />
        </label>
        {channelUrl ? (
          <a
            href={channelUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="font-heading text-sm font-bold text-[#0284c7] hover:underline"
          >
            Ouvrir la chaîne officielle →
          </a>
        ) : null}

        <div>
          <AdminSubmitButton>Enregistrer les modifications</AdminSubmitButton>
        </div>
      </form>
    </AdminPanel>
  );
}
