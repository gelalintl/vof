"use client";

import { useState } from "react";
import {
  createEventFromForm,
  deleteEvent,
  updateEventFromForm,
} from "@/app/admin/actions";
import type { AdminEventRecord } from "@/types";
import { formatAdminDateTime } from "@/utils/date/format";
import { AdminActionBar } from "./AdminActionBar";
import { AdminBadge, EventCategoryBadge } from "./AdminBadge";
import { AdminConfirmDialog, AdminDrawer } from "./AdminDrawer";
import { AdminEmptyState, AdminLabel, AdminPanel } from "./AdminPageHeader";
import { AdminThumb } from "./AdminThumb";
import { EventForm } from "./EventForm";

interface EventManagerProps {
  events: AdminEventRecord[];
}

type DrawerMode = "view" | "edit" | null;

export function EventManager({ events }: EventManagerProps) {
  const [selected, setSelected] = useState<AdminEventRecord | null>(null);
  const [mode, setMode] = useState<DrawerMode>(null);
  const [pendingDelete, setPendingDelete] = useState<AdminEventRecord | null>(null);

  const close = () => {
    setSelected(null);
    setMode(null);
  };

  return (
    <>
      {events.length === 0 ? (
        <AdminEmptyState>Aucun événement en base pour le moment.</AdminEmptyState>
      ) : (
        <div className="overflow-x-auto border border-burgundy/15 bg-white">
          <table className="min-w-full text-left text-sm">
            <thead className="border-b border-burgundy/10 bg-cream font-heading text-[11px] font-bold uppercase tracking-[0.16em] text-burgundy">
              <tr>
                <th className="px-4 py-3">Événement</th>
                <th className="px-4 py-3">Catégorie</th>
                <th className="px-4 py-3">Date</th>
                <th className="px-4 py-3">Lieu</th>
                <th className="px-4 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {events.map((event) => (
                <tr key={event.id} className="border-b border-burgundy/10 last:border-0">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <AdminThumb src={event.image} alt={event.title} />
                      <div>
                        <p className="font-heading font-bold text-burgundy">{event.title}</p>
                        {event.isSpecial ? (
                          <AdminBadge className="mt-1 border-gold bg-gold/20 text-[#6B4F1D]">
                            Spécial
                          </AdminBadge>
                        ) : null}
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <EventCategoryBadge category={event.category} />
                  </td>
                  <td className="px-4 py-3 text-[#2C2424]/80">
                    {formatAdminDateTime(event.startDate)}
                  </td>
                  <td className="px-4 py-3 text-[#2C2424]/80">{event.location}</td>
                  <td className="px-4 py-3">
                    <AdminActionBar
                      className="justify-end"
                      onView={() => {
                        setSelected(event);
                        setMode("view");
                      }}
                      onEdit={() => {
                        setSelected(event);
                        setMode("edit");
                      }}
                      onDelete={() => setPendingDelete(event)}
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <AdminDrawer
        isOpen={Boolean(selected) && mode === "view"}
        title={selected?.title ?? "Événement"}
        description="Fiche complète de l’enregistrement"
        onClose={close}
      >
        {selected ? (
          <div className="space-y-5">
            {selected.image ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={selected.image} alt={selected.title} className="w-full border border-burgundy/15 object-cover" />
            ) : null}
            <div className="flex flex-wrap gap-2">
              <EventCategoryBadge category={selected.category} />
              {selected.isSpecial ? (
                <AdminBadge className="border-gold bg-gold/20 text-[#6B4F1D]">Spécial</AdminBadge>
              ) : null}
            </div>
            <Detail label="Début" value={formatAdminDateTime(selected.startDate)} />
            {selected.endDate ? (
              <Detail label="Fin" value={formatAdminDateTime(selected.endDate)} />
            ) : null}
            <Detail label="Lieu" value={selected.location} />
            <div>
              <AdminLabel>Description</AdminLabel>
              <p className="mt-2 whitespace-pre-wrap text-sm leading-relaxed text-[#2C2424]">
                {selected.description}
              </p>
            </div>
          </div>
        ) : null}
      </AdminDrawer>

      <AdminDrawer
        isOpen={Boolean(selected) && mode === "edit"}
        title="Éditer l’événement"
        onClose={close}
      >
        {selected ? (
          <EventForm
            key={selected.id}
            event={selected}
            action={async (formData) => {
              await updateEventFromForm(formData);
              close();
            }}
            submitLabel="Enregistrer les modifications"
          />
        ) : null}
      </AdminDrawer>

      <AdminConfirmDialog
        isOpen={Boolean(pendingDelete)}
        title="Supprimer l’événement"
        message={`« ${pendingDelete?.title ?? ""} » sera définitivement retiré.`}
        onClose={() => setPendingDelete(null)}
        onConfirm={async () => {
          if (!pendingDelete) {
            return;
          }
          const formData = new FormData();
          formData.set("id", pendingDelete.id);
          await deleteEvent(formData);
          setPendingDelete(null);
        }}
      />
    </>
  );
}

function Detail({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <AdminLabel>{label}</AdminLabel>
      <p className="mt-1 text-sm text-[#2C2424]">{value}</p>
    </div>
  );
}

export function EventCreatePanel() {
  return (
    <AdminPanel>
      <h2 className="mb-4 font-heading text-lg font-bold text-burgundy">Nouvel événement</h2>
      <EventForm action={createEventFromForm} submitLabel="Créer l’événement" />
    </AdminPanel>
  );
}
