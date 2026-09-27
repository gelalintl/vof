"use client";

import { useEffect, useState, useTransition, type FormEvent } from "react";
import { Star } from "lucide-react";
import { toast } from "sonner";
import { addComment, likeComment } from "@/app/enseignements/actions";
import type { PublicArticleComment } from "@/types";
import { formatPublicationDate } from "@/utils/date/format";
import { Button } from "@/ui/design-system/button";
import { Typography } from "@/ui/design-system/typography";
import { cn } from "@/utils/cn";

const LIKED_STORAGE_KEY = "vof-enseignement-comment-likes";

function readLikedIds() {
  try {
    const raw = window.localStorage.getItem(LIKED_STORAGE_KEY);
    const parsed = raw ? JSON.parse(raw) : [];
    return Array.isArray(parsed)
      ? parsed.filter((value): value is string => typeof value === "string")
      : [];
  } catch {
    return [];
  }
}

function persistLikedIds(ids: string[]) {
  try {
    window.localStorage.setItem(LIKED_STORAGE_KEY, JSON.stringify(ids));
  } catch {
    return;
  }
}

interface CommentsSectionProps {
  articleId: string;
  initialComments?: PublicArticleComment[];
}

export function CommentsSection({
  articleId,
  initialComments = [],
}: CommentsSectionProps) {
  const [comments, setComments] = useState(initialComments);
  const [authorName, setAuthorName] = useState("");
  const [authorEmail, setAuthorEmail] = useState("");
  const [content, setContent] = useState("");
  const [likedIds, setLikedIds] = useState<string[]>([]);
  const [isSubmitting, startTransition] = useTransition();
  const [pendingLikeId, setPendingLikeId] = useState<string | null>(null);

  useEffect(() => {
    setLikedIds(readLikedIds());
  }, []);

  const countLabel =
    comments.length === 0
      ? "Aucun commentaire"
      : comments.length === 1
        ? "1 commentaire"
        : `${comments.length} commentaires`;

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    startTransition(async () => {
      const result = await addComment({
        articleId,
        authorName,
        authorEmail,
        content,
      });

      if (!result.ok) {
        toast.error(result.error);
        return;
      }

      setComments((current) => [...current, result.comment]);
      setAuthorName("");
      setAuthorEmail("");
      setContent("");
      toast.success("Merci ! Votre commentaire a été publié.");
    });
  }

  function handleLike(commentId: string) {
    if (likedIds.includes(commentId) || pendingLikeId === commentId) {
      return;
    }

    const previous = comments;
    setPendingLikeId(commentId);
    setLikedIds((current) => {
      const next = [...current, commentId];
      persistLikedIds(next);
      return next;
    });
    setComments((current) =>
      current.map((comment) =>
        comment.id === commentId
          ? { ...comment, likesCount: comment.likesCount + 1 }
          : comment,
      ),
    );

    startTransition(async () => {
      const result = await likeComment(commentId);
      setPendingLikeId(null);
      if (!result.ok) {
        setComments(previous);
        setLikedIds((current) => {
          const next = current.filter((id) => id !== commentId);
          persistLikedIds(next);
          return next;
        });
        toast.error(result.error);
        return;
      }
      setComments((current) =>
        current.map((comment) =>
          comment.id === commentId ? { ...comment, likesCount: result.likesCount } : comment,
        ),
      );
    });
  }

  return (
    <section className="mt-10 border-t border-slate-200 pt-8" aria-labelledby="commentaires-enseignement">
      <Typography id="commentaires-enseignement" variant="h3" className="text-slate-900">
        Commentaires
      </Typography>
      <p className="mt-1 font-sans text-sm text-slate-600">{countLabel}</p>

      <ul className="mt-6 space-y-3">
        {comments.length === 0 ? (
          <li className="rounded-xl border border-slate-100 bg-slate-50 p-4 font-sans text-sm text-slate-600">
            Soyez le premier à laisser un commentaire.
          </li>
        ) : (
          comments.map((comment) => (
            <li
              key={comment.id}
              className="rounded-xl border border-slate-100 bg-slate-50 p-4"
            >
              <p className="font-heading text-sm font-bold text-[#6d28d9]">
                {comment.authorName}
              </p>
              <p className="mt-0.5 font-sans text-xs text-slate-500">
                {formatPublicationDate(comment.createdAt)}
              </p>
              <p className="mt-2 font-sans text-sm leading-relaxed text-slate-800">
                {comment.content}
              </p>
              <button
                type="button"
                onClick={() => handleLike(comment.id)}
                disabled={likedIds.includes(comment.id) || pendingLikeId === comment.id}
                aria-pressed={likedIds.includes(comment.id)}
                aria-label="Aimer ce commentaire"
                className={cn(
                  "mt-3 inline-flex items-center gap-1.5 font-sans text-xs transition-transform hover:scale-110",
                  likedIds.includes(comment.id)
                    ? "cursor-pointer text-amber-500"
                    : "cursor-pointer text-slate-400 hover:text-amber-500",
                )}
              >
                <Star
                  className={cn(
                    "size-4",
                    likedIds.includes(comment.id) && "fill-amber-400 text-amber-500",
                  )}
                  aria-hidden
                />
                <span>{comment.likesCount}</span>
              </button>
            </li>
          ))
        )}
      </ul>

      <form onSubmit={handleSubmit} className="mt-8 space-y-4">
        <Typography variant="h4" className="text-slate-900">
          Laisser un commentaire
        </Typography>
        <label className="block">
          <span className="mb-1.5 block font-heading text-xs font-bold uppercase tracking-wide text-slate-600">
            Nom complet
          </span>
          <input
            name="authorName"
            required
            value={authorName}
            onChange={(change) => setAuthorName(change.target.value)}
            className="w-full border border-slate-200 bg-white px-3 py-2.5 font-sans text-sm text-slate-800 outline-none focus:border-[#6d28d9]"
          />
        </label>
        <label className="block">
          <span className="mb-1.5 block font-heading text-xs font-bold uppercase tracking-wide text-slate-600">
            E-mail <span className="font-normal normal-case tracking-normal">(optionnel)</span>
          </span>
          <input
            name="authorEmail"
            type="email"
            value={authorEmail}
            onChange={(change) => setAuthorEmail(change.target.value)}
            className="w-full border border-slate-200 bg-white px-3 py-2.5 font-sans text-sm text-slate-800 outline-none focus:border-[#6d28d9]"
          />
        </label>
        <label className="block">
          <span className="mb-1.5 block font-heading text-xs font-bold uppercase tracking-wide text-slate-600">
            Message
          </span>
          <textarea
            name="content"
            required
            rows={4}
            value={content}
            onChange={(change) => setContent(change.target.value)}
            className="w-full border border-slate-200 bg-white px-3 py-2.5 font-sans text-sm text-slate-800 outline-none focus:border-[#6d28d9]"
          />
        </label>
        <Button type="submit" variant="primary" disabled={isSubmitting}>
          {isSubmitting ? "Envoi en cours…" : "Publier le commentaire"}
        </Button>
      </form>
    </section>
  );
}
