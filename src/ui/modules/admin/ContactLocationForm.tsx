"use client";

import { updateSiteSettings } from "@/app/admin/actions";
import { HOME_ADDRESS_KEY, type ManagedSettingKey } from "@/lib/siteSettingsKeys";
import { AdminSubmitButton } from "./AdminSubmitButton";
import { AdminLabel, AdminPanel } from "./AdminPageHeader";
import { adminFieldClass } from "./adminStyles";
import { notifyAdminAction } from "./notifyAdminAction";

interface ContactLocationFormProps {
  values: Record<ManagedSettingKey, string>;
}

export function ContactLocationForm({ values }: ContactLocationFormProps) {
  const address = values[HOME_ADDRESS_KEY] || values.location_address;

  const handleSubmit = notifyAdminAction(async (formData) => {
    const mainAddress = String(formData.get(HOME_ADDRESS_KEY) ?? "");
    await updateSiteSettings({
      [HOME_ADDRESS_KEY]: mainAddress,
      location_address: mainAddress,
      location_google_maps_url: String(formData.get("location_google_maps_url") ?? ""),
      contact_phone: String(formData.get("contact_phone") ?? ""),
      contact_email: String(formData.get("contact_email") ?? ""),
    });
  }, "Coordonnées et géolocalisation enregistrées.");

  return (
    <AdminPanel>
      <h2 className="font-heading text-lg font-bold text-slate-900">
        Coordonnées physiques & géolocalisation
      </h2>
      <p className="mt-1 text-sm text-slate-600">
        Adresse principale, carte, téléphone d’accueil et e-mail de contact.
      </p>

      <form action={handleSubmit} className="mt-6 grid gap-4">
        <label className="block">
          <AdminLabel>Adresse principale</AdminLabel>
          <textarea
            name={HOME_ADDRESS_KEY}
            rows={3}
            defaultValue={address}
            placeholder="A côté du cimetière de Yantala, non loin du CEG 25, Niamey, Niger"
            className={adminFieldClass}
          />
        </label>

        <label className="block">
          <AdminLabel>Lien Google Maps / GPS</AdminLabel>
          <input
            name="location_google_maps_url"
            type="url"
            defaultValue={values.location_google_maps_url}
            placeholder="https://maps.app.goo.gl/…"
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
          <AdminLabel>E-mail de contact</AdminLabel>
          <input
            name="contact_email"
            type="email"
            defaultValue={values.contact_email}
            placeholder="contact@exemple.org"
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
