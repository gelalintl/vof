import type { Metadata } from "next";
import { siteConfig } from "@/config/site";
import { CalendarWidget } from "@/ui/components/CalendarWidget";
import { MainLayout } from "@/ui/layouts/MainLayout";
import { PastoralTeam } from "@/ui/modules/a-propos/PastoralTeam";
import { Badge } from "@/ui/design-system/badge";
import { Typography } from "@/ui/design-system/typography";
import { cn } from "@/utils/cn";

export const metadata: Metadata = {
  title: "À propos",
  description:
    "Vision, équipe pastorale et agenda de l'Église Voice Of Freedom.",
};

const pillars = [
  {
    title: "Adorer",
    text: "Un culte vivant, centré sur Christ, chaque dimanche à 9h00.",
    tone: "bg-violet-700/10 border-violet-500/20 text-violet-700",
  },
  {
    title: "Grandir",
    text: "La Parole enseignée pour former des disciples libres et enracinés.",
    tone: "bg-sky-600/10 border-sky-500/20 text-sky-600",
  },
  {
    title: "Servir",
    text: "Une famille qui aime la ville et porte l'Évangile avec compassion.",
    tone: "bg-amber-500/10 border-amber-400/20 text-amber-600",
  },
] as const;

export default function AboutPage() {
  return (
    <MainLayout>
      <section className="relative overflow-hidden bg-violet-700 text-white">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_#0284C7_0%,_transparent_46%)] opacity-40" />
        <div className="relative mx-auto max-w-6xl px-4 py-14 sm:px-6">
          <Badge variant="accent">À propos</Badge>
          <Typography variant="h1" className="mt-4 text-white">
            La vision Voice Of Freedom
          </Typography>
          <Typography variant="lead" className="mt-4 max-w-2xl text-white/90">
            {siteConfig.tagline}. Nous bâtissons une église familiale où
            l&apos;adoration, la Parole et le service libèrent une génération.
          </Typography>
        </div>
      </section>

      <section className="bg-slate-50">
        <div className="mx-auto max-w-6xl px-4 py-14 sm:px-6">
          <Typography variant="h2">Ce qui nous anime</Typography>
          <Typography variant="quote" className="mt-6 max-w-3xl">
            « Verset annuel de l'église »
          </Typography>
          <Typography variant="caption" className="mt-2">
            Référence biblique du verset annuel de l'église
          </Typography>
          <div className="mt-10 grid gap-4 md:grid-cols-3">
            {pillars.map((pillar) => (
              <article key={pillar.title} className={cnCard(pillar.tone)}>
                <h3 className="font-heading text-xl font-extrabold tracking-tight">
                  {pillar.title}
                </h3>
                <p className="mt-2 font-sans text-sm leading-relaxed text-slate-800">
                  {pillar.text}
                </p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <PastoralTeam />
      <CalendarWidget />
    </MainLayout>
  );
}

function cnCard(tone: string) {
  return cn(
    "rounded-3xl border border-white/20 p-6 backdrop-blur-md",
    tone,
  );
}
