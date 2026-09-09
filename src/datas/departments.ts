import type { Department } from "@/types";

export const departments: Department[] = [
  {
    id: "chorale",
    slug: "chorale",
    name: "Chorale",
    description:
      "Prépare le climat d'adoration des cultes : chant, musique et présence de Dieu au centre de l'assemblée.",
    leader: "Responsable VOF : Emmanuel",
    meetingSchedule: "Samedi 17h30 · Répétition",
    contact: "+227 XX XX XX XX",
    icon: "music",
    colorToken: "brand",
  },
  {
    id: "intercession",
    slug: "intercession",
    name: "Intercession",
    description:
      "Veilleurs de la maison : prière pour l'église, la ville et les nations, avant et pendant les cultes.",
    leader: "Responsable Intercession : Pasteur Parfait",
    meetingSchedule: "Mercredi 19h00 · Guerriers de prière",
    contact: "+227 XX XX XX XX",
    icon: "heart",
    colorToken: "brand",
  },
  {
    id: "protocole",
    slug: "protocole",
    name: "Protocole",
    description:
      "Premier sourire de VOF. Oriente les visiteurs, prépare la salle et veille à ce que chacun se sente attendu.",
    leader: "Responsable Protocole : Akueté",
    meetingSchedule: "Dimanche 08h15 · Briefing",
    contact: "+227 XX XX XX XX",
    icon: "handshake",
    colorToken: "secondary",
  },
  {
    id: "jeunesse",
    slug: "jeunesse",
    name: "La jeunesse",
    description:
      "Un pôle pour les adolescents et jeunes adultes : Parole, amitié, mission et une foi incarnée dans leur génération.",
    leader: "Responsable Jeunesse : Mainassara Nelson",
    meetingSchedule: "Vendredi 18h30 · Rencontre jeunes",
    contact: "+227 XX XX XX XX",
    icon: "users",
    colorToken: "secondary",
  },
  {
    id: "enfants",
    slug: "enfants",
    name: "Enfants",
    description:
      "Éveil biblique et accueil des enfants pendant le culte, dans un cadre sûr, joyeux et adapté à leur âge.",
    leader: "Responsable des enfants : Pasteure Rose",
    meetingSchedule: "Dimanche 09h00 · Pendant le culte",
    contact: "+227 XX XX XX XX",
    icon: "baby",
    colorToken: "accent",
  },
  {
    id: "media",
    slug: "media",
    name: "Média & Communication",
    description:
      "Captation, replay, graphisme et diffusion : rendre visible la vie de l'église, y compris sur les réseaux 3G/4G.",
    leader: "Responsable Média : Mainassara Nelson",
    meetingSchedule: "Dimanche 08h00 · Régie",
    contact: "+227 XX XX XX XX",
    icon: "video",
    colorToken: "brand",
  },
  {
    id: "nettoage",
    slug: "nettoage",
    name: "Nettoyage",
    description:
      "Tenir la maison de Dieu propre et assurer aux enfants de Dieu un cadre sain et propice à la prière, telle est notre mission.",
    leader: "Responsable Nettoyage : Alfred",
    meetingSchedule: "Tous les samedis · 20h00",
    contact: "+227 XX XX XX XX",
    icon: "hand-helping",
    colorToken: "impact",
  },
  {
    id: "visite",
    slug: "visite",
    name: "Cellules de visite",
    description:
      "Petits groupes en semaine pour prier, étudier la Parole et tisser des liens au-delà du dimanche.",
    leader: "Responsable de la cellule de visites : Pasteur Parfait",
    meetingSchedule: "Mercredi 19h00 · Groupes de maison",
    contact: "+227 XX XX XX XX",
    icon: "home",
    colorToken: "secondary",
  },
];
