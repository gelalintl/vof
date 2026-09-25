import Link from "next/link";
import { Mail, MapPin, MessageCircle, Phone } from "lucide-react";
import { footerColumns, mainNavigation } from "@/config/navigation";
import { siteConfig } from "@/config/site";
import { toWhatsAppHref } from "@/lib/siteSettingsKeys";
import type { PublicSiteContact, PublicSiteIdentity } from "@/types";
import {
  FacebookMark,
  InstagramMark,
  TikTokMark,
  YoutubeMark,
} from "@/ui/components/media/SocialMarks";
import { Logo } from "@/ui/design-system/logo";
import { Typography } from "@/ui/design-system/typography";

interface FooterProps {
  logoSrc?: string | null;
  contact?: PublicSiteContact;
  identity?: PublicSiteIdentity;
}

export function Footer({ logoSrc, contact, identity }: FooterProps) {
  const churchLinks = footerColumns[0]?.links ?? mainNavigation;
  const resourceLinks = footerColumns[1]?.links ?? [];
  const address = contact?.location.address ?? siteConfig.location.address;
  const city = contact?.location.city ?? siteConfig.location.country;
  const email = contact?.location.email ?? siteConfig.contacts.email;
  const phone = contact?.location.phone ?? siteConfig.contacts.phone;
  const locationLine = [address, city].filter(Boolean).join(", ");
  const social = contact?.social;
  const churchName = identity?.churchName ?? siteConfig.legalName;
  const tagline = identity?.tagline ?? siteConfig.tagline;
  const sundayTime = identity?.sundayTime ?? `${siteConfig.worship.sunday.day} · ${siteConfig.worship.sunday.time}`;

  const socialLinks = [
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
  ].filter((item): item is NonNullable<typeof item> => Boolean(item));

  return (
    <footer className="border-t border-violet-100 bg-slate-50">
      <div className="mx-auto grid max-w-6xl gap-10 px-4 py-12 sm:px-6 md:grid-cols-3 lg:grid-cols-5">
        <div>
          <Logo imageSrc={logoSrc} wordmark={churchName} />
          <Typography variant="body" className="mt-4 text-slate-600">
            {tagline}. Rejoignez-nous pour le culte — {sundayTime}.
          </Typography>
        </div>

        <div>
          <Typography variant="h4" className="text-violet-700">
            L&apos;église
          </Typography>
          <ul className="mt-4 space-y-2">
            {churchLinks.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className="font-sans text-sm text-slate-800 hover:text-sky-600"
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <Typography variant="h4" className="text-violet-700">
            Horaires des cultes
          </Typography>
          <ul className="mt-4 space-y-2 font-sans text-sm text-slate-600">
            {siteConfig.worship.gatherings.map((gathering) => (
              <li key={gathering.id}>
                {gathering.label} · {gathering.day} {gathering.time}
              </li>
            ))}
          </ul>
        </div>

        <div>
          <Typography variant="h4" className="text-violet-700">
            Autres liens
          </Typography>
          <ul className="mt-4 space-y-2">
            {resourceLinks.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className="font-sans text-sm text-slate-800 hover:text-sky-600"
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <Typography variant="h4" className="text-violet-700">
            Contact
          </Typography>
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
      <div className="border-t border-violet-100 py-4 text-center font-sans text-xs text-slate-600">
        © {new Date().getFullYear()} {churchName}. Tous droits réservés.
      </div>
    </footer>
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
