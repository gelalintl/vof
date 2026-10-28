import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth";

export const dynamic = "force-dynamic";

export default async function AdminSettingsIndexPage() {
  const user = await getCurrentUser();
  if (!user) {
    redirect("/sacristie/login");
  }
  if (user.role === "COMPTABLE") {
    redirect("/sacristie/parametres/paiements");
  }
  redirect("/sacristie/parametres/general");
}
