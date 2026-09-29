import Link from "next/link";
import { UserPlus } from "lucide-react";
import { getPastors } from "@/app/admin/actions";
import { AdminPageHeader, PastorManager } from "@/ui/modules/admin";
import { adminPrimaryButtonClass } from "@/ui/modules/admin/adminStyles";

export const dynamic = "force-dynamic";

export default async function AdminPastorsPage() {
  const pastors = await getPastors().catch(() => []);

  return (
    <div>
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <AdminPageHeader
          kicker="Équipe"
          title="Équipe Pastorale"
          description="Photo, rôle, citation et ordre d’affichage des pasteurs et dirigeants sur le site."
        />
        <Link href="/admin/pasteurs/nouveau" className={adminPrimaryButtonClass}>
          <UserPlus className="size-4" aria-hidden />
          Ajouter un membre
        </Link>
      </div>
      <div className="mt-8">
        <PastorManager pastors={pastors} />
      </div>
    </div>
  );
}
