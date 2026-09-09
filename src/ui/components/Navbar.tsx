"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { HeartHandshake, Menu, X } from "lucide-react";
import { mainNavigation } from "@/config/navigation";
import { cn } from "@/utils/cn";
import { Button } from "@/ui/design-system/button";
import { Logo } from "@/ui/design-system/logo";
import { DonateModal } from "@/ui/components/DonateModal";

export function Navbar() {
  const pathname = usePathname();
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isDonateOpen, setIsDonateOpen] = useState(false);

  const closeDrawer = () => setIsDrawerOpen(false);

  return (
    <header className="sticky top-0 z-50 border-b border-sky-100/50 bg-white/75 shadow-lg shadow-black/5 backdrop-blur-xl backdrop-saturate-150">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-4 sm:px-6">
        <Link href="/" className="shrink-0" onClick={closeDrawer}>
          <Logo />
        </Link>

        <nav className="hidden items-center gap-1 lg:flex" aria-label="Navigation principale">
          {mainNavigation.map((item) => {
            const isActive =
              item.href === "/"
                ? pathname === "/"
                : pathname.startsWith(item.href);

            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "rounded-full px-3 py-2 font-heading text-sm font-bold tracking-tight transition-colors",
                  isActive
                    ? "bg-violet-50 text-violet-700"
                    : "text-slate-800 hover:bg-white/70 hover:text-violet-700",
                )}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="flex items-center gap-2">
          <Button
            variant="accent"
            size="sm"
            className="hidden sm:inline-flex"
            onClick={() => setIsDonateOpen(true)}
          >
            <HeartHandshake className="size-4" />
            Soutenir
          </Button>
          <button
            type="button"
            className="inline-flex size-10 items-center justify-center rounded-full border border-violet-200 text-violet-700 lg:hidden"
            aria-expanded={isDrawerOpen}
            aria-controls="vof-mobile-drawer"
            aria-label={isDrawerOpen ? "Fermer le menu" : "Ouvrir le menu"}
            onClick={() => setIsDrawerOpen((open) => !open)}
          >
            {isDrawerOpen ? <X className="size-5" /> : <Menu className="size-5" />}
          </button>
        </div>
      </div>

      {isDrawerOpen ? (
        <div className="lg:hidden">
          <button
            type="button"
            className="fixed inset-0 z-40 bg-slate-900/40"
            aria-label="Fermer le menu"
            onClick={closeDrawer}
          />
          <div
            id="vof-mobile-drawer"
            className="absolute inset-x-0 top-full z-50 border-b border-sky-100/50 bg-white/90 px-4 py-4 shadow-lg shadow-black/5 backdrop-blur-xl backdrop-saturate-150 sm:px-6"
          >
            <nav className="flex flex-col gap-1" aria-label="Navigation mobile">
              {mainNavigation.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={closeDrawer}
                  className="rounded-xl px-3 py-3 font-heading text-base font-bold tracking-tight text-slate-800 hover:bg-violet-50 hover:text-violet-700"
                >
                  {item.label}
                </Link>
              ))}
            </nav>
            <Button
              variant="accent"
              className="mt-4 w-full"
              onClick={() => {
                closeDrawer();
                setIsDonateOpen(true);
              }}
            >
              <HeartHandshake className="size-4" />
              Soutenir
            </Button>
          </div>
        </div>
      ) : null}

      <DonateModal isOpen={isDonateOpen} onClose={() => setIsDonateOpen(false)} />
    </header>
  );
}
