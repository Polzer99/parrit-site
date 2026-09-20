import type { Metadata } from "next";
import Link from "next/link";
import { getLocale } from "@/lib/server/locale";
import { K, RegistryLine } from "@/system/components";
import { OfferCard } from "@/system/components/OfferCard";
import { SystemCard } from "@/system/components/SystemCard";
import { RegistrySnapshot } from "@/system/components/RegistrySnapshot";
import { localizedAlternates, localizedOpenGraph, localizedPath } from "@/system/locale";

// Approved editorial copy: docs/CODEX-SPEC-2026-09-20-systems-editorial-rewrite.md.
const EVIDENCE = {
  "fr": {
    "cards": [
      {
        "domain": "Vos informations, une seule version qui compte",
        "name": "La liste qui fait foi",
        "input": "une information créée ou modifiée n'importe où dans l'entreprise (un contact, un rendez-vous, un dossier)",
        "process": "vérifie si l'outil utilisé est bien celui qui doit faire foi, et repère si un autre outil, plus ancien, contient encore une version différente",
        "output": "une situation claire pour chaque type d'information, et un signal si deux versions se contredisent",
        "limits": "Au 13 septembre 2026, un seul type d'information sur 25 avait une source unique stabilisée. Les autres étaient en cours de transfert, pas encore commencés, ou avaient deux versions actives en parallèle.",
        "proofLabel": "Le système que nous utilisons nous-mêmes, tous les jours."
      },
      {
        "domain": "Comment nous vérifions notre propre travail",
        "name": "Deux regards avant chaque changement",
        "input": "une idée de changement, écrite noir sur blanc avant de commencer",
        "process": "la modification est préparée dans un espace de travail séparé, une autre personne que l'auteur la relit entièrement, puis nous relançons l'ensemble de nos tests",
        "output": "une modification acceptée ou refusée, jamais mise en ligne sans être passée par ces deux vérifications",
        "limits": "C'est notre propre façon de travailler, appliquée à notre propre système avant de l'être au vôtre.",
        "proofLabel": "Vous pouvez le vérifier à chaque mise à jour du site."
      },
      {
        "domain": "Qualité avant publication",
        "name": "Une vérification automatique qui peut bloquer une page",
        "input": "une page prête à être publiée sur le site",
        "process": "une vérification automatique relit le texte, les couleurs et l'affichage sur téléphone",
        "output": "la mise en ligne est bloquée si quelque chose ne va pas, sans attendre qu'un humain le remarque",
        "limits": "Si elle bloque à tort, on corrige le texte concerné. On ne désactive jamais la vérification elle-même.",
        "proofLabel": "Vérifiable à chaque mise à jour du site."
      },
      {
        "domain": "Prendre une décision depuis un téléphone",
        "name": "Un prototype pour décider depuis son téléphone",
        "input": "un dossier ou une tâche en attente d'une décision",
        "process": "l'information est présentée simplement, et une personne décide directement depuis son téléphone",
        "output": "la décision est enregistrée, avec le nom de la personne qui l'a prise",
        "limits": "C'est encore un usage interne : aucun client ne l'utilise aujourd'hui, et nous n'avons pas encore mesuré la fréquence d'utilisation de ce prototype.",
        "proofLabel": "Un prototype interne, pas un produit livré à un client."
      }
    ],
    "narrative": "Prenons un exemple réel. Un commercial enregistre un nouveau contact dans son outil habituel. Le système vérifie aussitôt si cet outil est bien celui qui doit faire foi pour les contacts, ou si un outil plus ancien s'en occupe encore en parallèle. Si les deux outils sont encore utilisés, rien n'est corrigé tout seul : la situation est simplement signalée. C'est le fondateur qui décide, un outil à la fois, du jour où l'ancien est mis de côté. Une fois la décision prise, elle est appliquée directement dans le système, et notée noir sur blanc : qui a décidé, et quand. Voilà pourquoi, au 13 septembre 2026, 4 des 25 types d'information suivis avaient encore deux outils actifs en parallèle, comme dans cet exemple, et un seul était réglé sur les 25. Nous ne le cachons pas.",
    "acquisition": "Ce même travail de vérification s'applique aussi à notre prospection commerciale. Notre outil fonctionne : il repère, dans des informations publiques, des indices qu'une entreprise pourrait avoir besoin de nous. Mais nous ne l'avons pas encore branché sur notre système principal. Cet outil n'a encore débouché sur aucun rendez-vous. Et aucune vente ne lui est due : nos clients viennent de personnes que nous connaissons déjà.",
    "story": "Toutes nos informations importantes (les contacts, les rendez-vous, les appels, les dossiers en cours) doivent avoir une seule source qui fait foi. Ce travail n'est pas terminé partout. Nous montrons où il en est vraiment."
  },
  "en": {
    "cards": [
      {
        "domain": "Your information, one version that counts",
        "name": "The list that's trusted",
        "input": "a piece of information created or changed anywhere in the company (a contact, a meeting, a file)",
        "process": "checks whether the tool used is the one meant to hold it, and flags whether an older tool still holds a different version",
        "output": "a clear status for each type of information, and a flag if two versions disagree",
        "limits": "As of September 13, 2026, only 1 of 25 types of information had a single stable source. The rest were being transferred, not started, or had two active versions in parallel.",
        "proofLabel": "The system we use ourselves, every day."
      },
      {
        "domain": "How we check our own work",
        "name": "Two sets of eyes on every change",
        "input": "an idea for a change, written down before we start",
        "process": "the change is prepared in a separate workspace, someone other than the author reads it in full, then we rerun our whole test suite",
        "output": "a change accepted or refused, never put live without passing both checks",
        "limits": "This is our own way of working, applied to our own system before it's applied to yours.",
        "proofLabel": "You can verify it on every update to this site."
      },
      {
        "domain": "Quality before publishing",
        "name": "An automatic check that can block a page",
        "input": "a page ready to be published",
        "process": "an automatic check reads the text, the colours, and the mobile layout",
        "output": "publishing is blocked if something is wrong, without waiting for a person to notice",
        "limits": "If it blocks something wrongly, we fix the text. We never turn the check off.",
        "proofLabel": "Verifiable on every update to this site."
      },
      {
        "domain": "Deciding from a phone",
        "name": "A prototype for deciding from your phone",
        "input": "a file or task waiting on a decision",
        "process": "the information is shown simply, and a person decides directly from their phone",
        "output": "the decision is logged, with the name of the person who made it",
        "limits": "Still internal use only: no client uses it today, and we haven't yet measured how often it's used.",
        "proofLabel": "An internal prototype, not a product delivered to a client."
      }
    ],
    "narrative": "Take a real example. A salesperson enters a new contact in the tool they normally use. The system immediately checks whether that tool is the one meant to hold contacts, or whether an older tool is still handling them too. If both tools are still in use, nothing gets fixed on its own: the situation is simply flagged. It's the founder who decides, one tool at a time, when the old one is retired. Once that decision is made, it's applied directly in the system, and written down in plain terms: who decided, and when. That is why, as of September 13, 2026, 4 of the 25 types of information we track still had two active tools in parallel, as in this example, and only 1 out of 25 was settled. We do not hide it.",
    "acquisition": "The same check applies to our own outreach. Our tool works: it looks for public signs that a company might need us. But we haven't connected it to our main system yet. That tool hasn't led to a single meeting so far. And no sale is owed to it: our clients come from people we already know.",
    "story": "Every piece of information Parrit depends on (a contact, a deadline, a call, an open deal) needs one trusted source. That work isn't finished everywhere. We show where it actually stands."
  }
} as const;

