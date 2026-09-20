import type { Metadata } from "next";
import Link from "next/link";
import { getLocale } from "@/lib/server/locale";
import { K, RegistryLine } from "@/system/components";
import { OfferCard } from "@/system/components/OfferCard";
import { SystemCard } from "@/system/components/SystemCard";
import { RegistrySnapshot } from "@/system/components/RegistrySnapshot";
import { localizedAlternates, localizedOpenGraph, localizedPath } from "@/system/locale";

// Historical snapshot and approved facts: docs/CODEX-SPEC-2026-09-20-systems-page.md §1.
const EVIDENCE = {
  "en": {
    "cards": [
      {
        "domain": "Data governance",
        "name": "Multi-domain truth registry",
        "input": "a candidate read or write on a business domain",
        "process": "checks the declared canonical source, detects writes still happening elsewhere",
        "output": "a per-domain state, and a write-block toward the legacy source when needed",
        "limits": "15 of 25 domains still split-brain as of 2026-09-13; no cutover without replayable parity",
        "proofLabel": "R-06 · publishable evidence"
      },
      {
        "domain": "Delivery discipline",
        "name": "Three-pass Codex ↔ Claude review",
        "input": "a written specification",
        "process": "isolated implementation in a dedicated workspace, independent review, re-run of the existing test suite",
        "output": "a merged or blocked review, never a direct commit",
        "limits": "a misconfigured default test command can produce a false red — fixed by hand, never by loosening the check (hit 3 times on 2026-09-20)",
        "proofLabel": "Verifiable in real time"
      },
      {
        "domain": "Quality before publishing",
        "name": "Deterministic gates",
        "input": "code ready to merge",
        "process": "automatic check of brand tokens, risky numeric claims, and responsive rendering",
        "output": "a mechanical block, not a reminder",
        "limits": "a gate can fire on a vocabulary false positive; the fix stays human, the gate itself is not loosened (hit on 2026-09-20)",
        "proofLabel": "Verifiable in real time"
      },
      {
        "domain": "Mobile decision",
        "name": "Decision loop (internal staging)",
        "input": "a pending record or task",
        "process": "compact presentation, human decision on mobile",
        "output": "an action logged to the journal",
        "limits": "internal demonstrator in staging; no usage counter observed to date",
        "proofLabel": "R-13 · internal demonstrator in staging"
      }
    ],
    "steps": [
      "A candidate write lands on a business domain (contact, campaign, deadline, transcript).",
      "The domain is checked against the registry: which table is canonical, who still writes elsewhere.",
      "The registry computes a state: cut over, migrating, not started, or parity failed if two sources disagree.",
      "A cutover or a write-block is proposed. Never executed alone.",
      "The founder arbitrates: no cutover without replayable parity, one domain at a time.",
      "The registry is updated in the same move as the decision, never after the fact.",
      "15 of 25 domains still split-brain as of 2026-09-13, visible through this same mechanism, not hidden."
    ],
    "acquisition": "This same registry governs the acquisition domain. Three separate facts, never merged: signals the pipeline can process (the pipeline exists; the canonical acquisition system itself is not yet cut over), meetings obtained through that channel (none recorded), sales attributed to that channel (none — clients come from personal relationships, not the machine). We say this here instead of hiding it.",
    "story": "Every business object Parrit relies on — contacts, deadlines, transcripts, opportunities — has to declare which system tells the truth about it. Most haven't finished the move yet. We show that state instead of rounding it up."
  },
  "fr": {
    "cards": [
      {
        "domain": "Gouvernance de la donnée",
        "name": "Registre de vérité multi-domaines",
        "input": "une écriture ou lecture candidate sur un domaine métier",
        "process": "vérification de la source canonique déclarée, détection des écritures encore faites ailleurs",
        "output": "un état par domaine et un blocage d'écriture vers la source historique si nécessaire",
        "limits": "15 domaines sur 25 encore en double écriture au 13/09/2026 ; aucune bascule sans parité rejouable",
        "proofLabel": "R-06 · preuve publiable"
      },
      {
        "domain": "Discipline de livraison",
        "name": "Revue à trois passes Codex ↔ Claude",
        "input": "une spécification écrite",
        "process": "implémentation isolée dans un chantier dédié, relecture indépendante, rejeu de la batterie de tests",
        "output": "une revue mergée ou bloquée, jamais un commit direct",
        "limits": "une commande de batterie mal configurée peut donner un faux rouge — corrigé à la main, jamais en assouplissant le contrôle (rencontré 3 fois le 20/09/2026)",
        "proofLabel": "Pratique vérifiable en direct"
      },
      {
        "domain": "Qualité avant publication",
        "name": "Gates déterministes",
        "input": "du code prêt à fusionner",
        "process": "vérification automatique des tokens de marque, des affirmations chiffrées à risque, du rendu responsive",
        "output": "un blocage mécanique, pas un rappel à la mémoire",
        "limits": "un gate peut se déclencher sur un faux positif de vocabulaire ; la correction reste humaine, le gate ne s'assouplit pas (rencontré le 20/09/2026)",
        "proofLabel": "Pratique vérifiable en direct"
      },
      {
        "domain": "Décision mobile",
        "name": "Boucle de décision (staging interne)",
        "input": "une fiche ou une tâche en attente",
        "process": "présentation compacte, décision humaine sur mobile",
        "output": "une action tracée au journal",
        "limits": "démonstrateur interne en staging ; aucun compteur d'usage constaté à ce jour",
        "proofLabel": "R-13 · démonstrateur interne en staging"
      }
    ],
    "steps": [
      "Une écriture candidate arrive sur un domaine métier (contact, campagne, échéance, transcript).",
      "Le domaine est vérifié contre le registre : quelle table fait foi, qui écrit encore ailleurs.",
      "Le registre calcule un état : basculé, en migration, non démarré, ou parité en échec si deux sources ne se recoupent pas.",
      "Une bascule ou un blocage d'écriture est proposé. Jamais exécuté seul.",
      "Le fondateur arbitre : pas de bascule sans parité rejouable, un domaine à la fois.",
      "Le registre est mis à jour dans le même geste que la décision, jamais après coup.",
      "15 domaines sur 25 encore en double écriture au 13/09/2026, visibles par ce même mécanisme, pas cachés."
    ],
    "acquisition": "Ce même registre gouverne aussi le domaine acquisition. Trois faits distincts, jamais confondus : signaux que le pipeline peut traiter (le pipeline existe, le système d'acquisition canonique lui-même n'est pas encore basculé), rendez-vous obtenus par ce canal (aucun constaté), ventes attribuées à ce canal (aucune — nos clients viennent de relations personnelles, pas de la machine). Nous le disons ici plutôt que de le cacher.",
    "story": "Chaque objet métier dont Parrit dépend — contacts, échéances, transcripts, opportunités — doit déclarer quel système fait foi sur lui. La plupart n'ont pas fini la bascule. Nous montrons cet état plutôt que de l'arrondir."
  }
} as const;

