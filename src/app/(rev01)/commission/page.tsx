import type { Metadata } from "next";

import { getLocale } from "@/lib/server/locale";
import { K, ParritCalInline, RegistryLine } from "@/system/components";
import { localizedAlternates } from "@/system/locale";

const DICT = {
  en: { metaTitle: "Commission your operating system", metaDescription: "One conversation to examine how your company operates. The first step is an examination, not a sales call.", kicker: "Parrit / Commission", title: "Commission your operating system.", sub: "One conversation to examine how your company operates. The first step is an examination, not a sales call.", notes: [["Who you meet.", "Paul Larmaraud, the founder and the person who builds the systems, not a sales team. Figures from the dossiers are verified live, on screen."], ["What you leave with.", "An honest read of your operations: either a written scope for an Examination, or a clear no if we are not the right maison for it."], ["What it commits you to.", "Nothing. Scope and terms are set in writing after the conversation, before any engagement. Walking away costs nothing and requires no explanation."]], aria: "Select a time" },
  fr: { metaTitle: "Passez commande de votre système d'exploitation", metaDescription: "Une conversation pour examiner comment votre entreprise fonctionne. D'abord un examen. Pas un rendez-vous commercial.", kicker: "Parrit / Commande", title: "Passez commande de votre système d'exploitation.", sub: "Une conversation pour examiner comment votre entreprise fonctionne. D'abord un examen. Pas un rendez-vous commercial.", notes: [["Votre interlocuteur.", "Paul Larmaraud, le fondateur, celui qui construit les systèmes. Pas une équipe commerciale. Les chiffres des dossiers se vérifient en direct, à l'écran."], ["Ce que vous emportez.", "Un regard lucide sur vos opérations : soit un périmètre écrit pour un Examen, soit un non clair et net si nous ne sommes pas la bonne maison pour le faire."], ["À quoi cela vous engage.", "À rien. Le périmètre et les conditions se fixent par écrit après la conversation, avant tout engagement. Renoncer ne coûte rien et ne demande aucune justification."]], aria: "Choisissez un créneau" },
} as const;

export async function generateMetadata(): Promise<Metadata> { const copy = DICT[await getLocale()]; return { title: copy.metaTitle, description: copy.metaDescription, alternates: localizedAlternates("/commission") }; }

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
          <div className="commission-notes">
            {copy.notes.map(([title, body]) => <p key={title}><b>{title}</b> {body}</p>)}
          </div>
        </header>

        <section className="commission-instrument" aria-label={copy.aria}>
          <ParritCalInline locale={locale} />
        </section>

        <footer className="rev-footer">
          <RegistryLine />
        </footer>
      </div>
    </main>
  );
}
