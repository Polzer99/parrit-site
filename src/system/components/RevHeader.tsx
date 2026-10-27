"use client";
import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import { localizedPath, type Locale } from "@/system/locale";
import { LanguageLink } from "./LanguageLink";
export function RevHeader({ locale }: { locale: Locale }) {
  const pathname = usePathname();
  const header = useRef<HTMLElement>(null);
  useEffect(() => {
    const close = () => header.current?.querySelectorAll<HTMLDetailsElement>("details[open]").forEach(menu => { menu.open = false; });
    close();
    const escape = (event: KeyboardEvent) => {
      if (event.key !== "Escape") return;
      const menu = header.current?.querySelector<HTMLDetailsElement>("details[open]"); close(); menu?.querySelector("summary")?.focus();
    };
    const outside = (event: PointerEvent) => { if (event.target instanceof Node && !header.current?.contains(event.target)) close(); };
    document.addEventListener("keydown", escape); document.addEventListener("pointerdown", outside);
    return () => { document.removeEventListener("keydown", escape); document.removeEventListener("pointerdown", outside); };
  }, [pathname]);
  const fr = locale === "fr";
  const nav = fr ? [["en-production", "Applications"], ["parcours", "Le parcours"], ["services", "Services"], ["partenaires", "L'équipe"], ["references", "Références"], ["contact", "Contact"]] : [["in-production", "Applications"], ["path", "The path"], ["services", "Services"], ["team", "The team"], ["references", "References"], ["contact", "Contact"]];
  const links = nav.map(([anchor, label]) => <a key={anchor} href={localizedPath(`/#${anchor}`, locale)}>{label}</a>);
  return <header ref={header} className="cmdbar single-header" onClick={event => { if ((event.target as HTMLElement).closest("a")) header.current?.querySelectorAll<HTMLDetailsElement>("details[open]").forEach(menu => { menu.open = false; }); }}>
    <div className="wrap">
      <a className="mark" href={localizedPath("/", locale)}>PARRIT.AI</a>
      <nav className="desktop-nav" aria-label={fr ? "Navigation principale" : "Main navigation"}>{links}</nav>
      <div className="languages" aria-label={fr ? "Langue" : "Language"}><LanguageLink locale="fr">FR</LanguageLink><LanguageLink locale="en">EN</LanguageLink></div>
      <a className="btn rev-button ghost" href={localizedPath("/#contact", locale)}>{fr ? "Parler d'un projet" : "Talk about a project"}</a>
      <details className="mobile-menu">
        <summary>Menu</summary>
        <nav aria-label={fr ? "Navigation mobile" : "Mobile navigation"}>
          {links.filter(link => link.key !== "contact")}
          <a className="btn rev-button ghost" href={localizedPath("/#contact", locale)}>{fr ? "Parler d'un projet" : "Talk about a project"}</a>
        </nav>
      </details>
    </div>
  </header>;
}
