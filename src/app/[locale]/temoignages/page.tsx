import type { Metadata } from "next";
import { isLocale } from "@/i18n/config";
import { getDictionary } from "@/i18n/getDictionary";
import { staticPageMetadata } from "@/i18n/metadata";
import { getPublishedTestimonials } from "@/lib/publicContent";
import { ContentSection, PageHero } from "@/ui/components/layout";
import { CallToTestify, TestimonialGrid } from "@/ui/components/testimonials";
import { MainLayout } from "@/ui/layouts/MainLayout";

interface TestimonialsPageProps {
  params: Promise<{ locale: string }>;
}

export async function generateMetadata({ params }: TestimonialsPageProps): Promise<Metadata> {
  const { locale } = await params;
  return staticPageMetadata(locale, "testimonials");
}

export default async function TestimonialsPage({ params }: TestimonialsPageProps) {
  const { locale: localeParam } = await params;
  const locale = isLocale(localeParam) ? localeParam : "fr";
  const { nav, testimonials: copy } = getDictionary(locale);
  const testimonials = await getPublishedTestimonials();

  return (
    <MainLayout>
      <PageHero badge={copy.badge} title={copy.title} description={copy.description} />
      {testimonials.length > 0 ? (
        <ContentSection labelledBy="liste-temoignages">
          <h2 id="liste-temoignages" className="sr-only">
            {copy.listLabel}
          </h2>
          <TestimonialGrid testimonials={testimonials} locale={locale} />
          <CallToTestify
            labels={{
              aria: copy.callAria,
              quote: copy.callQuote,
              action: nav.shareTestimony,
            }}
          />
        </ContentSection>
      ) : (
        <ContentSection width="prose" padding="default" labelledBy="temoignages-vide">
          <h2 id="temoignages-vide" className="sr-only">
            {copy.emptyLabel}
          </h2>
          <CallToTestify
            className="py-12"
            labels={{
              aria: copy.callAria,
              quote: copy.callQuote,
              action: nav.shareTestimony,
            }}
          />
        </ContentSection>
      )}
    </MainLayout>
  );
}
