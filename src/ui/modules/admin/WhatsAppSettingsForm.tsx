"use client";

import { updateSiteSettings } from "@/app/admin/actions";
import {
  WHATSAPP_CHANNEL_URL_KEY,
  WHATSAPP_NUMBER_KEY,
  type ManagedSettingKey,
} from "@/lib/siteSettingsKeys";
import { AdminSubmitButton } from "./AdminSubmitButton";
import { AdminLabel, AdminPanel } from "./AdminPageHeader";
import { adminFieldClass } from "./adminStyles";
import { notifyAdminAction } from "./notifyAdminAction";

interface WhatsAppSettingsFormProps {
  values: Record<ManagedSettingKey, string>;
}

export function WhatsAppSettingsForm({ values }: WhatsAppSettingsFormProps) {
  const handleSubmit = notifyAdminAction(async (formData) => {
    const number = String(formData.get(WHATSAPP_NUMBER_KEY) ?? "");
    await updateSiteSettings({
      [WHATSAPP_NUMBER_KEY]: number,
      [WHATSAPP_CHANNEL_URL_KEY]: String(formData.get(WHATSAPP_CHANNEL_URL_KEY) ?? ""),
      social_whatsapp: number,
    });
  }, "Canal WhatsApp enregistré.");

  return (
    <AdminPanel>
      <h2 className="font-heading text-lg font-bold text-slate-900">
        Canal WhatsApp & messagerie
      </h2>
      <p className="mt-1 text-sm text-slate-600">
        Numéro officiel et lien du canal utilisés sur l’accueil et dans le tunnel de don.
      </p>

      <form action={handleSubmit} className="mt-6 grid gap-4">
        <label className="block">
          <AdminLabel>Numéro WhatsApp</AdminLabel>
          <input
            name={WHATSAPP_NUMBER_KEY}
            type="tel"
            defaultValue={values[WHATSAPP_NUMBER_KEY] || values.social_whatsapp}
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
