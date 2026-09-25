"use client";

import { useState } from "react";
import { deleteSiteSetting, upsertSiteSettingFromForm } from "@/app/admin/actions";
import type { AdminSettingRecord } from "@/types";
import { formatAdminDateTime } from "@/utils/date/format";
import { AdminActionBar } from "./AdminActionBar";
import { AdminConfirmDialog, AdminDrawer } from "./AdminDrawer";
import { AdminEmptyState, AdminLabel, AdminPanel } from "./AdminPageHeader";
import { SettingForm } from "./SettingForm";

interface SettingsManagerProps {
  settings: AdminSettingRecord[];
}

type DrawerMode = "view" | "edit" | null;

export function SettingsManager({ settings }: SettingsManagerProps) {
  const [selected, setSelected] = useState<AdminSettingRecord | null>(null);
  const [mode, setMode] = useState<DrawerMode>(null);
  const [pendingDelete, setPendingDelete] = useState<AdminSettingRecord | null>(null);

  const close = () => {
    setSelected(null);
    setMode(null);
  };

  return (
    <>
      {settings.length === 0 ? (
        <AdminEmptyState>Aucun paramètre enregistré.</AdminEmptyState>
      ) : (
        <div className="overflow-x-auto border border-burgundy/15 bg-white">
          <table className="min-w-full text-left text-sm">
            <thead className="border-b border-burgundy/10 bg-cream font-heading text-[11px] font-bold uppercase tracking-[0.16em] text-burgundy">
              <tr>
                <th className="px-4 py-3">Clé</th>
                <th className="px-4 py-3">Valeur</th>
                <th className="px-4 py-3">MAJ</th>
                <th className="px-4 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {settings.map((setting) => (
                <tr key={setting.id} className="border-b border-burgundy/10 last:border-0">
                  <td className="px-4 py-3 font-heading font-bold text-burgundy">{setting.key}</td>
                  <td className="max-w-xs truncate px-4 py-3 font-mono text-xs text-[#2C2424]/70">
                    {setting.value}
                  </td>
                  <td className="px-4 py-3 text-xs text-[#2C2424]/70">
                    {formatAdminDateTime(setting.updatedAt)}
                  </td>
                  <td className="px-4 py-3">
                    <AdminActionBar
                      className="justify-end"
                      onView={() => {
                        setSelected(setting);
                        setMode("view");
                      }}
                      onEdit={() => {
                        setSelected(setting);
                        setMode("edit");
                      }}
                      onDelete={() => setPendingDelete(setting)}
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
        title={selected?.key ?? "Paramètre"}
        onClose={close}
      >
        {selected ? (
          <div className="space-y-5">
            <div>
              <AdminLabel>Clé</AdminLabel>
              <p className="mt-1 font-heading font-bold text-burgundy">{selected.key}</p>
            </div>
            <div>
              <AdminLabel>Valeur</AdminLabel>
              <pre className="mt-2 overflow-x-auto border border-burgundy/10 bg-white p-3 font-mono text-xs text-[#2C2424]">
                {selected.value}
              </pre>
            </div>
            <div>
              <AdminLabel>Mis à jour</AdminLabel>
              <p className="mt-1 text-sm">{formatAdminDateTime(selected.updatedAt)}</p>
            </div>
          </div>
        ) : null}
      </AdminDrawer>

      <AdminDrawer
        isOpen={Boolean(selected) && mode === "edit"}
        title="Éditer le paramètre"
        onClose={close}
      >
        {selected ? (
          <SettingForm
            key={selected.id}
            setting={selected}
            action={async (formData) => {
              await upsertSiteSettingFromForm(formData);
              close();
            }}
            submitLabel="Enregistrer"
          />
        ) : null}
      </AdminDrawer>

      <AdminConfirmDialog
        isOpen={Boolean(pendingDelete)}
        title="Supprimer le paramètre"
        message={`La clé « ${pendingDelete?.key ?? ""} » sera définitivement retirée.`}
        onClose={() => setPendingDelete(null)}
        onConfirm={async () => {
          if (!pendingDelete) {
            return;
          }
          const formData = new FormData();
          formData.set("id", pendingDelete.id);
          await deleteSiteSetting(formData);
          setPendingDelete(null);
        }}
      />
    </>
  );
}

export function SettingCreatePanel() {
  return (
    <AdminPanel>
      <h2 className="mb-4 font-heading text-lg font-bold text-burgundy">Nouveau paramètre</h2>
      <SettingForm action={upsertSiteSettingFromForm} submitLabel="Enregistrer" />
    </AdminPanel>
  );
}
