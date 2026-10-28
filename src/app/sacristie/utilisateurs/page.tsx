import { getUsers } from "@/app/sacristie/utilisateurs/actions";
import { requirePageRole } from "@/lib/auth";
import { ACCOUNT_ROLES } from "@/lib/roles";
import { AdminPageHeader, UserManager } from "@/ui/modules/admin";

export const dynamic = "force-dynamic";

export default async function AdminUsersPage() {
  const currentUser = await requirePageRole(ACCOUNT_ROLES);
  const users = await getUsers();
  const canManageUsers = currentUser.role === "SUPERADMIN" || currentUser.role === "ADMIN";

  return (
    <div>
      <AdminPageHeader
        kicker="Sécurité"
        title={canManageUsers ? "Administrateurs" : "Mon compte"}
        description={
          canManageUsers
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
