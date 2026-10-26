import type { Locale } from "@/i18n/config";
import type { ContactMessageCopy } from "@/lib/contactSchema";
import type { ContactSubject, PublicSiteContact } from "@/types";
import { ContactForm } from "./ContactForm";
import { ContactMap } from "./ContactMap";
import { PhoneHours } from "./PhoneHours";
import { QuickAccess } from "./QuickAccess";

interface ContactStackProps {
  locale: Locale;
  contact: PublicSiteContact;
  gatherings: { id: string; label: string; detail: string }[];
  subjects: { value: ContactSubject; label: string }[];
  labels: ContactMessageCopy & {
    quickAccess: string;
    detailsHours: string;
    mapTitle: string;
    mapMissing: string;
    openMaps: string;
    write: string;
    fullName: string;
    email: string;
    phone: string;
    phonePlaceholder: string;
    subject: string;
    message: string;
    messagePlaceholder: string;
    send: string;
    sending: string;
    sentTitle: string;
    sentBody: string;
    errorFailed: string;
  };
}

export function ContactStack({
  locale,
  contact,
  gatherings,
  subjects,
  labels,
}: ContactStackProps) {
  return (
    <div className="flex flex-col">
      <ContactMap
        iframeUrl={contact.location.iframeUrl}
        mapsUrl={contact.location.googleMapsUrl}
        address={[contact.location.address, contact.location.city].filter(Boolean).join(", ")}
        title={labels.mapTitle}
        missing={labels.mapMissing}
        openMaps={labels.openMaps}
      />
      <div className="mx-auto flex w-full max-w-xl flex-col gap-10 px-4 py-10 sm:px-6">
        <QuickAccess social={contact.social} title={labels.quickAccess} />
        <PhoneHours
          phone={contact.location.phone}
          email={contact.location.email}
          address={contact.location.address}
          city={contact.location.city}
          title={labels.detailsHours}
          gatherings={gatherings}
        />
        <ContactForm
          locale={locale}
          subjects={subjects}
          labels={{
            write: labels.write,
            fullName: labels.fullName,
            email: labels.email,
            phone: labels.phone,
            phonePlaceholder: labels.phonePlaceholder,
            phoneInvalid: labels.phoneInvalid,
            subject: labels.subject,
            message: labels.message,
            messagePlaceholder: labels.messagePlaceholder,
            send: labels.send,
            sending: labels.sending,
            sentTitle: labels.sentTitle,
            sentBody: labels.sentBody,
            errorName: labels.errorName,
            errorEmail: labels.errorEmail,
            errorSubject: labels.errorSubject,
            errorMessage: labels.errorMessage,
            errorFailed: labels.errorFailed,
          }}
        />
      </div>
    </div>
  );
}
