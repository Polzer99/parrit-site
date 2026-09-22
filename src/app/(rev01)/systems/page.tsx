import type { Metadata } from "next";
import Link from "next/link";
import { getLocale } from "@/lib/server/locale";
import { K, RegistryLine } from "@/system/components";
import { OfferCard } from "@/system/components/OfferCard";
import { SystemCard } from "@/system/components/SystemCard";
import { MechanismSchema } from "@/system/components/MechanismSchema";
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
        "limits": "Au 13 septembre 2026, 15 types d'information sur 25 avaient encore deux sources en présence, et pour 4, une vérification directe avait trouvé un désaccord entre elles. Aucune ancienne source n'est retirée tant qu'elle n'a pas été vérifiée comme redondante.",
        "proofLabel": "Le système que nous utilisons nous-mêmes, tous les jours."
      },
      {
        "domain": "Comment nous vérifions notre propre travail",
        "name": "Deux systèmes, une décision humaine",
        "input": "une idée de changement, écrite noir sur blanc avant de commencer",
        "process": "la modification est préparée dans un espace de travail séparé, un second système, distinct de celui qui l'a écrite, la relit en entier, puis nous relançons l'ensemble de nos tests",
        "output": "une modification acceptée ou refusée ; la mise en ligne reste une décision humaine, jamais automatique",
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
    "narrative": "Prenons l'exemple le plus net : l'identification de nos contacts. Onze anciens outils y écrivent encore aujourd'hui, certains automatiquement, comme une synchronisation qui tourne toutes les 15 minutes. Une comparaison directe des deux sources, menée le 11 septembre 2026, a trouvé 114 fiches présentes uniquement dans l'ancien système. Rien n'est corrigé tout seul : la situation est signalée, et un contrôle automatique interdit désormais d'ajouter un nouveau point d'écriture vers l'ancien système sans le déclarer ici. C'est le fondateur qui décide, un type d'information à la fois, du jour où une ancienne source est mise de côté. Cette décision a déjà été prise et datée pour plusieurs d'entre elles. Voilà pourquoi, au 13 septembre 2026, 15 des 25 types d'information suivis avaient encore deux sources en présence, dont 4 où une vérification directe avait trouvé un désaccord, comme dans cet exemple. Nous ne le cachons pas.",
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
        "limits": "As of September 13, 2026, 15 of the 25 types of information still had two sources in place, and for 4, a direct check had found a disagreement between them. No old source is retired until it's been confirmed redundant.",
        "proofLabel": "The system we use ourselves, every day."
      },
      {
        "domain": "How we check our own work",
        "name": "Two systems, one human decision",
        "input": "an idea for a change, written down before we start",
        "process": "the change is built in a separate workspace, a second system, distinct from the one that wrote it, reviews it in full, then we rerun our whole test suite",
        "output": "a change accepted or refused; going live stays a human decision, never automatic",
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
    "narrative": "Take the clearest example: contact identification. Eleven legacy tools still write to it today, some automatically, including a sync job that runs every 15 minutes. A direct comparison of both sources, run on September 11, 2026, found 114 records that existed only in the old system. Nothing gets fixed on its own: the mismatch is flagged, and an automatic gate now blocks any new write path into the old system unless it's declared here first. It's the founder who decides, one type of information at a time, when an old source gets retired. That decision has already been made and dated for several of them. That is why, as of September 13, 2026, 15 of the 25 types of information we track still had two sources in place, 4 of which had a directly measured disagreement, as in this example. We do not hide it.",
    "acquisition": "The same check applies to our own outreach. Our tool works: it looks for public signs that a company might need us. But we haven't connected it to our main system yet. That tool hasn't led to a single meeting so far. And no sale is owed to it: our clients come from people we already know.",
    "story": "Every piece of information Parrit depends on (a contact, a deadline, a call, an open deal) needs one trusted source. That work isn't finished everywhere. We show where it actually stands."
  }
} as const;

const HERO_PROOF_LIMIT = {
  fr: "Au 13 septembre 2026, 15 types d'information sur 25 avaient encore deux sources en présence.",
  en: "As of September 13, 2026, 15 of the 25 types of information still had two sources in place.",
} as const;

