"use client";

import { useState } from "react";
import { Plus, Pencil, Trash2 } from "lucide-react";
import {
  createDepartment,
  deleteDepartment,
  updateDepartment,
} from "@/app/admin/actions";
import type { AdminDepartmentRecord } from "@/types";
import { AdminConfirmDialog, AdminDrawer } from "./AdminDrawer";
import { AdminEmptyState } from "./AdminPageHeader";
import { AdminThumb } from "./AdminThumb";
import { DepartmentForm } from "./DepartmentForm";
import { adminPrimaryButtonClass } from "./adminStyles";
import { notifyAdminAction, notifyAdminConfirm } from "./notifyAdminAction";

interface DepartmentManagerProps {
  departments: AdminDepartmentRecord[];
}

export function DepartmentManager({ departments }: DepartmentManagerProps) {
  const [creating, setCreating] = useState(false);
  const [selected, setSelected] = useState<AdminDepartmentRecord | null>(null);
  const [pendingDelete, setPendingDelete] = useState<AdminDepartmentRecord | null>(null);

  return (
    <>
      <div className="mb-6 flex justify-end">
        <button
          type="button"
          className={adminPrimaryButtonClass}
          onClick={() => setCreating(true)}
        >
          <Plus className="mr-2 size-4" aria-hidden />
          Ajouter un département
        </button>
      </div>

      {departments.length === 0 ? (
        <AdminEmptyState>Aucun département enregistré pour le moment.</AdminEmptyState>
      ) : (
        <div className="overflow-x-auto border border-slate-200 bg-white">
          <table className="min-w-full text-left text-sm">
            <thead className="border-b border-slate-100 bg-slate-50 font-heading text-[11px] font-bold uppercase tracking-[0.16em] text-slate-900">
              <tr>
                <th className="px-4 py-3">Département</th>
                <th className="px-4 py-3">Responsable</th>
                <th className="px-4 py-3">Contact</th>
                <th className="px-4 py-3">Ordre</th>
                <th className="px-4 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {departments.map((department) => (
                <tr key={department.id} className="border-b border-slate-100 last:border-0">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <AdminThumb src={department.image} alt={department.name} />
                      <div>
                        <p className="font-heading font-bold text-slate-900">{department.name}</p>
                        <p className="font-mono text-xs text-slate-500">{department.slug}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-slate-600">{department.responsible || "—"}</td>
                  <td className="px-4 py-3 text-slate-600">{department.contact || "—"}</td>
                  <td className="px-4 py-3 text-slate-600">{department.order}</td>
                  <td className="px-4 py-3">
                    <div className="flex justify-end gap-1.5">
                      <button
                        type="button"
                        onClick={() => setSelected(department)}
                        className="inline-flex size-9 items-center justify-center border border-slate-200 text-slate-900 hover:bg-[#6d28d9] hover:text-white"
                        aria-label={`Éditer ${department.name}`}
                      >
                        <Pencil className="size-4" />
                      </button>
                      <button
                        type="button"
                        onClick={() => setPendingDelete(department)}
                        className="inline-flex size-9 items-center justify-center border border-slate-200 text-slate-900 hover:bg-violet-800 hover:text-white"
                        aria-label={`Supprimer ${department.name}`}
                      >
                        <Trash2 className="size-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <AdminDrawer
        isOpen={creating}
        title="Ajouter un département"
        onClose={() => setCreating(false)}
      >
        <DepartmentForm
          key="create"
          action={notifyAdminAction(createDepartment, "Département créé.", () =>
            setCreating(false),
          )}
          submitLabel="Créer le département"
        />
      </AdminDrawer>

      <AdminDrawer
        isOpen={Boolean(selected)}
        title="Éditer le département"
        onClose={() => setSelected(null)}
      >
        {selected ? (
          <DepartmentForm
            key={selected.id}
            department={selected}
            action={notifyAdminAction(
              (formData) => updateDepartment(selected.id, formData),
              "Département mis à jour.",
              () => setSelected(null),
            )}
            submitLabel="Enregistrer les modifications"
          />
        ) : null}
      </AdminDrawer>

      <AdminConfirmDialog
        isOpen={Boolean(pendingDelete)}
        title="Supprimer le département"
        message={`« ${pendingDelete?.name ?? ""} » sera définitivement retiré.`}
        onClose={() => setPendingDelete(null)}
        onConfirm={async () => {
          if (!pendingDelete) {
            return;
          }
          await notifyAdminConfirm(
            () => deleteDepartment(pendingDelete.id),
            "Département supprimé.",
          );
          setPendingDelete(null);
        }}
      />
    </>
  );
}
