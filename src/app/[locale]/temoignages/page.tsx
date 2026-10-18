import type { Metadata } from "next";
import { testimonialsHero } from "@/datas/pageCopy";
import { getPublishedTestimonials } from "@/lib/publicContent";
import { ContentSection, PageHero } from "@/ui/components/layout";
import { CallToTestify, TestimonialGrid } from "@/ui/components/testimonials";
import { MainLayout } from "@/ui/layouts/MainLayout";

export const metadata: Metadata = {
  title: "Témoignages",
  description:
    "Vies transformées : les témoignages de la famille Voice Of Freedom pour édifier l'église.",
};

export default async function TestimonialsPage() {
  const testimonials = await getPublishedTestimonials();

  return (
    <MainLayout>
      <PageHero {...testimonialsHero} />
      {testimonials.length > 0 ? (
        <ContentSection labelledBy="liste-temoignages">
          <h2 id="liste-temoignages" className="sr-only">
            Liste des témoignages
          </h2>
          <TestimonialGrid testimonials={testimonials} />
          <CallToTestify />
        </ContentSection>
      ) : (
        <ContentSection width="prose" padding="default" labelledBy="temoignages-vide">
          <h2 id="temoignages-vide" className="sr-only">
            Aucun témoignage pour le moment
          </h2>
          <CallToTestify className="py-12" />
        </ContentSection>
      )}
    </MainLayout>
  );
}
