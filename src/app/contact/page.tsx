import type { Metadata } from "next";
import { siteConfig } from "@/config/site";
import { MainLayout } from "@/ui/layouts/MainLayout";
import { ContactStack } from "@/ui/modules/contact/ContactStack";
import { Badge } from "@/ui/design-system/badge";
import { Typography } from "@/ui/design-system/typography";

export const metadata: Metadata = {
  title: "Contact",
  description:
    "Écrire à l'Église Voice Of Freedom, trouver l'adresse, les horaires et les accès WhatsApp, YouTube et Facebook.",
};

export default function ContactPage() {
  return (
    <MainLayout>
      <section className="relative overflow-hidden bg-violet-700 text-white">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_#0284C7_0%,_transparent_46%)] opacity-40" />
        <div className="relative mx-auto max-w-xl px-4 py-14 sm:px-6">
          <Badge variant="accent">Nous rejoindre</Badge>
          <Typography variant="h1" className="mt-4 text-white">
            Contact
          </Typography>
          <Typography variant="lead" className="mt-4 text-white/90">
            {siteConfig.location.address}, {siteConfig.location.country}. Une
            colonne, de la carte au message.
          </Typography>
        </div>
      </section>
      <ContactStack />
    </MainLayout>
  );
}
