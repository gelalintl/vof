"use client";

import { useState } from "react";
import { ChevronDown, ChevronUp, Plus, Trash2 } from "lucide-react";
import { updateSiteSettings } from "@/app/admin/actions";
import {
  FOOTER_NAV_FALLBACKS,
  FOOTER_SCHEDULE_FALLBACKS,
  FOOTER_SCHEDULE_TITLE_FALLBACK,
  parseFooterLinks,
  parseFooterScheduleItems,
  serializeFooterLinks,
  serializeFooterScheduleItems,
} from "@/lib/footerContent";
import {
  FOOTER_COPYRIGHT_KEY,
  FOOTER_DESCRIPTION_KEY,
  FOOTER_NAV_LINKS_KEY,
  FOOTER_SCHEDULE_ITEMS_KEY,
  FOOTER_SCHEDULE_TITLE_KEY,
  FOOTER_SHOW_CONTACT_KEY,
  FOOTER_SHOW_SOCIALS_KEY,
  isSettingEnabled,
  type FooterSettingKey,
} from "@/lib/siteSettingsKeys";
import type { FooterLink, FooterScheduleItem } from "@/types";
import { cn } from "@/utils/cn";
import { AdminSubmitButton } from "./AdminSubmitButton";
import { AdminLabel, AdminPanel } from "./AdminPageHeader";
import { adminFieldClass, adminGhostButtonClass } from "./adminStyles";
import { notifyAdminAction } from "./notifyAdminAction";

interface FooterLinkDraft extends FooterLink {
  id: string;
}

interface FooterScheduleDraft extends FooterScheduleItem {
  id: string;
}

interface FooterSettingsFormProps {
  values: Record<FooterSettingKey, string>;
}

function toLinkDrafts(links: FooterLink[]): FooterLinkDraft[] {
  return links.map((link, index) => ({
    id: `${link.url}-${index}`,
    label: link.label,
    url: link.url,
  }));
}

function toScheduleDrafts(items: FooterScheduleItem[]): FooterScheduleDraft[] {
  return items.map((item, index) => ({
    id: `${item.label}-${index}`,
    label: item.label,
    time: item.time,
  }));
}

function linksFromValue(raw: string, fallback: FooterLink[]): FooterLinkDraft[] {
  return toLinkDrafts(raw.trim() === "" ? fallback : parseFooterLinks(raw));
}

function scheduleFromValue(
  raw: string,
  fallback: FooterScheduleItem[],
): FooterScheduleDraft[] {
  return toScheduleDrafts(raw.trim() === "" ? fallback : parseFooterScheduleItems(raw));
}

