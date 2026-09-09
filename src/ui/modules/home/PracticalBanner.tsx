import { Clock, MapPin, MessageCircle } from "lucide-react";
import { siteConfig } from "@/config/site";
import { Typography } from "@/ui/design-system/typography";

export function PracticalBanner() {
  return (
    <section id="infos-pratiques" className="bg-slate-50">
      <div className="mx-auto grid max-w-6xl gap-4 px-4 py-8 sm:px-6 md:grid-cols-3">
        <div className="flex flex-col items-center gap-4 rounded-2xl bg-white p-5 shadow-sm ring-1 ring-violet-100 md:col-span-3 lg:col-span-1">
          <span className="flex size-11 items-center justify-center rounded-full bg-violet-700 text-white">
            <Clock className="size-5" />
          </span>
          <span className="flex w-full flex-col items-center text-center">
            <Typography variant="caption" className="uppercase tracking-widest text-sky-600">
              Horaires
            </Typography>
            <ul className="mt-3 w-full space-y-2">
              {siteConfig.worship.gatherings.map((gathering) => (
                <li key={gathering.id} className="font-sans text-sm text-slate-800">
                  <span className="block font-heading text-sm font-bold tracking-tight">
                    {gathering.label}
                  </span>
                  <span className="text-slate-600">
                    {gathering.day} · {gathering.time}
                  </span>
                </li>
              ))}
            </ul>
          </span>
        </div>

        <div className="flex flex-col items-center gap-4 rounded-2xl bg-white p-5 shadow-sm ring-1 ring-violet-100">
          <span className="flex size-11 items-center justify-center rounded-full bg-violet-700 text-white">
            <MapPin className="size-5" />
          </span>
          <span className="flex flex-col items-center text-center">
            <Typography variant="caption" className="uppercase tracking-widest text-sky-600">
              Adresse
            </Typography>
            <Typography variant="h4" className="mt-1 text-base sm:text-lg">
              {siteConfig.location.address}, {siteConfig.location.country}
            </Typography>
          </span>
        </div>

        <a
          href={siteConfig.contacts.whatsappChannel.href}
          target="_blank"
          rel="noopener noreferrer"
          className="flex flex-col items-center gap-4 rounded-2xl bg-white p-5 shadow-sm ring-1 ring-violet-100 transition-colors hover:ring-amber-500"
        >
          <span className="flex size-11 items-center justify-center rounded-full bg-violet-700 text-white">
            <MessageCircle className="size-5" />
          </span>
          <span className="flex flex-col items-center text-center">
            <Typography variant="caption" className="uppercase tracking-widest text-sky-600">
              {siteConfig.contacts.whatsappChannel.label}
            </Typography>
            <Typography variant="h4" className="mt-1 text-base sm:text-lg">
              Rejoindre le canal WhatsApp
            </Typography>
          </span>
        </a>
      </div>
    </section>
  );
}
