"use server";

import { revalidatePath, revalidateTag } from "next/cache";
import { isLocale, type Locale } from "@/i18n/config";
import { getDictionary } from "@/i18n/getDictionary";
import { getRequestLocale } from "@/i18n/localized";
import { revalidateEventContent, revalidatePublicPath } from "@/lib/adminActionUtils";
import { prisma } from "@/lib/prisma";
import { PUBLIC_ARTICLES_CACHE_TAG } from "@/lib/publicContent";

interface AddCommentInput {
  articleId?: string;
  eventId?: string;
  authorName: string;
  authorEmail?: string;
  content: string;
  locale?: string;
}

async function commentCopy(locale: string | undefined) {
  const resolved: Locale = isLocale(locale) ? locale : await getRequestLocale();
  return getDictionary(resolved).teachings;
}

export async function addComment(
  input: AddCommentInput,
): Promise<{ ok: true } | { ok: false; error: string }> {
  const articleId = input.articleId?.trim() ?? "";
  const eventId = input.eventId?.trim() ?? "";
  const authorName = input.authorName.trim();
  const authorEmail = input.authorEmail?.trim() || null;
  const content = input.content.trim();
  const copy = await commentCopy(input.locale);

  if ((articleId && eventId) || (!articleId && !eventId) || !authorName || !content) {
    return { ok: false, error: copy.errorRequired };
  }

  if (authorName.length > 80) {
    return { ok: false, error: copy.errorName };
  }

  if (content.length > 2000) {
    return { ok: false, error: copy.errorMessage };
  }

  if (authorEmail && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(authorEmail)) {
    return { ok: false, error: copy.errorEmail };
  }

  try {
    if (articleId) {
      const article = await prisma.article.findFirst({
        where: { id: articleId, isPublished: true },
        select: { slug: true },
      });
      if (!article) {
        return { ok: false, error: copy.errorTeaching };
      }
      await prisma.comment.create({
        data: { articleId, authorName, authorEmail, content },
      });
      revalidatePath("/sacristie", "layout");
      revalidateTag(PUBLIC_ARTICLES_CACHE_TAG, "max");
      revalidatePublicPath("/enseignements");
      revalidatePublicPath(`/enseignements/${article.slug}`);
      return { ok: true };
    }

    const event = await prisma.event.findFirst({
      where: { id: eventId },
      select: { id: true, slug: true },
    });
    if (!event) {
      return { ok: false, error: copy.errorEvent };
    }
    await prisma.comment.create({
      data: { eventId, authorName, authorEmail, content },
    });
    revalidatePath("/sacristie", "layout");
    revalidateEventContent(event.slug ?? event.id);
    return { ok: true };
  } catch {
    return { ok: false, error: copy.errorFailed };
  }
}

export async function likeComment(
  commentId: string,
  locale?: string,
): Promise<{ ok: true; likesCount: number } | { ok: false; error: string }> {
  const id = commentId.trim();
  const copy = await commentCopy(locale);
  if (!id) {
    return { ok: false, error: copy.errorLike };
  }

  try {
    const existing = await prisma.comment.findFirst({
      where: { id, isApproved: true },
      select: { id: true },
    });
    if (!existing) {
      return { ok: false, error: copy.errorLike };
    }

    const comment = await prisma.comment.update({
      where: { id },
      data: { likesCount: { increment: 1 } },
      include: {
        article: { select: { slug: true } },
        event: { select: { id: true, slug: true } },
      },
    });

    revalidatePath("/sacristie", "layout");
    revalidateTag(PUBLIC_ARTICLES_CACHE_TAG, "max");
    if (comment.article?.slug) {
      revalidatePublicPath(`/enseignements/${comment.article.slug}`);
    }
    if (comment.event) {
      revalidateEventContent(comment.event.slug ?? comment.event.id);
    }

    return { ok: true, likesCount: comment.likesCount };
  } catch {
    return { ok: false, error: copy.errorLike };
  }
}
