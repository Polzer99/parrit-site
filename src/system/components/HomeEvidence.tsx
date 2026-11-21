import { localizedPath, type Locale } from "@/system/locale";
import { homeSectionHeadings } from "@/system/home-layers";
import { getAllJournalEntrySummaries } from "@/system/journal";
import { hasFrenchJournalTranslation } from "@/system/journal-translations";

/** Articles publiés et indexables du Journal dans la langue de la page : lu au registre, jamais écrit en dur.
 *  Les articles en `noindex` restent listés par la page du Journal mais ne sont pas comptés : le chiffre
 *  ne dépasse donc jamais ce que le visiteur trouve, et il est aujourd'hui le même en français et en anglais. */
export function publishedJournalCount(locale: Locale) {
  return getAllJournalEntrySummaries(locale).filter(entry => !entry.noindex && (locale !== "fr" || hasFrenchJournalTranslation(entry.slug))).length;
}

// Presse seule depuis le 21/11/2026 (la section des assistants et l'ancre #assistant n'existent plus).
// Système visuel du 21/11/2026, soir : texte à gauche, chiffre à droite.
export function HomeMeasures({ locale }: { locale: Locale }) {
  const fr = locale === "fr";
  const count = publishedJournalCount(locale);
  const legend = fr ? (count === 1 ? "article publié dans le Journal." : "articles publiés dans le Journal.") : (count === 1 ? "article published in the Journal." : "articles published in the Journal.");
  return <section className="home-measures" id={fr ? "mesures" : "measurements"}><div className="wrap">
    <div className="home-press">
      <div className="home-press-text"><h2>{homeSectionHeadings(locale).measures[0]}</h2>
        <p>{fr ? "Le Journal décrit ce qui a fonctionné et ce qui a échoué, avec les dates et les constats. Des chroniques sont parues dans Le Monde Informatique." : "The Journal describes what worked and what failed, with dates and findings. Columns have been published in Le Monde Informatique."}</p>
        <a className="btn rev-button ghost home-journal-link" href={localizedPath("/journal", locale)}>{fr ? "Lire nos retours de terrain" : "Read our field notes"}</a>
      </div>
      {count > 0 && <figure className="press-figure"><strong className="press-count" data-measure="">{count}</strong><figcaption>{legend}</figcaption></figure>}
    </div>
  </div></section>;
}
