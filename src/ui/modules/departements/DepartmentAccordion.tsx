"use client";

import { useId, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  Baby,
  ChevronDown,
  Clock,
  HandHelping,
  Heart,
  Home,
  Mail,
  Music,
  Users,
  Video,
  Handshake,
} from "lucide-react";
import { departments } from "@/datas/departments";
import type { Department, EventColorToken } from "@/types";
import { cn } from "@/utils/cn";
import { Button } from "@/ui/design-system/button";
import { Typography } from "@/ui/design-system/typography";
import { JoinDepartmentModal } from "@/ui/components/JoinDepartmentModal";

const icons = {
  music: Music,
  heart: Heart,
  handshake: Handshake,
  users: Users,
  baby: Baby,
  video: Video,
  "hand-helping": HandHelping,
  home: Home,
} as const;

const cloudFill: Record<EventColorToken, string> = {
  brand: "text-violet-700",
  secondary: "text-sky-600",
  accent: "text-amber-500",
  impact: "text-red-600",
};

const panelTransition = {
  duration: 0.35,
  ease: [0.22, 1, 0.36, 1] as const,
};

export function DepartmentAccordion() {
  const [openId, setOpenId] = useState<string | null>(departments[0]?.id ?? null);
  const [joining, setJoining] = useState<Department | null>(null);

  return (
    <section className="bg-white" aria-labelledby="liste-departements">
      <div className="mx-auto max-w-3xl px-4 py-10 sm:px-6">
        <Typography id="liste-departements" variant="h2" className="sr-only">
          Liste des départements
        </Typography>
        <ul className="space-y-3">
          {departments.map((department) => (
            <DepartmentItem
              key={department.id}
              department={department}
              isOpen={openId === department.id}
              onToggle={() =>
                setOpenId((current) =>
                  current === department.id ? null : department.id,
                )
              }
              onJoin={() => setJoining(department)}
            />
          ))}
        </ul>
      </div>
      <JoinDepartmentModal
        department={joining}
        isOpen={Boolean(joining)}
        onClose={() => setJoining(null)}
      />
    </section>
  );
}

function DepartmentItem({
  department,
  isOpen,
  onToggle,
  onJoin,
}: {
  department: Department;
  isOpen: boolean;
  onToggle: () => void;
  onJoin: () => void;
}) {
  const panelId = useId();
  const token = department.colorToken ?? "brand";
  const Icon =
    department.icon && department.icon in icons
      ? icons[department.icon as keyof typeof icons]
      : Users;

  return (
    <li className="overflow-hidden rounded-3xl bg-slate-50 ring-1 ring-violet-100">
      <button
        type="button"
        aria-expanded={isOpen}
        aria-controls={panelId}
        onClick={onToggle}
        className="flex w-full items-center gap-3 px-3 py-3 text-left sm:gap-4 sm:px-4"
      >
        <span className="relative grid h-16 w-24 shrink-0 place-items-center sm:h-[4.5rem] sm:w-28">
          <motion.span
            className="absolute inset-0"
            aria-hidden="true"
            animate={{ opacity: isOpen ? 0 : 1 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
          >
            <svg
              viewBox="0 0 200 120"
              className={cn("size-full", cloudFill[token])}
            >
              <path
                fill="currentColor"
                d="M42 92c-20 0-36-14-36-32 0-16 12-30 28-32 4-20 22-34 44-34 16 0 30 7 38 18 9-7 20-11 32-11 28 0 48 18 50 42 18 2 32 18 32 36 0 22-18 38-42 38H42Z"
              />
            </svg>
          </motion.span>
          <Icon
            className={cn(
              "relative z-10 size-6",
              isOpen
                ? cloudFill[token]
                : token === "accent"
                  ? "text-slate-900"
                  : "text-white",
            )}
          />
        </span>
        <span className="min-w-0 flex-1">
          <span className="block font-heading text-base font-bold tracking-tight text-slate-800 sm:text-lg">
            {department.name}
          </span>
          <span className="mt-0.5 block truncate font-sans text-sm text-slate-600">
            {department.leader}
          </span>
        </span>
        <motion.span
          className="inline-flex shrink-0 text-violet-700"
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={panelTransition}
        >
          <ChevronDown className="size-5" />
        </motion.span>
      </button>
      <AnimatePresence initial={false}>
        {isOpen ? (
          <motion.div
            id={panelId}
            key="panel"
            initial={{ height: 0, opacity: 0, y: -10 }}
            animate={{ height: "auto", opacity: 1, y: 0 }}
            exit={{ height: 0, opacity: 0, y: -10 }}
            transition={panelTransition}
            className="overflow-hidden"
          >
            <div className="border-t border-violet-100 px-4 pb-5 pt-3 sm:px-6">
              <Typography variant="body" className="text-slate-600">
                {department.description}
              </Typography>
              <ul className="mt-4 space-y-2 font-sans text-sm text-slate-800">
                {department.meetingSchedule ? (
                  <li className="flex items-center gap-2">
                    <Clock className="size-4 text-sky-600" />
                    {department.meetingSchedule}
                  </li>
                ) : null}
                {department.contact ? (
                  <li className="flex items-center gap-2">
                    <Mail className="size-4 text-sky-600" />
                    {department.contact}
                  </li>
                ) : null}
              </ul>
              <Button variant="accent" size="sm" className="mt-4" onClick={onJoin}>
                Rejoindre ce département
              </Button>
            </div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </li>
  );
}
