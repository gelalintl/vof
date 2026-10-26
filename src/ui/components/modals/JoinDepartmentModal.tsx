"use client";

import { useState } from "react";
import { formatMessage } from "@/i18n/getDictionary";
import type { Department } from "@/types";
import { Button } from "@/ui/design-system/button";
import { Modal } from "@/ui/design-system/modal";
export interface DepartmentJoinLabels {
  joinTitle: string;
  joinFallback: string;
  joinHint: string;
  joinSuccess: string;
  close: string;
  fullName: string;
  phone: string;
  phonePlaceholder: string;
  email: string;
  availability: string;
  availabilityPlaceholder: string;
  sendRequest: string;
}

interface JoinDepartmentModalProps {
  department: Department | null;
  isOpen: boolean;
  labels: DepartmentJoinLabels;
  onClose: () => void;
}

export function JoinDepartmentModal({
  department,
  isOpen,
  labels,
  onClose,
}: JoinDepartmentModalProps) {
  const [submitted, setSubmitted] = useState(false);

  const handleClose = () => {
    onClose();
    setSubmitted(false);
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title={
        department
          ? formatMessage(labels.joinTitle, { name: department.name })
          : labels.joinFallback
      }
      description={submitted ? labels.joinSuccess : labels.joinHint}
    >
      {submitted ? (
        <Button variant="primary" className="w-full" onClick={handleClose}>
          {labels.close}
        </Button>
      ) : (
        <form
          className="space-y-4"
          onSubmit={(event) => {
            event.preventDefault();
            setSubmitted(true);
          }}
        >
          <Field label={labels.fullName} name="name" required autoComplete="name" />
          <Field
            label={labels.phone}
            name="phone"
            type="tel"
            required
            autoComplete="tel"
            placeholder={labels.phonePlaceholder}
          />
          <Field
            label={labels.email}
            name="email"
            type="email"
            required
            autoComplete="email"
          />
          <label className="block">
            <span className="font-heading text-sm font-bold text-slate-800">
              {labels.availability}
            </span>
            <textarea
              name="message"
              rows={4}
              className="mt-2 w-full rounded-xl border border-slate-200 px-4 py-3 font-sans text-sm text-slate-800 outline-none ring-violet-700 focus:ring-2"
              placeholder={labels.availabilityPlaceholder}
            />
          </label>
          <Button type="submit" variant="accent" className="w-full">
            {labels.sendRequest}
          </Button>
        </form>
      )}
    </Modal>
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
