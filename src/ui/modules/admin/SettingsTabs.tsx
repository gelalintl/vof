"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Building, Columns3, Heart, MapPin, Printer, Video, Wallet } from "lucide-react";
import { ACCOUNTING_ROLES, CONTENT_ROLES } from "@/lib/roles";
import type { AdminUserRole } from "@/types";
import { cn } from "@/utils/cn";

const tabs: {
  href: string;
  label: string;
  icon: typeof Building;
  allowedRoles: readonly AdminUserRole[];
}[] = [
  {
    href: "/sacristie/parametres/general",
    label: "Général",
    icon: Building,
    allowedRoles: CONTENT_ROLES,
  },
  {
    href: "/sacristie/parametres/a-propos",
    label: "À propos",
    icon: Heart,
    allowedRoles: CONTENT_ROLES,
  },
  {
    href: "/sacristie/parametres/contacts",
    label: "Contacts & Réseaux",
    icon: MapPin,
    allowedRoles: CONTENT_ROLES,
  },
  {
    href: "/sacristie/parametres/medias",
    label: "Direct & Médias",
    icon: Video,
    allowedRoles: CONTENT_ROLES,
  },
  {
    href: "/sacristie/parametres/paiements",
    label: "Paiements & Dons",
    icon: Wallet,
    allowedRoles: ACCOUNTING_ROLES,
  },
  {
    href: "/sacristie/parametres/footer",
    label: "Pied de page",
    icon: Columns3,
    allowedRoles: CONTENT_ROLES,
  },
  {
    href: "/sacristie/parametres/impression",
    label: "Impression & Documents",
    icon: Printer,
    allowedRoles: CONTENT_ROLES,
  },
];

export function SettingsTabs({ role }: { role: AdminUserRole }) {
  const pathname = usePathname();
  const visibleTabs = tabs.filter((tab) => tab.allowedRoles.includes(role));

  return (
    <nav
      aria-label="Sous-sections des paramètres"
      className="mt-6 flex gap-2 overflow-x-auto border-b border-slate-200 pb-px"
    >
      {visibleTabs.map((tab) => {
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
