import { requirePageRole } from "@/lib/auth";
import { homeHeroDraftFromSettings } from "@/lib/homeContent";
import { CONTENT_ROLES } from "@/lib/roles";
import { getSiteSettings, identityFromSettings } from "@/lib/settings";
import { HeroVisualEditor } from "@/ui/modules/admin";

export const dynamic = "force-dynamic";

export default async function AdminSettingsMediasPage() {
  await requirePageRole(CONTENT_ROLES);
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
