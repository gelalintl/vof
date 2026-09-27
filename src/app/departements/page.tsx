import type { Metadata } from "next";
import { departmentsHero } from "@/datas/pageCopy";
import { getPublicDepartments } from "@/lib/publicContent";
import { ContentSection, PageHero } from "@/ui/components/layout";
import { MainLayout } from "@/ui/layouts/MainLayout";
import { DepartmentAccordion } from "@/ui/modules/departements";

export const metadata: Metadata = {
  title: "Départements",
  description:
    "Servez à Voice Of Freedom : louange, jeunesse, accueil, média, compassion et plus encore.",
};

export default async function DepartmentsPage() {
  const departments = await getPublicDepartments();

  return (
    <MainLayout>
      <PageHero {...departmentsHero} />
      <ContentSection width="prose" padding="compact" labelledBy="liste-departements">
        {departments.length > 0 ? (
          <DepartmentAccordion departments={departments} />
        ) : (
          <p className="font-sans text-sm text-slate-600">
            Les départements apparaîtront ici dès qu&apos;ils seront publiés depuis
            l&apos;administration.
          </p>
        )}
      </ContentSection>
    </MainLayout>
  );
}
