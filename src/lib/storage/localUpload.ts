"use server";

import { mkdir, unlink, writeFile } from "node:fs/promises";
import path from "node:path";

const UPLOAD_DIR = path.join(process.cwd(), "public", "uploads");

export async function uploadLocalFile(file: File): Promise<string> {
  if (!file || typeof file.arrayBuffer !== "function") {
    throw new Error("Fichier invalide.");
  }

  if (file.size === 0) {
    throw new Error("Le fichier est vide.");
  }

  if (file.type && !file.type.startsWith("image/")) {
    throw new Error("Seules les images sont acceptées.");
  }

  await mkdir(UPLOAD_DIR, { recursive: true });

  const safeName = path.basename(file.name).replace(/[^\w.\-]+/g, "_") || "image";
  const uniqueName = `${Date.now()}-${safeName}`;
  const destination = path.join(UPLOAD_DIR, uniqueName);
  const buffer = Buffer.from(await file.arrayBuffer());

  await writeFile(destination, buffer);

  return `/uploads/${uniqueName}`;
}

export async function deleteLocalFile(url: string | null | undefined) {
  if (!url || !url.startsWith("/uploads/")) {
    return;
  }

  const filename = path.basename(url);
  if (!filename || filename === "." || filename === "..") {
    return;
  }

  await unlink(path.join(UPLOAD_DIR, filename)).catch(() => undefined);
}
