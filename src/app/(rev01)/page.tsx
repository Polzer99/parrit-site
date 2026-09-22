import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";

import { localizedAlternates, localizedOpenGraph, localizedPath } from "@/system/locale";
import { getLocale } from "@/lib/server/locale";
import { OfferCard } from "@/system/components/OfferCard";
import { AgentEsquisse } from "@/system/components/AgentEsquisse";
import { K } from "@/system/components";
import { getAllJournalEntrySummaries } from "@/system/journal";

const DICT = {
  en: {
    hero: {
      kicker: "Parrit / Company operating systems",
      before: "The AI system your company",
      frame: "operates",
      after: "on.",
      sub: "The invoice that drags, the report rebuilt by hand every week: entry points, never the limit. We build inside your systems, on your data, until it goes live.",
      alternative: "Or talk it through: a 15-minute examination, on a video call, with the founder.",
    },
    brands: {
      kicker: "Systems commissioned by",
      list: "An industrial group · A cosmetics maison · A law firm · A B2B energy broker · A restaurant network · A consumer brand",
      note: "Not published. Shared in person.",
    },
    journey: {
      kicker: "How it works",
      title: "Paul Larmaraud is your point of contact throughout the project.",
      intro: "From the first conversation to handover, four steps, always with him.",
      steps: [
        ["01", "Name the operation", "You describe what costs you the most time. Paul examines with you who it touches and what it really costs."],
        ["02", "Write the scope", "What gets built, what Paul will need from you, and how success is judged, written before work starts."],
        ["03", "Build and verify", "The system gets built, then checked the way Parrit checks its own tools first. It doesn't go live until your team has been through it."],
        ["04", "Take it over", "Code, data and documentation are yours. Your team learns to run it at handover, and can take it further alone, or call Parrit back, depending on the path you chose."],
      ],
      link: "Book an examination",
      alt: "Portrait of the founder",
      caption: "Paul Larmaraud · Founder",
      bridge: "Meet Paul",
    },
    build: {
      kicker: "What we build",
      title: "One operation becomes one system, brick by brick.",
      items: [
        ["01", "Understand", "An invoice sits unpaid for 12 days: you know the moment you open the screen, not at next month's reconciliation."],
        ["02", "Decide", "The follow-up arrives already drafted, quantified, ready to approve. You never start from a blank page."],
        ["03", "Act", "Once approved, it goes out and logs itself in the journal. You can always roll it back; the system stays yours."],
      ],
      verdict: "Three moves, on the operation you chose. Everything else executes without you.",
    },
    proof: {
      kicker: "The proof",
      systems: {
        title: "We show the system. You judge before you commit.",
        fact: "15 of 25 information sources still duplicated, checked September 13, 2026.",
        cta: "See the system",
      },
      dossiers: {
        title: "The dossiers open in conversation.",
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
            "10 hours of building with Paul",
          ],
          format: "10 hours, with the founder",
          price: { amountHt: 3200, currency: "EUR", basis: "fixed fee" },
          cta: { label: "See Build With You", href: "/build-with-you" },
        },
        {
          name: "Custom system",
          audience: "For leaders who want Parrit to handle the entire build.",
          outcome: "A system built and put into production by Parrit.",
          deliverables: ["Examination of your needs with the founder", "A verdict: a written scope or a clear no", "Terms set in writing before work begins"],
          priceNote: "Custom quote",
          cta: { label: "Book an examination", href: "/commission" },
        },
      ],
    },
    journal: { kicker: "What the work teaches us", title: "The Journal" },
    close: {
      title: "One conversation. Your operating system, examined.",
      note: "15 min · An examination, on a video call, with the founder",
      button: "Let's talk",
    },
    credential: {
      text: "Formia, also led by our founder, is Qualiopi-certified (ATA 1926 2026, valid through May 2029).",
    },
  },
  fr: {
    hero: {
      kicker: "Parrit / Systèmes d'exploitation d'entreprise",
      before: "Le système IA qui fait tourner votre",
      frame: "entreprise.",
      after: "",
      sub: "La facture qui traîne, le rapport refait à la main chaque semaine : des points de départ, jamais la limite. Nous construisons dans vos systèmes, sur vos données, jusqu'à la mise en service.",
      alternative: "Ou parlons-en : un examen de 15 minutes, en visio, avec le fondateur.",
    },
    brands: {
      kicker: "Des systèmes commandés par",
      list: "Un grand groupe industriel · Une maison de cosmétique · Un cabinet d'avocats · Un courtier énergie B2B · Un réseau de restauration · Une marque grand public",
      note: "Pas publiés. Partagés en rendez-vous.",
    },
    journey: {
      kicker: "Le déroulement",
      title: "Paul Larmaraud est votre interlocuteur tout au long du projet.",
      intro: "De la première conversation à la prise en main, quatre étapes, toujours avec lui.",
      steps: [
        ["01", "Nommer l'opération", "Vous décrivez ce qui vous coûte le plus de temps. Paul examine avec vous qui elle touche et ce qu'elle coûte réellement."],
        ["02", "Écrire le périmètre", "Ce qui sera construit, ce dont Paul aura besoin de vous, et comment on juge que c'est réussi, écrit avant que le travail commence."],
        ["03", "Construire et vérifier", "Le système se construit puis se vérifie avec la méthode que Parrit applique d'abord à ses propres outils. Il n'entre en service qu'une fois votre équipe passée dessus."],
        ["04", "Prendre la main", "Le code, les données et la documentation vous appartiennent. Votre équipe apprend à s'en servir à la livraison, et peut le faire évoluer seule, ou vous rappelez Parrit, selon la formule choisie."],
      ],
      link: "Réserver un examen",
      alt: "Portrait du fondateur",
      caption: "Paul Larmaraud · Fondateur",
      bridge: "Rencontrez Paul",
    },
    build: {
      kicker: "Ce que nous construisons",
      title: "Une opération devient un système, brique après brique.",
      items: [
        ["01", "Comprendre", "Une facture reste impayée depuis 12 jours : vous le savez dès l'ouverture de l'écran, pas au rapprochement du mois suivant."],
        ["02", "Décider", "La relance vous arrive déjà rédigée, chiffrée, prête à valider. Vous ne partez jamais d'une page blanche."],
        ["03", "Agir", "Une fois validée, elle part et se note au journal. Vous pouvez toujours revenir en arrière ; le système reste à vous."],
      ],
      verdict: "Trois gestes, sur l'opération choisie. Le reste s'exécute sans vous.",
    },
    proof: {
      kicker: "La preuve",
      systems: {
        title: "Nous montrons le système. Vous jugez avant de vous engager.",
        fact: "15 sources d'information sur 25 encore en double, vérifié le 13 septembre 2026.",
        cta: "Voir le système",
      },
      dossiers: {
        title: "Les dossiers s'ouvrent de vive voix.",
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
            "10 heures de construction avec Paul",
          ],
          format: "10 heures, avec le fondateur",
          price: { amountHt: 3200, currency: "EUR", basis: "forfait" },
          cta: { label: "Découvrir Build With You", href: "/build-with-you" },
        },
        {
          name: "Système sur mesure",
          audience: "Pour le dirigeant qui veut confier la réalisation complète à Parrit.",
          outcome: "Un système construit et mis en production par Parrit.",
          deliverables: ["Examen du besoin avec le fondateur", "Un verdict : un périmètre écrit ou un non clair", "Des conditions écrites avant de commencer"],
          priceNote: "Sur devis",
          cta: { label: "Réserver un examen", href: "/commission" },
        },
      ],
    },
    journal: { kicker: "Ce que les chantiers nous apprennent", title: "Le Journal" },
    close: {
      title: "Une conversation. Votre système d'exploitation, examiné.",
      note: "15 min · Un examen, en visio, avec le fondateur",
      button: "Parlons-en",
    },
    credential: {
      text: "Formia, également dirigée par notre fondateur, est certifiée Qualiopi (ATA 1926 2026, valable jusqu'en mai 2029).",
    },
  },
} as const;

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getLocale();
  const title = locale === "fr"
    ? "Parrit.ai · Systèmes d'exploitation d'entreprise"
    : "Parrit.ai · Company Operating Systems";
  const description = locale === "fr"
    ? "Parrit.ai construit des systèmes IA depuis trois ans, chez des grands comptes, des PME et des ETI : votre entreprise, examinée, reconstruite opération par opération, à vous pour de bon."
    : "Parrit.ai examines how a company operates, builds its first production system and compounds it as owned infrastructure.";
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
            <span className="frame">{copy.hero.frame}<i className="fx" aria-hidden="true" /></span>{" "}
            <span>{copy.hero.after}</span>
          </h1>
          <p className="home-s-hero-sub">{copy.hero.sub}</p>
          <AgentEsquisse locale={locale} />
          <p className="home-s-alternative"><Link href={localizedPath("/commission", locale)}>{copy.hero.alternative}</Link></p>
        </div>
      </section>

      <section className="home-s-brands">
        <div className="home-s-wrap">
          <K>{copy.brands.kicker}</K>
          <p className="home-s-brands-list">{copy.brands.list}</p>
          <p>{copy.brands.note}</p>
        </div>
      </section>

      <section className="home-s-maison">
        <div className="home-s-wrap home-s-maison-grid">
          <figure>
            <Image src="/founder-portrait.jpg" alt={copy.journey.alt} width={340} height={453} sizes="(max-width: 859px) 100vw, 340px" />
            <figcaption><K>{copy.journey.caption}</K></figcaption>
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
            <Link className="home-s-text-link" href={localizedPath("/commission", locale)}>{copy.journey.link}</Link>
            <a
              className="home-s-text-link home-s-text-link--secondary"
              href="https://paul-larmaraud.com"
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`${copy.journey.bridge} (${locale === "fr" ? "ouvre paul-larmaraud.com dans un nouvel onglet" : "opens paul-larmaraud.com in a new tab"})`}
            >
              {copy.journey.bridge} →
            </a>
          </div>
        </div>
      </section>

      <section className="home-s-build r2-dark">
        <div className="home-s-wrap">
          <K>{copy.build.kicker}</K>
          <h2>{copy.build.title}</h2>
          <div className="home-s-build-grid">
            {copy.build.items.map(([number, title, body]) => <article key={number}><K>{number}</K><h3>{title}</h3><p>{body}</p></article>)}
          </div>
          <K className="home-s-verdict">{copy.build.verdict}</K>
        </div>
      </section>

      <section className="home-s-proof" aria-label={copy.proof.kicker}>
        <div className="home-s-wrap">
          <K>{copy.proof.kicker}</K>
          <div className="home-s-proof-grid">
            <Link className="home-s-proof-item home-s-proof-item--systems" href={localizedPath("/systems", locale)}>
              <h3>{copy.proof.systems.title}</h3>
              <p>{copy.proof.systems.fact}</p>
              <span>{copy.proof.systems.cta} →</span>
            </Link>
            <Link className="home-s-proof-item home-s-proof-item--dossiers" href={localizedPath("/dossiers", locale)}>
              <h3>{copy.proof.dossiers.title}</h3>
              <p>{copy.proof.dossiers.fact}</p>
              <span>{copy.proof.dossiers.cta} →</span>
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
          <ol>
            {entries.map((entry) => <li key={entry.slug}><Link href={`/journal/${entry.slug}`}><span>{entry.title}</span><time dateTime={entry.date}>{entry.date}</time></Link></li>)}
          </ol>
        </div>
      </section>

      <section className="home-s-close r2-dark">
        <div className="home-s-wrap">
          <h2>{copy.close.title}</h2>
          <K>{copy.close.note}</K>
          <Link className="rev-button exec" href={localizedPath("/commission", locale)}>{copy.close.button}</Link>
        </div>
      </section>

      <section className="home-s-credential">
        <div className="home-s-wrap">
          <Image src="/brand/qualiopi-formia.png" alt="Qualiopi" width={96} height={51} />
          <p>{copy.credential.text}</p>
        </div>
      </section>
    </main>
  );
}
