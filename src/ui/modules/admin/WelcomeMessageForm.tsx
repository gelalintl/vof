"use client";

import { updateSiteSettings } from "@/app/admin/actions";
import {
  WELCOME_AUTHOR_KEY,
  WELCOME_CONTENT_KEY,
  WELCOME_SUBTEXT_KEY,
  WELCOME_TAGLINE_KEY,
  type ManagedSettingKey,
} from "@/lib/siteSettingsKeys";
import { AdminSubmitButton } from "./AdminSubmitButton";
import { AdminLabel, AdminPanel } from "./AdminPageHeader";
import { adminFieldClass } from "./adminStyles";
import { notifyAdminAction } from "./notifyAdminAction";

interface WelcomeMessageFormProps {
  values: Record<ManagedSettingKey, string>;
}

export function WelcomeMessageForm({ values }: WelcomeMessageFormProps) {
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
        Auteur, surtitre, citation et sous-titre du mot d’accueil.
      </p>

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
