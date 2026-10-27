import { unlink } from "node:fs/promises";
import path from "node:path";
import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import { MEDIA_BUCKET, objectPathFromPublicUrl, supabaseProjectOrigin } from "@/lib/storage/mediaUrl";

export const MAX_UPLOAD_BYTES = 10 * 1024 * 1024;

export type UploadSuccess = { success: true; url: string };
export type UploadFailure = { success: false; error: string };
export type UploadResult = UploadSuccess | UploadFailure;

export function isUploadFailure(value: unknown): value is UploadFailure {
  return (
    typeof value === "object" &&
    value !== null &&
    "success" in value &&
    (value as { success: unknown }).success === false &&
    "error" in value &&
    typeof (value as { error: unknown }).error === "string"
  );
}

function plainMessage(error: unknown, fallback: string) {
  if (typeof error === "string" && error.trim()) {
    return error.trim();
  }
  if (error && typeof error === "object" && "message" in error) {
    const message = (error as { message: unknown }).message;
    if (typeof message === "string" && message.trim()) {
      return message.trim();
    }
  }
  return fallback;
}

function storageClient(): { client: SupabaseClient } | UploadFailure {
  const url = supabaseProjectOrigin();
  const key = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY?.trim();
  if (!url || !key) {
    return {
      success: false,
      error:
        "La configuration Supabase est incomplète. Renseignez NEXT_PUBLIC_SUPABASE_URL (https://….supabase.co) et NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY.",
    };
  }

  return {
    client: createClient(url, key, {
      auth: { persistSession: false, autoRefreshToken: false },
    }),
  };
}

async function deleteLegacyLocalFile(url: string) {
  if (!url.startsWith("/uploads/")) {
    return;
  }

  const filename = path.basename(url);
  if (!filename || filename === "." || filename === "..") {
    return;
  }

  await unlink(path.join(process.cwd(), "public", "uploads", filename)).catch(() => undefined);
}

export async function uploadSupabaseFile(file: File): Promise<UploadResult> {
  try {
    if (!file || typeof file.arrayBuffer !== "function") {
      return { success: false, error: "Fichier invalide." };
    }
    if (file.size === 0) {
      return { success: false, error: "Le fichier est vide." };
    }
    if (file.size > MAX_UPLOAD_BYTES) {
      return { success: false, error: "Le fichier dépasse la taille maximale de 10 Mo." };
    }
    if (file.type && !file.type.startsWith("image/")) {
      return { success: false, error: "Seules les images sont acceptées." };
    }

    const storage = storageClient();
    if ("success" in storage) {
      return storage;
    }

    const safeName = path.basename(file.name).replace(/[^\w.\-]+/g, "_") || "image";
    const objectPath = `${Date.now()}-${safeName}`;
    const { error } = await storage.client.storage.from(MEDIA_BUCKET).upload(objectPath, file, {
      contentType: file.type || undefined,
      upsert: false,
    });

    if (error) {
      return {
        success: false,
        error: plainMessage(error, "Le téléversement vers le stockage a échoué."),
      };
    }

    const { data } = storage.client.storage.from(MEDIA_BUCKET).getPublicUrl(objectPath);
    const url = data?.publicUrl;
    if (typeof url !== "string" || !url) {
      return { success: false, error: "L'URL publique du fichier est indisponible." };
    }

    return { success: true, url };
  } catch (error) {
    return { success: false, error: plainMessage(error, "Le téléversement vers le stockage a échoué.") };
  }
}

export async function deleteSupabaseFile(
  url: string | null | undefined,
): Promise<{ success: true } | UploadFailure> {
  try {
    if (!url) {
      return { success: true };
    }
    if (url.startsWith("/uploads/")) {
      await deleteLegacyLocalFile(url);
      return { success: true };
    }

    const objectPath = objectPathFromPublicUrl(url);
    if (!objectPath) {
      return { success: true };
    }

    const storage = storageClient();
    if ("success" in storage) {
      return storage;
    }

    const { error } = await storage.client.storage.from(MEDIA_BUCKET).remove([objectPath]);
    if (error) {
      return {
        success: false,
        error: plainMessage(error, "La suppression du fichier a échoué."),
      };
    }

    return { success: true };
  } catch (error) {
    return { success: false, error: plainMessage(error, "La suppression du fichier a échoué.") };
  }
}
