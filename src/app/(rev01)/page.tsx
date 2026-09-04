import Image from "next/image";
import Link from "next/link";

import { getLocale } from "@/lib/server/locale";
import { K, NewsletterCapture, Opening, QuickCapture } from "@/system/components";
import { getAllJournalEntrySummaries } from "@/system/journal";

const DICT = {
  en: {
    hero: {
      kicker: "Parrit / Company operating systems",
      before: "The AI system your company",
      frame: "operates",
      after: "on.",
      sub: "Parrit.ai has built AI systems for three years, for large accounts, SMEs and mid-sized companies. One company at a time.",
      alternative: "Or talk it through: a 30-minute examination, on video, with the founder.",
    },
    metrics: [
      ["200+", "signals become decisions every week, on our own system"],
      ["2.5 months", "recovered on a single reporting process, at a consumer brand"],
      ["100%", "of delivered systems owned by the client, code and data included"],
    ],
    metricsNote: "Figures measured in client systems · Current as of 02·09·2026",
    brands: {
      kicker: "Systems commissioned by",
      list: "An industrial group · A cosmetics maison · A law firm · A B2B energy broker · A restaurant network · A consumer brand",
      note: "Names are given in person, with each client's consent.",
    },
    maison: {
      kicker: "The maison",
      title: "We take few commissions.",
      leadStrong: "Three years building these systems.",
      leadRest: " What runs at a client's runs at ours first.",
      body: "A partner builds each commission personally. The 30-minute examination is held with the founder, live.",
      link: "Book an examination",
      alt: "Portrait of the founder",
      caption: "Paul Larmaraud · Founder",
    },
    build: {
      kicker: "What we build",
      title: "Your company, on one system.",
      items: [
        ["01", "Understand", "Everything that happens, readable at any moment. You open it, you know."],
        ["02", "Decide", "Only decisions reach you. Framed and quantified, on a card."],
        ["03", "Act", "The action executes in the same system. Journaled, reversible. The system belongs to you."],
      ],
      verdict: "Three moves. The rest runs without you.",
    },
    journal: { kicker: "What the work teaches us", title: "The Journal" },
    close: {
      title: "One conversation. Your operating system, examined.",
      note: "30 min · An examination, on video, with the founder",
      button: "Let's talk",
    },
    footer: {
      links: [
        ["/manufacture", "The Manufacture", "the method"],
        ["/standard", "The Standard", "our commitments"],
        ["/dossiers", "The Dossiers", "references"],
        ["/legal", "Legal", ""],
      ],
      founder: "Founded by Paul Larmaraud",
      principle: "Commissioned, not subscribed",
    },
  },
  fr: {
    hero: {
      kicker: "Parrit / Systèmes d'exploitation d'entreprise",
      before: "Le système IA qui fait tourner votre",
      frame: "entreprise.",
      after: "",
      sub: "Parrit.ai construit des systèmes IA depuis trois ans, chez des grands comptes, des PME et des ETI. Une entreprise à la fois.",
      alternative: "Ou parlons-en : un examen de 30 minutes, en visio, avec le fondateur.",
    },
    metrics: [
      ["200+", "signaux deviennent des décisions chaque semaine, sur notre propre système"],
      ["2,5 mois", "gagnés sur un seul processus de reporting, chez une marque grand public"],
      ["100 %", "des systèmes livrés appartiennent au client, code et données compris"],
    ],
    metricsNote: "Chiffres mesurés dans les systèmes des clients · À jour au 02·09·2026",
    brands: {
      kicker: "Des systèmes commandés par",
      list: "Un grand groupe industriel · Une maison de cosmétique · Un cabinet d'avocats · Un courtier énergie B2B · Un réseau de restauration · Une marque grand public",
      note: "Les noms se donnent en rendez-vous, avec l'accord de chaque client.",
    },
    maison: {
      kicker: "La maison",
      title: "Nous acceptons peu de commandes.",
      leadStrong: "Trois ans à construire ces systèmes.",
      leadRest: " Ce qui tourne chez un client tourne d'abord chez nous.",
      body: "Un associé construit chaque commande en personne. L'examen de 30 minutes se tient avec le fondateur, en direct.",
      link: "Réserver un examen",
      alt: "Portrait du fondateur",
      caption: "Paul Larmaraud · Fondateur",
    },
    build: {
      kicker: "Ce que nous construisons",
      title: "Votre entreprise, sur un seul système.",
      items: [
        ["01", "Comprendre", "Tout ce qui se passe, lisible à tout moment. Vous ouvrez, vous savez."],
        ["02", "Décider", "Seules les décisions remontent jusqu'à vous. Cadrées et chiffrées, sur une carte."],
        ["03", "Agir", "L'action s'exécute dans le même système. Consignée au journal, réversible. Le système vous appartient."],
      ],
      verdict: "Trois gestes. Le reste tourne sans vous.",
    },
    journal: { kicker: "Ce que les chantiers nous apprennent", title: "Le Journal" },
    close: {
      title: "Une conversation. Votre système d'exploitation, examiné.",
      note: "30 min · Un examen, en visio, avec le fondateur",
      button: "Parlons-en",
    },
    footer: {
      links: [
        ["/manufacture", "La Manufacture", "la méthode"],
        ["/standard", "Le Standard", "nos engagements"],
        ["/dossiers", "Les Dossiers", "références"],
        ["/legal", "Mentions légales", ""],
      ],
      founder: "Fondée par Paul Larmaraud",
      principle: "Une commande, pas un abonnement",
    },
  },
} as const;

