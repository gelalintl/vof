import type { ContentSectionTone, ProjectStatus, PublicProject } from "@/types";
import { ContentSection, SectionHeader, SeeAllLink } from "@/ui/components/layout";
import { ProjectGrid } from "./ProjectCard";

interface FeaturedProjectsSectionProps {
  projects: PublicProject[];
  tone?: ContentSectionTone;
  labels: {
    badge: string;
    title: string;
    description: string;
    seeAll: string;
  };
  statusLabels: Record<ProjectStatus, string>;
}

export function FeaturedProjectsSection({
  projects,
  tone = "muted",
  labels,
  statusLabels,
}: FeaturedProjectsSectionProps) {
  if (projects.length === 0) {
    return null;
  }

  return (
    <ContentSection tone={tone} labelledBy="projets-eglise">
      <SectionHeader
        badge={labels.badge}
        title={labels.title}
        titleId="projets-eglise"
        description={labels.description}
      />
      <ProjectGrid projects={projects} statusLabels={statusLabels} />
      <SeeAllLink href="/projets">{labels.seeAll}</SeeAllLink>
    </ContentSection>
  );
}
