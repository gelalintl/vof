import { getAboutSettings } from "@/lib/siteSettings";
import { getSiteSettings } from "@/lib/settings";
import { AboutSettingsForm } from "@/ui/modules/admin";

export const dynamic = "force-dynamic";

export default async function AdminSettingsAboutPage() {
  const [values, catalog] = await Promise.all([
    getAboutSettings(),
    getSiteSettings(),
  ]);

  return <AboutSettingsForm values={values} catalog={catalog} />;
}
