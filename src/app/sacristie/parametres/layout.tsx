import { getCurrentUser } from "@/lib/auth";
import { AdminPageHeader, SettingsTabs } from "@/ui/modules/admin";

export default async function AdminSettingsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getCurrentUser();

  return (
    <div>
      <AdminPageHeader
        kicker="Configuration"
        title="Paramètres"
        description="Identité, page À propos, médias, pied de page, paiements et documents d’impression — un onglet par thème."
      />
      {user ? <SettingsTabs role={user.role} /> : null}
      <div className="mt-8">{children}</div>
    </div>
  );
}
