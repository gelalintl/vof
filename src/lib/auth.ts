"use server";

import { cache } from "react";
import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";
import {
  ADMIN_SESSION_COOKIE,
  clearSessionCookie,
  decryptSession,
  encryptSession,
  sessionCookieOptions,
} from "@/lib/session";
import type { AdminSessionUser } from "@/types";

const INVALID_CREDENTIALS = "Identifiants invalides.";
const DUMMY_HASH = "$2b$10$u33r75MtGavTTadPbKWkOeaE85ZhkZoYGFG6V7z/xBeIHgW7N2wNW";

/**
 * Un identifiant contenant « @ » est une adresse e-mail ; sinon c'est un nom (insensible à la casse).
 * Si plusieurs comptes portaient le même nom (données anciennes), on refuse plutôt que de deviner.
 */
async function findUserByIdentifier(identifier: string) {
  if (identifier.includes("@")) {
    return prisma.user.findUnique({ where: { email: identifier.toLowerCase() } });
  }

  const matches = await prisma.user.findMany({
    where: { name: { equals: identifier, mode: "insensitive" } },
    take: 2,
  });
  return matches.length === 1 ? matches[0] : null;
}

export async function loginAction(formData: FormData): Promise<{ error: string } | void> {
  // L'identifiant peut être l'adresse e-mail OU le nom du compte.
  const identifier = String(formData.get("identifier") ?? formData.get("email") ?? "").trim();
  const password = String(formData.get("password") ?? "");

  if (!identifier || !password) {
    return { error: INVALID_CREDENTIALS };
  }

  try {
    const user = await findUserByIdentifier(identifier);

    const hash = user?.passwordHash ?? DUMMY_HASH;
    const passwordMatches = await bcrypt.compare(password, hash);

    if (!user || !passwordMatches) {
      return { error: INVALID_CREDENTIALS };
    }

    const token = await encryptSession({
      id: user.id,
      email: user.email,
      role: user.role,
    });

    const cookieStore = await cookies();
    cookieStore.set(ADMIN_SESSION_COOKIE, token, sessionCookieOptions());
  } catch (error) {
    const code =
      error && typeof error === "object" && "code" in error
        ? String(error.code)
        : "";
    if (code === "ECONNREFUSED" || code === "P1001") {
      return {
        error:
          "La base de données est inaccessible. Démarrez PostgreSQL (docker compose up -d) puis réessayez.",
      };
    }
    return { error: "Impossible de se connecter pour le moment. Réessayez." };
  }

  redirect("/admin/evenements");
}

export async function logoutAction() {
  const cookieStore = await cookies();
  clearSessionCookie(cookieStore);

  revalidatePath("/", "layout");
  revalidatePath("/admin", "layout");
  revalidatePath("/admin/login");
  revalidatePath("/admin/evenements");

  redirect("/admin/login");
}

export const getCurrentUser = cache(async (): Promise<AdminSessionUser | null> => {
  const cookieStore = await cookies();
  const token = cookieStore.get(ADMIN_SESSION_COOKIE)?.value;
  const session = await decryptSession(token);

  if (!session) {
    if (token) {
      clearSessionCookie(cookieStore);
    }
    return null;
  }

  try {
    const user = await prisma.user.findUnique({
      where: { id: session.id },
      select: { id: true, email: true, role: true },
    });

    if (!user) {
      clearSessionCookie(cookieStore);
      return null;
    }

    return {
      id: user.id,
      email: user.email,
      role: user.role,
    };
  } catch {
    return session;
  }
});

export async function requireAdmin(): Promise<AdminSessionUser> {
  const user = await getCurrentUser();
  if (!user) {
    const cookieStore = await cookies();
    clearSessionCookie(cookieStore);
    redirect("/admin/login");
  }
  return user;
}
