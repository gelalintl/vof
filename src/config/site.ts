import type { DonationOption, MobileMoneyAccount, RibDetails } from "@/types";

export const siteConfig = {
  name: "VOF",
  legalName: "Église Voice Of Freedom",
  tagline: "Centre de solutions de Jésus-Christ",
  description:
    "Plateforme officielle de l'Église Voice Of Freedom — cultes, enseignements et vie communautaire.",
  locale: "fr-FR",
  currency: "FCFA",
  worship: {
    sunday: {
      label: "Culte dominical",
      day: "Dimanche",
      time: "09h00",
    },
    gatherings: [
      {
        id: "sunday",
        label: "Culte dominical",
        day: "Dimanche",
        time: "09h00",
      },
      {
        id: "advisory-and-prayer",
        label: "Conseil & Prière",
        day: "Lundi",
        time: "15h00",
      },
      {
        id: "prayer",
        label: "Etude biblique",
        day: "Mardi",
        time: "19h00",
      },
      {
        id: "prayer-warriors",
        label: "Guerriers de prière",
        day: "Mercredi",
        time: "19h00",
      },
      {
        id: "testimony",
        label: "Prière et témoignages",
        day: "Jeudi",
        time: "19h00",
      },
      {
        id: "vigil",
        label: "Veillée de prière",
        day: "2e et dernier vendredi du mois",
        time: "23h00 – 05h00",
      },
      {
        id: "fasting",
        label: "Jeûne et prière",
        day: "1er, 2e et 3e du mois",
        time: "19h00",
      },
    ],
  },
  location: {
    label: "Adresse",
    address: "A côté du cimétière de Yantala, non loin du CEG 25, Niamey",
    country: "Niger",
    mapsShareUrl: "https://maps.app.goo.gl/L5HcxHPG8WdVfAmu9",
    mapsEmbedUrl:
      "https://www.google.com/maps?q=13.546976,2.0739387&z=18&output=embed",
  },
  contacts: {
    email: "contact@vof-eglise.org",
    phone: "+227 XXXXXXXXXX",
    phones: [
      { label: "Secrétariat", number: "+227 00000000" },
      { label: "Accueil culte", number: "+227 00000000" },
    ],
    hours: [
      { label: "Culte dominical", value: "Dimanche · 09h00" },
      { label: "Rassemblement de prière", value: "Mardi · 19h00" },
      { label: "Rassemblement de témoignages", value: "Jeudi · 19h00" },
      {
        label: "Veillée de prières",
        value: "2e et dernier vendredi du mois · 23h00 – 05h00",
      },
      {
        label: "Rassemblement de jeûne et prière",
        value:
          "1er, 2e et 3e du mois · 19h00 (report au 1er mardi si ven.–lun.)",
      },
    ],
    whatsapp: {
      label: "WhatsApp VOF",
      href: "https://wa.me/22700000000",
    },
    whatsappChannel: {
      label: "Canal WhatsApp VOF",
      href: "https://whatsapp.com/channel/0029Vb0Xq6i8KMquBW2KUK0Y",
    },
  },
  social: {
    youtube: "http://www.youtube.com/@eglisevof6303",
    facebook: "https://www.facebook.com/share/1HewwYoxa1/",
    instagram: "https://www.instagram.com/eglise_vof?stkn=MmlwOTZnbnQ0YmVx",
  },
  media: {
    featuredYoutubeId: "",
    featuredYoutubeTitle: "Replay du culte dominical",
  },
  pastoral: {
    senior: {
      name: "Révérend Pasteur Nelson Nwene",
      role: "Papa de la maison",
    },
    associate: {
      name: "Pasteure Rose Nwene",
      role: "Maman de la maison",
    },
    pastorParfait: {
      name: "Pasteur Parfait",
      role: "Pasteur associé",
    },
    pastorAziz: {
      name: "Pasteur Aziz",
      role: "Pasteur associé",
    },
  },
} as const;

export const donationOptions: DonationOption[] = [
  {
    id: "1000",
    label: "1 000 FCFA",
    amountFcfa: 1000,
    description: "Une semence de gratitude",
  },
  {
    id: "5000",
    label: "5 000 FCFA",
    amountFcfa: 5000,
    description: "Soutien aux cultes",
  },
  {
    id: "10000",
    label: "10 000 FCFA",
    amountFcfa: 10000,
    description: "Partenaire de la vision",
  },
  {
    id: "25000",
    label: "25 000 FCFA",
    amountFcfa: 25000,
    description: "Soutien aux missions",
  },
  {
    id: "50000",
    label: "50 000 FCFA",
    amountFcfa: 50000,
    description: "Offrande spéciale",
  },
  {
    id: "custom",
    label: "Autre montant",
    amountFcfa: 0,
    isCustom: true,
    description: "Saisir un montant en FCFA",
  },
];

export const mobileMoneyAccounts: MobileMoneyAccount[] = [
  {
    id: "mynita",
    operator: "MyNita",
    number: "00 00 00 00 00",
    name: "Église Voice Of Freedom",
    qrAsset: "/assets/qr-mynita.svg",
  },
  {
    id: "amana",
    operator: "Amana",
    number: "00 00 00 00 00",
    name: "Église Voice Of Freedom",
    qrAsset: "/assets/qr-amana.svg",
  },
  {
    id: "wave",
    operator: "Wave",
    number: "00 00 00 00 00",
    name: "Église Voice Of Freedom",
    qrAsset: "/assets/qr-wave.svg",
  },
];

export const ribDetails: RibDetails = {
  bankName: "Banque partenaire VOF",
  accountName: "Église Voice Of Freedom",
  iban: "CI93 ACCT-000028 0000 000",
  bic: "XXXXCIAB",
};
