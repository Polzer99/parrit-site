import type { Locale } from "../locale";
import { K } from "./K";

const STEPS = {
  fr: [
    ["Écriture", "Un contact, un rendez-vous ou un dossier est créé, ici ou dans l'un des onze outils plus anciens qui écrivent encore sur nos contacts."],
    ["Deux contrôles", "Un verrou bloque tout nouveau point d'écriture non déclaré depuis le 13 septembre 2026. Un audit périodique, comme celui du 11 septembre, compare les deux sources."],
    ["Décision humaine", "Le fondateur tranche, un type d'information à la fois, et la date est notée, comme le 14 septembre pour le premier domaine fermé."],
  ],
  en: [
    ["Write", "A contact, a meeting, or a file gets created, here or in one of the eleven older tools that still write to our contacts."],
    ["Two checks", "A gate has blocked any new undeclared write path since September 13, 2026. A periodic audit, like the one run on September 11, compares both sources."],
    ["Human decision", "The founder decides, one type of information at a time, and the date gets logged, like September 14 for the first domain closed."],
  ],
} as const;

export function MechanismSchema({ locale = "en" }: { locale?: Locale }) {
  const steps = STEPS[locale];
  return (
    <div className="mechanism-schema" role="img" aria-label={locale === "fr" ? "Le mécanisme, en trois temps : écriture, deux contrôles, décision humaine." : "The mechanism, in three steps: write, two checks, human decision."}>
      {steps.map(([label, body], index) => (
        <div className="mechanism-schema-step" key={label}>
          <K>{String(index + 1).padStart(2, "0")}</K>
          <h3>{label}</h3>
          <p>{body}</p>
        </div>
      ))}
    </div>
  );
}
