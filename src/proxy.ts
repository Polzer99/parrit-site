import { NextRequest, NextResponse } from "next/server";

import {
  barePathname,
  isLocale,
  localeFromAcceptLanguage,
  localizedPath,
  LOCALE_COOKIE,
  LOCALE_HEADER,
  PATHNAME_HEADER,
  TRANSLATED_PATHS,
} from "@/system/locale";

// Search, AI and link-preview crawlers must see stable URLs without negotiation.
const BOT = /bot|crawler|spider|slurp|bingpreview|facebookexternalhit|google-inspectiontool|googleother|adsbot|mediapartners-google|chatgpt|claude|perplexity|bytespider|amazonbot|applebot|ia_archiver/i;

export function proxy(request: NextRequest) {
  const pathname = request.nextUrl.pathname;
  const bare = barePathname(pathname);
  const translated = TRANSLATED_PATHS.includes(bare);
  const french = pathname !== bare;
  const queryLocale = request.nextUrl.searchParams.get("lang");
  const safeMethod = request.method === "GET" || request.method === "HEAD";

  if (safeMethod && isLocale(queryLocale)) {
    const url = request.nextUrl.clone();
    url.pathname = localizedPath(bare, queryLocale);
    url.searchParams.delete("lang");
    const response = NextResponse.redirect(url, 301);
    // A legacy explicit choice must also suppress negotiation on the next hop.
    response.cookies.set(LOCALE_COOKIE, queryLocale, {
      maxAge: 60 * 60 * 24 * 365, path: "/", sameSite: "lax",
      secure: request.nextUrl.protocol === "https:",
    });
    response.headers.set("Cache-Control", "private, no-store");
    return response;
  }

  // No French aliases for articles, feeds, private sketches or unknown routes.
  if (french && !translated) {
    const url = request.nextUrl.clone();
    url.pathname = bare;
    return NextResponse.redirect(url, 301);
  }

  if (safeMethod && translated && !french && !request.cookies.has(LOCALE_COOKIE)
    && !BOT.test(request.headers.get("user-agent") ?? "")
    && localeFromAcceptLanguage(request.headers.get("accept-language")) === "fr") {
    const url = request.nextUrl.clone();
    url.pathname = localizedPath(bare, "fr");
    const response = NextResponse.redirect(url, 302);
    response.headers.set("Vary", "Accept-Language, Cookie, User-Agent");
    response.headers.set("Cache-Control", "private, no-store");
    return response;
  }

  const requestHeaders = new Headers(request.headers);
  // Overwrite inbound hints: a cookie/header cannot change an URL's language.
  requestHeaders.set(PATHNAME_HEADER, pathname);
  requestHeaders.set(LOCALE_HEADER, french && translated ? "fr" : "en");
  const url = request.nextUrl.clone();
  url.pathname = bare;
  const response = french
    ? NextResponse.rewrite(url, { request: { headers: requestHeaders } })
    : NextResponse.next({ request: { headers: requestHeaders } });
  if (translated && !french) response.headers.append("Vary", "Accept-Language, Cookie, User-Agent");
  return response;
}

export const config = {
  matcher: [
    "/", "/fr/:path*", "/manufacture", "/standard", "/dossiers",
    "/commission", "/journal/:path*", "/legal", "/sketch/:path*",
  ],
};
