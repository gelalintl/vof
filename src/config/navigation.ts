import type { NavItem } from "@/types";

export const adminNavigation: NavItem[] = [
  { label: "Vue d'ensemble", href: "/admin" },
  { label: "Événements", href: "/admin/evenements" },
  { label: "Médias", href: "/admin/medias" },
  { label: "Enseignements", href: "/admin/enseignements" },
  { label: "Paramètres", href: "/admin/parametres" },
];

export const mainNavigation: NavItem[] = [
  { label: "Accueil", href: "/" },
  { label: "À propos", href: "/a-propos" },
  {
    label: "Vie de l'église",
    href: "/vie-de-leglise",
  },
  { label: "Rassemblements", href: "/rassemblements" },
  { label: "Enseignements", href: "/enseignements" },
  { label: "Départements", href: "/departements" },
  { label: "Contact", href: "/contact" },
];

export const footerColumns: { title: string; links: NavItem[] }[] = [
  {
    title: "L'église",
    links: [
      { label: "À propos", href: "/a-propos" },
      { label: "Vie de l'église", href: "/vie-de-leglise" },
      { label: "Rassemblements", href: "/rassemblements" },
      { label: "Départements", href: "/departements" },
      { label: "Contact", href: "/contact" },
    ],
  },
  {
    title: "Ressources",
    links: [
      { label: "Enseignements", href: "/enseignements" },
      { label: "Soutenir", href: "/don" },
      { label: "Nous rejoindre", href: "/departements" },
    ],
  },
];
