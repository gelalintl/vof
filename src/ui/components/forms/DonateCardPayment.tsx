"use client";

import { useMemo, useState, type FormEvent } from "react";
import { Lock } from "lucide-react";
import { formatFcfa } from "@/utils/formatters/currency";
import { cn } from "@/utils/cn";
import { Button } from "@/ui/design-system/button";

type CardBrand = "visa" | "mastercard" | "unknown";

interface DonateCardPaymentProps {
  amountFcfa: number;
}

function digitsOnly(value: string, max: number) {
  return value.replace(/\D/g, "").slice(0, max);
}

function formatCardNumber(value: string) {
  return digitsOnly(value, 16)
    .replace(/(\d{4})(?=\d)/g, "$1 ")
    .trim();
}

function formatExpiry(value: string) {
  const digits = digitsOnly(value, 4);
  if (digits.length <= 2) {
    return digits;
  }
  return `${digits.slice(0, 2)}/${digits.slice(2)}`;
}

function detectBrand(digits: string): CardBrand {
  if (digits.startsWith("4")) {
    return "visa";
  }
  const prefix2 = Number.parseInt(digits.slice(0, 2), 10);
  const prefix4 = Number.parseInt(digits.slice(0, 4), 10);
  if (
    (prefix2 >= 51 && prefix2 <= 55) ||
    (prefix4 >= 2221 && prefix4 <= 2720)
  ) {
    return "mastercard";
  }
  return "unknown";
}

function displayCardNumber(digits: string) {
  const padded = digits.padEnd(16, "•");
  return `${padded.slice(0, 4)} ${padded.slice(4, 8)} ${padded.slice(8, 12)} ${padded.slice(12, 16)}`;
}

function isValidExpiry(value: string) {
  const match = /^(\d{2})\/(\d{2})$/.exec(value);
  if (!match) {
    return false;
  }
  const month = Number.parseInt(match[1], 10);
  return month >= 1 && month <= 12;
}

export function DonateCardPayment({ amountFcfa }: DonateCardPaymentProps) {
  const [cardNumber, setCardNumber] = useState("");
  const [holderName, setHolderName] = useState("");
  const [expiry, setExpiry] = useState("");
  const [cvc, setCvc] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const digits = digitsOnly(cardNumber, 16);
  const brand = detectBrand(digits);
  const canPay =
    digits.length === 16 &&
    holderName.trim().length >= 2 &&
    isValidExpiry(expiry) &&
    cvc.length === 3 &&
    amountFcfa > 0;

  const payLabel = useMemo(
    () => `Payer ${formatFcfa(amountFcfa)} en toute sécurité`,
    [amountFcfa],
  );

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!canPay) {
      return;
    }
    setSubmitted(true);
  }

  if (submitted) {
    return (
      <div className="rounded-2xl bg-slate-50 p-4">
        <p className="font-heading text-sm font-bold text-violet-700">
          Don enregistré
        </p>
        <p className="mt-2 font-sans text-sm leading-relaxed text-slate-800">
          Merci. Votre don de <strong>{formatFcfa(amountFcfa)}</strong> a été
          préparé. Le terminal de paiement sécurisé sera branché sur cette
          étape. Aucune donnée de carte n&apos;est transmise pour le moment.
        </p>
      </div>
    );
  }

  return (
    <form className="space-y-4" onSubmit={handleSubmit} autoComplete="off">
      <VirtualCard
        number={displayCardNumber(digits)}
        holder={holderName.trim() || "NOM DU TITULAIRE"}
        expiry={expiry || "MM/AA"}
        brand={brand}
        placeholderHolder={!holderName.trim()}
        placeholderExpiry={!expiry}
      />

      <div className="space-y-3 rounded-2xl bg-slate-50 p-4">
        <label className="block">
          <span className="font-heading text-sm font-bold text-slate-800">
            Numéro de carte
          </span>
          <input
            type="text"
            inputMode="numeric"
            autoComplete="cc-number"
            placeholder="•••• •••• •••• ••••"
            value={cardNumber}
            onChange={(event) => setCardNumber(formatCardNumber(event.target.value))}
            className="mt-2 w-full rounded-xl border border-slate-200 bg-white px-4 py-3 font-heading tracking-[0.18em] text-slate-800 outline-none ring-violet-700 placeholder:tracking-normal placeholder:text-slate-400 focus:ring-2"
          />
        </label>

        <label className="block">
          <span className="font-heading text-sm font-bold text-slate-800">
            Nom du titulaire
          </span>
          <input
            type="text"
            autoComplete="cc-name"
            placeholder="Prénom NOM"
            value={holderName}
            onChange={(event) => setHolderName(event.target.value.slice(0, 32))}
            className="mt-2 w-full rounded-xl border border-slate-200 bg-white px-4 py-3 font-sans uppercase text-slate-800 outline-none ring-violet-700 placeholder:normal-case placeholder:text-slate-400 focus:ring-2"
          />
        </label>

        <div className="grid grid-cols-2 gap-3">
          <label className="block">
            <span className="font-heading text-sm font-bold text-slate-800">
              Expiration
            </span>
            <input
              type="text"
              inputMode="numeric"
              autoComplete="cc-exp"
              placeholder="MM/AA"
              value={expiry}
              onChange={(event) => setExpiry(formatExpiry(event.target.value))}
              className="mt-2 w-full rounded-xl border border-slate-200 bg-white px-4 py-3 font-heading tracking-widest text-slate-800 outline-none ring-violet-700 placeholder:tracking-normal placeholder:text-slate-400 focus:ring-2"
            />
          </label>
          <label className="block">
            <span className="font-heading text-sm font-bold text-slate-800">
              CVC
            </span>
            <input
              type="password"
              inputMode="numeric"
              autoComplete="cc-csc"
              placeholder="123"
              maxLength={3}
              value={cvc}
              onChange={(event) => setCvc(digitsOnly(event.target.value, 3))}
              className="mt-2 w-full rounded-xl border border-slate-200 bg-white px-4 py-3 font-heading tracking-widest text-slate-800 outline-none ring-violet-700 placeholder:tracking-normal placeholder:text-slate-400 focus:ring-2"
            />
          </label>
        </div>

        <Button
          variant="accent"
          className="w-full"
          disabled={!canPay}
          type="submit"
        >
          <Lock className="size-4" />
          {payLabel}
        </Button>
      </div>
    </form>
  );
}

