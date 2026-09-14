import type {
  Event,
  EventHeadlineData,
  EventKind,
  MediaCardData,
  MonthlyGeneratedEvent,
  SpecialEvent,
} from "@/types";
import { siteConfig } from "@/config/site";
import { toGalleryImages } from "@/datas/gallery";
import { formatEventDate, formatEventTime, parseIsoDate, toDateKey } from "@/utils/date/format";

export const eventKindLabels: Record<EventKind, string> = {
  culte: "Culte",
  enseignement: "Enseignement",
  seminaire: "Séminaire",
  conference: "Conférence",
  jeunesse: "Jeunesse",
  special: "Temps fort",
  priere: "Rassemblement",
};

const nelson: Event["author"] = {
  name: "Révérend Nelson",
  role: "Papa de la maison",
  signature: "Rev. Nelson",
};

const rose: Event["author"] = {
  name: "Pasteure Rose",
  role: "Maman de la maison",
  signature: "Pasteure Rose",
};

const parfait: Event["author"] = {
  name: "Pasteur Parfait",
  role: "Pasteur associé",
  signature: "Pasteur Parfait",
};

const aziz: Event["author"] = {
  name: "Pasteur Aziz",
  role: "Pasteur associé",
  signature: "Pasteur Aziz",
};

const mainassara: Event["author"] = {
  name: "Mainassara Nelson",
  role: "Président de la jeunesse",
  signature: "Mainassara Nelson",
};

const abigail: Event["author"] = {
  name: "Abigail Mark",
  role: "Editrice",
  signature: "Abigail Mark",
};

const recurringEvents: Event[] = [
  {
    id: "rassemblement-priere",
    slug: "rassemblement-de-priere",
    title: "Rassemblement de prière",
    description: "Chaque mardi à 19h00, l'église se réunit pour prier.",
    body: "Un rendez-vous hebdomadaire pour intercéder pour les familles, la ville et les nations. Rejoignez-nous chaque mardi soir à 19h00.",
    startsAt: "2026-09-08T19:00:00",
    location: `${siteConfig.location.address}, ${siteConfig.location.country}`,
    kind: "priere",
    colorToken: "brand",
    author: nelson,
    recurrence: { kind: "weekly", weekday: 2 },
  },
  {
    id: "rassemblement-temoignages",
    slug: "rassemblement-de-temoignages",
    title: "Rassemblement de témoignages",
    description: "Chaque jeudi à 19h00, un temps pour partager ce que Dieu fait.",
    body: "Un soir pour écouter, raconter et célébrer les actes de Dieu dans la famille VOF. Chaque jeudi à 19h00.",
    startsAt: "2026-09-10T19:00:00",
    location: `${siteConfig.location.address}, ${siteConfig.location.country}`,
    kind: "priere",
    colorToken: "accent",
    author: nelson,
    recurrence: { kind: "weekly", weekday: 4 },
  },
  {
    id: "veillee-prieres",
    slug: "veillee-de-prieres",
    title: "Veillée de prières",
    description:
      "Les 2e et dernier vendredis du mois, de 23h00 à 05h00 : une nuit de prière.",
    body: "Une veillée pour chercher le Seigneur jusqu'au matin. Rendez-vous le 2e et le dernier vendredi de chaque mois, de 23h00 à 05h00.",
    startsAt: "2026-09-11T23:00:00",
    endsAt: "2026-09-12T05:00:00",
    location: `${siteConfig.location.address}, ${siteConfig.location.country}`,
    kind: "priere",
    colorToken: "impact",
    author: nelson,
    recurrence: { kind: "secondAndLastWeekday", weekday: 5 },
  },
  {
    id: "rassemblement-jeune",
    slug: "rassemblement-de-jeune-et-priere",
    title: "Rassemblement de jeûne et prière",
    description:
      "Trois jours consécutifs à 19h00 : les 1er, 2e et 3e du mois, sauf si le 1er tombe vendredi, samedi, dimanche ou lundi — le jeûne commence alors le premier mardi du mois.",
    body: "Chaque mois, l'Église Voice Of Freedom se consacre trois jours au jeûne et à la prière, à 19h00.\n\nPar défaut, le rassemblement a lieu les 1er, 2e et 3e jours du mois. Si le 1er tombe un vendredi, un samedi, un dimanche ou un lundi, le début est automatiquement reporté au premier mardi du mois : le jeûne dure alors ce mardi, mercredi et jeudi.\n\nLorsqu'un jour de jeûne coïncide avec le rassemblement de prière (mardi) ou de témoignages (jeudi), seul le jeûne est retenu.",
    startsAt: "2026-10-01T19:00:00",
    location: `${siteConfig.location.address}, ${siteConfig.location.country}`,
    kind: "priere",
    colorToken: "impact",
    author: mainassara,
    recurrence: { kind: "monthlyFasting" },
  },
];

