import type { AuditLogRecord } from "@/types";
import { AdminBadge } from "@/ui/modules/admin/AdminBadge";
import { AdminEmptyState } from "@/ui/modules/admin/AdminPageHeader";
import { cn } from "@/utils/cn";

const actionStyles: Record<string, string> = {
  "CRÉATION": "border-amber-200 bg-amber-50 text-amber-800",
  "MODIFICATION": "border-sky-200 bg-sky-50 text-sky-700",
  "SUPPRESSION": "border-red-200 bg-red-50 text-red-700",
};

function formatAuditDate(iso: string) {
  return new Intl.DateTimeFormat("fr-FR", {
    dateStyle: "medium",
    timeStyle: "short",
    timeZone: "Africa/Niamey",
  }).format(new Date(iso));
}

function ActionBadge({ action }: { action: string }) {
  return <AdminBadge className={actionStyles[action] ?? "border-slate-200 bg-slate-50 text-slate-700"}>{action}</AdminBadge>;
}

export function AuditReportList({
  logs,
  emptyMessage = "Aucune trace pour le moment.",
}: {
  logs: AuditLogRecord[];
  emptyMessage?: string;
}) {
  if (logs.length === 0) {
    return <AdminEmptyState>{emptyMessage}</AdminEmptyState>;
  }

  return (
    <>
      <ul className="space-y-3 md:hidden">
        {logs.map((log) => (
          <li key={log.id} className="border border-slate-200 bg-white p-4 shadow-sm">
            <div className="flex items-start justify-between gap-3">
              <ActionBadge action={log.action} />
              <time className="text-right text-xs text-slate-500" dateTime={log.createdAt}>
                {formatAuditDate(log.createdAt)}
              </time>
            </div>
            <p className="mt-3 font-heading text-base font-bold text-slate-900">{log.entityName}</p>
            <p className="mt-1 text-sm text-slate-600">
              {log.entity}
              <span className="text-slate-300"> · </span>
              {log.userName}
            </p>
          </li>
        ))}
      </ul>

      <div className="hidden overflow-x-auto border border-slate-200 bg-white shadow-sm md:block">
        <table className="w-full min-w-[40rem] text-left text-sm">
          <thead className="border-b border-slate-200 bg-slate-50">
            <tr className="font-heading text-xs font-bold uppercase tracking-[0.14em] text-slate-500">
              <th className="px-4 py-3">Date</th>
              <th className="px-4 py-3">Utilisateur</th>
              <th className="px-4 py-3">Action</th>
              <th className="px-4 py-3">Élément</th>
            </tr>
          </thead>
          <tbody>
            {logs.map((log) => (
              <tr key={log.id} className={cn("border-b border-slate-100 last:border-b-0")}>
                <td className="whitespace-nowrap px-4 py-3 text-slate-600">
                  <time dateTime={log.createdAt}>{formatAuditDate(log.createdAt)}</time>
                </td>
                <td className="px-4 py-3 font-medium text-slate-900">{log.userName}</td>
                <td className="px-4 py-3">
                  <ActionBadge action={log.action} />
                </td>
                <td className="px-4 py-3 text-slate-800">
                  <span className="font-heading text-xs font-bold uppercase tracking-[0.12em] text-[#6d28d9]">
                    {log.entity}
                  </span>
                  <span className="mt-1 block text-slate-900">{log.entityName}</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}
