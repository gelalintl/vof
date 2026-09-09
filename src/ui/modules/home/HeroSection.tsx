import { siteConfig } from "@/config/site";
import { Badge } from "@/ui/design-system/badge";
import { Button } from "@/ui/design-system/button";
import { Typography } from "@/ui/design-system/typography";
import { YoutubeLiteEmbed } from "@/ui/components/YoutubeLiteEmbed";

export function HeroSection() {
  const videoId = siteConfig.media.featuredYoutubeId;

  return (
    <section className="relative overflow-hidden bg-violet-700 text-white">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_#0284C7_0%,_transparent_42%)] opacity-40" />
      <div className="relative mx-auto grid max-w-6xl items-center gap-10 px-4 py-14 sm:px-6 lg:grid-cols-2 lg:py-20">
        <div>
          <Badge variant="accent">{siteConfig.worship.sunday.label}</Badge>
          <Typography
            variant="h1"
            className="mt-5 text-white"
          >
            Bienvenue à l&apos;Église Voice Of Freedom
          </Typography>
          <Typography variant="lead" className="mt-4 text-white/90">
            {siteConfig.tagline}. Venez adorer avec nous chaque{" "}
            {siteConfig.worship.sunday.day.toLowerCase()} à{" "}
            {siteConfig.worship.sunday.time}.
          </Typography>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Button href="#infos-pratiques" variant="accent">
              Rejoindre le culte
            </Button>
            <Button
              href="/a-propos"
              variant="outline"
              className="border-white text-white hover:bg-white/10"
            >
              Découvrir VOF
            </Button>
          </div>
        </div>

        {videoId ? (
          <YoutubeLiteEmbed
            videoId={videoId}
            title={siteConfig.media.featuredYoutubeTitle}
          />
        ) : (
          <div className="flex aspect-video items-end rounded-2xl bg-sky-600/40 p-6 ring-1 ring-white/20">
            <div>
              <p className="font-heading text-lg font-extrabold tracking-tight">
                {siteConfig.worship.sunday.day} · {siteConfig.worship.sunday.time}
              </p>
              <p className="mt-1 font-sans text-sm text-white/85">
                Le replay du culte sera bientôt disponible ici, en lecture
                différée pour les connexions 3G/4G.
              </p>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
