import Link from "next/link";
import { headers } from "next/headers";
import { Roboto } from "next/font/google";
import { Mail, MapPin, MessageCircle, Phone } from "lucide-react";
import { siteConfig } from "@/config/site";
import { getDictionary, type Dictionary } from "@/i18n/getDictionary";
import { isLocale, LOCALE_HEADER } from "@/i18n/config";
import { stripLocale, withLocale } from "@/i18n/routing";
import { toWhatsAppHref } from "@/lib/siteSettingsKeys";
import type { FooterLink, FooterScheduleItem, PublicFooterContent, PublicSiteContact, PublicSiteIdentity } from "@/types";
import {
  FacebookMark,
  InstagramMark,
  TikTokMark,
  YoutubeMark,
} from "@/ui/components/media/SocialMarks";
import { Logo } from "@/ui/design-system/logo";
import { Typography } from "@/ui/design-system/typography";

const roboto = Roboto({ weight: "400", subsets: ["latin"] });

interface FooterProps {
  logoSrc?: string | null;
  contact?: PublicSiteContact;
  identity?: PublicSiteIdentity;
  content: PublicFooterContent;
}

export async function Footer({ logoSrc, contact, identity, content }: FooterProps) {
  const address = contact?.location.address ?? siteConfig.location.address;
  const city = contact?.location.city ?? siteConfig.location.country;
  const email = contact?.location.email ?? siteConfig.contacts.email;
  const phone = contact?.location.phone ?? siteConfig.contacts.phone;
  const locationLine = [address, city].filter(Boolean).join(", ");
  const social = contact?.social;
  const churchName = identity?.churchName ?? siteConfig.legalName;
  const headerLocale = (await headers()).get(LOCALE_HEADER);
  const locale = isLocale(headerLocale) ? headerLocale : "fr";
  const dictionary = getDictionary(locale);

  const socialLinks = content.showSocials
    ? [
        social?.facebook
          ? { href: social.facebook, label: "Facebook", icon: FacebookMark }
          : null,
        social?.instagram
          ? { href: social.instagram, label: "Instagram", icon: InstagramMark }
          : null,
        social?.youtube
          ? { href: social.youtube, label: "YouTube", icon: YoutubeMark }
          : null,
        social?.tiktok
          ? { href: social.tiktok, label: "TikTok", icon: TikTokMark }
          : null,
        social && toWhatsAppHref(social.whatsapp)
          ? { href: toWhatsAppHref(social.whatsapp), label: "WhatsApp", icon: MessageCircle }
          : null,
      ].filter((item): item is NonNullable<typeof item> => Boolean(item))
    : [];

  return (
    <footer className="border-t border-violet-100 bg-slate-50">
      <div className="mx-auto grid max-w-6xl grid-cols-1 gap-8 px-4 py-12 sm:px-6 md:grid-cols-2 lg:grid-cols-4">
        <div>
          <Logo imageSrc={logoSrc} wordmark={churchName} />
          <Typography variant="body" className="mt-4 text-slate-600">
            {content.description}
          </Typography>
        </div>

        <div>
          <Typography variant="h4" as="h2" className="text-violet-700">
            {dictionary.footer.navigation}
          </Typography>
          <ul className="mt-4 space-y-2">
            {content.navLinks.map((link) => (
              <li key={`${link.url}-${link.label}`}>
                <FooterNavLink
                  link={{ ...link, label: translateNavLabel(link, dictionary) }}
                  locale={locale}
                />
              </li>
            ))}
          </ul>
        </div>

        <div>
          <Typography variant="h4" as="h2" className="text-violet-700">
            {content.scheduleTitle}
          </Typography>
          <ul className="mt-4 space-y-2 font-sans text-sm text-slate-600">
            {content.scheduleItems.map((item) => {
              const translated = translateScheduleItem(item, dictionary);
              return (
                <li key={`${item.label}-${item.time}`}>
                  {translated.label} · {translated.time}
                </li>
              );
            })}
          </ul>
        </div>

        <div>
          <Typography variant="h4" as="h2" className="text-violet-700">
            {dictionary.footer.contact}
          </Typography>
          {content.showContact ? (
            <ul className="mt-4 space-y-3 font-sans text-sm text-slate-800">
              {locationLine ? (
                <li className="flex items-start gap-2">
                  <MapPin className="mt-0.5 size-4 text-sky-600" />
                  {locationLine}
                </li>
              ) : null}
              {phone ? (
                <li className="flex items-start gap-2">
                  <Phone className="mt-0.5 size-4 text-sky-600" />
                  <a href={`tel:${phone.replace(/\s/g, "")}`} className="hover:text-sky-600">
                    {phone}
                  </a>
                </li>
              ) : null}
              {email ? (
                <li className="flex items-start gap-2">
                  <Mail className="mt-0.5 size-4 text-sky-600" />
                  <a href={`mailto:${email}`} className="hover:text-sky-600">
                    {email}
                  </a>
                </li>
              ) : null}
            </ul>
          ) : null}
          {socialLinks.length > 0 ? (
            <div className="mt-4 flex flex-wrap gap-3">
              {socialLinks.map((item) => {
                const Icon = item.icon;
                return (
                  <SocialLink key={item.label} href={item.href} label={item.label}>
                    <Icon className="size-4" />
                  </SocialLink>
                );
              })}
            </div>
          ) : null}
        </div>
      </div>
      <div className="border-t border-violet-100 px-4 py-4 text-center font-sans text-xs text-slate-600">
        <nav className="mb-2 flex flex-wrap items-center justify-center gap-x-4 gap-y-1">
          <Link
            href={withLocale(locale, "/mentions-legales")}
            className="hover:text-sky-600"
          >
            {dictionary.footer.legalNotice}
          </Link>
          <Link
            href={withLocale(locale, "/politique-de-confidentialite")}
            className="hover:text-sky-600"
          >
            {dictionary.footer.privacy}
          </Link>
        </nav>
        <p>{content.copyright}</p>
      </div>
      <div className="bg-slate-900 py-4 text-center">
        <a
          href="https://dimensionplus.com"
          target="_blank"
          rel="noopener noreferrer"
          className={`${roboto.className} text-sm text-slate-400 transition-colors hover:text-white`}
        >
          Developped by Dimension +
        </a>
      </div>
    </footer>
  );
}

