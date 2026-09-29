import Link from "next/link";
import { notFound } from "next/navigation";
import { getPastor } from "@/app/admin/actions";
import { AdminPageHeader, PastorEditor } from "@/ui/modules/admin";
import { AdminPanel } from "@/ui/modules/admin/AdminPageHeader";

export const dynamic = "force-dynamic";

interface EditPastorPageProps {
  params: Promise<{ id: string }>;
}

export default async function AdminEditPastorPage({ params }: EditPastorPageProps) {
  const { id } = await params;
  const pastor = await getPastor(id).catch(() => null);

  if (!pastor) {
    notFound();
  }

  return (
    <div>
      <Link
        href="/admin/pasteurs"
        className="font-heading text-xs font-bold uppercase tracking-[0.16em] text-[#6d28d9] hover:text-violet-800"
      >
        ← Retour à l’équipe
      </Link>
      <div className="mt-4">
        <AdminPageHeader kicker="Équipe" title="Éditer le membre" description={pastor.name} />
      </div>
      <div className="mt-8">
        <AdminPanel>
          <PastorEditor pastor={pastor} />
        </AdminPanel>
      </div>
    </div>
  );
}
