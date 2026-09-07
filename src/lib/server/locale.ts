import "server-only";

import { cookies, headers } from "next/headers";

import {
  isLocale,
  localeFromAcceptLanguage,
  LOCALE_COOKIE,
  LOCALE_HEADER,
  PATHNAME_HEADER,
  barePathname,
  TRANSLATED_PATHS,
  type Locale,
} from "@/system/locale";

export async function getLocale(): Promise<Locale> {
  const requestHeaders = await headers();
  const pathname = requestHeaders.get(PATHNAME_HEADER);
  if (pathname) {
    const bare = barePathname(pathname);
    return pathname !== bare && TRANSLATED_PATHS.includes(bare) ? "fr" : "en";
  }
  const forwardedLocale = requestHeaders.get(LOCALE_HEADER);
  if (isLocale(forwardedLocale)) return forwardedLocale;

  const cookieLocale = (await cookies()).get(LOCALE_COOKIE)?.value;
  if (isLocale(cookieLocale)) return cookieLocale;

  return localeFromAcceptLanguage(requestHeaders.get("accept-language"));
}
