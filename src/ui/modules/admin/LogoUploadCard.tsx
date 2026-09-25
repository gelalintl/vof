"use client";

import { deleteChurchLogo, uploadChurchLogo } from "@/app/admin/actions";
import { Logo } from "@/ui/design-system/logo";
import { AdminPanel } from "./AdminPageHeader";
import { adminFileClass, adminGhostButtonClass, adminPrimaryButtonClass } from "./adminStyles";

interface LogoUploadCardProps {
  logoSrc: string | null;
}

export function LogoUploadCard({ logoSrc }: LogoUploadCardProps) {
  return (
    <AdminPanel>
      <h2 className="font-heading text-lg font-bold text-burgundy">Logo de l’église</h2>
      <p className="mt-1 text-sm text-[#2C2424]/70">
        Téléversé localement dans <code className="font-mono text-xs">public/uploads</code>, puis
        enregistré sous la clé <code className="font-mono text-xs">church_logo</code>.
      </p>

      <div className="mt-6 flex flex-col items-start gap-6 sm:flex-row sm:items-center">
        <div className="flex size-28 items-center justify-center border border-burgundy/15 bg-cream p-3">
          <Logo imageSrc={logoSrc} inverted={false} showWordmark={false} markClassName="size-20" />
        </div>
        <div>
          <p className="font-heading text-sm font-bold text-burgundy">Aperçu actuel</p>
          <p className="mt-1 font-mono text-xs text-[#2C2424]/60">
            {logoSrc ?? "Aucun logo — fallback texte / marque SVG"}
          </p>
        </div>
      </div>

      <form action={uploadChurchLogo} className="mt-6 grid gap-4 sm:grid-cols-[1fr_auto] sm:items-end">
        <label className="block">
          <span className="font-heading text-xs font-bold uppercase tracking-[0.16em] text-burgundy">
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
        <button type="submit" className={adminPrimaryButtonClass}>
          {logoSrc ? "Remplacer le logo" : "Téléverser le logo"}
        </button>
      </form>

      {logoSrc ? (
        <form action={deleteChurchLogo} className="mt-3">
          <button type="submit" className={adminGhostButtonClass}>
            Supprimer le logo
          </button>
        </form>
      ) : null}
    </AdminPanel>
  );
}
