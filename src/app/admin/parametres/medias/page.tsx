import { getManagedSettings } from "@/lib/siteSettings";
import { FeaturedYoutubeForm } from "@/ui/modules/admin";

export const dynamic = "force-dynamic";

export default async function AdminSettingsMediasPage() {
  const managed = await getManagedSettings();

  return <FeaturedYoutubeForm values={managed} />;
}
