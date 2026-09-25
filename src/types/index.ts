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
  imageUrl?: string;
}

export interface CalendarEventPayload {
  id: string;
  title: string;
  dateKey: string;
  time: string;
  timeEnd?: string;
  type: MonthlyEventType;
  colorToken: EventColorToken;
  location: string;
  kind?: EventKind;
  imageUrl?: string;
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

export type DonationType =
  | "dime"
  | "action_de_grace"
  | "voeu"
  | "premice"
  | "offrande";

export interface DonationOption {
  id: string;
  label: string;
  amountFcfa: number;
  isCustom?: boolean;
  description?: string;
}

export interface DonationDraft {
  type: DonationType;
  amountFcfa: number;
  recurrence: DonationRecurrence;
  method: PaymentMethod;
}

export interface NavItem {
  label: string;
  href: string;
  children?: NavItem[];
}

export type MobileMoneyOperatorId = "amana" | "nita" | "wave";

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

export interface PublicMobileMoneyOperator {
  id: MobileMoneyOperatorId;
  label: string;
  enabled: boolean;
  qrUrl: string;
  phone: string;
}

export interface PublicBankTransfer {
  enabled: boolean;
  bankName: string;
  accountName: string;
  iban: string;
  swift: string;
  ribCode: string;
}

export interface PublicPaymentConfig {
  operators: PublicMobileMoneyOperator[];
  cardEnabled: boolean;
  bank: PublicBankTransfer;
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

export type GalleryLayout = "bento" | "grid";

export type FeatureCardTone = "brand" | "secondary" | "accent";

export interface FeatureCardData {
  id: string;
  title: string;
  text: string;
  tone?: FeatureCardTone;
}

export interface MediaCardData {
  href: string;
  title: string;
  imageAlt: string;
  imageSrc?: string;
  badge?: string;
  description?: string;
  location?: string;
  dateLabel?: string;
  colorToken?: EventColorToken;
}

export type ContentSectionTone = "white" | "muted";
export type ContentSectionWidth = "default" | "narrow" | "prose" | "article";
export type ContentSectionPadding = "default" | "compact";
export type ContentSectionGap = "md" | "lg";

export interface PortraitBlockData {
  name: string;
  role: string;
  bio: string;
  photoSrc: string;
  photoAlt: string;
  quote?: string;
  reversed?: boolean;
}

export interface QuoteBlockData {
  quote: string;
  caption?: string;
  attribution?: string;
  note?: string;
  align?: "left" | "center";
  attributionVariant?: "muted" | "brand";
}

export type InfoTileIcon = "clock" | "map" | "message";

export interface InfoTileItem {
  title: string;
  detail: string;
}

export interface InfoTileData {
  id: string;
  title: string;
  icon: InfoTileIcon;
  description?: string;
  href?: string;
  items?: InfoTileItem[];
}

export interface SectionHeaderData {
  title: string;
  titleId?: string;
  badge?: string;
  kicker?: string;
  description?: string;
  align?: "left" | "center";
  titleStyle?: "default" | "display";
}

export interface AuthorSignatureData {
  name: string;
  role: string;
  signature?: string;
}

export type PageHeroGlow = "sky" | "amber";
export type PageHeroWidth = "default" | "narrow";

export interface PageHeroAction {
  href: string;
  label: string;
  variant?: "primary" | "secondary" | "accent" | "outline" | "ghost" | "outlineLight";
}

export interface PageHeroMedia {
  videoId?: string;
  videoTitle?: string;
  fallbackDay?: string;
  fallbackTime?: string;
  fallbackText?: string;
}

export interface PageHeroData {
  badge: string;
  title: string;
  description: string;
  glow?: PageHeroGlow;
  width?: PageHeroWidth;
  actions?: PageHeroAction[];
  media?: PageHeroMedia;
}

export interface EventHeadlineData {
  badge: string;
  title: string;
  dateLabel: string;
  location: string;
  colorToken?: EventColorToken;
}

export type AdminUserRole = "ADMIN" | "EDITOR";

export interface AdminSessionUser {
  id: string;
  email: string;
  role: AdminUserRole;
}

export type AdminEventCategory = "ROUTINE" | "FASTING" | "VIGIL" | "SPECIAL";

export interface CreateAdminEventInput {
  title: string;
  description: string;
  startDate: string;
  endDate?: string | null;
  location: string;
  category: AdminEventCategory;
  isSpecial?: boolean;
  image?: string | null;
}

export interface CreateAdminMediaInput {
  title: string;
  url: string;
  category: string;
  eventId?: string | null;
  isFeaturedHome?: boolean;
}

export interface AdminEventRecord {
  id: string;
  title: string;
  description: string;
  startDate: string;
  endDate: string | null;
  location: string;
  category: AdminEventCategory;
  isSpecial: boolean;
  image: string | null;
  createdAt: string;
}

export interface AdminMediaRecord {
  id: string;
  title: string;
  url: string;
  category: string;
  eventId: string | null;
  eventTitle: string | null;
  isFeaturedHome: boolean;
  createdAt: string;
}

export interface CreateAdminArticleInput {
  title: string;
  slug: string;
  content: string;
  author: string;
  coverImage?: string | null;
  isPublished?: boolean;
}

export interface AdminArticleRecord {
  id: string;
  title: string;
  slug: string;
  content: string;
  author: string;
  coverImage: string | null;
  isPublished: boolean;
  createdAt: string;
}

export interface AdminSettingRecord {
  id: string;
  key: string;
  value: string;
  updatedAt: string;
}

export interface PublicSocialLinks {
  facebook: string;
  instagram: string;
  youtube: string;
  tiktok: string;
  whatsapp: string;
}

export interface PublicLocationContact {
  address: string;
  city: string;
  googleMapsUrl: string;
  iframeUrl: string;
  phone: string;
  email: string;
}

export interface PublicSiteContact {
  social: PublicSocialLinks;
  location: PublicLocationContact;
}

export interface PublicSiteIdentity {
  churchName: string;
  tagline: string;
  logoSrc: string | null;
  sundayLabel: string;
  sundayTime: string;
}

export interface PublicArticle {
  id: string;
  slug: string;
  title: string;
  content: string;
  author: string;
  coverImage: string | null;
  createdAt: string;
}
