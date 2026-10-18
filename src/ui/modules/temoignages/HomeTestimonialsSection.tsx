import type { Locale } from "@/i18n/config";
import type { ContentSectionTone, PublicTestimonial } from "@/types";
import { ContentSection, SectionHeader, SeeAllLink } from "@/ui/components/layout";
import { CallToTestify, TestimonialGrid } from "@/ui/components/testimonials";

interface HomeTestimonialsSectionProps {
  testimonials: PublicTestimonial[];
  tone?: ContentSectionTone;
  locale?: Locale;
  labels: {
    badge: string;
    title: string;
    description: string;
    seeAll: string;
  };
}

export function HomeTestimonialsSection({
  testimonials,
  tone = "muted",
  locale = "fr",
  labels,
}: HomeTestimonialsSectionProps) {
  const hasTestimonials = testimonials.length > 0;

  return (
    <ContentSection tone={tone} labelledBy="vies-transformees">
      <SectionHeader
        titleId="vies-transformees"
        badge={labels.badge}
        title={labels.title}
        description={labels.description}
      />
      {hasTestimonials ? (
        <>
          <TestimonialGrid testimonials={testimonials} locale={locale} />
          <SeeAllLink href="/temoignages">{labels.seeAll}</SeeAllLink>
        </>
      ) : (
        <CallToTestify />
      )}
    </ContentSection>
  );
}
