"use client";

import type { MouseEvent, ReactNode } from "react";
import { avecSource } from "@/lib/registry/cta";
import { localizedPath, type Locale } from "@/system/locale";

/** Décision de Paul du 08/11/2026, nuit : one action, attributed by placement. */
export function AppointmentLink({ locale, placement, query = "", children, primary = true, attributionSource }: {
  locale: Locale;
  placement: "nav" | "hero" | "bandeau" | "contact";
  query?: string;
  children?: ReactNode;
  primary?: boolean;
  attributionSource?: string;
}) {
  const source = attributionSource ?? `rdv-${placement}`;
  const href = avecSource(localizedPath(`/${query ? `?${query}` : ""}#contact`, locale), source);
  const navigate = (event: MouseEvent<HTMLAnchorElement>) => {
    if (event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
    const destination = new URL(href, window.location.href);
    const contact = document.getElementById("contact");
    if (destination.pathname !== window.location.pathname || !contact) return;
    event.preventDefault();
    window.history.pushState(null, "", avecSource(`${destination.pathname}${window.location.search}#contact`, source));
    contact.scrollIntoView({ behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "instant" : "smooth", block: "start" });
    contact.focus({ preventScroll: true });
  };
  return <a className={`btn rev-button ${primary ? "exec" : "ghost"}`} href={href} onClick={navigate}>{locale === "fr" ? "Prendre rendez-vous" : "Book a call"}{children}</a>;
}
