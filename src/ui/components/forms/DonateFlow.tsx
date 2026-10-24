"use client";

import { useMemo, useState } from "react";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { Building2, CheckCircle2, CreditCard, Smartphone } from "lucide-react";
import { toast } from "sonner";
import { submitDonationPromise } from "@/app/[locale]/don/actions";
import { donationTypes } from "@/config/forms";
import { formatMessage, getDictionary } from "@/i18n/getDictionary";
import { localeFromPathname } from "@/i18n/routing";
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
  DonationType,
  MobileMoneyOperatorId,
  PaymentMethod,
  PublicMobileMoneyOperator,
  PublicPaymentConfig,
  PublicProject,
} from "@/types";
import { createE164PhoneSchema, phoneFieldError } from "@/lib/phoneSchema";
import { whatsappPrefillHref } from "@/lib/siteSettingsKeys";
import { formatFcfa } from "@/utils/formatters/currency";
import { cn } from "@/utils/cn";
import { Button } from "@/ui/design-system/button";
import { DonateBankTransfer } from "./DonateBankTransfer";
import { DonateCardPayment } from "./DonateCardPayment";
import { DonateMobileMoney } from "./DonateMobileMoney";
import { PhoneInput } from "./PhoneInput";
import { useDonateFlowCopy } from "./useDonateFlowCopy";

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
  const [projectId, setProjectId] = useState(initialProjectId);
  const [transferPhone, setTransferPhone] = useState("");
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

  const pathname = usePathname();
  const locale = localeFromPathname(pathname) ?? "fr";
  const copy = getDictionary(locale).donate;
  const { t } = useDonateFlowCopy();
  const phoneSchema = useMemo(() => createE164PhoneSchema(copy.phoneInvalid), [copy.phoneInvalid]);
  const donorPhoneValid = phoneSchema.safeParse(donorPhone).success;
  const transferPhoneValid = phoneSchema.safeParse(transferPhone).success;
  const canContinueAmount = amountFcfa > 0;
  const canContinueContact = donorPhoneValid;
  const typeLabel = t("types")[donationType];
  const recap = `${typeLabel} · ${formatFcfa(amountFcfa)}`;
  const needsTransferPhone = resolvedChannel.kind === "operator";
  const canSubmitTransfer = !needsTransferPhone || transferPhoneValid;
  const selectedProject = projects.find((project) => project.id === projectId);
  const operatorId =
    resolvedChannel.kind === "operator" ? resolvedChannel.id : operators[0]?.id ?? "amana";

  async function handleSubmitPromise() {
    if (submitted || submitting || amountFcfa <= 0 || !canContinueContact || !canSubmitTransfer) {
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
        transferPhone: needsTransferPhone ? transferPhone : "",
        notes: [
          recap,
          selectedProject ? `Projet : ${selectedProject.title}` : "Soutien général",
          "Fréquence : une fois",
          needsTransferPhone ? `Numéro de transfert : ${transferPhone.trim()}` : "",
        ]
          .filter(Boolean)
          .join(" · "),
      });
      if (!result.success) {
        toast.error(result.error);
        return;
      }
      setSubmitted(true);
    } catch {
      toast.error(t("submitError"));
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
              projectId={projectId}
              projects={projects}
              canContinue={canContinueAmount}
              onType={setDonationType}
              onAmount={setSelectedId}
              onCustomAmount={setCustomAmount}
              onProject={setProjectId}
              onNext={() => setStep(2)}
            />
          ) : null}

          {step === 2 ? (
            <StepContact
              locale={locale}
              donorName={donorName}
              donorPhone={donorPhone}
              donorEmail={donorEmail}
              phoneError={phoneFieldError(donorPhone, copy.phoneInvalid)}
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
              canConfirm={canSubmitTransfer}
              locale={locale}
              transferPhone={transferPhone}
              transferError={
                needsTransferPhone ? phoneFieldError(transferPhone, copy.phoneInvalid) : undefined
              }
              transferLabel={copy.transferPhone}
              transferHint={copy.transferPhoneHint}
              confirmLabel={copy.confirmPromise}
              paymentTitle={copy.paymentTitle}
              noMethod={copy.noMethod}
              promiseNotice={copy.promiseNotice}
              registerLabel={copy.registerGift}
              cardPrepared={copy.cardPrepared}
              onTransferPhone={setTransferPhone}
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
  const { t } = useDonateFlowCopy();
  const amount = formatFcfa(amountFcfa);
  const receiptHref = whatsappPrefillHref(
    whatsappHref,
    formatMessage(t("whatsappMessage"), { amount }),
  );

  return (
    <div className="space-y-4 rounded-2xl bg-violet-50 p-5 text-center">
      <CheckCircle2 className="mx-auto size-10 text-[#6d28d9]" aria-hidden />
      <h3 className="font-heading text-lg font-bold tracking-tight text-slate-900">
        {t("thanksTitle")}
      </h3>
      <p className="font-sans text-sm leading-relaxed text-slate-700">
        {formatMessage(t("thanksBody"), { amount })}
      </p>
      {receiptHref ? (
        <Button
          href={receiptHref}
          variant="accent"
          className="w-full"
          target="_blank"
          rel="noopener noreferrer"
        >
          {t("whatsappReceipt")}
        </Button>
      ) : null}
    </div>
  );
}

function WizardProgress({ step }: { step: WizardStep }) {
  const { t } = useDonateFlowCopy();
  const label =
    step === 1 ? t("stepAmount") : step === 2 ? t("stepContact") : t("stepRecord");
  return (
    <div>
      <p className="font-heading text-xs font-bold uppercase tracking-widest text-violet-700">
        {formatMessage(t("stepOf"), { step: String(step), label })}
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
  projectId,
  projects,
  canContinue,
  onType,
  onAmount,
  onCustomAmount,
  onProject,
  onNext,
}: {
  layout: "modal" | "page";
  donationType: DonationType;
  selectedId: string;
  customAmount: string;
  selectedOption?: DonationOption;
  projectId: string;
  projects: PublicProject[];
  canContinue: boolean;
  onType: (type: DonationType) => void;
  onAmount: (id: string) => void;
  onCustomAmount: (value: string) => void;
  onProject: (id: string) => void;
  onNext: () => void;
}) {
  const { t } = useDonateFlowCopy();
  return (
    <>
      <fieldset>
        <legend className="font-heading text-sm font-bold text-slate-800">{t("donationType")}</legend>
        <div className="mt-2 flex flex-wrap gap-2">
          {donationTypes.map((type) => (
            <TypeChoice
              key={type}
              label={t("types")[type]}
              selected={donationType === type}
              onSelect={() => onType(type)}
            />
          ))}
        </div>
      </fieldset>

      {projects.length > 0 ? (
        <label className="block">
          <span className="font-heading text-sm font-bold text-slate-800">
            {t("attachProject")}
          </span>
          <select
            value={projectId}
            onChange={(event) => onProject(event.target.value)}
            className={fieldClass}
          >
            <option value="">{t("generalSupport")}</option>
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
            label={option.isCustom ? t("otherAmount") : option.label}
            selected={selectedId === option.id}
            onSelect={onAmount}
          />
        ))}
      </div>
      {selectedOption?.isCustom ? (
        <label className="block">
          <span className="font-heading text-sm font-bold text-slate-800">
            {t("customAmount")}
          </span>
          <input
            type="number"
            min={500}
            step={500}
            inputMode="numeric"
            value={customAmount}
            onChange={(event) => onCustomAmount(event.target.value)}
            placeholder={t("customAmountPlaceholder")}
            className={fieldClass}
          />
        </label>
      ) : null}

      <Button variant="accent" className="w-full" disabled={!canContinue} onClick={onNext}>
        {t("continueContact")}
      </Button>
    </>
  );
}

