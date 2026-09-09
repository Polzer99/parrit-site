"use client";

import { useRef, useState } from "react";
import { track } from "@/lib/analytics";
import { ENGAGEMENTS } from "@/system/engagements";
import type { Locale } from "@/system/locale";
import { K } from "./K";

const DICT = {
  fr: {
    title: "Votre agent · esquisse",
    mode: "Esquisse déterministe",
    opening: "Décrivez l'opération qui vous coûte le plus de temps. J'esquisse le système qui la reprend.",
    response: "Voici la première esquisse de votre système :",
    labels: ["Signal", "Décision", "Action"],
    scenarios: {
      followup: ["Dossier sans réponse depuis 12 jours", "Relancer · ton direct · modèle B", "Brouillon prêt, journalisé, réversible"],
      reporting: ["Les chiffres de la semaine, collectés seuls", "Deux écarts à trancher, sur une carte", "Le rapport part à l'heure, sans vous"],
      invoice: ["Facture bloquée détectée au jour 1", "Relance cadrée et chiffrée, à valider", "Encaissement suivi jusqu'au solde"],
      default: ["Votre opération, observée en continu", "Seuls les arbitrages remontent à vous", "Le reste s'exécute et se consigne"],
    },
    close: "La version complète se construit après l'Examen. Laissez votre e-mail ci-dessus : le prototype arrive",
    link: "Laisser mon e-mail",
    input: "Votre opération",
    send: "Esquisser",
  },
  en: {
    title: "Your agent · sketch",
    mode: "Deterministic sketch",
    opening: "Describe the operation that costs you the most time. I'll sketch the system that takes it over.",
    response: "Here is the first sketch of your system:",
    labels: ["Signal", "Decision", "Action"],
    scenarios: {
      followup: ["File silent for 12 days", "Follow up · direct tone · template B", "Draft ready, journaled, reversible"],
      reporting: ["The week's numbers, collected on their own", "Two gaps to arbitrate, on a card", "The report ships on time, without you"],
      invoice: ["Blocked invoice caught on day 1", "Framed, quantified follow-up, for your approval", "Collection tracked to the balance"],
      default: ["Your operation, observed continuously", "Only the arbitrations reach you", "The rest executes and gets recorded"],
    },
    close: "The full version is built after the Examination. Leave your e-mail above: the prototype arrives",
    link: "Leave my e-mail",
    input: "Your operation",
    send: "Sketch",
  },
} as const;

type Scenario = keyof typeof DICT.fr.scenarios;

// LOT 2: bilingual keywords, with precedence matching the validated spec.
function scenarioFor(phrase: string): Scenario {
  if (/relance|client|suivi|follow|chase/i.test(phrase)) return "followup";
  if (/report|chiffre|kpi|tableau|number|dashboard/i.test(phrase)) return "reporting";
  if (/factur|paiement|encaiss|invoice|payment|collect/i.test(phrase)) return "invoice";
  return "default";
}

export function AgentEsquisse({ locale }: { locale: Locale }) {
  const copy = DICT[locale];
  const preparation = ENGAGEMENTS[locale].prepareALaMain;
  const close = `${copy.close} ${preparation.charAt(0).toLowerCase()}${preparation.slice(1)}.`;
  const [phrase, setPhrase] = useState("");
  const [exchange, setExchange] = useState<{ phrase: string; scenario: Scenario } | null>(null);
  const tracked = useRef(false);

  function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const message = phrase.trim();
    if (!message) return;
    const scenario = scenarioFor(message);
    setExchange({ phrase: message, scenario });
    setPhrase("");
    if (!tracked.current) {
      tracked.current = true;
      track("agent_esquisse_used", { scenario });
    }
  }

  return (
    <div className="agent-esquisse" role="region" aria-label={copy.title}>
      <header className="agent-esquisse-header">
        <K className="agent-esquisse-title">{copy.title}</K>
        <K>{copy.mode}</K>
      </header>
      <div className="agent-esquisse-body">
        <p>{copy.opening}</p>
        <form className="agent-esquisse-form" onSubmit={submit}>
          <label className="sr-only" htmlFor="agent-operation">{copy.input}</label>
          <input id="agent-operation" name="operation" type="text" value={phrase} onChange={(event) => setPhrase(event.target.value)} placeholder={copy.input} required />
          <button className="rev-button exec" type="submit" disabled={!phrase.trim()}>{copy.send}</button>
        </form>
        <div aria-live="polite" aria-atomic="true">
          {exchange ? (
            <div className="agent-esquisse-exchange">
              <p className="agent-esquisse-message">{exchange.phrase}</p>
              <p>{copy.response}</p>
              <dl className="agent-esquisse-cells">
                {copy.scenarios[exchange.scenario].map((text, index) => (
                  <div key={copy.labels[index]}>
                    <dt><K>{copy.labels[index]}</K></dt>
                    <dd>{text}</dd>
                  </div>
                ))}
              </dl>
              <p>{close}</p>
              <a className="home-s-text-link" href="#prototype">{copy.link}</a>
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
}
