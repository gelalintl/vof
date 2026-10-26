import { getTestimonials } from "@/app/sacristie/temoignages/actions";
import { AdminPageHeader, TestimonialManager } from "@/ui/modules/admin";

export const dynamic = "force-dynamic";

// Rappel : exécutez `npx prisma db push` si la table Testimonial n'existe pas encore.
export default async function AdminTestimonialsPage() {
  const testimonials = await getTestimonials().catch(() => []);

  return (
    <div>
      <AdminPageHeader
        kicker="Communauté"
        title="Témoignages"
        description="Modérez les témoignages reçus : publiez, masquez ou modifiez les récits affichés sur l’accueil et la page Témoignages."
      />
      <div className="mt-8">
        <TestimonialManager testimonials={testimonials} />
      </div>
    </div>
  );
}
