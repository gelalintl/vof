import { Clock, Mail, MapPin, Phone } from "lucide-react";

interface PhoneHoursProps {
  phone?: string;
  email?: string;
  address?: string;
  city?: string;
  title: string;
  gatherings: { id: string; label: string; detail: string }[];
}

export function PhoneHours({ phone, email, address, city, title, gatherings }: PhoneHoursProps) {
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
        {title}
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
        {gatherings.map((gathering) => (
          <li key={gathering.id} className="flex items-start gap-3">
            <Clock className="mt-0.5 size-5 text-sky-600" />
            <span>
              <span className="block font-heading text-sm font-bold text-slate-800">
                {gathering.label}
              </span>
              <span className="font-sans text-sm text-slate-600">{gathering.detail}</span>
            </span>
          </li>
        ))}
      </ul>
    </section>
  );
}
