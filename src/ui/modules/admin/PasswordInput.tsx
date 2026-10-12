"use client";

import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { cn } from "@/utils/cn";
import { adminFieldClass } from "./adminStyles";

type PasswordInputProps = Omit<React.InputHTMLAttributes<HTMLInputElement>, "type">;

/** Champ mot de passe avec un œil pour afficher / masquer la saisie. */
export function PasswordInput({ className, ...props }: PasswordInputProps) {
  const [visible, setVisible] = useState(false);

  return (
    <div className="relative">
      <input
        {...props}
        type={visible ? "text" : "password"}
        className={cn(adminFieldClass, "pr-11", className)}
      />
      <button
        type="button"
        onClick={() => setVisible((value) => !value)}
        aria-label={visible ? "Masquer le mot de passe" : "Afficher le mot de passe"}
        aria-pressed={visible}
        title={visible ? "Masquer le mot de passe" : "Afficher le mot de passe"}
        className="absolute right-1 top-1.5 flex size-9 items-center justify-center text-slate-500 hover:text-[#6d28d9]"
      >
        {visible ? <EyeOff className="size-4" aria-hidden /> : <Eye className="size-4" aria-hidden />}
      </button>
    </div>
  );
}
