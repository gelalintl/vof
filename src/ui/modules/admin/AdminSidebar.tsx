"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  ArrowLeft,
  BookOpen,
  Calendar,
  Globe,
  ImageIcon,
  LayoutDashboard,
  LogOut,
  Settings,
} from "lucide-react";
import { adminNavigation } from "@/config/navigation";
import { Logo } from "@/ui/design-system/logo";
import { cn } from "@/utils/cn";
import { logoutAction } from "@/lib/auth";

const icons = {
  "/admin": LayoutDashboard,
  "/admin/evenements": Calendar,
  "/admin/medias": ImageIcon,
  "/admin/enseignements": BookOpen,
  "/admin/parametres": Settings,
} as const;

interface AdminSidebarProps {
  logoSrc?: string | null;
  userEmail?: string;
}

export function AdminSidebar({ logoSrc, userEmail }: AdminSidebarProps) {
  const pathname = usePathname();

  return (
    <aside className="border-b border-burgundy-light bg-burgundy text-cream lg:sticky lg:top-0 lg:flex lg:h-screen lg:w-72 lg:shrink-0 lg:flex-col lg:border-b-0 lg:border-r lg:border-r-burgundy-light">
      <div className="flex items-center justify-between gap-4 px-5 py-5 lg:block lg:border-b lg:border-white/10">
        <Link href="/admin" className="inline-flex items-center gap-3">
          {logoSrc ? (
            <Logo imageSrc={logoSrc} inverted showWordmark={false} markClassName="size-11" />
          ) : (
            <span className="font-heading text-lg font-extrabold tracking-tight text-cream">
              VOF
            </span>
          )}
          <span className="leading-tight">
            <span className="block font-heading text-sm font-extrabold tracking-tight text-cream">
              Voice of Freedom
            </span>
            <span className="block font-heading text-[11px] font-semibold text-cream/70">
              — Admin
            </span>
          </span>
        </Link>
        <span className="hidden lg:mt-4 lg:inline-flex lg:border lg:border-gold/50 lg:px-2 lg:py-0.5 lg:font-heading lg:text-[10px] lg:font-bold lg:uppercase lg:tracking-[0.18em] lg:text-gold">
          Administration
        </span>
      </div>

      <nav
        aria-label="Navigation administration"
        className="flex gap-1 overflow-x-auto px-3 py-3 lg:flex-1 lg:flex-col lg:overflow-visible lg:px-3 lg:py-6"
      >
        {adminNavigation.map((item) => {
          const Icon = icons[item.href as keyof typeof icons];
          const isActive =
            item.href === "/admin"
              ? pathname === "/admin"
              : pathname.startsWith(item.href);

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "inline-flex items-center gap-3 whitespace-nowrap border-l-2 px-3 py-2.5 font-heading text-sm tracking-tight transition-colors",
                isActive
                  ? "border-cream bg-white/10 font-bold text-cream"
                  : "border-transparent font-semibold text-cream/80 hover:bg-burgundy-light/40 hover:text-cream",
              )}
            >
              {Icon ? <Icon className="size-4 shrink-0" aria-hidden="true" /> : null}
              {item.label}
            </Link>
          );
        })}
      </nav>

      <div className="flex items-center justify-between gap-3 border-t border-white/10 px-4 py-3 lg:block lg:space-y-3 lg:py-4">
        <Link
          href="/"
          className="inline-flex items-center gap-2 font-heading text-xs font-semibold uppercase tracking-[0.16em] text-gold hover:text-cream"
        >
          <Globe className="size-3.5" />
          <ArrowLeft className="size-3.5" />
          Retour au site
        </Link>
        <div className="flex items-center justify-between gap-3 lg:mt-3 lg:border lg:border-white/10 lg:bg-burgundy-light/30 lg:px-3 lg:py-3">
          <div className="min-w-0">
            <p className="font-heading text-xs font-bold text-cream">Administrateur</p>
            <p className="truncate text-[11px] text-cream/65">
              {userEmail ?? "Session locale"}
            </p>
          </div>
          <form action={logoutAction}>
            <button
              type="submit"
              className="inline-flex size-9 items-center justify-center text-cream/80 hover:bg-white/10 hover:text-cream"
              aria-label="Déconnexion"
            >
              <LogOut className="size-4" />
            </button>
          </form>
        </div>
      </div>
    </aside>
  );
}
