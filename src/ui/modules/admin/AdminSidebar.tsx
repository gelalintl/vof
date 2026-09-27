"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  ArrowLeft,
  BookOpen,
  Calendar,
  Globe,
  ImageIcon,
  Building2,
  FolderHeart,
  HandHeart,
  LayoutDashboard,
  LogOut,
  Settings,
  Users,
} from "lucide-react";
import { adminNavigation } from "@/config/navigation";
import { Logo } from "@/ui/design-system/logo";
import { cn } from "@/utils/cn";
import { logoutAction } from "@/lib/auth";

const icons = {
  "/admin": LayoutDashboard,
  "/admin/evenements": Calendar,
  "/admin/pasteurs": Users,
  "/admin/departements": Building2,
  "/admin/medias": ImageIcon,
  "/admin/enseignements": BookOpen,
  "/admin/projets": FolderHeart,
  "/admin/dons": HandHeart,
  "/admin/parametres": Settings,
} as const;

interface AdminSidebarProps {
  logoSrc?: string | null;
  userEmail?: string;
}

export function AdminSidebar({ logoSrc, userEmail }: AdminSidebarProps) {
  const pathname = usePathname();

  return (
    <aside className="border-b border-slate-200 bg-white text-slate-800 lg:sticky lg:top-0 lg:flex lg:h-screen lg:w-72 lg:shrink-0 lg:flex-col lg:border-b-0 lg:border-r lg:border-r-slate-200">
      <div className="flex items-center justify-between gap-4 px-5 py-5 lg:block lg:border-b lg:border-slate-100">
        <Link href="/admin" className="inline-flex items-center gap-3">
          {logoSrc ? (
            <Logo imageSrc={logoSrc} showWordmark={false} markClassName="size-11" />
          ) : (
            <span className="font-heading text-lg font-extrabold tracking-tight text-[#6d28d9]">
              VOF
            </span>
          )}
          <span className="leading-tight">
            <span className="block font-heading text-sm font-extrabold tracking-tight text-slate-900">
              Voice of Freedom
            </span>
            <span className="block font-heading text-[11px] font-semibold text-slate-500">
              — Admin
            </span>
          </span>
        </Link>
        <span className="hidden lg:mt-4 lg:inline-flex lg:border lg:border-amber-200 lg:bg-amber-50 lg:px-2 lg:py-0.5 lg:font-heading lg:text-[10px] lg:font-bold lg:uppercase lg:tracking-[0.18em] lg:text-[#f59e0b]">
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
                  ? "border-[#6d28d9] bg-violet-50 font-bold text-[#6d28d9]"
                  : "border-transparent font-semibold text-slate-600 hover:bg-slate-50 hover:text-slate-900",
              )}
            >
              {Icon ? <Icon className="size-4 shrink-0" aria-hidden="true" /> : null}
              {item.label}
            </Link>
          );
        })}
      </nav>

      <div className="flex items-center justify-between gap-3 border-t border-slate-100 px-4 py-3 lg:block lg:space-y-3 lg:py-4">
        <Link
          href="/"
          className="inline-flex items-center gap-2 font-heading text-xs font-semibold uppercase tracking-[0.16em] text-[#6d28d9] hover:text-violet-800"
        >
          <Globe className="size-3.5" />
          <ArrowLeft className="size-3.5" />
          Retour au site
        </Link>
        <div className="flex items-center justify-between gap-3 lg:mt-3 lg:border lg:border-slate-200 lg:bg-slate-50 lg:px-3 lg:py-3">
          <div className="min-w-0">
            <p className="font-heading text-xs font-bold text-slate-900">Administrateur</p>
            <p className="truncate text-[11px] text-slate-500">
              {userEmail ?? "Session locale"}
            </p>
          </div>
          <form action={logoutAction}>
            <button
              type="submit"
              className="inline-flex size-9 items-center justify-center text-slate-500 hover:bg-violet-50 hover:text-[#6d28d9]"
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
