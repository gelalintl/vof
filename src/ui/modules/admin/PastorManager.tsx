"use client";

import { useState } from "react";
import { Pencil, Trash2 } from "lucide-react";
import {
  createPastorFromForm,
  deletePastor,
  updatePastorFromForm,
} from "@/app/admin/actions";
import type { AdminPastorRecord } from "@/types";
import { AdminConfirmDialog, AdminDrawer } from "./AdminDrawer";
import { AdminEmptyState, AdminPanel } from "./AdminPageHeader";
import { notifyAdminAction, notifyAdminConfirm } from "./notifyAdminAction";
import { PastorForm } from "./PastorForm";

interface PastorManagerProps {
  pastors: AdminPastorRecord[];
}

export function PastorManager({ pastors }: PastorManagerProps) {
  const [selected, setSelected] = useState<AdminPastorRecord | null>(null);
  const [pendingDelete, setPendingDelete] = useState<AdminPastorRecord | null>(null);

  return (
    <>
      {pastors.length === 0 ? (
        <AdminEmptyState>Aucun pasteur enregistré pour le moment.</AdminEmptyState>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {pastors.map((pastor) => (
            <article
              key={pastor.id}
              className="overflow-hidden border border-slate-200 bg-white"
            >
              <div className="relative aspect-[4/5] overflow-hidden bg-white">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={pastor.image || "/assets/pastors/placeholder.svg"}
                  alt={pastor.name}
                  className="h-full w-full object-cover"
                />
              </div>
              <div className="flex items-start justify-between gap-3 p-4">
                <div className="min-w-0">
                  <p className="font-heading text-lg font-bold text-slate-900">{pastor.name}</p>
                  <p className="mt-1 font-sans text-sm text-slate-600">{pastor.role}</p>
                  <p className="mt-1 font-mono text-[11px] text-slate-400">Ordre {pastor.order}</p>
                </div>
                <div className="flex shrink-0 items-center gap-1.5">
                  <button
                    type="button"
                    onClick={() => setSelected(pastor)}
                    className="inline-flex size-9 items-center justify-center border border-slate-200 text-slate-900 hover:bg-[#6d28d9] hover:text-white"
                    aria-label={`Éditer ${pastor.name}`}
                  >
                    <Pencil className="size-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => setPendingDelete(pastor)}
                    className="inline-flex size-9 items-center justify-center border border-slate-200 text-slate-900 hover:bg-violet-800 hover:text-white"
                    aria-label={`Supprimer ${pastor.name}`}
                  >
                    <Trash2 className="size-4" />
                  </button>
                </div>
              </div>
            </article>
          ))}
        </div>
      )}

      <AdminDrawer
        isOpen={Boolean(selected)}
        title="Éditer le dirigeant"
        onClose={() => setSelected(null)}
      >
        {selected ? (
          <PastorForm
            key={selected.id}
            pastor={selected}
            action={notifyAdminAction(updatePastorFromForm, "Dirigeant mis à jour.", () =>
              setSelected(null),
            )}
            submitLabel="Enregistrer les modifications"
          />
        ) : null}
      </AdminDrawer>

      <AdminConfirmDialog
        isOpen={Boolean(pendingDelete)}
        title="Supprimer le dirigeant"
        message={`« ${pendingDelete?.name ?? ""} » sera définitivement retiré.`}
        onClose={() => setPendingDelete(null)}
        onConfirm={async () => {
          if (!pendingDelete) {
            return;
          }
          const formData = new FormData();
          formData.set("id", pendingDelete.id);
          await notifyAdminConfirm(() => deletePastor(formData), "Dirigeant supprimé.");
          setPendingDelete(null);
        }}
      />
    </>
  );
}

export function PastorCreatePanel() {
  return (
    <AdminPanel>
      <h2 className="mb-4 font-heading text-lg font-bold text-slate-900">
        Nouveau membre de l’équipe
      </h2>
      <PastorForm
        action={notifyAdminAction(createPastorFromForm, "Dirigeant ajouté.")}
        submitLabel="Ajouter à l’équipe"
      />
    </AdminPanel>
  );
}
