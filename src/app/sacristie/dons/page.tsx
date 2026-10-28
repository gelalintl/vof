import { getDonationsList, getProjects } from "@/app/sacristie/actions";
import { requirePageRole } from "@/lib/auth";
import { ACCOUNTING_ROLES } from "@/lib/roles";
import { AdminPageHeader, DonationManager } from "@/ui/modules/admin";

export const dynamic = "force-dynamic";

export default async function AdminDonationsPage() {
  await requirePageRole(ACCOUNTING_ROLES);
  const [donations, projects] = await Promise.all([
    getDonationsList().catch(() => []),
    getProjects().catch(() => []),
  ]);

  return (
    <div>
      <AdminPageHeader
        kicker="Soutien"
        title="Suivi des dons"
        description="Promesses reçues depuis le site. Confirmez la réception pour incrémenter la jauge du projet rattaché."
      />
      <div className="mt-8">
        <DonationManager donations={donations} projects={projects} />
      </div>
    </div>
  );
}
