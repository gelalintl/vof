import type { Metadata } from "next";
import { getMonthlyEvents, getPublicEvents } from "@/lib/publicContent";
import { PageHero } from "@/ui/components/layout";
import { MainLayout } from "@/ui/layouts/MainLayout";
import { CalendarWidget } from "@/ui/modules/calendar";
import { EventCatalog } from "@/ui/modules/events";

export const metadata: Metadata = {
  title: "Rassemblements",
  description:
    "Calendrier et liste des rassemblements de l'Église Voice Of Freedom.",
};

export default async function GatheringsPage() {
  const now = new Date();
  const year = now.getFullYear();
  const month = now.getMonth() + 1;
  const [events, monthEvents] = await Promise.all([
    getPublicEvents(),
    getMonthlyEvents(year, month),
  ]);

  return (
    <MainLayout>
      <PageHero
        badge="Agenda"
        title="Rassemblements"
        description="Les événements réels de l'église : catégories, lieux et visuels enregistrés en base."
      />
      <CalendarWidget
        initialYear={year}
        initialMonth={month}
        initialEvents={monthEvents}
      />
      <EventCatalog events={events} />
    </MainLayout>
  );
}
