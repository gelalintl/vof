import { getUsers } from "@/app/admin/utilisateurs/actions";
import { requireAdmin } from "@/lib/auth";
import { AdminPageHeader, UserManager } from "@/ui/modules/admin";

export const dynamic = "force-dynamic";

export default async function AdminUsersPage() {
  const [currentUser, users] = await Promise.all([requireAdmin(), getUsers()]);
  const isSuperAdmin = currentUser.role === "SUPERADMIN";

  return (
    <div>
      <AdminPageHeader
        kicker="Sécurité"
        title={isSuperAdmin ? "Administrateurs" : "Mon compte"}
        description={
          isSuperAdmin
            ? "Gérez les comptes qui ont accès au back-office : ajout, modification, mot de passe et suppression sécurisée."
            : "Modifiez votre nom, votre adresse e-mail de connexion et votre mot de passe."
        }
      />
      <div className="mt-8">
        <UserManager users={users} currentRole={currentUser.role} />
      </div>
    </div>
  );
}
