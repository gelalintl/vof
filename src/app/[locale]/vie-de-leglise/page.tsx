import type { Metadata } from "next";
import { isLocale } from "@/i18n/config";
import { getDictionary } from "@/i18n/getDictionary";
import { staticPageMetadata } from "@/i18n/metadata";
import {
  getMonthlyEvents,
  getRecurringGatherings,
  getSpotlightEvent,
} from "@/lib/publicContent";
import { PageHero } from "@/ui/components/layout";
import { MainLayout } from "@/ui/layouts/MainLayout";
import { CalendarWidget } from "@/ui/modules/calendar";
import { FeaturedEventSection, RegularGatheringsSection } from "@/ui/modules/events";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  return staticPageMetadata(locale, "churchLife");
}

export default async function ChurchLifePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale: localeParam } = await params;
  const locale = isLocale(localeParam) ? localeParam : "fr";
  const { churchLife, calendar, common, home } = getDictionary(locale);
  const now = new Date();
  const year = now.getFullYear();
  const month = now.getMonth() + 1;
  const [spotlight, monthEvents, gatherings] = await Promise.all([
    getSpotlightEvent(),
    getMonthlyEvents(year, month, locale),
    getRecurringGatherings(),
  ]);

  return (
    <MainLayout>
      <PageHero
        badge={churchLife.badge}
        title={churchLife.title}
        description={churchLife.description}
      />
      <FeaturedEventSection
        event={spotlight}
        locale={locale}
        labels={{
          badge: home.featured,
          title: churchLife.featuredTitle,
          description: churchLife.featuredDescription,
          seeAnnouncement: common.seeAnnouncement,
        }}
        kindLabels={common.eventKinds}
      />
      <CalendarWidget
        initialYear={year}
        initialMonth={month}
        initialEvents={monthEvents}
        locale={locale}
        weekdays={calendar.weekdaysShort}
        labels={{
          badge: calendar.badge,
          title: calendar.title,
          description: calendar.description,
          previousMonth: calendar.previousMonth,
          nextMonth: calendar.nextMonth,
          dayAppointments: calendar.dayAppointments,
          upcomingTitle: calendar.upcomingTitle,
          dayCount: calendar.dayCount,
          loading: calendar.loading,
          emptyDay: calendar.emptyDay,
          emptyPeriod: calendar.emptyPeriod,
          fastingPostponed: calendar.fastingPostponed,
          fastingRange: calendar.fastingRange,
        }}
        typeLabels={calendar.types}
        kindLabels={common.eventKinds}
      />
      <RegularGatheringsSection
        gatherings={gatherings}
        locale={locale}
        labels={{
          badge: churchLife.gatheringsBadge,
          title: churchLife.gatheringsTitle,
          description: churchLife.gatheringsDescription,
          empty: churchLife.gatheringsEmpty,
        }}
        recurrence={{
          weekdaysLong: calendar.weekdaysLong,
          weekly: calendar.weekly,
          daily: calendar.daily,
          monthly: calendar.monthly,
          first3Days: calendar.first3Days,
          secondAndLastFriday: calendar.secondAndLastFriday,
        }}
      />
    </MainLayout>
  );
}