function FooterNavLink({ link, locale }: { link: FooterLink; locale: "fr" | "en" }) {
  const className = "font-sans text-sm text-slate-800 hover:text-sky-600";
  const isExternal = /^https?:\/\//i.test(link.url);

  if (isExternal) {
    return (
      <a href={link.url} target="_blank" rel="noopener noreferrer" className={className}>
        {link.label}
      </a>
    );
  }

  return (
    <Link href={withLocale(locale, link.url)} className={className}>
      {link.label}
    </Link>
  );
}

function SocialLink({
  href,
  label,
  children,
}: {
  href: string;
  label: string;
  children: React.ReactNode;
}) {
  return (
    <a
      href={href}
      aria-label={label}
      target="_blank"
      rel="noopener noreferrer"
      className="inline-flex size-9 items-center justify-center rounded-full bg-white text-sky-600 ring-1 ring-violet-100 hover:bg-violet-700 hover:text-white"
    >
      {children}
    </a>
  );
}

const NAV_BY_PATH: Record<string, keyof Dictionary["nav"]> = {
  "/": "home",
  "/a-propos": "about",
  "/vie-de-leglise": "churchLife",
  "/enseignements": "teachings",
  "/departements": "departments",
  "/projets": "projects",
  "/contact": "contact",
  "/galerie": "gallery",
  "/temoignages": "testimonials",
  "/don": "donate",
};

function translateNavLabel(link: FooterLink, dictionary: Dictionary) {
  const path = stripLocale(link.url).replace(/\/$/, "") || "/";
  const key = NAV_BY_PATH[path];
  return key ? dictionary.nav[key] : link.label;
}

function translateScheduleItem(item: FooterScheduleItem, dictionary: Dictionary) {
  const labels = dictionary.footer.scheduleLabels as Record<string, string>;
  const times = dictionary.footer.scheduleTimes as Record<string, string>;
  return {
    label: labels[item.label] ?? item.label,
    time: times[item.time] ?? item.time,
  };
}
