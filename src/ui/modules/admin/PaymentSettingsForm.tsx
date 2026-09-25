"use client";

import { useState } from "react";
import { toast } from "sonner";
import {
  deletePaymentQr,
  updateSiteSettings,
  uploadPaymentQr,
} from "@/app/admin/actions";
import { isSettingEnabled, type PaymentSettingKey } from "@/lib/siteSettingsKeys";
import { cn } from "@/utils/cn";
import { AdminLabel, AdminPanel } from "./AdminPageHeader";
import {
  adminFieldClass,
  adminFileClass,
  adminGhostButtonClass,
  adminPrimaryButtonClass,
} from "./adminStyles";

interface PaymentSettingsFormProps {
  values: Record<PaymentSettingKey, string>;
}

const toggles = [
  {
    key: "payment_amana_enabled",
    label: "Amana",
    description: "Mobile Money Amana",
  },
  {
    key: "payment_nita_enabled",
    label: "MyNita",
    description: "Mobile Money MyNita",
  },
  {
    key: "payment_wave_enabled",
    label: "Wave",
    description: "Mobile Money Wave",
  },
  {
    key: "payment_card_enabled",
    label: "Carte bancaire",
    description: "Visa / Mastercard simulée",
  },
  {
    key: "payment_bank_enabled",
    label: "Virement bancaire",
    description: "Coordonnées RIB / IBAN",
  },
] as const;

const operators = [
  {
    slug: "amana",
    label: "Amana",
    phoneKey: "payment_amana_phone",
    qrKey: "payment_amana_qr",
  },
  {
    slug: "nita",
    label: "MyNita",
    phoneKey: "payment_nita_phone",
    qrKey: "payment_nita_qr",
  },
  {
    slug: "wave",
    label: "Wave",
    phoneKey: "payment_wave_phone",
    qrKey: "payment_wave_qr",
  },
] as const;

