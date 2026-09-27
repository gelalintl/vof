"use client";

import { useState } from "react";
import {
  createArticleFromForm,
  deleteArticle,
  updateArticleFromForm,
} from "@/app/admin/actions";
import type { AdminArticleRecord } from "@/types";
import { formatAdminDateTime } from "@/utils/date/format";
import { AdminActionBar } from "./AdminActionBar";
import { AdminBadge } from "./AdminBadge";
import { AdminConfirmDialog, AdminDrawer } from "./AdminDrawer";
import { AdminEmptyState, AdminLabel, AdminPanel } from "./AdminPageHeader";
import { AdminThumb } from "./AdminThumb";
import { ArticleForm } from "./ArticleForm";
import { notifyAdminAction, notifyAdminConfirm } from "./notifyAdminAction";

interface ArticleManagerProps {
  articles: AdminArticleRecord[];
}

type DrawerMode = "view" | "edit" | null;

export function ArticleManager({ articles }: ArticleManagerProps) {
  const [selected, setSelected] = useState<AdminArticleRecord | null>(null);
  const [mode, setMode] = useState<DrawerMode>(null);
  const [pendingDelete, setPendingDelete] = useState<AdminArticleRecord | null>(null);

  const close = () => {
    setSelected(null);
    setMode(null);
  };

  return (
    <>
      {articles.length === 0 ? (
        <AdminEmptyState>Aucun enseignement publié pour le moment.</AdminEmptyState>
      ) : (
        <div className="overflow-x-auto border border-slate-200 bg-white">
          <table className="min-w-full text-left text-sm">
            <thead className="border-b border-slate-100 bg-slate-50 font-heading text-[11px] font-bold uppercase tracking-[0.16em] text-slate-900">
              <tr>
                <th className="px-4 py-3">Enseignement</th>
                <th className="px-4 py-3">Auteur</th>
                <th className="px-4 py-3">Statut</th>
                <th className="px-4 py-3">Date</th>
                <th className="px-4 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {articles.map((article) => (
                <tr key={article.id} className="border-b border-slate-100 last:border-0">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <AdminThumb src={article.coverImage} alt={article.title} />
                      <div>
                        <p className="font-heading font-bold text-slate-900">{article.title}</p>
                        <p className="font-mono text-xs text-slate-500">{article.slug}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-slate-600">{article.author}</td>
                  <td className="px-4 py-3">
                    <div className="flex flex-wrap gap-1">
                      <AdminBadge
                        className={
                          article.isPublished
                            ? "border-amber-200 bg-amber-50 text-amber-800"
                            : "border-slate-200 bg-white text-slate-900"
                        }
                      >
                        {article.isPublished ? "Publié" : "Brouillon"}
                      </AdminBadge>
                      {article.isFeatured ? (
                        <AdminBadge className="border-[#6d28d9]/20 bg-[#6d28d9]/10 text-[#6d28d9]">
                          Phare
                        </AdminBadge>
                      ) : null}
                    </div>
                  </td>
                  <td className="px-4 py-3 text-slate-600">
                    {formatAdminDateTime(article.createdAt)}
                  </td>
                  <td className="px-4 py-3">
                    <AdminActionBar
                      className="justify-end"
                      onView={() => {
                        setSelected(article);
                        setMode("view");
                      }}
                      onEdit={() => {
                        setSelected(article);
                        setMode("edit");
                      }}
                      onDelete={() => setPendingDelete(article)}
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <AdminDrawer
        isOpen={Boolean(selected) && mode === "view"}
        title={selected?.title ?? "Enseignement"}
        onClose={close}
      >
        {selected ? (
          <div className="space-y-5">
            {selected.coverImage ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={selected.coverImage}
                alt={selected.title}
                className="w-full border border-slate-200 object-cover"
              />
            ) : null}
            <Detail label="Auteur" value={selected.author} />
            <Detail label="Slug" value={selected.slug} />
            <Detail label="Statut" value={selected.isPublished ? "Publié" : "Brouillon"} />
            <Detail label="Créé le" value={formatAdminDateTime(selected.createdAt)} />
            {selected.galleryImages.length > 0 ? (
              <div>
                <AdminLabel>Galerie</AdminLabel>
                <div className="mt-2 grid grid-cols-3 gap-2">
                  {selected.galleryImages.map((src) => (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      key={src}
                      src={src}
                      alt=""
                      className="aspect-square w-full border border-slate-200 object-cover"
                    />
                  ))}
                </div>
              </div>
            ) : null}
            <div>
              <AdminLabel>Contenu</AdminLabel>
              <p className="mt-2 whitespace-pre-wrap text-sm leading-relaxed text-slate-800">
                {selected.content}
              </p>
            </div>
          </div>
        ) : null}
      </AdminDrawer>

      <AdminDrawer
        isOpen={Boolean(selected) && mode === "edit"}
        title="Éditer l’enseignement"
        onClose={close}
      >
        {selected ? (
          <ArticleForm
            key={selected.id}
            article={selected}
            action={notifyAdminAction(updateArticleFromForm, "Enseignement mis à jour.", close)}
            submitLabel="Enregistrer les modifications"
          />
        ) : null}
      </AdminDrawer>

      <AdminConfirmDialog
        isOpen={Boolean(pendingDelete)}
        title="Supprimer l’enseignement"
        message={`« ${pendingDelete?.title ?? ""} » sera définitivement retiré.`}
        onClose={() => setPendingDelete(null)}
        onConfirm={async () => {
          if (!pendingDelete) {
            return;
          }
          const formData = new FormData();
          formData.set("id", pendingDelete.id);
          await notifyAdminConfirm(() => deleteArticle(formData), "Enseignement supprimé.");
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
      <p className="mt-1 text-sm text-slate-800">{value}</p>
    </div>
  );
}

export function ArticleCreatePanel() {
  return (
    <AdminPanel>
      <h2 className="mb-4 font-heading text-lg font-bold text-slate-900">Nouvel enseignement</h2>
      <ArticleForm
        action={notifyAdminAction(createArticleFromForm, "Enseignement créé.")}
        submitLabel="Créer l’article"
      />
    </AdminPanel>
  );
}
