"use client";

import { useState } from "react";
import { X } from "lucide-react";
import type { AdminArticleRecord } from "@/types";
import { AdminLabel } from "./AdminPageHeader";
import { AdminThumb } from "./AdminThumb";
import { AdminSubmitButton } from "./AdminSubmitButton";
import { adminFieldClass, adminFileClass } from "./adminStyles";

interface ArticleFormProps {
  action: (formData: FormData) => void | Promise<void>;
  article?: AdminArticleRecord;
  submitLabel: string;
}

interface PendingGalleryFile {
  id: string;
  file: File;
  preview: string;
}

export function ArticleForm({ action, article, submitLabel }: ArticleFormProps) {
  const [coverPreview, setCoverPreview] = useState<string | null>(article?.coverImage ?? null);
  const [keptGallery, setKeptGallery] = useState<string[]>(article?.galleryImages ?? []);
  const [pendingGallery, setPendingGallery] = useState<PendingGalleryFile[]>([]);

  return (
    <form
      action={async (formData) => {
        formData.delete("galleryFiles");
        for (const item of pendingGallery) {
          formData.append("galleryFiles", item.file);
        }
        await action(formData);
      }}
      className="grid gap-4 sm:grid-cols-2"
    >
      {article ? <input type="hidden" name="id" value={article.id} /> : null}

      <label className="block sm:col-span-2">
        <AdminLabel>Titre</AdminLabel>
        <input name="title" required defaultValue={article?.title} className={adminFieldClass} />
      </label>

      <label className="block">
        <AdminLabel>Slug</AdminLabel>
        <input name="slug" required defaultValue={article?.slug} className={adminFieldClass} />
      </label>

      <label className="block">
        <AdminLabel>Auteur</AdminLabel>
        <input name="author" required defaultValue={article?.author} className={adminFieldClass} />
      </label>

      <label className="block sm:col-span-2">
        <AdminLabel>Lien vidéo de l’enseignement YouTube</AdminLabel>
        <input
          name="youtubeUrl"
          type="text"
          defaultValue={article?.youtubeUrl ?? ""}
          placeholder="https://www.youtube.com/watch?v=…"
          className={adminFieldClass}
        />
      </label>

      <label className="block sm:col-span-2">
        <AdminLabel>Contenu</AdminLabel>
        <textarea
          name="content"
          required
          rows={6}
          defaultValue={article?.content}
          className={adminFieldClass}
        />
      </label>

      <fieldset className="space-y-3 border border-slate-200 bg-slate-50 p-4 sm:col-span-2">
        <legend className="px-1 font-heading text-sm font-bold text-slate-900">
          Image principale
        </legend>
        <p className="font-sans text-xs text-slate-600">
          Téléversement local vers <code className="font-mono">/uploads/</code>.
        </p>
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
          <AdminThumb src={coverPreview} alt={article?.title ?? "Aperçu de couverture"} className="size-20" />
          <label className="block min-w-0 flex-1">
            <AdminLabel>Fichier image</AdminLabel>
            <input
              name="coverFile"
              type="file"
              accept="image/*"
              className={adminFileClass}
              onChange={(change) => {
                const file = change.target.files?.[0];
                setCoverPreview(file ? URL.createObjectURL(file) : (article?.coverImage ?? null));
              }}
            />
          </label>
        </div>
        <input type="hidden" name="coverImage" defaultValue={article?.coverImage ?? ""} />
      </fieldset>

      <fieldset className="space-y-3 border border-slate-200 bg-slate-50 p-4 sm:col-span-2">
        <legend className="px-1 font-heading text-sm font-bold text-slate-900">
          Galerie de l’événement
        </legend>
        <p className="font-sans text-xs text-slate-600">
          Ajoutez plusieurs photos. Elles seront enregistrées dans{" "}
          <code className="font-mono">/uploads/</code> à la sauvegarde.
        </p>
        <label className="block">
          <AdminLabel>Ajouter des images</AdminLabel>
          <input
            type="file"
            accept="image/*"
            multiple
            className={adminFileClass}
            onChange={(change) => {
              const files = Array.from(change.target.files ?? []);
              if (files.length === 0) {
                return;
              }
              setPendingGallery((current) => [
                ...current,
                ...files.map((file) => ({
                  id: `${file.name}-${file.size}-${file.lastModified}-${Math.random()}`,
                  file,
                  preview: URL.createObjectURL(file),
                })),
              ]);
              change.target.value = "";
            }}
          />
        </label>

        {keptGallery.map((src) => (
          <input key={src} type="hidden" name="galleryImages" value={src} />
        ))}

        {keptGallery.length + pendingGallery.length > 0 ? (
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
            {keptGallery.map((src) => (
              <div key={src} className="relative border border-slate-200 bg-white">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={src} alt="" className="aspect-square w-full object-cover" />
                <button
                  type="button"
                  onClick={() => setKeptGallery((current) => current.filter((url) => url !== src))}
                  className="absolute right-1.5 top-1.5 inline-flex size-7 items-center justify-center bg-white text-slate-700 shadow-sm hover:bg-red-50 hover:text-red-600"
                  aria-label="Retirer cette image"
                >
                  <X className="size-4" />
                </button>
              </div>
            ))}
            {pendingGallery.map((item) => (
              <div key={item.id} className="relative border border-slate-200 bg-white">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={item.preview} alt="" className="aspect-square w-full object-cover" />
                <button
                  type="button"
                  onClick={() =>
                    setPendingGallery((current) => current.filter((file) => file.id !== item.id))
                  }
                  className="absolute right-1.5 top-1.5 inline-flex size-7 items-center justify-center bg-white text-slate-700 shadow-sm hover:bg-red-50 hover:text-red-600"
                  aria-label="Retirer cette image"
                >
                  <X className="size-4" />
                </button>
              </div>
            ))}
          </div>
        ) : (
          <p className="font-sans text-xs text-slate-500">Aucune image de galerie pour le moment.</p>
        )}
      </fieldset>

      <label className="flex items-center gap-2 sm:col-span-2">
        <input
          name="isPublished"
          type="checkbox"
          defaultChecked={article?.isPublished}
          className="size-4 accent-[#6d28d9]"
        />
        <span className="font-sans text-sm">Publier</span>
      </label>

      <label className="flex items-start gap-2 sm:col-span-2">
        <input
          name="isFeatured"
          type="checkbox"
          defaultChecked={article?.isFeatured}
          className="mt-0.5 size-4 accent-[#6d28d9]"
        />
        <span>
          <span className="block font-sans text-sm">Épingler comme Enseignement Phare</span>
          <span className="mt-1 block font-sans text-xs text-slate-600">
            Un seul enseignement peut être à la une. Cocher cette case retire le statut des autres.
          </span>
        </span>
      </label>

      <div className="sm:col-span-2">
        <AdminSubmitButton>{submitLabel}</AdminSubmitButton>
      </div>
    </form>
  );
}
