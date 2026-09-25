"use client";

import { Eye, Pencil, Trash2 } from "lucide-react";
import { cn } from "@/utils/cn";

interface AdminActionBarProps {
  onView: () => void;
  onEdit: () => void;
  onDelete: () => void;
  className?: string;
}

const buttonClass =
  "inline-flex size-9 items-center justify-center border border-burgundy/15 text-burgundy transition-colors hover:bg-burgundy hover:text-cream";

export function AdminActionBar({ onView, onEdit, onDelete, className }: AdminActionBarProps) {
  return (
    <div className={cn("flex items-center gap-1.5", className)}>
      <button type="button" onClick={onView} className={buttonClass} aria-label="Consulter">
        <Eye className="size-4" />
      </button>
      <button type="button" onClick={onEdit} className={buttonClass} aria-label="Éditer">
        <Pencil className="size-4" />
      </button>
      <button
        type="button"
        onClick={onDelete}
        className={`${buttonClass} hover:bg-burgundy-light`}
        aria-label="Supprimer"
      >
        <Trash2 className="size-4" />
      </button>
    </div>
  );
}
