"use server";

import { cache } from "react";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";
import {
  ADMIN_SESSION_COOKIE,
  decryptSession,
  encryptSession,
  sessionCookieOptions,
} from "@/lib/session";
import type { AdminSessionUser } from "@/types";

const INVALID_CREDENTIALS = "Identifiants invalides.";
const DUMMY_HASH = "$2b$10$u33r75MtGavTTadPbKWkOeaE85ZhkZoYGFG6V7z/xBeIHgW7N2wNW";

export async function loginAction(formData: FormData): Promise<{ error: string } | void> {
  const email = String(formData.get("email") ?? "").trim().toLowerCase();
  const password = String(formData.get("password") ?? "");

  if (!email || !password) {
    return { error: INVALID_CREDENTIALS };
  }

  const user = await prisma.user.findUnique({
    where: { email },
  });

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

  redirect("/admin");
}

export async function logoutAction() {
  const cookieStore = await cookies();
  cookieStore.delete(ADMIN_SESSION_COOKIE);
  redirect("/admin/login");
}

export const getCurrentUser = cache(async (): Promise<AdminSessionUser | null> => {
  const cookieStore = await cookies();
  const session = await decryptSession(cookieStore.get(ADMIN_SESSION_COOKIE)?.value);

  if (!session) {
    return null;
  }

  try {
    const user = await prisma.user.findUnique({
      where: { id: session.id },
      select: { id: true, email: true, role: true },
    });

    if (!user) {
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
    redirect("/admin/login");
  }
  return user;
}