const DICT = {
  en: {
    kicker: "Parrit / Systems", title: "We show the system. You judge before you commit.",
    sub: "Here is the system that runs our own files and our own decisions, shown as it works today, including what doesn't work yet.",
    cta: "Let's talk", catalogue: "Demonstrated capabilities.", evidence: "Shown, not claimed.",
    intro: "Here are three things we hold ourselves to before we offer them to you.",
    facts: [
      ["The list that's trusted", "In a lot of companies, several files each claim to be the real customer list, and nobody knows which one to believe. Here, for each type of information (contacts, meetings, calls, open files), one source is trusted, and the old file only gets retired once we've checked the new one holds everything. As of September 13, 2026, that work wasn't finished everywhere: of 25 types of information we track, only 1 was settled, and 4 had two versions directly contradicting each other."],
      ["Two sets of eyes on every change", "Before a change touches one of our systems, someone other than the person who wrote it reads it in full, in a separate workspace. Then we rerun our whole test suite. A change that hasn't passed both steps never goes live."],
      ["A check that can block a page", "Before a page on this site goes live, an automatic check reads the text and the layout. It blocks if a number looks unverifiable, if a colour breaks our guidelines, or if the text overflows on a phone. If it blocks something wrongly, we fix the text. We never turn the check off."],
    ],
    summaryText: "25 types of information tracked in total. For 1, the transfer is complete. For 8, it's underway. For 4, the two versions don't match. For 12, it hasn't started.",
    operating: "How we catch a mismatch, and what happens next.",
    central: "Parrit / Central case", caseTitle: "The first client of this system is us.",
    observed: "Internal use · observed 2026-09-13",
    record: ["25 types of information tracked across the company", "1 settled, 8 being transferred, 4 with two different versions, 12 not started", "Every automatic correction has been checked and logged by a person."],
    mechanism: "Back to the detailed explanation, above", method: "Method",
    methodBody: "Every system above is built the same way: Examination, Construction, Compounding.", methodLink: "Read the Manufacture",
    guardrails: "Guardrails.",
    guards: ["For each type of information, a single tool is trusted. It's never chosen by default or by habit.", "Every system change and every automatic correction must be validated by a person.", "Every decision is logged: who decided, and when. Nothing happens silently.", "Before a change touches the site or our tools, someone other than its author reads it, and it can always be rolled back.", "The choice of AI model depends on the need and the cost, never on a single imposed provider."],
    offer: "Where to start.", audience: "For leaders who want something that runs, not an audit or a deck.",
    outcome: "A working system, built with the founder.",
    deliverables: ["Free 30-minute audit", "30-minute findings review", "10 hours of building with Paul"],
    format: "10 hours, with the founder", basis: "fixed fee", offerCta: "See Build With You",
    faq: [
      ["Is this training or a delivered system?", "A system. You learn to use it along the way, but what we deliver is something that runs, not a course."],
      ["Where does our data go?", "Into your own accounts, with your own access. We don't keep a copy elsewhere."],
      ["Who maintains the system afterward?", "You, or us on a quote: the choice is made after the Examination, never before."],
      ["Where do we start?", "A 15-minute Examination, no commitment."],
    ], legal: "Legal",
  },
  fr: {
    kicker: "Parrit / Systèmes", title: "Nous montrons le système. Vous jugez avant de vous engager.",
    sub: "Voici le système qui organise nos dossiers et nos décisions, tel qu'il fonctionne aujourd'hui, avec ce qui ne marche pas encore.",
    cta: "Parlons-en", catalogue: "Capacités démontrées.", evidence: "Montré, pas revendiqué.",
    intro: "Voici trois méthodes que nous utilisons dans notre propre travail avant de vous les proposer.",
    facts: [
      ["La liste qui fait foi", "Dans beaucoup d'entreprises, plusieurs fichiers prétendent chacun être la bonne liste de clients, et personne ne sait lequel croire. Chez nous, pour chaque type d'information (les contacts, les rendez-vous, les appels, les dossiers en cours), une seule source fait foi, et l'ancien fichier n'est mis de côté que le jour où l'on a vérifié que le nouveau contient tout. Au 13 septembre 2026, ce travail n'était pas fini partout : sur 25 types d'information suivis, un seul était réglé, et 4 avaient deux versions qui se contredisaient directement."],
      ["Deux regards avant chaque changement", "Avant qu'un changement touche un de nos systèmes, une autre personne que l'auteur le relit entièrement, dans un espace de travail séparé. Puis nous relançons l'ensemble de nos tests. Un changement qui n'a pas passé ces deux étapes n'est jamais mis en ligne."],
      ["Une vérification qui peut bloquer une page", "Avant qu'une page de ce site soit mise en ligne, une vérification automatique relit le texte et la mise en page. Elle bloque si un chiffre semble invérifiable, si une couleur sort de notre charte, ou si le texte déborde sur un téléphone. Si elle bloque à tort, on corrige le texte concerné. On ne désactive jamais la vérification elle-même."],
    ],
    summaryText: "25 types d'information suivis au total. Pour 1, le transfert est terminé. Pour 8, il est en cours. Pour 4, les deux versions ne concordent pas. Pour 12, il n'a pas encore commencé.",
    operating: "Comment nous repérons un écart, et ce qu'il se passe ensuite.",
    central: "Parrit / Cas central", caseTitle: "Le premier client de ce système, c'est nous.",
    observed: "Usage interne · vérifié le 13 septembre 2026",
    record: ["25 types d'information suivis dans l'entreprise", "1 réglé, 8 en cours de transfert, 4 avec deux versions différentes, 12 pas encore commencés", "Toute correction a été validée et notée par une personne."],
    mechanism: "Revenir à l'explication détaillée, plus haut", method: "Méthode",
    methodBody: "Chaque système ci-dessus se construit de la même façon : Examen, Construction, Capitalisation.", methodLink: "Lire la Manufacture",
    guardrails: "Garde-fous.",
    guards: ["Pour chaque type d'information, un seul outil fait foi. Il n'est jamais choisi par hasard ni par habitude.", "Tout changement de système et toute correction automatique doivent être validés par une personne.", "Chaque décision est notée : qui a décidé, et quand. Rien ne se passe sans laisser de trace.", "Avant qu'un changement touche le site ou nos outils, quelqu'un d'autre que son auteur le relit, et on peut toujours revenir en arrière.", "Le choix d'un outil d'intelligence artificielle dépend du besoin et du coût, jamais d'un seul fournisseur imposé."],
    offer: "Par où commencer.", audience: "Pour le dirigeant qui veut repartir avec quelque chose qui tourne, pas un audit ni un deck.",
    outcome: "Un système qui tourne, construit avec le fondateur.",
    deliverables: ["Audit de 30 min offert", "Restitution de 30 min", "10 heures de construction avec Paul"],
    format: "10 heures, avec le fondateur", basis: "forfait", offerCta: "Découvrir Build With You",
    faq: [
      ["Formation ou système livré ?", "Un système. Vous apprenez à vous en servir en cours de route, mais ce que nous livrons, c'est quelque chose qui fonctionne, pas un cours."],
      ["Où vont nos données ?", "Dans vos comptes, avec vos propres accès. Nous n'en gardons pas de copie ailleurs."],
      ["Qui maintient le système ensuite ?", "Vous, ou nous sur devis : le choix se fait après l'Examen, jamais avant."],
      ["Par où commence-t-on ?", "Un Examen de 15 minutes, sans engagement."],
    ], legal: "Mentions légales",
  },
} as const;

