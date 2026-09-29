"use client";

import { useState } from "react";
import type { AdminPastorRecord } from "@/types";
import { AdminLabel } from "./AdminPageHeader";
import { AdminThumb } from "./AdminThumb";
import { AdminSubmitButton } from "./AdminSubmitButton";
import { adminFieldClass, adminFileClass } from "./adminStyles";

interface PastorFormProps {
  action: (formData: FormData) => void | Promise<void>;
  pastor?: AdminPastorRecord;
  submitLabel: string;
}

export function PastorForm({ action, pastor, submitLabel }: PastorFormProps) {
  const [imagePreview, setImagePreview] = useState<string | null>(pastor?.image ?? null);

  return (
    <form action={action} className="grid gap-4 sm:grid-cols-2">
      {pastor ? <input type="hidden" name="id" value={pastor.id} /> : null}

      <label className="block sm:col-span-2">
        <AdminLabel>Nom complet</AdminLabel>
        <input
          name="name"
          required
          defaultValue={pastor?.name}
          placeholder="Révérend Pasteur Nelson Nwene"
          className={adminFieldClass}
        />
      </label>

      <label className="block">
        <AdminLabel>Rôle</AdminLabel>
        <input
          name="role"
          required
          defaultValue={pastor?.role}
          placeholder="Pasteur Principal"
          className={adminFieldClass}
        />
      </label>

      <label className="block">
        <AdminLabel>Ordre d’affichage</AdminLabel>
        <input
          name="order"
          type="number"
          min={0}
          step={1}
          defaultValue={pastor?.order ?? 0}
          className={adminFieldClass}
        />
      </label>

      <label className="block sm:col-span-2">
        <AdminLabel>Verset biblique / Citation</AdminLabel>
        <textarea
          name="quote"
          rows={2}
          defaultValue={pastor?.quote ?? ""}
          placeholder="« Car moi, je connais les projets que j’ai formés sur vous… » — Jérémie 29:11"
          className={adminFieldClass}
        />
      </label>

      <label className="block sm:col-span-2">
        <AdminLabel>Description / Bio</AdminLabel>
        <textarea
          name="bio"
          rows={5}
          defaultValue={pastor?.bio ?? ""}
          className={adminFieldClass}
        />
      </label>

      <fieldset className="space-y-3 border border-slate-200 bg-slate-50 p-4 sm:col-span-2">
        <legend className="px-1 font-heading text-sm font-bold text-slate-900">
          Photo d’illustration
        </legend>
        <p className="font-sans text-xs text-slate-600">
          Téléversement local vers <code className="font-mono">/uploads/</code>.
        </p>
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
          <AdminThumb src={imagePreview} alt={pastor?.name ?? "Aperçu de la photo"} className="size-20" />
          <label className="block min-w-0 flex-1">
            <AdminLabel>Fichier image</AdminLabel>
            <input
              name="imageFile"
              type="file"
              accept="image/*"
              className={adminFileClass}
              onChange={(change) => {
                const file = change.target.files?.[0];
                setImagePreview(file ? URL.createObjectURL(file) : (pastor?.image ?? null));
              }}
            />
          </label>
        </div>
        <input type="hidden" name="image" defaultValue={pastor?.image ?? ""} />
        {pastor?.image ? (
          <span className="block font-mono text-xs text-slate-500">{pastor.image}</span>
        ) : null}
      </fieldset>

      <div className="sm:col-span-2">
        <AdminSubmitButton>{submitLabel}</AdminSubmitButton>
      </div>
    </form>
  );
}
