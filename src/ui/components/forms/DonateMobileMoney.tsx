"use client";

import { useState } from "react";
import { Check, Copy } from "lucide-react";
import { merchantDisplayName } from "@/lib/paymentConfig";
import type { MobileMoneyOperatorId, PublicMobileMoneyOperator } from "@/types";
import { formatFcfa } from "@/utils/formatters/currency";
import { cn } from "@/utils/cn";
import { Button } from "@/ui/design-system/button";

interface DonateMobileMoneyProps {
  amountFcfa: number;
  summary: string;
  operators: PublicMobileMoneyOperator[];
}

export function DonateMobileMoney({
  amountFcfa,
  summary,
  operators,
}: DonateMobileMoneyProps) {
  const [operatorId, setOperatorId] = useState<MobileMoneyOperatorId>(
    operators[0]?.id ?? "amana",
  );
  const [senderNumber, setSenderNumber] = useState("");
  const [copied, setCopied] = useState(false);

  const account =
    operators.find((item) => item.id === operatorId) ?? operators[0];

  if (!account) {
    return null;
  }

  async function copyMerchantNumber() {
    const value = account.phone.replace(/\s/g, "");
    if (!value) {
      return;
    }
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
        de {merchantDisplayName()}.
      </p>

      <div className="grid grid-cols-3 gap-2" role="tablist" aria-label="Opérateur Mobile Money">
        {operators.map((item) => {
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
              {item.label}
            </button>
          );
        })}
      </div>

      <div className="rounded-2xl bg-white p-4 ring-1 ring-violet-100">
        <div className="mx-auto flex max-w-[220px] flex-col items-center">
          {account.qrUrl ? (
            <div className="rounded-2xl bg-white p-3 shadow-inner ring-1 ring-slate-100">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={account.qrUrl}
                alt={`QR Code marchand ${account.label}`}
                width={180}
                height={180}
                className="size-[160px] object-contain sm:size-[180px]"
              />
            </div>
          ) : (
            <div className="flex size-[160px] items-center justify-center rounded-2xl bg-slate-50 text-center font-sans text-xs text-slate-500 sm:size-[180px]">
              QR {account.label} à venir
            </div>
          )}
          <p className="mt-2 font-heading text-xs font-bold uppercase tracking-widest text-violet-700">
            QR {account.label}
          </p>
        </div>

        <div className="mt-4 space-y-1 text-center">
          <p className="font-heading text-lg font-extrabold tracking-tight text-slate-800">
            {account.phone || "Numéro marchand à confirmer"}
          </p>
          <p className="font-sans text-sm text-slate-600">{merchantDisplayName()}</p>
        </div>

        <Button
          variant="secondary"
          className="mt-4 w-full"
          onClick={copyMerchantNumber}
          disabled={!account.phone}
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

        <label className="mt-4 block">
          <span className="font-heading text-sm font-bold text-slate-800">
            Votre numéro d&apos;expéditeur
          </span>
          <input
            type="tel"
            inputMode="tel"
            value={senderNumber}
            onChange={(event) => setSenderNumber(event.target.value)}
            placeholder="Ex. +227 90 00 00 00"
            className="mt-2 w-full rounded-xl border border-slate-200 px-4 py-3 font-sans text-slate-800 outline-none ring-violet-700 placeholder:text-slate-400 focus:ring-2"
          />
        </label>

        <p className="mt-3 text-center font-sans text-xs text-slate-500">
          Montant à envoyer : {formatFcfa(amountFcfa)}
        </p>
      </div>
    </div>
  );
}
