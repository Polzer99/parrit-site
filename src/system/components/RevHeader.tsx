"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { barePathname, localizedPath, LOCALE_COOKIE, type Locale } from "@/system/locale";

const NAV = {
  fr: [["/consulting-transformation", "Conseil & Transformation", "Comprendre, décider, transformer."], ["/ai-sprints", "AI Sprints", "Tester une première brique."], ["/engineering-integration", "Engineering & Intégration", "Relier vos outils et construire le manquant."], ["/journal", "Journal", "Lire les enseignements des chantiers."]],
  en: [["/consulting-transformation", "Consulting & Transformation", "Understand, decide, transform."], ["/ai-sprints", "AI Sprints", "Test a first building block."], ["/engineering-integration", "Engineering & Integration", "Connect your tools and build what is missing."], ["/journal", "Journal", "Read what the work teaches us."]],
} as const;
const SUBNAV = {
  fr: [["/harness-engineering", "Harness Engineering"], ["/engineering-integration#custom", "Logiciels & agents sur mesure"], ["/engineering-integration#integrations", "Intégrations & infrastructures privées"]],
  en: [["/harness-engineering", "Harness Engineering"], ["/engineering-integration#custom", "Custom software & agents"], ["/engineering-integration#integrations", "Integrations & private infrastructure"]],
} as const;
function HeaderBookingAction({ locale, home }: { locale: Locale; home: boolean }) {
  const [heroOutside, setHeroOutside] = useState(false);
  useEffect(() => {
    if (!home || typeof IntersectionObserver === "undefined") return;
    const hero = document.querySelector(".home-s-hero");
    if (!hero) return;
    const observer = new IntersectionObserver(([entry]) => setHeroOutside(!entry.isIntersecting));
    observer.observe(hero); return () => observer.disconnect();
  }, [home]);
  return <Link data-home={home} className={`cmd-cta rev-button ${home && heroOutside ? "exec" : "ghost"}`} href={localizedPath("/commission", locale)}>{locale === "fr" ? "Parler d'un projet" : "Talk about a project"}</Link>;
}
export function RevHeader({ locale }: { locale: Locale }) {
  const pathname = usePathname();
  const nav = NAV[locale];
  const link = (href: string, label: string) => <Link href={localizedPath(href, locale)} aria-current={barePathname(pathname ?? "/") === href ? "page" : undefined}>{label}</Link>;
  return <header className="cmdbar v1-header">
    <div className="cmdbar-inner">
      <Link className="wordmark" href={localizedPath("/", locale)} aria-label={locale === "fr" ? "Accueil Parrit.ai" : "Parrit.ai home"}>PARRIT<i aria-hidden="true">.</i>AI</Link>
      <nav className="cmd-nav" aria-label={locale === "fr" ? "Navigation principale" : "Main navigation"}>
        {nav.map(([href, label]) => <div key={href} className="v1-nav-entry">{link(href, label)}{href === "/engineering-integration" && <details onKeyDown={event => { if (event.key === "Escape") { event.currentTarget.open = false; event.currentTarget.querySelector("summary")?.focus(); } }}><summary aria-label={locale === "fr" ? "Explorer Engineering" : "Explore Engineering"}>+</summary><div>{SUBNAV[locale].map(([target, title]) => <span key={target}>{link(target, title)}</span>)}</div></details>}</div>)}
      </nav>
      <div className="locale-toggle" role="group" aria-label={locale === "fr" ? "Langue" : "Language"}>{(["fr", "en"] as const).map(item => <button key={item} type="button" aria-pressed={locale === item} className={locale === item ? "on" : undefined} onClick={() => {
        document.cookie = `${LOCALE_COOKIE}=${item}; Path=/; Max-Age=31536000; SameSite=Lax${window.location.protocol === "https:" ? "; Secure" : ""}`;
        const url = new URL(window.location.href); url.pathname = localizedPath(url.pathname, item); url.searchParams.delete("lang"); window.location.assign(`${url.pathname}${url.search}${url.hash}`);
      }}>{item.toUpperCase()}</button>)}</div>
      <HeaderBookingAction key={pathname} locale={locale} home={barePathname(pathname ?? "/") === "/"}/>
    </div>
    <details className="v1-mobile-menu" onKeyDown={event => { if (event.key === "Escape") { event.currentTarget.open = false; event.currentTarget.querySelector("summary")?.focus(); } }}>
      <summary>Menu</summary><nav onClick={event => { if ((event.target as HTMLElement).closest("a")) { const menu = event.currentTarget.closest("details"); if (menu) menu.open = false; } }} aria-label={locale === "fr" ? "Navigation mobile" : "Mobile navigation"}>
        {nav.map(([href, label, benefit]) => <div key={href}>{link(href, label)}<p>{benefit}</p></div>)}
        {SUBNAV[locale].map(([href, label]) => <div key={href}>{link(href, label)}<p>{locale === "fr" ? "Concevoir un système adapté à vos opérations." : "Design a system suited to your operations."}</p></div>)}
      </nav>
    </details>
  </header>;
}