function VirtualCard({
  number,
  holder,
  expiry,
  brand,
  placeholderHolder,
  placeholderExpiry,
}: {
  number: string;
  holder: string;
  expiry: string;
  brand: CardBrand;
  placeholderHolder: boolean;
  placeholderExpiry: boolean;
}) {
  return (
    <div
      className="relative aspect-[1.586] w-full overflow-hidden rounded-2xl p-5 text-white shadow-xl sm:p-6"
      style={{
        background:
          "linear-gradient(135deg, #6D28D9 0%, #7C3AED 38%, #5B21B6 72%, #4C1D95 100%)",
      }}
      aria-hidden="true"
    >
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(115deg,rgba(255,255,255,0.28)_0%,rgba(255,255,255,0.04)_38%,transparent_52%,rgba(255,255,255,0.12)_100%)]" />
      <div className="pointer-events-none absolute -top-10 -right-8 size-40 rounded-full bg-white/10 blur-2xl" />
      <div className="pointer-events-none absolute -bottom-16 -left-10 size-48 rounded-full bg-sky-400/20 blur-2xl" />
      <div className="pointer-events-none absolute top-0 left-1/3 h-full w-16 rotate-12 bg-gradient-to-r from-transparent via-white/25 to-transparent" />

      <div className="relative flex h-full flex-col justify-between">
        <div className="flex items-start justify-between">
          <Chip />
          <CardBrandMark brand={brand} />
        </div>

        <p className="font-heading text-lg font-bold tracking-[0.22em] sm:text-xl">
          {number}
        </p>

        <div className="flex items-end justify-between gap-3">
          <div className="min-w-0">
            <p className="font-heading text-[10px] font-bold uppercase tracking-widest text-white/70">
              Titulaire
            </p>
            <p
              className={cn(
                "truncate font-heading text-sm font-bold uppercase tracking-wide",
                placeholderHolder && "text-white/55",
              )}
            >
              {holder}
            </p>
          </div>
          <div className="shrink-0 text-right">
            <p className="font-heading text-[10px] font-bold uppercase tracking-widest text-white/70">
              Expire
            </p>
            <p
              className={cn(
                "font-heading text-sm font-bold tracking-widest",
                placeholderExpiry && "text-white/55",
              )}
            >
              {expiry}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

function Chip() {
  return (
    <div className="flex items-center gap-3">
      <div
        className="h-8 w-11 rounded-md shadow-inner ring-1 ring-white/30"
        style={{
          background:
            "linear-gradient(135deg, #FDE68A 0%, #F59E0B 45%, #D97706 100%)",
        }}
      >
        <div className="mt-1.5 h-px bg-amber-700/30" />
        <div className="mt-1.5 h-px bg-amber-700/30" />
        <div className="mt-1.5 h-px bg-amber-700/30" />
      </div>
      <svg viewBox="0 0 24 24" className="size-6 text-white/80" aria-hidden>
        <path
          fill="currentColor"
          d="M12 4c.6 2.2 2.2 3.8 4.4 4.4C14.2 9 12.6 10.6 12 12.8 11.4 10.6 9.8 9 7.6 8.4 9.8 7.8 11.4 6.2 12 4Zm0 6.2c.4 1.5 1.5 2.6 3 3-1.5.4-2.6 1.5-3 3-.4-1.5-1.5-2.6-3-3 1.5-.4 2.6-1.5 3-3Z"
        />
      </svg>
    </div>
  );
}

function CardBrandMark({ brand }: { brand: CardBrand }) {
  if (brand === "mastercard") {
    return (
      <div className="flex items-center" aria-label="Mastercard">
        <span className="size-8 rounded-full bg-[#EB001B]" />
        <span className="-ml-3 size-8 rounded-full bg-[#F79E1B]/90" />
      </div>
    );
  }

  if (brand === "visa") {
    return (
      <span className="font-heading text-xl font-extrabold italic tracking-tight">
        VISA
      </span>
    );
  }

  return (
    <span className="font-heading text-[10px] font-bold uppercase tracking-widest text-white/70">
      Visa / Mastercard
    </span>
  );
}
