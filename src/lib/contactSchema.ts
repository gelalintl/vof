import { z } from "zod";
import { createE164PhoneSchema } from "@/lib/phoneSchema";
import type { ContactSubject } from "@/types";

const CONTACT_SUBJECTS = [
  "information",
  "priere",
  "visite",
  "don",
  "departement",
  "temoignage",
  "autre",
] as const satisfies readonly ContactSubject[];

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export interface ContactMessageCopy {
  phoneInvalid: string;
  errorName: string;
  errorEmail: string;
  errorSubject: string;
  errorMessage: string;
}

/** Retire espaces et séparateurs, en conservant le « + » du format E.164. */
export function compactContactPhone(value: string | undefined) {
  return (value ?? "").replace(/[\s().-]/g, "");
}

export function contactMessageSchema(copy: ContactMessageCopy) {
  return z.object({
    name: z.string().trim().min(1, copy.errorName).max(120, copy.errorName),
    email: z
      .string()
      .trim()
      .min(1, copy.errorEmail)
      .max(200, copy.errorEmail)
      .regex(EMAIL_PATTERN, copy.errorEmail),
    phone: z
      .string()
      .trim()
      .default("")
      .superRefine((value, ctx) => {
        if (!value) {
          return;
        }
        if (!createE164PhoneSchema(copy.phoneInvalid).safeParse(value).success) {
          ctx.addIssue({ code: "custom", message: copy.phoneInvalid });
        }
      }),
    subject: z.enum(CONTACT_SUBJECTS, { error: copy.errorSubject }),
    message: z.string().trim().min(1, copy.errorMessage).max(5000, copy.errorMessage),
  });
}

export type ContactMessageInput = z.input<ReturnType<typeof contactMessageSchema>>;
export type ContactMessage = z.output<ReturnType<typeof contactMessageSchema>>;
