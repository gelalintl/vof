import type { ContentSectionTone, PublicProject } from "@/types";
import { ContentSection, SectionHeader, SeeAllLink } from "@/ui/components/layout";
import { ProjectGrid } from "./ProjectCard";

interface FeaturedProjectsSectionProps {
  projects: PublicProject[];
  tone?: ContentSectionTone;
}

export function FeaturedProjectsSection({
  projects,
  tone = "muted",
}: FeaturedProjectsSectionProps) {
  if (projects.length === 0) {
    return null;
  }

  return (
    <ContentSection tone={tone} labelledBy="projets-eglise">
      <SectionHeader
        badge="Projets"
        title="Les projets de l’église"
        titleId="projets-eglise"
        description="Soutenez une œuvre précise : chaque promesse de don fait avancer la jauge en FCFA."
      />
      <ProjectGrid projects={projects} />
      <SeeAllLink href="/projets">Voir tous les projets</SeeAllLink>
    </ContentSection>
  );
}
