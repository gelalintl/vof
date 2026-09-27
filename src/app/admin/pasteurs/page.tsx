import { getPastors } from "@/app/admin/actions";
import { AdminPageHeader, PastorCreatePanel, PastorManager } from "@/ui/modules/admin";

export const dynamic = "force-dynamic";

export default async function AdminPastorsPage() {
  const pastors = await getPastors().catch(() => []);

  return (
    <div>
      <AdminPageHeader
        kicker="Équipe"
        title="Équipe pastorale"
        description="Présentez les pasteurs et dirigeants : photo, titre, parcours et ordre d’affichage."
      />
      <div className="mt-8">
        <PastorCreatePanel />
      </div>
      <div className="mt-10">
        <PastorManager pastors={pastors} />
      </div>
    </div>
  );
}
