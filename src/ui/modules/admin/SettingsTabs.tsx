"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Building, Columns3, MapPin, Printer, Video, Wallet } from "lucide-react";
import { cn } from "@/utils/cn";

const tabs = [
  {
    href: "/admin/parametres/general",
    label: "Général",
    icon: Building,
  },
  {
    href: "/admin/parametres/contacts",
    label: "Contacts & Réseaux",
    icon: MapPin,
  },
  {
    href: "/admin/parametres/medias",
    label: "Direct & Médias",
    icon: Video,
  },
  {
    href: "/admin/parametres/paiements",
    label: "Paiements & Dons",
    icon: Wallet,
  },
  {
    href: "/admin/parametres/footer",
    label: "Pied de page",
    icon: Columns3,
  },
  {
    href: "/admin/parametres/impression",
    label: "Impression & Documents",
    icon: Printer,
  },
] as const;

export function SettingsTabs() {
  const pathname = usePathname();

  return (
    <nav
      aria-label="Sous-sections des paramètres"
      className="mt-6 flex gap-2 overflow-x-auto border-b border-slate-200 pb-px"
    >
      {tabs.map((tab) => {
        const Icon = tab.icon;
        const isActive = pathname === tab.href || pathname.startsWith(`${tab.href}/`);

        return (
          <Link
            key={tab.href}
            href={tab.href}
            prefetch
            className={cn(
              "inline-flex shrink-0 items-center gap-2 border-b-2 px-3 py-2.5 font-heading text-sm tracking-tight transition-colors",
              isActive
                ? "border-[#6d28d9] font-bold text-[#6d28d9]"
                : "border-transparent font-semibold text-slate-500 hover:border-slate-200 hover:text-slate-900",
            )}
          >
            <Icon className="size-4 shrink-0" aria-hidden />
            {tab.label}
          </Link>
        );
      })}
    </nav>
  );
}
