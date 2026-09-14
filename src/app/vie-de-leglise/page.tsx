import type { Metadata } from "next";
import { events, getFeaturedEvents } from "@/datas/events";
import { churchLifeHero } from "@/datas/pageCopy";
import { PageHero } from "@/ui/components/PageHero";
import { MainLayout } from "@/ui/layouts/MainLayout";
import { EventCatalog } from "@/ui/modules/events/EventCatalog";
import { EventSlider } from "@/ui/modules/events/EventSlider";

export const metadata: Metadata = {
  title: "Vie de l'église",
  description:
    "Cultes, enseignements, jeunesse et séminaires de l'Église Voice Of Freedom.",
};

export default function ChurchLifePage() {
  const featured = getFeaturedEvents();

  return (
    <MainLayout>
      <PageHero {...churchLifeHero} />
      <EventSlider events={featured} />
      <EventCatalog events={events} />
    </MainLayout>
  );
}
