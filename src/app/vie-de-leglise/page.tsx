import type { Metadata } from "next";
import { churchLifeHero } from "@/datas/pageCopy";
import { getFeaturedPublicEvents, getPublicEvents } from "@/lib/publicContent";
import { PageHero } from "@/ui/components/layout";
import { MainLayout } from "@/ui/layouts/MainLayout";
import { EventCatalog, EventSlider } from "@/ui/modules/events";

export const metadata: Metadata = {
  title: "Vie de l'église",
  description:
    "Cultes, enseignements, jeunesse et séminaires de l'Église Voice Of Freedom.",
};

export default async function ChurchLifePage() {
  const [events, featured] = await Promise.all([
    getPublicEvents(),
    getFeaturedPublicEvents(),
  ]);

  return (
    <MainLayout>
      <PageHero {...churchLifeHero} />
      <EventSlider events={featured} />
      <EventCatalog events={events} />
    </MainLayout>
  );
}
