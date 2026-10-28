import { requirePageRole } from "@/lib/auth";
import { CONTENT_ROLES } from "@/lib/roles";
import { getManagedSettings } from "@/lib/siteSettings";
import { getSiteSettings } from "@/lib/settings";
import {
  ContactLocationForm,
  SocialSettingsForm,
  WhatsAppSettingsForm,
} from "@/ui/modules/admin";

export const dynamic = "force-dynamic";

export default async function AdminSettingsContactsPage() {
  await requirePageRole(CONTENT_ROLES);
  const [managed, catalog] = await Promise.all([getManagedSettings(), getSiteSettings()]);

  return (
    <div className="space-y-8">
      <ContactLocationForm values={managed} catalog={catalog} />
      <WhatsAppSettingsForm values={managed} />
      <SocialSettingsForm values={managed} />
    </div>
  );
}
