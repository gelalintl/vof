import type { NextRequest } from "next/server";
import { protectAdminRoutes } from "@/lib/adminGuard";

export async function proxy(request: NextRequest) {
  return protectAdminRoutes(request);
}

export const config = {
  matcher: ["/admin", "/admin/:path*"],
};