const IMPACT_COLOR = "impact" as const;
const venue = `${siteConfig.location.address}, ${siteConfig.location.country}`;

export const specialEvents: SpecialEvent[] = [
  {
    id: "culte-2026-09-06",
    slug: "culte-dominical-6-septembre",
    title: "Culte dominical — Une voix de liberté",
    description:
      "Adoration, Parole et communion. Toute la famille VOF est invitée.",
    body: "Chaque dimanche à 9h00, l'Église Voice Of Freedom se rassemble pour adorer, écouter la Parole et grandir ensemble. Ce culte ouvre le mois de septembre sur le thème d'une voix de liberté pour cette génération.\n\nVenez en famille. Un accueil est prévu dès 8h30, et le pôle enfance accompagne les plus jeunes pendant la prédication.",
    startsAt: "2026-09-06T09:00:00",
    location: "Niamey, Niger",
    kind: "culte",
    colorToken: "brand",
    isFeatured: true,
    author: nelson,
    gallery: [
      { id: "g1", alt: "Assemblée en adoration", caption: "Louange d'ouverture" },
      { id: "g2", alt: "Prédication du Révérend Nelson", caption: "La Parole" },
      { id: "g3", alt: "Temps de communion", caption: "Famille VOF" },
    ],
    comments: [
      {
        id: "c1",
        authorName: "Awa K.",
        postedAt: "2026-09-06T12:30:00",
        message: "Quelle présence de Dieu ce matin. Merci pour cette parole libératrice.",
      },
      {
        id: "c2",
        authorName: "Jean-Marc T.",
        postedAt: "2026-09-06T14:10:00",
        message: "Le culte en famille nous a fait du bien. À dimanche prochain !",
      },
    ],
  },
  {
    id: "enseignement-2026-09-10",
    slug: "enseignement-marcher-dans-la-liberte",
    title: "Enseignement — Marcher dans la liberté",
    description:
      "Soirée d'enseignement biblique pour ancrer la vision VOF dans la Parole.",
    body: "Un temps plus posé que le culte du dimanche : lecture, explication et application. Nous ouvrons le livre et laissons l'Écriture former notre liberté en Christ.\n\nApportez votre Bible. Un moment de questions-réponses clôtura la soirée.",
    startsAt: "2026-09-10T19:00:00",
    location: "Niamey, Niger",
    kind: "enseignement",
    colorToken: "brand",
    isFeatured: true,
    author: parfait,
    gallery: [
      { id: "g1", alt: "Étude biblique", caption: "La Parole ouverte" },
      { id: "g2", alt: "Prises de notes", caption: "Discipulat" },
    ],
    comments: [
      {
        id: "c1",
        authorName: "Sarah N.",
        postedAt: "2026-09-10T21:20:00",
        message: "Enseignement clair et profond. J'ai compris autrement Galates 5.",
      },
    ],
  },
  {
    id: "culte-2026-09-13",
    slug: "culte-dominical-13-septembre",
    title: "Culte dominical",
    description: "Rendez-vous du dimanche à 9h00.",
    body: "Nous continuons la série sur la liberté en Christ. Un temps d'accueil des nouveaux est prévu à la fin du culte.",
    startsAt: "2026-09-13T09:00:00",
    location: "Niamey, Niger",
    kind: "culte",
    colorToken: "brand",
    author: nelson,
  },
  {
    id: "seminaire-2026-09-19",
    slug: "seminaire-foi-victoire",
    title: "Séminaire Foi & Victoire",
    description:
      "Temps fort d'enseignement et de combat de foi pour toute l'église.",
    body: "Une journée pour fortifier la foi, prier avec autorité et recevoir une parole de victoire. Ateliers le matin, session plénière l'après-midi.\n\nL'inscription est demandée pour préparer l'accueil et les supports.",
    startsAt: "2026-09-19T09:00:00",
    endsAt: "2026-09-19T16:00:00",
    location: "Niamey, Niger",
    kind: "seminaire",
    colorToken: "impact",
    isFeatured: true,
    registrationRequired: true,
    author: rose,
    gallery: [
      { id: "g1", alt: "Session plénière du séminaire", caption: "Assemblée" },
      { id: "g2", alt: "Atelier de prière", caption: "Intercession" },
      { id: "g3", alt: "Temps de déclaration", caption: "Victoire" },
    ],
    comments: [
      {
        id: "c1",
        authorName: "Pascaline D.",
        postedAt: "2026-09-19T17:05:00",
        message: "Séminaire puissant. Merci Pasteur pour ces clés de foi.",
      },
    ],
  },
  {
    id: "culte-2026-09-20",
    slug: "culte-dominical-20-septembre",
    title: "Culte de clôture du séminaire",
    description: "Culte de clôture du séminaire Foi & Victoire.",
    body: "Nous scellons le séminaire dans l'adoration. Témoignages, sainte cène et une parole de commission pour la semaine.",
    startsAt: "2026-09-20T09:00:00",
    location: "Niamey, Niger",
    kind: "culte",
    colorToken: "brand",
    author: abigail,
  },
  {
    id: "jeunesse-2026-09-25",
    slug: "soiree-jeunesse-septembre",
    title: "Soirée Jeunesse VOF",
    description: "Louange, Parole et convivialité pour les jeunes.",
    body: "Le pôle jeunesse ouvre ses portes : louange contemporaine, un message court et un temps fraternel. Amenez un ami.\n\nDès 18h30. Tenue simple, cœur ouvert.",
    startsAt: "2026-09-25T18:30:00",
    location: "Niamey, Niger",
    kind: "jeunesse",
    colorToken: "secondary",
    isFeatured: true,
    author: mainassara,
    gallery: [
      { id: "g1", alt: "Jeunes en louange", caption: "Worship" },
      { id: "g2", alt: "Cercle de discussion", caption: "Parole" },
    ],
    comments: [
      {
        id: "c1",
        authorName: "Kevin M.",
        postedAt: "2026-09-25T21:40:00",
        message: "Ambiance belle et Parole qui parle à notre génération. Merci Past. Rose.",
      },
    ],
  },
  {
    id: "conference-2026-10-03",
    slug: "conference-voix-de-liberte",
    title: "Conférence Une voix de liberté",
    description: "Conférence spéciale ouverte à la ville.",
    body: "Une soirée ouverte au-delà des murs de l'église : une parole d'espérance pour Abidjan. Invitations à partager largement.\n\nPortes ouvertes à 17h30, conférence à 18h00.",
    startsAt: "2026-10-03T18:00:00",
    location: "Niamey, Niger",
    kind: "conference",
    colorToken: "accent",
    isFeatured: true,
    author: aziz,
    gallery: [
      { id: "g1", alt: "Scène de la conférence", caption: "Ouverture" },
      { id: "g2", alt: "Public de la ville", caption: "Accueil" },
    ],
  },
  {
    id: "seminaire-2026-11-10",
    slug: "seminaire-quatre-jours-novembre",
    title: "Séminaire Quatre jours de gloire",
    description:
      "Quatre jours d'enseignement, de prière et de communion pour toute l'église.",
    body: "Un temps fort de quatre jours : enseignement le matin, ateliers l'après-midi, et un temps d'autel chaque soir.\n\nL'inscription est demandée pour préparer l'accueil et les supports.",
    startsAt: "2026-11-10T09:00:00",
    endsAt: "2026-11-13T16:00:00",
    location: venue,
    kind: "seminaire",
    registrationRequired: true,
    isFeatured: true,
    author: nelson,
  },
  {
    id: "reveillon-2026-12-31",
    slug: "reveillon-31-decembre",
    title: "Réveillon de la Saint-Sylvestre",
    description:
      "Culte de clôture d'année : adoration, Parole et veillée jusqu'au 1er janvier.",
    body: "Nous refermons l'année dans la présence de Dieu. Un temps de reconnaissance, une parole prophétique pour 2027, puis un moment fraternel.\n\nOuverture des portes à 20h00.",
    startsAt: "2026-12-31T20:00:00",
    location: venue,
    kind: "special",
    author: nelson,
  },
];

