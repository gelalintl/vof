import { Clock, MapPin, MessageCircle } from "lucide-react";
import type { InfoTileData, InfoTileIcon } from "@/types";
import { cn } from "@/utils/cn";
import { Typography } from "@/ui/design-system/typography";

const icons: Record<InfoTileIcon, typeof Clock> = {
  clock: Clock,
  map: MapPin,
  message: MessageCircle,
};

export interface InfoTileProps {
  tile: InfoTileData;
}

export function InfoTile({ tile }: InfoTileProps) {
  const Icon = icons[tile.icon];
  const inner = (
    <>
      <span className="flex size-11 items-center justify-center rounded-full bg-violet-700 text-white">
        <Icon className="size-5" />
      </span>
      <span className="flex w-full flex-col items-center justify-center text-center">
        <Typography variant="caption" className="uppercase tracking-widest text-sky-600">
          {tile.title}
        </Typography>
        {tile.description ? (
          <Typography
            variant="h4"
            className="mx-auto mt-1 max-w-prose text-center text-base leading-relaxed sm:max-w-xl sm:text-lg"
          >
            {tile.description}
          </Typography>
        ) : null}
        {tile.items && tile.items.length > 0 ? (
          <ul className="mx-auto mt-3 w-full max-w-prose space-y-2 text-center">
            {tile.items.map((item) => (
              <li key={item.title} className="font-sans text-sm text-slate-800">
                <span className="block font-heading text-sm font-bold tracking-tight">
                  {item.title}
                </span>
                <span className="text-slate-600">{item.detail}</span>
              </li>
            ))}
          </ul>
        ) : null}
      </span>
    </>
  );

  const className = cn(
    "flex flex-col items-center gap-4 rounded-2xl bg-white p-5 shadow-sm ring-1 ring-violet-100",
    tile.href && "transition-colors hover:ring-amber-500",
  );

  if (tile.href) {
    return (
      <a href={tile.href} target="_blank" rel="noopener noreferrer" className={className}>
        {inner}
      </a>
    );
  }

  return <div className={className}>{inner}</div>;
}

export interface InfoTileGridProps {
  tiles: InfoTileData[];
  className?: string;
}

export function InfoTileGrid({ tiles, className }: InfoTileGridProps) {
  return (
    <div
      className={cn(
        "grid gap-4 md:grid-cols-3",
        className,
      )}
    >
      {tiles.map((tile) => (
        <InfoTile key={tile.id} tile={tile} />
      ))}
    </div>
  );
}
