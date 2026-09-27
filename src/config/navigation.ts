import type { NavItem } from "@/types";

export const adminNavigation: NavItem[] = [
  { label: "Vue d'ensemble", href: "/admin" },
  { label: "Événements", href: "/admin/evenements" },
  { label: "Équipe Pastorale", href: "/admin/pasteurs" },
  { label: "Départements", href: "/admin/departements" },
  { label: "Médias", href: "/admin/medias" },
  { label: "Enseignements", href: "/admin/enseignements" },
  { label: "Projets", href: "/admin/projets" },
  { label: "Suivi des Dons", href: "/admin/dons" },
  { label: "Paramètres", href: "/admin/parametres" },
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
