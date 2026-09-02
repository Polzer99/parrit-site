import { NextRequest, NextResponse } from "next/server";

import {
  isLocale,
  localeFromAcceptLanguage,
  LOCALE_COOKIE,
  LOCALE_HEADER,
} from "@/system/locale";

// Domaine dédié du Camp Parrita : sert la landing camp à la racine,
// sans jamais exposer l'arborescence parrit.ai.
const CAMP_HOST = "campparrita.com";
const CAMP_PATH = "/camp-costa-rica";

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const host = (request.headers.get("host") ?? "").split(":")[0];

  // campparrita.com → la page camp, en conservant le sous-chemin de langue
  // (/ → FR, /en, /es ; assets/_next passent déjà hors matcher).
  if (host === CAMP_HOST || host === `www.${CAMP_HOST}`) {
    if (pathname === CAMP_PATH || pathname.startsWith(`${CAMP_PATH}/`)) return;
    const url = request.nextUrl.clone();
    url.pathname = `${CAMP_PATH}${pathname === "/" ? "" : pathname}`;
    return NextResponse.rewrite(url);
  }

  // parrit.ai/camp-costa-rica : servi tel quel tant que le domaine dédié
  // n'est pas actif. Une fois campparrita.com rattaché au projet Vercel,
  // remplacer ce return par un redirect 308 vers https://campparrita.com/.
  if (pathname === CAMP_PATH || pathname.startsWith(`${CAMP_PATH}/`)) {
    return;
  }

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
    "/camp-costa-rica/:path*",
    {
      source: "/:path*",
      has: [{ type: "host", value: "campparrita.com" }],
    },
    {
      source: "/:path*",
      has: [{ type: "host", value: "www.campparrita.com" }],
    },
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
