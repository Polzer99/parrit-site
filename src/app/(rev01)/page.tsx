import { EXAM_NOTE } from "@/system/examination";
import type { Metadata } from "next";
import Link from "next/link";

import { localizedAlternates, localizedOpenGraph, localizedPath } from "@/system/locale";
import { getLocale } from "@/lib/server/locale";
import { ProductScene } from "@/system/components/ProductScene";
import { AgentEsquisse } from "@/system/components/AgentEsquisse";
import { K } from "@/system/components";
import { getAllJournalEntrySummaries } from "@/system/journal";

const DICT = {
  en: {
    hero: {
      kicker: "Parrit / Data and AI",
      before: "We turn operational problems into",
      frame: "systems that work",
      after: ".",
      sub: "Parrit.ai is a data and AI company. The invoice that drags, the report rebuilt by hand every week: we start from your data and build tools you own.",
      alternative: "Book the examination",
    },
    brands: {
      kicker: "Systems commissioned by:",
      list: "an industrial group · a law firm · a B2B energy broker · a consumer brand.",
      note: "Client names are shared in a meeting.",
    },
    journey: {
      kicker: "How it works",
      title: "Four steps take you from the first message to a system your team runs.",
      steps: [
        ["01", "Name the operation", "You describe what costs you the most time. Parrit examines with you who it touches and what it really costs."],
        ["02", "Write the scope", "What gets built, what Parrit will need from you, and how success is judged, written before work starts."],
        ["03", "Build and verify", "The system gets built, then checked the way Parrit checks its own tools first. It doesn't go live until your team has been through it."],
        ["04", "Take it over", "Code, data and documentation are yours. Your team learns to run it at handover, and can take it further alone, or call Parrit back, depending on the path you chose."],
      ],
      link: "Book the examination",
    },
    build: {
      kicker: "What we build",
      title: "You ask, you approve, the record is created.",
      phrase: "One example: an agent in the sales team's messaging app, connected to the company's CRM.",
      steps: ["You photograph the card.", "You reply “yes”.", "The contact is in the CRM."],
      label: "In your CRM",
      conversationAlt: "Conversation with the CRM agent: a photographed business card, the question “Is that right?” and the reply “yes”",
      objectAlt: "Contact record created in the CRM: company, name, role, masked mobile number",
    },
    proof: {
      kicker: "The proof",
      systems: {
        title: "We show the system. You judge before you commit.",
        fact: "We publish the real state of our own system: as of September 13, 2026, 15 of the 25 types of information we track were still held in two places.",
        cta: "See the system",
      },
      dossiers: {
        title: "Three dossiers are available online. The others are presented in a meeting.",
        cta: "See the dossiers",
      },
    },
    journal: { kicker: "What the work teaches us", title: "The Journal records what held and what broke on our own systems, and what we take from it for yours." },
    close: {
      title: "A first conversation with Parrit.ai tells you whether a system is worth building.",
      note: EXAM_NOTE.en,
      button: "Book the examination",
    },
  },
  fr: {
    hero: {
      kicker: "Parrit / Données et IA",
      before: "Nous transformons des problèmes opérationnels en",
      frame: "systèmes qui fonctionnent",
      after: ".",
      sub: "Parrit.ai est une maison de données et d'IA. La facture qui traîne, le rapport refait à la main chaque semaine : nous partons de vos données et construisons des outils qui vous appartiennent.",
      alternative: "Réserver l'examen",
    },
    brands: {
      kicker: "Ils nous ont commandé un système :",
      list: "un groupe industriel · un cabinet d'avocats · un courtier en énergie B2B · une marque grand public.",
      note: "Les noms des clients sont communiqués en rendez-vous.",
    },
    journey: {
      kicker: "Le déroulement",
      title: "Quatre étapes mènent du premier message à un système que votre équipe fait tourner.",
      steps: [
        ["01", "Nommer l'opération", "Vous décrivez ce qui vous coûte le plus de temps. Parrit examine avec vous qui elle touche et ce qu'elle coûte réellement."],
        ["02", "Écrire le périmètre", "Ce qui sera construit, ce dont Parrit aura besoin de vous, et comment on juge que c'est réussi, écrit avant que le travail commence."],
        ["03", "Construire et vérifier", "Le système se construit puis se vérifie avec la méthode que Parrit applique d'abord à ses propres outils. Il n'entre en service qu'une fois votre équipe passée dessus."],
        ["04", "Prendre la main", "Le code, les données et la documentation vous appartiennent. Votre équipe apprend à s'en servir à la livraison, et peut le faire évoluer seule, ou vous rappelez Parrit, selon la formule choisie."],
      ],
      link: "Réserver l'examen",
    },
    build: {
      kicker: "Ce que nous construisons",
      title: "Vous demandez, vous validez, la fiche est créée.",
      phrase: "Un exemple : un agent dans la messagerie de l'équipe commerciale, relié au CRM de l'entreprise.",
      steps: ["Vous photographiez la carte.", "Vous répondez « oui ».", "Le contact est dans le CRM."],
      label: "Dans votre CRM",
      conversationAlt: "Conversation avec l'agent CRM : une carte de visite photographiée, la question « C'est bon ? » et la réponse « oui »",
      objectAlt: "Fiche du contact créée dans le CRM : société, nom, poste, mobile masqué",
    },
    proof: {
      kicker: "La preuve",
      systems: {
        title: "Nous montrons le système. Vous jugez avant de vous engager.",
        fact: "Nous publions l'état réel de notre propre système : au 13 septembre 2026, 15 des 25 types d'information suivis étaient encore tenus en double.",
        cta: "Voir le système",
      },
      dossiers: {
        title: "Trois dossiers sont consultables en ligne. Les autres se présentent en rendez-vous.",
        cta: "Voir les dossiers",
      },
    },
    journal: { kicker: "Ce que les chantiers nous apprennent", title: "Le Journal consigne ce qui a tenu et ce qui a cassé sur nos propres systèmes, et ce que nous en tirons pour les vôtres." },
    close: {
      title: "Un premier échange avec Parrit.ai vous dit si un système vaut d'être construit.",
      note: EXAM_NOTE.fr,
      button: "Réserver l'examen",
    },
  },
} as const;

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getLocale();
  const title = locale === "fr"
    ? "Parrit.ai · Données et IA, des outils qui vous appartiennent"
    : "Parrit.ai · Data and AI, tools you own";
  const description = locale === "fr"
    ? "Parrit.ai est une maison française indépendante de données et d'IA : nous transformons les données d'une entreprise en outils qui lui appartiennent, construits dans ses comptes et documentés."
    : "Parrit.ai is an independent French data and AI firm. We turn a company's data into tools it owns, built in its own accounts and documented.";
  return {
    title: { absolute: title }, description,
    alternates: {
      ...localizedAlternates("/", locale),
      types: { "application/rss+xml": [{ url: "/journal/rss.xml", title: "Parrit Journal" }] },
    },
    openGraph: localizedOpenGraph("/", locale, title, description),
  };
}

