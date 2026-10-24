"use server";

import { getDictionary } from "@/i18n/getDictionary";
import { getRequestLocale } from "@/i18n/localized";
import { prisma } from "@/lib/prisma";
import { revalidateDonationContent } from "@/lib/adminActionUtils";
import {
  donationPromiseSchema,
  isMobileMoneyMethod,
  notesWithTransferPhone,
} from "@/lib/donationSchema";
import type { SubmitDonationPromiseInput } from "@/types";

export type SubmitDonationResult =
  | { success: true; id: string }
  | { success: false; error: string };

function compactPhone(value: string | undefined) {
  return (value ?? "").replace(/[\s().-]/g, "");
}

export async function submitDonationPromise(
  data: SubmitDonationPromiseInput,
): Promise<SubmitDonationResult> {
  try {
    const locale = await getRequestLocale();
    const phoneMessage = getDictionary(locale).donate.phoneInvalid;
    const parsed = donationPromiseSchema(phoneMessage).safeParse({
      donorName: data.donorName ?? "",
      donorPhone: compactPhone(data.donorPhone),
      donorEmail: data.donorEmail ?? "",
      type: String(data.type ?? "PROJET").trim().toUpperCase(),
      amount: Number(data.amount),
      paymentMethod: String(data.paymentMethod ?? "").trim().toUpperCase(),
      notes: data.notes ?? "",
      projectId: data.projectId?.trim() || null,
      transferPhone: compactPhone(data.transferPhone),
    });

    if (!parsed.success) {
      return {
        success: false,
        error: parsed.error.issues[0]?.message ?? "Promesse de don invalide.",
      };
    }

    const promise = parsed.data;
    const projectId = promise.projectId ?? null;
    if (projectId) {
      const project = await prisma.project.findUnique({
        where: { id: projectId },
        select: { id: true },
      });
      if (!project) {
        return { success: false, error: "Projet introuvable." };
      }
    }

    if (!prisma.donationPromise?.create) {
      return {
        success: false,
        error: "Le module de dons n’est pas initialisé. Relancez le serveur, puis réessayez.",
      };
    }

    const mobile = isMobileMoneyMethod(promise.paymentMethod);
    const donation = await prisma.donationPromise.create({
      data: {
        donorName: promise.donorName || null,
        donorPhone: promise.donorPhone,
        donorEmail: promise.donorEmail || null,
        type: projectId ? "PROJET" : promise.type,
        amount: promise.amount,
        paymentMethod: promise.paymentMethod,
        notes: notesWithTransferPhone(promise.notes, promise.transferPhone, mobile),
        projectId,
        status: "PENDING",
      },
    });

    try {
      revalidateDonationContent();
    } catch {
      // L’écriture a réussi : la revalidation ne doit pas masquer le succès.
    }

    return { success: true, id: donation.id };
  } catch (error) {
    const message =
      error instanceof Error && error.message
        ? error.message
        : "Impossible d’enregistrer la promesse de don.";
    return { success: false, error: message };
  }
}
