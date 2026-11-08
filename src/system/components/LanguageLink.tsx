"use client";
import { Suspense } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import { LOCALE_COOKIE, localizedPath, type Locale } from "@/system/locale";
const HASHES: Readonly<Record<string, string>> = { "en-production": "in-production", "ce-qui-change": "what-changes", parcours: "path", partenaires: "team" };
export function LanguageLink({ locale, children }: { locale: Locale; children: React.ReactNode }) {
  const path = usePathname() || "/";
  // Static error pages still render their navigation while URL data is unavailable.
  return <Suspense fallback={<a href={localizedPath(path, locale)} hrefLang={locale}>{children}</a>}>
    <QueryLanguageLink path={path} locale={locale}>{children}</QueryLanguageLink>
  </Suspense>;
}
function QueryLanguageLink({ path, locale, children }: { path: string; locale: Locale; children: React.ReactNode }) {
  const searchParams = useSearchParams();
  // Keep attribution in native navigation too, including before hydration.
  const params = new URLSearchParams(searchParams.toString());
  params.delete("lang");
  const query = params.toString();
  const href = localizedPath(`${path}${query ? `?${query}` : ""}`, locale);
  return <a href={href} hrefLang={locale} onClick={event => {
    event.preventDefault();
    document.cookie = `${LOCALE_COOKIE}=${locale}; Path=/; Max-Age=31536000; SameSite=Lax${window.location.protocol === "https:" ? "; Secure" : ""}`;
    const url = new URL(window.location.href); url.pathname = localizedPath(path, locale); url.searchParams.delete("lang");
    const hash = url.hash.slice(1);
    url.hash = locale === "en" ? HASHES[hash] ?? hash : Object.entries(HASHES).find(([, value]) => value === hash)?.[0] ?? hash;
    window.location.assign(`${url.pathname}${url.search}${url.hash}`);
  }}>{children}</a>;
}
