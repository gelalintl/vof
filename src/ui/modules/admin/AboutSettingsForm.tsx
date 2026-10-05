"use client";

import { updateSiteSettings } from "@/app/admin/actions";
import {
  ABOUT_ANNUAL_VERSE_REF_KEY,
  ABOUT_ANNUAL_VERSE_TEXT_KEY,
  ABOUT_PILLAR_1_DESC_KEY,
  ABOUT_PILLAR_1_TITLE_KEY,
  ABOUT_PILLAR_2_DESC_KEY,
  ABOUT_PILLAR_2_TITLE_KEY,
  ABOUT_PILLAR_3_DESC_KEY,
  ABOUT_PILLAR_3_TITLE_KEY,
  type AboutSettingKey,
} from "@/lib/siteSettingsKeys";
import { AdminSubmitButton } from "./AdminSubmitButton";
import { AdminLabel, AdminPanel } from "./AdminPageHeader";
import { adminFieldClass } from "./adminStyles";
import { notifyAdminAction } from "./notifyAdminAction";

interface AboutSettingsFormProps {
  values: Record<AboutSettingKey, string>;
}

const PILLARS = [
  {
    titleKey: ABOUT_PILLAR_1_TITLE_KEY,
    descKey: ABOUT_PILLAR_1_DESC_KEY,
    heading: "Pilier 1 — Adorer",
    titlePlaceholder: "Adorer",
    descPlaceholder: "Un culte vivant, centré sur Christ, chaque dimanche à 9h00.",
  },
  {
    titleKey: ABOUT_PILLAR_2_TITLE_KEY,
    descKey: ABOUT_PILLAR_2_DESC_KEY,
    heading: "Pilier 2 — Grandir",
    titlePlaceholder: "Grandir",
    descPlaceholder: "La Parole enseignée pour former des disciples libres et enracinés.",
  },
  {
    titleKey: ABOUT_PILLAR_3_TITLE_KEY,
    descKey: ABOUT_PILLAR_3_DESC_KEY,
    heading: "Pilier 3 — Servir",
    titlePlaceholder: "Servir",
    descPlaceholder: "Une famille qui aime la ville et porte l'Évangile avec compassion.",
  },
] as const;

export function AboutSettingsForm({ values }: AboutSettingsFormProps) {
  const handleSubmit = notifyAdminAction(async (formData) => {
    await updateSiteSettings({
      [ABOUT_ANNUAL_VERSE_TEXT_KEY]: String(
        formData.get(ABOUT_ANNUAL_VERSE_TEXT_KEY) ?? "",
      ),
      [ABOUT_ANNUAL_VERSE_REF_KEY]: String(
        formData.get(ABOUT_ANNUAL_VERSE_REF_KEY) ?? "",
      ),
      [ABOUT_PILLAR_1_TITLE_KEY]: String(formData.get(ABOUT_PILLAR_1_TITLE_KEY) ?? ""),
      [ABOUT_PILLAR_1_DESC_KEY]: String(formData.get(ABOUT_PILLAR_1_DESC_KEY) ?? ""),
      [ABOUT_PILLAR_2_TITLE_KEY]: String(formData.get(ABOUT_PILLAR_2_TITLE_KEY) ?? ""),
      [ABOUT_PILLAR_2_DESC_KEY]: String(formData.get(ABOUT_PILLAR_2_DESC_KEY) ?? ""),
      [ABOUT_PILLAR_3_TITLE_KEY]: String(formData.get(ABOUT_PILLAR_3_TITLE_KEY) ?? ""),
      [ABOUT_PILLAR_3_DESC_KEY]: String(formData.get(ABOUT_PILLAR_3_DESC_KEY) ?? ""),
    });
  }, "Page À propos enregistrée.");

  return (
    <form action={handleSubmit} className="grid gap-6">
      <AdminPanel>
        <h2 className="font-heading text-lg font-bold text-slate-900">
          Verset annuel de l’église
        </h2>
        <p className="mt-1 text-sm text-slate-600">
          Citation et référence biblique affichées dans la section « Ce qui nous anime ».
        </p>

        <div className="mt-6 grid gap-4">
          <label className="block">
            <AdminLabel>Citation du verset</AdminLabel>
            <textarea
              name={ABOUT_ANNUAL_VERSE_TEXT_KEY}
              rows={4}
              defaultValue={values[ABOUT_ANNUAL_VERSE_TEXT_KEY]}
              placeholder="« Verset annuel de l'église »"
              className={adminFieldClass}
            />
          </label>

          <label className="block">
            <AdminLabel>Référence biblique</AdminLabel>
            <input
              name={ABOUT_ANNUAL_VERSE_REF_KEY}
              defaultValue={values[ABOUT_ANNUAL_VERSE_REF_KEY]}
              placeholder="Jean 15:12"
              className={adminFieldClass}
            />
          </label>
        </div>
      </AdminPanel>

      <AdminPanel>
        <h2 className="font-heading text-lg font-bold text-slate-900">
          Ce qui nous anime
        </h2>
        <p className="mt-1 text-sm text-slate-600">
          Titre et description courte des trois piliers : Adorer, Grandir, Servir.
        </p>

        <div className="mt-6 grid gap-6">
          {PILLARS.map((pillar) => (
            <fieldset
              key={pillar.titleKey}
              className="grid gap-4 border border-slate-100 bg-slate-50 p-4"
            >
              <legend className="px-1 font-heading text-sm font-bold text-slate-900">
                {pillar.heading}
              </legend>
              <label className="block">
                <AdminLabel>Titre</AdminLabel>
                <input
                  name={pillar.titleKey}
                  defaultValue={values[pillar.titleKey]}
                  placeholder={pillar.titlePlaceholder}
                  className={adminFieldClass}
                />
              </label>
              <label className="block">
                <AdminLabel>Description courte</AdminLabel>
                <textarea
                  name={pillar.descKey}
                  rows={3}
                  defaultValue={values[pillar.descKey]}
                  placeholder={pillar.descPlaceholder}
                  className={adminFieldClass}
                />
              </label>
            </fieldset>
          ))}
        </div>

        <div className="mt-6">
          <AdminSubmitButton>Enregistrer les modifications</AdminSubmitButton>
        </div>
      </AdminPanel>
    </form>
  );
}
