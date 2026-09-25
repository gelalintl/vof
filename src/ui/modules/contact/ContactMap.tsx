import { Navigation } from "lucide-react";

interface ContactMapProps {
  iframeUrl: string;
  mapsUrl: string;
  address: string;
}

export function ContactMap({ iframeUrl, mapsUrl, address }: ContactMapProps) {
  return (
    <section aria-labelledby="carte-vof" className="w-full bg-slate-50">
      <h2 id="carte-vof" className="sr-only">
        Localisation de l&apos;église
      </h2>
      <div className="relative">
        {iframeUrl ? (
          <iframe
            title={address || "Localisation de l'église"}
            src={iframeUrl}
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            className="block h-[50vh] min-h-[320px] w-full border-0 sm:h-[60vh] sm:min-h-[420px]"
            allowFullScreen
          />
        ) : (
          <div className="flex h-[40vh] min-h-[260px] items-center justify-center bg-slate-100 px-6 text-center text-sm text-slate-600">
            Carte non configurée. Ajoutez une URL d’intégration dans les paramètres.
          </div>
        )}
        {mapsUrl ? (
          <div className="pointer-events-none absolute inset-x-0 bottom-0 bg-gradient-to-t from-slate-900/50 to-transparent p-4 sm:p-6">
            <a
              href={mapsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="pointer-events-auto inline-flex h-12 items-center justify-center gap-2 rounded-full bg-amber-500 px-5 font-heading text-sm font-bold tracking-tight text-slate-900 shadow-lg hover:bg-amber-400"
            >
              <Navigation className="size-4" />
              Ouvrir dans Google Maps
            </a>
          </div>
        ) : null}
      </div>
    </section>
  );
}
