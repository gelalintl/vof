import type { NavItem } from "@/types";

export const adminNavigation: NavItem[] = [
  { label: "Vue d'ensemble", href: "/sacristie" },
  { label: "Événements", href: "/sacristie/evenements" },
  { label: "Équipe Pastorale", href: "/sacristie/pasteurs" },
  { label: "Départements", href: "/sacristie/departements" },
  { label: "Médias", href: "/sacristie/medias" },
  { label: "Enseignements", href: "/sacristie/enseignements" },
  { label: "Témoignages", href: "/sacristie/temoignages" },
  { label: "Projets", href: "/sacristie/projets" },
  { label: "Suivi des Dons", href: "/sacristie/dons" },
  { label: "Administrateurs", href: "/sacristie/utilisateurs" },
  { label: "Paramètres", href: "/sacristie/parametres" },
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
