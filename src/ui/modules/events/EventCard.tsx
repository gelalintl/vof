import type { Event } from "@/types";
import { toMediaCard } from "@/datas/events";
import { MediaCard } from "@/ui/components/MediaCard";

interface EventCardProps {
  event: Event;
}

export function EventCard({ event }: EventCardProps) {
  return <MediaCard card={toMediaCard(event)} />;
}
