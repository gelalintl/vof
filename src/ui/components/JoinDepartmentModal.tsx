"use client";

import { useState } from "react";
import type { Department } from "@/types";
import { Button } from "@/ui/design-system/button";
import { Modal } from "@/ui/design-system/modal";

interface JoinDepartmentModalProps {
  department: Department | null;
  isOpen: boolean;
  onClose: () => void;
}

export function JoinDepartmentModal({
  department,
  isOpen,
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
      title={department ? `Rejoindre ${department.name}` : "Rejoindre un département"}
      description={
        submitted
          ? "Votre demande a bien été enregistrée. L'équipe vous recontactera."
          : "Laissez vos coordonnées. Un responsable VOF vous écrira pour la suite."
      }
    >
      {submitted ? (
        <Button variant="primary" className="w-full" onClick={handleClose}>
          Fermer
        </Button>
      ) : (
        <form
          className="space-y-4"
          onSubmit={(event) => {
            event.preventDefault();
            setSubmitted(true);
          }}
        >
          <Field label="Nom complet" name="name" required autoComplete="name" />
          <Field
            label="Téléphone"
            name="phone"
            type="tel"
            required
            autoComplete="tel"
            placeholder="07 00 00 00 00"
          />
          <Field
            label="E-mail"
            name="email"
            type="email"
            required
            autoComplete="email"
          />
          <label className="block">
            <span className="font-heading text-sm font-bold text-slate-800">
              Disponibilités / message
            </span>
            <textarea
              name="message"
              rows={4}
              className="mt-2 w-full rounded-xl border border-slate-200 px-4 py-3 font-sans text-sm text-slate-800 outline-none ring-violet-700 focus:ring-2"
              placeholder="Indiquez vos disponibilités ou une brève motivation."
            />
          </label>
          <Button type="submit" variant="accent" className="w-full">
            Envoyer ma demande
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
