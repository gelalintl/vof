"use client";

import {
  createContext,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import type { Event, EventCategoryFilter } from "@/types";

interface EventFilterContextValue {
  category: EventCategoryFilter;
  setCategory: (category: EventCategoryFilter) => void;
  events: Event[];
  filteredEvents: Event[];
}

const EventFilterContext = createContext<EventFilterContextValue | null>(null);

export function EventFilterProvider({
  events,
  children,
}: {
  events: Event[];
  children: ReactNode;
}) {
  const [category, setCategory] = useState<EventCategoryFilter>("all");

  const filteredEvents = useMemo(
    () => events.filter((event) => matchesEventFilter(event, category)),
    [events, category],
  );

  const value = useMemo(
    () => ({ category, setCategory, events, filteredEvents }),
    [category, events, filteredEvents],
  );

  return (
    <EventFilterContext.Provider value={value}>
      {children}
    </EventFilterContext.Provider>
  );
}

export function useEventFilterContext() {
  const context = useContext(EventFilterContext);
  if (!context) {
    throw new Error("useEventFilter doit être utilisé dans EventFilterProvider.");
  }
  return context;
}

export function matchesEventFilter(
  event: Event,
  category: EventCategoryFilter,
) {
  if (category === "all") {
    return true;
  }
  if (category === "rassemblement") {
    return event.kind === "priere";
  }
  if (category === "enseignement") {
    return event.kind === "culte" || event.kind === "enseignement";
  }
  if (category === "seminaire") {
    return event.kind === "seminaire" || event.kind === "special";
  }
  return event.kind === category;
}
