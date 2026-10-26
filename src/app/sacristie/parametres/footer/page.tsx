import { getFooterSettings } from "@/lib/siteSettings";
import { getSiteSettings } from "@/lib/settings";
import { FooterSettingsForm } from "@/ui/modules/admin";

export const dynamic = "force-dynamic";

export default async function AdminSettingsFooterPage() {
  const [values, catalog] = await Promise.all([
    getFooterSettings(),
    getSiteSettings(),
  ]);

  return <FooterSettingsForm values={values} catalog={catalog} />;
}
