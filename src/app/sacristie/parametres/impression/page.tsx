import { requirePageRole } from "@/lib/auth";
import { CONTENT_ROLES } from "@/lib/roles";
import { getChurchLogo, getPrintSettings } from "@/lib/siteSettings";
import { PrintSettingsForm } from "@/ui/modules/admin";

export const dynamic = "force-dynamic";

export default async function AdminSettingsImpressionPage() {
  await requirePageRole(CONTENT_ROLES);
  const [printSettings, logoSrc] = await Promise.all([
    getPrintSettings(),
    getChurchLogo(),
  ]);

  return <PrintSettingsForm values={printSettings} logoSrc={logoSrc} />;
}
