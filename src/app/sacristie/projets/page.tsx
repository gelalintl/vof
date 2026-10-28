import { getProjects } from "@/app/sacristie/actions";
import { requirePageRole } from "@/lib/auth";
import { ACCOUNTING_ROLES } from "@/lib/roles";
import { AdminPageHeader, ProjectManager } from "@/ui/modules/admin";

export const dynamic = "force-dynamic";

export default async function AdminProjectsPage() {
  await requirePageRole(ACCOUNTING_ROLES);
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
