import type { Metadata } from "next";

import { getLocale } from "@/lib/server/locale";
import { K, ParritCalInline, QuickCapture, RegistryLine } from "@/system/components";
import { localizedAlternates, localizedOpenGraph } from "@/system/locale";

const DICT = {
  "en": {
    "title": "Every commission begins with an examination.",
    "metaDescription": "Fifteen minutes on a video call with the founder, to name the operation costing you the most and check a system makes sense for it. You leave with a written scope or a clear no.",
    "kicker": "Parrit / Commission",
    "sub": "Fifteen minutes on a video call with the founder, to name the operation costing you the most and check a system makes sense for it.",
    "noteTitle": "You leave with a clear direction.",
    "noteBody": "Either the founder sends you a written scope next: what gets built, what he'll need from you, how success is judged. Or a clear no, right away. Nothing is signed during the call; the scope is written afterwards, in black and white.",
    "capture": "No slot that works? Leave your e-mail",
    "aria": "Select a time"
  },
  "fr": {
    "title": "Toute commande commence par un examen.",
    "metaDescription": "Quinze minutes en visio avec le fondateur, pour nommer l'opération qui vous coûte le plus et vérifier qu'un système a du sens pour elle. Vous repartez avec un périmètre écrit ou un non clair.",
    "kicker": "Parrit / Commande",
    "sub": "Quinze minutes en visio avec le fondateur, pour nommer l'opération qui vous coûte le plus et vérifier qu'un système a du sens pour elle.",
    "noteTitle": "Vous repartez avec une direction claire.",
    "noteBody": "Soit le fondateur vous envoie ensuite un périmètre écrit : ce qui sera construit, ce dont il aura besoin de vous, comment on juge que c'est réussi. Soit un non clair, tout de suite. Rien ne se signe pendant l'appel ; le périmètre se rédige après, noir sur blanc.",
    "capture": "Pas de créneau ? Laissez votre e-mail",
    "aria": "Choisissez un créneau"
  }
} as const;

export async function generateMetadata(): Promise<Metadata> { const locale = await getLocale(); const copy = DICT[locale]; return { title: copy.title, description: copy.metaDescription, openGraph: localizedOpenGraph("/commission", locale, copy.title, copy.metaDescription), alternates: localizedAlternates("/commission", locale) }; }

export default async function CommissionPage() {
  const locale = await getLocale();
  const copy = DICT[locale];
  return (
    <main className="rev-page commission-page">
      <div className="rev-wrap">
        <header className="commission-header">
          <K>{copy.kicker}</K>
          <h1>{copy.title}</h1>
          <p>{copy.sub}</p>
        </header>

        <section className="commission-instrument" aria-label={copy.aria}>
          <ParritCalInline locale={locale} />
        </section>

        <div className="commission-notes">
          <p><b>{copy.noteTitle}</b> {copy.noteBody}</p>
        </div>
        <section className="standard-action" aria-label={copy.capture}>
          <K>{copy.capture}</K>
          <QuickCapture locale={locale} id="commission" />
        </section>

        <footer className="rev-footer">
          <RegistryLine />
        </footer>
      </div>
    </main>
  );
}
