"use client";

import { useFormStatus } from "react-dom";
import { cn } from "@/utils/cn";
import { adminPrimaryButtonClass } from "./adminStyles";

interface AdminSubmitButtonProps {
  children: React.ReactNode;
  className?: string;
  pendingLabel?: string;
}

export function AdminSubmitButton({
  children,
  className,
  pendingLabel = "Enregistrement…",
}: AdminSubmitButtonProps) {
  const { pending } = useFormStatus();

  return (
    <button
      type="submit"
      disabled={pending}
      className={cn(adminPrimaryButtonClass, className)}
    >
      {pending ? pendingLabel : children}
    </button>
  );
}
