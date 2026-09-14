import type { Metadata } from "next";
import { departments } from "@/datas/departments";
import { departmentsHero } from "@/datas/pageCopy";
import { ContentSection } from "@/ui/components/ContentSection";
import { PageHero } from "@/ui/components/PageHero";
import { MainLayout } from "@/ui/layouts/MainLayout";
import { DepartmentAccordion } from "@/ui/modules/departements/DepartmentAccordion";

export const metadata: Metadata = {
  title: "Départements",
  description:
    "Servez à Voice Of Freedom : louange, jeunesse, accueil, média, compassion et plus encore.",
};

export default function DepartmentsPage() {
  return (
    <MainLayout>
      <PageHero {...departmentsHero} />
      <ContentSection width="prose" padding="compact" labelledBy="liste-departements">
        <DepartmentAccordion departments={departments} />
      </ContentSection>
    </MainLayout>
  );
}
