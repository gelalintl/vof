import { readFile } from "node:fs/promises";
import path from "node:path";
import { ImageResponse } from "next/og";
import { getChurchLogo } from "@/lib/siteSettings";

export function churchIconCacheId(logoSrc: string | null): string {
  if (!logoSrc) {
    return "default";
  }

  return logoSrc.replace(/[^\w]+/g, "-").replace(/^-+|-+$/g, "") || "logo";
}

function mimeFromFilename(filename: string): string {
  const ext = path.extname(filename).toLowerCase();

  switch (ext) {
    case ".png":
      return "image/png";
    case ".jpg":
    case ".jpeg":
      return "image/jpeg";
    case ".webp":
      return "image/webp";
    case ".gif":
      return "image/gif";
    case ".svg":
      return "image/svg+xml";
    default:
      return "image/png";
  }
}

async function churchLogoDataUri(): Promise<string | null> {
  const logoSrc = await getChurchLogo();
  if (!logoSrc?.startsWith("/uploads/")) {
    return null;
  }

  const filename = path.basename(logoSrc);
  if (!filename || filename === "." || filename === "..") {
    return null;
  }

  try {
    const buffer = await readFile(path.join(process.cwd(), "public", "uploads", filename));
    return `data:${mimeFromFilename(filename)};base64,${buffer.toString("base64")}`;
  } catch {
    return null;
  }
}

function fallbackMark(size: number) {
  const inner = Math.round(size * 0.75);
  const fontSize = Math.max(10, Math.round(size * 0.28));

  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "#0284C7",
      }}
    >
      <div
        style={{
          width: inner,
          height: inner,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#6D28D9",
          borderRadius: "50%",
          color: "white",
          fontSize,
          fontWeight: 800,
          letterSpacing: "-0.04em",
        }}
      >
        VOF
      </div>
    </div>
  );
}

export async function churchIconImageMetadata(size: { width: number; height: number }) {
  const logoSrc = await getChurchLogo();

  return [
    {
      id: churchIconCacheId(logoSrc),
      contentType: "image/png" as const,
      size,
    },
  ];
}

export async function churchIconImageResponse(size: { width: number; height: number }) {
  const headers = {
    "Cache-Control": "public, max-age=0, must-revalidate",
  };

  try {
    const dataUri = await churchLogoDataUri();
    if (dataUri) {
      return new ImageResponse(
        (
          <div
            style={{
              width: "100%",
              height: "100%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              background: "#ffffff",
            }}
          >
            <img
              src={dataUri}
              width={size.width}
              height={size.height}
              style={{ objectFit: "contain" }}
            />
          </div>
        ),
        { ...size, headers },
      );
    }
  } catch {
    // Fallback mark below.
  }

  return new ImageResponse(fallbackMark(size.width), { ...size, headers });
}
