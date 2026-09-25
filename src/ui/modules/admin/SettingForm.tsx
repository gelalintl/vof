import type { AdminSettingRecord } from "@/types";
import { AdminLabel } from "./AdminPageHeader";
import { adminFieldClass, adminPrimaryButtonClass } from "./adminStyles";

interface SettingFormProps {
  action: (formData: FormData) => void | Promise<void>;
  setting?: AdminSettingRecord;
  submitLabel: string;
}

export function SettingForm({ action, setting, submitLabel }: SettingFormProps) {
  return (
    <form action={action} className="grid gap-4">
      {setting ? <input type="hidden" name="id" value={setting.id} /> : null}

      <label className="block">
        <AdminLabel>Clé</AdminLabel>
        <input
          name="key"
          required
          defaultValue={setting?.key}
          className={adminFieldClass}
        />
      </label>

      <label className="block">
        <AdminLabel>Valeur (texte ou JSON)</AdminLabel>
        <textarea
          name="value"
          required
          rows={5}
          defaultValue={setting?.value}
          className={adminFieldClass}
        />
      </label>

      <button type="submit" className={adminPrimaryButtonClass}>
        {submitLabel}
      </button>
    </form>
  );
}
