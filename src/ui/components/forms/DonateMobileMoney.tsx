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
  operatorId?: MobileMoneyOperatorId;
  senderNumber?: string;
  onOperatorChange?: (id: MobileMoneyOperatorId) => void;
  onSenderNumberChange?: (value: string) => void;
  compact?: boolean;
}

export function DonateMobileMoney({
  amountFcfa,
  summary,
  operators,
  operatorId: controlledOperatorId,
  senderNumber: controlledSenderNumber,
  onOperatorChange,
  onSenderNumberChange,
  compact = false,
}: DonateMobileMoneyProps) {
  const [internalOperatorId, setInternalOperatorId] = useState<MobileMoneyOperatorId>(
    operators[0]?.id ?? "amana",
  );
  const [internalSenderNumber, setInternalSenderNumber] = useState("");
  const [copied, setCopied] = useState(false);
  const operatorId = controlledOperatorId ?? internalOperatorId;
  const senderNumber = controlledSenderNumber ?? internalSenderNumber;

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
    <div className={cn("rounded-2xl bg-slate-50", compact ? "space-y-3 p-3" : "space-y-4 p-4")}>
      {compact ? null : (
        <p className="font-sans text-sm leading-relaxed text-slate-800">
          Envoyez <strong>{summary}</strong> via Mobile Money. Choisissez
          l&apos;opérateur, scannez le QR marchand ou copiez le numéro officiel
          de {merchantDisplayName()}.
        </p>
      )}

      {compact && operators.length <= 1 ? null : (
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
                onOperatorChange?.(item.id);
                setInternalOperatorId(item.id);
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
      )}

      <div className={cn("rounded-2xl bg-white ring-1 ring-violet-100", compact ? "p-3" : "p-4")}>
        <div className="mx-auto flex max-w-[220px] flex-col items-center">
          {account.qrUrl ? (
            <div className="rounded-2xl bg-white p-2 shadow-inner ring-1 ring-slate-100">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={account.qrUrl}
                alt={`QR Code marchand ${account.label}`}
                width={180}
                height={180}
                className={cn(
                  "object-contain",
                  compact ? "size-[120px]" : "size-[160px] sm:size-[180px]",
                )}
              />
            </div>
          ) : (
            <div
              className={cn(
                "flex items-center justify-center rounded-2xl bg-slate-50 text-center font-sans text-xs text-slate-500",
                compact ? "size-[120px]" : "size-[160px] sm:size-[180px]",
              )}
            >
              QR {account.label} à venir
            </div>
          )}
          <p className="mt-2 font-heading text-xs font-bold uppercase tracking-widest text-violet-700">
            QR {account.label}
          </p>
        </div>

        <div className={cn("space-y-1 text-center", compact ? "mt-2" : "mt-4")}>
          <p className="font-heading text-lg font-extrabold tracking-tight text-slate-800">
            {account.phone || "Numéro marchand à confirmer"}
          </p>
          <p className="font-sans text-sm text-slate-600">{merchantDisplayName()}</p>
        </div>

        <Button
          variant="secondary"
          className={cn("w-full", compact ? "mt-3" : "mt-4")}
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

        {compact ? null : (
          <label className="mt-4 block">
            <span className="font-heading text-sm font-bold text-slate-800">
              Votre numéro d&apos;expéditeur
            </span>
            <input
              type="tel"
              inputMode="tel"
              value={senderNumber}
              onChange={(event) => {
                onSenderNumberChange?.(event.target.value);
                setInternalSenderNumber(event.target.value);
              }}
              placeholder="Ex. +227 90 00 00 00"
              className="mt-2 w-full rounded-xl border border-slate-200 px-4 py-3 font-sans text-slate-800 outline-none ring-violet-700 placeholder:text-slate-400 focus:ring-2"
            />
          </label>
        )}

        <p className="mt-3 text-center font-sans text-xs text-slate-500">
          Montant à envoyer : {formatFcfa(amountFcfa)}
        </p>
      </div>
    </div>
  );
}
