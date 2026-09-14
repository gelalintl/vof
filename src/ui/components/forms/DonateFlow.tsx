"use client";

import { useMemo, useState } from "react";
import { ArrowLeft, Building2, CreditCard, Smartphone } from "lucide-react";
import { donationRecurrenceLabels } from "@/config/forms";
import { donationOptions, ribDetails } from "@/config/site";
import type {
  DonationOption,
  DonationRecurrence,
  PaymentMethod,
} from "@/types";
import { formatFcfa } from "@/utils/formatters/currency";
import { cn } from "@/utils/cn";
import { Button } from "@/ui/design-system/button";
import { DonateCardPayment } from "./DonateCardPayment";
import { DonateMobileMoney } from "./DonateMobileMoney";

const paymentMethods: {
  id: PaymentMethod;
  label: string;
  description: string;
  icon: typeof Smartphone;
}[] = [
  {
    id: "mobile_money",
    label: "Mobile Money",
    description: "MyNita, Amana, Wave",
    icon: Smartphone,
  },
  {
    id: "card",
    label: "Carte bancaire",
    description: "Visa, Mastercard",
    icon: CreditCard,
  },
  {
    id: "rib",
    label: "Virement RIB",
    description: "Transfert bancaire",
    icon: Building2,
  },
];

const recurrences: DonationRecurrence[] = [
  "once",
  "monthly",
  "quarterly",
  "yearly",
];

interface DonateFlowProps {
  layout?: "modal" | "page";
}

export function DonateFlow({ layout = "modal" }: DonateFlowProps) {
  const [step, setStep] = useState<1 | 2>(1);
  const [selectedId, setSelectedId] = useState(donationOptions[2]?.id ?? "10000");
  const [customAmount, setCustomAmount] = useState("");
  const [recurrence, setRecurrence] = useState<DonationRecurrence>("once");
  const [method, setMethod] = useState<PaymentMethod>("mobile_money");

  const selectedOption = donationOptions.find((option) => option.id === selectedId);

  const amountFcfa = useMemo(() => {
    if (selectedOption?.isCustom) {
      const parsed = Number.parseInt(customAmount.replace(/\s/g, ""), 10);
      return Number.isFinite(parsed) ? parsed : 0;
    }
    return selectedOption?.amountFcfa ?? 0;
  }, [customAmount, selectedOption]);

  const canContinue = amountFcfa > 0;

  return (
    <div className={cn(layout === "page" && "space-y-6")}>
      {step === 1 ? (
        <div className="space-y-4">
          <p className="font-heading text-xs font-bold uppercase tracking-widest text-violet-700">
            Étape 1 sur 2 · Montant (FCFA)
          </p>
          <div
            className={cn(
              "grid gap-2",
              layout === "page" ? "grid-cols-2 sm:grid-cols-3" : "grid-cols-2",
            )}
          >
            {donationOptions.map((option) => (
              <AmountChoice
                key={option.id}
                option={option}
                selected={selectedId === option.id}
                onSelect={setSelectedId}
              />
            ))}
          </div>
          {selectedOption?.isCustom ? (
            <label className="block">
              <span className="font-heading text-sm font-bold text-slate-800">
                Montant personnalisé (FCFA)
              </span>
              <input
                type="number"
                min={500}
                step={500}
                inputMode="numeric"
                value={customAmount}
                onChange={(event) => setCustomAmount(event.target.value)}
                placeholder="Ex. 15000"
                className="mt-2 w-full rounded-xl border border-slate-200 px-4 py-3 font-sans text-slate-800 outline-none ring-violet-700 focus:ring-2"
              />
            </label>
          ) : null}

          <fieldset>
            <legend className="font-heading text-sm font-bold text-slate-800">
              Récurrence
            </legend>
            <div className="mt-2 grid grid-cols-2 gap-2">
              {recurrences.map((item) => (
                <button
                  key={item}
                  type="button"
                  onClick={() => setRecurrence(item)}
                  className={cn(
                    "rounded-full px-3 py-2 font-heading text-sm font-bold tracking-tight",
                    recurrence === item
                      ? "bg-violet-700 text-white"
                      : "bg-slate-50 text-slate-800 ring-1 ring-slate-200 hover:ring-sky-600",
                  )}
                >
                  {donationRecurrenceLabels[item]}
                </button>
              ))}
            </div>
          </fieldset>

          <Button
            variant="accent"
            className="w-full"
            disabled={!canContinue}
            onClick={() => setStep(2)}
          >
            Continuer
          </Button>
        </div>
      ) : (
        <div className="space-y-4">
          <button
            type="button"
            onClick={() => setStep(1)}
            className="inline-flex items-center gap-1 font-heading text-sm font-bold text-sky-600"
          >
            <ArrowLeft className="size-4" />
            Modifier le montant
          </button>
          <p className="font-heading text-xs font-bold uppercase tracking-widest text-violet-700">
            Étape 2 sur 2 · Paiement
          </p>
          <p className="font-sans text-sm text-slate-600">
            {formatFcfa(amountFcfa)} · {donationRecurrenceLabels[recurrence].toLowerCase()}
          </p>
          <div className="grid gap-2">
            {paymentMethods.map((item) => {
              const Icon = item.icon;
              const selected = method === item.id;
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => setMethod(item.id)}
                  className={cn(
                    "flex items-center gap-3 rounded-2xl border px-4 py-3 text-left transition-colors",
                    selected
                      ? "border-violet-700 bg-violet-50"
                      : "border-slate-200 hover:border-sky-600",
                  )}
                >
                  <Icon className={cn("size-5", selected ? "text-violet-700" : "text-sky-600")} />
                  <span>
                    <span className="block font-heading text-sm font-bold text-slate-800">
                      {item.label}
                    </span>
                    <span className="block font-sans text-xs text-slate-600">
                      {item.description}
                    </span>
                  </span>
                </button>
              );
            })}
          </div>
          <PaymentDetails
            method={method}
            amountFcfa={amountFcfa}
            recurrence={recurrence}
          />
        </div>
      )}
    </div>
  );
}

