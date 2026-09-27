"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { Pencil, Trash2 } from "lucide-react";
import { deleteEvent } from "@/app/admin/actions";
import {
  eventAdminStatus,
  isRecurringEvent,
  recurrenceBadgeLabel,
} from "@/lib/eventRecurrence";
import type { AdminEventRecord } from "@/types";
import { formatAdminDateTime } from "@/utils/date/format";
import { cn } from "@/utils/cn";
import { AdminBadge } from "./AdminBadge";
import { AdminConfirmDialog } from "./AdminDrawer";
import { AdminEmptyState } from "./AdminPageHeader";
import { AdminThumb } from "./AdminThumb";
import { notifyAdminConfirm } from "./notifyAdminAction";

interface EventManagerProps {
  events: AdminEventRecord[];
}

type EventFilter = "all" | "punctual" | "recurring";

const filters: { id: EventFilter; label: string }[] = [
  { id: "all", label: "Tous les événements" },
  { id: "punctual", label: "Ponctuels & Spéciaux" },
  { id: "recurring", label: "Récurrences mensuelles" },
];

export function EventManager({ events }: EventManagerProps) {
  const [filter, setFilter] = useState<EventFilter>("all");
  const [pendingDelete, setPendingDelete] = useState<AdminEventRecord | null>(null);

  const visible = useMemo(() => {
    if (filter === "punctual") {
      return events.filter((event) => !isRecurringEvent(event));
    }
    if (filter === "recurring") {
      return events.filter(isRecurringEvent);
    }
    return events;
  }, [events, filter]);

  return (
    <>
      <nav
        aria-label="Filtrer les événements"
        className="flex gap-2 overflow-x-auto border-b border-slate-200 pb-px"
      >
        {filters.map((item) => (
          <button
            key={item.id}
            type="button"
            onClick={() => setFilter(item.id)}
            className={cn(
              "shrink-0 border-b-2 px-3 py-2.5 font-heading text-sm tracking-tight transition-colors",
              filter === item.id
                ? "border-[#6d28d9] font-bold text-[#6d28d9]"
                : "border-transparent font-semibold text-slate-500 hover:text-slate-900",
            )}
          >
            {item.label}
          </button>
        ))}
      </nav>

      {visible.length === 0 ? (
        <div className="mt-6">
          <AdminEmptyState>Aucun événement dans cet onglet.</AdminEmptyState>
        </div>
      ) : (
        <div className="mt-6 overflow-x-auto border border-slate-200 bg-white">
          <table className="min-w-full text-left text-sm">
            <thead className="border-b border-slate-100 bg-slate-50 font-heading text-[11px] font-bold uppercase tracking-[0.16em] text-slate-900">
              <tr>
                <th className="px-4 py-3">Titre / Image</th>
                <th className="px-4 py-3">Date ou récurrence</th>
                <th className="px-4 py-3">Badges</th>
                <th className="px-4 py-3">Statut</th>
                <th className="px-4 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {visible.map((event) => (
                <tr key={event.id} className="border-b border-slate-100 last:border-0">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <AdminThumb src={event.image} alt={event.title} />
                      <div>
                        <p className="font-heading font-bold text-slate-900">{event.title}</p>
                        {event.slug ? (
                          <p className="font-mono text-[11px] text-slate-400">{event.slug}</p>
                        ) : null}
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-slate-600">
                    {isRecurringEvent(event) ? (
                      <AdminBadge className="border-[#6d28d9]/20 bg-[#6d28d9]/10 text-[#6d28d9]">
                        {recurrenceBadgeLabel(event.recurrenceType)}
                      </AdminBadge>
                    ) : (
                      formatAdminDateTime(event.startDate)
                    )}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex flex-wrap gap-1">
                      {event.isSpecial ? (
                        <AdminBadge className="border-amber-200 bg-amber-50 text-amber-800">
                          Spécial
                        </AdminBadge>
                      ) : null}
                      {event.isFeatured ? (
                        <AdminBadge className="border-[#6d28d9]/20 bg-[#6d28d9]/10 text-[#6d28d9]">
                          Mise à la une
                        </AdminBadge>
                      ) : null}
                      {event.isExclusive ? (
                        <AdminBadge className="border-red-200 bg-red-50 text-red-700">
                          Exclusif
                        </AdminBadge>
                      ) : null}
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <AdminBadge className="border-slate-200 bg-slate-50 text-slate-700">
                      {eventAdminStatus(event)}
                    </AdminBadge>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-end gap-1.5">
                      <Link
                        href={`/admin/evenements/${event.id}/edit`}
                        className="inline-flex size-9 items-center justify-center border border-slate-200 text-[#6d28d9] transition-colors hover:bg-[#6d28d9] hover:text-white"
                        aria-label={`Éditer ${event.title}`}
                      >
                        <Pencil className="size-4" />
                      </Link>
                      <button
                        type="button"
                        onClick={() => setPendingDelete(event)}
                        className="inline-flex size-9 items-center justify-center border border-slate-200 text-[#6d28d9] transition-colors hover:bg-red-600 hover:text-white"
                        aria-label={`Supprimer ${event.title}`}
                      >
                        <Trash2 className="size-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

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
          await notifyAdminConfirm(() => deleteEvent(formData), "Événement supprimé.");
          setPendingDelete(null);
        }}
      />
    </>
  );
}
