import Link from "next/link";
import { Mail, MapPin } from "lucide-react";
import { footerColumns, mainNavigation } from "@/config/navigation";
import { siteConfig } from "@/config/site";
import { Logo } from "@/ui/design-system/logo";
import { Typography } from "@/ui/design-system/typography";

export function Footer() {
  const churchLinks = footerColumns[0]?.links ?? mainNavigation;
  const resourceLinks = footerColumns[1]?.links ?? [];

  return (
    <footer className="border-t border-violet-100 bg-slate-50">
      <div className="mx-auto grid max-w-6xl gap-10 px-4 py-12 sm:px-6 md:grid-cols-3 lg:grid-cols-5">
        <div>
          <Logo />
          <Typography variant="body" className="mt-4 text-slate-600">
            {siteConfig.tagline}. Rejoignez la famille VOF chaque{" "}
            {siteConfig.worship.sunday.day.toLowerCase()} à{" "}
            {siteConfig.worship.sunday.time}.
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
            <li className="flex items-start gap-2">
              <MapPin className="mt-0.5 size-4 text-sky-600" />
              {siteConfig.location.address}, {siteConfig.location.country}
            </li>
            <li className="flex items-start gap-2">
              <Mail className="mt-0.5 size-4 text-sky-600" />
              <a href={`mailto:${siteConfig.contacts.email}`} className="hover:text-sky-600">
                {siteConfig.contacts.email}
              </a>
            </li>
          </ul>
          <div className="mt-4 flex gap-3">
            <SocialLink href={siteConfig.social.facebook} label="Facebook">
              <FacebookMark />
            </SocialLink>
            <SocialLink href={siteConfig.social.youtube} label="YouTube">
              <YoutubeMark />
            </SocialLink>
            <SocialLink href={siteConfig.social.instagram} label="Instagram">
              <InstagramMark />
            </SocialLink>
          </div>
        </div>
      </div>
      <div className="border-t border-violet-100 py-4 text-center font-sans text-xs text-slate-600">
        © {new Date().getFullYear()} {siteConfig.legalName}. Tous droits réservés.
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

function FacebookMark() {
  return (
    <svg viewBox="0 0 24 24" className="size-4 fill-current" aria-hidden="true">
      <path d="M14 9h3V6h-3c-2.2 0-4 1.8-4 4v2H8v3h2v7h3v-7h2.6L16 12h-3V10c0-.6.4-1 1-1Z" />
    </svg>
  );
}

function YoutubeMark() {
  return (
    <svg viewBox="0 0 24 24" className="size-4 fill-current" aria-hidden="true">
      <path d="M23 12.2s0-3.2-.4-4.6c-.2-.8-.9-1.5-1.7-1.7C19.4 5.5 12 5.5 12 5.5s-7.4 0-8.9.4c-.8.2-1.5.9-1.7 1.7C1 9 1 12.2 1 12.2s0 3.2.4 4.6c.2.8.9 1.5 1.7 1.7 1.5.4 8.9.4 8.9.4s7.4 0 8.9-.4c.8-.2 1.5-.9 1.7-1.7.4-1.4.4-4.6.4-4.6ZM9.8 15.5V8.9l6.2 3.3-6.2 3.3Z" />
    </svg>
  );
}

function InstagramMark() {
  return (
    <svg viewBox="0 0 24 24" className="size-4 fill-current" aria-hidden="true">
      <path d="M12 7.2A4.8 4.8 0 1 0 12 16.8 4.8 4.8 0 0 0 12 7.2Zm0 7.9A3.1 3.1 0 1 1 12 8.9a3.1 3.1 0 0 1 0 6.2Zm6.1-8.2a1.1 1.1 0 1 1-2.2 0 1.1 1.1 0 0 1 2.2 0ZM12 4.4c-2 0-2.3 0-3.1.1-.8 0-1.3.2-1.8.4-.5.2-.9.5-1.3.9-.4.4-.7.8-.9 1.3-.2.5-.3 1-.4 1.8 0 .8-.1 1.1-.1 3.1s0 2.3.1 3.1c0 .8.2 1.3.4 1.8.2.5.5.9.9 1.3.4.4.8.7 1.3.9.5.2 1 .3 1.8.4.8 0 1.1.1 3.1.1s2.3 0 3.1-.1c.8 0 1.3-.2 1.8-.4.5-.2.9-.5 1.3-.9.4-.4.7-.8.9-1.3.2-.5.3-1 .4-1.8 0-.8.1-1.1.1-3.1s0-2.3-.1-3.1c0-.8-.2-1.3-.4-1.8-.2-.5-.5-.9-.9-1.3-.4-.4-.8-.7-1.3-.9-.5-.2-1-.3-1.8-.4-.8 0-1.1-.1-3.1-.1Zm0 1.5c2 0 2.2 0 3 .1.7 0 1.1.2 1.4.3.3.1.6.3.8.6.3.2.5.5.6.8.1.3.3.7.3 1.4 0 .8.1 1 .1 3s0 2.2-.1 3c0 .7-.2 1.1-.3 1.4-.1.3-.3.6-.6.8-.2.3-.5.5-.8.6-.3.1-.7.3-1.4.3-.8 0-1-.1-3-.1s-2.2 0-3 .1c-.7 0-1.1-.2-1.4-.3-.3-.1-.6-.3-.8-.6-.3-.2-.5-.5-.6-.8-.1-.3-.3-.7-.3-1.4 0-.8-.1-1-.1-3s0-2.2.1-3c0-.7.2-1.1.3-1.4.1-.3.3-.6.6-.8.2-.3.5-.5.8-.6.3-.1.7-.3 1.4-.3.8 0 1-.1 3-.1Z" />
    </svg>
  );
}