const ROWS = {
  "fr": [
    {
      "domain": "Identification des contacts",
      "source": "Notre application interne",
      "status": "Deux versions qui ne concordent pas",
      "legacyWriters": 11
    },
    {
      "domain": "Liste des personnes à ne pas recontacter",
      "source": "Notre application interne",
      "status": "En cours de transfert",
      "legacyWriters": 1
    },
    {
      "domain": "Prospection commerciale",
      "source": "Outil externe (Instantly)",
      "status": "Le transfert n'a pas commencé",
      "legacyWriters": 0
    },
    {
      "domain": "Échéances commerciales",
      "source": "Notre application interne",
      "status": "Deux versions qui ne concordent pas",
      "legacyWriters": 1
    },
    {
      "domain": "Affaires commerciales en cours",
      "source": "Notre application interne",
      "status": "Deux versions qui ne concordent pas",
      "legacyWriters": 2
    },
    {
      "domain": "Comptes rendus d'appels",
      "source": "Notre application interne",
      "status": "En cours de transfert",
      "legacyWriters": 6
    },
    {
      "domain": "Historique des actions internes",
      "source": "Notre application interne",
      "status": "En cours de transfert",
      "legacyWriters": 6
    }
  ],
  "en": [
    {
      "domain": "Contact identification",
      "source": "Our internal application",
      "status": "Two versions that don't match",
      "legacyWriters": 11
    },
    {
      "domain": "Do-not-contact list",
      "source": "Our internal application",
      "status": "Being transferred",
      "legacyWriters": 1
    },
    {
      "domain": "Outreach",
      "source": "External tool (Instantly)",
      "status": "Transfer not started",
      "legacyWriters": 0
    },
    {
      "domain": "Sales deadlines",
      "source": "Our internal application",
      "status": "Two versions that don't match",
      "legacyWriters": 1
    },
    {
      "domain": "Open deals",
      "source": "Our internal application",
      "status": "Two versions that don't match",
      "legacyWriters": 2
    },
    {
      "domain": "Call transcripts",
      "source": "Our internal application",
      "status": "Being transferred",
      "legacyWriters": 6
    },
    {
      "domain": "Internal activity log",
      "source": "Our internal application",
      "status": "Being transferred",
      "legacyWriters": 6
    }
  ]
} as const;

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
        {heading("operating-heading", copy.operating)}
        <p style={{ lineHeight: 1.8 }}>{evidence.narrative}</p>
        <RegistrySnapshot locale={locale} asOf="2026-09-13" rows={ROWS[locale]} summaryText={copy.summaryText} />
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
        {heading("guardrails-heading", copy.guardrails)}<ul style={{ paddingLeft: 24, lineHeight: 1.8 }}>{copy.guards.map((guard, i) => <li key={guard} style={{ marginTop: 20 }}>{i < 4 ? <Link href={["#operating-view", "#operating-view", "#operating-view", "#capacites"][i]}>{guard}</Link> : guard}</li>)}</ul>
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
