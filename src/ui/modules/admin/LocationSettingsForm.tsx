"use client";

import { useState } from "react";
import { toast } from "sonner";
import { updateSiteSettings } from "@/app/admin/actions";
import { normalizeMapsEmbedUrl, type ManagedSettingKey } from "@/lib/siteSettingsKeys";
import { AdminLabel, AdminPanel } from "./AdminPageHeader";
import { adminFieldClass, adminPrimaryButtonClass } from "./adminStyles";

interface LocationSettingsFormProps {
  values: Record<ManagedSettingKey, string>;
}

export function LocationSettingsForm({ values }: LocationSettingsFormProps) {
  const [iframeUrl, setIframeUrl] = useState(values.location_iframe_url);
  const previewSrc = normalizeMapsEmbedUrl(iframeUrl);

  async function handleSubmit(formData: FormData) {
    await updateSiteSettings({
      location_address: String(formData.get("location_address") ?? ""),
      location_city: String(formData.get("location_city") ?? ""),
      location_google_maps_url: String(formData.get("location_google_maps_url") ?? ""),
      location_iframe_url: String(formData.get("location_iframe_url") ?? ""),
      contact_phone: String(formData.get("contact_phone") ?? ""),
      contact_email: String(formData.get("contact_email") ?? ""),
    });
    toast.success("Localisation et contact enregistrés.");
  }

  return (
    <AdminPanel>
      <h2 className="font-heading text-lg font-bold text-burgundy">Géolocalisation & accès</h2>
      <p className="mt-1 text-sm text-[#2C2424]/70">
        Adresse publique, téléphone, e-mail et carte Google Maps du lieu de culte.
      </p>

      <form action={handleSubmit} className="mt-6 grid gap-4 sm:grid-cols-2">
        <label className="block sm:col-span-2">
          <AdminLabel>Adresse physique</AdminLabel>
          <input
            name="location_address"
            defaultValue={values.location_address}
            className={adminFieldClass}
          />
        </label>

        <label className="block">
          <AdminLabel>Ville / Quartier</AdminLabel>
          <input
            name="location_city"
            defaultValue={values.location_city}
            className={adminFieldClass}
          />
        </label>

        <label className="block">
          <AdminLabel>Téléphone</AdminLabel>
          <input
            name="contact_phone"
            type="tel"
            defaultValue={values.contact_phone}
            className={adminFieldClass}
          />
        </label>

        <label className="block sm:col-span-2">
          <AdminLabel>E-mail</AdminLabel>
          <input
            name="contact_email"
            type="email"
            defaultValue={values.contact_email}
            className={adminFieldClass}
          />
        </label>

        <label className="block sm:col-span-2">
          <AdminLabel>Lien Google Maps</AdminLabel>
          <input
            name="location_google_maps_url"
            type="url"
            defaultValue={values.location_google_maps_url}
            className={adminFieldClass}
          />
        </label>

        <label className="block sm:col-span-2">
          <AdminLabel>URL / iframe d’intégration</AdminLabel>
          <textarea
            name="location_iframe_url"
            rows={3}
            defaultValue={values.location_iframe_url}
            onChange={(event) => setIframeUrl(event.target.value)}
            className={adminFieldClass}
          />
        </label>

        <div className="sm:col-span-2">
          <button type="submit" className={adminPrimaryButtonClass}>
            Enregistrer l’accès
          </button>
        </div>
      </form>

      {previewSrc ? (
        <div className="mt-6">
          <AdminLabel>Aperçu de la carte</AdminLabel>
          <iframe
            title="Aperçu Google Maps"
            src={previewSrc}
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            className="mt-2 h-64 w-full border border-burgundy/15"
          />
        </div>
      ) : (
        <p className="mt-6 text-sm text-[#2C2424]/60">
          Renseignez une URL d’intégration pour prévisualiser la carte.
        </p>
      )}
    </AdminPanel>
  );
}
