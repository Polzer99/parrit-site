"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

import type { Locale } from "@/system/locale";

const NAV = {
  en: [
    ["/journal", "Journal"],
    ["/commission", "Commission"],
    ["/#prototype", "Your prototype"],
  ],
  fr: [
    ["/journal", "Journal"],
    ["/commission", "Commande"],
    ["/#prototype", "Votre prototype"],
  ],
} as const;

export function RevHeader({ locale }: { locale: Locale }) {
  const [clock, setClock] = useState("--:--:-- · LOCAL");
  const [menuOpen, setMenuOpen] = useState(false);
  const [panelMounted, setPanelMounted] = useState(false);
  const [panelOn, setPanelOn] = useState(false);
  const pathname = usePathname();
  const nav = NAV[locale];

  const switchLocale = (nextLocale: Locale) => {
    if (nextLocale === locale) return;
    const url = new URL(window.location.href);
    url.searchParams.set("lang", nextLocale);
    window.location.assign(`${url.pathname}${url.search}${url.hash}`);
  };

  useEffect(() => {
    let cancelled = false;
    queueMicrotask(() => {
      if (!cancelled) setMenuOpen(false);
    });
    return () => {
      cancelled = true;
    };
  }, [pathname]);

  // pas de pop instantané au tap : le panneau monte d'abord à opacité 0, la
  // classe "on" arrive une frame plus tard pour que la transition se joue
  // (même logique de fondu que l'Opening) ; à la fermeture, la classe part
  // en premier et le démontage suit 180ms plus tard, le temps du fondu
  useEffect(() => {
    if (menuOpen) {
      let cancelled = false;
      let frame: number | undefined;
      queueMicrotask(() => {
        if (cancelled) return;
        setPanelMounted(true);
        frame = window.requestAnimationFrame(() => setPanelOn(true));
      });
      return () => {
        cancelled = true;
        if (frame !== undefined) window.cancelAnimationFrame(frame);
      };
    }
    let cancelled = false;
    queueMicrotask(() => {
      if (!cancelled) setPanelOn(false);
    });
    const timer = window.setTimeout(() => setPanelMounted(false), 180);
    return () => {
      cancelled = true;
      window.clearTimeout(timer);
    };
  }, [menuOpen]);

  useEffect(() => {
    if (!menuOpen) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setMenuOpen(false);
    };
    window.addEventListener("keydown", onKey);
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = previousOverflow;
    };
  }, [menuOpen]);

  useEffect(() => {
    const updateClock = () => {
      const now = new Date();
      const time = [now.getHours(), now.getMinutes(), now.getSeconds()]
        .map((part) => String(part).padStart(2, "0"))
        .join(":");
      setClock(`${time} · LOCAL`);
    };

    updateClock();
    const interval = window.setInterval(updateClock, 1_000);

    return () => window.clearInterval(interval);
  }, []);

  return (
    <>
      <header className="cmdbar">
      <Link className="wordmark" href="/" aria-label="Parrit.ai home">
        PARRIT<i aria-hidden="true">.</i>AI
      </Link>
      <nav className="cmd-nav" aria-label="Main navigation">
        {nav.map(([href, label]) => {
          const active = href !== "/#prototype" && pathname?.startsWith(href);
          return (
            <Link
              key={href}
              href={href}
              className={`${active ? "on" : ""}${href === "/#prototype" ? " cmd-nav-prototype" : ""}`.trim() || undefined}
              aria-current={active ? "page" : undefined}
            >
              {label}
            </Link>
          );
        })}
      </nav>
      <div className="locale-toggle" aria-label={locale === "fr" ? "Choisir la langue" : "Choose language"}>
        {(["fr", "en"] as const).map((item) => (
          <button
            type="button"
            key={item}
            className={item === locale ? "on" : undefined}
            aria-pressed={item === locale}
            onClick={() => switchLocale(item)}
          >
            {item.toUpperCase()}
          </button>
        ))}
      </div>
      <time className="clock" aria-label="Local time">
        {clock}
      </time>
      <button
        type="button"
        className="cmd-menu-toggle"
        aria-expanded={menuOpen}
        aria-controls="cmd-panel"
        onClick={() => setMenuOpen((open) => !open)}
      >
        {menuOpen ? (locale === "fr" ? "Fermer" : "Close") : "Menu"}
      </button>
      </header>
      {/* le panneau vit HORS de la cmdbar : son backdrop-filter fait de la barre
         le bloc conteneur des fixed — dedans, le panneau se calait sur 52px */}
      {panelMounted ? (
        <nav
          className={`cmd-panel${panelOn ? " on" : ""}`}
          id="cmd-panel"
          aria-label="Main navigation"
        >
          {nav.map(([href, label]) => {
            const active = href !== "/#prototype" && pathname?.startsWith(href);
            return (
              <Link
                key={href}
                href={href}
                className={`${active ? "on" : ""}${href === "/#prototype" ? " cmd-nav-prototype" : ""}`.trim() || undefined}
                aria-current={active ? "page" : undefined}
                onClick={() => setMenuOpen(false)}
              >
                {label}
              </Link>
            );
          })}
        </nav>
      ) : null}
    </>
  );
}
