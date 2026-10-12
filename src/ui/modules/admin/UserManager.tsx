"use client";

import { useEffect, useState } from "react";
import { KeyRound, Pencil, Plus, Trash2, X } from "lucide-react";
import {
  createUser,
  deleteUser,
  updateUser,
  updateUserPassword,
} from "@/app/admin/utilisateurs/actions";
import type { AdminUserRecord, AdminUserRole } from "@/types";
import { formatPublicationDate } from "@/utils/date/format";
import { AdminConfirmDialog, AdminDrawer } from "./AdminDrawer";
import { AdminEmptyState, AdminLabel } from "./AdminPageHeader";
import { AdminSubmitButton } from "./AdminSubmitButton";
import { PasswordInput } from "./PasswordInput";
import { adminFieldClass, adminPrimaryButtonClass } from "./adminStyles";
import { notifyAdminAction, notifyAdminConfirm } from "./notifyAdminAction";

interface UserManagerProps {
  users: AdminUserRecord[];
  /** Rôle du compte connecté : seul le SUPERADMIN peut ajouter / supprimer des comptes. */
  currentRole: AdminUserRole;
}

const MIN_PASSWORD_LENGTH = 8;

const iconButtonClass =
  "inline-flex size-9 items-center justify-center border border-slate-200 text-slate-900 hover:bg-[#6d28d9] hover:text-white disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:bg-transparent disabled:hover:text-slate-900";

