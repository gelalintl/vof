import type { Metadata } from "next";
import { contactHero } from "@/datas/pageCopy";
import { PageHero } from "@/ui/components/PageHero";
import { MainLayout } from "@/ui/layouts/MainLayout";
import { ContactStack } from "@/ui/modules/contact/ContactStack";

export const metadata: Metadata = {
  title: "Contact",
  description:
    "Écrire à l'Église Voice Of Freedom, trouver l'adresse, les horaires et les accès WhatsApp, YouTube et Facebook.",
};

export default function ContactPage() {
  return (
    <MainLayout>
      <PageHero {...contactHero} />
      <ContactStack />
    </MainLayout>
  );
}
