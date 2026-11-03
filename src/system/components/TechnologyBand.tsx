import type { Locale } from "@/system/locale";
import { SINGLE_PAGE_EN } from "@/system/single-page-copy";
import { PUBLIC_TECHNOLOGIES } from "@/system/technologies";

/** Complete server-rendered lists; CSS alone controls motion and its static fallback. */
export function TechnologyBand({ locale }: { locale: Locale }) {
  const t = (text: string) => locale === "fr" ? text : SINGLE_PAGE_EN[text];
  return <section id="technologies" className="tech" aria-labelledby="technologies-title" tabIndex={0}>
    <div className="tech-content">
      <div className="wrap"><p id="technologies-title" className="tech-title">
        {t("Pour chaque besoin,")}{" "}<b>{t("nous choisissons la meilleure technologie.")}</b>
      </p></div>
      <div className="tech-marquee"><div className="tech-track">
        {[false, true].map(duplicate => <ul className="tech-set" role="list" key={String(duplicate)} aria-hidden={duplicate || undefined}>
          {PUBLIC_TECHNOLOGIES.map(({ name, logo }) => <li key={name}>
            <i className={logo ? "tech-icon" : "tech-square"} aria-hidden="true"
              style={logo ? { maskImage: `url(/tech/${logo}.svg)` } : undefined}/>
            <span>{name}</span>
          </li>)}
        </ul>)}
      </div></div>
    </div>
  </section>;
}
