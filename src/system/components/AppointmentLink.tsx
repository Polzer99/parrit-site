"use client";

import type { MouseEvent, ReactNode } from "react";
import { avecSource } from "@/lib/registry/cta";
import { localizedPath, type Locale } from "@/system/locale";

/** Décision de Paul du 08/11/2026, nuit : one action, attributed by placement. */
export function AppointmentLink({ locale, placement, query = "", children, primary = true, source: goalSource }: {
  locale: Locale;
  placement: "nav" | "hero" | "contact";
  query?: string;
  source?: `accueil-${string}`;
  children?: ReactNode;
  primary?: boolean;
}) {
  const source = goalSource ?? `rdv-${placement}`;
  const target = placement === "contact" ? "reservation" : "contact";
  const href = avecSource(localizedPath(`/${query ? `?${query}` : ""}#${target}`, locale), source);
  const navigate = (event: MouseEvent<HTMLAnchorElement>) => {
    if (event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
    const destination = new URL(href, window.location.href);
    const contact = document.getElementById(target);
    if (destination.pathname !== window.location.pathname || !contact) return;
    event.preventDefault();
    window.history.pushState(null, "", avecSource(`${destination.pathname}${window.location.search}#${target}`, source));
    contact.scrollIntoView({ behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "instant" : "smooth", block: "start" });
    contact.focus({ preventScroll: true });
  };
  return <a className={`btn rev-button ${primary ? "exec" : "ghost"}`} href={href} onClick={navigate}>{locale === "fr" ? "Prendre rendez-vous" : "Book a call"}{children}</a>;
}
