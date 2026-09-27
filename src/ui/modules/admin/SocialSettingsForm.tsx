"use client";

import { updateSiteSettings } from "@/app/admin/actions";
import type { ManagedSettingKey } from "@/lib/siteSettingsKeys";
import {
  FacebookMark,
  InstagramMark,
  TikTokMark,
  YoutubeMark,
} from "@/ui/components/media/SocialMarks";
import { AdminSubmitButton } from "./AdminSubmitButton";
import { AdminLabel, AdminPanel } from "./AdminPageHeader";
import { adminFieldClass } from "./adminStyles";
import { notifyAdminAction } from "./notifyAdminAction";

interface SocialSettingsFormProps {
  values: Record<ManagedSettingKey, string>;
}

const fields = [
  { key: "social_facebook", label: "Facebook", icon: FacebookMark },
  { key: "social_instagram", label: "Instagram", icon: InstagramMark },
  { key: "social_youtube", label: "YouTube", icon: YoutubeMark },
  { key: "social_tiktok", label: "TikTok", icon: TikTokMark },
] as const;

export function SocialSettingsForm({ values }: SocialSettingsFormProps) {
  const handleSubmit = notifyAdminAction(async (formData) => {
    await updateSiteSettings({
      social_facebook: String(formData.get("social_facebook") ?? ""),
      social_instagram: String(formData.get("social_instagram") ?? ""),
      social_youtube: String(formData.get("social_youtube") ?? ""),
      social_tiktok: String(formData.get("social_tiktok") ?? ""),
    });
  }, "Réseaux sociaux enregistrés.");

  return (
    <AdminPanel>
      <h2 className="font-heading text-lg font-bold text-slate-900">Réseaux sociaux</h2>
      <p className="mt-1 text-sm text-slate-600">
        Un champ vide masque l’icône correspondante sur le site public.
      </p>

      <form action={handleSubmit} className="mt-6 grid gap-4">
        {fields.map((field) => {
          const Icon = field.icon;
          return (
            <label key={field.key} className="block">
              <AdminLabel>{field.label}</AdminLabel>
              <span className="relative mt-1.5 block">
                <Icon className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-slate-900" />
                <input
                  name={field.key}
                  type="url"
                  defaultValue={values[field.key]}
                  placeholder="https://"
                  className={`${adminFieldClass} mt-0 pl-10`}
                />
              </span>
            </label>
          );
        })}

        <AdminSubmitButton>Enregistrer les modifications</AdminSubmitButton>
      </form>
    </AdminPanel>
  );
}
