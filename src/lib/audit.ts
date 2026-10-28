import type { Prisma } from "@/generated/prisma/client";
import { AUDIT_ACTIONS, type AuditAction } from "@/lib/auditConstants";
import { prisma } from "@/lib/prisma";

const MAX_ENTITY_NAME_LENGTH = 180;

export async function logAction(entry: {
  userId: string;
  action: string;
  entity: string;
  entityName: string;
}) {
  const actor = await prisma.user.findUnique({
    where: { id: entry.userId },
    select: { name: true, email: true },
  });
  const userName = actor?.name?.trim() || actor?.email || "Compte inconnu";
  const entityName = entry.entityName.trim().slice(0, MAX_ENTITY_NAME_LENGTH) || entry.entity;

  await prisma.auditLog.create({
    data: {
      action: entry.action.trim(),
      entity: entry.entity.trim(),
      entityName,
      userName,
      userId: actor ? entry.userId : null,
    },
  });
}

export function buildAuditLogWhere(input: {
  search?: string;
  action?: string;
  date?: string;
  user?: string;
}): Prisma.AuditLogWhereInput {
  const where: Prisma.AuditLogWhereInput = {};
  const search = input.search?.trim();
  if (search) {
    where.entityName = { contains: search, mode: "insensitive" };
  }

  if (input.action && AUDIT_ACTIONS.includes(input.action as AuditAction)) {
    where.action = input.action;
  }

  const user = input.user?.trim();
  if (user) {
    where.userId = user;
  }

  const range = dayRange(input.date);
  if (range) {
    where.createdAt = range;
  }

  return where;
}

export function buildAuditLogOrderBy(
  sort: string | undefined,
): Prisma.AuditLogOrderByWithRelationInput {
  if (sort === "oldest") {
    return { createdAt: "asc" };
  }
  if (sort === "user") {
    return { userName: "asc" };
  }
  return { createdAt: "desc" };
}

function dayRange(date: string | undefined): { gte: Date; lt: Date } | null {
  if (!date || !/^\d{4}-\d{2}-\d{2}$/.test(date)) {
    return null;
  }
  const start = new Date(`${date}T00:00:00+01:00`);
  if (Number.isNaN(start.getTime())) {
    return null;
  }
  return { gte: start, lt: new Date(start.getTime() + 86_400_000) };
}
