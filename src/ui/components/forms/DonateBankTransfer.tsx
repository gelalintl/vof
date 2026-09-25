"use client";

import { useState } from "react";
import { Check, Copy } from "lucide-react";
import type { PublicBankTransfer } from "@/types";
import { Button } from "@/ui/design-system/button";

interface DonateBankTransferProps {
  bank: PublicBankTransfer;
  summary: string;
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

export function DonateBankTransfer({ bank, summary }: DonateBankTransferProps) {
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
          Virement bancaire
        </p>
        <p className="mt-1 font-heading text-sm font-bold text-white">
          Coordonnées officielles VOF
        </p>
      </div>

      <div className="space-y-4 p-4">
        <p className="font-sans text-sm leading-relaxed text-slate-700">
          Effectuez un virement de <strong>{summary}</strong> vers le compte
          ci-dessous, puis conservez votre reçu.
        </p>

        <dl className="divide-y divide-slate-100 rounded-2xl bg-slate-50">
          <BankRow label="Banque" value={bank.bankName} />
          <BankRow label="Titulaire" value={bank.accountName} />
          <BankRow label="IBAN" value={iban} mono />
          <BankRow label="SWIFT / BIC" value={bank.swift} mono />
          {bank.ribCode ? <BankRow label="RIB / clé" value={bank.ribCode} mono /> : null}
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
              IBAN copié
            </>
          ) : (
            <>
              <Copy className="size-4" />
              Copier l&apos;IBAN
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
