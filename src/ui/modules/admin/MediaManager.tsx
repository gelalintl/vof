"use client";

import { useState } from "react";
import {
  deleteMedia,
  updateMediaFromForm,
  uploadAdminImageFromForm,
} from "@/app/admin/actions";
import type { AdminMediaRecord } from "@/types";
import { formatAdminDateTime } from "@/utils/date/format";
import { AdminActionBar } from "./AdminActionBar";
import { AdminBadge } from "./AdminBadge";
import { AdminConfirmDialog, AdminDrawer } from "./AdminDrawer";
import { AdminEmptyState, AdminLabel, AdminPanel } from "./AdminPageHeader";
import { AdminThumb } from "./AdminThumb";
import { MediaForm } from "./MediaForm";
import { notifyAdminAction, notifyAdminConfirm } from "./notifyAdminAction";

interface MediaManagerProps {
  media: AdminMediaRecord[];
}

type DrawerMode = "view" | "edit" | null;

export function MediaManager({ media }: MediaManagerProps) {
  const [selected, setSelected] = useState<AdminMediaRecord | null>(null);
  const [mode, setMode] = useState<DrawerMode>(null);
  const [pendingDelete, setPendingDelete] = useState<AdminMediaRecord | null>(null);

  const close = () => {
    setSelected(null);
    setMode(null);
  };

  return (
    <>
      {media.length === 0 ? (
        <AdminEmptyState>Aucun média enregistré.</AdminEmptyState>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2">
          {media.map((item) => (
            <article key={item.id} className="border border-slate-200 bg-white p-4">
              <div className="flex items-start gap-3">
                <AdminThumb src={item.url} alt={item.title} className="size-20" />
                <div className="min-w-0 flex-1">
                  <p className="font-heading font-bold text-slate-900">{item.title}</p>
                  <p className="mt-1 truncate font-mono text-xs text-slate-500">{item.url}</p>
                  <div className="mt-2 flex flex-wrap gap-2">
                    <AdminBadge className="border-slate-200 bg-white text-slate-900">
                      {item.category}
                    </AdminBadge>
                    {item.isFeaturedHome ? (
                      <AdminBadge className="border-amber-200 bg-amber-50 text-amber-800">
                        Accueil
                      </AdminBadge>
                    ) : null}
                  </div>
                </div>
              </div>
              <div className="mt-4 flex items-center justify-between">
                <p className="text-xs text-slate-500">{formatAdminDateTime(item.createdAt)}</p>
                <AdminActionBar
                  onView={() => {
                    setSelected(item);
                    setMode("view");
                  }}
                  onEdit={() => {
                    setSelected(item);
                    setMode("edit");
                  }}
                  onDelete={() => setPendingDelete(item)}
                />
              </div>
            </article>
          ))}
        </div>
      )}

      <AdminDrawer
        isOpen={Boolean(selected) && mode === "view"}
        title={selected?.title ?? "Média"}
        onClose={close}
      >
        {selected ? (
          <div className="space-y-5">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={selected.url} alt={selected.title} className="w-full border border-slate-200 object-cover" />
            <Detail label="Catégorie" value={selected.category} />
            <Detail label="URL" value={selected.url} />
            <Detail label="Événement lié" value={selected.eventTitle ?? "Aucun"} />
            <Detail
              label="Mise en avant"
              value={selected.isFeaturedHome ? "Oui — accueil" : "Non"}
            />
            <Detail label="Ajouté le" value={formatAdminDateTime(selected.createdAt)} />
          </div>
        ) : null}
      </AdminDrawer>

      <AdminDrawer
        isOpen={Boolean(selected) && mode === "edit"}
        title="Éditer le média"
        onClose={close}
      >
        {selected ? (
          <MediaForm
            key={selected.id}
            media={selected}
            action={notifyAdminAction(updateMediaFromForm, "Média mis à jour.", close)}
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

function Detail({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <AdminLabel>{label}</AdminLabel>
      <p className="mt-1 break-all text-sm text-slate-800">{value}</p>
    </div>
  );
}

export function MediaCreatePanel() {
  return (
    <AdminPanel>
      <h2 className="mb-4 font-heading text-lg font-bold text-slate-900">Nouveau média</h2>
      <MediaForm
        action={notifyAdminAction(uploadAdminImageFromForm, "Média enregistré.")}
        submitLabel="Enregistrer l’image"
      />
    </AdminPanel>
  );
}