export function PaymentSettingsForm({ values }: PaymentSettingsFormProps) {
  const [enabled, setEnabled] = useState({
    payment_amana_enabled: isSettingEnabled(values.payment_amana_enabled),
    payment_nita_enabled: isSettingEnabled(values.payment_nita_enabled),
    payment_wave_enabled: isSettingEnabled(values.payment_wave_enabled),
    payment_card_enabled: isSettingEnabled(values.payment_card_enabled),
    payment_bank_enabled: isSettingEnabled(values.payment_bank_enabled),
  });

  async function handleSubmit(formData: FormData) {
    await updateSiteSettings({
      payment_amana_enabled: enabled.payment_amana_enabled ? "true" : "false",
      payment_nita_enabled: enabled.payment_nita_enabled ? "true" : "false",
      payment_wave_enabled: enabled.payment_wave_enabled ? "true" : "false",
      payment_card_enabled: enabled.payment_card_enabled ? "true" : "false",
      payment_bank_enabled: enabled.payment_bank_enabled ? "true" : "false",
      payment_amana_phone: String(formData.get("payment_amana_phone") ?? ""),
      payment_nita_phone: String(formData.get("payment_nita_phone") ?? ""),
      payment_wave_phone: String(formData.get("payment_wave_phone") ?? ""),
      bank_name: String(formData.get("bank_name") ?? ""),
      bank_account_name: String(formData.get("bank_account_name") ?? ""),
      bank_iban: String(formData.get("bank_iban") ?? ""),
      bank_swift: String(formData.get("bank_swift") ?? ""),
      bank_rib_code: String(formData.get("bank_rib_code") ?? ""),
    });
    toast.success("Configuration des paiements enregistrée.");
  }

  async function handleQrUpload(formData: FormData) {
    await uploadPaymentQr(formData);
    toast.success("QR code téléversé.");
  }

  async function handleQrDelete(formData: FormData) {
    await deletePaymentQr(formData);
    toast.success("QR code retiré.");
  }

  return (
    <AdminPanel>
      <h2 className="font-heading text-lg font-bold text-burgundy">
        Configuration des Paiements & Dons
      </h2>
      <p className="mt-1 text-sm text-[#2C2424]/70">
        Activez les moyens visibles sur le site public. Les QR codes sont
        enregistrés dans <code className="font-mono text-xs">public/uploads</code>.
      </p>

      <form action={handleSubmit} className="mt-6 space-y-8">
        <fieldset>
          <legend className="font-heading text-sm font-bold text-burgundy">
            Activation des moyens de paiement
          </legend>
          <div className="mt-3 grid gap-2">
            {toggles.map((item) => (
              <PaymentToggle
                key={item.key}
                label={item.label}
                description={item.description}
                checked={enabled[item.key]}
                onChange={(value) =>
                  setEnabled((current) => ({ ...current, [item.key]: value }))
                }
              />
            ))}
          </div>
        </fieldset>

        <fieldset>
          <legend className="font-heading text-sm font-bold text-burgundy">
            Mobile Money — QR & numéros marchands
          </legend>
          <div className="mt-3 grid gap-4 lg:grid-cols-3">
            {operators.map((operator) => (
              <div
                key={operator.slug}
                className="border border-burgundy/15 bg-cream/40 p-4"
              >
                <p className="font-heading text-sm font-bold text-burgundy">
                  {operator.label}
                </p>
                <QrPreview src={values[operator.qrKey]} label={operator.label} />
                <label className="mt-4 block">
                  <AdminLabel>Numéro / compte marchand</AdminLabel>
                  <input
                    name={operator.phoneKey}
                    type="text"
                    defaultValue={values[operator.phoneKey]}
                    placeholder="+227 90 00 00 00"
                    className={adminFieldClass}
                  />
                </label>
              </div>
            ))}
          </div>
        </fieldset>

        <fieldset>
          <legend className="font-heading text-sm font-bold text-burgundy">
            Coordonnées du virement bancaire
          </legend>
          <div className="mt-3 grid gap-4 sm:grid-cols-2">
            <label className="block">
              <AdminLabel>Nom de la banque</AdminLabel>
              <input
                name="bank_name"
                type="text"
                defaultValue={values.bank_name}
                className={adminFieldClass}
              />
            </label>
            <label className="block">
              <AdminLabel>Titulaire du compte</AdminLabel>
              <input
                name="bank_account_name"
                type="text"
                defaultValue={values.bank_account_name}
                className={adminFieldClass}
              />
            </label>
            <label className="block sm:col-span-2">
              <AdminLabel>IBAN / numéro de compte</AdminLabel>
              <input
                name="bank_iban"
                type="text"
                defaultValue={values.bank_iban}
                className={adminFieldClass}
              />
            </label>
            <label className="block">
              <AdminLabel>Code SWIFT / BIC</AdminLabel>
              <input
                name="bank_swift"
                type="text"
                defaultValue={values.bank_swift}
                className={adminFieldClass}
              />
            </label>
            <label className="block">
              <AdminLabel>Code RIB / clé</AdminLabel>
              <input
                name="bank_rib_code"
                type="text"
                defaultValue={values.bank_rib_code}
                className={adminFieldClass}
              />
            </label>
          </div>
        </fieldset>

        <button type="submit" className={adminPrimaryButtonClass}>
          Enregistrer les paiements
        </button>
      </form>

      <div className="mt-8 grid gap-4 lg:grid-cols-3">
        {operators.map((operator) => {
          const qrSrc = values[operator.qrKey];
          const hasUpload = Boolean(qrSrc && qrSrc.startsWith("/uploads/"));

          return (
            <div key={`${operator.slug}-upload`} className="border border-burgundy/10 p-4">
              <p className="font-heading text-xs font-bold uppercase tracking-[0.16em] text-burgundy">
                QR {operator.label}
              </p>
              <form action={handleQrUpload} className="mt-3 grid gap-3">
                <input type="hidden" name="operator" value={operator.slug} />
                <label className="block">
                  <span className="sr-only">Fichier QR {operator.label}</span>
                  <input
                    name="file"
                    type="file"
                    accept="image/*"
                    required
                    className={adminFileClass}
                  />
                </label>
                <button type="submit" className={adminPrimaryButtonClass}>
                  {qrSrc ? "Remplacer le QR" : "Téléverser le QR"}
                </button>
              </form>
              {hasUpload ? (
                <form action={handleQrDelete} className="mt-2">
                  <input type="hidden" name="operator" value={operator.slug} />
                  <button type="submit" className={adminGhostButtonClass}>
                    Supprimer le QR
                  </button>
                </form>
              ) : null}
            </div>
          );
        })}
      </div>
    </AdminPanel>
  );
}

function PaymentToggle({
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
      className="flex w-full items-center justify-between gap-4 border border-burgundy/15 bg-white px-4 py-3 text-left"
    >
      <span>
        <span className="block font-heading text-sm font-bold text-burgundy">{label}</span>
        <span className="block text-xs text-[#2C2424]/60">{description}</span>
      </span>
      <span
        className={cn(
          "relative h-6 w-11 shrink-0 rounded-full transition-colors",
          checked ? "bg-burgundy" : "bg-burgundy/20",
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

function QrPreview({ src, label }: { src: string; label: string }) {
  if (!src) {
    return (
      <div className="mt-3 flex aspect-square items-center justify-center border border-dashed border-burgundy/20 bg-white text-center text-xs text-[#2C2424]/50">
        Aucun QR {label}
      </div>
    );
  }

  return (
    <div className="mt-3 border border-burgundy/10 bg-white p-3">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={src}
        alt={`QR code ${label}`}
        className="mx-auto size-36 object-contain"
      />
    </div>
  );
}
