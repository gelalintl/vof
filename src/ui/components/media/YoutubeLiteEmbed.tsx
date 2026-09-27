"use client";

import { useEffect, useRef, useState } from "react";
import { Play } from "lucide-react";
import { cn } from "@/utils/cn";
import { FloatingYoutubePlayer } from "./FloatingYoutubePlayer";

interface YoutubeLiteEmbedProps {
  videoId: string;
  title: string;
  className?: string;
  enableMiniPlayer?: boolean;
}

export function YoutubeLiteEmbed({
  videoId,
  title,
  className,
  enableMiniPlayer = true,
}: YoutubeLiteEmbedProps) {
  const sentinelRef = useRef<HTMLDivElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isFloating, setIsFloating] = useState(false);
  const [pipDismissed, setPipDismissed] = useState(false);
  const thumbnail = `https://i.ytimg.com/vi/${videoId}/hqdefault.jpg`;

  useEffect(() => {
    if (!isPlaying || !enableMiniPlayer) {
      setIsFloating(false);
      return;
    }

    const sentinel = sentinelRef.current;
    if (!sentinel) {
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry) {
          return;
        }

        if (entry.isIntersecting) {
          setPipDismissed(false);
          setIsFloating(false);
          return;
        }

        if (!pipDismissed) {
          setIsFloating(true);
        }
      },
      { threshold: 0.2, rootMargin: "0px" },
    );

    observer.observe(sentinel);
    return () => observer.disconnect();
  }, [enableMiniPlayer, isPlaying, pipDismissed]);

  if (!isPlaying) {
    return (
      <button
        type="button"
        onClick={() => setIsPlaying(true)}
        className={cn(
          "group relative block aspect-video w-full overflow-hidden rounded-2xl bg-slate-900 text-left",
          className,
        )}
        aria-label={`Lire la vidéo : ${title}`}
      >
        {/* Lite facade: native img avoids the extra optimizer round-trip on 3G/4G */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={thumbnail}
          alt=""
          width={480}
          height={270}
          loading="lazy"
          decoding="async"
          className="size-full object-cover"
        />
        <span className="absolute inset-0 bg-violet-950/35" />
        <span className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-slate-900/80 to-transparent p-4">
          <span className="font-heading text-sm font-bold tracking-tight text-white sm:text-base">
            {title}
          </span>
        </span>
        <span className="absolute left-1/2 top-1/2 flex size-16 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-amber-500 text-slate-900 shadow-lg transition-transform group-hover:scale-105">
          <Play className="size-7 fill-current" />
        </span>
      </button>
    );
  }

  return (
    <div
      ref={sentinelRef}
      id="lecteur-youtube"
      className={cn("relative aspect-video w-full rounded-2xl bg-slate-900", className)}
    >
      <FloatingYoutubePlayer
        active={isFloating}
        title={title}
        onClose={() => {
          setPipDismissed(true);
          setIsFloating(false);
        }}
        onReturnToPlayer={() => {
          window.scrollTo({ top: 0, behavior: "smooth" });
        }}
      >
        <iframe
          title={title}
          src={`https://www.youtube-nocookie.com/embed/${videoId}?autoplay=1`}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          className="size-full border-0"
        />
      </FloatingYoutubePlayer>
    </div>
  );
}
