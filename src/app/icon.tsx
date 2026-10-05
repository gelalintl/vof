import {
  churchIconImageMetadata,
  churchIconImageResponse,
} from "@/lib/churchIcon";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const size = { width: 32, height: 32 };
export const contentType = "image/png";

export async function generateImageMetadata() {
  return churchIconImageMetadata(size);
}

export default function Icon() {
  return churchIconImageResponse(size);
}
