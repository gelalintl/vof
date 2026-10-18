"use client";

import { useState, useTransition, type FormEvent } from "react";
import { CheckCircle2 } from "lucide-react";
import { submitTestimonial } from "@/app/[locale]/partager-temoignage/actions";
import { Button } from "@/ui/design-system/button";

const fieldClass =
  "mt-2 w-full rounded-xl border border-slate-200 bg-white px-4 py-3 font-sans text-sm text-slate-800 outline-none ring-violet-700 focus:ring-2";
const labelClass = "font-heading text-sm font-bold text-slate-800";

export function TestimonialForm() {
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
          Merci d&apos;avoir partagé votre témoignage. Il a été transmis à notre équipe.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {/* Champ piège anti-spam, invisible pour les visiteurs. */}
      <div aria-hidden className="absolute -left-[9999px] h-0 w-0 overflow-hidden">
        <label>
          Ne pas remplir
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
        <span className={labelClass}>Nom complet</span>
        <input
          name="authorName"
          required
          maxLength={120}
          autoComplete="name"
          className={fieldClass}
        />
      </label>

      <label className="block">
        <span className={labelClass}>E-mail ou numéro de téléphone</span>
        <input
          name="contactInfo"
          required
          maxLength={160}
          autoComplete="email"
          placeholder="vous@exemple.com ou 90 00 00 00"
          className={fieldClass}
        />
        <span className="mt-1 block font-sans text-xs text-slate-500">
          Visible uniquement par l&apos;équipe, pour vous recontacter si besoin.
        </span>
      </label>

      <label className="block">
        <span className={labelClass}>Votre témoignage</span>
        <textarea
          name="content"
          required
          rows={8}
          minLength={20}
          maxLength={5000}
          placeholder="Racontez-nous ce que Dieu a fait dans votre vie…"
          className={fieldClass}
        />
      </label>

      <Button type="submit" variant="primary" size="lg" className="w-full" disabled={isSubmitting}>
        {isSubmitting ? "Envoi en cours…" : "Envoyer mon témoignage"}
      </Button>
    </form>
  );
}
