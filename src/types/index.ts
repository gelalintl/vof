export type SermonCategory =
  | "culte"
  | "enseignement"
  | "seminaire"
  | "jeunesse";

export interface Sermon {
  id: string;
  slug: string;
  title: string;
  preacher: string;
  preacherId?: string;
  date: string;
  scripture?: string;
  summary: string;
  youtubeId?: string;
  audioUrl?: string;
  thumbnailUrl?: string;
  category: SermonCategory;
  tags?: string[];
  durationMinutes?: number;
}

export type EventKind =
  | "culte"
  | "enseignement"
  | "seminaire"
  | "conference"
  | "jeunesse"
  | "special"
  | "priere";

export type EventColorToken = "brand" | "secondary" | "accent" | "impact";

export type MonthlyEventType =
  | "prayer"
  | "testimony"
  | "vigil"
  | "fasting"
  | "special";

export interface MonthlyGeneratedEvent {
  id: string;
  title: string;
  date: Date;
  time: string;
  timeEnd?: string;
  type: MonthlyEventType;
  colorToken: EventColorToken;
  location: string;
  kind?: EventKind;
}

export type EventCategoryFilter =
  | "all"
  | "enseignement"
  | "jeunesse"
  | "seminaire"
  | "conference"
  | "rassemblement";

export type EventRecurrence =
  | { kind: "weekly"; weekday: number }
  | { kind: "secondAndLastWeekday"; weekday: number }
  | { kind: "monthlyFasting" };

export interface EventAuthor {
  name: string;
  role: string;
  signature?: string;
}

export interface EventGalleryItem {
  id: string;
  alt: string;
  caption?: string;
  imageUrl?: string;
}

export interface GalleryImage {
  id: string;
  src: string;
  alt: string;
  caption?: string;
}

export interface EventComment {
  id: string;
  authorName: string;
  postedAt: string;
  message: string;
}

export interface Event {
  id: string;
  slug: string;
  title: string;
  description: string;
  body?: string;
  startsAt: string;
  endsAt?: string;
  location: string;
  kind: EventKind;
  colorToken: EventColorToken;
  imageUrl?: string;
  youtubeId?: string;
  isFeatured?: boolean;
  registrationRequired?: boolean;
  author?: EventAuthor;
  gallery?: EventGalleryItem[];
  comments?: EventComment[];
  recurrence?: EventRecurrence;
}

/** Événement ponctuel (réveillon, séminaire multi-jours, etc.). */
export type SpecialEvent = Omit<Event, "recurrence" | "colorToken"> & {
  /** Si omis, le calendrier applique l'impact rouge (#DC2626). */
  colorToken?: EventColorToken;
};

export interface Department {
  id: string;
  slug: string;
  name: string;
  description: string;
  leader?: string;
  meetingSchedule?: string;
  contact?: string;
  icon?: string;
  colorToken?: EventColorToken;
}

export interface Pastor {
  id: string;
  slug: string;
  firstName: string;
  lastName: string;
  title: string;
  role: string;
  bio: string;
  photoUrl?: string;
  quote?: string;
}

export type PaymentMethod = "mobile_money" | "card" | "rib";

export type DonationRecurrence = "once" | "monthly" | "quarterly" | "yearly";

export interface DonationOption {
  id: string;
  label: string;
  amountFcfa: number;
  isCustom?: boolean;
  description?: string;
}

export interface NavItem {
  label: string;
  href: string;
  children?: NavItem[];
}

export interface MobileMoneyAccount {
  id: "mynita" | "amana" | "wave";
  operator: string;
  number: string;
  name: string;
  qrAsset: string;
}

export interface RibDetails {
  bankName: string;
  accountName: string;
  iban: string;
  bic: string;
}

export type ContactSubject =
  | "information"
  | "priere"
  | "visite"
  | "don"
  | "departement"
  | "autre";

export interface ContactMessage {
  name: string;
  email: string;
  phone?: string;
  subject: ContactSubject;
  message: string;
}
