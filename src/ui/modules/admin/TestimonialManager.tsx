"use client";

import { useState } from "react";
import { Eye, EyeOff, Pencil, Plus, Trash2 } from "lucide-react";
import { toast } from "sonner";
import {
  createTestimonial,
  deleteTestimonial,
  togglePublishTestimonial,
  updateTestimonial,
} from "@/app/sacristie/temoignages/actions";
import type { AdminTestimonialRecord } from "@/types";
import { formatPublicationDate } from "@/utils/date/format";
import { cn } from "@/utils/cn";
import { AdminConfirmDialog, AdminDrawer } from "./AdminDrawer";
import { AdminEmptyState } from "./AdminPageHeader";
import { AdminThumb } from "./AdminThumb";
import { TestimonialForm } from "./TestimonialForm";
import { adminPrimaryButtonClass } from "./adminStyles";
import { notifyAdminAction, notifyAdminConfirm } from "./notifyAdminAction";

interface TestimonialManagerProps {
  testimonials: AdminTestimonialRecord[];
}

function previewText(content: string, max = 90) {
  const flat = content.replace(/\s+/g, " ").trim();
  return flat.length > max ? `${flat.slice(0, max).trimEnd()}…` : flat;
}

const iconButtonClass =
  "inline-flex size-9 items-center justify-center border border-slate-200 text-slate-900 hover:bg-[#6d28d9] hover:text-white disabled:opacity-50";

export function TestimonialManager({ testimonials }: TestimonialManagerProps) {
  const [creating, setCreating] = useState(false);
  const [selected, setSelected] = useState<AdminTestimonialRecord | null>(null);
  const [pendingDelete, setPendingDelete] = useState<AdminTestimonialRecord | null>(null);
  const [busyId, setBusyId] = useState<string | null>(null);

  async function handleToggle(testimonial: AdminTestimonialRecord) {
    setBusyId(testimonial.id);
    try {
      const updated = await togglePublishTestimonial(testimonial.id);
      toast.success(updated.isPublished ? "Témoignage publié." : "Témoignage masqué.");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Une erreur est survenue.");
    } finally {
      setBusyId(null);
    }
  }

  return (
    <>
      <div className="mb-6 flex justify-end">
        <button
          type="button"
          className={adminPrimaryButtonClass}
          onClick={() => setCreating(true)}
        >
          <Plus className="mr-2 size-4" aria-hidden />
          Ajouter un témoignage
        </button>
      </div>

      {testimonials.length === 0 ? (
        <AdminEmptyState>Aucun témoignage enregistré pour le moment.</AdminEmptyState>
      ) : (
        <div className="overflow-x-auto border border-slate-200 bg-white">
          <table className="min-w-full text-left text-sm">
            <thead className="border-b border-slate-100 bg-slate-50 font-heading text-[11px] font-bold uppercase tracking-[0.16em] text-slate-900">
              <tr>
                <th className="px-4 py-3">Nom</th>
                <th className="px-4 py-3">Extrait</th>
                <th className="px-4 py-3">Date</th>
                <th className="px-4 py-3">Statut</th>
                <th className="px-4 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {testimonials.map((testimonial) => (
                <tr key={testimonial.id} className="border-b border-slate-100 last:border-0">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      {testimonial.imagePath ? (
                        <AdminThumb
                          src={testimonial.imagePath}
                          alt={testimonial.authorName}
                          className="size-10"
                        />
                      ) : null}
                      <div>
                        <p className="font-heading font-bold text-slate-900">
                          {testimonial.authorName}
                        </p>
                        {testimonial.contactInfo ? (
                          <p className="font-mono text-xs text-slate-500">
                            {testimonial.contactInfo}
                          </p>
                        ) : null}
                      </div>
                    </div>
                  </td>
                  <td className="max-w-xs px-4 py-3 text-slate-600">
                    {previewText(testimonial.content)}
                  </td>
                  <td className="whitespace-nowrap px-4 py-3 text-slate-600">
                    {formatPublicationDate(testimonial.createdAt, "fr")}
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={cn(
                        "inline-flex border px-2 py-0.5 font-heading text-[11px] font-bold uppercase tracking-[0.12em]",
                        testimonial.isPublished
                          ? "border-emerald-200 bg-emerald-50 text-emerald-700"
                          : "border-slate-200 bg-slate-50 text-slate-500",
                      )}
                    >
                      {testimonial.isPublished ? "Publié" : "Masqué"}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex justify-end gap-1.5">
                      <button
                        type="button"
                        disabled={busyId === testimonial.id}
                        onClick={() => handleToggle(testimonial)}
                        className={iconButtonClass}
                        aria-label={
                          testimonial.isPublished
                            ? `Masquer le témoignage de ${testimonial.authorName}`
                            : `Publier le témoignage de ${testimonial.authorName}`
                        }
                        title={testimonial.isPublished ? "Masquer" : "Publier"}
                      >
                        {testimonial.isPublished ? (
                          <EyeOff className="size-4" />
                        ) : (
                          <Eye className="size-4" />
                        )}
                      </button>
                      <button
                        type="button"
                        onClick={() => setSelected(testimonial)}
                        className={iconButtonClass}
                        aria-label={`Éditer le témoignage de ${testimonial.authorName}`}
                      >
                        <Pencil className="size-4" />
                      </button>
                      <button
                        type="button"
                        onClick={() => setPendingDelete(testimonial)}
                        className="inline-flex size-9 items-center justify-center border border-slate-200 text-slate-900 hover:bg-violet-800 hover:text-white"
                        aria-label={`Supprimer le témoignage de ${testimonial.authorName}`}
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
        title="Ajouter un témoignage"
        onClose={() => setCreating(false)}
      >
        <TestimonialForm
          key="create"
          action={notifyAdminAction(createTestimonial, "Témoignage créé.", () =>
            setCreating(false),
          )}
          submitLabel="Créer le témoignage"
        />
      </AdminDrawer>

      <AdminDrawer
        isOpen={Boolean(selected)}
        title="Éditer le témoignage"
        onClose={() => setSelected(null)}
      >
        {selected ? (
          <TestimonialForm
            key={selected.id}
            testimonial={selected}
            action={notifyAdminAction(
              (formData) => updateTestimonial(selected.id, formData),
              "Témoignage mis à jour.",
              () => setSelected(null),
            )}
            submitLabel="Enregistrer les modifications"
          />
        ) : null}
      </AdminDrawer>

      <AdminConfirmDialog
        isOpen={Boolean(pendingDelete)}
        title="Supprimer le témoignage"
        message={`Le témoignage de « ${pendingDelete?.authorName ?? ""} » sera définitivement retiré.`}
        onClose={() => setPendingDelete(null)}
        onConfirm={async () => {
          if (!pendingDelete) {
            return;
          }
          await notifyAdminConfirm(
            () => deleteTestimonial(pendingDelete.id),
            "Témoignage supprimé.",
          );
          setPendingDelete(null);
        }}
      />
    </>
  );
}
