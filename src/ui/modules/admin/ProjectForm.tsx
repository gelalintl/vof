"use client";

import { useState } from "react";
import type { AdminProjectRecord } from "@/types";
import { PROJECT_CATEGORIES, PROJECT_STATUSES, projectStatusLabels } from "@/lib/donations";
import { AdminLabel } from "./AdminPageHeader";
import { AdminThumb } from "./AdminThumb";
import { AdminSubmitButton } from "./AdminSubmitButton";
import { adminFieldClass, adminFileClass } from "./adminStyles";

interface ProjectFormProps {
  action: (formData: FormData) => void | Promise<void>;
  project?: AdminProjectRecord;
  submitLabel: string;
}

export function ProjectForm({ action, project, submitLabel }: ProjectFormProps) {
  const [imagePreview, setImagePreview] = useState<string | null>(project?.image ?? null);

  return (
    <form action={action} className="grid gap-4 sm:grid-cols-2">
      {project ? <input type="hidden" name="id" value={project.id} /> : null}

      <label className="block sm:col-span-2">
        <AdminLabel>Nom</AdminLabel>
        <input
          name="title"
          required
          defaultValue={project?.title}
          placeholder="Construction du temple"
          className={adminFieldClass}
        />
      </label>

      <label className="block">
        <AdminLabel>Slug</AdminLabel>
        <input
          name="slug"
          defaultValue={project?.slug}
          placeholder="Généré automatiquement si vide"
          className={adminFieldClass}
        />
      </label>

      <label className="block">
        <AdminLabel>Catégorie</AdminLabel>
        <select name="category" defaultValue={project?.category ?? ""} className={adminFieldClass}>
          <option value="">Sans catégorie</option>
          {PROJECT_CATEGORIES.map((category) => (
            <option key={category} value={category}>
              {category}
            </option>
          ))}
        </select>
      </label>

      <label className="block">
        <AdminLabel>Objectif financier (FCFA)</AdminLabel>
        <input
          name="targetAmount"
          type="number"
          min={1}
          step={500}
          required
          defaultValue={project?.targetAmount ?? 1000000}
          className={adminFieldClass}
        />
      </label>

      <label className="block">
        <AdminLabel>Montant actuel (FCFA)</AdminLabel>
        <input
          name="currentAmount"
          type="number"
          min={0}
          step={500}
          defaultValue={project?.currentAmount ?? 0}
          className={adminFieldClass}
        />
      </label>

      <label className="block">
        <AdminLabel>Statut</AdminLabel>
        <select
          name="status"
          defaultValue={project?.status ?? "IN_PROGRESS"}
          className={adminFieldClass}
        >
          {PROJECT_STATUSES.map((status) => (
            <option key={status} value={status}>
              {projectStatusLabels[status]}
            </option>
          ))}
        </select>
      </label>

      <label className="block">
        <AdminLabel>Ordre d’affichage</AdminLabel>
        <input
          name="order"
          type="number"
          min={0}
          step={1}
          defaultValue={project?.order ?? 0}
          className={adminFieldClass}
        />
      </label>

      <label className="flex items-center gap-2 sm:col-span-2">
        <input
          name="isFeatured"
          type="checkbox"
          defaultChecked={project?.isFeatured}
          className="size-4 accent-[#6d28d9]"
        />
        <span className="font-sans text-sm text-slate-800">Mettre à la une (un seul projet)</span>
      </label>

      <label className="block sm:col-span-2">
        <AdminLabel>Description</AdminLabel>
        <textarea
          name="description"
          required
          rows={4}
          defaultValue={project?.description}
          className={adminFieldClass}
        />
      </label>

      <fieldset className="space-y-3 border border-slate-200 bg-slate-50 p-4 sm:col-span-2">
        <legend className="px-1 font-heading text-sm font-bold text-slate-900">
          Image d’illustration
        </legend>
        <p className="font-sans text-xs text-slate-600">
          Téléversement local vers <code className="font-mono">/uploads/</code>.
        </p>
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
          <AdminThumb
            src={imagePreview}
            alt={project?.title ?? "Aperçu du projet"}
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
                setImagePreview(file ? URL.createObjectURL(file) : (project?.image ?? null));
              }}
            />
          </label>
        </div>
        <input type="hidden" name="image" defaultValue={project?.image ?? ""} />
      </fieldset>

      <div className="sm:col-span-2">
        <AdminSubmitButton>{submitLabel}</AdminSubmitButton>
      </div>
    </form>
  );
}
