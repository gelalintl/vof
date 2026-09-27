"use client";

import { useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Building2, CheckCircle2, CreditCard, Smartphone } from "lucide-react";
import { toast } from "sonner";
import { submitDonationPromise } from "@/app/don/actions";
import { donationRecurrenceLabels, donationTypeLabels, donationTypes } from "@/config/forms";
import { donationOptions } from "@/config/site";
import {
  mapWizardPaymentMethod,
  mapWizardTypeToPromise,
} from "@/lib/donations";
import {
  defaultPublicPaymentConfig,
  enabledOperators,
} from "@/lib/paymentConfig";
import type {
  DonationOption,
  DonationRecurrence,
  DonationType,
  MobileMoneyOperatorId,
  PaymentMethod,
  PublicMobileMoneyOperator,
  PublicPaymentConfig,
  PublicProject,
} from "@/types";
import { whatsappPrefillHref } from "@/lib/siteSettingsKeys";
import { formatFcfa } from "@/utils/formatters/currency";
import { cn } from "@/utils/cn";
import { Button } from "@/ui/design-system/button";
import { DonateBankTransfer } from "./DonateBankTransfer";
import { DonateCardPayment } from "./DonateCardPayment";
import { DonateMobileMoney } from "./DonateMobileMoney";

const recurrences: DonationRecurrence[] = [
  "once",
  "monthly",
  "quarterly",
  "yearly",
];

const stepCopy = {
  1: "Le don & le montant",
  2: "Vos coordonnées",
  3: "Mode de paiement",
} as const;

type WizardStep = 1 | 2 | 3;
type PaymentChannel =
  | { kind: "operator"; id: MobileMoneyOperatorId }
  | { kind: "rib" }
  | { kind: "card" };

interface DonateFlowProps {
  layout?: "modal" | "page";
  paymentConfig?: PublicPaymentConfig;
  projects?: PublicProject[];
  initialProjectId?: string;
  whatsappHref?: string;
}

function channelKey(channel: PaymentChannel) {
  return channel.kind === "operator" ? channel.id : channel.kind;
}

function wizardChannels(config: PublicPaymentConfig): PaymentChannel[] {
  const channels: PaymentChannel[] = enabledOperators(config).map((operator) => ({
    kind: "operator",
    id: operator.id,
  }));
  if (config.bank.enabled) {
    channels.push({ kind: "rib" });
  }
  if (config.cardEnabled) {
    channels.push({ kind: "card" });
  }
  return channels;
}

function toPaymentMethod(channel: PaymentChannel): PaymentMethod {
  if (channel.kind === "rib") {
    return "rib";
  }
  if (channel.kind === "card") {
    return "card";
  }
  return "mobile_money";
}

const fieldClass =
  "mt-1.5 w-full rounded-xl border border-slate-200 px-3 py-2.5 font-sans text-sm text-slate-800 outline-none ring-violet-700 placeholder:text-slate-400 focus:ring-2";

