import Image from "next/image";
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
  backgroundImage,
  actions,
  media,
}: PageHeroProps) {
  const hasMedia = Boolean(media);
  const hasBackground = Boolean(backgroundImage?.trim());

  return (
    <section
      className={cn(
        "relative overflow-hidden text-white",
        hasBackground ? "bg-slate-950" : "bg-violet-700",
      )}
    >
      {hasBackground && backgroundImage ? (
        <>
          <HeroBackgroundImage src={backgroundImage} />
          <div
            className="pointer-events-none absolute inset-0 bg-gradient-to-r from-slate-950/90 via-purple-950/80 to-slate-900/70"
            aria-hidden
          />
        </>
      ) : (
        <div
          className={cn("pointer-events-none absolute inset-0 overflow-hidden", glowClass[glow])}
        />
      )}
      <div
        className={cn(
          "relative mx-auto px-4 py-14 sm:px-6",
          width === "narrow" ? "max-w-xl" : "max-w-6xl",
          hasMedia && "grid items-center gap-10 lg:grid-cols-2 lg:py-20",
        )}
      >
        <div className={cn(hasBackground && "drop-shadow-sm")}>
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
        {media ? (
          <HeroMedia {...media} emphasized={hasBackground} />
        ) : null}
      </div>
    </section>
  );
}

function HeroBackgroundImage({ src }: { src: string }) {
  const useNativeImg =
    src.startsWith("blob:") || src.startsWith("data:") || src.startsWith("http");

  if (useNativeImg) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={src}
        alt=""
        className="absolute inset-0 size-full object-cover"
        aria-hidden
      />
    );
  }

  return (
    <Image
      src={src}
      alt=""
      fill
      priority
      sizes="100vw"
      className="object-cover"
      aria-hidden
    />
  );
}

function HeroMedia({
  videoId,
  videoTitle,
  fallbackDay,
  fallbackTime,
  fallbackText,
  emphasized,
}: NonNullable<PageHeroData["media"]> & { emphasized?: boolean }) {
  const frameClass = emphasized
    ? "ring-2 ring-white/40 shadow-2xl"
    : undefined;

  if (videoId) {
    return (
      <YoutubeLiteEmbed
        videoId={videoId}
        title={videoTitle ?? "Replay"}
        className={frameClass}
      />
    );
  }

  if (!fallbackDay && !fallbackText) {
    return null;
  }

  return (
    <div
      className={cn(
        "flex aspect-video items-end rounded-2xl bg-sky-600/40 p-6 ring-1 ring-white/20",
        emphasized && "bg-slate-950/55 ring-2 ring-white/40 shadow-2xl",
      )}
    >
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
