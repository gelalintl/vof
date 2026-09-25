import type { Event } from "@/types";
import { toMediaCard } from "@/lib/eventPresentation";
import { MediaCard } from "@/ui/components/cards";

interface EventCardProps {
  event: Event;
}

export function EventCard({ event }: EventCardProps) {
  return <MediaCard card={toMediaCard(event)} />;
}
