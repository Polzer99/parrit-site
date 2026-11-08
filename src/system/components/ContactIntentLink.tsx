"use client";

import type { MouseEvent, ReactNode } from "react";
import { avecSource } from "@/lib/registry/cta";
import { localizedPath, type Locale } from "@/system/locale";

/** Real destinations work before hydration; same-home clicks keep the form alive. */
export function ContactIntentLink({ locale, intent, placement, query = "", primary = false, children }: {
  locale: Locale;
  intent: "formation" | "priorites" | "projet" | "grands-groupes" | "pme";
  placement: "hero" | "parcours" | "offres";
  query?: string;
  primary?: boolean;
  children: ReactNode;
}) {
  const source = `intention-${intent}-${placement}`;
  const href = avecSource(localizedPath(`/${query ? `?${query}` : ""}#contact`, locale), source);
  const navigate = (event: MouseEvent<HTMLAnchorElement>) => {
    if (event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
    const destination = new URL(href, window.location.href);
    const contact = document.getElementById("contact");
    if (destination.pathname !== window.location.pathname || !contact) return;
    event.preventDefault();
    // Keep the visit's query (including every utm_*) and replace only its intent.
    window.history.pushState(null, "", avecSource(`${destination.pathname}${window.location.search}#contact`, source));
    contact.scrollIntoView({ behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "instant" : "smooth", block: "start" });
    contact.focus({ preventScroll: true });
  };
  return <a className={`btn rev-button ${primary ? "exec" : "ghost"}`} href={href} onClick={navigate}>{children}</a>;
}
