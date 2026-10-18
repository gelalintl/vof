import type { Metadata } from "next";
import { isLocale } from "@/i18n/config";
import { getDictionary } from "@/i18n/getDictionary";
import { staticPageMetadata } from "@/i18n/metadata";
import { getPublicProjects } from "@/lib/publicContent";
import { ContentSection, PageHero } from "@/ui/components/layout";
import { MainLayout } from "@/ui/layouts/MainLayout";
import { ProjectGrid } from "@/ui/modules/projets";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  return staticPageMetadata(locale, "projects");
}

export default async function ProjectsPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale: localeParam } = await params;
  const locale = isLocale(localeParam) ? localeParam : "fr";
  const { common, projects: projectCopy } = getDictionary(locale);
  const projects = await getPublicProjects();
  const visible = projects.filter((project) => project.status === "IN_PROGRESS");

  return (
    <MainLayout>
      <PageHero
        badge={projectCopy.badge}
        title={projectCopy.title}
        description={projectCopy.description}
        glow="amber"
      />
      <ContentSection padding="compact" labelledBy="liste-projets">
        <h2 id="liste-projets" className="sr-only">
          {projectCopy.listLabel}
        </h2>
        {visible.length > 0 ? (
          <ProjectGrid
            projects={visible}
            statusLabels={{
              IN_PROGRESS: common.inProgress,
              COMPLETED: common.completed,
              PLANNED: common.planned,
            }}
          />
        ) : (
          <p className="font-sans text-sm text-slate-600">{projectCopy.empty}</p>
        )}
      </ContentSection>
    </MainLayout>
  );
}
