import { getSettings } from "@/app/admin/actions";
import { getChurchLogo, getManagedSettings, getPaymentSettings } from "@/lib/siteSettings";
import {
  AdminPageHeader,
  LocationSettingsForm,
  LogoUploadCard,
  PaymentSettingsForm,
  SettingCreatePanel,
  SettingsManager,
  SocialSettingsForm,
} from "@/ui/modules/admin";

export const dynamic = "force-dynamic";

export default async function AdminSettingsPage() {
  const [settings, logoSrc, managed, payments] = await Promise.all([
    getSettings().catch(() => []),
    getChurchLogo(),
    getManagedSettings(),
    getPaymentSettings(),
  ]);

  return (
    <div>
      <AdminPageHeader
        kicker="Configuration"
        title="Paramètres"
        description="Identité visuelle, réseaux sociaux, adresse publique, paiements et clés SiteSettings."
      />
      <div className="mt-8">
        <LogoUploadCard logoSrc={logoSrc} />
      </div>
      <div className="mt-8">
        <SocialSettingsForm values={managed} />
      </div>
      <div className="mt-8">
        <LocationSettingsForm values={managed} />
      </div>
      <div className="mt-8">
        <PaymentSettingsForm values={payments} />
      </div>
      <div className="mt-8">
        <SettingCreatePanel />
      </div>
      <div className="mt-10">
        <SettingsManager settings={settings} />
      </div>
    </div>
  );
}
