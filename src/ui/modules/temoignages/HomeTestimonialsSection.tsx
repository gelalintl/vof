import type { ContentSectionTone, PublicTestimonial } from "@/types";
import { ContentSection, SectionHeader, SeeAllLink } from "@/ui/components/layout";
import { CallToTestify, TestimonialGrid } from "@/ui/components/testimonials";

interface HomeTestimonialsSectionProps {
  testimonials: PublicTestimonial[];
  tone?: ContentSectionTone;
}

export function HomeTestimonialsSection({
  testimonials,
  tone = "muted",
}: HomeTestimonialsSectionProps) {
  const hasTestimonials = testimonials.length > 0;

  return (
    <ContentSection tone={tone} labelledBy="vies-transformees">
      <SectionHeader
        titleId="vies-transformees"
        badge="Témoignages"
        title="Vies transformées"
        description="Ce que Dieu fait dans la vie des membres de la famille Voice Of Freedom."
      />
      {hasTestimonials ? (
        <>
          <TestimonialGrid testimonials={testimonials} />
          <SeeAllLink href="/temoignages">Lire tous les témoignages</SeeAllLink>
        </>
      ) : (
        <CallToTestify />
      )}
    </ContentSection>
  );
}
