import { mobileMoneyAccounts, ribDetails, siteConfig } from "@/config/site";
import {
  emptyPaymentSettings,
  isSettingEnabled,
  type PaymentSettingKey,
} from "@/lib/siteSettingsKeys";
import type {
  MobileMoneyOperatorId,
  PublicMobileMoneyOperator,
  PublicPaymentConfig,
} from "@/types";

const OPERATOR_META: {
  id: MobileMoneyOperatorId;
  label: string;
  enabledKey: PaymentSettingKey;
  qrKey: PaymentSettingKey;
  phoneKey: PaymentSettingKey;
  fallbackId: "mynita" | "amana" | "wave";
}[] = [
  {
    id: "amana",
    label: "Amana",
    enabledKey: "payment_amana_enabled",
    qrKey: "payment_amana_qr",
    phoneKey: "payment_amana_phone",
    fallbackId: "amana",
  },
  {
    id: "nita",
    label: "MyNita",
    enabledKey: "payment_nita_enabled",
    qrKey: "payment_nita_qr",
    phoneKey: "payment_nita_phone",
    fallbackId: "mynita",
  },
  {
    id: "wave",
    label: "Wave",
    enabledKey: "payment_wave_enabled",
    qrKey: "payment_wave_qr",
    phoneKey: "payment_wave_phone",
    fallbackId: "wave",
  },
];

function fallbackAccount(id: "mynita" | "amana" | "wave") {
  return mobileMoneyAccounts.find((account) => account.id === id);
}

export function defaultPaymentSettings(): Record<PaymentSettingKey, string> {
  const defaults = emptyPaymentSettings();

  for (const operator of OPERATOR_META) {
    const account = fallbackAccount(operator.fallbackId);
    defaults[operator.phoneKey] = account?.number ?? "";
    defaults[operator.qrKey] = account?.qrAsset ?? "";
  }

  defaults.bank_name = ribDetails.bankName;
  defaults.bank_account_name = ribDetails.accountName;
  defaults.bank_iban = ribDetails.iban;
  defaults.bank_swift = ribDetails.bic;
  defaults.bank_rib_code = "";

  return defaults;
}

export function mergePaymentSettings(
  map: Record<string, string>,
): Record<PaymentSettingKey, string> {
  const merged = defaultPaymentSettings();

  for (const key of Object.keys(merged) as PaymentSettingKey[]) {
    if (Object.prototype.hasOwnProperty.call(map, key)) {
      merged[key] = map[key];
    }
  }

  return merged;
}

function operatorFromSettings(
  settings: Record<PaymentSettingKey, string>,
  meta: (typeof OPERATOR_META)[number],
): PublicMobileMoneyOperator {
  const account = fallbackAccount(meta.fallbackId);
  const qrUrl = settings[meta.qrKey].trim() || account?.qrAsset || "";
  const phone = settings[meta.phoneKey].trim() || account?.number || "";

  return {
    id: meta.id,
    label: meta.label,
    enabled: isSettingEnabled(settings[meta.enabledKey]),
    qrUrl,
    phone,
  };
}

export function paymentConfigFromSettings(
  settings: Record<PaymentSettingKey, string>,
): PublicPaymentConfig {
  return {
    operators: OPERATOR_META.map((meta) => operatorFromSettings(settings, meta)),
    cardEnabled: isSettingEnabled(settings.payment_card_enabled),
    bank: {
      enabled: isSettingEnabled(settings.payment_bank_enabled),
      bankName: settings.bank_name.trim() || ribDetails.bankName,
      accountName: settings.bank_account_name.trim() || ribDetails.accountName,
      iban: settings.bank_iban.trim() || ribDetails.iban,
      swift: settings.bank_swift.trim() || ribDetails.bic,
      ribCode: settings.bank_rib_code.trim(),
    },
  };
}

export function defaultPublicPaymentConfig(): PublicPaymentConfig {
  return paymentConfigFromSettings(defaultPaymentSettings());
}

export function merchantDisplayName() {
  return siteConfig.legalName;
}

export function enabledOperators(config: PublicPaymentConfig) {
  return config.operators.filter((operator) => operator.enabled);
}

export function hasMobileMoney(config: PublicPaymentConfig) {
  return enabledOperators(config).length > 0;
}
