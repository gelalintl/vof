import type {
  DonationPromisePaymentMethod,
  DonationPromiseStatus,
  DonationPromiseType,
  DonationType,
  MobileMoneyOperatorId,
  PaymentMethod,
} from "@/types";

export const PROJECT_STATUSES = ["IN_PROGRESS", "COMPLETED", "PLANNED"] as const;

export const PROJECT_CATEGORIES = [
  "Construction",
  "Médias",
  "Social",
  "Évangélisation",
  "Autre",
] as const;

export const DONATION_PROMISE_TYPES: DonationPromiseType[] = [
  "DIME",
  "OFFRANDE",
  "PROJET",
  "ACTION_DE_GRACE",
  "VOEU",
];

export const DONATION_PAYMENT_METHODS: DonationPromisePaymentMethod[] = [
  "AMANA",
  "MYNITA",
  "WAVE",
  "BANK",
  "CARD",
];

export const DONATION_STATUSES: DonationPromiseStatus[] = [
  "PENDING",
  "CONFIRMED",
  "CANCELLED",
];

export const projectStatusLabels: Record<(typeof PROJECT_STATUSES)[number], string> = {
  IN_PROGRESS: "En cours",
  COMPLETED: "Terminé",
  PLANNED: "Planifié",
};

export const donationTypeLabelsAdmin: Record<DonationPromiseType, string> = {
  DIME: "Dîme",
  OFFRANDE: "Offrande",
  PROJET: "Projet",
  ACTION_DE_GRACE: "Action de grâce",
  VOEU: "Vœu",
};

export const donationPaymentLabels: Record<DonationPromisePaymentMethod, string> = {
  AMANA: "Amana",
  MYNITA: "MyNita",
  WAVE: "Wave",
  BANK: "Virement bancaire",
  CARD: "Carte bancaire",
};

export const donationStatusLabels: Record<DonationPromiseStatus, string> = {
  PENDING: "En attente",
  CONFIRMED: "Confirmé",
  CANCELLED: "Annulé",
};

export function projectProgress(currentAmount: number, targetAmount: number) {
  if (targetAmount <= 0) {
    return 0;
  }
  return Math.min(100, Math.round((currentAmount / targetAmount) * 100));
}

export function mapWizardTypeToPromise(
  type: DonationType,
  projectId?: string | null,
): DonationPromiseType {
  if (projectId) {
    return "PROJET";
  }

  const map: Record<DonationType, DonationPromiseType> = {
    dime: "DIME",
    offrande: "OFFRANDE",
    action_de_grace: "ACTION_DE_GRACE",
    voeu: "VOEU",
    premice: "OFFRANDE",
  };

  return map[type];
}

export function mapWizardPaymentMethod(
  method: PaymentMethod,
  operator?: MobileMoneyOperatorId,
): DonationPromisePaymentMethod {
  if (method === "rib") {
    return "BANK";
  }
  if (method === "card") {
    return "CARD";
  }
  if (operator === "nita") {
    return "MYNITA";
  }
  if (operator === "wave") {
    return "WAVE";
  }
  return "AMANA";
}

export function isDonationPromiseType(value: string): value is DonationPromiseType {
  return DONATION_PROMISE_TYPES.includes(value as DonationPromiseType);
}

export function isDonationPaymentMethod(
  value: string,
): value is DonationPromisePaymentMethod {
  return DONATION_PAYMENT_METHODS.includes(value as DonationPromisePaymentMethod);
}

export function isDonationStatus(value: string): value is DonationPromiseStatus {
  return DONATION_STATUSES.includes(value as DonationPromiseStatus);
}

export function isProjectStatus(value: string): value is (typeof PROJECT_STATUSES)[number] {
  return PROJECT_STATUSES.includes(value as (typeof PROJECT_STATUSES)[number]);
}
