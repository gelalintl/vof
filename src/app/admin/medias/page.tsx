import { getMedia } from "@/app/admin/actions";
import { AdminPageHeader, MediaCreatePanel, MediaManager } from "@/ui/modules/admin";

export const dynamic = "force-dynamic";

export default async function AdminMediaPage() {
  const media = await getMedia().catch(() => []);

  return (
    <div>
      <AdminPageHeader
        kicker="Médiathèque"
        title="Médias"
        description="Galerie locale : aperçu, édition et suppression de chaque visuel."
      />
      <div className="mt-8">
        <MediaCreatePanel />
      </div>
      <div className="mt-10">
        <MediaManager media={media} />
      </div>
    </div>
  );
}
