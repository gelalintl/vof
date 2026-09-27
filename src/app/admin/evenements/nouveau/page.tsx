import Link from "next/link";
import { AdminPageHeader, EventEditor } from "@/ui/modules/admin";
import { AdminPanel } from "@/ui/modules/admin/AdminPageHeader";

export const dynamic = "force-dynamic";

export default function AdminNewEventPage() {
  return (
    <div>
      <Link
        href="/admin/evenements"
        className="font-heading text-xs font-bold uppercase tracking-[0.16em] text-[#6d28d9] hover:text-violet-800"
      >
        ← Retour aux événements
      </Link>
      <div className="mt-4">
        <AdminPageHeader
          kicker="Agenda"
          title="Ajouter un événement"
          description="Renseignez les informations générales, puis choisissez une date ponctuelle ou une règle de récurrence."
        />
      </div>
      <div className="mt-8">
        <AdminPanel>
          <EventEditor />
        </AdminPanel>
      </div>
    </div>
  );
}
