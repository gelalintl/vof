import { getArticles, getComments } from "@/app/admin/actions";
import { AdminPageHeader, TeachingsAdminTabs } from "@/ui/modules/admin";

export const dynamic = "force-dynamic";

export default async function AdminTeachingsPage() {
  const [articles, comments] = await Promise.all([
    getArticles().catch(() => []),
    getComments().catch(() => []),
  ]);

  return (
    <div>
      <AdminPageHeader
        kicker="Contenu"
        title="Enseignements"
        description="Articles, galeries photos et modération des commentaires."
      />
      <div className="mt-8">
        <TeachingsAdminTabs articles={articles} comments={comments} />
      </div>
    </div>
  );
}
