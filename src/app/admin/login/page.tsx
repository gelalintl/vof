import type { Metadata } from "next";
import Link from "next/link";
import { getChurchLogo } from "@/lib/siteSettings";
import { LoginForm } from "@/ui/modules/admin/LoginForm";
import { Logo } from "@/ui/design-system/logo";

export const metadata: Metadata = {
  title: "Connexion admin",
  description: "Accès sécurisé au tableau de bord Voice Of Freedom.",
};

export default async function AdminLoginPage() {
  const logoSrc = await getChurchLogo();

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#f8fafc] px-4 py-12">
      <div className="w-full max-w-md border border-slate-200 bg-white p-8 shadow-sm">
        <div className="flex items-center gap-3">
          <Logo imageSrc={logoSrc} showWordmark={false} markClassName="size-12" />
          <div>
            <p className="font-heading text-xs font-bold uppercase tracking-[0.22em] text-[#f59e0b]">
              Administration
            </p>
            <h1 className="mt-1 font-heading text-2xl font-extrabold tracking-tight text-slate-900">
              Connexion
            </h1>
          </div>
        </div>
        <p className="mt-4 font-sans text-sm leading-relaxed text-slate-600">
          Entrez vos identifiants pour accéder au tableau de bord.
        </p>
        <LoginForm />
        <p className="mt-6 text-center">
          <Link
            href="/"
            className="font-heading text-xs font-bold uppercase tracking-[0.16em] text-[#6d28d9] hover:text-violet-800"
          >
            Retour au site
          </Link>
        </p>
      </div>
    </div>
  );
}
