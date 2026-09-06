import type { Metadata } from "next";

import { getLocale } from "@/lib/server/locale";
import { K, ParritCalInline, QuickCapture, RegistryLine } from "@/system/components";
import { localizedAlternates } from "@/system/locale";

const DICT = {
  "en": {
    "title": "Every commission begins with an examination.",
    "metaDescription": "Every commission begins with an examination: thirty minutes on a video call with the founder, a written scope or a clear no. Select a time.",
    "kicker": "Parrit / Commission",
    "sub": "Thirty minutes on a video call with the founder.",
    "noteTitle": "You leave with a verdict.",
    "noteBody": "A written scope, or a clear no. Nothing is signed during the call; terms are set afterwards, in black and white.",
    "capture": "No slot that works? Leave your e-mail",
    "aria": "Select a time"
  },
  "fr": {
    "title": "Toute commande commence par un examen.",
    "metaDescription": "Toute commande commence par un examen : trente minutes en visio avec le fondateur, un périmètre écrit ou un non clair. Choisissez un créneau.",
    "kicker": "Parrit / Commande",
    "sub": "Trente minutes en visio avec le fondateur.",
    "noteTitle": "Vous repartez avec un verdict.",
    "noteBody": "Un périmètre écrit, ou un non clair. Rien ne se signe pendant l'appel ; les conditions se fixent après, noir sur blanc.",
    "capture": "Pas de créneau ? Laissez votre e-mail",
    "aria": "Choisissez un créneau"
  }
} as const;

export async function generateMetadata(): Promise<Metadata> { const copy = DICT[await getLocale()]; return { title: copy.title, description: copy.metaDescription, alternates: localizedAlternates("/commission") }; }

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
