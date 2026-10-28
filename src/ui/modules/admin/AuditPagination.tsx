"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { adminGhostButtonClass } from "./adminStyles";

interface AuditPaginationProps {
  currentPage: number;
  totalPages: number;
  totalItems: number;
}

export function AuditPagination({ currentPage, totalPages, totalItems }: AuditPaginationProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const atStart = currentPage <= 1;
  const atEnd = currentPage >= totalPages;
  const actionLabel = totalItems === 1 ? "action" : "actions";
  const pageCount = Math.max(totalPages, 1);

  function go(page: number) {
    const params = new URLSearchParams(searchParams.toString());
    params.set("page", String(page));
    router.push(`/sacristie/rapports?${params.toString()}`);
  }

  return (
    <div className="mt-6 flex flex-col gap-3 border border-slate-200 bg-white px-4 py-3 sm:flex-row sm:items-center sm:justify-between">
      <p className="font-heading text-sm font-semibold text-slate-700">
        Page {currentPage} sur {pageCount} (Total : {totalItems} {actionLabel})
      </p>
      <div className="flex gap-2">
        <button
          type="button"
          className={`${adminGhostButtonClass} disabled:cursor-not-allowed disabled:opacity-40`}
          onClick={() => go(currentPage - 1)}
          disabled={atStart}
        >
          Précédent
        </button>
        <button
          type="button"
          className={`${adminGhostButtonClass} disabled:cursor-not-allowed disabled:opacity-40`}
          onClick={() => go(currentPage + 1)}
          disabled={atEnd}
        >
          Suivant
        </button>
      </div>
    </div>
  );
}
