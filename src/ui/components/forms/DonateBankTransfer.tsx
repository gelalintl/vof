"use client";

import { useState } from "react";
import { Check, Copy } from "lucide-react";
import { formatMessage } from "@/i18n/getDictionary";
import type { PublicBankTransfer } from "@/types";
import { Button } from "@/ui/design-system/button";
import { useDonateFlowCopy } from "./useDonateFlowCopy";

interface DonateBankTransferProps {
  bank: PublicBankTransfer;
  summary: string;
  compact?: boolean;
}

async function copyText(value: string) {
  try {
    await navigator.clipboard.writeText(value);
  } catch {
    const textarea = document.createElement("textarea");
    textarea.value = value;
    textarea.setAttribute("readonly", "");
    textarea.style.position = "absolute";
    textarea.style.left = "-9999px";
    document.body.appendChild(textarea);
    textarea.select();
    document.execCommand("copy");
    document.body.removeChild(textarea);
  }
}

export function DonateBankTransfer({ bank, summary, compact = false }: DonateBankTransferProps) {
  const { t } = useDonateFlowCopy();
  const [copied, setCopied] = useState(false);
  const iban = bank.iban.replace(/\s+/g, " ").trim();

  async function copyIban() {
    if (!iban) {
      return;
    }
    await copyText(iban.replace(/\s/g, ""));
    setCopied(true);
    window.setTimeout(() => setCopied(false), 2000);
  }

  return (
    <div className="overflow-hidden rounded-2xl border border-violet-100 bg-white shadow-sm">
      <div className="bg-gradient-to-r from-violet-700 to-sky-600 px-4 py-3">
        <p className="font-heading text-[11px] font-bold uppercase tracking-[0.2em] text-white/80">
          {t("bankTitle")}
        </p>
        <p className="mt-1 font-heading text-sm font-bold text-white">
          {t("bankOfficial")}
        </p>
      </div>

      <div className={compact ? "space-y-3 p-3" : "space-y-4 p-4"}>
        {compact ? null : (
        <p className="font-sans text-sm leading-relaxed text-slate-700">
          {formatMessage(t("bankIntro"), { summary })}
        </p>
        )}

        <dl className="divide-y divide-slate-100 rounded-2xl bg-slate-50">
          <BankRow label={t("bankName")} value={bank.bankName} />
          <BankRow label={t("accountHolder")} value={bank.accountName} />
          <BankRow label="IBAN" value={iban} mono />
          <BankRow label="SWIFT / BIC" value={bank.swift} mono />
          {bank.ribCode ? <BankRow label={t("ribKey")} value={bank.ribCode} mono /> : null}
        </dl>

        <Button
          variant="secondary"
          className="w-full"
          onClick={copyIban}
          disabled={!iban}
          aria-live="polite"
        >
          {copied ? (
            <>
              <Check className="size-4" />
              {t("ibanCopied")}
            </>
          ) : (
            <>
              <Copy className="size-4" />
              {t("copyIban")}
            </>
          )}
        </Button>
      </div>
    </div>
  );
}

function BankRow({
  label,
  value,
  mono = false,
}: {
  label: string;
  value: string;
  mono?: boolean;
}) {
  return (
    <div className="flex flex-col gap-0.5 px-4 py-3 sm:flex-row sm:items-center sm:justify-between">
      <dt className="font-heading text-xs font-bold uppercase tracking-widest text-violet-700">
        {label}
      </dt>
      <dd
        className={
          mono
            ? "font-mono text-sm tracking-wide text-slate-800"
            : "font-sans text-sm text-slate-800"
        }
      >
        {value || "—"}
      </dd>
    </div>
  );
}
