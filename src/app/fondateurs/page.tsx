import Link from "next/link";

const SITE_URL = "https://parrit.ai";

const deck = {
  heroEyebrow: "PARRIT.AI · LES FONDATEURS",
  heroLede:
    "Parrit est une boutique franco-chinoise qui construit des outils sur-mesure avec Claude Code. Pas un cabinet de transformation, pas un programme hors-sol : deux fondateurs, une seule chaîne. Paul fait naître le prototype, Yukun le fait tenir dans le réel. L'un ne va nulle part sans l'autre.",
  paul: {
    role: "Co-fondateur · Prototypage",
    lede: "Paul Larmaraud. Le zéro vers un, c'est lui qui le tient, ligne par ligne.",
    paras: [
      "Paul code tous les jours, ses agents Claude Code à côté de lui. Quand un client a besoin d'un outil, c'est lui qui shippe le premier prototype : pas un sous-traitant qui découvre votre sujet à distance, pas un junior à qui l'on confie ce qu'on ne veut pas faire. Il met les mains dedans, parce qu'on ne comprend une opération qu'en la construisant. La pièce sort de l'établi déjà fonctionnelle.",
      "Une fois le prototype debout, il préconfigure les agents qui le feront tourner : les modèles, les consignes, les intégrations, les garde-fous. Il règle l'outil au millimètre, comme on affûte une lame avant de la confier. Rien n'est laissé au hasard, rien n'est laissé à la magie. Puis il passe le relais à Yukun, proprement, avec tout en main.",
      "Sa règle tient en une phrase : ce qui tourne chez un client tourne d'abord chez lui. Un outil livré à la fois, sans esbroufe, sans slides qui promettent ce que le code ne fait pas.",
    ],
    pull: "Les autres formulent. Moi je construis, et je passe le relais sans rien lâcher.",
  },
  yukun: {
    role: "Co-fondatrice · Mise en production · 冷宇坤",
    lede: "冷宇坤. Un prototype ne vaut que le jour où il rencontre le réel.",
    paras: [
      "Yukun reprend les agents préconfigurés par Paul et les pousse en production sur vos systèmes réels : vos données, vos accès, vos contraintes, vos habitudes de travail. Ce sont eux qui portent les cas particuliers, les données imparfaites, les obstacles que personne n'avait vus au départ. C'est précisément cette rencontre avec le réel qui décide si un outil tient ou s'effondre.",
      "Là où le prototype séduit, la mise en production résiste. Yukun assume cette part exigeante et décisive : la patience, la profondeur d'analyse, le souci du détail qui fait qu'un système marche encore le lundi suivant. C'est d'elle que vient l'identité franco-chinoise de la maison, ce double regard, deux cultures du travail bien fait réunies sur une même exigence : tenir parole jusqu'au dernier détail.",
      "Sans elle, un prototype reste une démonstration. Avec elle, il devient un outil que vos équipes finissent par utiliser sans même y penser. C'est la moitié du travail qu'on voit le moins, et celle qui fait la différence.",
    ],
    pull: "Un outil ne vit pas dans une démo. Il vit dans vos systèmes.",
  },
  closingTitle: "Une seule chaîne, deux exigences",
  closingText:
    "Du prototype à la production, le même soin du début à la fin. Paul construit et préconfigure, Yukun met en service et tient la ligne. Entre les deux, aucune zone grise où l'outil pourrait se perdre. On garde la main : pas de sous-traitance, pas de boîte noire, un ouvrage à la fois, fait pour durer, jamais bâclé pour faire nombre. Si vous cherchez un atelier plutôt qu'une usine, un système qui tient quand il rencontre vos vrais systèmes, parlons-en.",
  ctaLabel: "Réserver 15 minutes avec Paul",
};

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "AboutPage",
      "@id": `${SITE_URL}/fondateurs#aboutpage`,
      url: `${SITE_URL}/fondateurs`,
      name: "Les fondateurs de Parrit.ai",
      inLanguage: "fr",
      about: [{ "@id": `${SITE_URL}/#paul-larmaraud` }, { "@id": `${SITE_URL}/#yukun-leng` }],
    },
    {
      "@type": "Organization",
      "@id": `${SITE_URL}/#organization`,
      name: "Parrit.ai",
      url: SITE_URL,
      founder: [{ "@id": `${SITE_URL}/#paul-larmaraud` }, { "@id": `${SITE_URL}/#yukun-leng` }],
    },
    {
      "@type": "Person",
      "@id": `${SITE_URL}/#paul-larmaraud`,
      name: "Paul Larmaraud",
      givenName: "Paul",
      familyName: "Larmaraud",
      jobTitle: "Co-fondateur, Prototypage",
      email: "paul.larmaraud@parrit.ai",
      worksFor: { "@id": `${SITE_URL}/#organization` },
      url: `${SITE_URL}/fondateurs`,
      sameAs: ["https://www.linkedin.com/in/paul-larmaraud-365538179/"],
      knowsAbout: ["Claude Code", "AI agents", "Rapid prototyping", "Operations automation"],
    },
    {
      "@type": "Person",
      "@id": `${SITE_URL}/#yukun-leng`,
      name: "Yukun Leng",
      alternateName: "冷宇坤",
      jobTitle: "Co-fondatrice, Mise en production",
      worksFor: { "@id": `${SITE_URL}/#organization` },
      url: `${SITE_URL}/fondateurs`,
      knowsAbout: ["Production deployment", "AI agents", "Systems integration"],
    },
    {
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Parrit.ai", item: `${SITE_URL}/fr` },
        { "@type": "ListItem", position: 2, name: "Les fondateurs", item: `${SITE_URL}/fondateurs` },
      ],
    },
  ],
};

