import type { ReactNode } from "react";

/** Bloc visuel regroupant les champs de traduction anglaise d'un formulaire admin. */
export function AdminEnglishSection({ children }: { children: ReactNode }) {
  return (
    <fieldset className="grid gap-4 border border-sky-100 bg-sky-50/50 p-4 sm:col-span-2">
      <legend className="px-1 font-heading text-sm font-bold text-sky-700">
        Version anglaise
      </legend>
      <p className="font-sans text-xs text-slate-600">
        Facultatif. Un champ vide laisse apparaître le texte français sur la version anglaise du site.
      </p>
      {children}
    </fieldset>
  );
}
