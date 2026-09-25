import { NextResponse, type NextRequest } from "next/server";
import { ADMIN_SESSION_COOKIE, decryptSession } from "@/lib/session";

export async function protectAdminRoutes(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const isLogin = pathname === "/admin/login";
  const session = await decryptSession(request.cookies.get(ADMIN_SESSION_COOKIE)?.value);

  if (!session && !isLogin) {
    const loginUrl = new URL("/admin/login", request.url);
    loginUrl.searchParams.set("from", pathname);
    return NextResponse.redirect(loginUrl);
  }

  if (session && isLogin) {
    return NextResponse.redirect(new URL("/admin", request.url));
  }

  return NextResponse.next();
}