function AmountChoice({
  option,
  selected,
  onSelect,
}: {
  option: DonationOption;
  selected: boolean;
  onSelect: (id: string) => void;
}) {
  return (
    <button
      type="button"
      onClick={() => onSelect(option.id)}
      className={cn(
        "rounded-2xl border px-3 py-3 text-left transition-colors",
        selected
          ? "border-amber-500 bg-amber-50"
          : "border-slate-200 hover:border-violet-700",
      )}
    >
      <span className="block font-heading text-sm font-extrabold text-slate-800">
        {option.label}
      </span>
      {option.description ? (
        <span className="mt-0.5 block font-sans text-xs text-slate-600">
          {option.description}
        </span>
      ) : null}
    </button>
  );
}

function PaymentDetails({
  method,
  amountFcfa,
  recurrence,
}: {
  method: PaymentMethod;
  amountFcfa: number;
  recurrence: DonationRecurrence;
}) {
  const summary = `${formatFcfa(amountFcfa)} (${donationRecurrenceLabels[recurrence].toLowerCase()})`;

  if (method === "mobile_money") {
    return <DonateMobileMoney amountFcfa={amountFcfa} summary={summary} />;
  }

  if (method === "card") {
    return <DonateCardPayment amountFcfa={amountFcfa} />;
  }

  return (
    <div className="rounded-2xl bg-slate-50 p-4">
      <p className="font-sans text-sm leading-relaxed text-slate-800">
        Effectuez un virement de <strong>{summary}</strong> avec les
        coordonnées suivantes :
      </p>
      <dl className="mt-3 space-y-1 font-sans text-sm text-slate-800">
        <div>
          <dt className="inline font-heading font-bold text-violet-700">Banque : </dt>
          <dd className="inline">{ribDetails.bankName}</dd>
        </div>
        <div>
          <dt className="inline font-heading font-bold text-violet-700">Titulaire : </dt>
          <dd className="inline">{ribDetails.accountName}</dd>
        </div>
        <div>
          <dt className="inline font-heading font-bold text-violet-700">RIB / IBAN : </dt>
          <dd className="inline">{ribDetails.iban}</dd>
        </div>
        <div>
          <dt className="inline font-heading font-bold text-violet-700">BIC : </dt>
          <dd className="inline">{ribDetails.bic}</dd>
        </div>
      </dl>
    </div>
  );
}