function StepContact({
  locale,
  donorName,
  donorPhone,
  donorEmail,
  phoneError,
  canContinue,
  onName,
  onPhone,
  onEmail,
  onBack,
  onNext,
}: {
  locale: "fr" | "en";
  donorName: string;
  donorPhone: string;
  donorEmail: string;
  phoneError?: string;
  canContinue: boolean;
  onName: (value: string) => void;
  onPhone: (value: string) => void;
  onEmail: (value: string) => void;
  onBack: () => void;
  onNext: () => void;
}) {
  const { t } = useDonateFlowCopy();
  return (
    <>
      <h3 className="font-heading text-base font-bold tracking-tight text-slate-900">
        {t("whoGives")}
      </h3>
      <label className="block">
        <span className="font-heading text-sm font-bold text-slate-800">{t("fullName")}</span>
        <input
          type="text"
          value={donorName}
          onChange={(event) => onName(event.target.value)}
          placeholder={t("namePlaceholder")}
          className={fieldClass}
        />
      </label>
      <div className="block">
        <label htmlFor="donor-phone" className="font-heading text-sm font-bold text-slate-800">
          {t("phoneLabel")}
        </label>
        <PhoneInput
          id="donor-phone"
          locale={locale}
          required
          value={donorPhone}
          onChange={onPhone}
          placeholder="90 00 00 00"
          aria-invalid={Boolean(phoneError)}
          aria-describedby={phoneError ? "donor-phone-error" : "donor-phone-hint"}
        />
        {phoneError ? (
          <span id="donor-phone-error" className="mt-1 block font-sans text-xs text-red-600">
            {phoneError}
          </span>
        ) : (
          <span id="donor-phone-hint" className="mt-1 block font-sans text-xs text-slate-500">
            {t("phoneHint")}
          </span>
        )}
      </div>
      <label className="block">
        <span className="font-heading text-sm font-bold text-slate-800">{t("email")}</span>
        <input
          type="email"
          value={donorEmail}
          onChange={(event) => onEmail(event.target.value)}
          placeholder={t("optional")}
          className={fieldClass}
        />
      </label>
      <div className="flex flex-col gap-2 sm:flex-row">
        <Button variant="ghost" className="w-full sm:w-auto" onClick={onBack}>
          {t("back")}
        </Button>
        <Button
          variant="accent"
          className="w-full sm:flex-1"
          disabled={!canContinue}
          onClick={onNext}
        >
          {t("continuePayment")}
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
  canConfirm,
  locale,
  transferPhone,
  transferError,
  transferLabel,
  transferHint,
  confirmLabel,
  paymentTitle,
  noMethod,
  promiseNotice,
  registerLabel,
  cardPrepared,
  onTransferPhone,
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
  canConfirm: boolean;
  locale: "fr" | "en";
  transferPhone: string;
  transferError?: string;
  transferLabel: string;
  transferHint: string;
  confirmLabel: string;
  paymentTitle: string;
  noMethod: string;
  promiseNotice: string;
  registerLabel: string;
  cardPrepared: string;
  onTransferPhone: (value: string) => void;
  onChannel: (channel: PaymentChannel) => void;
  onBack: () => void;
  onConfirm: () => void;
}) {
  const { t } = useDonateFlowCopy();
  const selectedOperator =
    channel.kind === "operator"
      ? operators.find((item) => item.id === channel.id)
      : undefined;

  return (
    <>
      <h3 className="font-heading text-base font-bold tracking-tight text-slate-900">
        {paymentTitle}
      </h3>
      <p className="font-sans text-sm text-slate-600">
        {recap}
        {projectTitle ? ` · ${projectTitle}` : ""}
      </p>

      {channels.length === 0 ? (
        <p className="rounded-2xl bg-slate-50 p-3 font-sans text-sm text-slate-600">
          {noMethod}
        </p>
      ) : (
        <div className="grid grid-cols-2 gap-2">
          {channels.map((item) => {
            const selected = channelKey(item) === channelKey(channel);
            const meta = channelMeta(item, operators, t);
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
        <>
          <DonateMobileMoney
            amountFcfa={amountFcfa}
            summary={recap}
            operators={[selectedOperator]}
            operatorId={selectedOperator.id}
            compact
          />
          <div className="block">
            <label htmlFor="transfer-phone" className="font-heading text-sm font-bold text-slate-800">
              {transferLabel}
            </label>
            <PhoneInput
              id="transfer-phone"
              locale={locale}
              required
              value={transferPhone}
              onChange={onTransferPhone}
              placeholder="90 00 00 00"
              aria-invalid={Boolean(transferError)}
              aria-describedby={transferError ? "transfer-phone-error" : "transfer-phone-hint"}
            />
            {transferError ? (
              <span id="transfer-phone-error" className="mt-1 block font-sans text-xs text-red-600">
                {transferError}
              </span>
            ) : (
              <span id="transfer-phone-hint" className="mt-1 block font-sans text-xs text-slate-500">
                {transferHint}
              </span>
            )}
          </div>
        </>
      ) : null}
      {channel.kind === "rib" ? (
        <DonateBankTransfer bank={paymentConfig.bank} summary={recap} compact />
      ) : null}
      {channel.kind === "card" ? (
        <DonateCardPayment
          amountFcfa={amountFcfa}
          purpose={t("types")[donationType]}
          submitLabel={registerLabel}
          preparedMessage={cardPrepared}
        />
      ) : null}

      <div className="flex flex-col gap-2 sm:flex-row">
        <Button variant="ghost" className="w-full sm:w-auto" onClick={onBack}>
          {t("back")}
        </Button>
        <Button
          variant="accent"
          className="w-full sm:flex-1"
          disabled={submitting || channels.length === 0 || !canConfirm}
          onClick={onConfirm}
        >
          {submitting ? t("recording") : confirmLabel}
        </Button>
      </div>
      <p className="font-sans text-xs leading-relaxed text-slate-500">{promiseNotice}</p>
    </>
  );
}

function channelMeta(
  channel: PaymentChannel,
  operators: PublicMobileMoneyOperator[],
  t: ReturnType<typeof useDonateFlowCopy>["t"],
) {
  if (channel.kind === "operator") {
    const operator = operators.find((item) => item.id === channel.id);
    return {
      label: operator?.label ?? t("mobileMoney"),
      description: t("channelQr"),
      icon: Smartphone,
    };
  }
  if (channel.kind === "card") {
    return { label: t("channelCard"), description: t("channelCardHint"), icon: CreditCard };
  }
  return { label: t("channelBank"), description: t("channelBankHint"), icon: Building2 };
}

function TypeChoice({
  label,
  selected,
  onSelect,
}: {
  label: string;
  selected: boolean;
  onSelect: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onSelect}
      aria-pressed={selected}
      className={cn(
        "rounded-full px-3 py-2 font-heading text-sm font-bold tracking-tight",
        selected
          ? "bg-violet-700 text-white ring-2 ring-amber-500"
          : "bg-slate-50 text-slate-800 ring-1 ring-slate-200 hover:ring-amber-500",
      )}
    >
      {label}
    </button>
  );
}

function AmountChoice({
  option,
  label,
  selected,
  onSelect,
}: {
  option: DonationOption;
  label: string;
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
        {label}
      </span>
    </button>
  );
}
