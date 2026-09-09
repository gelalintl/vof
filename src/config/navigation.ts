import type { NavItem } from "@/types";

export const mainNavigation: NavItem[] = [
  { label: "Accueil", href: "/" },
  { label: "À propos", href: "/a-propos" },
  {
    label: "Vie de l'église",
    href: "/vie-de-leglise",
  },
  { label: "Départements", href: "/departements" },
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
      { label: "Enseignements", href: "/vie-de-leglise" },
      { label: "Soutenir", href: "/don" },
      { label: "Nous rejoindre", href: "/departements" },
    ],
  },
];
