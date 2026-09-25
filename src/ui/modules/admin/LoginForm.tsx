"use client";

import { useState } from "react";
import { loginAction } from "@/lib/auth";
import { AdminLabel } from "./AdminPageHeader";
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
          className="border border-burgundy bg-burgundy/5 px-4 py-3 font-sans text-sm text-burgundy"
        >
          {error}
        </p>
      ) : null}

      <label className="block">
        <AdminLabel>Email</AdminLabel>
        <input
          name="email"
          type="email"
          autoComplete="username"
          required
          placeholder="admin@voiceoffreedom.org"
          className={adminFieldClass}
        />
      </label>

      <label className="block">
        <AdminLabel>Mot de passe</AdminLabel>
        <input
          name="password"
          type="password"
          autoComplete="current-password"
          required
          className={adminFieldClass}
        />
      </label>

      <button type="submit" disabled={pending} className={`${adminPrimaryButtonClass} w-full`}>
        {pending ? "Connexion…" : "Se connecter"}
      </button>
    </form>
  );
}
