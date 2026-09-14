import type { FeatureCardData, FeatureCardTone } from "@/types";
import { cn } from "@/utils/cn";

const toneClasses: Record<FeatureCardTone, string> = {
  brand: "bg-violet-700/10 border-violet-500/20 text-violet-700",
  secondary: "bg-sky-600/10 border-sky-500/20 text-sky-600",
  accent: "bg-amber-500/10 border-amber-400/20 text-amber-600",
};

export interface FeatureCardProps {
  card: FeatureCardData;
}

export function FeatureCard({ card }: FeatureCardProps) {
  return (
    <article
      className={cn(
        "rounded-3xl border border-white/20 p-6 backdrop-blur-md",
        toneClasses[card.tone ?? "brand"],
      )}
    >
      <h3 className="font-heading text-xl font-extrabold tracking-tight">
        {card.title}
      </h3>
      <p className="mt-2 font-sans text-sm leading-relaxed text-slate-800">
        {card.text}
      </p>
    </article>
  );
}

export interface FeatureCardGridProps {
  cards: FeatureCardData[];
  className?: string;
}

export function FeatureCardGrid({ cards, className }: FeatureCardGridProps) {
  return (
    <div className={cn("grid gap-4 md:grid-cols-3", className)}>
      {cards.map((card) => (
        <FeatureCard key={card.id} card={card} />
      ))}
    </div>
  );
}
