import type { Metadata } from "next";
import { isLocale } from "@/i18n/config";
import { getDictionary } from "@/i18n/getDictionary";
import { staticPageMetadata } from "@/i18n/metadata";
import { ContentSection, PageHero } from "@/ui/components/layout";
import { TestimonialForm } from "@/ui/components/testimonials";
import { MainLayout } from "@/ui/layouts/MainLayout";

interface ShareTestimonialPageProps {
  params: Promise<{ locale: string }>;
}

export async function generateMetadata({
  params,
}: ShareTestimonialPageProps): Promise<Metadata> {
  const { locale } = await params;
  return staticPageMetadata(locale, "shareTestimony");
}

export default async function ShareTestimonialPage({ params }: ShareTestimonialPageProps) {
  const { locale: localeParam } = await params;
  const locale = isLocale(localeParam) ? localeParam : "fr";
  const { shareTestimony } = getDictionary(locale);

  return (
    <MainLayout>
      <PageHero
        badge={shareTestimony.badge}
        title={shareTestimony.title}
        description={shareTestimony.description}
      />
      <ContentSection width="narrow" labelledBy="formulaire-temoignage">
        <h2 id="formulaire-temoignage" className="sr-only">
          {shareTestimony.title}
        </h2>
        <TestimonialForm
          locale={locale}
          labels={{
            fullName: shareTestimony.fullName,
            contact: shareTestimony.contact,
            contactPlaceholder: shareTestimony.contactPlaceholder,
            contactHint: shareTestimony.contactHint,
            content: shareTestimony.content,
            contentPlaceholder: shareTestimony.contentPlaceholder,
            submit: shareTestimony.submit,
            sending: shareTestimony.sending,
            success: shareTestimony.success,
            honeypot: shareTestimony.honeypot,
          }}
        />
      </ContentSection>
    </MainLayout>
  );
}
