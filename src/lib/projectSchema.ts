import { z } from "zod";

export const projectSchema = z.object({
  targetAmount: z.coerce
    .number()
    .min(20000, "L'objectif financier doit être d'au moins 20 000 FCFA"),
  currentAmount: z.coerce
    .number()
    .min(0, "Le montant actuel ne peut pas être négatif"),
});

export type ProjectAmounts = z.infer<typeof projectSchema>;

function normalizeFcfaInput(value: string) {
  return value.replace(/\s/g, "").replace(",", ".");
}

export function parseProjectAmounts(
  targetAmount: string,
  currentAmount: string,
): ProjectAmounts {
  const parsed = projectSchema.safeParse({
    targetAmount: Number.parseInt(normalizeFcfaInput(targetAmount), 10),
    currentAmount: Number.parseInt(normalizeFcfaInput(currentAmount || "0"), 10),
  });

  if (!parsed.success) {
    throw new Error(parsed.error.issues[0]?.message ?? "Montant invalide.");
  }

  return parsed.data;
}
