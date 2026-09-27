import type { Metadata } from "next";
import { donateHero, donateQuote } from "@/datas/pageCopy";
import { getActivePublicProjects } from "@/lib/publicContent";
import { contactFromSettings, getSiteSettings } from "@/lib/settings";
import { getPublicPaymentConfig } from "@/lib/siteSettings";
import { toWhatsAppHref } from "@/lib/siteSettingsKeys";
import { QuoteBlock } from "@/ui/components/content";
import { DonateFlow } from "@/ui/components/forms";
import { ContentSection, PageHero, SoftPanel } from "@/ui/components/layout";
import { MainLayout } from "@/ui/layouts/MainLayout";

export const metadata: Metadata = {
  title: "Soutenir",
  description:
    "Soutenez l'œuvre Voice Of Freedom en FCFA : don unique ou récurrent, Mobile Money, carte bancaire ou virement RIB.",
};

interface DonatePageProps {
  searchParams: Promise<{ projet?: string }>;
}

export default async function DonatePage({ searchParams }: DonatePageProps) {
  const [{ projet }, paymentConfig, projects, settings] = await Promise.all([
    searchParams,
    getPublicPaymentConfig(),
    getActivePublicProjects(),
    getSiteSettings(),
  ]);
  const contact = contactFromSettings(settings);
  const initialProjectId =
    projects.find((project) => project.slug === projet)?.id ?? "";
  const whatsappHref = toWhatsAppHref(
    settings.whatsapp_number || contact.location.phone || contact.social.whatsapp,
  );

  return (
    <MainLayout>
      <PageHero {...donateHero} />
      <ContentSection width="narrow" padding="compact" align="center">
        <QuoteBlock {...donateQuote} />
        <SoftPanel>
          <DonateFlow
            layout="page"
            paymentConfig={paymentConfig}
            projects={projects}
            initialProjectId={initialProjectId}
            whatsappHref={whatsappHref}
          />
        </SoftPanel>
      </ContentSection>
    </MainLayout>
  );
}
