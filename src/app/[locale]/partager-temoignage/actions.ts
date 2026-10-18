"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";

export interface SubmitTestimonialInput {
  authorName: string;
  contactInfo: string;
  content: string;
  /** Champ piège anti-spam : doit rester vide. */
  website?: string;
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
 * puis modéré depuis /admin/temoignages.
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

  if (!authorName || !contactInfo || !content) {
    return { ok: false, error: "Tous les champs sont obligatoires." };
  }
  if (authorName.length > 120) {
    return { ok: false, error: "Le nom est trop long." };
  }
  if (!isValidContact(contactInfo)) {
    return {
      ok: false,
      error: "Indiquez une adresse e-mail ou un numéro de téléphone valide.",
    };
  }
  if (content.length < MIN_CONTENT_LENGTH) {
    return { ok: false, error: "Votre témoignage est un peu court. Dites-nous-en davantage." };
  }
  if (content.length > MAX_CONTENT_LENGTH) {
    return { ok: false, error: "Votre témoignage est trop long (5 000 caractères maximum)." };
  }

  try {
    await prisma.testimonial.create({
      data: { authorName, contactInfo, content, isPublished: false },
    });
    revalidatePath("/admin/temoignages");
    return { ok: true };
  } catch {
    return {
      ok: false,
      error: "Impossible d’envoyer votre témoignage pour le moment. Réessayez plus tard.",
    };
  }
}