export function UserManager({ users, currentRole }: UserManagerProps) {
  const [creating, setCreating] = useState(false);
  const [editTarget, setEditTarget] = useState<AdminUserRecord | null>(null);
  const [passwordTarget, setPasswordTarget] = useState<AdminUserRecord | null>(null);
  const [pendingDelete, setPendingDelete] = useState<AdminUserRecord | null>(null);

  const isSuperAdmin = currentRole === "SUPERADMIN";
  const isLastUser = users.length <= 1;

  return (
    <>
      {isSuperAdmin ? (
        <div className="mb-6 flex justify-end">
          <button
            type="button"
            className={adminPrimaryButtonClass}
            onClick={() => setCreating(true)}
          >
            <Plus className="mr-2 size-4" aria-hidden />
            Ajouter un administrateur
          </button>
        </div>
      ) : null}

      {users.length === 0 ? (
        <AdminEmptyState>Aucun administrateur enregistré.</AdminEmptyState>
      ) : (
        <div className="overflow-x-auto border border-slate-200 bg-white">
          <table className="min-w-full text-left text-sm">
            <thead className="border-b border-slate-100 bg-slate-50 font-heading text-[11px] font-bold uppercase tracking-[0.16em] text-slate-900">
              <tr>
                <th className="px-4 py-3">Nom</th>
                <th className="px-4 py-3">Email</th>
                {isSuperAdmin ? <th className="px-4 py-3">Rôle</th> : null}
                <th className="px-4 py-3">Date de création</th>
                <th className="px-4 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => {
                const label = user.name || user.email;
                const deleteDisabled =
                  isLastUser || user.isCurrent || user.role === "SUPERADMIN";

                return (
                  <tr key={user.id} className="border-b border-slate-100 last:border-0">
                    <td className="px-4 py-3 font-heading font-bold text-slate-900">
                      {user.name || <span className="font-normal text-slate-400">—</span>}
                      {user.isCurrent ? (
                        <span className="ml-2 border border-violet-200 bg-violet-50 px-1.5 py-0.5 font-heading text-[10px] font-bold uppercase tracking-[0.12em] text-violet-700">
                          Vous
                        </span>
                      ) : null}
                    </td>
                    <td className="px-4 py-3 font-mono text-xs text-slate-600">{user.email}</td>
                    {isSuperAdmin ? (
                      <td className="px-4 py-3 text-slate-600">
                        {user.role === "SUPERADMIN" ? "Super-administrateur" : "Administrateur"}
                      </td>
                    ) : null}
                    <td className="whitespace-nowrap px-4 py-3 text-slate-600">
                      {formatPublicationDate(user.createdAt)}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex justify-end gap-1.5">
                        <button
                          type="button"
                          onClick={() => setEditTarget(user)}
                          className={iconButtonClass}
                          aria-label={`Modifier le nom et l'email de ${label}`}
                          title="Modifier le nom et l'email"
                        >
                          <Pencil className="size-4" />
                        </button>
                        <button
                          type="button"
                          onClick={() => setPasswordTarget(user)}
                          className={iconButtonClass}
                          aria-label={
                            user.isCurrent
                              ? "Changer mon mot de passe"
                              : `Réinitialiser le mot de passe de ${label}`
                          }
                          title={
                            user.isCurrent ? "Changer mon mot de passe" : "Réinitialiser le mot de passe"
                          }
                        >
                          <KeyRound className="size-4" />
                        </button>
                        {isSuperAdmin ? (
                          <button
                            type="button"
                            disabled={deleteDisabled}
                            onClick={() => setPendingDelete(user)}
                            className={iconButtonClass}
                            aria-label={`Supprimer l'accès de ${label}`}
                            title={
                              user.isCurrent
                                ? "Vous ne pouvez pas supprimer votre propre accès"
                                : user.role === "SUPERADMIN"
                                  ? "Le super-administrateur ne peut pas être supprimé"
                                  : isLastUser
                                    ? "Le dernier compte ne peut pas être supprimé"
                                    : "Supprimer"
                            }
                          >
                            <Trash2 className="size-4" />
                          </button>
                        ) : null}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      <AdminDrawer
        isOpen={creating}
        title="Ajouter un administrateur"
        description="Le nouveau compte aura accès à tout le back-office."
        onClose={() => setCreating(false)}
      >
        <form
          key="create-user"
          action={notifyAdminAction(
            async (formData) => {
              await createUser({
                name: String(formData.get("name") ?? ""),
                email: String(formData.get("email") ?? ""),
                password: String(formData.get("password") ?? ""),
              });
            },
            "Administrateur ajouté.",
            () => setCreating(false),
          )}
          className="grid gap-4"
        >
          <label className="block">
            <AdminLabel>Nom</AdminLabel>
            <input
              name="name"
              required
              maxLength={120}
              autoComplete="off"
              className={adminFieldClass}
            />
          </label>
          <label className="block">
            <AdminLabel>Email</AdminLabel>
            <input
              name="email"
              type="email"
              required
              autoComplete="off"
              className={adminFieldClass}
            />
          </label>
          <label className="block">
            <AdminLabel>Mot de passe</AdminLabel>
            <PasswordInput
              name="password"
              required
              minLength={MIN_PASSWORD_LENGTH}
              maxLength={72}
              autoComplete="new-password"
            />
            <span className="mt-1 block text-xs text-slate-500">
              {MIN_PASSWORD_LENGTH} caractères minimum.
            </span>
          </label>
          <div>
            <AdminSubmitButton>Créer le compte</AdminSubmitButton>
          </div>
        </form>
      </AdminDrawer>

      <AdminDrawer
        isOpen={Boolean(editTarget)}
        title="Modifier le compte"
        description="Nom et adresse e-mail utilisée pour se connecter."
        onClose={() => setEditTarget(null)}
      >
        {editTarget ? (
          <form
            key={editTarget.id}
            action={notifyAdminAction(
              async (formData) => {
                await updateUser(editTarget.id, {
                  name: String(formData.get("name") ?? ""),
                  email: String(formData.get("email") ?? ""),
                });
              },
              "Compte mis à jour.",
              () => setEditTarget(null),
            )}
            className="grid gap-4"
          >
            <label className="block">
              <AdminLabel>Nom</AdminLabel>
              <input
                name="name"
                required
                maxLength={120}
                defaultValue={editTarget.name ?? ""}
                autoComplete="off"
                className={adminFieldClass}
              />
            </label>
            <label className="block">
              <AdminLabel>Email</AdminLabel>
              <input
                name="email"
                type="email"
                required
                defaultValue={editTarget.email}
                autoComplete="off"
                className={adminFieldClass}
              />
              {editTarget.isCurrent ? (
                <span className="mt-1 block text-xs text-slate-500">
                  Cette adresse sera votre nouvel identifiant de connexion.
                </span>
              ) : null}
            </label>
            <div>
              <AdminSubmitButton>Enregistrer les modifications</AdminSubmitButton>
            </div>
          </form>
        ) : null}
      </AdminDrawer>

      <PasswordDialog
        user={passwordTarget}
        onClose={() => setPasswordTarget(null)}
      />

      <AdminConfirmDialog
        isOpen={Boolean(pendingDelete)}
        title="Supprimer l'accès"
        message={`Êtes-vous sûr de vouloir supprimer cet accès ? Le compte « ${
          pendingDelete?.email ?? ""
        } » ne pourra plus se connecter à l'administration.`}
        onClose={() => setPendingDelete(null)}
        onConfirm={async () => {
          if (!pendingDelete) {
            return;
          }
          try {
            await notifyAdminConfirm(() => deleteUser(pendingDelete.id), "Accès supprimé.");
          } catch {
            // L'erreur est déjà affichée dans un toast.
          }
          setPendingDelete(null);
        }}
      />
    </>
  );
}

function PasswordDialog({
  user,
  onClose,
}: {
  user: AdminUserRecord | null;
  onClose: () => void;
}) {
  useEffect(() => {
    if (!user) {
      return;
    }
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
      }
    };
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [user, onClose]);

  if (!user) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-[95] flex items-center justify-center p-4">
      <button
        type="button"
        aria-label="Annuler"
        className="absolute inset-0 bg-slate-900/50"
        onClick={onClose}
      />
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="admin-password-title"
        className="relative w-full max-w-md border border-slate-200 bg-white p-6 shadow-2xl"
      >
        <button
          type="button"
          onClick={onClose}
          className="absolute right-3 top-3 p-2 text-slate-500 hover:text-slate-900"
          aria-label="Fermer"
        >
          <X className="size-5" />
        </button>
        <h2
          id="admin-password-title"
          className="font-heading text-xl font-extrabold text-slate-900"
        >
          {user.isCurrent ? "Changer mon mot de passe" : "Réinitialiser le mot de passe"}
        </h2>
        <p className="mt-2 text-sm text-slate-600">
          {user.isCurrent ? (
            "Saisissez votre mot de passe actuel pour en définir un nouveau."
          ) : (
            <>
              Nouveau mot de passe pour{" "}
              <span className="font-bold">{user.name || user.email}</span> ({user.email}). Son
              ancien mot de passe n&apos;est pas demandé.
            </>
          )}
        </p>
        <form
          key={user.id}
          action={notifyAdminAction(
            async (formData) => {
              await updateUserPassword(
                user.id,
                String(formData.get("password") ?? ""),
                user.isCurrent ? String(formData.get("currentPassword") ?? "") : undefined,
              );
            },
            "Mot de passe mis à jour.",
            onClose,
          )}
          className="mt-5 grid gap-4"
        >
          {user.isCurrent ? (
            <label className="block">
              <AdminLabel>Mot de passe actuel</AdminLabel>
              <PasswordInput
                name="currentPassword"
                required
                maxLength={72}
                autoComplete="current-password"
                autoFocus
              />
            </label>
          ) : null}
          <label className="block">
            <AdminLabel>Nouveau mot de passe</AdminLabel>
            <PasswordInput
              name="password"
              required
              minLength={MIN_PASSWORD_LENGTH}
              maxLength={72}
              autoComplete="new-password"
              autoFocus={!user.isCurrent}
            />
            <span className="mt-1 block text-xs text-slate-500">
              {MIN_PASSWORD_LENGTH} caractères minimum.
            </span>
          </label>
          <div className="flex justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="h-10 border border-slate-200 px-4 font-heading text-sm font-bold text-slate-800"
            >
              Annuler
            </button>
            <AdminSubmitButton className="h-10 px-4">Enregistrer</AdminSubmitButton>
          </div>
        </form>
      </div>
    </div>
  );
}
