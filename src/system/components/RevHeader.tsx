"use client";
import { Suspense, useEffect, useRef, useSyncExternalStore } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import { barePathname, localizedPath, type Locale } from "@/system/locale";
import { LanguageLink } from "./LanguageLink";
import { AppointmentLink } from "./AppointmentLink";
import "@/system/header-navigation.css";

const subscribeHydration = () => () => {};
const clientHydrated = () => true;
const serverHydrated = () => false;

function QueryAppointment({ locale }: { locale: Locale }) {
  const params = useSearchParams();
  const path = barePathname(usePathname() ?? "/");
  const hydrated = useSyncExternalStore(subscribeHydration, clientHydrated, serverHydrated);
  const staticPage = path === "/legal" || path === "/journal" || path.startsWith("/journal/");
  // Cached pages retain the shared SSR fallback; visit attribution is applied
  // after hydration. Home and booking keep their existing SSR contracts.
  const campaign = new URLSearchParams();
  params.forEach((value, key) => {
    if (key === "source" || key.startsWith("utm_")) campaign.append(key, value);
  });
  const query = staticPage ? campaign.toString() : params.toString();
  const attributionSource = staticPage && hydrated ? campaign.get("source") ?? undefined : undefined;
  return <AppointmentLink locale={locale} placement="nav" query={query} attributionSource={attributionSource} primary={false}/>;
}

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
  const nav = fr ? [["en-production", "Applications"], ["offres", "Offres"], ["parcours", "Le parcours"], ["services", "Services"], ["questions", "Questions"], ["contact", "Contact"]] : [["in-production", "Applications"], ["offers", "Offers"], ["path", "The path"], ["services", "Services"], ["questions", "Questions"], ["contact", "Contact"]];
  const journal = localizedPath("/journal", locale);
  const links = nav.flatMap(([anchor, label]) => [
    <a key={anchor} href={localizedPath(`/#${anchor}`, locale)}>{label}</a>,
    ...(anchor === "questions" ? [<a key="journal" href={journal} aria-current={pathname === journal || pathname?.startsWith(`${journal}/`) ? "page" : undefined}>Journal</a>] : []),
  ]);
  // A fragment-only link preserves the current query even before hydration.
  const bookingPage = barePathname(pathname ?? "/") === "/rendez-vous";
  const action = bookingPage ? <a className="btn rev-button ghost" href="#reservation">{fr ? "Prendre rendez-vous" : "Book a call"}</a> : <Suspense fallback={<AppointmentLink locale={locale} placement="nav" primary={false}/>}><QueryAppointment locale={locale}/></Suspense>;
  return <header ref={header} className="cmdbar single-header" onClick={event => { if ((event.target as HTMLElement).closest("a")) header.current?.querySelectorAll<HTMLDetailsElement>("details[open]").forEach(menu => { menu.open = false; }); }}>
    <div className="wrap">
      <a className="mark" href={localizedPath("/", locale)}>PARRIT.AI</a>
      <nav className="desktop-nav" aria-label={fr ? "Navigation principale" : "Main navigation"}>{links}</nav>
      <div className="languages" aria-label={fr ? "Langue" : "Language"}><LanguageLink locale="fr">FR</LanguageLink><LanguageLink locale="en">EN</LanguageLink></div>
      {action}
      <details className="mobile-menu">
        <summary>Menu</summary>
        <nav aria-label={fr ? "Navigation mobile" : "Mobile navigation"}>
          {links.filter(link => link.key !== "contact")}
          {action}
        </nav>
      </details>
    </div>
  </header>;
}
