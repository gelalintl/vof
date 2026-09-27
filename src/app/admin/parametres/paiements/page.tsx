import { getPaymentSettings } from "@/lib/siteSettings";
import { PaymentSettingsForm } from "@/ui/modules/admin";

export const dynamic = "force-dynamic";

export default async function AdminSettingsPaiementsPage() {
  const payments = await getPaymentSettings();

  return <PaymentSettingsForm values={payments} />;
}
