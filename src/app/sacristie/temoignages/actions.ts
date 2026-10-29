"use server";

// ⚠️ RAPPEL : le modèle `Testimonial` vient d'être ajouté à prisma/schema.prisma.
//    Exécutez `npx prisma db push` (puis relancez `next dev`) pour créer la table.

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { requireRecordId, revalidateTestimonialContent, runPrismaWrite } from "@/lib/adminActionUtils";
import { logAction } from "@/lib/audit";
import { requireRole } from "@/lib/auth";
import { CONTENT_ROLES } from "@/lib/roles";
import {
  deleteSupabaseFile,
  isUploadFailure,
  uploadSupabaseFile,
} from "@/lib/storage/supabaseUpload";
import type { AdminTestimonialRecord } from "@/types";

const MAX_AUTHOR_LENGTH = 120;
const MAX_CONTENT_LENGTH = 5000;

function readString(formData: FormData, key: string) {
  return String(formData.get(key) ?? "").trim();
}

function readCheckbox(formData: FormData, key: string) {
  const value = formData.get(key);
  return value === "on" || value === "true";
}

async function optionalUploadedUrl(formData: FormData, field: string) {
  const file = formData.get(field);
  if (file instanceof File && file.size > 0) {
    const uploaded = await uploadSupabaseFile(file);
    if (!uploaded.success) {
      return { success: false as const, error: uploaded.error };
    }
    return uploaded.url;
  }
  return null;
}

const testimonialSchema = z.object({
  authorName: z
    .string()
    .trim()
    .min(1, "Le nom et le témoignage sont obligatoires.")
    .max(MAX_AUTHOR_LENGTH, "Le nom est trop long."),
  authorEn: z.string().trim().max(MAX_AUTHOR_LENGTH, "Le nom anglais est trop long.").optional(),
  content: z
    .string()
    .trim()
    .min(1, "Le nom et le témoignage sont obligatoires.")
    .max(MAX_CONTENT_LENGTH, "Le témoignage est trop long."),
  contentEn: z
    .string()
    .trim()
    .max(MAX_CONTENT_LENGTH, "Le témoignage anglais est trop long.")
    .optional(),
});

function parseTestimonialFields(formData: FormData) {
  const parsed = testimonialSchema.safeParse({
    authorName: readString(formData, "authorName"),
    authorEn: readString(formData, "authorEn"),
    content: readString(formData, "content"),
    contentEn: readString(formData, "contentEn"),
  });
  if (!parsed.success) {
    throw new Error(parsed.error.issues[0]?.message ?? "Témoignage invalide.");
  }
  return {
    authorName: parsed.data.authorName,
    authorEn: parsed.data.authorEn || null,
    content: parsed.data.content,
    contentEn: parsed.data.contentEn || null,
  };
}

function serializeTestimonial(testimonial: {
  id: string;
  authorName: string;
  authorEn: string | null;
  content: string;
  contentEn: string | null;
  imagePath: string | null;
  contactInfo: string | null;
  isPublished: boolean;
  createdAt: Date;
}): AdminTestimonialRecord {
  return {
    id: testimonial.id,
    authorName: testimonial.authorName,
    authorEn: testimonial.authorEn,
    content: testimonial.content,
    contentEn: testimonial.contentEn,
    imagePath: testimonial.imagePath,
    contactInfo: testimonial.contactInfo,
    isPublished: testimonial.isPublished,
    createdAt: testimonial.createdAt.toISOString(),
  };
}

export async function getTestimonials(): Promise<AdminTestimonialRecord[]> {
  await requireRole(CONTENT_ROLES);
  const testimonials = await prisma.testimonial.findMany({
    orderBy: { createdAt: "desc" },
  });
  return testimonials.map(serializeTestimonial);
}

export async function createTestimonial(formData: FormData) {
  const actor = await requireRole(CONTENT_ROLES);
  const fields = parseTestimonialFields(formData);

  const uploaded = await optionalUploadedUrl(formData, "imageFile");
  if (isUploadFailure(uploaded)) {
    return uploaded;
  }

  const testimonial = await prisma.testimonial.create({
    data: {
      authorName: fields.authorName,
      authorEn: fields.authorEn,
      content: fields.content,
      contentEn: fields.contentEn,
      imagePath: uploaded || readString(formData, "imagePath") || null,
      contactInfo: readString(formData, "contactInfo") || null,
      isPublished: readCheckbox(formData, "isPublished"),
    },
  });

  revalidatePath("/sacristie", "layout");
  revalidateTestimonialContent();
  await logAction({
    userId: actor.id,
    action: "CRÉATION",
    entity: "Témoignage",
    entityName: testimonial.authorName,
  });
  return serializeTestimonial(testimonial);
}

export async function updateTestimonial(id: string, formData: FormData) {
  const actor = await requireRole(CONTENT_ROLES);
  const testimonialId = requireRecordId(id);

  const current = await prisma.testimonial.findUnique({ where: { id: testimonialId } });
  if (!current) {
    throw new Error("Témoignage introuvable.");
  }

  const fields = parseTestimonialFields(formData);

  const uploaded = await optionalUploadedUrl(formData, "imageFile");
  if (isUploadFailure(uploaded)) {
    return uploaded;
  }
  const nextImage = uploaded || readString(formData, "imagePath") || null;

  if (current.imagePath && current.imagePath !== nextImage) {
    await deleteSupabaseFile(current.imagePath);
  }

  const testimonial = await runPrismaWrite(
    () =>
      prisma.testimonial.update({
        where: { id: testimonialId },
        data: {
          authorName: fields.authorName,
          authorEn: fields.authorEn,
          content: fields.content,
          contentEn: fields.contentEn,
          imagePath: nextImage,
          contactInfo: readString(formData, "contactInfo") || null,
          isPublished: readCheckbox(formData, "isPublished"),
        },
      }),
    "Témoignage introuvable.",
  );

  revalidatePath("/sacristie", "layout");
  revalidateTestimonialContent();
  await logAction({
    userId: actor.id,
    action: "MODIFICATION",
    entity: "Témoignage",
    entityName: testimonial.authorName,
  });
  return serializeTestimonial(testimonial);
}

export async function deleteTestimonial(id: string) {
  const actor = await requireRole(CONTENT_ROLES);
  const testimonialId = requireRecordId(id);

  const current = await prisma.testimonial.findUnique({ where: { id: testimonialId } });
  if (current?.imagePath) {
    await deleteSupabaseFile(current.imagePath);
  }

  await prisma.testimonial.deleteMany({ where: { id: testimonialId } });
  if (current) {
    await logAction({
      userId: actor.id,
      action: "SUPPRESSION",
      entity: "Témoignage",
      entityName: current.authorName,
    });
  }
  revalidatePath("/sacristie", "layout");
  revalidateTestimonialContent();
}

export async function togglePublishTestimonial(id: string) {
  const actor = await requireRole(CONTENT_ROLES);
  const testimonialId = requireRecordId(id);

  const current = await prisma.testimonial.findUnique({
    where: { id: testimonialId },
    select: { isPublished: true, authorName: true },
  });
  if (!current) {
    throw new Error("Témoignage introuvable.");
  }

  const testimonial = await runPrismaWrite(
    () =>
      prisma.testimonial.update({
        where: { id: testimonialId },
        data: { isPublished: !current.isPublished },
      }),
    "Témoignage introuvable.",
  );

  revalidatePath("/sacristie", "layout");
  revalidateTestimonialContent();
  await logAction({
    userId: actor.id,
    action: "MODIFICATION",
    entity: "Témoignage",
    entityName: current.authorName,
  });
  return serializeTestimonial(testimonial);
}
