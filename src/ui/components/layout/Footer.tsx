import Link from "next/link";
import { Mail, MapPin, MessageCircle, Phone } from "lucide-react";
import { siteConfig } from "@/config/site";
import { toWhatsAppHref } from "@/lib/siteSettingsKeys";
import type { FooterLink, PublicFooterContent, PublicSiteContact, PublicSiteIdentity } from "@/types";
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
  content: PublicFooterContent;
}

export function Footer({ logoSrc, contact, identity, content }: FooterProps) {
  const address = contact?.location.address ?? siteConfig.location.address;
  const city = contact?.location.city ?? siteConfig.location.country;
  const email = contact?.location.email ?? siteConfig.contacts.email;
  const phone = contact?.location.phone ?? siteConfig.contacts.phone;
  const locationLine = [address, city].filter(Boolean).join(", ");
  const social = contact?.social;
  const churchName = identity?.churchName ?? siteConfig.legalName;

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
          <Typography variant="h4" className="text-violet-700">
            Navigation
          </Typography>
          <ul className="mt-4 space-y-2">
            {content.navLinks.map((link) => (
              <li key={`${link.url}-${link.label}`}>
                <FooterNavLink link={link} />
              </li>
            ))}
          </ul>
        </div>

        <div>
          <Typography variant="h4" className="text-violet-700">
            {content.scheduleTitle}
          </Typography>
          <ul className="mt-4 space-y-2 font-sans text-sm text-slate-600">
            {content.scheduleItems.map((item) => (
              <li key={`${item.label}-${item.time}`}>
                {item.label} · {item.time}
              </li>
            ))}
          </ul>
        </div>

        <div>
          <Typography variant="h4" className="text-violet-700">
            Contact
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
      <div className="border-t border-violet-100 py-4 text-center font-sans text-xs text-slate-600">
        <p>{content.copyright}</p>
      </div>
    </footer>
  );
}

function FooterNavLink({ link }: { link: FooterLink }) {
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
    <Link href={link.url} className={className}>
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
