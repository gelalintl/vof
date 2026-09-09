import type { Metadata } from "next";
import { events, getFeaturedEvents } from "@/datas/events";
import { MainLayout } from "@/ui/layouts/MainLayout";
import { EventSlider } from "@/ui/modules/events/EventSlider";
import { EventCatalog } from "@/ui/modules/events/EventCatalog";
import { Badge } from "@/ui/design-system/badge";
import { Typography } from "@/ui/design-system/typography";

export const metadata: Metadata = {
  title: "Vie de l'église",
  description:
    "Cultes, enseignements, jeunesse et séminaires de l'Église Voice Of Freedom.",
};

export default function ChurchLifePage() {
  const featured = getFeaturedEvents();

  return (
    <MainLayout>
      <section className="relative overflow-hidden bg-violet-700 text-white">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_#0284C7_0%,_transparent_46%)] opacity-40" />
        <div className="relative mx-auto max-w-6xl px-4 py-14 sm:px-6">
          <Badge variant="accent">Médias & agenda</Badge>
          <Typography variant="h1" className="mt-4 text-white">
            Vie de l&apos;église
          </Typography>
          <Typography variant="lead" className="mt-4 max-w-2xl text-white/90">
            Annonces, enseignements, soirées jeunesse et séminaires d&apos;impact.
            Filtrez par couleur : violet, bleu ciel ou rouge.
          </Typography>
        </div>
      </section>
      <EventSlider events={featured} />
      <EventCatalog events={events} />
    </MainLayout>
  );
}
