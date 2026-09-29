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

export interface Department {
  id: string;
  slug: string;
  name: string;
  description: string;
  leader?: string;
  meetingSchedule?: string;
  contact?: string;
  image?: string;
  icon?: string;
  colorToken?: EventColorToken;
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
  projectId?: string | null;
}

export type ProjectStatus = "IN_PROGRESS" | "COMPLETED" | "PLANNED";

export type DonationPromiseType =
  | "DIME"
  | "OFFRANDE"
  | "PROJET"
  | "ACTION_DE_GRACE"
  | "VOEU";

export type DonationPromisePaymentMethod =
  | "AMANA"
  | "MYNITA"
  | "WAVE"
  | "BANK"
  | "CARD";

export type DonationPromiseStatus = "PENDING" | "CONFIRMED" | "CANCELLED";

export interface PublicProject {
  id: string;
  title: string;
  slug: string;
  description: string;
  category: string | null;
  targetAmount: number;
  currentAmount: number;
  image: string | null;
  status: ProjectStatus;
  isFeatured: boolean;
  progress: number;
}

export interface AdminProjectRecord extends PublicProject {
  order: number;
  createdAt: string;
}

export interface AdminDonationRecord {
  id: string;
  donorName: string | null;
  donorPhone: string | null;
  donorEmail: string | null;
  type: string;
  amount: number;
  paymentMethod: string;
  status: DonationPromiseStatus;
  notes: string | null;
  projectId: string | null;
  projectTitle: string | null;
  createdAt: string;
}

export interface SubmitDonationPromiseInput {
  donorName?: string;
  donorPhone?: string;
  donorEmail?: string;
  type?: string;
  amount: number;
  paymentMethod: string;
  notes?: string;
  projectId?: string | null;
}

export interface DonationListFilters {
  status?: DonationPromiseStatus | "ALL";
  projectId?: string;
}

export interface NavItem {
  label: string;
  href: string;
  children?: NavItem[];
}

export interface FooterLink {
  label: string;
  url: string;
}

export interface FooterScheduleItem {
  label: string;
  time: string;
}

export interface PublicFooterContent {
  description: string;
  copyright: string;
  navLinks: FooterLink[];
  scheduleTitle: string;
  scheduleItems: FooterScheduleItem[];
  showContact: boolean;
  showSocials: boolean;
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

export interface HomeHeroDraft {
  hero_badge: string;
  hero_title: string;
  hero_description: string;
  hero_primary_cta_text: string;
  hero_primary_cta_link: string;
  hero_secondary_cta_text: string;
  hero_secondary_cta_link: string;
  featured_youtube_url: string;
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

export type AdminRecurrenceType =
  | "NONE"
  | "DAILY"
  | "WEEKLY"
  | "MONTHLY"
  | "FIRST_3_DAYS_MONTH"
  | "SECOND_AND_LAST_FRIDAY";

export interface CreateAdminEventInput {
  title: string;
  slug?: string | null;
  description: string;
  startDate: string;
  endDate?: string | null;
  startTime?: string | null;
  endTime?: string | null;
  durationDays?: number;
  location: string;
  category: AdminEventCategory;
  isSpecial?: boolean;
  isExclusive?: boolean;
  isFeatured?: boolean;
  image?: string | null;
  youtubeUrl?: string | null;
  recurrenceType?: AdminRecurrenceType;
  recurrenceRule?: AdminRecurrenceType;
  daysOfWeek?: number[];
  recurrenceEndDate?: string | null;
  excludedDates?: string[];
}

export interface PublicRecurringGathering {
  id: string;
  title: string;
  scheduleLabel: string;
  timeLabel: string;
  recurrenceType: AdminRecurrenceType;
  daysOfWeek: number[];
}

export interface AdminEventRecord {
  id: string;
  title: string;
  slug: string | null;
  description: string;
  startDate: string;
  endDate: string | null;
  durationDays: number;
  location: string;
  category: AdminEventCategory;
  isSpecial: boolean;
  isExclusive: boolean;
  isFeatured: boolean;
  image: string | null;
  youtubeUrl: string | null;
  recurrenceType: AdminRecurrenceType;
  daysOfWeek: number[];
  recurrenceEndDate: string | null;
  excludedDates: string[];
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

export interface AdminArticleRecord {
  id: string;
  title: string;
  slug: string;
  content: string;
  author: string;
  coverImage: string | null;
  galleryImages: string[];
  youtubeUrl: string | null;
  isPublished: boolean;
  isFeatured: boolean;
  createdAt: string;
}

export interface AdminCommentRecord {
  id: string;
  authorName: string;
  authorEmail: string | null;
  content: string;
  likesCount: number;
  isApproved: boolean;
  createdAt: string;
  articleId: string | null;
  articleTitle: string | null;
  articleSlug: string | null;
}

export interface CreateAdminPastorInput {
  name: string;
  role: string;
  bio?: string | null;
  quote?: string | null;
  image?: string | null;
  order?: number;
}

export interface AdminDepartmentRecord {
  id: string;
  name: string;
  slug: string;
  description: string;
  responsible: string | null;
  contact: string | null;
  image: string | null;
  order: number;
  createdAt: string;
}

export interface AdminPastorRecord {
  id: string;
  name: string;
  role: string;
  bio: string | null;
  quote: string | null;
  image: string | null;
  order: number;
  createdAt: string;
}

export interface PublicPastor {
  id: string;
  name: string;
  role: string;
  bio: string | null;
  quote: string | null;
  image: string | null;
  order: number;
}

export interface AdminSettingRecord {
  id: string;
  key: string;
  value: string;
  updatedAt: string;
}

export interface AdminPrintSettings {
  print_signatory_title: string;
  print_header_title: string;
  print_header_subtitle: string;
  print_use_logo: string;
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

export interface PublicArticleComment {
  id: string;
  authorName: string;
  content: string;
  likesCount: number;
  createdAt: string;
}

export interface PublicArticle {
  id: string;
  slug: string;
  title: string;
  content: string;
  author: string;
  coverImage: string | null;
  galleryImages: string[];
  youtubeUrl: string | null;
  isFeatured: boolean;
  comments: PublicArticleComment[];
  createdAt: string;
}
