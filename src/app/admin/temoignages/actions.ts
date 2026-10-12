"use server";

// ⚠️ RAPPEL : le modèle `Testimonial` vient d'être ajouté à prisma/schema.prisma.
//    Exécutez `npx prisma db push` (puis relancez `next dev`) pour créer la table.

import { prisma } from "@/lib/prisma";
import {
  requireRecordId,
  revalidateTestimonialContent,
  runPrismaWrite,
} from "@/lib/adminActionUtils";
import { requireAdmin } from "@/lib/auth";
import { deleteLocalFile, uploadLocalFile } from "@/lib/storage/localUpload";
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
    return uploadLocalFile(file);
  }
  return null;
}

function validateTestimonialFields(authorName: string, content: string) {
  if (!authorName || !content) {
    throw new Error("Le nom et le témoignage sont obligatoires.");
  }
  if (authorName.length > MAX_AUTHOR_LENGTH) {
    throw new Error("Le nom est trop long.");
  }
  if (content.length > MAX_CONTENT_LENGTH) {
    throw new Error("Le témoignage est trop long.");
  }
}

function serializeTestimonial(testimonial: {
  id: string;
  authorName: string;
  content: string;
  imagePath: string | null;
  contactInfo: string | null;
  isPublished: boolean;
  createdAt: Date;
}): AdminTestimonialRecord {
  return {
    id: testimonial.id,
    authorName: testimonial.authorName,
    content: testimonial.content,
    imagePath: testimonial.imagePath,
    contactInfo: testimonial.contactInfo,
    isPublished: testimonial.isPublished,
    createdAt: testimonial.createdAt.toISOString(),
  };
}

export async function getTestimonials(): Promise<AdminTestimonialRecord[]> {
  await requireAdmin();
  const testimonials = await prisma.testimonial.findMany({
    orderBy: { createdAt: "desc" },
  });
  return testimonials.map(serializeTestimonial);
}

export async function createTestimonial(formData: FormData) {
  await requireAdmin();
  const authorName = readString(formData, "authorName");
  const content = readString(formData, "content");
  validateTestimonialFields(authorName, content);

  const uploaded = await optionalUploadedUrl(formData, "imageFile");

  const testimonial = await prisma.testimonial.create({
    data: {
      authorName,
      content,
      imagePath: uploaded || readString(formData, "imagePath") || null,
      contactInfo: readString(formData, "contactInfo") || null,
      isPublished: readCheckbox(formData, "isPublished"),
    },
  });

  revalidateTestimonialContent();
  return serializeTestimonial(testimonial);
}

export async function updateTestimonial(id: string, formData: FormData) {
  await requireAdmin();
  const testimonialId = requireRecordId(id);

  const current = await prisma.testimonial.findUnique({ where: { id: testimonialId } });
  if (!current) {
    throw new Error("Témoignage introuvable.");
  }

  const authorName = readString(formData, "authorName");
  const content = readString(formData, "content");
  validateTestimonialFields(authorName, content);

  const uploaded = await optionalUploadedUrl(formData, "imageFile");
  const nextImage = uploaded || readString(formData, "imagePath") || null;

  if (current.imagePath && current.imagePath !== nextImage) {
    await deleteLocalFile(current.imagePath);
  }

  const testimonial = await runPrismaWrite(
    () =>
      prisma.testimonial.update({
        where: { id: testimonialId },
        data: {
          authorName,
          content,
          imagePath: nextImage,
          contactInfo: readString(formData, "contactInfo") || null,
          isPublished: readCheckbox(formData, "isPublished"),
        },
      }),
    "Témoignage introuvable.",
  );

  revalidateTestimonialContent();
  return serializeTestimonial(testimonial);
}

export async function deleteTestimonial(id: string) {
  await requireAdmin();
  const testimonialId = requireRecordId(id);

  const current = await prisma.testimonial.findUnique({ where: { id: testimonialId } });
  if (current?.imagePath) {
    await deleteLocalFile(current.imagePath);
  }

  await prisma.testimonial.deleteMany({ where: { id: testimonialId } });
  revalidateTestimonialContent();
}

export async function togglePublishTestimonial(id: string) {
  await requireAdmin();
  const testimonialId = requireRecordId(id);

  const current = await prisma.testimonial.findUnique({
    where: { id: testimonialId },
    select: { isPublished: true },
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

  revalidateTestimonialContent();
  return serializeTestimonial(testimonial);
}
