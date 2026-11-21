import { localizedPath, type Locale } from "@/system/locale";
import { homeSectionHeadings } from "@/system/home-layers";
import { BrandConnector } from "./BrandConnector";

// Presse seule depuis la décision du 21/11/2026 (coherence-et-garde-fous, B.1) : la section
// des assistants et l'ancre #assistant n'existent plus. Une colonne : titre, texte, bouton.
export function HomeMeasures({ locale }: { locale: Locale }) {
  const fr = locale === "fr";
  return <section className="home-measures" id={fr ? "mesures" : "measurements"}><div className="wrap">
    <div className="home-press"><h2>{homeSectionHeadings(locale).measures[0]}</h2>
      <p>{fr ? "Le Journal décrit ce qui a fonctionné et ce qui a échoué, avec les dates et les constats. Des chroniques sont parues dans Le Monde Informatique." : "The Journal describes what worked and what failed, with dates and findings. Columns have been published in Le Monde Informatique."}</p>
      <a className="btn rev-button ghost home-journal-link" href={localizedPath("/journal", locale)}>{fr ? "Lire nos retours de terrain" : "Read our field notes"}<BrandConnector/></a>
    </div>
  </div></section>;
}
