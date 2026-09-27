"use client";

import { useState } from "react";
import {
  deletePaymentQr,
  updateSiteSettings,
  uploadPaymentQr,
} from "@/app/admin/actions";
import { isSettingEnabled, type PaymentSettingKey } from "@/lib/siteSettingsKeys";
import { cn } from "@/utils/cn";
import { AdminSubmitButton } from "./AdminSubmitButton";
import { AdminLabel, AdminPanel } from "./AdminPageHeader";
import { adminFieldClass, adminFileClass, adminGhostButtonClass } from "./adminStyles";
import { notifyAdminAction } from "./notifyAdminAction";

interface PaymentSettingsFormProps {
  values: Record<PaymentSettingKey, string>;
}

const operators = [
  {
    slug: "amana",
    label: "Amana",
    enabledKey: "payment_amana_enabled",
    phoneKey: "payment_amana_phone",
    qrKey: "payment_amana_qr",
  },
  {
    slug: "nita",
    label: "MyNita",
    enabledKey: "payment_nita_enabled",
    phoneKey: "payment_nita_phone",
    qrKey: "payment_nita_qr",
  },
  {
    slug: "wave",
    label: "Wave",
    enabledKey: "payment_wave_enabled",
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

  const handleSubmit = notifyAdminAction(async (formData) => {
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
  }, "Configuration des paiements enregistrée.");

  const handleQrUpload = notifyAdminAction(uploadPaymentQr, "QR code téléversé.");
  const handleQrDelete = notifyAdminAction(deletePaymentQr, "QR code retiré.");

  return (
    <AdminPanel>
      <h2 className="font-heading text-lg font-bold text-slate-900">
        Paiements & dons
      </h2>
      <p className="mt-1 text-sm text-slate-600">
        Activez les moyens visibles sur le site public. Les QR codes sont
        enregistrés dans <code className="font-mono text-xs">public/uploads</code>.
      </p>

      <div className="mt-6 space-y-8">
        <section>
          <h3 className="font-heading text-sm font-bold text-slate-900">
            Mobile Money
          </h3>
          <p className="mt-1 text-xs text-slate-500">
            Activez, renseignez le numéro marchand et téléversez le QR de chaque opérateur.
          </p>
          <div className="mt-3 grid gap-4 lg:grid-cols-3">
            {operators.map((operator) => {
              const qrSrc = values[operator.qrKey];
              const hasUpload = Boolean(qrSrc && qrSrc.startsWith("/uploads/"));

              return (
                <div
                  key={operator.slug}
                  className="border border-slate-200 bg-slate-50 p-4"
                >
                  <PaymentToggle
                    label={operator.label}
                    description={`Mobile Money ${operator.label}`}
                    checked={enabled[operator.enabledKey]}
                    onChange={(value) =>
                      setEnabled((current) => ({
                        ...current,
                        [operator.enabledKey]: value,
                      }))
                    }
                  />
                  <QrPreview src={qrSrc} label={operator.label} />
                  <label className="mt-4 block">
                    <AdminLabel>Numéro / compte marchand</AdminLabel>
                    <input
                      form="admin-payments-form"
                      name={operator.phoneKey}
                      type="text"
                      defaultValue={values[operator.phoneKey]}
                      placeholder="+227 90 00 00 00"
                      className={adminFieldClass}
                    />
                  </label>
                  <form action={handleQrUpload} className="mt-4 grid gap-3">
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
                    <AdminSubmitButton>
                      {qrSrc ? "Remplacer le QR" : "Téléverser le QR"}
                    </AdminSubmitButton>
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
        </section>

        <form id="admin-payments-form" action={handleSubmit} className="space-y-8">
        <section>
          <h3 className="font-heading text-sm font-bold text-slate-900">
            Virement bancaire
          </h3>
          <div className="mt-3 space-y-4">
            <PaymentToggle
              label="Virement bancaire"
              description="Coordonnées RIB / IBAN"
              checked={enabled.payment_bank_enabled}
              onChange={(value) =>
                setEnabled((current) => ({ ...current, payment_bank_enabled: value }))
              }
            />
            <div className="grid gap-4 sm:grid-cols-2">
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
          </div>
        </section>

        <PaymentToggle
          label="Carte bancaire"
          description="Visa / Mastercard (instructions hors-ligne)"
          checked={enabled.payment_card_enabled}
          onChange={(value) =>
            setEnabled((current) => ({ ...current, payment_card_enabled: value }))
          }
        />

        <AdminSubmitButton>Enregistrer les modifications</AdminSubmitButton>
        </form>
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

function QrPreview({ src, label }: { src: string; label: string }) {
  if (!src) {
    return (
      <div className="mt-3 flex aspect-square items-center justify-center border border-dashed border-slate-200 bg-white text-center text-xs text-slate-400">
        Aucun QR {label}
      </div>
    );
  }

  return (
    <div className="mt-3 border border-slate-100 bg-white p-3">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={src}
        alt={`QR code ${label}`}
        className="mx-auto size-36 object-contain"
      />
    </div>
  );
}
