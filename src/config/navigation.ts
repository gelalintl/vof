import type { AdminNavItem, AdminUserRole, NavItem } from "@/types";
import { ACCOUNT_ROLES, ACCOUNTING_ROLES, CONTENT_ROLES } from "@/lib/roles";

const ALL_ROLES: AdminUserRole[] = [...ACCOUNT_ROLES];

export const adminNavigation: AdminNavItem[] = [
  { label: "Vue d'ensemble", href: "/sacristie", allowedRoles: ALL_ROLES },
  { label: "Événements", href: "/sacristie/evenements", allowedRoles: [...CONTENT_ROLES] },
  { label: "Équipe Pastorale", href: "/sacristie/pasteurs", allowedRoles: [...CONTENT_ROLES] },
  { label: "Départements", href: "/sacristie/departements", allowedRoles: [...CONTENT_ROLES] },
  { label: "Médias", href: "/sacristie/medias", allowedRoles: [...CONTENT_ROLES] },
  { label: "Enseignements", href: "/sacristie/enseignements", allowedRoles: [...CONTENT_ROLES] },
  { label: "Témoignages", href: "/sacristie/temoignages", allowedRoles: [...CONTENT_ROLES] },
  { label: "Projets", href: "/sacristie/projets", allowedRoles: [...ACCOUNTING_ROLES] },
  { label: "Suivi des Dons", href: "/sacristie/dons", allowedRoles: [...ACCOUNTING_ROLES] },
  { label: "Administrateurs", href: "/sacristie/utilisateurs", allowedRoles: ["SUPERADMIN", "ADMIN"] },
  { label: "Rapports", href: "/sacristie/rapports", allowedRoles: ["SUPERADMIN", "ADMIN"] },
  { label: "Mon compte", href: "/sacristie/utilisateurs", allowedRoles: ["REDACTEUR", "COMPTABLE"] },
  { label: "Paramètres", href: "/sacristie/parametres", allowedRoles: ALL_ROLES },
];

export const mainNavigation: NavItem[] = [
  { label: "Accueil", href: "/" },
  { label: "À propos", href: "/a-propos" },
  {
    label: "Vie de l'église",
    href: "/vie-de-leglise",
  },
  { label: "Enseignements", href: "/enseignements" },
  { label: "Départements", href: "/departements" },
  { label: "Projets", href: "/projets" },
  { label: "Contact", href: "/contact" },
];

export const footerColumns: { title: string; links: NavItem[] }[] = [
  {
    title: "L'église",
    links: [
      { label: "À propos", href: "/a-propos" },
      { label: "Vie de l'église", href: "/vie-de-leglise" },
      { label: "Départements", href: "/departements" },
      { label: "Contact", href: "/contact" },
    ],
  },
  {
    title: "Ressources",
    links: [
      { label: "Enseignements", href: "/enseignements" },
      { label: "Projets", href: "/projets" },
      { label: "Soutenir", href: "/don" },
      { label: "Nous rejoindre", href: "/departements" },
    ],
  },
];