export function FooterSettingsForm({ values }: FooterSettingsFormProps) {
  const [showContact, setShowContact] = useState(
    isSettingEnabled(values.footer_show_contact, true),
  );
  const [showSocials, setShowSocials] = useState(
    isSettingEnabled(values.footer_show_socials, true),
  );
  const [navLinks, setNavLinks] = useState<FooterLinkDraft[]>(() =>
    linksFromValue(values.footer_nav_links, FOOTER_NAV_FALLBACKS),
  );
  const [scheduleItems, setScheduleItems] = useState<FooterScheduleDraft[]>(() =>
    scheduleFromValue(values.footer_schedule_items, FOOTER_SCHEDULE_FALLBACKS),
  );

  function updateNavLink(id: string, patch: Partial<FooterLink>) {
    setNavLinks((current) =>
      current.map((link) => (link.id === id ? { ...link, ...patch } : link)),
    );
  }

  function moveNavLink(index: number, direction: -1 | 1) {
    setNavLinks((current) => {
      const nextIndex = index + direction;
      if (nextIndex < 0 || nextIndex >= current.length) {
        return current;
      }
      const links = [...current];
      const [moved] = links.splice(index, 1);
      links.splice(nextIndex, 0, moved);
      return links;
    });
  }

  function updateScheduleItem(id: string, patch: Partial<FooterScheduleItem>) {
    setScheduleItems((current) =>
      current.map((item) => (item.id === id ? { ...item, ...patch } : item)),
    );
  }

  const handleSubmit = notifyAdminAction(async (formData) => {
    await updateSiteSettings({
      [FOOTER_DESCRIPTION_KEY]: String(formData.get(FOOTER_DESCRIPTION_KEY) ?? ""),
      [FOOTER_COPYRIGHT_KEY]: String(formData.get(FOOTER_COPYRIGHT_KEY) ?? ""),
      [FOOTER_NAV_LINKS_KEY]: serializeFooterLinks(navLinks),
      [FOOTER_SCHEDULE_TITLE_KEY]: String(formData.get(FOOTER_SCHEDULE_TITLE_KEY) ?? ""),
      [FOOTER_SCHEDULE_ITEMS_KEY]: serializeFooterScheduleItems(scheduleItems),
      [FOOTER_SHOW_CONTACT_KEY]: showContact ? "true" : "false",
      [FOOTER_SHOW_SOCIALS_KEY]: showSocials ? "true" : "false",
    });
  }, "Pied de page mis à jour avec succès !");

  return (
    <form action={handleSubmit} className="space-y-6">
      <AdminPanel>
        <h2 className="font-heading text-lg font-bold text-slate-900">
          Colonne 1 — Présentation & copyright
        </h2>
        <p className="mt-1 text-sm text-slate-600">
          Description sous le logo et texte de copyright en bas de page.
        </p>
        <div className="mt-6 grid gap-4">
          <label className="block">
            <AdminLabel>Description sous le logo</AdminLabel>
            <textarea
              name={FOOTER_DESCRIPTION_KEY}
              rows={3}
              defaultValue={values.footer_description}
              placeholder="Présentation courte de l’église…"
              className={adminFieldClass}
            />
          </label>
          <label className="block">
            <AdminLabel>Texte de copyright</AdminLabel>
            <input
              name={FOOTER_COPYRIGHT_KEY}
              defaultValue={values.footer_copyright}
              placeholder="© 2026 Église Voice Of Freedom. Tous droits réservés."
              className={adminFieldClass}
            />
          </label>
        </div>
      </AdminPanel>

      <AdminPanel>
        <h2 className="font-heading text-lg font-bold text-slate-900">
          Colonne 2 — Liens de navigation
        </h2>
        <p className="mt-1 text-sm text-slate-600">
          Liste dynamique affichée dans la colonne Navigation du pied de page.
        </p>
        <ul className="mt-6 space-y-3">
          {navLinks.map((link, index) => (
            <li
              key={link.id}
              className="grid gap-3 border border-slate-200 bg-white p-3 md:grid-cols-[1fr_1fr_auto]"
            >
              <label className="block min-w-0">
                <AdminLabel>Libellé</AdminLabel>
                <input
                  value={link.label}
                  onChange={(event) =>
                    updateNavLink(link.id, { label: event.target.value })
                  }
                  className={adminFieldClass}
                />
              </label>
              <label className="block min-w-0">
                <AdminLabel>URL</AdminLabel>
                <input
                  value={link.url}
                  onChange={(event) =>
                    updateNavLink(link.id, { url: event.target.value })
                  }
                  placeholder="/page ou https://…"
                  className={adminFieldClass}
                />
              </label>
              <div className="flex items-end gap-1">
                <IconButton
                  label="Monter le lien"
                  disabled={index === 0}
                  onClick={() => moveNavLink(index, -1)}
                >
                  <ChevronUp className="size-4" />
                </IconButton>
                <IconButton
                  label="Descendre le lien"
                  disabled={index === navLinks.length - 1}
                  onClick={() => moveNavLink(index, 1)}
                >
                  <ChevronDown className="size-4" />
                </IconButton>
                <IconButton
                  label="Supprimer le lien"
                  onClick={() =>
                    setNavLinks((current) => current.filter((item) => item.id !== link.id))
                  }
                >
                  <Trash2 className="size-4" />
                </IconButton>
              </div>
            </li>
          ))}
        </ul>
        <button
          type="button"
          onClick={() =>
            setNavLinks((current) => [
              ...current,
              { id: crypto.randomUUID(), label: "", url: "" },
            ])
          }
          className={cn(adminGhostButtonClass, "mt-4")}
        >
          <Plus className="mr-2 size-4" aria-hidden />
          Ajouter un lien
        </button>
      </AdminPanel>

      <AdminPanel>
        <h2 className="font-heading text-lg font-bold text-slate-900">
          Colonne 3 — Horaires des cultes
        </h2>
        <p className="mt-1 text-sm text-slate-600">
          Titre de la colonne et liste des rendez-vous de la semaine.
        </p>
        <label className="mt-6 block">
          <AdminLabel>Titre de la section</AdminLabel>
          <input
            name={FOOTER_SCHEDULE_TITLE_KEY}
            defaultValue={values.footer_schedule_title || FOOTER_SCHEDULE_TITLE_FALLBACK}
            placeholder="Horaires des cultes"
            className={adminFieldClass}
          />
        </label>
        <ul className="mt-4 space-y-3">
          {scheduleItems.map((item) => (
            <li
              key={item.id}
              className="grid gap-3 border border-slate-200 bg-white p-3 md:grid-cols-[1fr_1fr_auto]"
            >
              <label className="block min-w-0">
                <AdminLabel>Nom du culte / événement</AdminLabel>
                <input
                  value={item.label}
                  onChange={(event) =>
                    updateScheduleItem(item.id, { label: event.target.value })
                  }
                  placeholder="Culte dominical"
                  className={adminFieldClass}
                />
              </label>
              <label className="block min-w-0">
                <AdminLabel>Jour & heure</AdminLabel>
                <input
                  value={item.time}
                  onChange={(event) =>
                    updateScheduleItem(item.id, { time: event.target.value })
                  }
                  placeholder="Dimanche 09h00"
                  className={adminFieldClass}
                />
              </label>
              <div className="flex items-end">
                <IconButton
                  label="Supprimer l’horaire"
                  onClick={() =>
                    setScheduleItems((current) =>
                      current.filter((entry) => entry.id !== item.id),
                    )
                  }
                >
                  <Trash2 className="size-4" />
                </IconButton>
              </div>
            </li>
          ))}
        </ul>
        <button
          type="button"
          onClick={() =>
            setScheduleItems((current) => [
              ...current,
              { id: crypto.randomUUID(), label: "", time: "" },
            ])
          }
          className={cn(adminGhostButtonClass, "mt-4")}
        >
          <Plus className="mr-2 size-4" aria-hidden />
          Ajouter un horaire
        </button>
      </AdminPanel>

      <AdminPanel>
        <h2 className="font-heading text-lg font-bold text-slate-900">
          Colonne 4 — Coordonnées & réseaux
        </h2>
        <p className="mt-1 text-sm text-slate-600">
          Les adresses, téléphones et réseaux restent gérés dans Contacts & Réseaux.
          Choisissez ici ce qui s’affiche dans le pied de page.
        </p>
        <div className="mt-6 grid gap-3">
          <AdminSwitch
            checked={showContact}
            onChange={setShowContact}
            title="Afficher les coordonnées"
            description="Adresse, téléphone et e-mail dans la colonne Contact."
          />
          <AdminSwitch
            checked={showSocials}
            onChange={setShowSocials}
            title="Afficher les réseaux sociaux"
            description="Icônes Facebook, Instagram, YouTube, TikTok et WhatsApp."
          />
        </div>
      </AdminPanel>

      <div className="mt-6 flex items-center justify-end gap-3 border-t border-slate-100 pt-6">
        <AdminSubmitButton className="w-full sm:w-auto">
          Enregistrer le pied de page
        </AdminSubmitButton>
      </div>
    </form>
  );
}

function IconButton({
  label,
  disabled,
  onClick,
  children,
}: {
  label: string;
  disabled?: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      aria-label={label}
      disabled={disabled}
      onClick={onClick}
      className="inline-flex size-9 items-center justify-center border border-slate-200 text-slate-600 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"
    >
      {children}
    </button>
  );
}

function AdminSwitch({
  checked,
  onChange,
  title,
  description,
}: {
  checked: boolean;
  onChange: (value: boolean) => void;
  title: string;
  description: string;
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
        <span className="block font-heading text-sm font-bold text-slate-900">
          {title}
        </span>
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
