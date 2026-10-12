"use client";

import { useState } from "react";
import { loginAction } from "@/lib/auth";
import { AdminLabel } from "./AdminPageHeader";
import { PasswordInput } from "./PasswordInput";
import { adminFieldClass, adminPrimaryButtonClass } from "./adminStyles";

export function LoginForm() {
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  async function handleSubmit(formData: FormData) {
    setPending(true);
    setError(null);
    const result = await loginAction(formData);
    if (result?.error) {
      setError(result.error);
      setPending(false);
    }
  }

  return (
    <form action={handleSubmit} className="mt-8 space-y-5">
      {error ? (
        <p
          role="alert"
          className="border border-red-200 bg-red-50 px-4 py-3 font-sans text-sm text-red-700"
        >
          {error}
        </p>
      ) : null}

      <label className="block">
        <AdminLabel>Nom ou adresse e-mail</AdminLabel>
        <input
          name="identifier"
          type="text"
          autoComplete="username"
          autoCapitalize="none"
          spellCheck={false}
          required
          placeholder="Votre nom ou admin@voiceoffreedom.org"
          className={adminFieldClass}
        />
      </label>

      <label className="block">
        <AdminLabel>Mot de passe</AdminLabel>
        <PasswordInput name="password" autoComplete="current-password" required />
      </label>

      <button type="submit" disabled={pending} className={`${adminPrimaryButtonClass} w-full`}>
        {pending ? "Connexion…" : "Se connecter"}
      </button>
    </form>
  );
}
