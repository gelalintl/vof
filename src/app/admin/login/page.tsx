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
    <div className="flex min-h-screen items-center justify-center bg-cream px-4 py-12">
      <div className="w-full max-w-md border border-burgundy/15 bg-white p-8 shadow-sm">
        <div className="flex items-center gap-3">
          <Logo imageSrc={logoSrc} showWordmark={false} markClassName="size-12" />
          <div>
            <p className="font-heading text-xs font-bold uppercase tracking-[0.22em] text-gold">
              Administration
            </p>
            <h1 className="mt-1 font-heading text-2xl font-extrabold tracking-tight text-burgundy">
              Connexion
            </h1>
          </div>
        </div>
        <p className="mt-4 font-sans text-sm leading-relaxed text-[#2C2424]/70">
          Entrez vos identifiants pour accéder au tableau de bord.
        </p>
        <LoginForm />
        <p className="mt-6 text-center">
          <Link
            href="/"
            className="font-heading text-xs font-bold uppercase tracking-[0.16em] text-burgundy/70 hover:text-burgundy"
          >
            Retour au site
          </Link>
        </p>
      </div>
    </div>
  );
}
