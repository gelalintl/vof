import { getChurchLogo, getManagedSettings } from "@/lib/siteSettings";
import { getSiteSettings } from "@/lib/settings";
import {
  ChurchIdentityForm,
  LogoUploadCard,
  WelcomeMessageForm,
} from "@/ui/modules/admin";

export const dynamic = "force-dynamic";

export default async function AdminSettingsGeneralPage() {
  const [logoSrc, managed, catalog] = await Promise.all([
    getChurchLogo(),
    getManagedSettings(),
    getSiteSettings(),
  ]);

  return (
    <div className="space-y-8">
      <LogoUploadCard logoSrc={logoSrc} />
      <ChurchIdentityForm values={managed} catalog={catalog} />
      <WelcomeMessageForm values={managed} catalog={catalog} />
    </div>
  );
}
