import { localizedPath, type Locale } from "@/system/locale";
import { homeSectionHeadings } from "@/system/home-layers";
import { getAllJournalEntrySummaries } from "@/system/journal";
import { hasFrenchJournalTranslation } from "@/system/journal-translations";

/** Articles publiés et indexables du Journal dans la langue de la page : lu au registre, jamais écrit en dur. */
export function publishedJournalCount(locale: Locale) {
  return getAllJournalEntrySummaries(locale).filter(entry => !entry.noindex && (locale !== "fr" || hasFrenchJournalTranslation(entry.slug))).length;
}

// Presse seule depuis le 21/11/2026 (la section des assistants et l'ancre #assistant n'existent plus).
// Système visuel du 21/11/2026, soir : texte à gauche, chiffre à droite.
export function HomeMeasures({ locale }: { locale: Locale }) {
  const fr = locale === "fr";
  return <section className="home-measures" id={fr ? "mesures" : "measurements"}><div className="wrap">
    <div className="home-press">
      <div className="home-press-text"><h2>{homeSectionHeadings(locale).measures[0]}</h2>
        <p>{fr ? "Le Journal décrit ce qui a fonctionné et ce qui a échoué, avec les dates et les constats. Des chroniques sont parues dans Le Monde Informatique." : "The Journal describes what worked and what failed, with dates and findings. Columns have been published in Le Monde Informatique."}</p>
        <a className="btn rev-button ghost home-journal-link" href={localizedPath("/journal", locale)}>{fr ? "Lire nos retours de terrain" : "Read our field notes"}</a>
      </div>
      <figure className="press-figure"><strong className="press-count" data-measure="">{publishedJournalCount(locale)}</strong><figcaption>{fr ? "articles publiés dans le Journal." : "articles published in the Journal."}</figcaption></figure>
    </div>
  </div></section>;
}
