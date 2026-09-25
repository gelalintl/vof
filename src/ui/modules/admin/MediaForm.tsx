import type { AdminMediaRecord } from "@/types";
import { AdminLabel } from "./AdminPageHeader";
import { adminFieldClass, adminFileClass, adminPrimaryButtonClass } from "./adminStyles";

interface MediaFormProps {
  action: (formData: FormData) => void | Promise<void>;
  media?: AdminMediaRecord;
  submitLabel: string;
}

export function MediaForm({ action, media, submitLabel }: MediaFormProps) {
  return (
    <form action={action} className="grid gap-4 sm:grid-cols-2">
      {media ? <input type="hidden" name="id" value={media.id} /> : null}

      <label className="block sm:col-span-2">
        <AdminLabel>Image</AdminLabel>
        <input
          name="file"
          type="file"
          accept="image/*"
          required={!media}
          className={adminFileClass}
        />
        <input type="hidden" name="url" defaultValue={media?.url ?? ""} />
      </label>

      <label className="block">
        <AdminLabel>Titre</AdminLabel>
        <input name="title" defaultValue={media?.title} className={adminFieldClass} />
      </label>

      <label className="block">
        <AdminLabel>Catégorie</AdminLabel>
        <input
          name="category"
          defaultValue={media?.category ?? "galerie"}
          className={adminFieldClass}
        />
      </label>

      <label className="flex items-center gap-2 sm:col-span-2">
        <input
          name="isFeaturedHome"
          type="checkbox"
          defaultChecked={media?.isFeaturedHome}
          className="size-4 accent-burgundy"
        />
        <span className="font-sans text-sm">Mettre en avant sur l’accueil</span>
      </label>

      <div className="sm:col-span-2">
        <button type="submit" className={adminPrimaryButtonClass}>
          {submitLabel}
        </button>
      </div>
    </form>
  );
}
