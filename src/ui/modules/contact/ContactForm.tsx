"use client";

import { useState } from "react";
import type { ContactSubject } from "@/types";
import { Button } from "@/ui/design-system/button";

interface ContactFormProps {
  labels: {
    write: string;
    fullName: string;
    email: string;
    phone: string;
    phonePlaceholder: string;
    subject: string;
    message: string;
    messagePlaceholder: string;
    send: string;
    sentTitle: string;
    sentBody: string;
  };
  subjects: { value: ContactSubject; label: string }[];
}

export function ContactForm({ labels, subjects }: ContactFormProps) {
  const [submitted, setSubmitted] = useState(false);
  const [subject, setSubject] = useState<ContactSubject>("information");

  if (submitted) {
    return (
      <div className="rounded-3xl bg-violet-50 p-6 ring-1 ring-violet-100">
        <p className="font-heading text-lg font-bold tracking-tight text-violet-700">
          {labels.sentTitle}
        </p>
        <p className="mt-2 font-sans text-sm leading-relaxed text-slate-800">
          {labels.sentBody}
        </p>
      </div>
    );
  }

  return (
    <section aria-labelledby="formulaire-contact">
      <h2
        id="formulaire-contact"
        className="font-heading text-lg font-bold tracking-tight text-violet-700"
      >
        {labels.write}
      </h2>
      <form
        className="mt-4 space-y-4"
        onSubmit={(event) => {
          event.preventDefault();
          setSubmitted(true);
        }}
      >
        <Field label={labels.fullName} name="name" required autoComplete="name" />
        <Field
          label={labels.email}
          name="email"
          type="email"
          required
          autoComplete="email"
        />
        <Field
          label={labels.phone}
          name="phone"
          type="tel"
          autoComplete="tel"
          placeholder={labels.phonePlaceholder}
        />
        <label className="block">
          <span className="font-heading text-sm font-bold text-slate-800">
            {labels.subject}
          </span>
          <select
            name="subject"
            required
            value={subject}
            onChange={(event) =>
              setSubject(event.target.value as ContactSubject)
            }
            className="mt-2 w-full rounded-xl border border-slate-200 bg-white px-4 py-3 font-sans text-sm text-slate-800 outline-none ring-violet-700 focus:ring-2"
          >
            {subjects.map((item) => (
              <option key={item.value} value={item.value}>
                {item.label}
              </option>
            ))}
          </select>
        </label>
        <label className="block">
          <span className="font-heading text-sm font-bold text-slate-800">
            {labels.message}
          </span>
          <textarea
            name="message"
            required
            rows={5}
            className="mt-2 w-full rounded-xl border border-slate-200 px-4 py-3 font-sans text-sm text-slate-800 outline-none ring-violet-700 focus:ring-2"
            placeholder={labels.messagePlaceholder}
          />
        </label>
        <Button type="submit" variant="primary" className="w-full">
          {labels.send}
        </Button>
      </form>
    </section>
  );
}

function Field({
  label,
  name,
  type = "text",
  required,
  autoComplete,
  placeholder,
}: {
  label: string;
  name: string;
  type?: string;
  required?: boolean;
  autoComplete?: string;
  placeholder?: string;
}) {
  return (
    <label className="block">
      <span className="font-heading text-sm font-bold text-slate-800">{label}</span>
      <input
        name={name}
        type={type}
        required={required}
        autoComplete={autoComplete}
        placeholder={placeholder}
        className="mt-2 w-full rounded-xl border border-slate-200 px-4 py-3 font-sans text-sm text-slate-800 outline-none ring-violet-700 focus:ring-2"
      />
    </label>
  );
}
