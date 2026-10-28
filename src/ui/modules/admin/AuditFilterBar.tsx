"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { AUDIT_ACTIONS } from "@/lib/auditConstants";
import type { AuditFilterUser } from "@/types";
import { AdminLabel } from "./AdminPageHeader";
import { adminFieldClass } from "./adminStyles";

const SORT_OPTIONS = [
  { value: "recent", label: "Date récente" },
  { value: "oldest", label: "Date ancienne" },
  { value: "user", label: "Utilisateur de A à Z" },
] as const;

export function AuditFilterBar({ users }: { users: AuditFilterUser[] }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const search = searchParams.get("search") ?? "";
  const action = searchParams.get("action") ?? "";
  const date = searchParams.get("date") ?? "";
  const user = searchParams.get("user") ?? "";
  const sort = searchParams.get("sort") ?? "recent";
  const [query, setQuery] = useState(search);

  useEffect(() => {
    setQuery(search);
  }, [search]);

  function apply(updates: Record<string, string>) {
    const params = new URLSearchParams(searchParams.toString());
    for (const [key, value] of Object.entries(updates)) {
      const trimmed = value.trim();
      if (trimmed && !(key === "sort" && trimmed === "recent")) {
        params.set(key, trimmed);
      } else {
        params.delete(key);
      }
    }
    params.set("page", "1");
    const queryString = params.toString();
    router.push(queryString ? `/sacristie/rapports?${queryString}` : "/sacristie/rapports");
  }

  useEffect(() => {
    if (query.trim() === search) {
      return;
    }
    const timer = window.setTimeout(() => {
      const params = new URLSearchParams(searchParams.toString());
      const trimmed = query.trim();
      if (trimmed) {
        params.set("search", trimmed);
      } else {
        params.delete("search");
      }
      params.set("page", "1");
      const queryString = params.toString();
      router.push(queryString ? `/sacristie/rapports?${queryString}` : "/sacristie/rapports");
    }, 300);
    return () => window.clearTimeout(timer);
  }, [query, search, router, searchParams]);

  const userOptions =
    user && !users.some((item) => item.id === user)
      ? [{ id: user, name: "Compte retiré" }, ...users]
      : users;

  return (
    <div className="mb-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
      <label className="block">
        <AdminLabel>Recherche</AdminLabel>
        <input
          type="search"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Nom de l'élément"
          className={adminFieldClass}
        />
      </label>
      <label className="block">
        <AdminLabel>Action</AdminLabel>
        <select
          value={action}
          onChange={(event) => apply({ action: event.target.value })}
          className={adminFieldClass}
        >
          <option value="">Tous</option>
          {AUDIT_ACTIONS.map((item) => (
            <option key={item} value={item}>
              {item}
            </option>
          ))}
        </select>
      </label>
      <label className="block">
        <AdminLabel>Utilisateur</AdminLabel>
        <select
          value={user}
          onChange={(event) => apply({ user: event.target.value })}
          className={adminFieldClass}
        >
          <option value="">Tous</option>
          {userOptions.map((item) => (
            <option key={item.id} value={item.id}>
              {item.name}
            </option>
          ))}
        </select>
      </label>
      <label className="block">
        <AdminLabel>Date</AdminLabel>
        <input
          type="date"
          value={date}
          onChange={(event) => apply({ date: event.target.value })}
          className={adminFieldClass}
        />
      </label>
      <label className="block">
        <AdminLabel>Tri</AdminLabel>
        <select
          value={SORT_OPTIONS.some((item) => item.value === sort) ? sort : "recent"}
          onChange={(event) => apply({ sort: event.target.value })}
          className={adminFieldClass}
        >
          {SORT_OPTIONS.map((item) => (
            <option key={item.value} value={item.value}>
              {item.label}
            </option>
          ))}
        </select>
      </label>
    </div>
  );
}
