import type { Metadata } from "next";
import { isLocale } from "@/i18n/config";
import { getDictionary } from "@/i18n/getDictionary";
import { metadataLocale, staticPageMetadata } from "@/i18n/metadata";
import { excerptRichText } from "@/lib/richText";
import { getActivePublicProjects, getPublicProjectBySlug } from "@/lib/publicContent";
import { contactFromSettings, getLocalizedSiteSettings } from "@/lib/settings";
import { getPublicPaymentConfig } from "@/lib/siteSettings";
import { toWhatsAppHref } from "@/lib/siteSettingsKeys";
import { QuoteBlock } from "@/ui/components/content";
import { DonateFlow } from "@/ui/components/forms";
import { ContentSection, PageHero, SoftPanel } from "@/ui/components/layout";
import { MainLayout } from "@/ui/layouts/MainLayout";

interface DonatePageProps {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ projet?: string }>;
}

export async function generateMetadata({
  params,
  searchParams,
}: DonatePageProps): Promise<Metadata> {
  const [{ locale }, { projet }] = await Promise.all([params, searchParams]);
  const fallback = staticPageMetadata(locale, "donate");
  const slug = projet?.trim();
  if (!slug) {
    return fallback;
  }

  const project = await getPublicProjectBySlug(slug, metadataLocale(locale));
  if (!project) {
    return fallback;
  }

  const description = excerptRichText(project.description, 160);
  return {
    title: project.title,
    description: description || fallback.description,
  };
}

export default async function DonatePage({ params, searchParams }: DonatePageProps) {
  const [{ locale: localeParam }, { projet }, paymentConfig, projects, settings] =
    await Promise.all([
      params,
      searchParams,
      getPublicPaymentConfig(),
      getActivePublicProjects(),
      getLocalizedSiteSettings(),
    ]);
  const locale = isLocale(localeParam) ? localeParam : "fr";
  const { donate } = getDictionary(locale);
  const contact = contactFromSettings(settings);
  const initialProjectId =
    projects.find((project) => project.slug === projet)?.id ?? "";
  const whatsappHref = toWhatsAppHref(
    settings.whatsapp_number || contact.location.phone || contact.social.whatsapp,
  );

  return (
    <MainLayout>
      <PageHero
        badge={donate.heroBadge}
        title={donate.heroTitle}
        description={donate.heroDescription}
        glow="amber"
        width="narrow"
      />
      <ContentSection width="narrow" padding="compact" align="center">
        <QuoteBlock
          quote={donate.quote}
          attribution={donate.quoteAttribution}
          align="center"
        />
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
