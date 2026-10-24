import { z } from "zod";
import { createE164PhoneSchema } from "@/lib/phoneSchema";

const MOBILE_MONEY_METHODS = ["AMANA", "MYNITA", "WAVE"] as const;

const donationTypes = ["DIME", "OFFRANDE", "PROJET", "ACTION_DE_GRACE", "VOEU"] as const;
const paymentMethods = ["AMANA", "MYNITA", "WAVE", "BANK", "CARD"] as const;

export function isMobileMoneyMethod(method: string) {
  return MOBILE_MONEY_METHODS.some((item) => item === method);
}

export function notesWithTransferPhone(notes: string, transferPhone: string, mobile: boolean) {
  const base = notes
    .split(" · ")
    .map((part) => part.trim())
    .filter((part) => part.length > 0 && !part.startsWith("Numéro de transfert"))
    .join(" · ");

  if (!mobile || !transferPhone) {
    return base || null;
  }

  return [base, `Numéro de transfert : ${transferPhone}`].filter(Boolean).join(" · ");
}

export function donationPromiseSchema(phoneMessage: string) {
  const phone = createE164PhoneSchema(phoneMessage);

  return z
    .object({
      donorName: z.string().trim().max(120).optional().default(""),
      donorPhone: phone,
      donorEmail: z.string().trim().max(200).optional().default(""),
      type: z.enum(donationTypes),
      amount: z
        .number()
        .finite()
        .positive("Le montant du don doit être supérieur à 0 FCFA."),
      paymentMethod: z.enum(paymentMethods),
      notes: z.string().trim().max(2000).optional().default(""),
      projectId: z.string().trim().min(1).nullable().optional(),
      transferPhone: z.string().trim().optional().default(""),
    })
    .superRefine((value, ctx) => {
      if (!isMobileMoneyMethod(value.paymentMethod)) {
        return;
      }
      const parsed = phone.safeParse(value.transferPhone);
      if (!parsed.success) {
        ctx.addIssue({
          code: "custom",
          path: ["transferPhone"],
          message: parsed.error.issues[0]?.message ?? phoneMessage,
        });
      }
    });
}

export type DonationPromisePayload = z.infer<ReturnType<typeof donationPromiseSchema>>;
