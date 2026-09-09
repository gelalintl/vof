import type { Metadata } from "next";
import { MainLayout } from "@/ui/layouts/MainLayout";
import { DepartmentAccordion } from "@/ui/modules/departements/DepartmentAccordion";
import { Badge } from "@/ui/design-system/badge";
import { Typography } from "@/ui/design-system/typography";

export const metadata: Metadata = {
  title: "Départements",
  description:
    "Servez à Voice Of Freedom : louange, jeunesse, accueil, média, compassion et plus encore.",
};

export default function DepartmentsPage() {
  return (
    <MainLayout>
      <section className="relative overflow-hidden bg-violet-700 text-white">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_#0284C7_0%,_transparent_46%)] opacity-40" />
        <div className="relative mx-auto max-w-6xl px-4 py-14 sm:px-6">
          <Badge variant="accent">Servir</Badge>
          <Typography variant="h1" className="mt-4 text-white">
            Les départements VOF
          </Typography>
          <Typography variant="lead" className="mt-4 max-w-2xl text-white/90">
            Une place pour chacun. Découvrez les équipes, les responsables, les
            horaires, puis envoyez votre demande pour rejoindre un département.
          </Typography>
        </div>
      </section>
      <DepartmentAccordion />
    </MainLayout>
  );
}
