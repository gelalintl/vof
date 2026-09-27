"use client";

import { deleteChurchLogo, uploadChurchLogo } from "@/app/admin/actions";
import { Logo } from "@/ui/design-system/logo";
import { AdminPanel } from "./AdminPageHeader";
import { AdminSubmitButton } from "./AdminSubmitButton";
import { adminFileClass, adminGhostButtonClass } from "./adminStyles";
import { notifyAdminAction } from "./notifyAdminAction";

interface LogoUploadCardProps {
  logoSrc: string | null;
}

export function LogoUploadCard({ logoSrc }: LogoUploadCardProps) {
  return (
    <AdminPanel>
      <h2 className="font-heading text-lg font-bold text-slate-900">Logo de l’église</h2>
      <p className="mt-1 text-sm text-slate-600">
        Téléversé localement dans <code className="font-mono text-xs">public/uploads</code>, puis
        enregistré sous la clé <code className="font-mono text-xs">church_logo</code>.
      </p>

      <div className="mt-6 flex flex-col items-start gap-6 sm:flex-row sm:items-center">
        <div className="flex size-28 items-center justify-center border border-slate-200 bg-white p-3">
          <Logo imageSrc={logoSrc} inverted={false} showWordmark={false} markClassName="size-20" />
        </div>
        <div>
          <p className="font-heading text-sm font-bold text-slate-900">Aperçu actuel</p>
          <p className="mt-1 font-mono text-xs text-slate-500">
            {logoSrc ?? "Aucun logo — fallback texte / marque SVG"}
          </p>
        </div>
      </div>

      <form
        action={notifyAdminAction(uploadChurchLogo, "Logo mis à jour.")}
        className="mt-6 grid gap-4 sm:grid-cols-[1fr_auto] sm:items-end"
      >
        <label className="block">
          <span className="font-heading text-xs font-bold uppercase tracking-[0.16em] text-slate-900">
            Fichier image
          </span>
          <input
            name="file"
            type="file"
            accept="image/*"
            required
            className={adminFileClass}
          />
        </label>
        <AdminSubmitButton>
          {logoSrc ? "Remplacer le logo" : "Téléverser le logo"}
        </AdminSubmitButton>
      </form>

      {logoSrc ? (
        <form action={notifyAdminAction(deleteChurchLogo, "Logo supprimé.")} className="mt-3">
          <button type="submit" className={adminGhostButtonClass}>
            Supprimer le logo
          </button>
        </form>
      ) : null}
    </AdminPanel>
  );
}
