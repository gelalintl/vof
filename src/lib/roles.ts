import type { AdminUserRole } from "@/types";

/** Agenda, médias, enseignements, équipe, départements, témoignages, paramètres éditoriaux. */
export const CONTENT_ROLES = ["SUPERADMIN", "ADMIN", "REDACTEUR"] as const satisfies readonly AdminUserRole[];

/** Dons, projets et paramètres de paiement. */
export const ACCOUNTING_ROLES = ["SUPERADMIN", "ADMIN", "COMPTABLE"] as const satisfies readonly AdminUserRole[];

/** Tout compte connecté peut ouvrir son propre profil. */
export const ACCOUNT_ROLES = ["SUPERADMIN", "ADMIN", "REDACTEUR", "COMPTABLE"] as const satisfies readonly AdminUserRole[];

/** Création et édition de comptes : le SUPERADMIN n'est jamais proposé. */
export const ASSIGNABLE_USER_ROLES = ["ADMIN", "REDACTEUR", "COMPTABLE"] as const satisfies readonly AdminUserRole[];

export const USER_ROLE_LABELS: Record<AdminUserRole, string> = {
  SUPERADMIN: "Super-administrateur",
  ADMIN: "Administrateur",
  REDACTEUR: "Rédacteur",
  COMPTABLE: "Comptable",
};

export function roleIsAllowed(role: AdminUserRole, allowedRoles: readonly AdminUserRole[]) {
  return role === "SUPERADMIN" || allowedRoles.includes(role);
}
