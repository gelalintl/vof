import { Clock, Mail, MapPin, Phone } from "lucide-react";
import { siteConfig } from "@/config/site";

interface PhoneHoursProps {
  phone?: string;
  email?: string;
  address?: string;
  city?: string;
}

export function PhoneHours({ phone, email, address, city }: PhoneHoursProps) {
  const locationLine = [address, city].filter(Boolean).join(", ");

  return (
    <section
      className="rounded-3xl bg-slate-50 p-5 ring-1 ring-violet-100 sm:p-6"
      aria-labelledby="telephones-horaires"
    >
      <h2
        id="telephones-horaires"
        className="font-heading text-lg font-bold tracking-tight text-violet-700"
      >
        Coordonnées & horaires
      </h2>

      <ul className="mt-4 space-y-3">
        {locationLine ? (
          <li className="flex items-start gap-3">
            <MapPin className="mt-0.5 size-5 text-sky-600" />
            <span className="font-sans text-sm text-slate-800">{locationLine}</span>
          </li>
        ) : null}
        {phone ? (
          <li className="flex items-start gap-3">
            <Phone className="mt-0.5 size-5 text-sky-600" />
            <a
              href={`tel:${phone.replace(/\s/g, "")}`}
              className="font-sans text-sm text-slate-800 hover:text-sky-600"
            >
              {phone}
            </a>
          </li>
        ) : null}
        {email ? (
          <li className="flex items-start gap-3">
            <Mail className="mt-0.5 size-5 text-sky-600" />
            <a
              href={`mailto:${email}`}
              className="font-sans text-sm text-slate-800 hover:text-sky-600"
            >
              {email}
            </a>
          </li>
        ) : null}
        {siteConfig.worship.gatherings.map((gathering) => (
          <li key={gathering.id} className="flex items-start gap-3">
            <Clock className="mt-0.5 size-5 text-sky-600" />
            <span>
              <span className="block font-heading text-sm font-bold text-slate-800">
                {gathering.label}
              </span>
              <span className="font-sans text-sm text-slate-600">
                {gathering.day} · {gathering.time}
              </span>
            </span>
          </li>
        ))}
      </ul>
    </section>
  );
}
