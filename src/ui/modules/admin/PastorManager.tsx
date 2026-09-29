"use client";

import { useState } from "react";
import Link from "next/link";
import { Pencil, Trash2 } from "lucide-react";
import { deletePastor } from "@/app/admin/actions";
import type { AdminPastorRecord } from "@/types";
import { AdminBadge } from "./AdminBadge";
import { AdminConfirmDialog } from "./AdminDrawer";
import { AdminEmptyState } from "./AdminPageHeader";
import { notifyAdminConfirm } from "./notifyAdminAction";

interface PastorManagerProps {
  pastors: AdminPastorRecord[];
}

function shortenQuote(value: string | null) {
  if (!value?.trim()) {
    return "—";
  }
  const text = value.trim();
  return text.length > 90 ? `${text.slice(0, 90).trim()}…` : text;
}

export function PastorManager({ pastors }: PastorManagerProps) {
  const [pendingDelete, setPendingDelete] = useState<AdminPastorRecord | null>(null);

  return (
    <>
      {pastors.length === 0 ? (
        <AdminEmptyState>Aucun membre enregistré pour le moment.</AdminEmptyState>
      ) : (
        <div className="overflow-x-auto border border-slate-200 bg-white">
          <table className="min-w-full text-left text-sm">
            <thead className="border-b border-slate-100 bg-slate-50 font-heading text-[11px] font-bold uppercase tracking-[0.16em] text-slate-900">
              <tr>
                <th className="px-4 py-3">Photo / Nom</th>
                <th className="px-4 py-3">Rôle</th>
                <th className="px-4 py-3">Verset / Citation</th>
                <th className="px-4 py-3">Ordre</th>
                <th className="px-4 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {pastors.map((pastor) => (
                <tr key={pastor.id} className="border-b border-slate-100 last:border-0">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <div className="size-12 shrink-0 overflow-hidden border border-slate-200 bg-slate-50">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={pastor.image || "/assets/pastors/placeholder.svg"}
                          alt={pastor.name}
                          className="size-full object-cover"
                        />
                      </div>
                      <p className="font-heading font-bold text-slate-900">{pastor.name}</p>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <AdminBadge className="border-[#6d28d9]/20 bg-[#6d28d9]/10 text-[#6d28d9]">
                      {pastor.role}
                    </AdminBadge>
                  </td>
                  <td className="max-w-xs px-4 py-3 font-serif text-sm italic text-slate-600">
                    {shortenQuote(pastor.quote)}
                  </td>
                  <td className="px-4 py-3 font-mono text-sm text-slate-600">{pastor.order}</td>
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-end gap-1.5">
                      <Link
                        href={`/admin/pasteurs/${pastor.id}/edit`}
                        className="inline-flex size-9 items-center justify-center border border-slate-200 text-[#6d28d9] transition-colors hover:bg-[#6d28d9] hover:text-white"
                        aria-label={`Éditer ${pastor.name}`}
                      >
                        <Pencil className="size-4" />
                      </Link>
                      <button
                        type="button"
                        onClick={() => setPendingDelete(pastor)}
                        className="inline-flex size-9 items-center justify-center border border-slate-200 text-[#6d28d9] transition-colors hover:bg-red-600 hover:text-white"
                        aria-label={`Supprimer ${pastor.name}`}
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

      <AdminConfirmDialog
        isOpen={Boolean(pendingDelete)}
        title="Supprimer le membre"
        message={`« ${pendingDelete?.name ?? ""} » sera définitivement retiré de l’équipe pastorale.`}
        onClose={() => setPendingDelete(null)}
        onConfirm={async () => {
          if (!pendingDelete) {
            return;
          }
          const formData = new FormData();
          formData.set("id", pendingDelete.id);
          await notifyAdminConfirm(() => deletePastor(formData), "Membre supprimé.");
          setPendingDelete(null);
        }}
      />
    </>
  );
}
