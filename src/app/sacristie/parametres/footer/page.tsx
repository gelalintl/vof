import { requirePageRole } from "@/lib/auth";
import { CONTENT_ROLES } from "@/lib/roles";
import { getFooterSettings } from "@/lib/siteSettings";
import { getSiteSettings } from "@/lib/settings";
import { FooterSettingsForm } from "@/ui/modules/admin";

export const dynamic = "force-dynamic";

export default async function AdminSettingsFooterPage() {
  await requirePageRole(CONTENT_ROLES);
  const [values, catalog] = await Promise.all([
    getFooterSettings(),
    getSiteSettings(),
  ]);

  return <FooterSettingsForm values={values} catalog={catalog} />;
}
