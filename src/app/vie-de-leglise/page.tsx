import type { Metadata } from "next";
import { churchLifeHero } from "@/datas/pageCopy";
import {
  getMonthlyEvents,
  getRecurringGatherings,
  getSpotlightEvent,
} from "@/lib/publicContent";
import { PageHero } from "@/ui/components/layout";
import { MainLayout } from "@/ui/layouts/MainLayout";
import { CalendarWidget } from "@/ui/modules/calendar";
import { FeaturedEventSection, RegularGatheringsSection } from "@/ui/modules/events";

export const metadata: Metadata = {
  title: "Vie de l'église",
  description:
    "Vie communautaire, rassemblements réguliers, prochain événement et agenda de l'Église Voice Of Freedom.",
};

export default async function ChurchLifePage() {
  const now = new Date();
  const year = now.getFullYear();
  const month = now.getMonth() + 1;
  const [spotlight, monthEvents, gatherings] = await Promise.all([
    getSpotlightEvent(),
    getMonthlyEvents(year, month),
    getRecurringGatherings(),
  ]);

  return (
    <MainLayout>
      <PageHero {...churchLifeHero} />
      <FeaturedEventSection event={spotlight} />
      <CalendarWidget
        initialYear={year}
        initialMonth={month}
        initialEvents={monthEvents}
      />
      <RegularGatheringsSection gatherings={gatherings} />
    </MainLayout>
  );
}
