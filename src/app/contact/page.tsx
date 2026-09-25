import type { Metadata } from "next";
import { getPublicSiteContact } from "@/lib/siteSettings";
import { contactHero } from "@/datas/pageCopy";
import { PageHero } from "@/ui/components/layout";
import { MainLayout } from "@/ui/layouts/MainLayout";
import { ContactStack } from "@/ui/modules/contact";

export const metadata: Metadata = {
  title: "Contact",
  description:
    "Écrire à l'Église Voice Of Freedom, trouver l'adresse, les horaires et les accès WhatsApp, YouTube et Facebook.",
};

export default async function ContactPage() {
  const contact = await getPublicSiteContact();

  return (
    <MainLayout>
      <PageHero {...contactHero} />
      <ContactStack contact={contact} />
    </MainLayout>
  );
}
