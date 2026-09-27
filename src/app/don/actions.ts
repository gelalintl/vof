"use server";

import { prisma } from "@/lib/prisma";
import { revalidateDonationContent } from "@/lib/adminActionUtils";
import {
  isDonationPaymentMethod,
  isDonationPromiseType,
} from "@/lib/donations";
import type { SubmitDonationPromiseInput } from "@/types";

export type SubmitDonationResult =
  | { success: true; id: string }
  | { success: false; error: string };

export async function submitDonationPromise(
  data: SubmitDonationPromiseInput,
): Promise<SubmitDonationResult> {
  try {
    const amount = Number(data.amount);
    if (!Number.isFinite(amount) || amount <= 0) {
      return { success: false, error: "Le montant du don doit être supérieur à 0 FCFA." };
    }

    const donorPhone = data.donorPhone?.trim() ?? "";
    if (donorPhone.replace(/\s/g, "").length < 8) {
      return {
        success: false,
        error: "Le téléphone / WhatsApp est requis pour le suivi du don.",
      };
    }

    const paymentMethod = String(data.paymentMethod ?? "").trim().toUpperCase();
    if (!isDonationPaymentMethod(paymentMethod)) {
      return { success: false, error: "Moyen de paiement invalide." };
    }

    const type = String(data.type ?? "PROJET").trim().toUpperCase();
    if (!isDonationPromiseType(type)) {
      return { success: false, error: "Type de don invalide." };
    }

    const projectId = data.projectId?.trim() || null;
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

    const donation = await prisma.donationPromise.create({
      data: {
        donorName: data.donorName?.trim() || null,
        donorPhone,
        donorEmail: data.donorEmail?.trim() || null,
        type: projectId ? "PROJET" : type,
        amount,
        paymentMethod,
        notes: data.notes?.trim() || null,
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
