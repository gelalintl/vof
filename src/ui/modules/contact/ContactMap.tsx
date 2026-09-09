import { Navigation } from "lucide-react";
import { siteConfig } from "@/config/site";

export function ContactMap() {
  const shareUrl = siteConfig.location.mapsShareUrl;

  return (
    <section aria-labelledby="carte-vof" className="w-full bg-slate-50">
      <h2 id="carte-vof" className="sr-only">
        Localisation de l&apos;église
      </h2>
      <div className="relative">
        <iframe
          title={`${siteConfig.legalName} — ${siteConfig.location.address}`}
          src={siteConfig.location.mapsEmbedUrl}
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          className="block h-[50vh] min-h-[320px] w-full border-0 sm:h-[60vh] sm:min-h-[420px]"
          allowFullScreen
        />
        <div className="pointer-events-none absolute inset-x-0 bottom-0 bg-gradient-to-t from-slate-900/50 to-transparent p-4 sm:p-6">
          <a
            href={shareUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="pointer-events-auto inline-flex h-12 items-center justify-center gap-2 rounded-full bg-amber-500 px-5 font-heading text-sm font-bold tracking-tight text-slate-900 shadow-lg hover:bg-amber-400"
          >
            <Navigation className="size-4" />
            Ouvrir dans Google Maps
          </a>
        </div>
      </div>
    </section>
  );
}
