"use server";

import { revalidatePath } from "next/cache";
import { isLocale } from "@/i18n/config";
import { getDictionary } from "@/i18n/getDictionary";
import { getRequestLocale } from "@/i18n/localized";
import { prisma } from "@/lib/prisma";

export interface SubmitTestimonialInput {
  authorName: string;
  contactInfo: string;
  content: string;
  /** Champ piège anti-spam : doit rester vide. */
  website?: string;
  locale?: string;
}

export type SubmitTestimonialResult = { ok: true } | { ok: false; error: string };

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const MIN_CONTENT_LENGTH = 20;
const MAX_CONTENT_LENGTH = 5000;

function isValidContact(value: string) {
  if (value.includes("@")) {
    return EMAIL_PATTERN.test(value);
  }
  const digits = value.replace(/\D/g, "");
  return /^[\d\s+().-]+$/.test(value) && digits.length >= 8 && digits.length <= 15;
}

/**
 * Dépôt public d'un témoignage : enregistré masqué (isPublished = false),
 * puis modéré depuis /sacristie/temoignages.
 */
export async function submitTestimonial(
  input: SubmitTestimonialInput,
): Promise<SubmitTestimonialResult> {
  // Robot : on feint le succès sans rien enregistrer.
  if (input.website?.trim()) {
    return { ok: true };
  }

  const authorName = input.authorName.trim();
  const contactInfo = input.contactInfo.trim();
  const content = input.content.trim();
  const locale = isLocale(input.locale) ? input.locale : await getRequestLocale();
  const errors = getDictionary(locale).shareTestimony;

  if (!authorName || !contactInfo || !content) {
    return { ok: false, error: errors.errorRequired };
  }
  if (authorName.length > 120) {
    return { ok: false, error: errors.errorName };
  }
  if (!isValidContact(contactInfo)) {
    return { ok: false, error: errors.errorContact };
  }
  if (content.length < MIN_CONTENT_LENGTH) {
    return { ok: false, error: errors.errorShort };
  }
  if (content.length > MAX_CONTENT_LENGTH) {
    return { ok: false, error: errors.errorLong };
  }

  try {
    await prisma.testimonial.create({
      data: { authorName, contactInfo, content, isPublished: false },
    });
    revalidatePath("/sacristie", "layout");
    revalidatePath("/sacristie/temoignages");
    return { ok: true };
  } catch {
    return { ok: false, error: errors.errorFailed };
  }
}
