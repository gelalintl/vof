import { siteConfig } from "@/config/site";
import { Typography } from "@/ui/design-system/typography";

export function WelcomeWord() {
  return (
    <section className="bg-white">
      <div className="mx-auto max-w-3xl px-4 py-14 text-center sm:px-6">
        <Typography variant="caption" className="uppercase tracking-[0.2em] text-sky-600">
          Mot du {siteConfig.pastoral.senior.role.toLowerCase()}
        </Typography>
        <Typography variant="h2" className="mt-3">
          {siteConfig.pastoral.senior.name}
        </Typography>
        <Typography variant="quote" className="mt-8">
          « Bienvenue dans la famille Voice Of Freedom. Ici, chacun trouve une
          place, une parole et une liberté en Christ. Nous vous attendons avec
          joie, dimanche après dimanche, pour adorer, grandir et servir
          ensemble. »
        </Typography>
        <p className="mt-6 font-heading text-sm font-bold tracking-tight text-violet-700">
          — {siteConfig.pastoral.senior.name}, {siteConfig.pastoral.senior.role}
        </p>
        <p className="mt-2 font-sans text-sm text-slate-600">
          Aux côtés de {siteConfig.pastoral.associate.name},{" "}
          {siteConfig.pastoral.associate.role.toLowerCase()}.
        </p>
      </div>
    </section>
  );
}
