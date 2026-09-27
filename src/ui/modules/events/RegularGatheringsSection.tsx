import { Clock } from "lucide-react";
import type { PublicRecurringGathering } from "@/types";
import { SectionHeader } from "@/ui/components/layout";
import { Typography } from "@/ui/design-system/typography";
import { cn } from "@/utils/cn";
import { interactiveCardClass } from "@/utils/theme/interactiveCard";

interface RegularGatheringsSectionProps {
  gatherings: PublicRecurringGathering[];
}

export function RegularGatheringsSection({ gatherings }: RegularGatheringsSectionProps) {
  return (
    <section
      id="rassemblements"
      aria-labelledby="rassemblements-title"
      className="bg-white"
    >
      <div className="mx-auto max-w-6xl px-4 py-14 sm:px-6">
        <SectionHeader
          badge="Rendez-vous réguliers"
          title="Les rassemblements de la semaine"
          titleId="rassemblements-title"
          description="Cultes dominicaux, études bibliques, veillées et temps de jeûne : les créneaux qui rythment la vie communautaire de Voice of Freedom."
        />

        {gatherings.length > 0 ? (
          <div className="mt-10 grid gap-4 overflow-visible sm:grid-cols-2 lg:grid-cols-3">
            {gatherings.map((gathering) => (
              <article
                key={gathering.id}
                className={cn(interactiveCardClass, "flex flex-col px-5 py-6")}
              >
                <span className="flex size-10 items-center justify-center rounded-full bg-[#6d28d9]/10 text-[#6d28d9]">
                  <Clock className="size-4" aria-hidden />
                </span>
                <p className="mt-4 font-heading text-[11px] font-bold uppercase tracking-[0.16em] text-[#6d28d9]">
                  {gathering.scheduleLabel}
                </p>
                <Typography variant="h3" className="mt-1.5 text-slate-900">
                  {gathering.title}
                </Typography>
                <p className="mt-3 font-sans text-sm text-slate-600">
                  {gathering.timeLabel}
                </p>
              </article>
            ))}
          </div>
        ) : (
          <p className="mt-10 font-sans text-sm text-slate-600">
            Les rassemblements récurrents apparaîtront ici dès qu&apos;ils seront
            publiés depuis l&apos;administration.
          </p>
        )}
      </div>
    </section>
  );
}
