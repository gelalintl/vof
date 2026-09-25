import { getArticles } from "@/app/admin/actions";
import { AdminPageHeader, ArticleCreatePanel, ArticleManager } from "@/ui/modules/admin";

export const dynamic = "force-dynamic";

export default async function AdminTeachingsPage() {
  const articles = await getArticles().catch(() => []);

  return (
    <div>
      <AdminPageHeader
        kicker="Contenu"
        title="Enseignements"
        description="Articles et enseignements : lecture intégrale, édition et publication."
      />
      <div className="mt-8">
        <ArticleCreatePanel />
      </div>
      <div className="mt-10">
        <ArticleManager articles={articles} />
      </div>
    </div>
  );
}
