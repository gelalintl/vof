"use client";

import { useRouter } from "next/navigation";
import { createEventFromForm, updateEventFromForm } from "@/app/admin/actions";
import type { AdminEventRecord } from "@/types";
import { EventForm } from "./EventForm";
import { notifyAdminAction } from "./notifyAdminAction";

interface EventEditorProps {
  event?: AdminEventRecord;
}

export function EventEditor({ event }: EventEditorProps) {
  const router = useRouter();

  const action = event
    ? notifyAdminAction(async (formData) => {
        await updateEventFromForm(formData);
        router.push("/admin/evenements");
        router.refresh();
      }, "Événement mis à jour.")
    : notifyAdminAction(async (formData) => {
        await createEventFromForm(formData);
        router.push("/admin/evenements");
        router.refresh();
      }, "Événement créé.");

  return (
    <EventForm
      event={event}
      action={action}
      submitLabel={event ? "Enregistrer les modifications" : "Créer l’événement"}
    />
  );
}