const DICT = {
  en: {
    kicker: "Parrit / Systems", title: "What Parrit actually builds.",
    sub: "Not a pitch. The objects, the decisions, and the humans who validate them — shown as they run, with their real limits.",
    cta: "Let's talk", catalogue: "Demonstrated capabilities.", evidence: "Shown, not claimed.",
    intro: "Our own systems and delivery practices, with their observed limits.",
    facts: [
      ["Truth registry", "25 domains tracked, observed 2026-09-13. The migration is unfinished."],
      ["Three-pass review", "Codex ↔ Claude: implementation, independent review, test replay. A misconfigured test command produced a false red three times on 2026-09-20; fixed by hand without loosening the check."],
      ["Deterministic gates", "Brand, claims and network checks block publication. A vocabulary false positive blocked a PR on 2026-09-20; the wording was corrected, the gate unchanged."],
    ],
    operating: "How a decision actually moves.",
    chain: "signal → identified object → computed state → prepared decision → human validation → write-back → result",
    stepNames: ["Signal", "Identified object", "Computed state", "Prepared decision", "Human validation", "Write-back", "Observed result"],
    central: "Parrit / Central case", caseTitle: "Parrit runs on Parrit.",
    observed: "Internal · data governance · observed 2026-09-13",
    record: ["25 business domains tracked", "1 domain cut over, 8 migrating, 4 parity failures, 12 not started", "0 writes back to the historical source without documented human validation"],
    mechanism: "See the full mechanism above", method: "Method",
    methodBody: "Every system above is built the same way: Examination, Construction, Compounding.", methodLink: "Read the Manufacture",
    guardrails: "Operating guardrails.",
    guards: ["A source of truth per domain, never a table chosen by default.", "Human validation before any cutover or write-back.", "A decision journal, no silent actions.", "Rollback: every change goes through a reversible review before merging.", "Models chosen for the need, routed by cost and workload; no single imposed provider, no lock-in."],
    offer: "Where to start.", audience: "For leaders who want something that runs, not an audit or a deck.",
    outcome: "A working system, built with the founder.",
    deliverables: ["Free 30-minute audit", "30-minute findings review", "10 hours of building with Paul"],
    format: "10 hours, with the founder", basis: "fixed fee", offerCta: "See Build With You",
    faq: [
      ["Is this training or a delivered system?", "A system. Any skill transfer happens along the way — the deliverable is something that runs, not a course."],
      ["Where does our data go?", "Into your own accounts, under your own keys. We do not replicate it elsewhere."],
      ["Who maintains the system afterward?", "You, or us on a quote — the choice is made after the Examination, never before."],
      ["Where do we start?", "A 15-minute Examination, no commitment."],
    ], legal: "Legal",
  },
  fr: {
    kicker: "Parrit / Systèmes", title: "Ce que Parrit construit, réellement.",
    sub: "Pas un pitch. Les objets, les décisions et les humains qui les valident — montrés tels qu'ils tournent, avec leurs vraies limites.",
    cta: "Parlons-en", catalogue: "Capacités démontrées.", evidence: "Montré, pas revendiqué.",
    intro: "Nos propres systèmes et pratiques de livraison, avec leurs limites constatées.",
    facts: [
      ["Registre de vérité", "25 domaines suivis, état constaté le 13/09/2026. La migration reste inachevée."],
      ["Revue à trois passes", "Codex ↔ Claude : implémentation, relecture indépendante, rejeu des tests. Une commande mal configurée a produit un faux rouge trois fois le 20/09/2026 ; corrigé à la main sans assouplir le contrôle."],
      ["Gates déterministes", "Les contrôles de marque, d'affirmations et de réseau bloquent la publication. Un faux positif de vocabulaire a bloqué une PR le 20/09/2026 ; formulation corrigée, gate inchangé."],
    ],
    operating: "Comment une décision se déplace réellement.",
    chain: "signal → objet identifié → état calculé → décision préparée → validation humaine → écriture retour → résultat",
    stepNames: ["Signal", "Objet identifié", "État calculé", "Décision préparée", "Validation humaine", "Écriture retour", "Résultat observé"],
    central: "Parrit / Cas central", caseTitle: "Parrit tourne sur Parrit.",
    observed: "Interne · gouvernance de données · constaté le 13/09/2026",
    record: ["25 domaines métier suivis", "1 domaine basculé, 8 en migration, 4 en échec de parité, 12 non démarrés", "0 réécriture vers la source historique sans validation humaine documentée"],
    mechanism: "Voir le mécanisme complet ci-dessus", method: "Méthode",
    methodBody: "Chaque système ci-dessus se construit de la même façon : Examen, Construction, Capitalisation.", methodLink: "Lire la Manufacture",
    guardrails: "Garde-fous opérationnels.",
    guards: ["Source de vérité par domaine, jamais une table choisie par défaut.", "Validation humaine avant toute bascule ou tout write-back.", "Journal des décisions, pas d'action silencieuse.", "Rollback : chaque changement passe par une revue réversible avant fusion.", "Modèle choisi selon le besoin, routage par coût et charge de travail ; jamais un seul fournisseur imposé, pas de lock-in."],
    offer: "Par où commencer.", audience: "Pour le dirigeant qui veut repartir avec quelque chose qui tourne, pas un audit ni un deck.",
    outcome: "Un système qui tourne, construit avec le fondateur.",
    deliverables: ["Audit de 30 min offert", "Restitution de 30 min", "10 heures de construction avec Paul"],
    format: "10 heures, avec le fondateur", basis: "forfait", offerCta: "Découvrir Build With You",
    faq: [
      ["Formation ou système livré ?", "Un système. Le transfert de compétence se fait en chemin — le livrable est quelque chose qui tourne, pas un support de cours."],
      ["Où vont nos données ?", "Dans vos comptes, sous vos clés. Nous ne les répliquons pas ailleurs."],
      ["Qui maintient le système ensuite ?", "Vous, ou nous sur devis — le choix se fait après l'Examen, jamais avant."],
      ["Par où commence-t-on ?", "Un Examen de 15 minutes, sans engagement."],
    ], legal: "Mentions légales",
  },
} as const;

