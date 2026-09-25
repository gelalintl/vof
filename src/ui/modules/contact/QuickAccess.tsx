import { MessageCircle } from "lucide-react";
import { toWhatsAppHref } from "@/lib/siteSettingsKeys";
import type { PublicSocialLinks } from "@/types";
import { FacebookMark, InstagramMark, YoutubeMark } from "@/ui/components/media/SocialMarks";

interface QuickAccessProps {
  social: PublicSocialLinks;
}

export function QuickAccess({ social }: QuickAccessProps) {
  const whatsappHref = toWhatsAppHref(social.whatsapp);
  const links = [
    whatsappHref
      ? {
          href: whatsappHref,
          label: "WhatsApp VOF",
          tone: "bg-amber-500 text-slate-900 hover:bg-amber-400",
          icon: <MessageCircle className="size-5" />,
        }
      : null,
    social.youtube
      ? {
          href: social.youtube,
          label: "YouTube VOF",
          tone: "bg-red-600 text-white hover:bg-red-700",
          icon: <YoutubeMark className="size-5" />,
        }
      : null,
    social.facebook
      ? {
          href: social.facebook,
          label: "Facebook VOF",
          tone: "bg-sky-600 text-white hover:bg-sky-700",
          icon: <FacebookMark className="size-5" />,
        }
      : null,
    social.instagram
      ? {
          href: social.instagram,
          label: "Instagram VOF",
          tone: "bg-violet-700 text-white hover:bg-violet-800",
          icon: <InstagramMark className="size-5" />,
        }
      : null,
  ].filter((link): link is NonNullable<typeof link> => Boolean(link));

  if (links.length === 0) {
    return null;
  }

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