export default async function HomePage() {
  const locale = await getLocale();
  const copy = DICT[locale];
  const entries = getAllJournalEntrySummaries().slice(0, 3);

  return (
    <main className="rev-page home-s">
      <Opening locale={locale} />

      <section className="home-s-hero r2-dark">
        <div className="home-s-wrap">
          <K>{copy.hero.kicker}</K>
          <h1>
            <span>{copy.hero.before} </span>
            <span className="frame">{copy.hero.frame}<i className="fx" aria-hidden="true" /></span>{" "}
            <span>{copy.hero.after}</span>
          </h1>
          <p className="home-s-hero-sub">{copy.hero.sub}</p>
          <QuickCapture locale={locale} id="prototype" hero />
          <p className="home-s-alternative"><Link href="/commission">{copy.hero.alternative}</Link></p>
        </div>
      </section>

      <section className="home-s-metrics r2-dark" aria-label="Metrics">
        <div className="home-s-wrap">
          <div className="home-s-metrics-grid">
            {copy.metrics.map(([value, label]) => <article key={value}><strong>{value}</strong><p>{label}</p></article>)}
          </div>
          <K>{copy.metricsNote}</K>
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
            <Image src="/founder-portrait.jpg" alt={copy.maison.alt} width={340} height={453} sizes="(max-width: 859px) 100vw, 340px" />
            <figcaption><K>{copy.maison.caption}</K></figcaption>
          </figure>
          <div className="home-s-maison-copy">
            <K>{copy.maison.kicker}</K>
            <h2>{copy.maison.title}</h2>
            <p><strong>{copy.maison.leadStrong}</strong>{copy.maison.leadRest}</p>
            <p>{copy.maison.body}</p>
            <Link className="home-s-text-link" href="/commission">{copy.maison.link}</Link>
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

      <section className="home-s-journal">
        <div className="home-s-wrap">
          <K>{copy.journal.kicker}</K>
          <h2>{copy.journal.title}</h2>
          <ol>
            {entries.map((entry) => <li key={entry.slug}><Link href={`/journal/${entry.slug}`}><span>{entry.title}</span><time dateTime={entry.date}>{entry.date}</time></Link></li>)}
          </ol>
          <NewsletterCapture locale={locale} />
        </div>
      </section>

      <section className="home-s-close r2-dark">
        <div className="home-s-wrap">
          <h2>{copy.close.title}</h2>
          <K>{copy.close.note}</K>
          <Link className="rev-button exec" href="/commission">{copy.close.button}</Link>
        </div>
      </section>

      <footer className="home-s-footer r2-dark">
        <div className="home-s-wrap">
          <nav aria-label="Footer">
            {copy.footer.links.map(([href, label, description]) => <Link href={href} key={href}><span>{label}</span>{description ? <small> · {description}</small> : null}</Link>)}
          </nav>
          <div className="home-s-footer-meta">
            <a href="https://paul-larmaraud.com">{copy.footer.founder}</a>
            <span>{copy.footer.principle}</span>
            <span>© 2026 Parrit.ai</span>
          </div>
        </div>
      </footer>
    </main>
  );
}
