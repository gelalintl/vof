"use client";

import { MessageCircle } from "lucide-react";
import { toast } from "sonner";
import { updateSiteSettings } from "@/app/admin/actions";
import type { ManagedSettingKey } from "@/lib/siteSettingsKeys";
import {
  FacebookMark,
  InstagramMark,
  TikTokMark,
  YoutubeMark,
} from "@/ui/components/media/SocialMarks";
import { AdminLabel, AdminPanel } from "./AdminPageHeader";
import { adminFieldClass, adminPrimaryButtonClass } from "./adminStyles";

interface SocialSettingsFormProps {
  values: Record<ManagedSettingKey, string>;
}

const fields = [
  { key: "social_facebook", label: "Facebook", type: "url", icon: FacebookMark },
  { key: "social_instagram", label: "Instagram", type: "url", icon: InstagramMark },
  { key: "social_youtube", label: "YouTube", type: "url", icon: YoutubeMark },
  { key: "social_tiktok", label: "TikTok", type: "url", icon: TikTokMark },
  { key: "social_whatsapp", label: "WhatsApp (numéro)", type: "tel", icon: MessageCircle },
] as const;

export function SocialSettingsForm({ values }: SocialSettingsFormProps) {
  async function handleSubmit(formData: FormData) {
    await updateSiteSettings({
      social_facebook: String(formData.get("social_facebook") ?? ""),
      social_instagram: String(formData.get("social_instagram") ?? ""),
      social_youtube: String(formData.get("social_youtube") ?? ""),
      social_tiktok: String(formData.get("social_tiktok") ?? ""),
      social_whatsapp: String(formData.get("social_whatsapp") ?? ""),
    });
    toast.success("Réseaux sociaux enregistrés.");
  }

  return (
    <AdminPanel>
      <h2 className="font-heading text-lg font-bold text-burgundy">Réseaux sociaux</h2>
      <p className="mt-1 text-sm text-[#2C2424]/70">
        Un champ vide masque l’icône correspondante sur le site public.
      </p>

      <form action={handleSubmit} className="mt-6 grid gap-4">
        {fields.map((field) => {
          const Icon = field.icon;
          return (
            <label key={field.key} className="block">
              <AdminLabel>{field.label}</AdminLabel>
              <span className="relative mt-1.5 block">
                <Icon className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-burgundy" />
                <input
                  name={field.key}
                  type={field.type}
                  defaultValue={values[field.key]}
                  placeholder={field.key === "social_whatsapp" ? "+227 90 00 00 00" : "https://"}
                  className={`${adminFieldClass} mt-0 pl-10`}
                />
              </span>
            </label>
          );
        })}

        <button type="submit" className={adminPrimaryButtonClass}>
          Enregistrer les réseaux
        </button>
      </form>
    </AdminPanel>
  );
}
