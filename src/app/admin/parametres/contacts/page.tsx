import { getManagedSettings } from "@/lib/siteSettings";
import {
  ContactLocationForm,
  SocialSettingsForm,
  WhatsAppSettingsForm,
} from "@/ui/modules/admin";

export const dynamic = "force-dynamic";

export default async function AdminSettingsContactsPage() {
  const managed = await getManagedSettings();

  return (
    <div className="space-y-8">
      <ContactLocationForm values={managed} />
      <WhatsAppSettingsForm values={managed} />
      <SocialSettingsForm values={managed} />
    </div>
  );
}