const ROWS = [
  { domain: "GTM.contacts_identity", source: "superapp", status: "PARITY_FAIL", legacyWriters: 11 },
  { domain: "GTM.do_not_contact", source: "superapp", status: "MIGRATING", legacyWriters: 1 },
  { domain: "GTM.campaigns / outbound", source: "external:instantly", status: "NOT_STARTED", legacyWriters: 0 },
  { domain: "CLOSING.next_actions", source: "superapp", status: "PARITY_FAIL", legacyWriters: 1 },
  { domain: "CLOSING.opportunities", source: "superapp", status: "PARITY_FAIL", legacyWriters: 2 },
  { domain: "TRANSCRIPTS.transcripts", source: "superapp", status: "MIGRATING", legacyWriters: 6 },
  { domain: "SYSTEM_STATE.events", source: "superapp", status: "MIGRATING", legacyWriters: 6 },
] as const;

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getLocale();
  const copy = DICT[locale];
  return { title: copy.title, description: copy.sub,
    alternates: localizedAlternates("/systems", locale),
    openGraph: localizedOpenGraph("/systems", locale, copy.title, copy.sub) };
}

export default async function SystemsPage() {
  const locale = await getLocale();
  const copy = DICT[locale];
  const evidence = EVIDENCE[locale];
  const commission = localizedPath("/commission", locale);
  const price = { amountHt: 3200, currency: "EUR", basis: copy.basis };
  const talk = <Link className="rev-button exec" href={commission}>{copy.cta}</Link>;
  const heading = (id: string, title: string) => <div className="r2-shead"><h2 className="r2-ed" id={id}>{title}</h2></div>;
  return <main className="rev-page r2-dark">
    <div className="r2-wrap" style={{ overflowWrap: "anywhere" }}>
      <header className="r2-hero">
        <K>{copy.kicker}</K><h1>{copy.title}</h1><p className="r2-sub">{copy.sub}</p>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 24, marginTop: 32 }}>{talk}<Link className="rev-button ghost" href="#capacites">{copy.catalogue}</Link></div>
      </header>
      <section className="r2-section" aria-labelledby="evidence-heading">
        {heading("evidence-heading", copy.evidence)}<p>{copy.intro}</p>
        {copy.facts.map(([label, body]) => <div key={label} style={{ marginTop: 28 }}><K>{label}</K><p style={{ lineHeight: 1.7, marginTop: 12 }}>{body}</p></div>)}
      </section>
      <section className="r2-section" id="operating-view" aria-labelledby="operating-heading">
        {heading("operating-heading", copy.operating)}<K>{copy.chain}</K>
        <div className="r2-phases">{evidence.steps.map((body, i) => <div className="r2-phase" key={copy.stepNames[i]} id={`step-${i + 1}`}>
          <div className="no">{String(i + 1).padStart(2, "0")}</div><h3 className="nm">{copy.stepNames[i]}</h3><div className="ds">{body}</div>
        </div>)}</div>
        <RegistrySnapshot locale={locale} asOf="2026-09-13" rows={ROWS} summary={{ cutover: 1, migrating: 8, notStarted: 12, parityFail: 4, total: 25 }} />
        <p id="acquisition-distinction" style={{ marginTop: 40, paddingTop: 32, borderTop: "1px solid var(--rule-d)", lineHeight: 1.8 }}>{evidence.acquisition}</p>
      </section>
      <section className="r2-section" id="capacites" aria-labelledby="capabilities-heading">
        {heading("capabilities-heading", copy.catalogue)}
        <div className="home-s-offers-grid" style={{ gap: 1, background: "var(--rule-d)" }}>{evidence.cards.map((card) => <SystemCard key={card.name} {...card} locale={locale} />)}</div>
      </section>
      <section className="r2-section" id="r06" aria-labelledby="case-heading">
        <K>{copy.central}</K>{heading("case-heading", copy.caseTitle)}<K>{copy.observed}</K>
        <ul style={{ paddingLeft: 24, lineHeight: 2, marginTop: 24 }}>{copy.record.map((item) => <li key={item}>{item}</li>)}</ul>
        <p style={{ lineHeight: 1.8, margin: "32px 0" }}>{evidence.story}</p>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 24, alignItems: "center" }}><Link href="#operating-view">{copy.mechanism}</Link>{talk}</div>
      </section>
      <section className="r2-section" id="method" aria-labelledby="method-heading">
        {heading("method-heading", copy.method)}<p style={{ marginBottom: 24 }}>{copy.methodBody}</p><Link href={localizedPath("/manufacture", locale)}>{copy.methodLink}</Link>
      </section>
      <section className="r2-section" id="garde-fous" aria-labelledby="guardrails-heading">
        {heading("guardrails-heading", copy.guardrails)}<ul style={{ paddingLeft: 24, lineHeight: 1.8 }}>{copy.guards.map((guard, i) => <li key={guard} style={{ marginTop: 20 }}>{i < 4 ? <Link href={["#operating-view", "#step-5", "#step-6", "#capacites"][i]}>{guard}</Link> : guard}</li>)}</ul>
      </section>
      <section className="r2-section" id="offre" aria-labelledby="offer-heading">
        {heading("offer-heading", copy.offer)}
        <OfferCard name="Build With You" audience={copy.audience} outcome={copy.outcome} deliverables={copy.deliverables} format={copy.format}
          price={price} locale={locale} cta={{ label: copy.offerCta, href: localizedPath("/build-with-you", locale) }} />
      </section>
      <section className="r2-section" id="faq" aria-labelledby="faq-heading">
        {heading("faq-heading", "FAQ")}{copy.faq.map(([question, answer]) => <div key={question} style={{ marginBottom: 32 }}><h3>{question}</h3><p style={{ lineHeight: 1.8, marginTop: 16 }}>{answer}</p></div>)}
      </section>
      <div className="r2-close">{talk}</div>
      <footer className="r2-footer"><RegistryLine value="PARRIT / SYSTEMS · 2026" /><Link href={localizedPath("/legal", locale)}>{copy.legal}</Link></footer>
    </div>
  </main>;
}
