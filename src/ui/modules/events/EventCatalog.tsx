"use client";

import type { Event, EventCategoryFilter } from "@/types";
import { cn } from "@/utils/cn";
import { EventFilterProvider } from "@/context/EventFilterContext";
import { useEventFilter } from "@/hooks/useEventFilter";
import { EventCard } from "./EventCard";
import { Typography } from "@/ui/design-system/typography";

const filters: { id: EventCategoryFilter; label: string; className: string }[] = [
  { id: "all", label: "Tous", className: "bg-slate-800 text-white" },
  {
    id: "enseignement",
    label: "Enseignements",
    className: "bg-violet-700 text-white",
  },
  { id: "jeunesse", label: "Jeunesse", className: "bg-sky-600 text-white" },
  {
    id: "rassemblement",
    label: "Rassemblements",
    className: "bg-violet-700 text-white",
  },
  { id: "seminaire", label: "Séminaires", className: "bg-red-600 text-white" },
  {
    id: "conference",
    label: "Conférences",
    className: "bg-amber-500 text-slate-900",
  },
];

interface EventCatalogProps {
  events: Event[];
}

export function EventCatalog({ events }: EventCatalogProps) {
  return (
    <EventFilterProvider events={events}>
      <EventCatalogInner />
    </EventFilterProvider>
  );
}

function EventCatalogInner() {
  const { category, setCategory, filteredEvents } = useEventFilter();

  return (
    <section className="bg-white">
      <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
        <Typography variant="h2">Toute la vie de l&apos;église</Typography>
        <div className="mt-6 flex flex-wrap gap-2" role="group" aria-label="Filtres de catégories">
          {filters.map((filter) => {
            const selected = category === filter.id;
            return (
              <button
                key={filter.id}
                type="button"
                onClick={() => setCategory(filter.id)}
                className={cn(
                  "rounded-full px-4 py-2 font-heading text-sm font-bold tracking-tight transition-opacity",
                  filter.className,
                  !selected && "opacity-45 hover:opacity-80",
                )}
              >
                {filter.label}
              </button>
            );
          })}
        </div>

        {filteredEvents.length === 0 ? (
          <p className="mt-10 font-sans text-slate-600">
            Aucun événement dans cette catégorie pour le moment.
          </p>
        ) : (
          <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {filteredEvents.map((event) => (
              <EventCard key={event.id} event={event} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
