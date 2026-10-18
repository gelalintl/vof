"use client";

import { useState } from "react";
import type { AdminTestimonialRecord } from "@/types";
import { AdminLabel } from "./AdminPageHeader";
import { AdminEnglishSection } from "./AdminEnglishSection";
import { AdminSubmitButton } from "./AdminSubmitButton";
import { AdminThumb } from "./AdminThumb";
import { adminFieldClass, adminFileClass } from "./adminStyles";

interface TestimonialFormProps {
  action: (formData: FormData) => void | Promise<void>;
  testimonial?: AdminTestimonialRecord;
  submitLabel: string;
}

export function TestimonialForm({ action, testimonial, submitLabel }: TestimonialFormProps) {
  const [imagePreview, setImagePreview] = useState<string | null>(
    testimonial?.imagePath ?? null,
  );

  return (
    <form action={action} className="grid gap-4">
      <label className="block">
        <AdminLabel>Nom de l’auteur</AdminLabel>
        <input
          name="authorName"
          required
          maxLength={120}
          defaultValue={testimonial?.authorName}
          placeholder="Frère Jean, Sœur Marie…"
          className={adminFieldClass}
        />
      </label>

      <label className="block">
        <AdminLabel>Contact (privé)</AdminLabel>
        <input
          name="contactInfo"
          maxLength={160}
          defaultValue={testimonial?.contactInfo ?? ""}
          placeholder="E-mail ou téléphone — jamais affiché sur le site"
          className={adminFieldClass}
        />
      </label>

      <label className="block">
        <AdminLabel>Témoignage</AdminLabel>
        <textarea
          name="content"
          required
          rows={8}
          maxLength={5000}
          defaultValue={testimonial?.content}
          placeholder="Racontez comment Dieu a agi…"
          className={adminFieldClass}
        />
      </label>

      <fieldset className="space-y-3 border border-slate-200 bg-slate-50 p-4">
        <legend className="px-1 font-heading text-sm font-bold text-slate-900">
          Photo (facultatif)
        </legend>
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
          <AdminThumb
            src={imagePreview}
            alt={testimonial?.authorName ?? "Aperçu de la photo"}
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
                setImagePreview(
                  file ? URL.createObjectURL(file) : (testimonial?.imagePath ?? null),
                );
              }}
            />
          </label>
        </div>
        <input type="hidden" name="imagePath" defaultValue={testimonial?.imagePath ?? ""} />
      </fieldset>

      <label className="flex items-center gap-3 border border-slate-200 bg-white px-4 py-3">
        <input
          type="checkbox"
          name="isPublished"
          defaultChecked={testimonial?.isPublished ?? false}
          className="size-4 accent-[#6d28d9]"
        />
        <span className="font-heading text-sm font-bold text-slate-900">
          {testimonial ? "Publié sur le site" : "Publier immédiatement"}
        </span>
      </label>

      <AdminEnglishSection>
        <label className="block">
          <AdminLabel>Témoignage (EN)</AdminLabel>
          <textarea
            name="contentEn"
            rows={6}
            maxLength={5000}
            defaultValue={testimonial?.contentEn ?? ""}
            placeholder="English version of the testimony…"
            className={adminFieldClass}
          />
        </label>
      </AdminEnglishSection>

      <div>
        <AdminSubmitButton>{submitLabel}</AdminSubmitButton>
      </div>
    </form>
  );
}
