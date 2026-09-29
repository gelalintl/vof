import { getMedia } from "@/app/admin/actions";
import { MediaManager } from "@/ui/modules/admin";

export const dynamic = "force-dynamic";

export default async function AdminMediaPage() {
  const media = await getMedia().catch(() => []);

  return <MediaManager media={media} />;
}
