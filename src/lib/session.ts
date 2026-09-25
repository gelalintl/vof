import type { AdminSessionUser } from "@/types";

export const ADMIN_SESSION_COOKIE = "vof_admin_session";
export const ADMIN_SESSION_MAX_AGE = 60 * 60 * 24 * 7;

export interface AdminSessionPayload extends AdminSessionUser {
  exp: number;
}

function getSecret() {
  return process.env.AUTH_SECRET?.trim() || "vof-dev-auth-secret-change-me";
}

async function getCryptoKey() {
  const digest = await crypto.subtle.digest(
    "SHA-256",
    new TextEncoder().encode(getSecret()),
  );
  return crypto.subtle.importKey("raw", digest, "AES-GCM", false, ["encrypt", "decrypt"]);
}

function toBase64Url(bytes: Uint8Array) {
  let binary = "";
  for (const byte of bytes) {
    binary += String.fromCharCode(byte);
  }
  return btoa(binary).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/g, "");
}

function fromBase64Url(value: string) {
  const padded = value.replace(/-/g, "+").replace(/_/g, "/");
  const pad = padded.length % 4 === 0 ? "" : "=".repeat(4 - (padded.length % 4));
  const binary = atob(padded + pad);
  return Uint8Array.from(binary, (char) => char.charCodeAt(0));
}

export async function encryptSession(user: AdminSessionUser): Promise<string> {
  const payload: AdminSessionPayload = {
    ...user,
    exp: Math.floor(Date.now() / 1000) + ADMIN_SESSION_MAX_AGE,
  };
  const key = await getCryptoKey();
  const iv = crypto.getRandomValues(new Uint8Array(12));
  const encoded = new TextEncoder().encode(JSON.stringify(payload));
  const cipher = await crypto.subtle.encrypt({ name: "AES-GCM", iv }, key, encoded);

  return `${toBase64Url(iv)}.${toBase64Url(new Uint8Array(cipher))}`;
}

export async function decryptSession(token: string | undefined | null): Promise<AdminSessionUser | null> {
  if (!token) {
    return null;
  }

  const [ivPart, dataPart] = token.split(".");
  if (!ivPart || !dataPart) {
    return null;
  }

  try {
    const key = await getCryptoKey();
    const iv = fromBase64Url(ivPart);
    const data = fromBase64Url(dataPart);
    const decrypted = await crypto.subtle.decrypt({ name: "AES-GCM", iv }, key, data);
    const payload = JSON.parse(new TextDecoder().decode(decrypted)) as AdminSessionPayload;

    if (!payload.id || !payload.email || !payload.exp || payload.exp < Math.floor(Date.now() / 1000)) {
      return null;
    }

    return {
      id: payload.id,
      email: payload.email,
      role: payload.role,
    };
  } catch {
    return null;
  }
}

export function sessionCookieOptions() {
  return {
    httpOnly: true,
    sameSite: "lax" as const,
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: ADMIN_SESSION_MAX_AGE,
  };
}
