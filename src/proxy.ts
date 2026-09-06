import { NextRequest, NextResponse } from "next/server";

import {
  isLocale,
  localeFromAcceptLanguage,
  LOCALE_COOKIE,
  LOCALE_HEADER,
} from "@/system/locale";

export function proxy(request: NextRequest) {
  const queryLocale = request.nextUrl.searchParams.get("lang");
  const cookieLocale = request.cookies.get(LOCALE_COOKIE)?.value;
  const locale = isLocale(queryLocale)
    ? queryLocale
    : isLocale(cookieLocale)
      ? cookieLocale
      : localeFromAcceptLanguage(request.headers.get("accept-language"));
  const requestHeaders = new Headers(request.headers);
  requestHeaders.set(LOCALE_HEADER, locale);
  const response = NextResponse.next({ request: { headers: requestHeaders } });
  response.headers.append("Vary", "Accept-Language, Cookie");
  if (isLocale(queryLocale) || !isLocale(cookieLocale)) {
    response.cookies.set(LOCALE_COOKIE, locale, {
      maxAge: 60 * 60 * 24 * 365,
      path: "/",
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
    });
  }
  return response;

}

export const config = {
  matcher: [
    "/",
    "/manufacture",
    "/standard",
    "/dossiers",
    "/commission",
    "/journal/:path*",
    "/legal",
    "/sketch/:path*",
  ],
};
