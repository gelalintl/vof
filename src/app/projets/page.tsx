import type { Metadata } from "next";
import { projectsHero } from "@/datas/pageCopy";
import { getPublicProjects } from "@/lib/publicContent";
import { ContentSection, PageHero } from "@/ui/components/layout";
import { MainLayout } from "@/ui/layouts/MainLayout";
import { ProjectGrid } from "@/ui/modules/projets";

export const metadata: Metadata = {
  title: "Projets",
  description:
    "Soutenez les projets de l’Église Voice Of Freedom : construction, médias, social et évangélisation.",
};

export default async function ProjectsPage() {
  const projects = await getPublicProjects();
  const visible = projects.filter((project) => project.status === "IN_PROGRESS");

  return (
    <MainLayout>
      <PageHero {...projectsHero} />
      <ContentSection padding="compact" labelledBy="liste-projets">
        <h2 id="liste-projets" className="sr-only">
          Liste des projets
        </h2>
        {visible.length > 0 ? (
          <ProjectGrid projects={visible} />
        ) : (
          <p className="font-sans text-sm text-slate-600">
            Les projets de l’église apparaîtront ici dès qu’ils seront publiés depuis
            l’administration.
          </p>
        )}
      </ContentSection>
    </MainLayout>
  );
}
