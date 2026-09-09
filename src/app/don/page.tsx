import type { Metadata } from "next";
import { siteConfig } from "@/config/site";
import { MainLayout } from "@/ui/layouts/MainLayout";
import { DonateFlow } from "@/ui/components/DonateFlow";
import { Badge } from "@/ui/design-system/badge";
import { Typography } from "@/ui/design-system/typography";

export const metadata: Metadata = {
  title: "Soutenir",
  description:
    "Soutenez l'œuvre Voice Of Freedom en FCFA : don unique ou récurrent, Mobile Money, carte bancaire ou virement RIB.",
};

export default function DonatePage() {
  return (
    <MainLayout>
      <section className="relative overflow-hidden bg-violet-700 text-white">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_#F59E0B_0%,_transparent_42%)] opacity-30" />
        <div className="relative mx-auto max-w-xl px-4 py-14 sm:px-6">
          <Badge variant="accent">Partenaires</Badge>
          <Typography variant="h1" className="mt-4 text-white">
            Soutenir VOF
          </Typography>
          <Typography variant="lead" className="mt-4 text-white/90">
            Tous les montants sont en FCFA. Même parcours que la modale
            Soutenir : montant, récurrence, puis Mobile Money, carte ou RIB.
          </Typography>
        </div>
      </section>

      <section className="bg-white">
        <div className="mx-auto max-w-xl px-4 py-10 sm:px-6">
          <Typography variant="quote" className="text-center">
            « Que chacun donne comme il l&apos;a résolu en son cœur. »
          </Typography>
          <p className="mt-2 text-center font-sans text-sm text-slate-600">
            2 Corinthiens 9.7 · {siteConfig.legalName}
          </p>
          <div className="mt-10 rounded-3xl bg-slate-50 p-5 ring-1 ring-violet-100 sm:p-8">
            <DonateFlow layout="page" />
          </div>
        </div>
      </section>
    </MainLayout>
  );
}
