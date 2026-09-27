"use client";

import { useState } from "react";
import { updateSiteSettings } from "@/app/admin/actions";
import {
  PRINT_HEADER_SUBTITLE_KEY,
  PRINT_HEADER_TITLE_KEY,
  PRINT_SIGNATORY_TITLE_KEY,
  PRINT_USE_LOGO_KEY,
  isSettingEnabled,
  type PrintSettingKey,
} from "@/lib/siteSettingsKeys";
import { Logo } from "@/ui/design-system/logo";
import { cn } from "@/utils/cn";
import { AdminSubmitButton } from "./AdminSubmitButton";
import { AdminLabel, AdminPanel } from "./AdminPageHeader";
import { adminFieldClass } from "./adminStyles";
import { notifyAdminAction } from "./notifyAdminAction";

interface PrintSettingsFormProps {
  values: Record<PrintSettingKey, string>;
  logoSrc: string | null;
}

export function PrintSettingsForm({ values, logoSrc }: PrintSettingsFormProps) {
  const [useLogo, setUseLogo] = useState(isSettingEnabled(values.print_use_logo));

  const handleSubmit = notifyAdminAction(async (formData) => {
    await updateSiteSettings({
      [PRINT_SIGNATORY_TITLE_KEY]: String(formData.get(PRINT_SIGNATORY_TITLE_KEY) ?? ""),
      [PRINT_HEADER_TITLE_KEY]: String(formData.get(PRINT_HEADER_TITLE_KEY) ?? ""),
      [PRINT_HEADER_SUBTITLE_KEY]: String(formData.get(PRINT_HEADER_SUBTITLE_KEY) ?? ""),
      [PRINT_USE_LOGO_KEY]: useLogo ? "true" : "false",
    });
  }, "Préférences d’impression enregistrées.");

  return (
    <AdminPanel>
      <h2 className="font-heading text-lg font-bold text-slate-900">
        Impression & documents
      </h2>
      <p className="mt-1 text-sm text-slate-600">
        En-tête, logo et titre du signataire utilisés sur les reçus de don imprimés.
      </p>

      <form action={handleSubmit} className="mt-6 grid gap-4">
        <label className="block">
          <AdminLabel>Titre du signataire officiel</AdminLabel>
          <input
            name={PRINT_SIGNATORY_TITLE_KEY}
            defaultValue={values.print_signatory_title}
            placeholder="Le Trésorier Général"
            className={adminFieldClass}
          />
          <span className="mt-1 block font-sans text-xs text-slate-500">
            Ex. « Le Trésorier Général », « Le Pasteur ».
          </span>
        </label>

        <label className="block">
          <AdminLabel>Titre d’en-tête</AdminLabel>
          <input
            name={PRINT_HEADER_TITLE_KEY}
            defaultValue={values.print_header_title}
            placeholder="Église Voice Of Freedom"
            className={adminFieldClass}
          />
        </label>

        <label className="block">
          <AdminLabel>Sous-titre d’en-tête</AdminLabel>
          <input
            name={PRINT_HEADER_SUBTITLE_KEY}
            defaultValue={values.print_header_subtitle}
            placeholder="Reçu de don"
            className={adminFieldClass}
          />
        </label>

        <button
          type="button"
          role="switch"
          aria-checked={useLogo}
          onClick={() => setUseLogo((current) => !current)}
          className="flex w-full items-center justify-between gap-4 border border-slate-200 bg-white px-4 py-3 text-left"
        >
          <span>
            <span className="block font-heading text-sm font-bold text-slate-900">
              Afficher le logo sur les documents
            </span>
            <span className="block text-xs text-slate-500">
              Utilise le logo de l’église (onglet Identité & Général).
            </span>
          </span>
          <span
            className={cn(
              "relative h-6 w-11 shrink-0 rounded-full transition-colors",
              useLogo ? "bg-[#6d28d9]" : "bg-violet-200",
            )}
          >
            <span
              className={cn(
                "absolute top-0.5 size-5 rounded-full bg-white shadow-sm transition-[left]",
                useLogo ? "left-[22px]" : "left-0.5",
              )}
            />
            <span className="sr-only">{useLogo ? "Activé" : "Désactivé"}</span>
          </span>
        </button>

        <div className="flex items-center gap-4 border border-slate-100 bg-slate-50 p-3">
          <div className="flex size-16 items-center justify-center border border-slate-200 bg-white p-2">
            <Logo
              imageSrc={logoSrc}
              inverted={false}
              showWordmark={false}
              markClassName="size-10"
            />
          </div>
          <p className="font-sans text-xs text-slate-600">
            {logoSrc
              ? "Logo actuel prêt pour l’en-tête des reçus."
              : "Aucun logo téléversé — le nom de l’église sera utilisé."}
          </p>
        </div>

        <div>
          <AdminSubmitButton>Enregistrer les modifications</AdminSubmitButton>
        </div>
      </form>
    </AdminPanel>
  );
}