export default function FondateursPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <nav className="blog-nav">
        <Link href="/fr" className="nav-logo">
          Parrit.ai
        </Link>
        <Link href="/fr/rendez-vous" className="blog-nav-link">
          Parler à Paul
        </Link>
      </nav>

      <main className="founders">
        <section className="founders-hero">
          <p className="founders-eyebrow">{deck.heroEyebrow}</p>
          <h1 className="founders-title">
            Deux mains. <span className="it">Un même ouvrage.</span>
          </h1>
          <p className="founders-lede">{deck.heroLede}</p>
        </section>

        {/* Paul : portrait à gauche */}
        <section className="founders-person">
          <div className="founders-portrait">
            <div className="founders-stamp" style={{ transform: "rotate(-2deg)" }}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/team/paul-portrait.jpg" alt="Paul Larmaraud, co-fondateur de Parrit.ai" />
              <div className="founders-stamp-cap" style={{ color: "var(--accent)" }}>
                Paris · 巴黎
              </div>
            </div>
            <span className="founders-mark" aria-hidden />
          </div>
          <div>
            <p className="founders-role" style={{ color: "var(--accent)" }}>
              {deck.paul.role}
            </p>
            <p className="founders-name">{deck.paul.lede}</p>
            {deck.paul.paras.map((p, i) => (
              <p className="founders-p" key={i}>
                {p}
              </p>
            ))}
            <p className="founders-pull">{deck.paul.pull}</p>
          </div>
        </section>

        {/* Yukun : portrait à droite */}
        <section className="founders-person reverse">
          <div className="founders-portrait">
            <div className="founders-stamp" style={{ transform: "rotate(1.6deg)" }}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/team/yukun-portrait.jpg" alt="Yukun Leng 冷宇坤, co-fondatrice de Parrit.ai" />
              <div className="founders-stamp-cap" style={{ color: "var(--parrit-red)" }}>
                巴黎 · Paris
              </div>
            </div>
            <span className="founders-mark" aria-hidden />
          </div>
          <div>
            <p className="founders-role" style={{ color: "var(--parrit-red)" }}>
              {deck.yukun.role}
            </p>
            <p className="founders-name">{deck.yukun.lede}</p>
            {deck.yukun.paras.map((p, i) => (
              <p className="founders-p" key={i}>
                {p}
              </p>
            ))}
            <p className="founders-pull">{deck.yukun.pull}</p>
          </div>
        </section>

        <section className="founders-close">
          <h2 className="founders-close-title">{deck.closingTitle}</h2>
          <p className="founders-close-text">{deck.closingText}</p>
          <Link href="/fr/rendez-vous" className="founders-close-cta">
            {deck.ctaLabel} →
          </Link>
        </section>
      </main>

      <footer className="blog-footer">
        <p className="footer-legal" style={{ marginTop: 0 }}>
          © {new Date().getFullYear()} SASU PARRIT.AI · Rueil-Malmaison
        </p>
      </footer>
    </>
  );
}
