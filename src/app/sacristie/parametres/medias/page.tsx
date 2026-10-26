import { homeHeroDraftFromSettings } from "@/lib/homeContent";
import { getSiteSettings, identityFromSettings } from "@/lib/settings";
import { HeroVisualEditor } from "@/ui/modules/admin";

export const dynamic = "force-dynamic";

export default async function AdminSettingsMediasPage() {
  const settings = await getSiteSettings();
  const identity = identityFromSettings(settings);

  return (
    <HeroVisualEditor
      values={homeHeroDraftFromSettings(identity, settings)}
      catalog={settings}
      fallbackTime={identity.sundayTime}
    />
  );
}
