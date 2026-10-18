import { NextResponse, type NextRequest } from "next/server";
import { protectAdminRoutes } from "@/lib/adminGuard";
import {
  defaultLocale,
  isLocale,
  LOCALE_COOKIE,
  LOCALE_COOKIE_MAX_AGE,
  LOCALE_HEADER,
} from "@/i18n/config";
import { localeFromAcceptLanguage } from "@/i18n/routing";

function isLocaleExempt(pathname: string) {
  if (
    pathname.startsWith("/admin") ||
    pathname.startsWith("/api") ||
    pathname.startsWith("/_next") ||
    pathname.startsWith("/icon") ||
    pathname.startsWith("/apple-icon") ||
    pathname.startsWith("/uploads") ||
    pathname.startsWith("/assets")
  ) {
    return true;
  }

  return /\.(?:ico|png|jpe?g|gif|webp|svg|css|js|map|woff2?|ttf|txt|xml)$/i.test(pathname);
}

function preferredLocale(request: NextRequest) {
  const cookie = request.cookies.get(LOCALE_COOKIE)?.value;
  if (isLocale(cookie)) {
    return cookie;
  }
  return localeFromAcceptLanguage(request.headers.get("accept-language"));
}

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (request.headers.has("next-action") || request.headers.has("Next-Action")) {
    return NextResponse.next();
  }

  if (isLocaleExempt(pathname)) {
    return protectAdminRoutes(request);
  }

  const segment = pathname.split("/")[1] ?? "";
  if (isLocale(segment)) {
    const headers = new Headers(request.headers);
    headers.set(LOCALE_HEADER, segment);
    return NextResponse.next({ request: { headers } });
  }

  const locale = preferredLocale(request) || defaultLocale;
  const url = request.nextUrl.clone();
  url.pathname = pathname === "/" ? `/${locale}` : `/${locale}${pathname}`;
  const response = NextResponse.redirect(url);
  response.cookies.set(LOCALE_COOKIE, locale, {
    path: "/",
    maxAge: LOCALE_COOKIE_MAX_AGE,
    sameSite: "lax",
  });
  return response;
}

export const config = {
  matcher: ["/((?!_next/static|_next/image).*)"],
};
