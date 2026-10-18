"use client";

import { updateSiteSettings } from "@/app/admin/actions";
import {
  CHURCH_NAME_KEY,
  CHURCH_TAGLINE_KEY,
  englishSettingKey,
  type ManagedSettingKey,
} from "@/lib/siteSettingsKeys";
import { AdminSubmitButton } from "./AdminSubmitButton";
import { AdminEnglishSection } from "./AdminEnglishSection";
import { AdminLabel, AdminPanel } from "./AdminPageHeader";
import { adminFieldClass } from "./adminStyles";
import { notifyAdminAction } from "./notifyAdminAction";

interface ChurchIdentityFormProps {
  values: Record<ManagedSettingKey, string>;
  catalog: Record<string, string>;
}

export function ChurchIdentityForm({ values, catalog }: ChurchIdentityFormProps) {
  const handleSubmit = notifyAdminAction(async (formData) => {
    await updateSiteSettings({
      [CHURCH_NAME_KEY]: String(formData.get(CHURCH_NAME_KEY) ?? ""),
      [CHURCH_TAGLINE_KEY]: String(formData.get(CHURCH_TAGLINE_KEY) ?? ""),
      [englishSettingKey(CHURCH_TAGLINE_KEY)]: String(
        formData.get(englishSettingKey(CHURCH_TAGLINE_KEY)) ?? "",
      ),
    });
  }, "Identité de l’église enregistrée.");

  return (
    <AdminPanel>
      <h2 className="font-heading text-lg font-bold text-slate-900">
        Nom officiel & tagline
      </h2>
      <p className="mt-1 text-sm text-slate-600">
        Nom affiché dans l’en-tête, le pied de page et les documents de l’église.
      </p>

      <form action={handleSubmit} className="mt-6 grid gap-4">
        <label className="block">
          <AdminLabel>Nom officiel de l’église</AdminLabel>
          <input
            name={CHURCH_NAME_KEY}
            defaultValue={values[CHURCH_NAME_KEY]}
            placeholder="Église Voice Of Freedom"
            className={adminFieldClass}
          />
        </label>

        <label className="block">
          <AdminLabel>Tagline</AdminLabel>
          <input
            name={CHURCH_TAGLINE_KEY}
            defaultValue={values[CHURCH_TAGLINE_KEY]}
            placeholder="Centre de solutions de Jésus-Christ"
            className={adminFieldClass}
          />
        </label>

        <AdminEnglishSection>
          <label className="block">
            <AdminLabel>Tagline (EN)</AdminLabel>
            <input
              name={englishSettingKey(CHURCH_TAGLINE_KEY)}
              defaultValue={catalog[englishSettingKey(CHURCH_TAGLINE_KEY)] ?? ""}
              placeholder="Jesus Christ's solution center"
              className={adminFieldClass}
            />
          </label>
        </AdminEnglishSection>

        <div>
          <AdminSubmitButton>Enregistrer les modifications</AdminSubmitButton>
        </div>
      </form>
    </AdminPanel>
  );
}
