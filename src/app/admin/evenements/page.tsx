import { getEvents } from "@/app/admin/actions";
import { AdminPageHeader, EventCreatePanel, EventManager } from "@/ui/modules/admin";

export const dynamic = "force-dynamic";

export default async function AdminEventsPage() {
  const events = await getEvents().catch(() => []);

  return (
    <div>
      <AdminPageHeader
        kicker="Agenda"
        title="Événements"
        description="Consultez, créez et mettez à jour les rendez-vous de l’église."
      />
      <div className="mt-8">
        <EventCreatePanel />
      </div>
      <div className="mt-10">
        <EventManager events={events} />
      </div>
    </div>
  );
}
