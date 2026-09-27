import { NextResponse, type NextRequest } from "next/server";
import {
  ADMIN_SESSION_COOKIE,
  clearSessionCookie,
  decryptSession,
} from "@/lib/session";

const LOGIN_PATH = "/admin/login";
const ADMIN_HOME_PATH = "/admin/evenements";

function isLoginPath(pathname: string) {
  return pathname === LOGIN_PATH || pathname.startsWith(`${LOGIN_PATH}/`);
}

function isAuthApiPath(pathname: string) {
  return pathname.startsWith("/api/auth");
}

function isStaticOrInternalPath(pathname: string) {
  if (pathname.startsWith("/_next")) {
    return true;
  }

  return /\.(?:ico|png|jpe?g|gif|webp|svg|css|js|map|woff2?|ttf)$/i.test(pathname);
}

function isServerAction(request: NextRequest) {
  return request.headers.has("next-action") || request.headers.has("Next-Action");
}

export async function protectAdminRoutes(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (isAuthApiPath(pathname) || isStaticOrInternalPath(pathname) || isServerAction(request)) {
    return NextResponse.next();
  }

  if (!pathname.startsWith("/admin")) {
    return NextResponse.next();
  }

  const token = request.cookies.get(ADMIN_SESSION_COOKIE)?.value;
  const session = await decryptSession(token);
  const hasCorruptCookie = Boolean(token) && !session;

  if (isLoginPath(pathname)) {
    if (session) {
      return NextResponse.redirect(new URL(ADMIN_HOME_PATH, request.url));
    }

    const response = NextResponse.next();
    if (hasCorruptCookie) {
      clearSessionCookie(response.cookies);
    }
    return response;
  }

  if (!session) {
    const response = NextResponse.redirect(new URL(LOGIN_PATH, request.url));
    if (hasCorruptCookie) {
      clearSessionCookie(response.cookies);
    }
    return response;
  }

  return NextResponse.next();
}
