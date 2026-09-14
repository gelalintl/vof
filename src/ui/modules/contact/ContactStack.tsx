import { ContactForm } from "./ContactForm";
import { ContactMap } from "./ContactMap";
import { PhoneHours } from "./PhoneHours";
import { QuickAccess } from "./QuickAccess";

export function ContactStack() {
  return (
    <div className="flex flex-col">
      <ContactMap />
      <div className="mx-auto flex w-full max-w-xl flex-col gap-10 px-4 py-10 sm:px-6">
        <QuickAccess />
        <PhoneHours />
        <ContactForm />
      </div>
    </div>
  );
}
