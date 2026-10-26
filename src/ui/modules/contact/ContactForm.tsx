"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { submitContactMessage } from "@/app/[locale]/contact/actions";
import type { Locale } from "@/i18n/config";
import {
  compactContactPhone,
  contactMessageSchema,
  type ContactMessageCopy,
  type ContactMessageInput,
} from "@/lib/contactSchema";
import type { ContactSubject } from "@/types";
import { PhoneInput } from "@/ui/components/forms/PhoneInput";
import { Button } from "@/ui/design-system/button";

const fieldClass =
  "mt-2 w-full rounded-xl border border-slate-200 bg-white px-4 py-3 font-sans text-sm text-slate-800 outline-none ring-violet-700 focus:ring-2";
const labelClass = "font-heading text-sm font-bold text-slate-800";

interface ContactFormProps {
  locale: Locale;
  labels: ContactMessageCopy & {
    write: string;
    fullName: string;
    email: string;
    phone: string;
    phonePlaceholder: string;
    subject: string;
    message: string;
    messagePlaceholder: string;
    send: string;
    sending: string;
    sentTitle: string;
    sentBody: string;
    errorFailed: string;
  };
  subjects: { value: ContactSubject; label: string }[];
}

export function ContactForm({ locale, labels, subjects }: ContactFormProps) {
  const [submitted, setSubmitted] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);
  const {
    register,
    control,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<ContactMessageInput>({
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      subject: "information",
      message: "",
    },
  });

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
        onSubmit={handleSubmit(async (values) => {
          setServerError(null);
          const parsed = contactMessageSchema(labels).safeParse({
            ...values,
            phone: compactContactPhone(values.phone),
          });
          if (!parsed.success) {
            for (const issue of parsed.error.issues) {
              const field = issue.path[0];
              if (
                field === "name" ||
                field === "email" ||
                field === "phone" ||
                field === "subject" ||
                field === "message"
              ) {
                setError(field, { message: issue.message });
              }
            }
            return;
          }

          const result = await submitContactMessage({ ...parsed.data, locale });
          if (!result.ok) {
            if (result.field === "phone") {
              setError("phone", { message: result.error });
              return;
            }
            setServerError(result.error);
            return;
          }
          setSubmitted(true);
        })}
      >
        {serverError ? (
          <p
            role="alert"
            className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 font-sans text-sm text-red-700"
          >
            {serverError}
          </p>
        ) : null}

        <label className="block">
          <span className={labelClass}>{labels.fullName}</span>
          <input
            {...register("name")}
            required
            autoComplete="name"
            aria-invalid={Boolean(errors.name)}
            className={fieldClass}
          />
          {errors.name ? <FieldError message={errors.name.message} /> : null}
        </label>
        <label className="block">
          <span className={labelClass}>{labels.email}</span>
          <input
            {...register("email")}
            type="email"
            required
            autoComplete="email"
            aria-invalid={Boolean(errors.email)}
            className={fieldClass}
          />
          {errors.email ? <FieldError message={errors.email.message} /> : null}
        </label>
        <div className="block">
          <label htmlFor="contact-phone" className={labelClass}>
            {labels.phone}
          </label>
          <PhoneInput
            id="contact-phone"
            name="phone"
            control={control}
            locale={locale}
            placeholder={labels.phonePlaceholder}
            aria-invalid={Boolean(errors.phone)}
            aria-describedby={errors.phone ? "contact-phone-error" : undefined}
          />
          {errors.phone ? (
            <FieldError id="contact-phone-error" message={errors.phone.message} />
          ) : null}
        </div>
        <label className="block">
          <span className={labelClass}>{labels.subject}</span>
          <select
            {...register("subject")}
            required
            aria-invalid={Boolean(errors.subject)}
            className={fieldClass}
          >
            {subjects.map((item) => (
              <option key={item.value} value={item.value}>
                {item.label}
              </option>
            ))}
          </select>
          {errors.subject ? <FieldError message={errors.subject.message} /> : null}
        </label>
        <label className="block">
          <span className={labelClass}>{labels.message}</span>
          <textarea
            {...register("message")}
            required
            rows={5}
            aria-invalid={Boolean(errors.message)}
            className={fieldClass}
            placeholder={labels.messagePlaceholder}
          />
          {errors.message ? <FieldError message={errors.message.message} /> : null}
        </label>
        <Button type="submit" variant="primary" className="w-full" disabled={isSubmitting}>
          {isSubmitting ? labels.sending : labels.send}
        </Button>
      </form>
    </section>
  );
}

function FieldError({ id, message }: { id?: string; message?: string }) {
  if (!message) {
    return null;
  }
  return (
    <span id={id} className="mt-1 block font-sans text-xs text-red-600">
      {message}
    </span>
  );
}
