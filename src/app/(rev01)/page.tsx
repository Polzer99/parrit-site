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
      kicker: "Parrit / Intelligent systems for operations",
      before: "We turn operational problems into",
      frame: "systems that work",
      after: ".",
      sub: "Parrit.ai designs, builds and runs intelligent systems that change how companies operate. The invoice that drags, the report rebuilt by hand every week: we start from how your team works today, then build tools you own.",
      alternative: "Book the examination",
    },
    brands: {
      kicker: "They trusted us with a problem:",
      list: [
        { name: "Laparra", description: "fruit and vegetable wholesaler at the Rungis market: the CRM its sales team works in" },
        { name: "Clevery Avocats", description: "an agent for the firm's inbox and legal monitoring" },
        { name: "Forexpert", description: "a prospecting agent connected to its inbox" },
        { name: "Joone", description: "baby care brand: AI coaching for its teams" },
        { name: "SNCF", description: "an AI training program, with Arkel" },
      ],
      note: "Other clients prefer to stay anonymous.",
    },
    parcours: {
      kicker: "Who we work with",
      title: "We work with SMEs, mid-sized companies and large groups.",
      columns: [
        ["SMEs and mid-sized companies", "You bring us one precise problem. We scope it with you, we build, then your team takes the tool over."],
        ["Large companies", "Your business unit or transformation office owns the project. We set the frame with them and your technical teams, then we build."],
      ],
      note: "Either way, we do consulting and software. Training for your teams goes through FormIA, our training organization.",
    },
    capacites: {
      kicker: "What we can do",
      title: "Six capabilities, combined according to the problem at hand.",
      items: [
        ["AI Transformation", "Choosing use cases from your operations, then costing and sequencing them."],
        ["Autonomous Agents", "Agents that act within written limits. Whatever commits the company goes through human approval."],
        ["Custom Software & Internal Systems", "Tools built around the real process, inside your own accounts."],
        ["Private & Sovereign AI", "Models and data hosted where you decide."],
        ["AI Go-to-Market Infrastructure", "Commercial data, its quality and follow-ups, under human supervision."],
        ["Content Factories", "Producing, checking and publishing, with controls before every release."],
      ],
      note: "Before automating, we study the work as it is done today. We keep apart what improves the existing process and what becomes possible for the first time.",
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
      buildWithYou: "Build a first system with us",
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
      kicker: "Parrit / Systèmes intelligents pour les opérations",
      before: "Nous transformons des problèmes opérationnels en",
      frame: "systèmes qui fonctionnent",
      after: ".",
      sub: "Parrit.ai conçoit, construit et met en production des systèmes intelligents qui transforment les opérations des entreprises. La facture qui traîne, le rapport refait à la main chaque semaine : nous partons de la façon dont votre équipe travaille aujourd'hui, puis nous construisons des outils qui vous appartiennent.",
      alternative: "Réserver l'examen",
    },
    brands: {
      kicker: "Ils nous ont confié un sujet :",
      list: [
        { name: "Laparra", description: "grossiste en fruits et légumes au MIN de Rungis : le CRM de ses commerciaux" },
        { name: "Clevery Avocats", description: "un agent pour la messagerie et la veille juridique du cabinet" },
        { name: "Forexpert", description: "un agent de prospection relié à sa messagerie" },
        { name: "Joone", description: "marque de soins pour bébé : l'accompagnement IA de ses équipes" },
        { name: "SNCF", description: "un programme de formation à l'IA, avec Arkel" },
      ],
      note: "D'autres clients préfèrent rester anonymes.",
    },
    parcours: {
      kicker: "Avec qui nous travaillons",
      title: "Nous travaillons avec des PME, des ETI et des grands groupes.",
      columns: [
        ["PME et ETI", "Vous nous apportez un sujet précis. Nous le cadrons avec vous, nous construisons, puis votre équipe reprend l'outil."],
        ["Grands groupes", "Votre direction métier ou votre direction de la transformation porte le projet. Nous préparons le cadre avec elle et vos équipes techniques, puis nous construisons."],
      ],
      note: "Dans les deux cas, nous faisons du conseil et du logiciel. La formation de vos équipes passe par FormIA, notre organisme de formation.",
    },
    capacites: {
      kicker: "Ce que nous savons faire",
      title: "Six capacités, que nous combinons selon le problème à résoudre.",
      items: [
        ["Transformation IA", "Choisir les cas d'usage à partir de vos opérations, les chiffrer et les ordonner."],
        ["Agents autonomes", "Des agents qui agissent dans des limites écrites. Ce qui engage l'entreprise passe par une validation humaine."],
        ["Logiciels sur mesure et systèmes internes", "Des outils construits autour du processus réel, dans vos comptes."],
        ["IA privée et souveraine", "Des modèles et des données hébergés là où vous le décidez."],
        ["Infrastructure go-to-market", "La donnée commerciale, sa qualité et les relances, sous supervision humaine."],
        ["Usines de contenu", "Produire, vérifier et publier, avec des contrôles avant chaque diffusion."],
      ],
      note: "Avant d'automatiser, nous observons le travail tel qu'il se fait. Nous distinguons ce qui améliore l'existant de ce qui devient possible pour la première fois.",
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
      buildWithYou: "Construire un premier système avec nous",
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
    ? "Parrit.ai · Systèmes intelligents pour les opérations"
    : "Parrit.ai · Intelligent systems for real operations";
  const description = locale === "fr"
    ? "Parrit.ai conçoit, construit et met en production des systèmes intelligents qui transforment les opérations des entreprises."
    : "Parrit.ai designs, builds and runs intelligent systems that change how companies operate.";
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
          <ul className="home-s-brands-list" role="list">
            {copy.brands.list.map(({ name, description }) => (
              <li key={name}><strong>{name}</strong>{" · "}<span>{description}</span></li>
            ))}
          </ul>
          <p>{copy.brands.note}</p>
        </div>
      </section>

      <section className="home-s-parcours">
        <div className="home-s-wrap">
          <K>{copy.parcours.kicker}</K>
          <h2>{copy.parcours.title}</h2>
          <div className="home-s-proof-grid">
            {copy.parcours.columns.map(([title, body]) => (
              <div className="home-s-proof-item" key={title}>
                <h3>{title}</h3>
                <p>{body}</p>
              </div>
            ))}
          </div>
          <p className="doctrine-note">{copy.parcours.note}</p>
        </div>
      </section>

      <section className="home-s-parcours" id="capacites" aria-labelledby="capacites-title">
        <div className="home-s-wrap">
          <K>{copy.capacites.kicker}</K>
          <h2 id="capacites-title">{copy.capacites.title}</h2>
          <div className="home-s-proof-grid">
            {copy.capacites.items.map(([title, body]) => (
              <div className="home-s-proof-item" key={title}>
                <h3>{title}</h3>
                <p>{body}</p>
              </div>
            ))}
          </div>
          <p className="doctrine-note">{copy.capacites.note}</p>
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
            <p><Link className="home-s-journey-secondary" href={localizedPath("/build-with-you", locale)}>{copy.journey.buildWithYou}</Link></p>
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
          {locale === "fr" && <p className="doctrine-note" data-language-note="">Articles en anglais.</p>}
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
