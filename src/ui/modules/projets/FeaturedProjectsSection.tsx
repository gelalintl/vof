import Link from "next/link";
import type { PublicProject } from "@/types";
import { SectionHeader } from "@/ui/components/layout";
import { ProjectGrid } from "./ProjectCard";

interface FeaturedProjectsSectionProps {
  projects: PublicProject[];
}

export function FeaturedProjectsSection({ projects }: FeaturedProjectsSectionProps) {
  if (projects.length === 0) {
    return null;
  }

  return (
    <section className="bg-slate-50" aria-labelledby="projets-eglise">
      <div className="mx-auto max-w-6xl px-4 py-14 sm:px-6">
        <SectionHeader
          badge="Projets"
          title="Les projets de l’église"
          titleId="projets-eglise"
          description="Soutenez une œuvre précise : chaque promesse de don fait avancer la jauge en FCFA."
        />
        <div className="mt-8">
          <ProjectGrid projects={projects} />
        </div>
        <p className="mt-8 text-center">
          <Link
            href="/projets"
            className="font-heading text-sm font-bold text-[#6d28d9] hover:text-violet-800"
          >
            Voir tous les projets
          </Link>
        </p>
      </div>
    </section>
  );
}
