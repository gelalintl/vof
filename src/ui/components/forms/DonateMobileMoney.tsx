"use client";

import { useState } from "react";
import { Check, Copy } from "lucide-react";
import { mobileMoneyAccounts, siteConfig } from "@/config/site";
import type { MobileMoneyAccount } from "@/types";
import { formatFcfa } from "@/utils/formatters/currency";
import { cn } from "@/utils/cn";
import { Button } from "@/ui/design-system/button";

interface DonateMobileMoneyProps {
  amountFcfa: number;
  summary: string;
}

export function DonateMobileMoney({ amountFcfa, summary }: DonateMobileMoneyProps) {
  const [operatorId, setOperatorId] = useState<MobileMoneyAccount["id"]>(
    mobileMoneyAccounts[0]?.id ?? "mynita",
  );
  const [copied, setCopied] = useState(false);

  const account =
    mobileMoneyAccounts.find((item) => item.id === operatorId) ??
    mobileMoneyAccounts[0];

  if (!account) {
    return null;
  }

  async function copyMerchantNumber() {
    const value = account.number.replace(/\s/g, "");
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
    setCopied(true);
    window.setTimeout(() => setCopied(false), 2000);
  }

  return (
    <div className="space-y-4 rounded-2xl bg-slate-50 p-4">
      <p className="font-sans text-sm leading-relaxed text-slate-800">
        Envoyez <strong>{summary}</strong> via Mobile Money. Choisissez
        l&apos;opérateur, scannez le QR marchand ou copiez le numéro officiel
        de {siteConfig.legalName}.
      </p>

      <div className="grid grid-cols-3 gap-2" role="tablist" aria-label="Opérateur Mobile Money">
        {mobileMoneyAccounts.map((item) => {
          const selected = item.id === operatorId;
          return (
            <button
              key={item.id}
              type="button"
              role="tab"
              aria-selected={selected}
              onClick={() => {
                setOperatorId(item.id);
                setCopied(false);
              }}
              className={cn(
                "rounded-full px-2 py-2 font-heading text-xs font-bold tracking-tight sm:text-sm",
                selected
                  ? "bg-violet-700 text-white shadow-sm"
                  : "bg-white text-slate-800 ring-1 ring-slate-200 hover:ring-sky-600",
              )}
            >
              {item.operator}
            </button>
          );
        })}
      </div>

      <div className="rounded-2xl bg-white p-4 ring-1 ring-violet-100">
        <div className="mx-auto flex max-w-[220px] flex-col items-center">
          <div className="rounded-2xl bg-white p-3 shadow-inner ring-1 ring-slate-100">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={account.qrAsset}
              alt={`QR Code marchand ${account.operator}`}
              width={180}
              height={180}
              className="size-[160px] sm:size-[180px]"
            />
          </div>
          <p className="mt-2 font-heading text-xs font-bold uppercase tracking-widest text-violet-700">
            QR {account.operator}
          </p>
        </div>

        <div className="mt-4 space-y-1 text-center">
          <p className="font-heading text-lg font-extrabold tracking-tight text-slate-800">
            {account.number}
          </p>
          <p className="font-sans text-sm text-slate-600">{account.name}</p>
        </div>

        <Button
          variant="secondary"
          className="mt-4 w-full"
          onClick={copyMerchantNumber}
          aria-live="polite"
        >
          {copied ? (
            <>
              <Check className="size-4" />
              Numéro copié
            </>
          ) : (
            <>
              <Copy className="size-4" />
              Copier le numéro
            </>
          )}
        </Button>

        <p className="mt-3 text-center font-sans text-xs text-slate-500">
          Montant à envoyer : {formatFcfa(amountFcfa)}
        </p>
      </div>
    </div>
  );
}
