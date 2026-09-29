"use client";

import { useMemo, useState } from "react";
import { Pencil, Trash2, Upload } from "lucide-react";
import {
  deleteMedia,
  updateMediaFromForm,
  uploadAdminImageFromForm,
} from "@/app/admin/actions";
import { mediaKindFromUrl, mediaThumbSrc } from "@/lib/mediaKind";
import type { AdminMediaRecord } from "@/types";
import { cn } from "@/utils/cn";
import { AdminBadge } from "./AdminBadge";
import { AdminConfirmDialog, AdminDrawer } from "./AdminDrawer";
import { AdminEmptyState, AdminPageHeader } from "./AdminPageHeader";
import { MediaForm } from "./MediaForm";
import { adminPrimaryButtonClass } from "./adminStyles";
import { notifyAdminAction, notifyAdminConfirm } from "./notifyAdminAction";

interface MediaManagerProps {
  media: AdminMediaRecord[];
}

type MediaFilter = "all" | "image" | "video" | "featured";

const filters: { id: MediaFilter; label: string }[] = [
  { id: "all", label: "Tous" },
  { id: "image", label: "Images" },
  { id: "video", label: "Vidéos" },
  { id: "featured", label: "À la une" },
];

export function MediaManager({ media }: MediaManagerProps) {
  const [filter, setFilter] = useState<MediaFilter>("all");
  const [createOpen, setCreateOpen] = useState(false);
  const [editing, setEditing] = useState<AdminMediaRecord | null>(null);
  const [pendingDelete, setPendingDelete] = useState<AdminMediaRecord | null>(null);

  const visible = useMemo(() => {
    return media.filter((item) => {
      if (filter === "featured") {
        return item.isFeaturedHome;
      }
      if (filter === "image" || filter === "video") {
        return mediaKindFromUrl(item.url) === filter;
      }
      return true;
    });
  }, [filter, media]);

  return (
    <>
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <AdminPageHeader
          kicker="Médiathèque"
          title="Médiathèque"
          description="Images et vidéos de l’église, avec mise en avant possible sur la galerie d’accueil."
        />
        <button
          type="button"
          className={adminPrimaryButtonClass}
          onClick={() => setCreateOpen(true)}
        >
          <Upload className="size-4" aria-hidden />
          Ajouter un média
        </button>
      </div>

      <nav
        aria-label="Filtrer les médias"
        className="mt-8 flex gap-2 overflow-x-auto border-b border-slate-200 pb-px"
      >
        {filters.map((item) => (
          <button
            key={item.id}
            type="button"
            onClick={() => setFilter(item.id)}
            className={cn(
              "shrink-0 border-b-2 px-3 py-2.5 font-heading text-sm tracking-tight transition-colors",
              filter === item.id
                ? "border-[#6d28d9] font-bold text-[#6d28d9]"
                : "border-transparent font-semibold text-slate-500 hover:text-slate-900",
            )}
          >
            {item.label}
          </button>
        ))}
      </nav>

      {visible.length === 0 ? (
        <div className="mt-6">
          <AdminEmptyState>Aucun média dans ce filtre.</AdminEmptyState>
        </div>
      ) : (
        <div className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {visible.map((item) => {
            const kind = mediaKindFromUrl(item.url);
            return (
              <article key={item.id} className="overflow-hidden border border-slate-200 bg-white">
                <div className="relative aspect-[4/3] bg-slate-100">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={mediaThumbSrc(item.url)}
                    alt={item.title}
                    className="h-full w-full object-cover"
                  />
                </div>
                <div className="p-4">
                  <p className="font-heading font-bold text-slate-900">{item.title}</p>
                  <div className="mt-2 flex flex-wrap gap-1">
                    <AdminBadge className="border-slate-200 bg-slate-50 text-slate-700">
                      {item.category}
                    </AdminBadge>
                    <AdminBadge className="border-slate-200 bg-white text-slate-600">
                      {kind === "video" ? "Vidéo" : "Image"}
                    </AdminBadge>
                    {item.isFeaturedHome ? (
                      <AdminBadge className="border-amber-200 bg-amber-50 text-amber-800">
                        À la une (Accueil)
                      </AdminBadge>
                    ) : null}
                  </div>
                  <div className="mt-4 flex justify-end gap-1.5">
                    <button
                      type="button"
                      onClick={() => setEditing(item)}
                      className="inline-flex size-9 items-center justify-center border border-slate-200 text-[#6d28d9] transition-colors hover:bg-[#6d28d9] hover:text-white"
                      aria-label={`Éditer ${item.title}`}
                    >
                      <Pencil className="size-4" />
                    </button>
                    <button
                      type="button"
                      onClick={() => setPendingDelete(item)}
                      className="inline-flex size-9 items-center justify-center border border-slate-200 text-[#6d28d9] transition-colors hover:bg-red-600 hover:text-white"
                      aria-label={`Supprimer ${item.title}`}
                    >
                      <Trash2 className="size-4" />
                    </button>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      )}

      <AdminDrawer
        isOpen={createOpen}
        title="Ajouter un média"
        description="Image locale ou lien vidéo, avec option de mise en avant."
        onClose={() => setCreateOpen(false)}
      >
        <MediaForm
          action={notifyAdminAction(uploadAdminImageFromForm, "Média enregistré.", () =>
            setCreateOpen(false),
          )}
          submitLabel="Enregistrer le média"
        />
      </AdminDrawer>

      <AdminDrawer
        isOpen={Boolean(editing)}
        title="Éditer le média"
        onClose={() => setEditing(null)}
      >
        {editing ? (
          <MediaForm
            key={editing.id}
            media={editing}
            action={notifyAdminAction(updateMediaFromForm, "Média mis à jour.", () =>
              setEditing(null),
            )}
            submitLabel="Enregistrer les modifications"
          />
        ) : null}
      </AdminDrawer>

      <AdminConfirmDialog
        isOpen={Boolean(pendingDelete)}
        title="Supprimer le média"
        message={`« ${pendingDelete?.title ?? ""} » sera définitivement retiré.`}
        onClose={() => setPendingDelete(null)}
        onConfirm={async () => {
          if (!pendingDelete) {
            return;
          }
          const formData = new FormData();
          formData.set("id", pendingDelete.id);
          await notifyAdminConfirm(() => deleteMedia(formData), "Média supprimé.");
          setPendingDelete(null);
        }}
      />
    </>
  );
}
