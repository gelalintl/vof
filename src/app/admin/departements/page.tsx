import { getDepartments } from "@/app/admin/actions";
import { AdminPageHeader, DepartmentManager } from "@/ui/modules/admin";

export const dynamic = "force-dynamic";

export default async function AdminDepartmentsPage() {
  const departments = await getDepartments().catch(() => []);

  return (
    <div>
      <AdminPageHeader
        kicker="Équipes"
        title="Départements"
        description="Créez et organisez les départements de l’église : responsable, contact, photo et ordre d’affichage sur le site public."
      />
      <div className="mt-8">
        <DepartmentManager departments={departments} />
      </div>
    </div>
  );
}
