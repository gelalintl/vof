import { isPossiblePhoneNumber, isValidPhoneNumber } from "libphonenumber-js/min";
import { z } from "zod";

/** E.164 : « + », indicatif sans 0, puis 7 à 15 chiffres au total. */
export const E164_PHONE_PATTERN = /^\+[1-9]\d{6,14}$/;

export function createE164PhoneSchema(message: string) {
  return z
    .string()
    .trim()
    .regex(E164_PHONE_PATTERN, message)
    .refine((value) => isValidPhoneNumber(value), { message });
}

export type E164Phone = z.infer<ReturnType<typeof createE164PhoneSchema>>;

/** Erreur visible seulement quand le numéro a déjà une longueur plausible. */
export function phoneFieldError(value: string, message: string) {
  if (!value || createE164PhoneSchema(message).safeParse(value).success) {
    return undefined;
  }
  if (!isPossiblePhoneNumber(value)) {
    return undefined;
  }
  return message;
}
