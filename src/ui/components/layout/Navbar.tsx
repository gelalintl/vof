"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronDown, HeartHandshake, Menu, X } from "lucide-react";
import { mainNavigation } from "@/config/navigation";
import { getDictionary } from "@/i18n/getDictionary";
import { localeFromPathname, withLocale } from "@/i18n/routing";
import { cn } from "@/utils/cn";
import { Button } from "@/ui/design-system/button";
import { LanguageSwitcher } from "@/ui/components/layout/LanguageSwitcher";
import { Logo } from "@/ui/design-system/logo";
import type { PublicPaymentConfig, PublicProject } from "@/types";
import { DonateModal } from "@/ui/components/modals";

const OUR_CHURCH_HREFS = ["/a-propos", "/vie-de-leglise", "/departements"];

type NavEntry =
  | { kind: "link"; href: string; label: string }
  | { kind: "group"; children: { href: string; label: string }[] };

export function Navbar({
  logoSrc,
  churchName,
  paymentConfig,
  projects = [],
  whatsappHref = "",
}: {
  logoSrc?: string | null;
  churchName?: string;
  paymentConfig: PublicPaymentConfig;
  projects?: PublicProject[];
  whatsappHref?: string;
}) {
  const pathname = usePathname();
  const locale = localeFromPathname(pathname) ?? "fr";
  const dictionary = getDictionary(locale);
  const labels: Record<string, string> = {
    "/": dictionary.nav.home,
    "/a-propos": dictionary.nav.about,
    "/vie-de-leglise": dictionary.nav.churchLife,
    "/enseignements": dictionary.nav.teachings,
    "/departements": dictionary.nav.departments,
    "/projets": dictionary.nav.projects,
    "/contact": dictionary.nav.contact,
  };
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isDonateOpen, setIsDonateOpen] = useState(false);
  const [isChurchOpen, setIsChurchOpen] = useState(false);

  const closeDrawer = () => setIsDrawerOpen(false);

  const entries: NavEntry[] = [];
  const churchChildren = mainNavigation
    .filter((item) => OUR_CHURCH_HREFS.includes(item.href))
    .map((item) => ({ href: item.href, label: labels[item.href] ?? item.label }));
  let groupInserted = false;
  for (const item of mainNavigation) {
    if (OUR_CHURCH_HREFS.includes(item.href)) {
      if (!groupInserted) {
        entries.push({ kind: "group", children: churchChildren });
        groupInserted = true;
      }
      continue;
    }
    entries.push({ kind: "link", href: item.href, label: labels[item.href] ?? item.label });
  }

  const isPathActive = (href: string) => {
    const full = withLocale(locale, href);
    return href === "/" ? pathname === full : pathname.startsWith(full);
  };
  const isChurchActive = churchChildren.some((child) => isPathActive(child.href));

  return (
    <header className="sticky top-0 z-50 border-b border-sky-100/50 bg-white/75 shadow-lg shadow-black/5 backdrop-blur-xl backdrop-saturate-150">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-4 sm:px-6">
        <Link href={`/${locale}`} className="shrink-0" onClick={closeDrawer}>
          <Logo imageSrc={logoSrc} wordmark={churchName} />
        </Link>

        <nav className="hidden items-center gap-1 lg:flex" aria-label="Navigation principale">
          {entries.map((entry) => {
            if (entry.kind === "group") {
              return (
                <div key="our-church" className="group relative">
                  <button
                    type="button"
                    aria-haspopup="menu"
                    className={cn(
                      "inline-flex items-center gap-1 rounded-full px-3 py-2 font-heading text-sm font-bold tracking-tight transition-colors",
                      isChurchActive
                        ? "bg-violet-50 text-violet-700"
                        : "text-slate-800 hover:bg-white/70 hover:text-violet-700 group-hover:text-violet-700",
                    )}
                  >
                    {dictionary.nav.ourChurch}
                    <ChevronDown className="size-4 transition-transform group-focus-within:rotate-180 group-hover:rotate-180" />
                  </button>
                  <div className="invisible absolute left-0 top-full z-50 pt-2 opacity-0 transition-opacity group-focus-within:visible group-focus-within:opacity-100 group-hover:visible group-hover:opacity-100">
                    <div
                      role="menu"
                      className="min-w-52 rounded-md bg-white py-2 shadow-lg ring-1 ring-black/5"
                    >
                      {entry.children.map((child) => (
                        <Link
                          key={child.href}
                          href={withLocale(locale, child.href)}
                          role="menuitem"
                          onClick={(event) => event.currentTarget.blur()}
                          className={cn(
                            "block px-4 py-2 font-heading text-sm font-bold tracking-tight transition-colors hover:bg-violet-50 hover:text-violet-700",
                            isPathActive(child.href) ? "text-violet-700" : "text-slate-800",
                          )}
                        >
                          {child.label}
                        </Link>
                      ))}
                    </div>
                  </div>
                </div>
              );
            }

            return (
              <Link
                key={entry.href}
                href={withLocale(locale, entry.href)}
                className={cn(
                  "rounded-full px-3 py-2 font-heading text-sm font-bold tracking-tight transition-colors",
                  isPathActive(entry.href)
                    ? "bg-violet-50 text-violet-700"
                    : "text-slate-800 hover:bg-white/70 hover:text-violet-700",
                )}
              >
                {entry.label}
              </Link>
            );
          })}
        </nav>

        <div className="flex items-center gap-2">
          <LanguageSwitcher className="hidden sm:inline-flex" />
          <Button
            variant="accent"
            size="sm"
            className="hidden sm:inline-flex"
            onClick={() => setIsDonateOpen(true)}
          >
            <HeartHandshake className="size-4" />
            {dictionary.nav.support}
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
              {entries.map((entry) => {
                if (entry.kind === "group") {
                  return (
                    <div key="our-church">
                      <button
                        type="button"
                        aria-expanded={isChurchOpen}
                        aria-controls="vof-mobile-our-church"
                        onClick={() => setIsChurchOpen((open) => !open)}
                        className="flex w-full items-center justify-between rounded-xl px-3 py-3 font-heading text-base font-bold tracking-tight text-slate-800 hover:bg-violet-50 hover:text-violet-700"
                      >
                        {dictionary.nav.ourChurch}
                        <ChevronDown
                          className={cn("size-5 transition-transform", isChurchOpen && "rotate-180")}
                        />
                      </button>
                      {isChurchOpen ? (
                        <div id="vof-mobile-our-church" className="flex flex-col gap-1 pl-4">
                          {entry.children.map((child) => (
                            <Link
                              key={child.href}
                              href={withLocale(locale, child.href)}
                              onClick={closeDrawer}
                              className="rounded-xl px-3 py-3 font-heading text-base tracking-tight text-slate-700 hover:bg-violet-50 hover:text-violet-700"
                            >
                              {child.label}
                            </Link>
                          ))}
                        </div>
                      ) : null}
                    </div>
                  );
                }

                return (
                  <Link
                    key={entry.href}
                    href={withLocale(locale, entry.href)}
                    onClick={closeDrawer}
                    className="rounded-xl px-3 py-3 font-heading text-base font-bold tracking-tight text-slate-800 hover:bg-violet-50 hover:text-violet-700"
                  >
                    {entry.label}
                  </Link>
                );
              })}
            </nav>
            <LanguageSwitcher className="mt-4" />
            <Button
              variant="accent"
              className="mt-4 w-full"
              onClick={() => {
                closeDrawer();
                setIsDonateOpen(true);
              }}
            >
              <HeartHandshake className="size-4" />
              {dictionary.nav.support}
            </Button>
          </div>
        </div>
      ) : null}

      <DonateModal
        isOpen={isDonateOpen}
        onClose={() => setIsDonateOpen(false)}
        paymentConfig={paymentConfig}
        projects={projects}
        whatsappHref={whatsappHref}
      />
    </header>
  );
}
