import { homeHeroDraftFromSettings } from "@/lib/homeContent";
import { contactFromSettings, getSiteSettings, identityFromSettings } from "@/lib/settings";
import { HeroVisualEditor } from "@/ui/modules/admin";

export const dynamic = "force-dynamic";

export default async function AdminSettingsMediasPage() {
  const settings = await getSiteSettings();
  const identity = identityFromSettings(settings);
  const contact = contactFromSettings(settings);

  return (
    <HeroVisualEditor
      values={homeHeroDraftFromSettings(identity, contact, settings)}
      fallbackTime={identity.sundayTime}
    />
  );
}
