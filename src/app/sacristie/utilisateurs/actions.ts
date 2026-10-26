"use server";

// Rôles :
//  - SUPERADMIN : voit et gère tous les comptes (création, édition, mot de passe, suppression).
//  - ADMIN      : ne voit et ne peut modifier QUE son propre compte (nom, email, mot de passe).
// Le compte SUPERADMIN n'est donc jamais visible ni atteignable par un ADMIN.

import { revalidatePath } from "next/cache";
import bcrypt from "bcryptjs";
import { requireRecordId } from "@/lib/adminActionUtils";
import { requireAdmin } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import type {
  AdminSessionUser,
  AdminUserRecord,
  AdminUserRole,
  CreateAdminUserInput,
  UpdateAdminUserInput,
} from "@/types";

const BCRYPT_ROUNDS = 10;
const MIN_PASSWORD_LENGTH = 8;
const MAX_PASSWORD_LENGTH = 72; // limite de bcrypt
const MAX_NAME_LENGTH = 120;
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const NOT_FOUND = "Utilisateur introuvable.";

const userSelect = {
  id: true,
  name: true,
  email: true,
  role: true,
  createdAt: true,
} as const;

function isSuperAdmin(user: AdminSessionUser) {
  return user.role === "SUPERADMIN";
}

function validatePassword(password: string) {
  if (password.length < MIN_PASSWORD_LENGTH) {
    throw new Error(`Le mot de passe doit contenir au moins ${MIN_PASSWORD_LENGTH} caractères.`);
  }
  if (password.length > MAX_PASSWORD_LENGTH) {
    throw new Error(`Le mot de passe ne doit pas dépasser ${MAX_PASSWORD_LENGTH} caractères.`);
  }
}

function normalizeProfile(input: { name?: unknown; email?: unknown }) {
  const name = String(input?.name ?? "").trim();
  const email = String(input?.email ?? "").trim().toLowerCase();

  if (!name) {
    throw new Error("Le nom est obligatoire.");
  }
  if (name.length > MAX_NAME_LENGTH) {
    throw new Error("Le nom est trop long.");
  }
  // Un « @ » dans le nom le ferait confondre avec une adresse e-mail à la connexion.
  if (name.includes("@")) {
    throw new Error("Le nom ne peut pas contenir le caractère « @ ».");
  }
  if (!EMAIL_PATTERN.test(email)) {
    throw new Error("L'adresse e-mail est invalide.");
  }
  return { name, email };
}

/** Le nom sert d'identifiant de connexion : il doit être unique (insensible à la casse). */
async function assertNameAvailable(name: string, excludeId?: string) {
  const duplicate = await prisma.user.findFirst({
    where: {
      name: { equals: name, mode: "insensitive" },
      ...(excludeId ? { id: { not: excludeId } } : {}),
    },
    select: { id: true },
  });
  if (duplicate) {
    throw new Error("Ce nom est déjà utilisé par un autre compte.");
  }
}

/**
 * Un ADMIN ne peut cibler que son propre compte ; pour tout autre compte on répond
 * « introuvable » afin de ne pas révéler son existence.
 */
function assertCanTarget(actor: AdminSessionUser, targetId: string) {
  if (!isSuperAdmin(actor) && targetId !== actor.id) {
    throw new Error(NOT_FOUND);
  }
}

function toRecord(
  user: {
    id: string;
    name: string | null;
    email: string;
    role: string;
    createdAt: Date;
  },
  actor: AdminSessionUser,
): AdminUserRecord {
  return {
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role as AdminUserRole,
    createdAt: user.createdAt.toISOString(),
    isCurrent: user.id === actor.id,
  };
}

function revalidateUsers() {
  revalidatePath("/sacristie/utilisateurs");
}

/**
 * Liste des comptes visibles par l'utilisateur connecté.
 * SUPERADMIN : tous les comptes. ADMIN : uniquement le sien.
 * Le hash du mot de passe n'est JAMAIS sélectionné ni renvoyé.
 */
export async function getUsers(): Promise<AdminUserRecord[]> {
  const actor = await requireAdmin();

  const users = await prisma.user.findMany({
    where: isSuperAdmin(actor) ? undefined : { id: actor.id },
    select: userSelect,
    orderBy: { createdAt: "asc" },
  });

  return users.map((user) => toRecord(user, actor));
}

