"use client";

import { useRouter } from "next/navigation";
import { createPastorFromForm, updatePastorFromForm } from "@/app/admin/actions";
import type { AdminPastorRecord } from "@/types";
import { PastorForm } from "./PastorForm";
import { notifyAdminAction } from "./notifyAdminAction";

interface PastorEditorProps {
  pastor?: AdminPastorRecord;
}

export function PastorEditor({ pastor }: PastorEditorProps) {
  const router = useRouter();

  const action = pastor
    ? notifyAdminAction(async (formData) => {
        await updatePastorFromForm(formData);
        router.push("/admin/pasteurs");
        router.refresh();
      }, "Membre mis à jour.")
    : notifyAdminAction(async (formData) => {
        await createPastorFromForm(formData);
        router.push("/admin/pasteurs");
        router.refresh();
      }, "Membre ajouté à l’équipe.");

  return (
    <PastorForm
      pastor={pastor}
      action={action}
      submitLabel={pastor ? "Enregistrer les modifications" : "Ajouter le membre"}
    />
  );
}
