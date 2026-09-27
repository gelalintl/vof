import Link from "next/link";
import type { PublicProject } from "@/types";
import { projectStatusLabels } from "@/lib/donations";
import { Button } from "@/ui/design-system/button";
import { Typography } from "@/ui/design-system/typography";
import { cn } from "@/utils/cn";
import { interactiveCardClass } from "@/utils/theme/interactiveCard";
import { ProjectProgress } from "./ProjectProgress";

const PLACEHOLDER_SRC = "/assets/pastors/placeholder.svg";

interface ProjectCardProps {
  project: PublicProject;
}

export function ProjectCard({ project }: ProjectCardProps) {
  return (
    <article
      className={cn(interactiveCardClass, "flex h-full flex-col overflow-hidden bg-white")}
    >
      <div className="relative aspect-[16/10] bg-slate-50">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={project.image || PLACEHOLDER_SRC}
          alt=""
          className="size-full object-cover"
        />
        {project.category ? (
          <span className="absolute left-3 top-3 rounded-full bg-[#f59e0b] px-2.5 py-1 font-heading text-[10px] font-bold uppercase tracking-widest text-slate-900">
            {project.category}
          </span>
        ) : null}
      </div>
      <div className="flex flex-1 flex-col p-5">
        <p className="font-heading text-[11px] font-bold uppercase tracking-[0.16em] text-[#0284c7]">
          {projectStatusLabels[project.status]}
        </p>
        <Typography variant="h3" className="mt-2 text-slate-900">
          {project.title}
        </Typography>
        <p className="mt-2 line-clamp-3 font-sans text-sm leading-relaxed text-slate-600">
          {project.description}
        </p>
        <div className="mt-4">
          <ProjectProgress
            currentAmount={project.currentAmount}
            targetAmount={project.targetAmount}
            progress={project.progress}
          />
        </div>
        <div className="mt-5">
          <Button href={`/don?projet=${project.slug}`} variant="accent" className="w-full">
            Soutenir ce projet
          </Button>
        </div>
      </div>
    </article>
  );
}

export function ProjectGrid({ projects }: { projects: PublicProject[] }) {
  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {projects.map((project) => (
        <ProjectCard key={project.id} project={project} />
      ))}
    </div>
  );
}
