import Link from "next/link";
import type { ProjectStatus, PublicProject } from "@/types";
import { projectStatusLabels } from "@/lib/donations";
import { Typography } from "@/ui/design-system/typography";
import { cn } from "@/utils/cn";
import { interactiveCardClass } from "@/utils/theme/interactiveCard";
import { ProjectProgress } from "./ProjectProgress";

const PLACEHOLDER_SRC = "/assets/pastors/placeholder.svg";

interface ProjectCardProps {
  project: PublicProject;
  /** `wide` : image à gauche, texte à droite (projet unique). */
  layout?: "stacked" | "wide";
  statusLabel?: string;
}

export function ProjectCard({
  project,
  layout = "stacked",
  statusLabel,
}: ProjectCardProps) {
  const isWide = layout === "wide";

  return (
    <article
      className={cn(
        interactiveCardClass,
        "relative flex h-full flex-col overflow-hidden bg-white",
        isWide && "md:grid md:grid-cols-2",
      )}
    >
      <div
        className={cn(
          "relative bg-slate-50",
          isWide ? "aspect-[16/10] md:aspect-auto md:min-h-full" : "aspect-[16/10]",
        )}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={project.image || PLACEHOLDER_SRC}
          alt=""
          className={cn("size-full object-cover", isWide && "md:absolute md:inset-0")}
        />
        {project.category ? (
          <span className="absolute left-3 top-3 rounded-full bg-[#f59e0b] px-2.5 py-1 font-heading text-[10px] font-bold uppercase tracking-widest text-slate-900">
            {project.category}
          </span>
        ) : null}
      </div>
      <div className={cn("flex flex-1 flex-col p-5", isWide && "justify-center md:p-8")}>
        <p className="font-heading text-[11px] font-bold uppercase tracking-[0.16em] text-[#0284c7]">
          {statusLabel ?? projectStatusLabels[project.status]}
        </p>
        <Typography variant="h3" className="mt-2 text-slate-900">
          {/* Lien étiré : toute la carte est cliquable. */}
          <Link
            href={`/don?projet=${project.slug}`}
            className="after:absolute after:inset-0 after:content-[''] hover:text-violet-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-700"
          >
            {project.title}
          </Link>
        </Typography>
        <p
          className={cn(
            "mt-2 font-sans text-sm leading-relaxed text-slate-600",
            isWide ? "line-clamp-5" : "line-clamp-3",
          )}
        >
          {project.description}
        </p>
        <div className="mt-4">
          <ProjectProgress
            currentAmount={project.currentAmount}
            targetAmount={project.targetAmount}
            progress={project.progress}
          />
        </div>
      </div>
    </article>
  );
}

/** Grille adaptée au nombre de projets : 1 = carte large centrée, 2 = deux colonnes, 3+ = trois colonnes. */
export function ProjectGrid({
  projects,
  statusLabels,
}: {
  projects: PublicProject[];
  statusLabels?: Partial<Record<ProjectStatus, string>>;
}) {
  if (projects.length === 1) {
    return (
      <div className="mx-auto w-full max-w-4xl">
        <ProjectCard
          project={projects[0]}
          layout="wide"
          statusLabel={statusLabels?.[projects[0].status]}
        />
      </div>
    );
  }

  return (
    <div
      className={cn(
        "grid gap-6 sm:grid-cols-2",
        projects.length === 2 ? "mx-auto w-full max-w-4xl" : "lg:grid-cols-3",
      )}
    >
      {projects.map((project) => (
        <ProjectCard
          key={project.id}
          project={project}
          statusLabel={statusLabels?.[project.status]}
        />
      ))}
    </div>
  );
}
