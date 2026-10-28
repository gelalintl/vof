import { Suspense } from "react";
import type { Prisma } from "@/generated/prisma/client";
import { buildAuditLogOrderBy, buildAuditLogWhere } from "@/lib/audit";
import { requirePageRole } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import type { AuditFilterUser, AuditLogRecord } from "@/types";
import { AdminPageHeader, AuditFilterBar, AuditPagination, AuditReportList } from "@/ui/modules/admin";

export const dynamic = "force-dynamic";

const ITEMS_PER_PAGE = 100;

const auditSelect = {
  id: true,
  action: true,
  entity: true,
  entityName: true,
  userName: true,
  createdAt: true,
} as const;

interface AdminAuditPageProps {
  searchParams: Promise<{
    page?: string | string[];
    search?: string | string[];
    action?: string | string[];
    user?: string | string[];
    date?: string | string[];
    sort?: string | string[];
  }>;
}

function firstParam(value: string | string[] | undefined) {
  return (Array.isArray(value) ? value[0] : value)?.trim() ?? "";
}

function readPage(value: string | string[] | undefined) {
  const parsed = Number.parseInt(firstParam(value) || "1", 10);
  if (!Number.isInteger(parsed) || parsed < 1) {
    return 1;
  }
  return parsed;
}

export default async function AdminAuditPage({ searchParams }: AdminAuditPageProps) {
  await requirePageRole(["SUPERADMIN", "ADMIN"]);
  const params = await searchParams;
  const page = readPage(params.page);
  const search = firstParam(params.search);
  const action = firstParam(params.action);
  const user = firstParam(params.user);
  const date = firstParam(params.date);
  const sort = firstParam(params.sort);
  const where: Prisma.AuditLogWhereInput = buildAuditLogWhere({ search, action, user, date });
  const orderBy = buildAuditLogOrderBy(sort);
  const hasFilters = Boolean(search || action || user || date);

  const [rows, totalItems, actors] = await Promise.all([
    prisma.auditLog.findMany({
      where,
      orderBy,
      take: ITEMS_PER_PAGE,
      skip: (page - 1) * ITEMS_PER_PAGE,
      select: auditSelect,
    }),
    prisma.auditLog.count({ where }),
    prisma.auditLog.findMany({
      where: { userId: { not: null } },
      distinct: ["userId"],
      select: {
        userId: true,
        userName: true,
        user: { select: { name: true } },
      },
      orderBy: { userName: "asc" },
    }),
  ]);

  const users: AuditFilterUser[] = actors
    .flatMap((actor) =>
      actor.userId
        ? [{ id: actor.userId, name: actor.user?.name?.trim() || actor.userName }]
        : [],
    )
    .sort((a, b) => a.name.localeCompare(b.name, "fr"));

  const totalPages = Math.ceil(totalItems / ITEMS_PER_PAGE);
  const logs: AuditLogRecord[] = rows.map((row) => ({
    id: row.id,
    action: row.action,
    entity: row.entity,
    entityName: row.entityName,
    userName: row.userName,
    createdAt: row.createdAt.toISOString(),
  }));

  return (
    <div>
      <AdminPageHeader
        kicker="Contrôle"
        title="Rapports"
        description="Journal des créations, modifications et suppressions. Ces traces sont définitives : elles ne peuvent être ni modifiées ni effacées."
      />
      <div className="mt-8">
        <Suspense fallback={null}>
          <AuditFilterBar users={users} />
        </Suspense>
        <AuditReportList
          logs={logs}
          emptyMessage={
            hasFilters
              ? "Aucune action ne correspond à ces critères."
              : "Aucune trace pour le moment."
          }
        />
        <Suspense fallback={null}>
          <AuditPagination currentPage={page} totalPages={totalPages} totalItems={totalItems} />
        </Suspense>
      </div>
    </div>
  );
}
