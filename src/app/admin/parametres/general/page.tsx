import { getChurchLogo, getManagedSettings } from "@/lib/siteSettings";
import {
  ChurchIdentityForm,
  LogoUploadCard,
  WelcomeMessageForm,
} from "@/ui/modules/admin";

export const dynamic = "force-dynamic";

export default async function AdminSettingsGeneralPage() {
  const [logoSrc, managed] = await Promise.all([
    getChurchLogo(),
    getManagedSettings(),
  ]);

  return (
    <div className="space-y-8">
      <LogoUploadCard logoSrc={logoSrc} />
      <ChurchIdentityForm values={managed} />
      <WelcomeMessageForm values={managed} />
    </div>
  );
}
