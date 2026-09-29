"use client";

import { useState } from "react";
import type { AdminMediaRecord } from "@/types";
import { mediaKindFromUrl } from "@/lib/mediaKind";
import { cn } from "@/utils/cn";
import { AdminLabel } from "./AdminPageHeader";
import { AdminSubmitButton } from "./AdminSubmitButton";
import { adminFieldClass, adminFileClass } from "./adminStyles";

interface MediaFormProps {
  action: (formData: FormData) => void | Promise<void>;
  media?: AdminMediaRecord;
  submitLabel: string;
}

export function MediaForm({ action, media, submitLabel }: MediaFormProps) {
  const [kind, setKind] = useState<"image" | "video">(
    media ? mediaKindFromUrl(media.url) : "image",
  );
  const [featured, setFeatured] = useState(Boolean(media?.isFeaturedHome));
  const [preview, setPreview] = useState<string | null>(media?.url ?? null);
  const [videoUrl, setVideoUrl] = useState(
    media && mediaKindFromUrl(media.url) === "video" ? media.url : "",
  );

  return (
    <form action={action} className="grid gap-4">
      {media ? <input type="hidden" name="id" value={media.id} /> : null}
      {media?.eventId ? <input type="hidden" name="eventId" value={media.eventId} /> : null}
      {featured ? <input type="hidden" name="isFeaturedHome" value="on" /> : null}
      <input type="hidden" name="url" value={media?.url ?? ""} />
      <input type="hidden" name="kind" value={kind} />

      <label className="block">
        <AdminLabel>Titre du média</AdminLabel>
        <input
          name="title"
          required
          defaultValue={media?.title}
          placeholder="Culte du dimanche"
          className={adminFieldClass}
        />
      </label>

      <label className="block">
        <AdminLabel>Catégorie / Légende</AdminLabel>
        <input
          name="category"
          defaultValue={media?.category ?? "galerie"}
          placeholder="galerie, culte, jeunesse…"
          className={adminFieldClass}
        />
      </label>

      <fieldset>
        <AdminLabel>Type</AdminLabel>
        <div className="mt-2 grid grid-cols-2 gap-2">
          <TypeChoice
            selected={kind === "image"}
            label="Image"
            onSelect={() => setKind("image")}
          />
          <TypeChoice
            selected={kind === "video"}
            label="Vidéo"
            onSelect={() => setKind("video")}
          />
        </div>
      </fieldset>

      {kind === "image" ? (
        <label className="block">
          <AdminLabel>Fichier image</AdminLabel>
          <input
            name="file"
            type="file"
            accept="image/*"
            required={!media}
            className={adminFileClass}
            onChange={(change) => {
              const file = change.target.files?.[0];
              setPreview(file ? URL.createObjectURL(file) : (media?.url ?? null));
            }}
          />
          <p className="mt-1 font-sans text-xs text-slate-500">
            Enregistré localement dans <code className="font-mono">/uploads/</code>.
          </p>
        </label>
      ) : (
        <label className="block">
          <AdminLabel>Lien vidéo</AdminLabel>
          <input
            name="videoUrl"
            type="url"
            required={!media}
            value={videoUrl}
            onChange={(change) => {
              setVideoUrl(change.target.value);
              setPreview(change.target.value || null);
            }}
            placeholder="https://www.youtube.com/watch?v=…"
            className={adminFieldClass}
          />
        </label>
      )}

      {preview && kind === "image" ? (
        <div className="overflow-hidden border border-slate-200">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={preview} alt="Aperçu" className="max-h-48 w-full object-cover" />
        </div>
      ) : null}

      <button
        type="button"
        role="switch"
        aria-checked={featured}
        onClick={() => setFeatured((current) => !current)}
        className="flex w-full items-center justify-between gap-4 border border-slate-200 bg-white px-4 py-3 text-left"
      >
        <span>
          <span className="block font-heading text-sm font-bold text-slate-900">
            Mettre en avant sur la galerie d’accueil
          </span>
          <span className="block text-xs text-slate-500">
            Visible dans la galerie de la page d’accueil.
          </span>
        </span>
        <span
          className={cn(
            "relative h-6 w-11 shrink-0 rounded-full transition-colors",
            featured ? "bg-[#6d28d9]" : "bg-violet-200",
          )}
        >
          <span
            className={cn(
              "absolute top-0.5 size-5 rounded-full bg-white shadow-sm transition-[left]",
              featured ? "left-[22px]" : "left-0.5",
            )}
          />
          <span className="sr-only">{featured ? "Activé" : "Désactivé"}</span>
        </span>
      </button>

      <AdminSubmitButton>{submitLabel}</AdminSubmitButton>
    </form>
  );
}

function TypeChoice({
  selected,
  label,
  onSelect,
}: {
  selected: boolean;
  label: string;
  onSelect: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onSelect}
      className={cn(
        "border px-3 py-2 font-heading text-sm font-bold",
        selected ? "border-[#6d28d9] bg-violet-50 text-[#6d28d9]" : "border-slate-200 text-slate-700",
      )}
    >
      {label}
    </button>
  );
}
