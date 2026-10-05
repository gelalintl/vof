import { getAboutSettings } from "@/lib/siteSettings";
import { AboutSettingsForm } from "@/ui/modules/admin";

export const dynamic = "force-dynamic";

export default async function AdminSettingsAboutPage() {
  const values = await getAboutSettings();

  return <AboutSettingsForm values={values} />;
}
