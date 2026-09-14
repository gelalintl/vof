import type { PageHeroAction, PageHeroData } from "@/types";
import { cn } from "@/utils/cn";
import { Badge } from "@/ui/design-system/badge";
import { Button } from "@/ui/design-system/button";
import { Typography } from "@/ui/design-system/typography";
import { YoutubeLiteEmbed } from "@/ui/components/media/YoutubeLiteEmbed";

export type PageHeroProps = PageHeroData;

const glowClass = {
  sky: "bg-[radial-gradient(circle_at_top_right,_#0284C7_0%,_transparent_46%)] opacity-40",
  amber: "bg-[radial-gradient(circle_at_top_right,_#F59E0B_0%,_transparent_42%)] opacity-30",
} as const;

export function PageHero({
  badge,
  title,
  description,
  glow = "sky",
  width = "default",
  actions,
  media,
}: PageHeroProps) {
  const hasMedia = Boolean(media);

  return (
    <section className="relative overflow-hidden bg-violet-700 text-white">
      <div className={cn("absolute inset-0", glowClass[glow])} />
      <div
        className={cn(
          "relative mx-auto px-4 py-14 sm:px-6",
          width === "narrow" ? "max-w-xl" : "max-w-6xl",
          hasMedia && "grid items-center gap-10 lg:grid-cols-2 lg:py-20",
        )}
      >
        <div>
          <Badge variant="accent">{badge}</Badge>
          <Typography variant="h1" className="mt-4 text-white">
            {title}
          </Typography>
          <Typography variant="lead" className="mt-4 max-w-2xl text-white/90">
            {description}
          </Typography>
          {actions && actions.length > 0 ? (
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              {actions.map((action: PageHeroAction) => (
                <Button key={action.href} href={action.href} variant={action.variant}>
                  {action.label}
                </Button>
              ))}
            </div>
          ) : null}
        </div>
        {media ? <HeroMedia {...media} /> : null}
      </div>
    </section>
  );
}

function HeroMedia({
  videoId,
  videoTitle,
  fallbackDay,
  fallbackTime,
  fallbackText,
}: NonNullable<PageHeroData["media"]>) {
  if (videoId) {
    return <YoutubeLiteEmbed videoId={videoId} title={videoTitle ?? "Replay"} />;
  }

  if (!fallbackDay && !fallbackText) {
    return null;
  }

  return (
    <div className="flex aspect-video items-end rounded-2xl bg-sky-600/40 p-6 ring-1 ring-white/20">
      <div>
        {fallbackDay ? (
          <p className="font-heading text-lg font-extrabold tracking-tight">
            {fallbackDay}
            {fallbackTime ? ` · ${fallbackTime}` : ""}
          </p>
        ) : null}
        {fallbackText ? (
          <p className="mt-1 font-sans text-sm text-white/85">{fallbackText}</p>
        ) : null}
      </div>
    </div>
  );
}
