import type { AdminEventCategory, AdminEventRecord } from "@/types";
import { toDatetimeLocalValue } from "@/utils/date/format";
import { AdminLabel } from "./AdminPageHeader";
import { EVENT_CATEGORY_LABELS } from "./AdminBadge";
import { adminFieldClass, adminFileClass, adminPrimaryButtonClass } from "./adminStyles";

const categories = Object.entries(EVENT_CATEGORY_LABELS) as [AdminEventCategory, string][];

interface EventFormProps {
  action: (formData: FormData) => void | Promise<void>;
  event?: AdminEventRecord;
  submitLabel: string;
}

export function EventForm({ action, event, submitLabel }: EventFormProps) {
  return (
    <form action={action} className="grid gap-4 sm:grid-cols-2">
      {event ? <input type="hidden" name="id" value={event.id} /> : null}

      <label className="block sm:col-span-2">
        <AdminLabel>Titre</AdminLabel>
        <input name="title" required defaultValue={event?.title} className={adminFieldClass} />
      </label>

      <label className="block sm:col-span-2">
        <AdminLabel>Description</AdminLabel>
        <textarea
          name="description"
          required
          rows={4}
          defaultValue={event?.description}
          className={adminFieldClass}
        />
      </label>

      <label className="block">
        <AdminLabel>Début</AdminLabel>
        <input
          name="startDate"
          type="datetime-local"
          required
          defaultValue={event ? toDatetimeLocalValue(event.startDate) : undefined}
          className={adminFieldClass}
        />
      </label>

      <label className="block">
        <AdminLabel>Fin</AdminLabel>
        <input
          name="endDate"
          type="datetime-local"
          defaultValue={event?.endDate ? toDatetimeLocalValue(event.endDate) : undefined}
          className={adminFieldClass}
        />
      </label>

      <label className="block">
        <AdminLabel>Lieu</AdminLabel>
        <input name="location" required defaultValue={event?.location} className={adminFieldClass} />
      </label>

      <label className="block">
        <AdminLabel>Catégorie</AdminLabel>
        <select name="category" defaultValue={event?.category ?? "ROUTINE"} className={adminFieldClass}>
          {categories.map(([value, label]) => (
            <option key={value} value={value}>
              {label}
            </option>
          ))}
        </select>
      </label>

      <label className="block sm:col-span-2">
        <AdminLabel>Image</AdminLabel>
        <input name="imageFile" type="file" accept="image/*" className={adminFileClass} />
        <input type="hidden" name="image" defaultValue={event?.image ?? ""} />
        {event?.image ? (
          <span className="mt-1 block font-mono text-xs text-[#2C2424]/60">{event.image}</span>
        ) : null}
      </label>

      <label className="flex items-center gap-2 sm:col-span-2">
        <input
          name="isSpecial"
          type="checkbox"
          defaultChecked={event?.isSpecial}
          className="size-4 accent-burgundy"
        />
        <span className="font-sans text-sm">Marquer comme événement spécial</span>
      </label>

      <div className="sm:col-span-2">
        <button type="submit" className={adminPrimaryButtonClass}>
          {submitLabel}
        </button>
      </div>
    </form>
  );
}
