import Link from "next/link";
import { notFound } from "next/navigation";
import { getEvent } from "@/app/admin/actions";
import { AdminPageHeader, EventEditor } from "@/ui/modules/admin";
import { AdminPanel } from "@/ui/modules/admin/AdminPageHeader";

export const dynamic = "force-dynamic";

interface EditEventPageProps {
  params: Promise<{ id: string }>;
}

export default async function AdminEditEventPage({ params }: EditEventPageProps) {
  const { id } = await params;
  const event = await getEvent(id).catch(() => null);

  if (!event) {
    notFound();
  }

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
          title="Éditer l’événement"
          description={event.title}
        />
      </div>
      <div className="mt-8">
        <AdminPanel>
          <EventEditor event={event} />
        </AdminPanel>
      </div>
    </div>
  );
}