const DICT = {
  en: {
    kicker: "Parrit / Systems", title: "We show the system. You judge before you commit.",
    sub: "Here is the system that runs our own files and our own decisions, shown as it works today, including what doesn't work yet.",
    cta: "Let's talk", catalogue: "Demonstrated capabilities.", evidence: "Shown, not claimed.",
    intro: "Before you trust a system with your operation, three questions matter: is it reliable, who's in control when it changes, what happens when it goes live. We answer them for ourselves first.",
    facts: [
      ["The list that's trusted", "In a lot of companies, several files each claim to be the real customer list, and nobody knows which one to believe. Here, for each type of information (contacts, meetings, calls, open files), one source is meant to be trusted, and the old one only gets retired once we've checked the new one holds everything. As of September 13, 2026, that work wasn't finished everywhere: of the 25 types of information we track, 15 still had two sources in place, and for 4 of them, a direct check had already found a disagreement between them."],
      ["Two checks before every change", "Whoever writes a change is never the one who approves it. A change is first built in a separate workspace, then a second system, distinct from the one that wrote it, reviews it in full. We then rerun our whole test suite. A single person decides alone whether it goes live. A change that hasn't passed these steps is never published."],
      ["A check that can block a page", "Before a page on this site goes live, an automatic check reads the text and the layout. It blocks if a number looks unverifiable, if a colour breaks our guidelines, or if the text overflows on a phone. If it blocks something wrongly, we fix the text. We never turn the check off."],
    ],
    summaryText: "25 types of information tracked in total. For 1, the transfer is complete. For 8, it's underway. For 4, a check found a disagreement between the two versions. For 12, the transfer hasn't started. The legacy-tool count includes points already paused or failing, kept on record until formally closed.",
    operating: "How we catch a mismatch, and what happens next.",
    central: "Parrit / Central case", caseTitle: "The first client of this system is us.",
    observed: "Internal use · observed 2026-09-13",
    record: ["25 types of information tracked across the company", "1 settled, 8 being transferred, 4 with two different versions, 12 not started", "Every automatic correction has been checked and logged by a person."],
    mechanism: "Back to the detailed explanation, above", method: "Method",
    methodBody: "Every system above is built the same way: Examination, Construction, Compounding.", methodLink: "Read the Manufacture",
    guardrails: "Guardrails.",
    guards: ["For each type of information, a single tool is trusted. It's never chosen by default or by habit.", "A new write path into a legacy tool can't be added without being declared here first.", "Every decision is logged: who decided, and when. Nothing happens silently.", "Before a change touches the site or our tools, a second system, distinct from the one that wrote it, reviews it, and a person decides alone whether to ship it. It can always be rolled back.", "The choice of AI model depends on the need and the cost, never on a single imposed provider."],
    offer: "Where to start.", audience: "For leaders who want something that runs, not an audit or a deck.",
    outcome: "A working system, built with the founder.",
    deliverables: [
      "Free 15-minute examination",
      "30-minute findings review",
      "10 hours of building with the founder",
    ],
    format: "10 hours, with the founder", basis: "fixed fee", offerCta: "See Build With You",
    faq: [
      ["Is this training or a delivered system?", "A system. You learn to use it along the way, but what we deliver is something that runs, not a course."],
      ["Where does our data go?", "Into your own accounts. We don't build a second database of it. If you choose ongoing support, we keep the technical access that takes, nothing more."],
      ["Who maintains the system afterward?", "You, or us on a quote: the choice is made after the Examination, never before."],
      ["Where do we start?", "A 15-minute Examination, no commitment."],
    ], legal: "Legal",
  },
  fr: {
    kicker: "Parrit / Systèmes", title: "Nous montrons le système. Vous jugez avant de vous engager.",
    sub: "Voici le système qui organise nos dossiers et nos décisions, tel qu'il fonctionne aujourd'hui, avec ce qui ne marche pas encore.",
    cta: "Parlons-en", catalogue: "Capacités démontrées.", evidence: "Montré, pas revendiqué.",
    intro: "Avant de confier une opération à un système, trois questions comptent : est-il fiable, qui contrôle un changement, que se passe-t-il à la mise en service. Nous y répondons d'abord pour nous-mêmes.",
    facts: [
      ["La liste qui fait foi", "Dans beaucoup d'entreprises, plusieurs fichiers prétendent chacun être la bonne liste de clients, et personne ne sait lequel croire. Chez nous, pour chaque type d'information (les contacts, les rendez-vous, les appels, les dossiers en cours), une seule source doit faire foi, et l'ancienne n'est mise de côté que le jour où l'on a vérifié que la nouvelle contient tout. Au 13 septembre 2026, ce travail n'était pas fini partout : sur 25 types d'information suivis, 15 avaient encore deux sources en présence, et pour 4 d'entre eux, une vérification directe avait déjà trouvé un désaccord entre elles."],
      ["Deux vérifications avant chaque changement", "Celui qui écrit une modification n'est jamais celui qui la valide. Une modification est d'abord préparée dans un espace de travail séparé, puis un second système, distinct de celui qui l'a écrite, la relit en entier. Nos tests sont ensuite rejoués intégralement. Une personne décide seule de la mise en ligne finale. Une modification qui n'a pas passé ces étapes n'est jamais publiée."],
      ["Une vérification qui peut bloquer une page", "Avant qu'une page de ce site soit mise en ligne, une vérification automatique relit le texte et la mise en page. Elle bloque si un chiffre semble invérifiable, si une couleur sort de notre charte, ou si le texte déborde sur un téléphone. Si elle bloque à tort, on corrige le texte concerné. On ne désactive jamais la vérification elle-même."],
    ],
    summaryText: "25 types d'information suivis au total. Pour 1, le transfert est terminé. Pour 8, il est en cours. Pour 4, une vérification a trouvé un désaccord entre les deux versions. Pour 12, le transfert n'a pas encore commencé. Le compte des anciens outils inclut des points déjà mis en pause ou en échec, gardés au registre jusqu'à fermeture actée.",
    operating: "Comment nous repérons un écart, et ce qu'il se passe ensuite.",
    central: "Parrit / Cas central", caseTitle: "Le premier client de ce système, c'est nous.",
    observed: "Usage interne · vérifié le 13 septembre 2026",
    record: ["25 types d'information suivis dans l'entreprise", "1 réglé, 8 en cours de transfert, 4 avec deux versions différentes, 12 pas encore commencés", "Toute correction a été validée et notée par une personne."],
    mechanism: "Revenir à l'explication détaillée, plus haut", method: "Méthode",
    methodBody: "Chaque système ci-dessus se construit de la même façon : Examen, Construction, Capitalisation.", methodLink: "Lire la Manufacture",
    guardrails: "Garde-fous.",
    guards: ["Pour chaque type d'information, un seul outil fait foi. Il n'est jamais choisi par hasard ni par habitude.", "Un nouveau point d'écriture vers un ancien outil ne peut pas s'ajouter sans être déclaré ici.", "Chaque décision est notée : qui a décidé, et quand. Rien ne se passe sans laisser de trace.", "Avant qu'un changement touche le site ou nos outils, un second système, distinct de celui qui l'a écrit, le relit, et une personne décide seule de le mettre en ligne. On peut toujours revenir en arrière.", "Le choix d'un outil d'intelligence artificielle dépend du besoin et du coût, jamais d'un seul fournisseur imposé."],
    offer: "Par où commencer.", audience: "Pour le dirigeant qui veut repartir avec quelque chose qui tourne, pas un audit ni un deck.",
    outcome: "Un système qui tourne, construit avec le fondateur.",
    deliverables: [
      "Examen offert de 15 min",
      "Restitution de 30 min",
      "10 heures de construction avec le fondateur",
    ],
    format: "10 heures, avec le fondateur", basis: "forfait", offerCta: "Découvrir Build With You",
    faq: [
      ["Formation ou système livré ?", "Un système. Vous apprenez à vous en servir en cours de route, mais ce que nous livrons, c'est quelque chose qui fonctionne, pas un cours."],
      ["Où vont nos données ?", "Dans vos comptes. Nous n'en construisons pas une seconde base ailleurs. Si vous choisissez un suivi continu, nous gardons l'accès technique que ça demande, rien de plus."],
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
      <header className="r2-hero systems-hero">
        <K>{copy.kicker}</K><h1>{copy.title}</h1><p className="r2-sub">{copy.sub}</p>
        <div className="systems-hero-proof">
          <article className="systems-hero-proof-card">
            <K>{copy.observed}</K>
            <h3>{evidence.cards[0].name}</h3>
            <p>{evidence.cards[0].output} {HERO_PROOF_LIMIT[locale]}</p>
            <K>{evidence.cards[0].proofLabel}</K>
          </article>
        </div>
        <div className="systems-hero-actions">{talk}<Link className="rev-button ghost" href="#capacites">{copy.catalogue}</Link></div>
      </header>
      <section className="r2-section" aria-labelledby="evidence-heading">
        {heading("evidence-heading", copy.evidence)}<p>{copy.intro}</p>
        {copy.facts.map(([label, body]) => <div key={label} style={{ marginTop: 28 }}><K>{label}</K><p style={{ lineHeight: 1.7, marginTop: 12 }}>{body}</p></div>)}
      </section>
      <section className="r2-section" id="operating-view" aria-labelledby="operating-heading">
        {heading("operating-heading", copy.operating)}
        <p style={{ lineHeight: 1.8 }}>{evidence.narrative}</p>
        <MechanismSchema locale={locale} />
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
