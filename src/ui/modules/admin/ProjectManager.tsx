"use client";

import { useState } from "react";
import { Plus, Pencil, Trash2 } from "lucide-react";
import { createProject, deleteProject, updateProject } from "@/app/admin/actions";
import type { AdminProjectRecord } from "@/types";
import { projectStatusLabels } from "@/lib/donations";
import { formatFcfa } from "@/utils/formatters/currency";
import { AdminConfirmDialog, AdminDrawer } from "./AdminDrawer";
import { AdminEmptyState } from "./AdminPageHeader";
import { AdminThumb } from "./AdminThumb";
import { ProjectForm } from "./ProjectForm";
import { ProjectProgress } from "@/ui/modules/projets/ProjectProgress";
import { adminPrimaryButtonClass } from "./adminStyles";
import { notifyAdminAction, notifyAdminConfirm } from "./notifyAdminAction";

interface ProjectManagerProps {
  projects: AdminProjectRecord[];
}

export function ProjectManager({ projects }: ProjectManagerProps) {
  const [creating, setCreating] = useState(false);
  const [selected, setSelected] = useState<AdminProjectRecord | null>(null);
  const [pendingDelete, setPendingDelete] = useState<AdminProjectRecord | null>(null);

  return (
    <>
      <div className="mb-6 flex justify-end">
        <button type="button" className={adminPrimaryButtonClass} onClick={() => setCreating(true)}>
          <Plus className="mr-2 size-4" aria-hidden />
          Ajouter un projet
        </button>
      </div>

      {projects.length === 0 ? (
        <AdminEmptyState>Aucun projet enregistré pour le moment.</AdminEmptyState>
      ) : (
        <div className="grid gap-4 lg:grid-cols-2">
          {projects.map((project) => (
            <article key={project.id} className="border border-slate-200 bg-white p-4">
              <div className="flex items-start gap-3">
                <AdminThumb src={project.image} alt={project.title} className="size-16" />
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <h3 className="font-heading font-bold text-slate-900">{project.title}</h3>
                    {project.isFeatured ? (
                      <span className="rounded-full bg-amber-50 px-2 py-0.5 font-heading text-[10px] font-bold uppercase tracking-widest text-[#f59e0b]">
                        À la une
                      </span>
                    ) : null}
                  </div>
                  <p className="font-mono text-xs text-slate-500">{project.slug}</p>
                  <p className="mt-1 font-sans text-xs text-slate-600">
                    {project.category || "Sans catégorie"} · {projectStatusLabels[project.status]}
                  </p>
                </div>
                <div className="flex shrink-0 gap-1.5">
                  <button
                    type="button"
                    onClick={() => setSelected(project)}
                    className="inline-flex size-9 items-center justify-center border border-slate-200 text-slate-900 hover:bg-[#6d28d9] hover:text-white"
                    aria-label={`Éditer ${project.title}`}
                  >
                    <Pencil className="size-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => setPendingDelete(project)}
                    className="inline-flex size-9 items-center justify-center border border-slate-200 text-slate-900 hover:bg-violet-800 hover:text-white"
                    aria-label={`Supprimer ${project.title}`}
                  >
                    <Trash2 className="size-4" />
                  </button>
                </div>
              </div>
              <div className="mt-4">
                <ProjectProgress
                  currentAmount={project.currentAmount}
                  targetAmount={project.targetAmount}
                  progress={project.progress}
                  compact
                />
                <p className="mt-1 font-sans text-xs text-slate-500">
                  Objectif {formatFcfa(project.targetAmount)}
                </p>
              </div>
            </article>
          ))}
        </div>
      )}

      <AdminDrawer isOpen={creating} title="Ajouter un projet" onClose={() => setCreating(false)}>
        <ProjectForm
          key="create"
          action={notifyAdminAction(createProject, "Projet créé.", () => setCreating(false))}
          submitLabel="Créer le projet"
        />
      </AdminDrawer>

      <AdminDrawer
        isOpen={Boolean(selected)}
        title="Éditer le projet"
        onClose={() => setSelected(null)}
      >
        {selected ? (
          <ProjectForm
            key={selected.id}
            project={selected}
            action={notifyAdminAction(
              (formData) => updateProject(selected.id, formData),
              "Projet mis à jour.",
              () => setSelected(null),
            )}
            submitLabel="Enregistrer les modifications"
          />
        ) : null}
      </AdminDrawer>

      <AdminConfirmDialog
        isOpen={Boolean(pendingDelete)}
        title="Supprimer le projet"
        message={`« ${pendingDelete?.title ?? ""} » sera définitivement retiré.`}
        onClose={() => setPendingDelete(null)}
        onConfirm={async () => {
          if (!pendingDelete) {
            return;
          }
          await notifyAdminConfirm(() => deleteProject(pendingDelete.id), "Projet supprimé.");
          setPendingDelete(null);
        }}
      />
    </>
  );
}