export function DonateFlow({
  layout = "modal",
  paymentConfig = defaultPublicPaymentConfig(),
  projects = [],
  initialProjectId = "",
  whatsappHref = "",
}: DonateFlowProps) {
  const operators = useMemo(() => enabledOperators(paymentConfig), [paymentConfig]);
  const channels = useMemo(() => wizardChannels(paymentConfig), [paymentConfig]);

  const [step, setStep] = useState<WizardStep>(1);
  const [donationType, setDonationType] = useState<DonationType>("offrande");
  const [selectedId, setSelectedId] = useState(donationOptions[2]?.id ?? "10000");
  const [customAmount, setCustomAmount] = useState("");
  const [recurrence, setRecurrence] = useState<DonationRecurrence>("once");
  const [projectId, setProjectId] = useState(initialProjectId);
  const [donorName, setDonorName] = useState("");
  const [donorPhone, setDonorPhone] = useState("");
  const [donorEmail, setDonorEmail] = useState("");
  const [channel, setChannel] = useState<PaymentChannel>(
    () => channels[0] ?? { kind: "operator", id: "amana" },
  );
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const resolvedChannel = channels.some((item) => channelKey(item) === channelKey(channel))
    ? channel
    : (channels[0] ?? channel);

  const selectedOption = donationOptions.find((option) => option.id === selectedId);
  const amountFcfa = useMemo(() => {
    if (selectedOption?.isCustom) {
      const parsed = Number.parseInt(customAmount.replace(/\s/g, ""), 10);
      return Number.isFinite(parsed) ? parsed : 0;
    }
    return selectedOption?.amountFcfa ?? 0;
  }, [customAmount, selectedOption]);

  const canContinueAmount = amountFcfa > 0;
  const canContinueContact = donorPhone.replace(/\s/g, "").length >= 8;
  const typeLabel = donationTypeLabels[donationType];
  const recap = `${typeLabel} · ${formatFcfa(amountFcfa)} · ${donationRecurrenceLabels[recurrence].toLowerCase()}`;
  const selectedProject = projects.find((project) => project.id === projectId);
  const operatorId =
    resolvedChannel.kind === "operator" ? resolvedChannel.id : operators[0]?.id ?? "amana";

  async function handleSubmitPromise() {
    if (submitted || submitting || amountFcfa <= 0 || !canContinueContact) {
      return;
    }

    setSubmitting(true);
    try {
      const result = await submitDonationPromise({
        donorName,
        donorPhone,
        donorEmail,
        type: mapWizardTypeToPromise(donationType, projectId),
        amount: amountFcfa,
        paymentMethod: mapWizardPaymentMethod(toPaymentMethod(resolvedChannel), operatorId),
        projectId: projectId || null,
        notes: [
          recap,
          selectedProject ? `Projet : ${selectedProject.title}` : "Soutien général",
        ].join(" · "),
      });
      if (!result.success) {
        toast.error(result.error);
        return;
      }
      setSubmitted(true);
    } catch {
      toast.error("Impossible d’enregistrer la promesse de don.");
    } finally {
      setSubmitting(false);
    }
  }

  if (submitted) {
    return (
      <DonationSuccess amountFcfa={amountFcfa} whatsappHref={whatsappHref} />
    );
  }

  return (
    <div className="space-y-4">
      <WizardProgress step={step} />

      <AnimatePresence mode="wait">
        <motion.div
          key={step}
          initial={{ opacity: 0, x: 16 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -12 }}
          transition={{ duration: 0.2, ease: "easeOut" }}
          className="space-y-4"
        >
          {step === 1 ? (
            <StepAmount
              layout={layout}
              donationType={donationType}
              selectedId={selectedId}
              customAmount={customAmount}
              selectedOption={selectedOption}
              recurrence={recurrence}
              projectId={projectId}
              projects={projects}
              canContinue={canContinueAmount}
              onType={setDonationType}
              onAmount={setSelectedId}
              onCustomAmount={setCustomAmount}
              onRecurrence={setRecurrence}
              onProject={setProjectId}
              onNext={() => setStep(2)}
            />
          ) : null}

          {step === 2 ? (
            <StepContact
              donorName={donorName}
              donorPhone={donorPhone}
              donorEmail={donorEmail}
              canContinue={canContinueContact}
              onName={setDonorName}
              onPhone={setDonorPhone}
              onEmail={setDonorEmail}
              onBack={() => setStep(1)}
              onNext={() => setStep(3)}
            />
          ) : null}

          {step === 3 ? (
            <StepPayment
              recap={recap}
              projectTitle={selectedProject?.title}
              amountFcfa={amountFcfa}
              channels={channels}
              operators={operators}
              channel={resolvedChannel}
              paymentConfig={paymentConfig}
              donationType={donationType}
              submitting={submitting}
              onChannel={setChannel}
              onBack={() => setStep(2)}
              onConfirm={() => void handleSubmitPromise()}
            />
          ) : null}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}

function DonationSuccess({
  amountFcfa,
  whatsappHref,
}: {
  amountFcfa: number;
  whatsappHref: string;
}) {
  const receiptHref = whatsappPrefillHref(
    whatsappHref,
    `Bonjour l'église VOF, je viens d'enregistrer une promesse de don de ${formatFcfa(amountFcfa)}. Je vous envoie mon reçu / preuve de transfert.`,
  );

  return (
    <div className="space-y-4 rounded-2xl bg-violet-50 p-5 text-center">
      <CheckCircle2 className="mx-auto size-10 text-[#6d28d9]" aria-hidden />
      <h3 className="font-heading text-lg font-bold tracking-tight text-slate-900">
        Merci pour votre soutien !
      </h3>
      <p className="font-sans text-sm leading-relaxed text-slate-700">
        Votre promesse de don de <strong>{formatFcfa(amountFcfa)}</strong> a bien été
        enregistrée. Dès réception de votre transfert, la jauge sera mise à jour.
      </p>
      {receiptHref ? (
        <Button
          href={receiptHref}
          variant="accent"
          className="w-full"
          target="_blank"
          rel="noopener noreferrer"
        >
          Envoyer le reçu/preuve sur WhatsApp
        </Button>
      ) : null}
    </div>
  );
}

function WizardProgress({ step }: { step: WizardStep }) {
  return (
    <div>
      <p className="font-heading text-xs font-bold uppercase tracking-widest text-violet-700">
        Étape {step} sur 3 · {stepCopy[step]}
      </p>
      <div className="mt-2 flex gap-1.5" aria-hidden>
        {([1, 2, 3] as const).map((item) => (
          <span
            key={item}
            className={cn(
              "h-1 flex-1 rounded-full transition-colors",
              item <= step ? "bg-violet-700" : "bg-slate-200",
            )}
          />
        ))}
      </div>
    </div>
  );
}

function StepAmount({
  layout,
  donationType,
  selectedId,
  customAmount,
  selectedOption,
  recurrence,
  projectId,
  projects,
  canContinue,
  onType,
  onAmount,
  onCustomAmount,
  onRecurrence,
  onProject,
  onNext,
}: {
  layout: "modal" | "page";
  donationType: DonationType;
  selectedId: string;
  customAmount: string;
  selectedOption?: DonationOption;
  recurrence: DonationRecurrence;
  projectId: string;
  projects: PublicProject[];
  canContinue: boolean;
  onType: (type: DonationType) => void;
  onAmount: (id: string) => void;
  onCustomAmount: (value: string) => void;
  onRecurrence: (value: DonationRecurrence) => void;
  onProject: (id: string) => void;
  onNext: () => void;
}) {
  return (
    <>
      <fieldset>
        <legend className="font-heading text-sm font-bold text-slate-800">Type de don</legend>
        <div className="mt-2 flex flex-wrap gap-2">
          {donationTypes.map((type) => (
            <TypeChoice
              key={type}
              type={type}
              selected={donationType === type}
              onSelect={onType}
            />
          ))}
        </div>
      </fieldset>

      {projects.length > 0 ? (
        <label className="block">
          <span className="font-heading text-sm font-bold text-slate-800">
            Rattacher ce don à un projet
          </span>
          <select
            value={projectId}
            onChange={(event) => onProject(event.target.value)}
            className={fieldClass}
          >
            <option value="">Soutien général (aucun projet)</option>
            {projects.map((project) => (
              <option key={project.id} value={project.id}>
                {project.title}
              </option>
            ))}
          </select>
        </label>
      ) : null}

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
            onSelect={onAmount}
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
            onChange={(event) => onCustomAmount(event.target.value)}
            placeholder="Ex. 15000"
            className={fieldClass}
          />
        </label>
      ) : null}

      <fieldset>
        <legend className="font-heading text-sm font-bold text-slate-800">Récurrence</legend>
        <div className="mt-2 grid grid-cols-2 gap-2">
          {recurrences.map((item) => (
            <button
              key={item}
              type="button"
              onClick={() => onRecurrence(item)}
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

      <Button variant="accent" className="w-full" disabled={!canContinue} onClick={onNext}>
        Continuer vers mes coordonnées →
      </Button>
    </>
  );
}

function StepContact({
  donorName,
  donorPhone,
  donorEmail,
  canContinue,
  onName,
  onPhone,
  onEmail,
  onBack,
  onNext,
}: {
  donorName: string;
  donorPhone: string;
  donorEmail: string;
  canContinue: boolean;
  onName: (value: string) => void;
  onPhone: (value: string) => void;
  onEmail: (value: string) => void;
  onBack: () => void;
  onNext: () => void;
}) {
  return (
    <>
      <h3 className="font-heading text-base font-bold tracking-tight text-slate-900">
        Qui effectue ce don ?
      </h3>
      <label className="block">
        <span className="font-heading text-sm font-bold text-slate-800">Nom &amp; Prénom</span>
        <input
          type="text"
          value={donorName}
          onChange={(event) => onName(event.target.value)}
          placeholder="Laisser vide pour rester anonyme"
          className={fieldClass}
        />
      </label>
      <label className="block">
        <span className="font-heading text-sm font-bold text-slate-800">
          Téléphone / WhatsApp
        </span>
        <input
          type="tel"
          required
          value={donorPhone}
          onChange={(event) => onPhone(event.target.value)}
          placeholder="+227 90 00 00 00"
          className={fieldClass}
        />
        <span className="mt-1 block font-sans text-xs text-slate-500">
          Requis pour le suivi de votre promesse.
        </span>
      </label>
      <label className="block">
        <span className="font-heading text-sm font-bold text-slate-800">E-mail</span>
        <input
          type="email"
          value={donorEmail}
          onChange={(event) => onEmail(event.target.value)}
          placeholder="Optionnel"
          className={fieldClass}
        />
      </label>
      <div className="flex flex-col gap-2 sm:flex-row">
        <Button variant="ghost" className="w-full sm:w-auto" onClick={onBack}>
          ← Retour
        </Button>
        <Button
          variant="accent"
          className="w-full sm:flex-1"
          disabled={!canContinue}
          onClick={onNext}
        >
          Choisir le moyen de paiement →
        </Button>
      </div>
    </>
  );
}

function StepPayment({
  recap,
  projectTitle,
  amountFcfa,
  channels,
  operators,
  channel,
  paymentConfig,
  donationType,
  submitting,
  onChannel,
  onBack,
  onConfirm,
}: {
  recap: string;
  projectTitle?: string;
  amountFcfa: number;
  channels: PaymentChannel[];
  operators: PublicMobileMoneyOperator[];
  channel: PaymentChannel;
  paymentConfig: PublicPaymentConfig;
  donationType: DonationType;
  submitting: boolean;
  onChannel: (channel: PaymentChannel) => void;
  onBack: () => void;
  onConfirm: () => void;
}) {
  const selectedOperator =
    channel.kind === "operator"
      ? operators.find((item) => item.id === channel.id)
      : undefined;

  return (
    <>
      <h3 className="font-heading text-base font-bold tracking-tight text-slate-900">
        Choisissez votre mode de paiement
      </h3>
      <p className="font-sans text-sm text-slate-600">
        {recap}
        {projectTitle ? ` · ${projectTitle}` : ""}
      </p>

      {channels.length === 0 ? (
        <p className="rounded-2xl bg-slate-50 p-3 font-sans text-sm text-slate-600">
          Aucun moyen de paiement n&apos;est actuellement activé.
        </p>
      ) : (
        <div className="grid grid-cols-2 gap-2">
          {channels.map((item) => {
            const selected = channelKey(item) === channelKey(channel);
            const meta = channelMeta(item, operators);
            const Icon = meta.icon;
            return (
              <button
                key={channelKey(item)}
                type="button"
                onClick={() => onChannel(item)}
                className={cn(
                  "flex items-center gap-2 rounded-2xl border px-3 py-2.5 text-left transition-colors",
                  selected
                    ? "border-violet-700 bg-violet-50"
                    : "border-slate-200 hover:border-sky-600",
                )}
              >
                <Icon className={cn("size-4 shrink-0", selected ? "text-violet-700" : "text-sky-600")} />
                <span className="min-w-0">
                  <span className="block font-heading text-sm font-bold text-slate-800">
                    {meta.label}
                  </span>
                  <span className="block truncate font-sans text-[11px] text-slate-600">
                    {meta.description}
                  </span>
                </span>
              </button>
            );
          })}
        </div>
      )}

      {channel.kind === "operator" && selectedOperator ? (
        <DonateMobileMoney
          amountFcfa={amountFcfa}
          summary={recap}
          operators={[selectedOperator]}
          operatorId={selectedOperator.id}
          compact
        />
      ) : null}
      {channel.kind === "rib" ? (
        <DonateBankTransfer bank={paymentConfig.bank} summary={recap} compact />
      ) : null}
      {channel.kind === "card" ? (
        <DonateCardPayment amountFcfa={amountFcfa} purpose={donationTypeLabels[donationType]} />
      ) : null}

      <div className="flex flex-col gap-2 sm:flex-row">
        <Button variant="ghost" className="w-full sm:w-auto" onClick={onBack}>
          ← Retour
        </Button>
        <Button
          variant="accent"
          className="w-full sm:flex-1"
          disabled={submitting || channels.length === 0}
          onClick={onConfirm}
        >
          {submitting ? "Enregistrement…" : "Valider l’enregistrement de mon don"}
        </Button>
      </div>
      <p className="font-sans text-xs leading-relaxed text-slate-500">
        En cliquant, vous enregistrez votre promesse de don. Notre équipe validera sa
        réception dès confirmation du virement/transfert.
      </p>
    </>
  );
}

function channelMeta(
  channel: PaymentChannel,
  operators: PublicMobileMoneyOperator[],
) {
  if (channel.kind === "operator") {
    const operator = operators.find((item) => item.id === channel.id);
    return {
      label: operator?.label ?? "Mobile Money",
      description: "QR & numéro marchand",
      icon: Smartphone,
    };
  }
  if (channel.kind === "card") {
    return { label: "Carte", description: "Visa, Mastercard", icon: CreditCard };
  }
  return { label: "Virement RIB", description: "Transfert bancaire", icon: Building2 };
}

function TypeChoice({
  type,
  selected,
  onSelect,
}: {
  type: DonationType;
  selected: boolean;
  onSelect: (type: DonationType) => void;
}) {
  return (
    <button
      type="button"
      onClick={() => onSelect(type)}
      aria-pressed={selected}
      className={cn(
        "rounded-full px-3 py-2 font-heading text-sm font-bold tracking-tight",
        selected
          ? "bg-violet-700 text-white ring-2 ring-amber-500"
          : "bg-slate-50 text-slate-800 ring-1 ring-slate-200 hover:ring-amber-500",
      )}
    >
      {donationTypeLabels[type]}
    </button>
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
        "rounded-2xl border px-3 py-2 text-left transition-colors",
        selected
          ? "border-amber-500 bg-amber-50"
          : "border-slate-200 hover:border-violet-700",
      )}
    >
      <span className="block font-heading text-sm font-extrabold text-slate-800">
        {option.label}
      </span>
    </button>
  );
}
