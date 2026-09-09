import { ContactMap } from "@/ui/modules/contact/ContactMap";
import { QuickAccess } from "@/ui/modules/contact/QuickAccess";
import { PhoneHours } from "@/ui/modules/contact/PhoneHours";
import { ContactForm } from "@/ui/modules/contact/ContactForm";

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
