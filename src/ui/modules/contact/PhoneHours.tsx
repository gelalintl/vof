import { Clock, Mail, Phone } from "lucide-react";
import { siteConfig } from "@/config/site";

export function PhoneHours() {
  return (
    <section
      className="rounded-3xl bg-slate-50 p-5 ring-1 ring-violet-100 sm:p-6"
      aria-labelledby="telephones-horaires"
    >
      <h2
        id="telephones-horaires"
        className="font-heading text-lg font-bold tracking-tight text-violet-700"
      >
        Téléphones & horaires
      </h2>

      <ul className="mt-4 space-y-3">
        {siteConfig.contacts.phones.map((item) => (
          <li key={item.number} className="flex items-start gap-3">
            <Phone className="mt-0.5 size-5 text-sky-600" />
            <span>
              <span className="block font-heading text-sm font-bold text-slate-800">
                {item.label}
              </span>
              <a
                href={`tel:${item.number.replace(/\s/g, "")}`}
                className="font-sans text-sm text-slate-600 hover:text-sky-600"
              >
                {item.number}
              </a>
            </span>
          </li>
        ))}
        <li className="flex items-start gap-3">
          <Mail className="mt-0.5 size-5 text-sky-600" />
          <a
            href={`mailto:${siteConfig.contacts.email}`}
            className="font-sans text-sm text-slate-800 hover:text-sky-600"
          >
            {siteConfig.contacts.email}
          </a>
        </li>
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
