import type { ContactSubject, DonationRecurrence, DonationType } from "@/types";

export const donationTypeLabels: Record<DonationType, string> = {
  dime: "Dîme",
  action_de_grace: "Action de grâce",
  voeu: "Voeu",
  premice: "Prémices",
  offrande: "Offrande",
};

export const donationTypes: DonationType[] = [
  "dime",
  "action_de_grace",
  "voeu",
  "premice",
  "offrande",
];

export const donationRecurrenceLabels: Record<DonationRecurrence, string> = {
  once: "Une fois",
  monthly: "Chaque mois",
  quarterly: "Chaque trimestre",
  yearly: "Chaque année",
};

export const contactSubjects: { value: ContactSubject; label: string }[] = [
  { value: "information", label: "Demande d'information" },
  { value: "priere", label: "Demande de prière" },
  { value: "visite", label: "Je visiterai un culte" },
  { value: "don", label: "Dons & partenariat" },
  { value: "departement", label: "Rejoindre un département" },
  { value: "autre", label: "Autre" },
];
