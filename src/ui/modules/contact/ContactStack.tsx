import type { PublicSiteContact } from "@/types";
import { ContactForm } from "./ContactForm";
import { ContactMap } from "./ContactMap";
import { PhoneHours } from "./PhoneHours";
import { QuickAccess } from "./QuickAccess";

interface ContactStackProps {
  contact: PublicSiteContact;
}

export function ContactStack({ contact }: ContactStackProps) {
  return (
    <div className="flex flex-col">
      <ContactMap
        iframeUrl={contact.location.iframeUrl}
        mapsUrl={contact.location.googleMapsUrl}
        address={[contact.location.address, contact.location.city].filter(Boolean).join(", ")}
      />
      <div className="mx-auto flex w-full max-w-xl flex-col gap-10 px-4 py-10 sm:px-6">
        <QuickAccess social={contact.social} />
        <PhoneHours
          phone={contact.location.phone}
          email={contact.location.email}
          address={contact.location.address}
          city={contact.location.city}
        />
        <ContactForm />
      </div>
    </div>
  );
}
