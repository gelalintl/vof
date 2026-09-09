import { MessageCircle } from "lucide-react";
import { siteConfig } from "@/config/site";

export function QuickAccess() {
  const links = [
    {
      href: siteConfig.contacts.whatsapp.href,
      label: siteConfig.contacts.whatsapp.label,
      tone: "bg-amber-500 text-slate-900 hover:bg-amber-400",
      icon: <MessageCircle className="size-5" />,
    },
    {
      href: siteConfig.social.youtube,
      label: "YouTube VOF",
      tone: "bg-red-600 text-white hover:bg-red-700",
      icon: <YoutubeMark />,
    },
    {
      href: siteConfig.social.facebook,
      label: "Facebook VOF",
      tone: "bg-sky-600 text-white hover:bg-sky-700",
      icon: <FacebookMark />,
    },
  ];

  return (
    <section aria-labelledby="acces-rapide">
      <h2
        id="acces-rapide"
        className="font-heading text-lg font-bold tracking-tight text-violet-700"
      >
        Accès rapide
      </h2>
      <div className="mt-4 flex flex-col gap-3">
        {links.map((link) => (
          <a
            key={link.href}
            href={link.href}
            target="_blank"
            rel="noopener noreferrer"
            className={`inline-flex h-12 w-full items-center justify-center gap-2 rounded-full font-heading text-sm font-bold tracking-tight ${link.tone}`}
          >
            {link.icon}
            {link.label}
          </a>
        ))}
      </div>
    </section>
  );
}

function FacebookMark() {
  return (
    <svg viewBox="0 0 24 24" className="size-5 fill-current" aria-hidden="true">
      <path d="M14 9h3V6h-3c-2.2 0-4 1.8-4 4v2H8v3h2v7h3v-7h2.6L16 12h-3V10c0-.6.4-1 1-1Z" />
    </svg>
  );
}

function YoutubeMark() {
  return (
    <svg viewBox="0 0 24 24" className="size-5 fill-current" aria-hidden="true">
      <path d="M23 12.2s0-3.2-.4-4.6c-.2-.8-.9-1.5-1.7-1.7C19.4 5.5 12 5.5 12 5.5s-7.4 0-8.9.4c-.8.2-1.5.9-1.7 1.7C1 9 1 12.2 1 12.2s0 3.2.4 4.6c.2.8.9 1.5 1.7 1.7 1.5.4 8.9.4 8.9.4s7.4 0 8.9-.4c.8-.2 1.5-.9 1.7-1.7.4-1.4.4-4.6.4-4.6ZM9.8 15.5V8.9l6.2 3.3-6.2 3.3Z" />
    </svg>
  );
}
