"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef } from "react";
import { barePathname, localizedPath, LOCALE_COOKIE, type Locale } from "@/system/locale";

const NAV = {
  fr: [["/consulting-transformation", "Conseil & Transformation", "Comprendre, décider, transformer."], ["/ai-sprints", "AI Sprints", "Tester une première brique."], ["/engineering-integration", "Engineering & Intégration", "Relier vos outils et construire le manquant."], ["/journal", "Journal", "Lire les enseignements des chantiers."]],
  en: [["/consulting-transformation", "Consulting & Transformation", "Understand, decide, transform."], ["/ai-sprints", "AI Sprints", "Test a first building block."], ["/engineering-integration", "Engineering & Integration", "Connect your tools and build what is missing."], ["/journal", "Journal", "Read what the work teaches us."]],
} as const;
const SUBNAV = {
  fr: [["/harness-engineering", "Harness Engineering", "Fiabiliser les agents que vous utilisez."], ["/engineering-integration#custom", "Logiciels & agents sur mesure", "Construire ce qu’aucun outil ne couvre."], ["/engineering-integration#integrations", "Intégrations & infrastructures privées", "Relier vos outils et choisir l’hébergement."]],
  en: [["/harness-engineering", "Harness Engineering", "Make the agents you use reliable."], ["/engineering-integration#custom", "Custom software & agents", "Build what no tool covers."], ["/engineering-integration#integrations", "Integrations & private infrastructure", "Connect your tools and choose the hosting."]],
} as const;
function HeaderBookingAction({ locale }: { locale: Locale }) {
  return <Link className="cmd-cta rev-button ghost" href={localizedPath("/commission", locale)}>{locale === "fr" ? "Parler d'un projet" : "Talk about a project"}</Link>;
}
export function RevHeader({ locale }: { locale: Locale }) {
  const pathname = usePathname();
  const header = useRef<HTMLElement>(null);
  useEffect(() => {
    const close = () => header.current?.querySelectorAll<HTMLDetailsElement>("details[open]").forEach(menu => { menu.open = false; });
    close();
    const outside = (event: PointerEvent) => {
      header.current?.querySelectorAll<HTMLDetailsElement>("details[open]").forEach(menu => {
        if (event.target instanceof Node && !menu.contains(event.target)) menu.open = false;
      });
    };
    const escape = (event: KeyboardEvent) => {
      if (event.key !== "Escape") return;
      const menu = header.current?.querySelector<HTMLDetailsElement>("details[open]");
      close(); menu?.querySelector("summary")?.focus();
    };
    document.addEventListener("pointerdown", outside);
    document.addEventListener("keydown", escape);
    window.addEventListener("hashchange", close);
    return () => {
      document.removeEventListener("pointerdown", outside);
      document.removeEventListener("keydown", escape);
      window.removeEventListener("hashchange", close);
    };
  }, [pathname]);
  const nav = NAV[locale];
  const link = (href: string, label: string) => <Link href={localizedPath(href, locale)} aria-current={barePathname(pathname ?? "/") === href ? "page" : undefined}>{label}</Link>;
  return <header ref={header} className="cmdbar v1-header" onClick={event => {
    if ((event.target as HTMLElement).closest("a")) header.current?.querySelectorAll<HTMLDetailsElement>("details[open]").forEach(menu => { menu.open = false; });
  }}>
    <div className="cmdbar-inner">
      <Link className="wordmark" href={localizedPath("/", locale)} aria-label={locale === "fr" ? "Accueil Parrit.ai" : "Parrit.ai home"}>PARRIT<i aria-hidden="true">.</i>AI</Link>
      <nav className="cmd-nav" aria-label={locale === "fr" ? "Navigation principale" : "Main navigation"}>
        {nav.map(([href, label]) => <div key={href} className="v1-nav-entry">{link(href, label)}{href === "/engineering-integration" && <details onKeyDown={event => { if (event.key === "Escape") { event.currentTarget.open = false; event.currentTarget.querySelector("summary")?.focus(); } }}><summary aria-label={locale === "fr" ? "Explorer Engineering" : "Explore Engineering"}>{locale === "fr" ? "Plus" : "More"}</summary><div>{SUBNAV[locale].map(([target, title, benefit]) => <span key={target}>{link(target, title)}<p>{benefit}</p></span>)}</div></details>}</div>)}
      </nav>
      <div className="locale-toggle" role="group" aria-label={locale === "fr" ? "Langue" : "Language"}>{(["fr", "en"] as const).map(item => <button key={item} type="button" aria-pressed={locale === item} className={locale === item ? "on" : undefined} onClick={() => {
        document.cookie = `${LOCALE_COOKIE}=${item}; Path=/; Max-Age=31536000; SameSite=Lax${window.location.protocol === "https:" ? "; Secure" : ""}`;
        const url = new URL(window.location.href); url.pathname = localizedPath(url.pathname, item); url.searchParams.delete("lang"); window.location.assign(`${url.pathname}${url.search}${url.hash}`);
      }}>{item.toUpperCase()}</button>)}</div>
      <HeaderBookingAction key={pathname} locale={locale}/>
    </div>
    <details className="v1-mobile-menu" onKeyDown={event => { if (event.key === "Escape") { event.currentTarget.open = false; event.currentTarget.querySelector("summary")?.focus(); } }}>
      <summary>Menu</summary><nav onClick={event => { if ((event.target as HTMLElement).closest("a")) { const menu = event.currentTarget.closest("details"); if (menu) menu.open = false; } }} aria-label={locale === "fr" ? "Navigation mobile" : "Mobile navigation"}>
        {nav.map(([href, label, benefit]) => <div key={href}>{link(href, label)}<p>{benefit}</p></div>)}
        {SUBNAV[locale].map(([href, label, benefit]) => <div key={href}>{link(href, label)}<p>{benefit}</p></div>)}
      </nav>
    </details>
  </header>;
}
