import Link from "next/link";
import { AdminPageHeader, PastorEditor } from "@/ui/modules/admin";
import { AdminPanel } from "@/ui/modules/admin/AdminPageHeader";

export const dynamic = "force-dynamic";

export default function AdminNewPastorPage() {
  return (
    <div>
      <Link
        href="/admin/pasteurs"
        className="font-heading text-xs font-bold uppercase tracking-[0.16em] text-[#6d28d9] hover:text-violet-800"
      >
        ← Retour à l’équipe
      </Link>
      <div className="mt-4">
        <AdminPageHeader
          kicker="Équipe"
          title="Ajouter un membre"
          description="Nom, rôle, citation, bio et photo d’illustration."
        />
      </div>
      <div className="mt-8">
        <AdminPanel>
          <PastorEditor />
        </AdminPanel>
      </div>
    </div>
  );
}