export const events: Event[] = [
  ...recurringEvents,
  ...specialEvents.map(toCatalogEvent),
];

export function getSpecialEvents(
  year: number,
  month: number,
): MonthlyGeneratedEvent[] {
  const monthStart = new Date(year, month - 1, 1);
  const monthEnd = new Date(year, month, 0);
  const items: MonthlyGeneratedEvent[] = [];

  for (const event of specialEvents) {
    const start = parseIsoDate(event.startsAt);
    const end = event.endsAt ? parseIsoDate(event.endsAt) : start;
    const sameDay = toDateKey(start) === toDateKey(end);
    const time = formatEventTime(event.startsAt);
    const timeEnd = sameDay && event.endsAt ? formatEventTime(event.endsAt) : undefined;

    for (const day of eachDay(start, end)) {
      if (day < monthStart || day > monthEnd) {
        continue;
      }
      items.push({
        id: `${event.id}-${toDateKey(day)}`,
        title: event.title,
        date: day,
        time: time || "09h00",
        timeEnd,
        type: "special",
        colorToken: event.colorToken ?? IMPACT_COLOR,
        location: event.location,
        kind: event.kind,
      });
    }
  }

  return items;
}

function toCatalogEvent(event: SpecialEvent): Event {
  return {
    ...event,
    colorToken: event.colorToken ?? IMPACT_COLOR,
  };
}

