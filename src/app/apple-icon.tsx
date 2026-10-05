import {
  churchIconImageMetadata,
  churchIconImageResponse,
} from "@/lib/churchIcon";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const size = { width: 180, height: 180 };
export const contentType = "image/png";

export async function generateImageMetadata() {
  return churchIconImageMetadata(size);
}

export default function AppleIcon() {
  return churchIconImageResponse(size);
}
