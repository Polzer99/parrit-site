import type { Metadata } from "next";
import Link from "next/link";
import { BUILD_WITH_YOU_PRICE } from "../../../site.config";

import { localizedAlternates, localizedOpenGraph, localizedPath } from "@/system/locale";
import { getLocale } from "@/lib/server/locale";
import { ProductScene } from "@/system/components/ProductScene";
import { OfferCard } from "@/system/components/OfferCard";
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
      alternative: "Or book the examination: 15 minutes, by video, with the founder.",
    },
    brands: {
      kicker: "Systems commissioned by",
      list: "An industrial group · A cosmetics maison · A law firm · A B2B energy broker · A restaurant network · A consumer brand",
      note: "Not published. Shared in person.",
    },
    journey: {
      kicker: "How it works",
      title: "Four steps take you from the first message to a system your team runs.",
      intro: "Each step names what Parrit does, what you bring, and what it unlocks next.",
      steps: [
        ["01", "Name the operation", "You describe what costs you the most time. Parrit examines with you who it touches and what it really costs."],
        ["02", "Write the scope", "What gets built, what Parrit will need from you, and how success is judged, written before work starts."],
        ["03", "Build and verify", "The system gets built, then checked the way Parrit checks its own tools first. It doesn't go live until your team has been through it."],
        ["04", "Take it over", "Code, data and documentation are yours. Your team learns to run it at handover, and can take it further alone, or call Parrit back, depending on the path you chose."],
      ],
      link: "Book the examination",
      caption: "Paul Larmaraud · Founder",
      bridge: "The founder: Paul Larmaraud",
    },
    build: {
      kicker: "What we build",
      title: "You ask, you approve, the record is created.",
      phrase: "One example: an agent in the sales team's messaging app, connected to the company's CRM.",
      steps: ["You photograph the card.", "You reply “yes”.", "The contact is in the CRM."],
      label: "In your CRM",
      mention: "Fictional example",
      conversationAlt: "Conversation with the CRM agent: a photographed business card, the question “Is that right?” and the reply “yes”",
      objectAlt: "Contact record created in the CRM: company, name, role, masked mobile number",
    },
    proof: {
      kicker: "The proof",
      systems: {
        title: "We show the system. You judge before you commit.",
        fact: "15 of 25 information sources still duplicated, checked September 13, 2026.",
        cta: "See the system",
      },
      dossiers: {
        title: "We show client dossiers in a meeting, not online.",
        fact: "Three open dossiers today. The rest stay sealed until a meeting.",
        cta: "See the dossiers",
      },
    },
    offers: {
      kicker: "Ways to start",
      cards: [
        {
          name: "Build With You",
          audience: "For leaders who want something that runs, not an audit or a deck.",
          outcome: "A working system, built with the founder.",
          deliverables: [
            "Free 15-minute examination",
            "30-minute findings review",
            "10 hours of building with the founder",
          ],
          format: "10 hours, with the founder",
          price: { ...BUILD_WITH_YOU_PRICE, basis: "fixed price" },
          cta: { label: "See Build With You", href: "/build-with-you" },
        },
        {
          name: "Custom system",
          audience: "For leaders who want Parrit to handle the entire build.",
          outcome: "A system built and put into production by Parrit.",
          deliverables: ["Examination of your needs with the founder", "A verdict: a written scope or a clear no", "Terms set in writing before work begins"],
          priceNote: "Custom quote",
          cta: { label: "Book the examination", href: "/commission" },
        },
      ],
    },
    journal: { kicker: "What the work teaches us", title: "The Journal records what held and what broke on our projects." },
    close: {
      title: "A 15-minute examination tells you whether a system is worth building.",
      note: "15 min · An examination, on a video call, with the founder",
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
      alternative: "Ou réservez l'examen : 15 minutes, en visio, avec le fondateur.",
    },
    brands: {
      kicker: "Des systèmes commandés par",
      list: "Un grand groupe industriel · Une maison de cosmétique · Un cabinet d'avocats · Un courtier énergie B2B · Un réseau de restauration · Une marque grand public",
      note: "Pas publiés. Partagés en rendez-vous.",
    },
    journey: {
      kicker: "Le déroulement",
      title: "Quatre étapes mènent du premier message à un système que votre équipe fait tourner.",
      intro: "Chaque étape dit ce que Parrit fait, ce que vous apportez, et ce qu'elle débloque pour la suite.",
      steps: [
        ["01", "Nommer l'opération", "Vous décrivez ce qui vous coûte le plus de temps. Parrit examine avec vous qui elle touche et ce qu'elle coûte réellement."],
        ["02", "Écrire le périmètre", "Ce qui sera construit, ce dont Parrit aura besoin de vous, et comment on juge que c'est réussi, écrit avant que le travail commence."],
        ["03", "Construire et vérifier", "Le système se construit puis se vérifie avec la méthode que Parrit applique d'abord à ses propres outils. Il n'entre en service qu'une fois votre équipe passée dessus."],
        ["04", "Prendre la main", "Le code, les données et la documentation vous appartiennent. Votre équipe apprend à s'en servir à la livraison, et peut le faire évoluer seule, ou vous rappelez Parrit, selon la formule choisie."],
      ],
      link: "Réserver l'examen",
      caption: "Paul Larmaraud · Fondateur",
      bridge: "Le fondateur : Paul Larmaraud",
    },
    build: {
      kicker: "Ce que nous construisons",
      title: "Vous demandez, vous validez, la fiche est créée.",
      phrase: "Un exemple : un agent dans la messagerie de l'équipe commerciale, relié au CRM de l'entreprise.",
      steps: ["Vous photographiez la carte.", "Vous répondez « oui ».", "Le contact est dans le CRM."],
      label: "Dans votre CRM",
      mention: "Exemple fictif",
      conversationAlt: "Conversation avec l'agent CRM : une carte de visite photographiée, la question « C'est bon ? » et la réponse « oui »",
      objectAlt: "Fiche du contact créée dans le CRM : société, nom, poste, mobile masqué",
    },
    proof: {
      kicker: "La preuve",
      systems: {
        title: "Nous montrons le système. Vous jugez avant de vous engager.",
        fact: "15 sources d'information sur 25 encore en double, vérifié le 13 septembre 2026.",
        cta: "Voir le système",
      },
      dossiers: {
        title: "Nous montrons les dossiers clients en rendez-vous, pas en ligne.",
        fact: "Trois dossiers ouverts aujourd'hui. Les autres restent scellés jusqu'au rendez-vous.",
        cta: "Voir les dossiers",
      },
    },
    offers: {
      kicker: "Pour commencer",
      cards: [
        {
          name: "Build With You",
          audience: "Pour le dirigeant qui veut repartir avec quelque chose qui tourne, pas un audit ni un deck.",
          outcome: "Un système qui tourne, construit avec le fondateur.",
          deliverables: [
            "Examen offert de 15 min",
            "Restitution de 30 min",
            "10 heures de construction avec le fondateur",
          ],
          format: "10 heures, avec le fondateur",
          price: { ...BUILD_WITH_YOU_PRICE, basis: "au forfait" },
          cta: { label: "Découvrir Build With You", href: "/build-with-you" },
        },
        {
          name: "Système sur mesure",
          audience: "Pour le dirigeant qui veut confier la réalisation complète à Parrit.",
          outcome: "Un système construit et mis en production par Parrit.",
          deliverables: ["Examen du besoin avec le fondateur", "Un verdict : un périmètre écrit ou un non clair", "Des conditions écrites avant de commencer"],
          priceNote: "Sur devis",
          cta: { label: "Réserver l'examen", href: "/commission" },
        },
      ],
    },
    journal: { kicker: "Ce que les chantiers nous apprennent", title: "Le Journal consigne ce qui a tenu et ce qui a cassé sur nos chantiers." },
    close: {
      title: "Un examen de 15 minutes vous dit si un système vaut d'être construit.",
      note: "15 min · Un examen, en visio, avec le fondateur",
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
    ? "Parrit.ai relie vos sources, remet vos données à plat et construit dessus des outils qui vous appartiennent : le code, les données et la documentation."
    : "Parrit.ai connects your sources, cleans up your data and builds tools on top of it that you own: the code, the data and the documentation.";
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
              <span className="frame">{copy.hero.frame}<i className="fx" aria-hidden="true" /></span>{copy.hero.after}
            </span>
          </h1>
          <p className="home-s-hero-sub">{copy.hero.sub}</p>
          <AgentEsquisse locale={locale} />
          <p className="home-s-alternative"><Link href={localizedPath("/commission", locale)}>{copy.hero.alternative}</Link></p>
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
          <figure className="home-s-founder">
            <picture>
              <source type="image/avif" srcSet="/brand/founder/parrit-ai-founder-linkedin-3x4-340.avif 340w, /brand/founder/parrit-ai-founder-linkedin-3x4-680.avif 680w" sizes="(max-width: 859px) min(340px, 100vw), 340px" />
              <source type="image/webp" srcSet="/brand/founder/parrit-ai-founder-linkedin-3x4-340.webp 340w, /brand/founder/parrit-ai-founder-linkedin-3x4-680.webp 680w" sizes="(max-width: 859px) min(340px, 100vw), 340px" />
              {/* Native picture preserves the approved, byte-identical LinkedIn exports. */}
              <img src="/brand/founder/parrit-ai-founder-linkedin-3x4-340.webp" width={340} height={453} loading="lazy" decoding="async" alt={locale === "fr" ? "Paul Larmaraud, fondateur de Parrit.ai" : "Paul Larmaraud, founder of Parrit.ai"} />
            </picture>
            <figcaption>{copy.journey.caption}</figcaption>
          </figure>
          <div className="home-s-maison-copy">
            <K>{copy.journey.kicker}</K>
            <h2>{copy.journey.title}</h2>
            <p>{copy.journey.intro}</p>
            <ol className="home-s-journey-steps">
              {copy.journey.steps.map(([number, title, body]) => (
                <li key={number}><K>{number}</K><h3>{title}</h3><p>{body}</p></li>
              ))}
            </ol>
            <Link className="rev-button ghost home-s-journey-action" href={localizedPath("/commission", locale)}>{copy.journey.link}</Link>
            <a
              className="home-s-text-link home-s-text-link--secondary"
              href="https://paul-larmaraud.com"
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`${copy.journey.bridge} (${locale === "fr" ? "ouvre paul-larmaraud.com dans un nouvel onglet" : "opens paul-larmaraud.com in a new tab"})`}
            >
              {copy.journey.bridge}
            </a>
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
            mention={copy.build.mention}
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
              <p>{copy.proof.dossiers.fact}</p>
              <span>{copy.proof.dossiers.cta}</span>
            </Link>
          </div>
        </div>
      </section>

      <section className="home-s-offers r2-dark" aria-label={copy.offers.kicker}>
        <div className="home-s-wrap">
          <K>{copy.offers.kicker}</K>
          <div className="home-s-offers-grid">
            {copy.offers.cards.map((offer) => <OfferCard key={offer.name} {...offer} locale={locale}
              cta={{ ...offer.cta, href: localizedPath(offer.cta.href, locale) }} />)}
          </div>
        </div>
      </section>

      <section className="home-s-journal">
        <div className="home-s-wrap">
          <K>{copy.journal.kicker}</K>
          <h2>{copy.journal.title}</h2>
          {locale === "fr" && <p className="doctrine-note">Articles en anglais.</p>}
          <ol>
            {entries.map((entry) => <li key={entry.slug}><Link href={`/journal/${entry.slug}`} hrefLang="en"><span lang="en">{entry.title}</span><time dateTime={entry.date}>{entry.date}</time></Link></li>)}
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