/** Création réservée au SUPERADMIN ; les comptes créés ont toujours le rôle ADMIN. */
export async function createUser(data: CreateAdminUserInput): Promise<AdminUserRecord> {
  const actor = await requireAdmin();
  if (!isSuperAdmin(actor)) {
    throw new Error("Seul le super-administrateur peut créer des comptes.");
  }

  const { name, email } = normalizeProfile(data);
  const password = String(data?.password ?? "");
  validatePassword(password);

  const existing = await prisma.user.findUnique({
    where: { email },
    select: { id: true },
  });
  if (existing) {
    throw new Error("Un compte existe déjà avec cette adresse e-mail.");
  }
  await assertNameAvailable(name);

  const passwordHash = await bcrypt.hash(password, BCRYPT_ROUNDS);

  const user = await prisma.user.create({
    data: { name, email, passwordHash, role: "ADMIN" },
    select: userSelect,
  });

  revalidateUsers();
  return toRecord(user, actor);
}

/** Modification du nom et de l'e-mail (son propre compte, ou n'importe lequel pour le SUPERADMIN). */
export async function updateUser(
  id: string,
  data: UpdateAdminUserInput,
): Promise<AdminUserRecord> {
  const actor = await requireAdmin();
  const userId = requireRecordId(id);
  assertCanTarget(actor, userId);

  const { name, email } = normalizeProfile(data);

  const existing = await prisma.user.findUnique({
    where: { id: userId },
    select: { id: true },
  });
  if (!existing) {
    throw new Error(NOT_FOUND);
  }

  const duplicate = await prisma.user.findUnique({
    where: { email },
    select: { id: true },
  });
  if (duplicate && duplicate.id !== userId) {
    throw new Error("Un compte existe déjà avec cette adresse e-mail.");
  }
  await assertNameAvailable(name, userId);

  const user = await prisma.user.update({
    where: { id: userId },
    data: { name, email },
    select: userSelect,
  });

  revalidateUsers();
  return toRecord(user, actor);
}

/**
 * - Son propre mot de passe : l'ancien mot de passe est OBLIGATOIRE (tous rôles, SUPERADMIN compris).
 * - Mot de passe d'un autre compte : réinitialisation réservée au SUPERADMIN, sans ancien mot de passe.
 */
export async function updateUserPassword(
  id: string,
  newPassword: string,
  currentPassword?: string,
) {
  const actor = await requireAdmin();
  const userId = requireRecordId(id);
  assertCanTarget(actor, userId);
  validatePassword(String(newPassword ?? ""));

  const existing = await prisma.user.findUnique({
    where: { id: userId },
    select: { id: true, passwordHash: true },
  });
  if (!existing) {
    throw new Error(NOT_FOUND);
  }

  if (userId === actor.id) {
    const current = String(currentPassword ?? "");
    if (!current) {
      throw new Error("Saisissez votre mot de passe actuel.");
    }
    const matches = await bcrypt.compare(current, existing.passwordHash);
    if (!matches) {
      throw new Error("Le mot de passe actuel est incorrect.");
    }
    if (current === newPassword) {
      throw new Error("Le nouveau mot de passe doit être différent de l'ancien.");
    }
  } else if (!isSuperAdmin(actor)) {
    // Garde-fou : normalement déjà bloqué par assertCanTarget.
    throw new Error(NOT_FOUND);
  }

  const passwordHash = await bcrypt.hash(newPassword, BCRYPT_ROUNDS);
  await prisma.user.update({
    where: { id: userId },
    data: { passwordHash },
  });

  revalidateUsers();
}

/** Suppression réservée au SUPERADMIN. Ni son propre compte, ni un SUPERADMIN, ni le dernier compte. */
export async function deleteUser(id: string) {
  const actor = await requireAdmin();
  if (!isSuperAdmin(actor)) {
    throw new Error("Seul le super-administrateur peut supprimer des comptes.");
  }
  const userId = requireRecordId(id);

  if (userId === actor.id) {
    throw new Error("Vous ne pouvez pas supprimer le compte avec lequel vous êtes connecté.");
  }

  // Vérifications et suppression dans la même transaction.
  await prisma.$transaction(async (tx) => {
    const total = await tx.user.count();
    if (total <= 1) {
      throw new Error(
        "Impossible de supprimer le dernier compte : l'accès à l'administration serait définitivement verrouillé.",
      );
    }

    const target = await tx.user.findUnique({
      where: { id: userId },
      select: { id: true, role: true },
    });
    if (!target) {
      throw new Error(NOT_FOUND);
    }
    if (target.role === "SUPERADMIN") {
      throw new Error("Le compte super-administrateur ne peut pas être supprimé.");
    }

    await tx.user.delete({ where: { id: userId } });
  });

  revalidateUsers();
}