function eachDay(start: Date, end: Date) {
  const days: Date[] = [];
  const cursor = new Date(start.getFullYear(), start.getMonth(), start.getDate());
  const last = new Date(end.getFullYear(), end.getMonth(), end.getDate());

  while (cursor <= last) {
    days.push(new Date(cursor));
    cursor.setDate(cursor.getDate() + 1);
  }

  return days;
}

export function getEventBySlug(slug: string): Event | undefined {
  return events.find((event) => event.slug === slug);
}

export function getFeaturedEvents(): Event[] {
  return events.filter((event) => event.isFeatured);
}

export function toMediaCard(event: Event): MediaCardData {
  const time = formatEventTime(event.startsAt);

  return {
    href: `/vie-de-leglise/${event.slug}`,
    title: event.title,
    imageAlt: event.title,
    imageSrc: event.imageUrl,
    badge: eventKindLabels[event.kind],
    description: event.description,
    location: event.location,
    dateLabel: `${formatEventDate(event.startsAt)}${time ? ` · ${time}` : ""}`,
    colorToken: event.colorToken,
  };
}

export function toEventHeadline(event: Event): EventHeadlineData {
  const time = formatEventTime(event.startsAt);

  return {
    badge: eventKindLabels[event.kind],
    title: event.title,
    dateLabel: `${formatEventDate(event.startsAt)}${time ? ` · ${time}` : ""}`,
    location: event.location,
    colorToken: event.colorToken,
  };
}

export function toEventDetailView(event: Event) {
  return {
    headline: toEventHeadline(event),
    body: event.body ?? event.description,
    gallery: toGalleryImages(event.gallery),
    author: event.author,
    youtubeId: event.youtubeId,
    cover: {
      alt: event.title,
      src: event.imageUrl,
      colorToken: event.colorToken,
    },
    comments: event.comments,
    title: event.title,
  };
}
