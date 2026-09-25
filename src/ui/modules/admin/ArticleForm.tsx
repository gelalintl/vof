import type { AdminArticleRecord } from "@/types";
import { AdminLabel } from "./AdminPageHeader";
import { adminFieldClass, adminFileClass, adminPrimaryButtonClass } from "./adminStyles";

interface ArticleFormProps {
  action: (formData: FormData) => void | Promise<void>;
  article?: AdminArticleRecord;
  submitLabel: string;
}

export function ArticleForm({ action, article, submitLabel }: ArticleFormProps) {
  return (
    <form action={action} className="grid gap-4 sm:grid-cols-2">
      {article ? <input type="hidden" name="id" value={article.id} /> : null}

      <label className="block sm:col-span-2">
        <AdminLabel>Titre</AdminLabel>
        <input name="title" required defaultValue={article?.title} className={adminFieldClass} />
      </label>

      <label className="block">
        <AdminLabel>Slug</AdminLabel>
        <input name="slug" required defaultValue={article?.slug} className={adminFieldClass} />
      </label>

      <label className="block">
        <AdminLabel>Auteur</AdminLabel>
        <input name="author" required defaultValue={article?.author} className={adminFieldClass} />
      </label>

      <label className="block sm:col-span-2">
        <AdminLabel>Contenu</AdminLabel>
        <textarea
          name="content"
          required
          rows={6}
          defaultValue={article?.content}
          className={adminFieldClass}
        />
      </label>

      <label className="block sm:col-span-2">
        <AdminLabel>Image de couverture</AdminLabel>
        <input name="coverFile" type="file" accept="image/*" className={adminFileClass} />
        <input type="hidden" name="coverImage" defaultValue={article?.coverImage ?? ""} />
      </label>

      <label className="flex items-center gap-2 sm:col-span-2">
        <input
          name="isPublished"
          type="checkbox"
          defaultChecked={article?.isPublished}
          className="size-4 accent-burgundy"
        />
        <span className="font-sans text-sm">Publier</span>
      </label>

      <div className="sm:col-span-2">
        <button type="submit" className={adminPrimaryButtonClass}>
          {submitLabel}
        </button>
      </div>
    </form>
  );
}
