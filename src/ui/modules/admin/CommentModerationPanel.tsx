"use client";

import { useEffect, useMemo, useState } from "react";
import { Star } from "lucide-react";
import { toast } from "sonner";
import { deleteComment, toggleCommentApproval } from "@/app/admin/actions";
import type { AdminCommentRecord } from "@/types";
import { excerpt } from "@/ui/modules/enseignements/excerpt";
import { formatAdminDateTime } from "@/utils/date/format";
import { AdminBadge } from "./AdminBadge";
import { AdminConfirmDialog } from "./AdminDrawer";
import { AdminEmptyState } from "./AdminPageHeader";
import { notifyAdminConfirm } from "./notifyAdminAction";
import { adminFieldClass, adminGhostButtonClass, adminPrimaryButtonClass } from "./adminStyles";

type StatusFilter = "all" | "approved" | "pending";

interface CommentModerationPanelProps {
  comments: AdminCommentRecord[];
}

export function CommentModerationPanel({ comments }: CommentModerationPanelProps) {
  const [rows, setRows] = useState(comments);
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");
  const [articleFilter, setArticleFilter] = useState("all");
  const [pendingDelete, setPendingDelete] = useState<AdminCommentRecord | null>(null);

  useEffect(() => {
    setRows(comments);
  }, [comments]);

  const articles = useMemo(() => {
    const map = new Map<string, string>();
    for (const comment of rows) {
      if (comment.articleId && comment.articleTitle) {
        map.set(comment.articleId, comment.articleTitle);
      }
    }
    return [...map.entries()].sort((left, right) => left[1].localeCompare(right[1], "fr"));
  }, [rows]);

  const filtered = rows.filter((comment) => {
    if (statusFilter === "approved" && !comment.isApproved) {
      return false;
    }
    if (statusFilter === "pending" && comment.isApproved) {
      return false;
    }
    if (articleFilter !== "all" && comment.articleId !== articleFilter) {
      return false;
    }
    return true;
  });

  return (
    <>
      <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div className="flex flex-wrap gap-2">
          {(
            [
              ["all", "Tous"],
              ["approved", "Approuvés"],
              ["pending", "En attente"],
            ] as const
          ).map(([value, label]) => (
            <button
              key={value}
              type="button"
              onClick={() => setStatusFilter(value)}
              className={
                statusFilter === value ? adminPrimaryButtonClass : adminGhostButtonClass
              }
            >
              {label}
            </button>
          ))}
        </div>
        <label className="block min-w-56">
          <span className="mb-1.5 block font-heading text-xs font-bold uppercase tracking-wide text-slate-600">
            Enseignement
          </span>
          <select
            value={articleFilter}
            onChange={(change) => setArticleFilter(change.target.value)}
            className={adminFieldClass}
          >
            <option value="all">Tous les enseignements</option>
            {articles.map(([id, title]) => (
              <option key={id} value={id}>
                {title}
              </option>
            ))}
          </select>
        </label>
      </div>

      {filtered.length === 0 ? (
        <AdminEmptyState>Aucun commentaire pour ces filtres.</AdminEmptyState>
      ) : (
        <div className="overflow-x-auto border border-slate-200 bg-white">
          <table className="min-w-full text-left text-sm">
            <thead className="border-b border-slate-100 bg-slate-50 font-heading text-[11px] font-bold uppercase tracking-[0.16em] text-slate-900">
              <tr>
                <th className="px-4 py-3">Auteur</th>
                <th className="px-4 py-3">Enseignement</th>
                <th className="px-4 py-3">Message</th>
                <th className="px-4 py-3">Date</th>
                <th className="px-4 py-3">Étoiles</th>
                <th className="px-4 py-3">Statut</th>
                <th className="px-4 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((comment) => (
                <tr key={comment.id} className="border-b border-slate-100 last:border-0">
                  <td className="px-4 py-3">
                    <p className="font-heading font-bold text-slate-900">{comment.authorName}</p>
                    <p className="font-sans text-xs text-slate-500">
                      {comment.authorEmail || "—"}
                    </p>
                  </td>
                  <td className="px-4 py-3 text-slate-600">
                    {comment.articleTitle || "Enseignement retiré"}
                  </td>
                  <td className="max-w-xs px-4 py-3 text-slate-700">
                    {excerpt(comment.content, 90)}
                  </td>
                  <td className="px-4 py-3 text-slate-600">
                    {formatAdminDateTime(comment.createdAt)}
                  </td>
                  <td className="px-4 py-3">
                    <span className="inline-flex items-center gap-1 text-amber-500">
                      <Star className="size-3.5 fill-amber-400" aria-hidden />
                      {comment.likesCount}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <AdminBadge
                      className={
                        comment.isApproved
                          ? "border-amber-200 bg-amber-50 text-amber-800"
                          : "border-slate-200 bg-white text-slate-700"
                      }
                    >
                      {comment.isApproved ? "Approuvé" : "En attente"}
                    </AdminBadge>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex justify-end gap-2">
                      <button
                        type="button"
                        className={adminGhostButtonClass}
                        onClick={async () => {
                          const next = !comment.isApproved;
                          setRows((current) =>
                            current.map((row) =>
                              row.id === comment.id ? { ...row, isApproved: next } : row,
                            ),
                          );
                          try {
                            await toggleCommentApproval(comment.id, next);
                            toast.success(
                              next ? "Commentaire approuvé." : "Commentaire masqué.",
                            );
                          } catch (error) {
                            setRows((current) =>
                              current.map((row) =>
                                row.id === comment.id
                                  ? { ...row, isApproved: comment.isApproved }
                                  : row,
                              ),
                            );
                            toast.error(
                              error instanceof Error
                                ? error.message
                                : "Impossible de mettre à jour ce commentaire.",
                            );
                          }
                        }}
                      >
                        {comment.isApproved ? "Masquer" : "Approuver"}
                      </button>
                      <button
                        type="button"
                        className={adminGhostButtonClass}
                        onClick={() => setPendingDelete(comment)}
                      >
                        Supprimer
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
        title="Supprimer le commentaire"
        message={`Le message de « ${pendingDelete?.authorName ?? ""} » sera définitivement retiré.`}
        onClose={() => setPendingDelete(null)}
        onConfirm={async () => {
          if (!pendingDelete) {
            return;
          }
          await notifyAdminConfirm(
            () => deleteComment(pendingDelete.id),
            "Commentaire supprimé.",
          );
          setRows((current) => current.filter((row) => row.id !== pendingDelete.id));
          setPendingDelete(null);
        }}
      />
    </>
  );
}
