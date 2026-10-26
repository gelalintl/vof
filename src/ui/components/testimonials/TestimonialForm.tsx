"use client";

import { useState, useTransition, type FormEvent } from "react";
import { CheckCircle2 } from "lucide-react";
import { submitTestimonial } from "@/app/[locale]/partager-temoignage/actions";
import type { Locale } from "@/i18n/config";
import { Button } from "@/ui/design-system/button";

const fieldClass =
  "mt-2 w-full rounded-xl border border-slate-200 bg-white px-4 py-3 font-sans text-sm text-slate-800 outline-none ring-violet-700 focus:ring-2";
const labelClass = "font-heading text-sm font-bold text-slate-800";

export interface TestimonialFormLabels {
  fullName: string;
  contact: string;
  contactPlaceholder: string;
  contactHint: string;
  content: string;
  contentPlaceholder: string;
  submit: string;
  sending: string;
  success: string;
  honeypot: string;
}

export function TestimonialForm({
  labels,
  locale,
}: {
  labels: TestimonialFormLabels;
  locale: Locale;
}) {
  const [isSubmitting, startTransition] = useTransition();
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    setError(null);

    startTransition(async () => {
      const result = await submitTestimonial({
        authorName: String(formData.get("authorName") ?? ""),
        contactInfo: String(formData.get("contactInfo") ?? ""),
        content: String(formData.get("content") ?? ""),
        website: String(formData.get("website") ?? ""),
        locale,
      });

      if (!result.ok) {
        setError(result.error);
        return;
      }
      setSubmitted(true);
    });
  }

  if (submitted) {
    return (
      <div
        role="status"
        className="rounded-3xl bg-violet-50 p-8 text-center ring-1 ring-violet-100"
      >
        <CheckCircle2 className="mx-auto size-10 text-violet-700" aria-hidden />
        <p className="mt-4 font-heading text-lg font-bold tracking-tight text-violet-700">
          {labels.success}
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {/* Champ piège anti-spam, invisible pour les visiteurs. */}
      <div aria-hidden className="absolute -left-[9999px] h-0 w-0 overflow-hidden">
        <label>
          {labels.honeypot}
          <input type="text" name="website" tabIndex={-1} autoComplete="off" />
        </label>
      </div>

      {error ? (
        <p
          role="alert"
          className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 font-sans text-sm text-red-700"
        >
          {error}
        </p>
      ) : null}

      <label className="block">
        <span className={labelClass}>{labels.fullName}</span>
        <input
          name="authorName"
          required
          maxLength={120}
          autoComplete="name"
          className={fieldClass}
        />
      </label>

      <label className="block">
        <span className={labelClass}>{labels.contact}</span>
        <input
          name="contactInfo"
          required
          maxLength={160}
          autoComplete="email"
          placeholder={labels.contactPlaceholder}
          className={fieldClass}
        />
        <span className="mt-1 block font-sans text-xs text-slate-500">
          {labels.contactHint}
        </span>
      </label>

      <label className="block">
        <span className={labelClass}>{labels.content}</span>
        <textarea
          name="content"
          required
          rows={8}
          minLength={20}
          maxLength={5000}
          placeholder={labels.contentPlaceholder}
          className={fieldClass}
        />
      </label>

      <Button type="submit" variant="primary" size="lg" className="w-full" disabled={isSubmitting}>
        {isSubmitting ? labels.sending : labels.submit}
      </Button>
    </form>
  );
}
