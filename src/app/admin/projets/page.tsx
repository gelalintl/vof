import { getProjects } from "@/app/admin/actions";
import { AdminPageHeader, ProjectManager } from "@/ui/modules/admin";

export const dynamic = "force-dynamic";

export default async function AdminProjectsPage() {
  const projects = await getProjects().catch(() => []);

  return (
    <div>
      <AdminPageHeader
        kicker="Soutien"
        title="Projets de l’église"
        description="Objectifs financiers en FCFA, jauge de collecte et mise en avant sur le site public."
      />
      <div className="mt-8">
        <ProjectManager projects={projects} />
      </div>
    </div>
  );
}