export default async function HomePage() {
  const locale = await getLocale();
  const copy = DICT[locale];
  const entries = getAllJournalEntrySummaries().slice(0, 3);

  return (
    <main className="rev-page home-s">
      <section className="home-s-hero r2-dark">
        <div className="home-s-wrap">
          <K>{copy.hero.kicker}</K>
          <h1>
            <span>{copy.hero.before} </span>
            <span className="home-s-hero-ending">
              <span className="frame">{`${copy.hero.frame}${copy.hero.after}`}<i className="fx" aria-hidden="true" /></span>
            </span>
          </h1>
          <p className="home-s-hero-sub">{copy.hero.sub}</p>
          <AgentEsquisse locale={locale} />
          <p className="home-s-alternative"><Link className="rev-button ghost" href={localizedPath("/commission", locale)}>{copy.hero.alternative}</Link></p>
        </div>
      </section>

      <section className="home-s-brands">
        <div className="home-s-wrap">
          <K>{copy.brands.kicker}</K>
          <p className="home-s-brands-list">{copy.brands.list.split(" · ").map((item) => <span key={item}>{item}</span>)}</p>
          <p>{copy.brands.note}</p>
        </div>
      </section>

      <section className="home-s-maison">
        <div className="home-s-wrap home-s-maison-grid">
          <div className="home-s-maison-copy">
            <K>{copy.journey.kicker}</K>
            <h2>{copy.journey.title}</h2>

            <ol className="home-s-journey-steps">
              {copy.journey.steps.map(([number, title, body]) => (
                <li key={number}><K>{number}</K><h3>{title}</h3><p>{body}</p></li>
              ))}
            </ol>
            <Link className="rev-button ghost home-s-journey-action" href={localizedPath("/commission", locale)}>{copy.journey.link}</Link>
          </div>
        </div>
      </section>

      <section className="home-s-build r2-dark">
        <div className="home-s-wrap">
          <K>{copy.build.kicker}</K>
          <ProductScene
            title={copy.build.title}
            phrase={copy.build.phrase}
            steps={copy.build.steps}
            label={copy.build.label}
            object={{
              src: "/brand/scenes/scene-carte-visite-fiche-crm",
              width: 860, height: 564, widths: [430, 860],
              sizes: "(max-width: 859px) calc(100vw - 40px), (max-width: 1024px) calc(100vw - 80px), 420px",
              alt: copy.build.objectAlt,
            }}
            markers={[
              { number: 3, image: "object", left: 93, top: 9 },
            ]}
          />
        </div>
      </section>

      <section className="home-s-proof" aria-label={copy.proof.kicker}>
        <div className="home-s-wrap">
          <K>{copy.proof.kicker}</K>
          <div className="home-s-proof-grid">
            <Link className="home-s-proof-item home-s-proof-item--systems" href={localizedPath("/systems", locale)}>
              <h3>{copy.proof.systems.title}</h3>
              <p>{copy.proof.systems.fact}</p>
              <span>{copy.proof.systems.cta}</span>
            </Link>
            <Link className="home-s-proof-item home-s-proof-item--dossiers" href={localizedPath("/dossiers", locale)}>
              <h3>{copy.proof.dossiers.title}</h3>

              <span>{copy.proof.dossiers.cta}</span>
            </Link>
          </div>
        </div>
      </section>

      <section className="home-s-journal">
        <div className="home-s-wrap">
          <K>{copy.journal.kicker}</K>
          <h2>{copy.journal.title}</h2>
          {locale === "fr" && <p className="doctrine-note">Articles en anglais.</p>}
          <ol>
            {entries.map((entry) => <li key={entry.slug}><Link href={`/journal/${entry.slug}`} hrefLang="en"><span lang="en">{entry.title}</span>{locale === "fr" && <K>EN</K>}<time dateTime={entry.date}>{entry.date}</time></Link></li>)}
          </ol>
        </div>
      </section>

      <section className="home-s-close r2-dark">
        <div className="home-s-wrap">
          <h2>{copy.close.title}</h2>
          <p className="doctrine-note home-s-close-note">{copy.close.note}</p>
          <Link className="rev-button exec" href={localizedPath("/commission", locale)}>{copy.close.button}</Link>
        </div>
      </section>

    </main>
  );
}
