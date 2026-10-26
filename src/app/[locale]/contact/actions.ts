"use server";

import { isLocale } from "@/i18n/config";
import { getDictionary } from "@/i18n/getDictionary";
import { getRequestLocale } from "@/i18n/localized";
import {
  compactContactPhone,
  contactMessageSchema,
  type ContactMessage,
} from "@/lib/contactSchema";

export type SubmitContactResult = { ok: true } | { ok: false; error: string; field?: "phone" };

export async function submitContactMessage(
  input: ContactMessage & { locale?: string },
): Promise<SubmitContactResult> {
  const locale = isLocale(input.locale) ? input.locale : await getRequestLocale();
  const copy = getDictionary(locale).contact;
  const parsed = contactMessageSchema(copy).safeParse({
    name: input.name,
    email: input.email,
    phone: compactContactPhone(input.phone),
    subject: input.subject,
    message: input.message,
  });

  if (!parsed.success) {
    const phoneIssue = parsed.error.issues.find((issue) => issue.path[0] === "phone");
    const issue = phoneIssue ?? parsed.error.issues[0];
    return {
      ok: false,
      error: issue?.message ?? copy.errorFailed,
      field: phoneIssue ? "phone" : undefined,
    };
  }

  return { ok: true };
}
