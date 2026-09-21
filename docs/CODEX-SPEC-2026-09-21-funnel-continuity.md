# SPEC — Continuité du funnel et justesse des engagements (PR A / 2)

Source : `Audit Funnel Copywriting Sept 20 2026.md` (Paul, transmis le
21/09/2026). Ce document couvre les étapes 1 et 2 de l'audit (« Rétablir la
justesse des engagements » + « Réparer la continuité du parcours »), soit les
constats **F01, F02, F03, F04, F05, F06, F07, F08, F12, F13** et la demande 1
de Paul (fusion du besoin/esquisse/prise de contact). La demande 2 de Paul
(reprise complète du copywriting de l'accueil) fait l'objet d'une seconde
spec, **après** celle-ci — ne pas l'anticiper ici, ne pas réécrire au-delà de
ce qui est listé.

**Acquis à ne pas rouvrir** (PR #273-#276, déjà en production) : en-tête non
fixe, navigation à 2 liens, schéma relationnel `MechanismSchema` (sources →
contrôle → décision), preuve dans le premier écran de `/systems`, distinction
15/25 vs 4 PARITY_FAIL, §60 raccordé aux 8 skills. Ne change dans ces zones
que ce qui est explicitement listé ci-dessous.

**Contrainte inchangée : zéro tiret cadratin (—).**

---

## 1. Fusion du besoin, de l'esquisse et de la prise de contact (demande 1, F03, F14)

**Constat.** `AgentEsquisse` (le texte du besoin) et `QuickCapture` (l'e-mail)
sont deux composants disjoints, avec deux états séparés. Le lien qui relie
l'un à l'autre est une ancre `#prototype` qui saute dans la page, perd le
contexte visuel de l'exemple, et le champ e-mail n'hérite jamais du texte déjà
saisi. Le classement serveur (`interet: "full-os"`) ignore aussi le scénario
détecté côté client, alors que 3 gabarits d'esquisse dédiés existent déjà
(`reporting`, `client-flow`, `mail-followups`) et ne sont donc jamais servis
depuis ce parcours.

**Correction : remplacer intégralement les deux fichiers suivants.**

### `src/system/components/AgentEsquisse.tsx`

```tsx
"use client";

import { useRef, useState } from "react";
import { track } from "@/lib/analytics";
import type { Interet } from "@/lib/server/interets";
import type { Locale } from "@/system/locale";
import { K } from "./K";
import { QuickCapture } from "./QuickCapture";

const DICT = {
  fr: {
    title: "Votre agent · esquisse",
    mode: "Un exemple, pas une analyse de votre entreprise",
    opening: "Décrivez l'opération qui vous coûte le plus de temps. J'esquisse le système qui la reprend.",
    response: "Voici la première esquisse de votre système :",
    labels: ["Signal", "Décision", "Action"],
    scenarios: {
      followup: ["Dossier sans réponse depuis 12 jours", "Relancer · ton direct · modèle B", "Brouillon prêt, journalisé, réversible"],
      reporting: ["Les chiffres de la semaine, collectés seuls", "Deux écarts à trancher, sur une carte", "Le rapport part à l'heure, sans vous"],
      invoice: ["Facture bloquée détectée au jour 1", "Relance cadrée et chiffrée, à valider", "Encaissement suivi jusqu'au solde"],
      default: ["Votre opération, observée en continu", "Seuls les arbitrages remontent à vous", "Le reste s'exécute et se consigne"],
    },
    transition: "Cette esquisse est un exemple, choisi dans une catégorie proche de votre phrase, pas une analyse de votre entreprise. Envoyez-la à Paul : il regarde si un système comme celui-ci a du sens pour vous, et vous répond personnellement.",
    input: "Votre opération",
    send: "Esquisser",
  },
  en: {
    title: "Your agent · sketch",
    mode: "An example, not an analysis of your company",
    opening: "Describe the operation that costs you the most time. I'll sketch the system that takes it over.",
    response: "Here is the first sketch of your system:",
    labels: ["Signal", "Decision", "Action"],
    scenarios: {
      followup: ["File silent for 12 days", "Follow up · direct tone · template B", "Draft ready, journaled, reversible"],
      reporting: ["The week's numbers, collected on their own", "Two gaps to arbitrate, on a card", "The report ships on time, without you"],
      invoice: ["Blocked invoice caught on day 1", "Framed, quantified follow-up, for your approval", "Collection tracked to the balance"],
      default: ["Your operation, observed continuously", "Only the arbitrations reach you", "The rest executes and gets recorded"],
    },
    transition: "This sketch is an example, picked from a category close to your sentence, not an analysis of your company. Send it to Paul: he checks whether a system like this makes sense for you, and replies to you personally.",
    input: "Your operation",
    send: "Sketch",
  },
} as const;

type Scenario = keyof typeof DICT.fr.scenarios;

const INTERET_FOR_SCENARIO: Record<Scenario, Interet> = {
  followup: "client-flow",
  reporting: "reporting",
  invoice: "mail-followups",
  default: "full-os",
};

// LOT 2: bilingual keywords, with precedence matching the validated spec.
function scenarioFor(phrase: string): Scenario {
  if (/relance|client|suivi|follow|chase/i.test(phrase)) return "followup";
  if (/report|chiffre|kpi|tableau|number|dashboard/i.test(phrase)) return "reporting";
  if (/factur|paiement|encaiss|invoice|payment|collect/i.test(phrase)) return "invoice";
  return "default";
}

export function AgentEsquisse({ locale }: { locale: Locale }) {
  const copy = DICT[locale];
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
              <p className="agent-esquisse-transition">{copy.transition}</p>
              <QuickCapture
                locale={locale}
                id="prototype"
                hero
                initialIdee={exchange.phrase}
                interet={INTERET_FOR_SCENARIO[exchange.scenario]}
                autoFocusEmail
              />
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
}
```

Notes de conformité :
- Le lien `href="#prototype"` disparaît : la capture d'e-mail se rend
  désormais EN PLACE, juste sous l'échange, jamais par un saut d'ancre.
- `initialIdee` préremplit le champ existant de `QuickCapture` (facultatif,
  éditable) avec le besoin déjà tapé — un seul texte, jamais deux champs vides
  en parallèle.
- `interet={INTERET_FOR_SCENARIO[exchange.scenario]}` fait correspondre
  l'esquisse affichée à l'écran à ce qui est réellement enregistré et à ce que
  `/sketch/[id]` rendra ensuite (fin du F03 : le classement suit enfin le
  scénario détecté, au lieu d'être toujours `full-os`).
- `autoFocusEmail` donne le focus au champ e-mail au moment où il apparaît,
  sans scroll ni changement de page (fin du F14).
- `.agent-esquisse-transition` : nouvelle classe CSS à ajouter dans
  `rev01.css`, calquée sur `.agent-esquisse-body p` existant (même
  `line-height`, `color: var(--label-d)`, `margin-top: 20px` avant le bloc
  `QuickCapture` qui suit).

### `src/system/components/QuickCapture.tsx`

```tsx
"use client";

import { useEffect, useRef, useState } from "react";

import { track } from "@/lib/analytics";
import { noteFunnel } from "@/system/engagements";
import { localizedPath } from "@/system/locale";
import type { Locale } from "@/system/locale";
import type { Interet } from "@/lib/server/interets";
import { K } from "./K";

const DICT = {
  en: {
    label: "YOUR REQUEST",
    line: "One e-mail address is enough. We reply personally, with an example if your need matches a case we've already sketched.",
    idea: "The process to rebuild, in one sentence (optional)",
    placeholder: "you@company.com",
    button: "Send my request",
    sending: "Sending…",
    invalid: "Enter a valid work e-mail to receive a reply.",
    failure: "Registration failed",
    direct: "Write to us instead:",
    registered: "Registered",
    done: "Your request is registered. Paul reviews it personally and replies by e-mail.",
    watch: "See an illustrative example",
    bookExam: "Book a 15-minute examination",
    aria: "Send my request",
  },
  fr: {
    label: "VOTRE DEMANDE",
    line: "Une adresse e-mail suffit. Nous revenons vers vous personnellement, avec un exemple si votre besoin correspond à un cas déjà esquissé.",
    idea: "Votre process à reconstruire, en une phrase (facultatif)",
    placeholder: "vous@entreprise.fr",
    button: "Envoyer ma demande",
    sending: "Envoi en cours…",
    invalid: "Indiquez un e-mail professionnel valide pour recevoir une réponse.",
    failure: "L'envoi a échoué",
    direct: "Écrivez-nous directement :",
    registered: "Bien reçu.",
    done: "Votre demande est enregistrée. Paul la regarde personnellement et vous répond par e-mail.",
    watch: "Voir l'exemple illustratif",
    bookExam: "Réserver un examen de 15 minutes",
    aria: "Envoyer ma demande",
  },
} as const;

function attribution(): Record<string, string> {
  const values: Record<string, string> = {};
  const params = new URLSearchParams(window.location.search);
  for (const [key, value] of params) {
    if (key.startsWith("utm_") || key === "source") values[key] = value;
  }
  if (document.referrer) values.referrer = document.referrer;
  return values;
}

export function QuickCapture({
  locale, id, hero = false, initialIdee, interet, autoFocusEmail = false,
}: {
  locale: Locale;
  id?: string;
  hero?: boolean;
  initialIdee?: string;
  interet?: Interet;
  autoFocusEmail?: boolean;
}) {
  const copy = DICT[locale];
  const [email, setEmail] = useState("");
  const [idee, setIdee] = useState(initialIdee ?? "");
  const [ideaRevealed, setIdeaRevealed] = useState(Boolean(initialIdee));
  const [submissionId] = useState(() => crypto.randomUUID());
  const [started, setStarted] = useState(false);
  const [state, setState] = useState<"idle" | "invalid" | "sending" | "done" | "error">("idle");
  const [detail, setDetail] = useState("");
  const [sketchUrl, setSketchUrl] = useState("");
  const emailRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (autoFocusEmail) emailRef.current?.focus();
  }, [autoFocusEmail]);

  const start = () => {
    if (started) return;
    setStarted(true);
    track("form_started", { form: "quick-capture", interest: interet ?? "full-os" });
  };

  const submit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (state === "sending" || state === "done") return;
    const emailField = event.currentTarget.elements.namedItem("quick-email");
    if (!(emailField instanceof HTMLInputElement) || !emailField.checkValidity()) {
      setState("invalid");
      if (emailField instanceof HTMLInputElement) emailField.focus();
      return;
    }
    start();
    setState("sending");
    try {
      const response = await fetch("/api/interet", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
          ...(hero ? { idee: idee.slice(0, 300) } : {}),
          interet: interet ?? "full-os",
          source: "site:quick-capture",
          pageOrigine: window.location.pathname,
          lang: locale,
          submissionId,
          attribution: attribution(),
        }),
      });
      const body = (await response.json()) as { ok?: boolean; error?: string; sketchUrl?: string };
      if (response.ok && body.ok) {
        if (body.sketchUrl) setSketchUrl(body.sketchUrl);
        setState("done");
        track("form_completed", { form: "quick-capture", interest: interet ?? "full-os" });
        track("prototype_requested", { form: "quick-capture", interest: interet ?? "full-os" });
      } else {
        setState("error");
        setDetail(body.error ?? `status ${response.status}`);
        track("form_failed", { form: "quick-capture", reason: body.error ?? String(response.status) });
      }
    } catch {
      setState("error");
      setDetail("network");
    }
  };

  if (state === "done") {
    return (
      <section id={id} className={`quick-capture${hero ? " home-s-quick-capture" : ""}`} data-state="done" aria-live="polite">
        <K>{copy.registered}</K>
        <p>{copy.done}</p>
        <div className="quick-capture-next">
          {sketchUrl ? <a className="rev-button exec" href={sketchUrl}>{copy.watch}</a> : null}
          <a className="rev-button ghost" href={localizedPath("/commission", locale)}>{copy.bookExam}</a>
        </div>
      </section>
    );
  }

  return (
    <section id={id} className={`quick-capture${hero ? " home-s-quick-capture" : ""}`} aria-label={copy.aria}>
      {!hero ? <div className="quick-copy">
        <K>{copy.label}</K>
        <p>{copy.line}</p>
      </div> : null}
      <form onSubmit={submit} noValidate>
        {hero ? <div className="home-s-idea-reveal" data-open={ideaRevealed}>
          <label className="sr-only" htmlFor="quick-idee">{copy.idea}</label>
          <input className="quick-idea" id="quick-idee" name="idee" type="text" maxLength={300} value={idee} placeholder={copy.idea} onFocus={start} onChange={(event) => setIdee(event.target.value.slice(0, 300))} />
        </div> : null}
        <div className="quick-fields">
          <label className="sr-only" htmlFor="quick-email">E-mail</label>
          <input ref={emailRef} id="quick-email" name="quick-email" type="email" required autoComplete="email" value={email} placeholder={copy.placeholder} onFocus={() => {
            if (hero) setIdeaRevealed(true);
            start();
          }} onChange={(event) => {
            setEmail(event.target.value);
            if (hero && event.target.value.length > 0) setIdeaRevealed(true);
          }} />
          <button className="rev-button exec" type="submit" disabled={state === "sending"}>{state === "sending" ? copy.sending : copy.button}</button>
        </div>
        {state === "error" ? (
          <span className="ri-error" role="alert">{copy.failure} ({detail}). {copy.direct} paul.larmaraud@parrit.ai</span>
        ) : state === "invalid" ? (
          <span className="ri-error" role="alert">{copy.invalid}</span>
        ) : <K>{noteFunnel(locale, hero ? "hero" : "standard")}</K>}
      </form>
    </section>
  );
}
```

Notes de conformité :
- `import type { Interet } from "@/lib/server/interets"` : import DE TYPE
  seulement (effacé à la compilation) — ne fait entrer aucun code
  `server-only` dans le bundle client. Même mécanisme déjà utilisé par
  `sketch/[id]/page.tsx`.
- Usage sur `/commission` (`<QuickCapture locale={locale} id="commission" />`,
  sans `hero`, sans `interet`) : comportement inchangé, `interet` retombe sur
  `"full-os"` comme aujourd'hui.
- `.quick-capture-next` : nouvelle classe CSS, `display:flex; gap:16px;
  flex-wrap:wrap; margin-top:16px` — ajouter dans `rev01.css` juste après la
  règle `.quick-capture[data-state="done"] p` existante (~ligne 1536).
- `copy.watch` et `copy.bookExam` utilisent `.rev-button.exec` et
  `.rev-button.ghost`, deux classes déjà en usage ailleurs sur le site (aucune
  nouvelle classe de bouton).

### `src/app/(rev01)/page.tsx` — retirer la capture dupliquée du hero

Dans la section `home-s-hero`, remplacer :
```tsx
<AgentEsquisse locale={locale} />
<QuickCapture locale={locale} id="prototype" hero />
```
par :
```tsx
<AgentEsquisse locale={locale} />
```
(`QuickCapture` vit désormais À L'INTÉRIEUR de `AgentEsquisse`, rendu
seulement une fois l'échange affiché — le retirer d'ici évite un doublon de
formulaire.) L'import `QuickCapture` reste nécessaire dans ce fichier pour la
section `home-s-offers`/ailleurs ? **Non** : vérifier qu'aucun autre usage de
`QuickCapture` ne reste dans `page.tsx` après ce retrait ; si c'est le cas,
retirer l'import `QuickCapture` de la ligne `import { K, QuickCapture } from
"@/system/components";` pour ne garder que `K`.

---

## 2. Le classement suit enfin la langue déclarée (F04)

### `src/lib/server/sketch.ts` — remplacer intégralement

```ts
import "server-only";

import { requeteSupabase } from "./supabase";
import type { Interet } from "./interets";
import type { Locale } from "@/system/locale";

/**
 * LECTURE d'une esquisse : la déclaration d'intérêt est retrouvée par son
 * `submission_id` (UUID serveur, non devinable — c'est le jeton d'accès).
 * Lecture seule, tous workspaces (les adresses de test voient leur esquisse).
 */

export type Esquisse = {
  interet: Interet;
  entreprise: string;
  declareLe: string;
  lang: Locale;
};

type LigneProspect = {
  id: string;
  email: string | null;
  entreprise?: string | null;
  metadata: Record<string, unknown> | null;
};

type Declaration = {
  submission_id: string;
  interet: Interet;
  entreprise?: string;
  declare_le: string;
  lang?: string;
};

function entrepriseDepuisEmail(email: string): string {
  const domaine = email.split("@")[1] ?? "";
  const racine = domaine.split(".")[0] ?? "";
  const generiques = ["gmail", "outlook", "hotmail", "yahoo", "icloud", "proton", "protonmail", "orange", "free", "sfr", "laposte"];
  if (!racine || generiques.includes(racine.toLowerCase())) return "your company";
  return racine.charAt(0).toUpperCase() + racine.slice(1);
}

function localeDepuisDeclaration(value: string | undefined): Locale {
  return value === "fr" ? "fr" : "en";
}

export async function lireEsquisse(submissionId: string): Promise<Esquisse | null> {
  if (!/^[0-9a-f-]{36}$/i.test(submissionId)) return null;

  const contains = encodeURIComponent(
    JSON.stringify({ interets_declares: [{ submission_id: submissionId }] }),
  );
  const lignes = await requeteSupabase<LigneProspect>({
    methode: "GET",
    chemin: `prospects?select=id,email,entreprise,metadata&metadata=cs.${contains}&limit=1`,
  });

  const prospect = lignes[0];
  if (!prospect) return null;

  const declarations = (prospect.metadata?.["interets_declares"] ?? []) as Declaration[];
  const declaration = declarations.find((d) => d.submission_id === submissionId);
  if (!declaration) return null;

  const entreprise =
    declaration.entreprise?.trim() ||
    prospect.entreprise?.trim() ||
    entrepriseDepuisEmail(prospect.email ?? "");

  return {
    interet: declaration.interet,
    entreprise,
    declareLe: declaration.declare_le,
    lang: localeDepuisDeclaration(declaration.lang),
  };
}
```

`declaration.lang` existe déjà en base (`interets.ts` l'écrit dans chaque
élément de `interets_declares` depuis toujours) — cette lecture n'exige AUCUNE
migration, juste une lecture d'un champ déjà présent. Les esquisses créées
avant ce correctif n'ont pas ce champ : `localeDepuisDeclaration(undefined)`
retombe sur `"en"`, cohérent avec le F13 ci-dessous (le bare-path est la
convention anglaise du site).

### `src/app/(rev01)/sketch/[id]/page.tsx` — remplacer intégralement

```tsx
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import { lireEsquisse } from "@/lib/server/sketch";
import type { Interet } from "@/lib/server/interets";
import type { Locale } from "@/system/locale";
import { localizedPath } from "@/system/locale";
import { Instrument, K, RegistryLine, St } from "@/system/components";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Operating System · Sketch",
  robots: { index: false, follow: false, nocache: true },
};

type SketchContent = {
  title: string;
  intro: string;
  instrument: { value: string; label: string; status: string; critical?: boolean }[];
  next: string[];
};

/* Chaque intérêt déclaré reçoit son instrument : des lignes crédibles pour CE
   périmètre, pas un gabarit générique. Déterministe — aucun chiffre inventé
   n’est présenté comme réel : c’est une ESQUISSE, dite comme telle. */
const SKETCHES: Record<Locale, Partial<Record<Interet, SketchContent>>> = {
  en: {
    reporting: {
      title: "Reporting that writes itself.",
      intro: "A live model of your operations assembles the pack on schedule, traced to the line and reversible to the day. Nobody writes it, everybody reads it.",
      instrument: [
        { value: "MON 07:00", label: "the weekly pack assembled itself from source systems", status: "DONE" },
        { value: "3", label: "figures moved beyond tolerance, flagged with cause and source", status: "REVIEW", critical: true },
        { value: "0 h", label: "of manual assembly this week, or any week", status: "STANDING" },
      ],
      next: [
        "Examination maps your actual reporting flow: sources, owners, dead time.",
        "Construction rebuilds one pack end-to-end, certified, in production.",
        "Every later capability reads the same live model. Nothing is rebuilt twice.",
      ],
    },
    "client-flow": {
      title: "A client flow that never loses the thread.",
      intro: "Every client, every promise, every next step: one system that remembers, so nobody has to. Touched by hand only when a human decision is required.",
      instrument: [
        { value: "12", label: "open threads, each with its next step and its owner", status: "LIVE" },
        { value: "2", label: "commitments approaching their date, surfaced before they slip", status: "ACTION", critical: true },
        { value: "0", label: "clients waiting on a reply nobody saw", status: "STANDING" },
      ],
      next: [
        "Examination maps how clients actually enter, wait, and leave your pipeline.",
        "Construction rebuilds the critical path, from intake to commitment, as one system.",
        "The CRM becomes something you read, not something you fill.",
      ],
    },
    "mail-followups": {
      title: "Mail answered as doctrine.",
      intro: "Every inbound classified, drafted and journaled; every follow-up fired on time. You sign. The system remembers.",
      instrument: [
        { value: "23", label: "inbound mails classified and drafted since this morning", status: "DONE" },
        { value: "4", label: "follow-ups due today, drafted and waiting for your signature", status: "ACTION", critical: true },
        { value: "100%", label: "of threads journaled with author, time and rationale", status: "STANDING" },
      ],
      next: [
        "Examination reads a week of your real inbox flow: volumes, delays, drops.",
        "Construction ships the classifier and the draft doctrine, certified.",
        "Follow-ups stop depending on memory, yours or anyone's.",
      ],
    },
    "full-os": {
      title: "Your company. One system.",
      intro: "Orders, cash, operations, people, clients: one place to understand what is happening, decide what matters, and act. This sketch shows the first surface.",
      instrument: [
        { value: "3", label: "decisions require the executive this morning", status: "TODAY" },
        { value: "1", label: "exposure surfaced with its cause and the one decision it requires", status: "ACTION", critical: true },
        { value: "7", label: "actions executed overnight, journaled and reversible", status: "JOURNAL" },
      ],
      next: [
        "Examination maps flows, decisions and failure points as an engineering brief.",
        "Construction rebuilds one critical operation end-to-end, certified.",
        "Each capability joins the system; the value of every previous one increases.",
      ],
    },
  },
  fr: {
    reporting: {
      title: "Le reporting qui s'écrit tout seul.",
      intro: "Un modèle à jour de vos opérations assemble le rapport à l'heure prévue, tracé jusqu'à la ligne et réversible jusqu'au jour. Personne ne l'écrit. Tout le monde le lit.",
      instrument: [
        { value: "LUN 07:00", label: "le rapport de la semaine s'est assemblé seul depuis vos systèmes", status: "FAIT" },
        { value: "3", label: "chiffres sortis de la tolérance, signalés avec leur cause et leur source", status: "À TRANCHER", critical: true },
        { value: "0 h", label: "d'assemblage manuel cette semaine, comme toutes les autres", status: "ACQUIS" },
      ],
      next: [
        "L'Examen cartographie votre reporting réel : sources, responsables, temps mort.",
        "La Construction reconstruit un rapport de bout en bout, certifié, en production.",
        "Chaque capacité suivante lit le même modèle à jour. Rien n'est reconstruit deux fois.",
      ],
    },
    "client-flow": {
      title: "Un suivi client qui ne perd jamais le fil.",
      intro: "Chaque client, chaque promesse, chaque prochaine étape : un seul système qui s'en souvient, pour que personne n'ait à le faire. La main humaine n'intervient que pour une vraie décision.",
      instrument: [
        { value: "12", label: "dossiers ouverts, chacun avec sa prochaine étape et son responsable", status: "EN COURS" },
        { value: "2", label: "engagements qui approchent de leur date, signalés avant de glisser", status: "À TRANCHER", critical: true },
        { value: "0", label: "client en attente d'une réponse que personne n'a vue", status: "ACQUIS" },
      ],
      next: [
        "L'Examen cartographie comment vos clients entrent, attendent et sortent réellement de votre pipeline.",
        "La Construction reconstruit le chemin critique, de l'arrivée à l'engagement, en un seul système.",
        "Le CRM devient quelque chose que vous lisez, pas quelque chose que vous remplissez.",
      ],
    },
    "mail-followups": {
      title: "Le mail traité comme une doctrine.",
      intro: "Chaque message entrant classé, rédigé et consigné ; chaque relance part à l'heure. Vous signez. Le système se souvient.",
      instrument: [
        { value: "23", label: "mails entrants classés et rédigés depuis ce matin", status: "FAIT" },
        { value: "4", label: "relances dues aujourd'hui, rédigées et en attente de votre signature", status: "À TRANCHER", critical: true },
        { value: "100%", label: "des échanges consignés avec auteur, heure et motif", status: "ACQUIS" },
      ],
      next: [
        "L'Examen relit une semaine de votre boîte réelle : volumes, délais, oublis.",
        "La Construction livre le classeur et la doctrine de rédaction, certifiés.",
        "Les relances cessent de dépendre d'une mémoire, la vôtre ou celle de quelqu'un d'autre.",
      ],
    },
    "full-os": {
      title: "Votre entreprise. Un seul système.",
      intro: "Commandes, trésorerie, opérations, équipe, clients : un seul endroit pour comprendre ce qui se passe, décider ce qui compte, et agir. Cette esquisse montre la première surface.",
      instrument: [
        { value: "3", label: "décisions attendent le dirigeant ce matin", status: "AUJOURD'HUI" },
        { value: "1", label: "exposition signalée avec sa cause et la seule décision qu'elle exige", status: "À TRANCHER", critical: true },
        { value: "7", label: "actions exécutées cette nuit, consignées et réversibles", status: "JOURNAL" },
      ],
      next: [
        "L'Examen cartographie les flux, les décisions et les points de rupture, comme un cahier des charges technique.",
        "La Construction reconstruit une opération critique de bout en bout, certifiée.",
        "Chaque capacité rejoint le système ; la valeur de toutes les précédentes augmente.",
      ],
    },
  },
};

const CHROME = {
  en: {
    sectionKicker: (company: string, date: string) => `PARRIT / SKETCH · PREPARED FOR ${company.toUpperCase()} · ${date}`,
    instrumentLeft: (company: string) => `${company.toUpperCase()} / OS · SKETCH`,
    draft: "Draft 01",
    caption: "A SKETCH, NOT A PROMISE. THE REAL INSTRUMENT IS BUILT ON YOUR ACTUAL FLOWS.",
    nextHeading: "From sketch to system.",
    phasesLabel: "Three phases",
    phaseNames: ["Examination", "Construction", "Compounding"],
    closeTitle: "Fifteen minutes turns this sketch into a scope.",
    closeProof: "15 MIN · AN EXAMINATION, NOT A SALES CALL",
    talk: "Let's talk",
    registry: "PARRIT / SKETCH · DRAFT 01 · 2026",
    commissioned: "COMMISSIONED, NOT SUBSCRIBED",
  },
  fr: {
    sectionKicker: (company: string, date: string) => `PARRIT / ESQUISSE · PRÉPARÉ POUR ${company.toUpperCase()} · ${date}`,
    instrumentLeft: (company: string) => `${company.toUpperCase()} / OS · ESQUISSE`,
    draft: "Brouillon 01",
    caption: "UNE ESQUISSE, PAS UNE PROMESSE. LE VRAI INSTRUMENT SE CONSTRUIT SUR VOS FLUX RÉELS.",
    nextHeading: "De l'esquisse au système.",
    phasesLabel: "Trois phases",
    phaseNames: ["Examen", "Construction", "Capitalisation"],
    closeTitle: "Quinze minutes transforment cette esquisse en périmètre.",
    closeProof: "15 MIN · UN EXAMEN, PAS UN APPEL COMMERCIAL",
    talk: "Parlons-en",
    registry: "PARRIT / ESQUISSE · BROUILLON 01 · 2026",
    commissioned: "UNE COMMANDE, PAS UN ABONNEMENT",
  },
} as const;

export default async function SketchPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const esquisse = await lireEsquisse(id).catch(() => null);
  if (!esquisse) notFound();

  const locale = esquisse.lang;
  const chrome = CHROME[locale];
  const sketch = SKETCHES[locale][esquisse.interet] ?? SKETCHES[locale]["full-os"]!;
  const company = esquisse.entreprise;
  const date = new Date(esquisse.declareLe).toISOString().slice(0, 10);

  return (
    <main className="rev-page r2-dark">
      <div className="r2-wrap">
        <header className="r2-hero sketch-hero">
          <K>{chrome.sectionKicker(company, date)}</K>
          <h1>{sketch.title}</h1>
          <p className="r2-sub">{sketch.intro}</p>
        </header>

        <section className="r2-instrument-stage" aria-label="Sketched instrument">
          <Instrument
            className="home-instrument"
            left={<St kind="crit">{chrome.instrumentLeft(company)}</St>}
            center={<K className="instrument-sep">·</K>}
            right={<K>{chrome.draft}</K>}
            rows={sketch.instrument.map((row) => ({
              value: row.value,
              label: row.label,
              status: (
                <K style={row.critical ? { color: "var(--accent-on-dark)" } : undefined}>{row.status}</K>
              ),
              critical: row.critical,
            }))}
          />
          <div className="r2-instrument-caption">
            <K>{chrome.caption}</K>
          </div>
        </section>

        <section className="r2-section" aria-labelledby="sketch-next-heading">
          <div className="r2-shead">
            <h2 className="r2-ed" id="sketch-next-heading">{chrome.nextHeading}</h2>
            <K>{chrome.phasesLabel}</K>
          </div>
          <div className="r2-phases">
            {sketch.next.map((step, index) => (
              <div className="r2-phase" key={step}>
                <div className="no">{`0${index + 1}`}</div>
                <div className="nm">{chrome.phaseNames[index] ?? ""}</div>
                <div className="ds">{step}</div>
              </div>
            ))}
          </div>
        </section>

        <section className="r2-close" aria-label="Commission">
          <h2>{chrome.closeTitle}</h2>
          <p className="proof">{chrome.closeProof}</p>
          <Link className="rev-button exec" href={localizedPath("/commission", locale)}>{chrome.talk}</Link>
        </section>

        <footer className="r2-footer">
          <RegistryLine value={chrome.registry} />
          <K>{chrome.commissioned}</K>
          <K>© 2026 Parrit.ai</K>
        </footer>
      </div>
    </main>
  );
}
```

Notes de conformité :
- Les 4 gabarits FR sont des rédactions natives (Examen/Construction/
  Capitalisation reprend le trio déjà canonique de `/systems`), pas des
  traductions littérales de l'anglais — conforme à la doctrine Carla.
- Les valeurs chiffrées (12, 2, 0, 23, 4, 100%, 3, 1, 7…) sont strictement
  identiques aux gabarits anglais existants : aucun chiffre nouveau, aucune
  invention.
- `metadata` (titre `<title>`, noindex) reste inchangé : page technique non
  indexée, hors périmètre de cette correction de fond.
- `PARRIT / SKETCH · DRAFT 01 · 2026` et `COMMISSIONED, NOT SUBSCRIBED`
  suivent le précédent déjà établi par `ParritCalInline` (`UNE COMMANDE, PAS
  UN ABONNEMENT` existe déjà comme traduction canonique du même énoncé) : ce
  registre courte forme EST localisé ailleurs sur le site, ce n'est pas une
  exception inventée ici.

---

## 3. La langue par défaut du tracking (F13)

### `src/lib/analytics.ts`

Remplacer :
```ts
function getLang(pathname: string): string {
  const segment = pathname.split("/").filter(Boolean)[0];
  return segment && ["fr", "en", "pt-BR", "zh-CN"].includes(segment)
    ? segment
    : "fr";
}
```
par :
```ts
function getLang(pathname: string): string {
  const segment = pathname.split("/").filter(Boolean)[0];
  return segment && ["fr", "en", "pt-BR", "zh-CN"].includes(segment)
    ? segment
    : "en";
}
```
(Seul le repli par défaut change, de `"fr"` à `"en"` — cohérent avec
`localizedPath`/`barePathname` : un chemin SANS préfixe est la page anglaise
sur ce site, jamais la française. Le préfixe `/fr` est la seule marque du
français.)

---

## 4. La portée du contrôle, dans le schéma (F08)

### `src/system/components/MechanismSchema.tsx`

Remplacer la ligne `control` :
```ts
control: ["Deux contrôles", "Un verrou bloque toute nouvelle écriture non déclarée. Un audit du 11 septembre a trouvé 114 fiches présentes uniquement dans l'ancien système."],
```
par :
```ts
control: ["Deux contrôles", "Un verrou, posé au moment de modifier le code, empêche d'ajouter un nouveau point d'écriture non déclaré. Un audit du 11 septembre a trouvé 114 fiches présentes uniquement dans l'ancien système."],
```
et la ligne anglaise :
```ts
control: ["Two checks", "A gate blocks any new undeclared write. An audit run on September 11 found 114 records that existed only in the old system."],
```
par :
```ts
control: ["Two checks", "A gate, applied when the code changes, blocks any new undeclared write path from being added. An audit run on September 11 found 114 records that existed only in the old system."],
```
(La portée redevient celle du narratif juste au-dessus sur la même page :
« un contrôle automatique interdit désormais d'ajouter un nouveau point
d'écriture vers l'ancien système sans le déclarer ici » — un contrôle au
moment d'une modification du code, pas une interception de chaque écriture en
production. Rien d'autre ne change dans ce fichier.)

---

## 5. Deux résultats clients sans appui dans le registre de preuves (F06)

**Constat.** `src/lib/registry/preuves.ts` — le registre canon des preuves
publiables — déclare explicitement : « Au 01/08/2026 le Consolidation Gate
compte 0 initiative de niveau 5 : aucune métrique client n'est publiable, et
le registre n'en contient aucune. » Aucune entrée de ce registre ne
correspond aux chiffres affichés sur `/dossiers` pour le dossier 26-002
(cabinet d'avocats, « 5 à 10 K€ de plus par mois ») et 26-003 (marque grand
public, « deux mois et demi » de cycle disparu). Le dossier 26-002 porte de
plus le sceau « En construction · Premières briques en service » : afficher un
résultat financier déjà réalisé pour une livraison encore partielle est une
contradiction interne, indépendamment de la question de l'autorisation.

**Correction : ne pas inventer de remplacement chiffré, décrire le mécanisme
livré, cohérent avec le sceau de chaque dossier.**

### `src/app/(rev01)/dossiers/page.tsx`

Dans `DICT.en.dossiers`, remplacer le `body` du dossier `26-003` :
```ts
"body": "Two and a half months of that cycle are gone. The client's own team runs it alone, today."
```
par :
```ts
"body": "The report assembles itself from the source systems, with no manual rebuild. The client's own team runs it alone, today."
```
et le `body` du dossier `26-002` :
```ts
"body": "€5K to €10K more per month. Client intake and follow-ups, rebuilt on the firm's own infrastructure."
```
par :
```ts
"body": "Client intake and follow-ups are being rebuilt on the firm's own infrastructure. The first capabilities are already running; the rest follows the same method."
```

Dans `DICT.fr.dossiers`, remplacer le `body` du dossier `26-003` :
```ts
"body": "Deux mois et demi de ce cycle ont disparu. L'équipe du client le fait tourner seule, aujourd'hui."
```
par :
```ts
"body": "Le rapport s'assemble depuis les systèmes sources, sans reprise manuelle. L'équipe du client le fait tourner seule, aujourd'hui."
```
et le `body` du dossier `26-002` :
```ts
"body": "5 à 10 K€ de plus par mois. L'arrivée des clients et les relances, refondues sur l'infrastructure du cabinet."
```
par :
```ts
"body": "L'arrivée des clients et les relances sont refondues sur l'infrastructure du cabinet. Les premières briques tournent déjà ; le reste suit la même méthode."
```

`ref`, `title` et `seal` de ces deux dossiers ne changent pas. Le dossier
26-001 (Parrit.ai, notre propre système) n'a pas de chiffre non plus : ne pas
y toucher.

---

## 6. La promesse de retour arrière, PS-04 (F07)

### `src/app/(rev01)/standard/page.tsx`

Dans `DICT.en.principles`, remplacer la scène de `PS-04` :
```ts
"A follow-up sent by mistake: one click undoes it and restores the state before."
```
par :
```ts
"A send still pending cancels with one click. Once it's gone, the internal state rolls back and a correction can go out: never the erasure of a message someone has already received."
```
Dans `DICT.fr.principles`, remplacer la scène de `PS-04` :
```ts
"Une relance partie par erreur : un clic l'annule et restaure l'état d'avant."
```
par :
```ts
"Un envoi encore en attente s'annule d'un clic. Une fois parti, l'état interne revient en arrière et une correction peut repartir : jamais l'effacement d'un message déjà reçu."
```
L'intitulé de PS-04 (« The way back is written in advance. » / « Le retour
arrière est écrit d'avance. ») ne change pas : c'est la scène d'illustration
qui devient exacte, pas le principe.

---

## 7. La durée de l'audit initial, alignée sur le rendez-vous réellement réservé (F01)

**Constat.** `Build With You` annonce un « audit offert » de 30 minutes ; son
bouton de réservation mène à `/commission`, où le rendez-vous réellement
réservable dure 15 minutes (page ET calendrier Cal.com). Ce n'est pas un
deuxième rendez-vous distinct : c'est le même lien, la même page, le même
examen. Seule la restitution (30 min, étape 2, séparée) ne change pas.

**Correction : aligner le nom et la durée de l'étape 1 sur l'examen réel, sans
toucher à la restitution ni au forfait.**

### `src/app/(rev01)/build-with-you/page.tsx`

Remplacer dans `DICT.en` :
```ts
steps: [
  ["01", "Free audit", "30 minutes to go over your situation."],
  ["02", "Findings review", "30 minutes to review the findings together."],
  ["03", "Build together", "10 hours with the founder to build a working system."],
],
...
cta: "Book the free initial audit",
```
par :
```ts
steps: [
  ["01", "Free examination", "The same 15-minute examination as every commission."],
  ["02", "Findings review", "30 minutes to review the findings together."],
  ["03", "Build together", "10 hours with the founder to build a working system."],
],
...
cta: "Book the free examination",
```
Remplacer dans `DICT.fr` :
```ts
steps: [
  ["01", "Audit offert", "30 minutes pour parcourir votre situation."],
  ["02", "Restitution", "30 minutes pour reprendre les constats ensemble."],
  ["03", "Construction ensemble", "10 heures avec le fondateur pour construire un système qui tourne."],
],
...
cta: "Réserver l’audit initial gratuit",
```
par :
```ts
steps: [
  ["01", "Examen offert", "Le même examen de 15 minutes que toute commande."],
  ["02", "Restitution", "30 minutes pour reprendre les constats ensemble."],
  ["03", "Construction ensemble", "10 heures avec le fondateur pour construire un système qui tourne."],
],
...
cta: "Réserver l’examen offert",
```

### `src/app/(rev01)/page.tsx` (accueil) et `src/app/(rev01)/systems/page.tsx`

Dans les deux fichiers, le tableau `deliverables` de l'offre « Build With
You » est dupliqué à l'identique. Remplacer, dans `DICT.en` des deux
fichiers :
```ts
deliverables: ["Free 30-minute audit", "30-minute findings review", "10 hours of building with Paul"],
```
par :
```ts
deliverables: ["Free 15-minute examination", "30-minute findings review", "10 hours of building with Paul"],
```
et dans `DICT.fr` des deux fichiers :
```ts
deliverables: ["Audit de 30 min offert", "Restitution de 30 min", "10 heures de construction avec Paul"],
```
par :
```ts
deliverables: ["Examen offert de 15 min", "Restitution de 30 min", "10 heures de construction avec Paul"],
```
(4 occurrences au total dans ces deux fichiers : 2 langues × 2 fichiers.
`price`, `format`, `basis`, `outcome`, `audience` ne changent pas.)

---

## 8. Le premier écran de `/systems` tient dans la fenêtre (F12)

**Constat mesuré par l'audit** : à 1363×936 px, la carte ajoutée dans le hero
de `/systems` mesure ~937 px de haut (elle réutilise `SystemCard` en entier,
avec ses 4 blocs `dt/dd` — Entrée/Traitement/Sortie/Limites). Rien n'est
lisible sans défiler.

**Correction : dans le hero, ne montrer que le titre, une preuve courte et
une limite courte — pas la fiche complète.** Le catalogue complet (4 cartes,
`SystemCard` intégral) reste inchangé plus bas dans `#capacites`.

### `src/app/(rev01)/systems/page.tsx`

Ajouter, à côté de `EVIDENCE` (même fichier, avant `DICT`), une constante
avec la PREMIÈRE PHRASE, mot pour mot, du champ `limits` de
`evidence.cards[0]` — aucun texte nouveau, une citation exacte tronquée :

```ts
const HERO_PROOF_LIMIT = {
  fr: "Au 13 septembre 2026, 15 types d'information sur 25 avaient encore deux sources en présence.",
  en: "As of September 13, 2026, 15 of the 25 types of information still had two sources in place.",
} as const;
```

Remplacer le bloc actuel :
```tsx
<div className="systems-hero-proof">
  <K>{copy.observed}</K>
  <SystemCard {...evidence.cards[0]} locale={locale} />
</div>
```
par :
```tsx
<div className="systems-hero-proof">
  <K>{copy.observed}</K>
  <article className="system-card offer-card" style={{ border: 0, background: "var(--ink)" }}>
    <h3>{evidence.cards[0].name}</h3>
    <p>{evidence.cards[0].output}</p>
    <p style={{ color: "var(--g2)" }}>{HERO_PROOF_LIMIT[locale]}</p>
    <K>{evidence.cards[0].proofLabel}</K>
  </article>
</div>
```
(`evidence.cards[0].output` et `.proofLabel` sont déjà écrits, déjà
approuvés — aucun texte n'est inventé, seul l'assemblage change. Retirer
l'import `SystemCard` de ce fichier UNIQUEMENT s'il n'est plus utilisé
ailleurs dans la page — vérifier : `#capacites` l'utilise encore pour les 4
cartes complètes, donc l'import reste.)

Aucun changement CSS requis : `.system-card`/`.offer-card` existent déjà et
donnent, avec 3 lignes de texte au lieu d'un `<dl>` à 4 entrées, une hauteur
très inférieure. Mesurer après implémentation (desktop 1363×936 et mobile
390×844) : le titre, la preuve, la date (déjà rendue par `copy.observed`
juste au-dessus) et la limite doivent être visibles sans défiler sur desktop ;
un court défilement est acceptable sur mobile, mais le bloc entier ne doit
plus dépasser environ 400 px de haut.

---

## Vérification à livrer dans la PR

1. `grep -n "—"` sur tous les fichiers touchés → aucun résultat nouveau.
2. `grep -rn "#prototype" src/` → plus aucune occurrence en `href` (l'ancre
   disparaît ; l'`id="prototype"` peut rester, il n'est plus qu'un identifiant
   DOM sans lien pointant vers lui).
3. Parcours manuel FR et EN, desktop et mobile, dans `npx next start -p
   3210` : taper un besoin dans le hero, cliquer « Esquisser », vérifier que
   le champ e-mail apparaît EN PLACE (pas de scroll vers le bas de page), que
   le besoin tapé est visible/éditable dans le champ, soumettre avec une
   adresse `@test.parrit.ai` ou équivalent marqueur de test déjà reconnu par
   `estAdresseDeTest` (`src/lib/server/leads.ts`), vérifier la confirmation
   et les deux liens de suite (exemple + réservation), ouvrir le lien
   d'exemple et vérifier qu'il est dans LA MÊME langue que le formulaire.
4. `npm run build && npm run qa:brand:rev01` verts.
5. `npx next start -p 3210 &` puis `npm run qa:network:rev01` vert — corriger
   toute fixture périmée par ces changements (nouveaux libellés de bouton,
   nouvelle structure du hero, nouvelle carte compacte sur `/systems`).
   Ne jamais assouplir une assertion au-delà de ce qui a réellement changé.
6. Capture desktop (1440×900) et mobile (390×844), FR et EN, de : l'accueil
   avant/après clic sur « Esquisser », la confirmation après soumission de
   test, et le premier écran de `/systems`.
