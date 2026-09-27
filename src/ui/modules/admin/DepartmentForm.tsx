"use client";

import { useState } from "react";
import type { AdminDepartmentRecord } from "@/types";
import { AdminLabel } from "./AdminPageHeader";
import { AdminThumb } from "./AdminThumb";
import { AdminSubmitButton } from "./AdminSubmitButton";
import { adminFieldClass, adminFileClass } from "./adminStyles";

interface DepartmentFormProps {
  action: (formData: FormData) => void | Promise<void>;
  department?: AdminDepartmentRecord;
  submitLabel: string;
}

export function DepartmentForm({ action, department, submitLabel }: DepartmentFormProps) {
  const [imagePreview, setImagePreview] = useState<string | null>(department?.image ?? null);

  return (
    <form action={action} className="grid gap-4 sm:grid-cols-2">
      {department ? <input type="hidden" name="id" value={department.id} /> : null}

      <label className="block sm:col-span-2">
        <AdminLabel>Nom</AdminLabel>
        <input
          name="name"
          required
          defaultValue={department?.name}
          placeholder="Jeunesse"
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
          defaultValue={department?.order ?? 0}
          className={adminFieldClass}
        />
      </label>

      <label className="block">
        <AdminLabel>Responsable</AdminLabel>
        <input
          name="responsible"
          defaultValue={department?.responsible ?? ""}
          placeholder="Nom du responsable"
          className={adminFieldClass}
        />
      </label>

      <label className="block">
        <AdminLabel>Contact</AdminLabel>
        <input
          name="contact"
          defaultValue={department?.contact ?? ""}
          placeholder="Téléphone ou e-mail"
          className={adminFieldClass}
        />
      </label>

      <label className="block sm:col-span-2">
        <AdminLabel>Description</AdminLabel>
        <textarea
          name="description"
          required
          rows={4}
          defaultValue={department?.description}
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
          <AdminThumb
            src={imagePreview}
            alt={department?.name ?? "Aperçu du département"}
            className="size-20"
          />
          <label className="block min-w-0 flex-1">
            <AdminLabel>Fichier image</AdminLabel>
            <input
              name="imageFile"
              type="file"
              accept="image/*"
              className={adminFileClass}
              onChange={(change) => {
                const file = change.target.files?.[0];
                setImagePreview(file ? URL.createObjectURL(file) : (department?.image ?? null));
              }}
            />
          </label>
        </div>
        <input type="hidden" name="image" defaultValue={department?.image ?? ""} />
      </fieldset>

      <div className="sm:col-span-2">
        <AdminSubmitButton>{submitLabel}</AdminSubmitButton>
      </div>
    </form>
  );
}
