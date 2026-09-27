"use client";

import { useState } from "react";
import type { AdminEventCategory, AdminEventRecord, AdminRecurrenceType } from "@/types";
import { RECURRENCE_ADMIN_LABELS, slugifyEventTitle } from "@/lib/eventRecurrence";
import { toDateInputValue, toTimeInputValue } from "@/utils/date/format";
import { cn } from "@/utils/cn";
import { AdminLabel } from "./AdminPageHeader";
import { AdminThumb } from "./AdminThumb";
import { EVENT_CATEGORY_LABELS } from "./AdminBadge";
import { AdminSubmitButton } from "./AdminSubmitButton";
import { adminFieldClass, adminFileClass } from "./adminStyles";

const categories = Object.entries(EVENT_CATEGORY_LABELS) as [AdminEventCategory, string][];

const AUTO_MONTHLY_FREQUENCIES = new Set<AdminRecurrenceType>([
  "FIRST_3_DAYS_MONTH",
  "SECOND_AND_LAST_FRIDAY",
]);

const FREQUENCIES: { value: Exclude<AdminRecurrenceType, "NONE">; label: string }[] = [
  { value: "DAILY", label: RECURRENCE_ADMIN_LABELS.DAILY },
  { value: "WEEKLY", label: RECURRENCE_ADMIN_LABELS.WEEKLY },
  { value: "MONTHLY", label: RECURRENCE_ADMIN_LABELS.MONTHLY },
  { value: "FIRST_3_DAYS_MONTH", label: RECURRENCE_ADMIN_LABELS.FIRST_3_DAYS_MONTH },
  { value: "SECOND_AND_LAST_FRIDAY", label: RECURRENCE_ADMIN_LABELS.SECOND_AND_LAST_FRIDAY },
];

const WEEKDAYS: { value: number; label: string }[] = [
  { value: 1, label: "Lundi" },
  { value: 2, label: "Mardi" },
  { value: 3, label: "Mercredi" },
  { value: 4, label: "Jeudi" },
  { value: 5, label: "Vendredi" },
  { value: 6, label: "Samedi" },
  { value: 0, label: "Dimanche" },
];

interface EventFormProps {
  action: (formData: FormData) => void | Promise<void>;
  event?: AdminEventRecord;
  submitLabel: string;
}

function initialFrequency(event?: AdminEventRecord): Exclude<AdminRecurrenceType, "NONE"> {
  if (event?.recurrenceType && event.recurrenceType !== "NONE") {
    return event.recurrenceType;
  }
  return "MONTHLY";
}

function inferredDurationDays(event?: AdminEventRecord) {
  if (event?.durationDays && event.durationDays > 1) {
    return event.durationDays;
  }
  if (event?.startDate && event.endDate) {
    const start = new Date(event.startDate);
    const end = new Date(event.endDate);
    const startDay = new Date(start.getFullYear(), start.getMonth(), start.getDate());
    const endDay = new Date(end.getFullYear(), end.getMonth(), end.getDate());
    const diff = Math.round((endDay.getTime() - startDay.getTime()) / 86_400_000) + 1;
    if (diff > 1) {
      return Math.min(31, diff);
    }
  }
  if (event?.recurrenceType === "FIRST_3_DAYS_MONTH") {
    return 3;
  }
  return 1;
}

