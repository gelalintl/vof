"use client";

import {
  deletePastorWelcomeImage,
  updateSiteSettings,
  uploadPastorWelcomeImage,
} from "@/app/admin/actions";
import {
  PASTOR_WELCOME_IMAGE_KEY,
  WELCOME_AUTHOR_KEY,
  WELCOME_CONTENT_KEY,
  WELCOME_SUBTEXT_KEY,
  WELCOME_TAGLINE_KEY,
  type ManagedSettingKey,
} from "@/lib/siteSettingsKeys";
import { AdminSubmitButton } from "./AdminSubmitButton";
import { AdminLabel, AdminPanel } from "./AdminPageHeader";
import { adminFieldClass, adminFileClass, adminGhostButtonClass } from "./adminStyles";
import { notifyAdminAction } from "./notifyAdminAction";

interface WelcomeMessageFormProps {
  values: Record<ManagedSettingKey, string>;
}

export function WelcomeMessageForm({ values }: WelcomeMessageFormProps) {
  const imageSrc = values[PASTOR_WELCOME_IMAGE_KEY]?.trim() || null;

  const handleSubmit = notifyAdminAction(async (formData) => {
    await updateSiteSettings({
      [WELCOME_TAGLINE_KEY]: String(formData.get(WELCOME_TAGLINE_KEY) ?? ""),
      [WELCOME_AUTHOR_KEY]: String(formData.get(WELCOME_AUTHOR_KEY) ?? ""),
      [WELCOME_CONTENT_KEY]: String(formData.get(WELCOME_CONTENT_KEY) ?? ""),
      [WELCOME_SUBTEXT_KEY]: String(formData.get(WELCOME_SUBTEXT_KEY) ?? ""),
    });
  }, "Mot de bienvenue enregistré.");

  return (
    <AdminPanel>
      <h2 className="font-heading text-lg font-bold text-slate-900">
        Mot de bienvenue du Pasteur
      </h2>
      <p className="mt-1 text-sm text-slate-600">
        Auteur, surtitre, citation, photo d’illustration et sous-titre du mot d’accueil.
      </p>

      <div className="mt-6">
        <AdminLabel>Photo d’illustration du Pasteur / Couple pastoral</AdminLabel>
        {imageSrc ? (
          <div className="mt-3 flex flex-col items-start gap-4 sm:flex-row sm:items-center">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={imageSrc}
              alt="Aperçu de la photo d’illustration"
              className="max-h-40 w-auto rounded-2xl border border-slate-100 object-cover shadow-md"
            />
            <p className="font-mono text-xs text-slate-500">{imageSrc}</p>
          </div>
        ) : (
          <p className="mt-2 font-sans text-sm text-slate-500">
            Aucune photo enregistrée pour le moment.
          </p>
        )}

        <form
          action={notifyAdminAction(
            uploadPastorWelcomeImage,
            "Photo d’illustration mise à jour.",
          )}
          className="mt-4 grid gap-4 sm:grid-cols-[1fr_auto] sm:items-end"
        >
          <label className="block">
            <span className="font-heading text-xs font-bold uppercase tracking-[0.16em] text-slate-900">
              Fichier image
            </span>
            <input
              name="file"
              type="file"
              accept="image/*"
              required
              className={adminFileClass}
            />
          </label>
          <AdminSubmitButton>
            {imageSrc ? "Remplacer la photo" : "Téléverser la photo"}
          </AdminSubmitButton>
        </form>

        {imageSrc ? (
          <form
            action={notifyAdminAction(deletePastorWelcomeImage, "Photo d’illustration supprimée.")}
            className="mt-3"
          >
            <button type="submit" className={adminGhostButtonClass}>
              Supprimer la photo
            </button>
          </form>
        ) : null}
      </div>

      <form action={handleSubmit} className="mt-6 grid gap-4">
        <label className="block">
          <AdminLabel>Auteur</AdminLabel>
          <input
            name={WELCOME_AUTHOR_KEY}
            defaultValue={values[WELCOME_AUTHOR_KEY]}
            placeholder="Révérend Pasteur Nelson Nwene"
            className={adminFieldClass}
          />
        </label>

        <label className="block">
          <AdminLabel>Surtitre</AdminLabel>
          <input
            name={WELCOME_TAGLINE_KEY}
            defaultValue={values[WELCOME_TAGLINE_KEY]}
            placeholder="MOT DU PAPA DE LA MAISON"
            className={adminFieldClass}
          />
        </label>

        <label className="block">
          <AdminLabel>Citation / Message</AdminLabel>
          <textarea
            name={WELCOME_CONTENT_KEY}
            rows={5}
            defaultValue={values[WELCOME_CONTENT_KEY]}
            placeholder="Bienvenue dans la famille Voice Of Freedom. Ici, chacun trouve une place…"
            className={adminFieldClass}
          />
        </label>

        <label className="block">
          <AdminLabel>Sous-titre</AdminLabel>
          <textarea
            name={WELCOME_SUBTEXT_KEY}
            rows={2}
            defaultValue={values[WELCOME_SUBTEXT_KEY]}
            placeholder="Révérend Pasteur Nelson Nwene, Papa de la maison — Aux côtés de Pasteure Rose Nwene, maman de la maison"
            className={adminFieldClass}
          />
        </label>

        <div>
          <AdminSubmitButton>Enregistrer les modifications</AdminSubmitButton>
        </div>
      </form>
    </AdminPanel>
  );
}
