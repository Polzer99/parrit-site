"use client";
import { Suspense, useSyncExternalStore } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import { LOCALE_COOKIE, localizedPath, type Locale } from "@/system/locale";
import { localizedHomeHash as localizedHash } from "@/system/home-anchors";
function subscribeHash(onChange: () => void) {
  window.addEventListener("hashchange", onChange);
  window.addEventListener("popstate", onChange);
  return () => {
    window.removeEventListener("hashchange", onChange);
    window.removeEventListener("popstate", onChange);
  };
}
const currentHash = () => window.location.hash;
// Fragments are browser-only; keep SSR and the first hydration render identical.
const serverHash = () => "";
export function LanguageLink({ locale, children }: { locale: Locale; children: React.ReactNode }) {
  const path = usePathname() || "/";
  // Static error pages still render their navigation while URL data is unavailable.
  return <Suspense fallback={<a href={localizedPath(path, locale)} hrefLang={locale}>{children}</a>}>
    <QueryLanguageLink path={path} locale={locale}>{children}</QueryLanguageLink>
  </Suspense>;
}
function QueryLanguageLink({ path, locale, children }: { path: string; locale: Locale; children: React.ReactNode }) {
  const searchParams = useSearchParams();
  const hash = useSyncExternalStore(subscribeHash, currentHash, serverHash);
  // Keep attribution in native navigation too, including before hydration.
  const params = new URLSearchParams(searchParams.toString());
  params.delete("lang");
  const query = params.toString();
  const href = localizedPath(`${path}${query ? `?${query}` : ""}${localizedHash(hash, locale)}`, locale);
  const rememberChoice = () => {
    document.cookie = `${LOCALE_COOKIE}=${locale}; Path=/; Max-Age=31536000; SameSite=Lax${window.location.protocol === "https:" ? "; Secure" : ""}`;
  };
  return <a href={href} hrefLang={locale} onClick={event => {
    if (event.defaultPrevented || event.button !== 0) return;
    // Record the choice even for a new tab, before the proxy negotiates its locale.
    rememberChoice();
    if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
    event.preventDefault();
    const url = new URL(window.location.href); url.pathname = localizedPath(path, locale); url.searchParams.delete("lang");
    url.hash = localizedHash(url.hash, locale);
    window.location.assign(`${url.pathname}${url.search}${url.hash}`);
  }} onAuxClick={event => {
    if (!event.defaultPrevented && event.button === 1) rememberChoice();
  }}>{children}</a>;
}