export function EventForm({ action, event, submitLabel }: EventFormProps) {
  const [title, setTitle] = useState(event?.title ?? "");
  const [slug, setSlug] = useState(event?.slug ?? slugifyEventTitle(event?.title ?? ""));
  const [slugTouched, setSlugTouched] = useState(Boolean(event?.slug));
  const [isRecurring, setIsRecurring] = useState(
    Boolean(event?.recurrenceType && event.recurrenceType !== "NONE"),
  );
  const [frequency, setFrequency] = useState<Exclude<AdminRecurrenceType, "NONE">>(
    initialFrequency(event),
  );
  const [daysOfWeek, setDaysOfWeek] = useState<number[]>(event?.daysOfWeek ?? []);
  const [durationDays, setDurationDays] = useState(inferredDurationDays(event));
  const [isMultiDay, setIsMultiDay] = useState(inferredDurationDays(event) > 1);
  const [imagePreview, setImagePreview] = useState<string | null>(event?.image ?? null);
  const [featured, setFeatured] = useState(Boolean(event?.isFeatured));
  const [special, setSpecial] = useState(Boolean(event?.isSpecial));
  const [exclusive, setExclusive] = useState(Boolean(event?.isExclusive));
  const [excludedDates, setExcludedDates] = useState((event?.excludedDates ?? []).join("\n"));

  function toggleDay(day: number) {
    setDaysOfWeek((current) =>
      current.includes(day) ? current.filter((value) => value !== day) : [...current, day].sort(),
    );
  }

  return (
    <form action={action} className="grid gap-4 sm:grid-cols-2">
      {event ? <input type="hidden" name="id" value={event.id} /> : null}
      {featured ? <input type="hidden" name="isFeatured" value="on" /> : null}
      {special ? <input type="hidden" name="isSpecial" value="on" /> : null}
      {exclusive ? <input type="hidden" name="isExclusive" value="on" /> : null}

      <label className="block sm:col-span-2">
        <AdminLabel>Titre</AdminLabel>
        <input
          name="title"
          required
          value={title}
          onChange={(change) => {
            const next = change.target.value;
            setTitle(next);
            if (!slugTouched) {
              setSlug(slugifyEventTitle(next));
            }
          }}
          className={adminFieldClass}
        />
      </label>

      <label className="block sm:col-span-2">
        <AdminLabel>Slug</AdminLabel>
        <input
          name="slug"
          value={slug}
          onChange={(change) => {
            setSlugTouched(true);
            setSlug(change.target.value);
          }}
          placeholder="Généré automatiquement à partir du titre"
          className={adminFieldClass}
        />
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

      <fieldset className="space-y-3 border border-slate-200 bg-slate-50 p-4 sm:col-span-2">
        <legend className="px-1 font-heading text-sm font-bold text-slate-900">
          Image d’illustration
        </legend>
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
          <AdminThumb src={imagePreview} alt={event?.title ?? "Aperçu de l’image"} className="size-20" />
          <label className="block min-w-0 flex-1">
            <AdminLabel>Fichier image</AdminLabel>
            <input
              name="imageFile"
              type="file"
              accept="image/*"
              className={adminFileClass}
              onChange={(change) => {
                const file = change.target.files?.[0];
                setImagePreview(file ? URL.createObjectURL(file) : (event?.image ?? null));
              }}
            />
          </label>
        </div>
        <input type="hidden" name="image" defaultValue={event?.image ?? ""} />
      </fieldset>

      <label className="block sm:col-span-2">
        <AdminLabel>Lien vidéo YouTube (optionnel)</AdminLabel>
        <input
          name="youtubeUrl"
          type="text"
          defaultValue={event?.youtubeUrl ?? ""}
          placeholder="https://www.youtube.com/watch?v=…"
          className={adminFieldClass}
        />
      </label>

      <fieldset className="space-y-4 border border-slate-200 bg-slate-50 p-4 sm:col-span-2">
        <legend className="px-1 font-heading text-sm font-bold text-slate-900">
          Type de date
        </legend>
        <div className="grid gap-2 sm:grid-cols-2">
          <DateTypeChoice
            selected={!isRecurring}
            title="Événement ponctuel"
            description="Date et heure de début / fin précises"
            onSelect={() => setIsRecurring(false)}
          />
          <DateTypeChoice
            selected={isRecurring}
            title="Événement récurrent"
            description="Règle mensuelle et dates exclues"
            onSelect={() => setIsRecurring(true)}
          />
        </div>

        <label className="block">
          <AdminLabel>{isRecurring ? "Date de début de la série" : "Date de début"}</AdminLabel>
          <input
            name="startDate"
            type="date"
            required
            defaultValue={event ? toDateInputValue(event.startDate) : undefined}
            className={adminFieldClass}
          />
        </label>

        <div className="grid gap-4 sm:grid-cols-2">
          <label className="block">
            <AdminLabel>Heure de début</AdminLabel>
            <input
              name="startTime"
              type="time"
              required
              step={60}
              defaultValue={event ? toTimeInputValue(event.startDate) : undefined}
              className={adminFieldClass}
            />
          </label>
          <label className="block">
            <AdminLabel>Heure de fin</AdminLabel>
            <input
              name="endTime"
              type="time"
              step={60}
              defaultValue={event?.endDate ? toTimeInputValue(event.endDate) : undefined}
              className={adminFieldClass}
            />
          </label>
        </div>

        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={isMultiDay}
            onChange={(change) => {
              const next = change.target.checked;
              setIsMultiDay(next);
              setDurationDays((current) => (next ? Math.max(current, 2) : 1));
            }}
            className="size-4 accent-[#6d28d9]"
          />
          <span className="font-heading text-sm font-bold text-slate-900">
            Sur plusieurs jours
          </span>
        </label>
        {isMultiDay ? (
          <label className="block max-w-xs">
            <AdminLabel>Nombre de jours</AdminLabel>
            <input
              name="durationDays"
              type="number"
              min={2}
              max={31}
              value={durationDays}
              onChange={(change) =>
                setDurationDays(Math.min(31, Math.max(2, Number(change.target.value) || 2)))
              }
              className={adminFieldClass}
            />
          </label>
        ) : (
          <input type="hidden" name="durationDays" value={1} />
        )}

        {isRecurring ? (
          <>
            <input type="hidden" name="recurrenceType" value={frequency} />
            <input type="hidden" name="recurrenceRule" value={frequency} />
            <label className="block">
              <AdminLabel>Règle de récurrence mensuelle</AdminLabel>
              <select
                value={frequency}
                onChange={(change) => {
                  const next = change.target.value as Exclude<AdminRecurrenceType, "NONE">;
                  setFrequency(next);
                  if (next === "FIRST_3_DAYS_MONTH") {
                    setIsMultiDay(true);
                    setDurationDays((current) => (current > 1 ? current : 3));
                  }
                  if (next === "SECOND_AND_LAST_FRIDAY") {
                    setIsMultiDay(false);
                    setDurationDays(1);
                  }
                }}
                className={adminFieldClass}
              >
                {FREQUENCIES.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </label>

            {frequency === "WEEKLY" && !AUTO_MONTHLY_FREQUENCIES.has(frequency) ? (
              <fieldset>
                <AdminLabel>Jours de la semaine</AdminLabel>
                <div className="mt-2 flex flex-wrap gap-2">
                  {WEEKDAYS.map((day) => {
                    const checked = daysOfWeek.includes(day.value);
                    return (
                      <label
                        key={day.value}
                        className={`inline-flex cursor-pointer items-center gap-2 border px-2.5 py-1.5 font-sans text-xs ${
                          checked
                            ? "border-[#6d28d9] bg-[#6d28d9] text-white"
                            : "border-slate-200 bg-white text-slate-800"
                        }`}
                      >
                        <input
                          type="checkbox"
                          name="daysOfWeek"
                          value={day.value}
                          checked={checked}
                          onChange={() => toggleDay(day.value)}
                          className="sr-only"
                        />
                        {day.label}
                      </label>
                    );
                  })}
                </div>
              </fieldset>
            ) : null}

            <label className="block">
              <AdminLabel>Date de fin de récurrence</AdminLabel>
              <input
                name="recurrenceEndDate"
                type="date"
                defaultValue={
                  event?.recurrenceEndDate ? toDateInputValue(event.recurrenceEndDate) : undefined
                }
                className={adminFieldClass}
              />
            </label>

            <label className="block">
              <AdminLabel>Dates exclues</AdminLabel>
              <textarea
                name="excludedDates"
                rows={3}
                value={excludedDates}
                onChange={(change) => setExcludedDates(change.target.value)}
                placeholder="Une date par ligne, ex. 2026-12-25"
                className={adminFieldClass}
              />
              <p className="mt-1 font-sans text-xs text-slate-500">
                Ces jours ne seront pas projetés dans l’agenda public.
              </p>
            </label>
          </>
        ) : (
          <input type="hidden" name="recurrenceType" value="NONE" />
        )}
      </fieldset>

      <fieldset className="space-y-3 border border-slate-200 bg-slate-50 p-4 sm:col-span-2">
        <legend className="px-1 font-heading text-sm font-bold text-slate-900">
          Mise en avant
        </legend>
        <SettingSwitch
          label="À la une"
          description="Un seul événement peut être à la une."
          checked={featured}
          onChange={setFeatured}
        />
        <SettingSwitch
          label="Temps fort / Spécial"
          description="Met en évidence un temps fort de l’église."
          checked={special}
          onChange={setSpecial}
        />
        <SettingSwitch
          label="Exclusif"
          description="Écrase les autres activités prévues à la même date."
          checked={exclusive}
          onChange={setExclusive}
        />
      </fieldset>

      <div className="sm:col-span-2">
        <AdminSubmitButton>{submitLabel}</AdminSubmitButton>
      </div>
    </form>
  );
}

function DateTypeChoice({
  selected,
  title,
  description,
  onSelect,
}: {
  selected: boolean;
  title: string;
  description: string;
  onSelect: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onSelect}
      className={cn(
        "border px-4 py-3 text-left transition-colors",
        selected ? "border-[#6d28d9] bg-white" : "border-slate-200 bg-white hover:border-sky-600",
      )}
    >
      <span className="block font-heading text-sm font-bold text-slate-900">{title}</span>
      <span className="mt-1 block font-sans text-xs text-slate-500">{description}</span>
    </button>
  );
}

function SettingSwitch({
  label,
  description,
  checked,
  onChange,
}: {
  label: string;
  description: string;
  checked: boolean;
  onChange: (value: boolean) => void;
}) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      onClick={() => onChange(!checked)}
      className="flex w-full items-center justify-between gap-4 border border-slate-200 bg-white px-4 py-3 text-left"
    >
      <span>
        <span className="block font-heading text-sm font-bold text-slate-900">{label}</span>
        <span className="block text-xs text-slate-500">{description}</span>
      </span>
      <span
        className={cn(
          "relative h-6 w-11 shrink-0 rounded-full transition-colors",
          checked ? "bg-[#6d28d9]" : "bg-violet-200",
        )}
      >
        <span
          className={cn(
            "absolute top-0.5 size-5 rounded-full bg-white shadow-sm transition-[left]",
            checked ? "left-[22px]" : "left-0.5",
          )}
        />
        <span className="sr-only">{checked ? "Activé" : "Désactivé"}</span>
      </span>
    </button>
  );
}
