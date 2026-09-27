import Link from "next/link";
import { Plus } from "lucide-react";
import { getEvents } from "@/app/admin/actions";
import { AdminPageHeader, EventManager } from "@/ui/modules/admin";
import { adminPrimaryButtonClass } from "@/ui/modules/admin/adminStyles";

export const dynamic = "force-dynamic";

export default async function AdminEventsPage() {
  const events = await getEvents().catch(() => []);

  return (
    <div>
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <AdminPageHeader
          kicker="Agenda"
          title="Événements"
          description="Liste des rendez-vous ponctuels et des récurrences mensuelles de l’église."
        />
        <Link href="/admin/evenements/nouveau" className={adminPrimaryButtonClass}>
          <Plus className="size-4" aria-hidden />
          Ajouter un événement
        </Link>
      </div>
      <div className="mt-8">
        <EventManager events={events} />
      </div>
    </div>
  );
}
