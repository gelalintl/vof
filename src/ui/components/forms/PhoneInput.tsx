"use client";

import PhoneNumberInput, { type Country } from "react-phone-number-input";
import flags from "react-phone-number-input/flags";
import PhoneNumberInputHookForm from "react-phone-number-input/react-hook-form";
import type { Control, FieldPath, FieldValues } from "react-hook-form";
import enLabels from "react-phone-number-input/locale/en.json";
import frLabels from "react-phone-number-input/locale/fr.json";
import "react-phone-number-input/style.css";
import type { Locale } from "@/i18n/config";
import { cn } from "@/utils/cn";

const DEFAULT_COUNTRY: Country = "NE";

type PhoneInputBaseProps = {
  id?: string;
  locale?: Locale;
  defaultCountry?: Country;
  disabled?: boolean;
  required?: boolean;
  placeholder?: string;
  className?: string;
  "aria-invalid"?: boolean;
  "aria-describedby"?: string;
};

type ControlledPhoneInputProps = PhoneInputBaseProps & {
  name?: string;
  value: string;
  onChange: (value: string) => void;
  onBlur?: () => void;
  control?: undefined;
};

type HookFormPhoneInputProps<TFieldValues extends FieldValues> = PhoneInputBaseProps & {
  name: FieldPath<TFieldValues>;
  control: Control<TFieldValues>;
  value?: undefined;
  onChange?: undefined;
};

export type PhoneInputProps<TFieldValues extends FieldValues = FieldValues> =
  | ControlledPhoneInputProps
  | HookFormPhoneInputProps<TFieldValues>;

export function PhoneInput<TFieldValues extends FieldValues = FieldValues>(
  props: PhoneInputProps<TFieldValues>,
) {
  const {
    id,
    locale = "fr",
    defaultCountry = DEFAULT_COUNTRY,
    disabled,
    required,
    placeholder,
    className,
    "aria-invalid": ariaInvalid,
    "aria-describedby": ariaDescribedBy,
  } = props;

  const shared = {
    international: true as const,
    countryCallingCodeEditable: false,
    limitMaxLength: true,
    defaultCountry,
    flags,
    labels: locale === "en" ? enLabels : frLabels,
    disabled,
    className: cn("vof-phone", ariaInvalid && "vof-phone-invalid", className),
    numberInputProps: {
      id,
      required,
      placeholder,
      autoComplete: "tel",
      "aria-invalid": ariaInvalid || undefined,
      "aria-describedby": ariaDescribedBy,
    },
  };

  if (props.control) {
    return (
      <PhoneNumberInputHookForm
        {...shared}
        name={props.name}
        control={props.control}
      />
    );
  }

  return (
    <PhoneNumberInput
      {...shared}
      name={props.name}
      value={props.value || undefined}
      onChange={(next) => props.onChange(next ?? "")}
      onBlur={props.onBlur}
    />
  );
}
