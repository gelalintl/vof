import { requirePageRole } from "@/lib/auth";
import { ACCOUNTING_ROLES } from "@/lib/roles";
import { getPaymentSettings } from "@/lib/siteSettings";
import { PaymentSettingsForm } from "@/ui/modules/admin";

export const dynamic = "force-dynamic";

export default async function AdminSettingsPaiementsPage() {
  await requirePageRole(ACCOUNTING_ROLES);
  const payments = await getPaymentSettings();

  return <PaymentSettingsForm values={payments} />;
}
