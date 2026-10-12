import type { Metadata } from "next";
import { ContentSection, PageHero } from "@/ui/components/layout";
import { TestimonialForm } from "@/ui/components/testimonials";
import { MainLayout } from "@/ui/layouts/MainLayout";

export const metadata: Metadata = {
  title: "Partager mon témoignage",
  description:
    "Partagez ce que Dieu a fait dans votre vie pour édifier la famille Voice Of Freedom.",
};

export default function ShareTestimonialPage() {
  return (
    <MainLayout>
      <PageHero
        badge="Témoignage"
        title="Partagez ce que Dieu a fait"
        description="Votre histoire peut redonner espoir et fortifier la foi de toute l'église. Écrivez-nous quelques lignes : notre équipe les lira avec joie."
      />
      <ContentSection width="narrow" labelledBy="formulaire-temoignage">
        <h2 id="formulaire-temoignage" className="sr-only">
          Formulaire de témoignage
        </h2>
        <TestimonialForm />
      </ContentSection>
    </MainLayout>
  );
}
