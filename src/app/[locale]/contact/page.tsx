import type { Metadata } from "next";
import { siteConfig } from "@/config/site";
import { contactSubjects } from "@/config/forms";
import { isLocale } from "@/i18n/config";
import { getDictionary } from "@/i18n/getDictionary";
import { staticPageMetadata } from "@/i18n/metadata";
import { getPublicSiteContact } from "@/lib/siteSettings";
import { formatClockLabel } from "@/utils/date/format";
import { PageHero } from "@/ui/components/layout";
import { MainLayout } from "@/ui/layouts/MainLayout";
import { ContactStack } from "@/ui/modules/contact";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  return staticPageMetadata(locale, "contact");
}

export default async function ContactPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale: localeParam } = await params;
  const locale = isLocale(localeParam) ? localeParam : "fr";
  const dictionary = getDictionary(locale);
  const { contact } = dictionary;
  const siteContact = await getPublicSiteContact();
  const address = [siteContact.location.address, siteContact.location.city]
    .filter(Boolean)
    .join(", ");
  const scheduleLabels = dictionary.footer.scheduleLabels as Record<string, string>;
  const scheduleDays = dictionary.calendar.scheduleDays as Record<string, string>;

  return (
    <MainLayout>
      <PageHero
        badge={contact.badge}
        title={contact.title}
        description={address || `${siteConfig.location.address}, ${siteConfig.location.country}.`}
        width="narrow"
      />
      <ContactStack
        locale={locale}
        contact={siteContact}
        gatherings={siteConfig.worship.gatherings.map((gathering) => ({
          id: gathering.id,
          label: scheduleLabels[gathering.label] ?? gathering.label,
          detail: `${scheduleDays[gathering.day] ?? gathering.day} · ${formatClockLabel(gathering.time, locale)}`,
        }))}
        subjects={contactSubjects.map((item) => ({
          value: item.value,
          label: contact.subjects[item.value],
        }))}
        labels={contact}
      />
    </MainLayout>
  );
}
