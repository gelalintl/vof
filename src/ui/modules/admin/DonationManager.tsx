"use client";

import { useMemo, useState } from "react";
import { confirmDonationPromise } from "@/app/admin/actions";
import type { AdminDonationRecord, AdminProjectRecord, DonationPromiseStatus } from "@/types";
import {
  donationPaymentLabels,
  donationStatusLabels,
  donationTypeLabelsAdmin,
  isDonationPaymentMethod,
  isDonationPromiseType,
} from "@/lib/donations";
import { formatFcfa } from "@/utils/formatters/currency";
import { AdminEmptyState } from "./AdminPageHeader";
import { adminFieldClass, adminPrimaryButtonClass } from "./adminStyles";
import { notifyAdminConfirm } from "./notifyAdminAction";

interface DonationManagerProps {
  donations: AdminDonationRecord[];
  projects: AdminProjectRecord[];
}

const STATUS_FILTERS: Array<DonationPromiseStatus | "ALL"> = [
  "ALL",
  "PENDING",
  "CONFIRMED",
  "CANCELLED",
];

export function DonationManager({ donations, projects }: DonationManagerProps) {
  const [status, setStatus] = useState<DonationPromiseStatus | "ALL">("ALL");
  const [projectId, setProjectId] = useState("");

  const filtered = useMemo(
    () =>
      donations.filter((donation) => {
        if (status !== "ALL" && donation.status !== status) {
          return false;
        }
        if (projectId && donation.projectId !== projectId) {
          return false;
        }
        return true;
      }),
    [donations, projectId, status],
  );

  return (
    <>
      <div className="mb-6 grid gap-3 sm:grid-cols-2">
        <label className="block">
          <span className="font-heading text-xs font-bold uppercase tracking-[0.16em] text-[#6d28d9]">
            Statut
          </span>
          <select
            value={status}
            onChange={(event) =>
              setStatus(event.target.value as DonationPromiseStatus | "ALL")
            }
            className={adminFieldClass}
          >
            {STATUS_FILTERS.map((item) => (
              <option key={item} value={item}>
                {item === "ALL" ? "Tous les statuts" : donationStatusLabels[item]}
              </option>
            ))}
          </select>
        </label>
        <label className="block">
          <span className="font-heading text-xs font-bold uppercase tracking-[0.16em] text-[#6d28d9]">
            Projet
          </span>
          <select
            value={projectId}
            onChange={(event) => setProjectId(event.target.value)}
            className={adminFieldClass}
          >
            <option value="">Tous les projets</option>
            {projects.map((project) => (
              <option key={project.id} value={project.id}>
                {project.title}
              </option>
            ))}
          </select>
        </label>
      </div>

      {filtered.length === 0 ? (
        <AdminEmptyState>Aucune promesse de don pour ces filtres.</AdminEmptyState>
      ) : (
        <div className="overflow-x-auto border border-slate-200 bg-white">
          <table className="min-w-full text-left text-sm">
            <thead className="border-b border-slate-100 bg-slate-50 font-heading text-[11px] font-bold uppercase tracking-[0.16em] text-slate-900">
              <tr>
                <th className="px-4 py-3">Donateur</th>
                <th className="px-4 py-3">Projet</th>
                <th className="px-4 py-3">Montant</th>
                <th className="px-4 py-3">Moyen</th>
                <th className="px-4 py-3">Statut</th>
                <th className="px-4 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((donation) => (
                <tr key={donation.id} className="border-b border-slate-100 last:border-0">
                  <td className="px-4 py-3">
                    <p className="font-heading font-bold text-slate-900">
                      {donation.donorName || "Anonyme"}
                    </p>
                    <p className="text-xs text-slate-500">
                      {donation.donorPhone || donation.donorEmail || "—"}
                    </p>
                    <p className="mt-0.5 text-xs text-slate-500">
                      {isDonationPromiseType(donation.type)
                        ? donationTypeLabelsAdmin[donation.type]
                        : donation.type}
                    </p>
                  </td>
                  <td className="px-4 py-3 text-slate-600">
                    {donation.projectTitle || "Soutien général"}
                  </td>
                  <td className="px-4 py-3 font-heading font-bold text-slate-900">
                    {formatFcfa(donation.amount)}
                  </td>
                  <td className="px-4 py-3 text-slate-600">
                    {isDonationPaymentMethod(donation.paymentMethod)
                      ? donationPaymentLabels[donation.paymentMethod]
                      : donation.paymentMethod}
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={
                        donation.status === "CONFIRMED"
                          ? "font-heading text-xs font-bold text-emerald-700"
                          : donation.status === "CANCELLED"
                            ? "font-heading text-xs font-bold text-slate-500"
                            : "font-heading text-xs font-bold text-amber-600"
                      }
                    >
                      {donationStatusLabels[donation.status]}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right">
                    {donation.status === "PENDING" ? (
                      <button
                        type="button"
                        className={adminPrimaryButtonClass}
                        onClick={() =>
                          notifyAdminConfirm(async () => {
                            await confirmDonationPromise(donation.id);
                          }, "Réception confirmée. La jauge du projet a été mise à jour.")
                        }
                      >
                        Confirmer la réception
                      </button>
                    ) : (
                      <span className="text-xs text-slate-400">—</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </>
  );
}
