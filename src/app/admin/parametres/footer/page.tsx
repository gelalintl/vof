import { getFooterSettings } from "@/lib/siteSettings";
import { FooterSettingsForm } from "@/ui/modules/admin";

export const dynamic = "force-dynamic";

export default async function AdminSettingsFooterPage() {
  const values = await getFooterSettings();

  return <FooterSettingsForm values={values} />;
}
