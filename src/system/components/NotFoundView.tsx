"use client";

import Link from "next/link";
import { useSyncExternalStore } from "react";
import { isLocale, localizedPath, LOCALE_COOKIE, type Locale } from "@/system/locale";
import { BrandConnector } from "./BrandConnector";
import { RevFooter } from "./RevFooter";
import { RevHeader } from "./RevHeader";

const COPY = {
  fr: { title: "Cette page n'existe pas.", home: "Revenir à l'accueil", journal: "Lire le Journal", label: "Page introuvable" },
  en: { title: "This page does not exist.", home: "Back to the home page", journal: "Read the Journal", label: "Page not found" },
} as const satisfies Record<Locale, Record<string, string>>;

/** Le choix déjà fait par le visiteur, sinon la langue de son navigateur. */
function visitorLocale(): Locale {
  const chosen = document.cookie.split("; ").find(entry => entry.startsWith(`${LOCALE_COOKIE}=`))?.split("=")[1];
  if (isLocale(chosen)) return chosen;
  return navigator.language.toLowerCase().startsWith("fr") ? "fr" : "en";
}

// Décision de Paul du 21/11/2026 : une seule langue par page. Une adresse inconnue ne dit pas
// sa langue, et la lire côté serveur rendrait tout le site dynamique. La page est donc servie
// en anglais, statique, puis prend la langue du visiteur dès l'hydratation.
export function NotFoundView() {
  // Instantané serveur : anglais. Instantané navigateur : la langue du visiteur, sans effet ni état.
  const locale = useSyncExternalStore<Locale>(() => () => {}, visitorLocale, () => "en");
  const copy = COPY[locale];
  return <div lang={locale}>
    <RevHeader locale={locale} />
    <main className="rev-page r2-dark not-found-page">
      <div className="r2-wrap">
        <header className="r2-hero">
          <h1>{copy.title}</h1>
        </header>
        <nav className="not-found-actions" aria-label={copy.label}>
          <Link className="rev-button exec" href={localizedPath("/", locale)}>{copy.home}<BrandConnector /></Link>
          <Link className="rev-button ghost" href={localizedPath("/journal", locale)}>{copy.journal}</Link>
        </nav>
      </div>
    </main>
    <RevFooter locale={locale} />
  </div>;
}
