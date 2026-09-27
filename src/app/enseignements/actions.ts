"use server";

import { revalidatePath, revalidateTag } from "next/cache";
import { prisma } from "@/lib/prisma";
import { PUBLIC_ARTICLES_CACHE_TAG } from "@/lib/publicContent";
import type { PublicArticleComment } from "@/types";

interface AddCommentInput {
  articleId: string;
  authorName: string;
  authorEmail?: string;
  content: string;
}

export async function addComment(
  input: AddCommentInput,
): Promise<{ ok: true; comment: PublicArticleComment } | { ok: false; error: string }> {
  const articleId = input.articleId.trim();
  const authorName = input.authorName.trim();
  const authorEmail = input.authorEmail?.trim() || null;
  const content = input.content.trim();

  if (!articleId || !authorName || !content) {
    return { ok: false, error: "Le nom et le message sont obligatoires." };
  }

  if (authorName.length > 80) {
    return { ok: false, error: "Le nom est trop long." };
  }

  if (content.length > 2000) {
    return { ok: false, error: "Le message est trop long." };
  }

  if (authorEmail && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(authorEmail)) {
    return { ok: false, error: "L’adresse e-mail n’est pas valide." };
  }

  try {
    const article = await prisma.article.findFirst({
      where: { id: articleId, isPublished: true },
      select: { slug: true },
    });

    if (!article) {
      return { ok: false, error: "Enseignement introuvable." };
    }

    const comment = await prisma.comment.create({
      data: {
        articleId,
        authorName,
        authorEmail,
        content,
      },
      select: {
        id: true,
        authorName: true,
        content: true,
        likesCount: true,
        createdAt: true,
      },
    });

    revalidateTag(PUBLIC_ARTICLES_CACHE_TAG, "max");
    revalidatePath("/enseignements");
    revalidatePath(`/enseignements/${article.slug}`);

    return {
      ok: true,
      comment: {
        id: comment.id,
        authorName: comment.authorName,
        content: comment.content,
        likesCount: comment.likesCount ?? 0,
        createdAt: comment.createdAt.toISOString(),
      },
    };
  } catch {
    return { ok: false, error: "Impossible d’enregistrer ce commentaire." };
  }
}

export async function likeComment(
  commentId: string,
): Promise<{ ok: true; likesCount: number } | { ok: false; error: string }> {
  const id = commentId.trim();
  if (!id) {
    return { ok: false, error: "Identifiant de commentaire manquant." };
  }

  try {
    const comment = await prisma.comment.update({
      where: { id },
      data: { likesCount: { increment: 1 } },
      include: { article: { select: { slug: true } } },
    });

    revalidateTag(PUBLIC_ARTICLES_CACHE_TAG, "max");
    if (comment.article?.slug) {
      revalidatePath(`/enseignements/${comment.article.slug}`);
    }

    return { ok: true, likesCount: comment.likesCount };
  } catch {
    return { ok: false, error: "Impossible d’enregistrer ce like." };
  }
}
