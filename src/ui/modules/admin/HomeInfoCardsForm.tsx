"use client";

import { updateSiteSettings } from "@/app/admin/actions";
import {
  HOME_ADDRESS_KEY,
  WHATSAPP_CHANNEL_URL_KEY,
  WHATSAPP_NUMBER_KEY,
  type ManagedSettingKey,
} from "@/lib/siteSettingsKeys";
import { AdminSubmitButton } from "./AdminSubmitButton";
import { AdminLabel, AdminPanel } from "./AdminPageHeader";
import { adminFieldClass } from "./adminStyles";
import { notifyAdminAction } from "./notifyAdminAction";

interface HomeInfoCardsFormProps {
  values: Record<ManagedSettingKey, string>;
}

export function HomeInfoCardsForm({ values }: HomeInfoCardsFormProps) {
  const handleSubmit = notifyAdminAction(async (formData) => {
    await updateSiteSettings({
      [HOME_ADDRESS_KEY]: String(formData.get(HOME_ADDRESS_KEY) ?? ""),
      contact_phone: String(formData.get("contact_phone") ?? ""),
      [WHATSAPP_NUMBER_KEY]: String(formData.get(WHATSAPP_NUMBER_KEY) ?? ""),
      [WHATSAPP_CHANNEL_URL_KEY]: String(formData.get(WHATSAPP_CHANNEL_URL_KEY) ?? ""),
    });
  }, "Coordonnées de l’église enregistrées.");

  return (
    <AdminPanel>
      <h2 className="font-heading text-lg font-bold text-slate-900">
        Coordonnées de l’église
      </h2>
      <p className="mt-1 text-sm text-slate-600">
        Adresse, téléphone d’accueil et numéro WhatsApp affichés sur le site.
      </p>

      <form action={handleSubmit} className="mt-6 grid gap-4">
        <label className="block">
          <AdminLabel>Adresse</AdminLabel>
          <textarea
            name={HOME_ADDRESS_KEY}
            rows={3}
            defaultValue={values[HOME_ADDRESS_KEY]}
            placeholder="A côté du cimetière de Yantala, non loin du CEG 25, Niamey, Niger"
            className={adminFieldClass}
          />
        </label>

        <label className="block">
          <AdminLabel>Téléphone d’accueil</AdminLabel>
          <input
            name="contact_phone"
            type="tel"
            defaultValue={values.contact_phone}
            placeholder="+227 90 00 00 00"
            className={adminFieldClass}
          />
        </label>

        <label className="block">
          <AdminLabel>Numéro WhatsApp</AdminLabel>
          <input
            name={WHATSAPP_NUMBER_KEY}
            type="tel"
            defaultValue={values[WHATSAPP_NUMBER_KEY]}
            placeholder="+227 90 00 00 00"
            className={adminFieldClass}
          />
        </label>

        <label className="block">
          <AdminLabel>Lien du canal WhatsApp</AdminLabel>
          <input
            name={WHATSAPP_CHANNEL_URL_KEY}
            type="url"
            defaultValue={values[WHATSAPP_CHANNEL_URL_KEY]}
            placeholder="https://whatsapp.com/channel/…"
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
