import { AdminPageHeader, SettingsTabs } from "@/ui/modules/admin";

export default function AdminSettingsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div>
      <AdminPageHeader
        kicker="Configuration"
        title="Paramètres"
        description="Identité, médias, pied de page, paiements et documents d’impression — un onglet par thème."
      />
      <SettingsTabs />
      <div className="mt-8">{children}</div>
    </div>
  );
}
