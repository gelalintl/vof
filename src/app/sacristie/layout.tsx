import type { Metadata } from "next";
import { getCurrentUser } from "@/lib/auth";
import { getChurchLogo } from "@/lib/siteSettings";
import { AdminShell } from "@/ui/modules/admin";

export const metadata: Metadata = {
  title: "Administration",
  description: "Tableau de bord de l'Église Voice Of Freedom.",
};

export const dynamic = "force-dynamic";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getCurrentUser();

  if (!user) {
    return children;
  }

  const logoSrc = await getChurchLogo();
  return (
    <AdminShell logoSrc={logoSrc} userEmail={user.email}>
      {children}
    </AdminShell>
  );
}
