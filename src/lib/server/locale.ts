import "server-only";

import { cookies, headers } from "next/headers";

import {
  isLocale,
  localeFromAcceptLanguage,
  LOCALE_COOKIE,
  LOCALE_HEADER,
  type Locale,
} from "@/system/locale";

export async function getLocale(): Promise<Locale> {
  const requestHeaders = await headers();
  const forwardedLocale = requestHeaders.get(LOCALE_HEADER);
  if (isLocale(forwardedLocale)) return forwardedLocale;

  const cookieLocale = (await cookies()).get(LOCALE_COOKIE)?.value;
  if (isLocale(cookieLocale)) return cookieLocale;

  return localeFromAcceptLanguage(requestHeaders.get("accept-language"));
}
