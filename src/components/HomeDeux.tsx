import Link from "next/link";
import LaunchCard from "@/components/LaunchCard";
import type { Locale } from "@/app/[lang]/dictionaries";
import type { Launch } from "@/lib/launches";
import type { BlogPost } from "@/lib/blog";
import { getCatalog, type AgentGroup } from "@/lib/agents";

// Barre de preuve : logos clients, repris de la home historique.
const TRUST = "Déjà en production chez";
const CLIENT_LOGOS: { alt: string; src: string; cn?: boolean }[] = [
  { alt: "Lavazza", src: "/brand/client-logos/logo-1.png" },
  { alt: "Laparra", src: "/brand/client-logos/logo-2.png" },
  { alt: "SNCF", src: "/brand/client-logos/logo-3.png" },
  { alt: "Joone", src: "/brand/client-logos/logo-4.png" },
  { alt: "Clevery", src: "/brand/client-logos/logo-5.png" },
  { alt: "EFI", src: "/brand/client-logos/logo-6.png" },
  { alt: "Carte Noire", src: "/brand/client-logos/logo-7.png", cn: true },
];

type Pillar = {
  n: string;
  eyebrow: string;
  format: string;
  title: string;
  desc: string;
  steps?: string[];
  forms?: string[];
  proof: string;
  cta: string;
  href: string;
};

const PRICING: Pillar[] = [
  {
    n: "01",
    eyebrow: "Sprint",
    format: "5 000 €",
    title: "Un agent recruté en 14 jours.",
    desc: "Forfait fermé, 50/50. On choisit un workflow utile, on le met en production, puis on passe la main à vos équipes.",
    steps: ["Audit flash", "VPS sécurisé", "Premier agent", "Passation"],
    proof: "Le bon format pour décider vite, voir l'agent tourner et mesurer l'usage réel.",
    cta: "Embaucher un agent",
    href: "rendez-vous?source=home-pricing-sprint",
  },
  {
    n: "02",
    eyebrow: "Abonnement",
    format: "99 €/mois",
    title: "L'agent reste surveillé.",
    desc: "Supervision, petites corrections, vérification des runs et maintien du socle. Pas de boîte noire abandonnée.",
    forms: [
      "Contrôle mensuel des exécutions.",
      "Suivi des alertes et incidents simples.",
      "Documentation maintenue à jour.",
    ],
    proof: "Pour garder un agent utile sans créer une dette invisible.",
    cta: "Voir la démo",
    href: "rendez-vous?source=home-pricing-subscription",
  },
  {
    n: "03",
    eyebrow: "Évolution",
    format: "250 €/h",
    title: "On l'améliore quand le métier change.",
    desc: "Nouveaux connecteurs, règles métier, écrans internes ou cas d'usage voisins. On facture l'évolution, pas une nouvelle promesse.",
    forms: [
      "Ajouter une source ou un outil métier.",
      "Créer une variante pour une autre équipe.",
      "Durcir sécurité, logs et validation humaine.",
    ],
    proof: "Le code reste chez vous, l'agent peut grandir sans repartir de zéro.",
    cta: "Parler de l'évolution",
    href: "rendez-vous?source=home-pricing-evolution",
  },
];

function AgentCard({ group }: { group: AgentGroup }) {
  return (
    <article className="hd-agent">
      <div className="hd-agent-top">
        <div>
          <p className="hd-agent-label">{group.persona.label}</p>
          <h3 className="hd-agent-name">{group.persona.name}</h3>
        </div>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          className="hd-agent-img"
          src={group.persona.imageSrc}
          alt=""
          loading="lazy"
          aria-hidden="true"
        />
      </div>
      <ul className="hd-agent-cases">
        {group.cases.map((agentCase) => (
          <li className="hd-agent-case" key={agentCase.id}>
            <span className="hd-case-title">{agentCase.title}</span>
            <span className="hd-case-desc">{agentCase.desc}</span>
            <span className="hd-case-meta">{agentCase.sector}</span>
          </li>
        ))}
      </ul>
      {group.extraCases.length > 0 && (
        <p className="hd-agent-more">
          Aussi en production : {group.extraCases.map((agentCase) => agentCase.title).join(", ")}.
        </p>
      )}
    </article>
  );
}

export default function HomeDeux({
  lang,
  launches = [],
  posts = [],
}: {
  lang: Locale;
  launches?: Launch[];
  posts?: BlogPost[];
}) {
  const featured = posts[0];
  const rest = posts.slice(1, 5);
  const catalog = getCatalog({ perDept: 3 });
  return (
    <main className="hd">
      <style>{CSS}</style>

      {/* ===== HERO ===== */}
      <header className="hd-hero">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img className="hd-lockup" src="/brand/parrit-lockup.svg" alt="Parrit·ai" />
        <p className="hd-badge">Opérateur IA à temps partagé</p>
        <h1 className="hd-h1">
          On ne vend pas de l'IA. On <span className="hd-red">recrute des agents</span> qui travaillent chez vous.
        </h1>
        <p className="hd-lede">
          Des collaborateurs virtuels avec une fiche de poste, un périmètre, des accès limités
          et un responsable humain. Ils tournent sur vos workflows, pas dans un deck.
        </p>
        <div className="hd-hero-cta">
          <Link className="hd-btn primary" href={`/${lang}/rendez-vous?source=home-hire-agent`}>
            Embaucher un agent →
          </Link>
          <Link className="hd-btn ghost" href={`/${lang}/rendez-vous?source=home-demo`}>
            Voir la démo
          </Link>
        </div>
      </header>

      {/* ===== TRUST ===== */}
      <section className="hd-trust" aria-label={TRUST}>
        <p className="hd-trust-lab">{TRUST}</p>
        <div className="hd-logos">
          {CLIENT_LOGOS.map((l) => (
            // eslint-disable-next-line @next/next/no-img-element
            <img key={l.alt} className={l.cn ? "logo-cn" : ""} src={l.src} alt={l.alt} loading="lazy" />
          ))}
        </div>
      </section>

      {/* ===== CATALOGUE ===== */}
      <section className="hd-catalog" id="catalogue-agents" aria-labelledby="hd-catalog-h">
        <div className="hd-catalog-head">
          <p className="hd-eyebrow">Catalogue</p>
          <h2 id="hd-catalog-h" className="hd-h2">Pas des slides. Des agents qui tournent en production.</h2>
          <p className="hd-catalog-sub">
            Des profils prêts à entrer dans vos opérations : acquisition, veille, données,
            contenu, support et pilotage. Chaque cas vient du catalogue public, la source unique du site.
          </p>
        </div>
        <div className="hd-agent-grid">
          {catalog.groups.map((group) => (
            <AgentCard group={group} key={group.persona.key} />
          ))}
        </div>
        <p className="hd-catalog-foot">
          {catalog.deployedCount} agents déjà en production. Ajouter un cas au catalogue le fait remonter ici.
        </p>
      </section>

      {/* ===== PRIX ===== */}
      <section className="hd-pricing" aria-labelledby="hd-pricing-h">
        <div className="hd-piliers-head">
          <p className="hd-eyebrow">Prix publics</p>
          <h2 id="hd-pricing-h" className="hd-h2">Trois lignes claires pour recruter le premier agent.</h2>
        </div>
        <div className="hd-price-grid">
          {PRICING.map((p) => (
            <article className={p.n === "01" ? "hd-pilier hd-price featured" : "hd-pilier hd-price"} key={p.n}>
              <p className="hd-pilier-tag">
                <span className="hd-pilier-n">{p.n}</span>
                <span className="hd-pilier-eye">{p.eyebrow}</span>
                <span className="hd-pilier-format">{p.format}</span>
              </p>
              <h3 className="hd-pilier-title">{p.title}</h3>
              <p className="hd-pilier-desc">{p.desc}</p>

              {p.steps && (
                <ol className="hd-steps">
                  {p.steps.map((s, i) => (
                    <li className="hd-step" key={s}>
                      <span className="hd-step-n">{String(i + 1).padStart(2, "0")}</span>
                      <span className="hd-step-label">{s}</span>
                    </li>
                  ))}
                </ol>
              )}

              {p.forms && (
                <ul className="hd-forms">
                  {p.forms.map((f) => (
                    <li className="hd-form" key={f}>{f}</li>
                  ))}
                </ul>
              )}

              <p className="hd-pilier-proof">{p.proof}</p>
              <Link className="hd-pilier-link" href={`/${lang}/${p.href}`}>
                {p.cta} →
              </Link>
            </article>
          ))}
        </div>
      </section>

      {/* ===== PRODUIT D'APPEL - La Veille (visible, mais PAS une des 2 offres) ===== */}
      <section className="hd-veille" aria-labelledby="hd-veille-h">
        <div className="hd-veille-inner">
          <div className="hd-veille-text">
            <p className="hd-veille-eyebrow">Pour commencer · sans engagement</p>
            <h2 id="hd-veille-h" className="hd-veille-h">La newsletter qui tue les newsletters.</h2>
            <p className="hd-veille-p">
              Toutes vos sources condensées dans un seul mail, à votre format. On nettoie votre boîte
              de réception, vous ne ratez plus rien. La porte d'entrée la plus simple pour voir ce qu'on sait faire.
            </p>
          </div>
          <div className="hd-veille-action">
            <Link className="hd-btn onink" href={`/${lang}/rendez-vous`}>Réserver ma veille →</Link>
          </div>
        </div>
      </section>

      {/* ===== TRANSFORMATIONS (blog réel, angle grands comptes) ===== */}
      {featured && (
        <section className="hd-transfos" aria-labelledby="hd-transfos-h">
          <div className="hd-transfos-head">
            <p className="hd-eyebrow">Cas d'usage</p>
            <h2 id="hd-transfos-h" className="hd-h2">
              Ce que l'IA change concrètement, métier par métier.
            </h2>
            <p className="hd-transfos-sub">
              Des situations qu'on sait prendre en charge, de la relance commerciale à la veille
              juridique, expliquées en détail : ce qu'on branche, et ce que ça change au quotidien.
            </p>
          </div>

          <div className="hd-transfos-grid">
            {/* Article vedette */}
            <Link className="hd-feat" href={`/${lang}/blog/${featured.slug}`}>
              <div className="hd-feat-body">
                <p className="hd-art-meta">
                  <span className="hd-art-cat">{featured.category}</span>
                  <span className="hd-art-time">{featured.readingTime}</span>
                </p>
                <h3 className="hd-feat-title">{featured.title}</h3>
                <p className="hd-feat-desc">{featured.description}</p>
                <span className="hd-feat-link">Lire l'article →</span>
              </div>
            </Link>

            {/* Liste des autres */}
            <ul className="hd-art-list">
              {rest.map((p) => (
                <li key={p.slug}>
                  <Link className="hd-art" href={`/${lang}/blog/${p.slug}`}>
                    <p className="hd-art-meta">
                      <span className="hd-art-cat">{p.category}</span>
                      <span className="hd-art-time">{p.readingTime}</span>
                    </p>
                    <h4 className="hd-art-title">{p.title}</h4>
                    <p className="hd-art-desc">{p.description}</p>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="hd-transfos-foot">
            <Link className="hd-btn ghost" href={`/${lang}/blog`}>
              Tous les articles →
            </Link>
          </div>
        </section>
      )}

      {/* ===== LAUNCHES (build in public, garde le lien à l'ancien) ===== */}
      {launches.length > 0 && (
        <section className="hd-launches" aria-labelledby="hd-launches-h">
          <div className="hd-launches-head">
            <p className="hd-eyebrow">Build in public</p>
            <h2 id="hd-launches-h" className="hd-h2">Une preuve de fabrication, chaque semaine.</h2>
            <Link href={`/${lang}/launches`} className="hd-launches-all">Tous les launches →</Link>
          </div>
          <div className="hd-launch-grid">
            {launches.slice(0, 3).map((launch) => (
              <LaunchCard href={`/${lang}/launches/${launch.slug}`} key={launch.slug} launch={launch} />
            ))}
          </div>
        </section>
      )}

      {/* ===== CTA FINAL ===== */}
      <footer className="hd-cta">
        <h2 className="hd-cta-h">On en parle 15 minutes ?</h2>
        <p className="hd-cta-p">
          On part d'un poste à recruter, pas d'une transformation abstraite.
          En 15 minutes, on choisit le premier agent utile.
        </p>
        <Link className="hd-btn primary lg" href={`/${lang}/rendez-vous?source=home-final-hire-agent`}>
          Embaucher un agent →
        </Link>
        <p className="hd-cta-old">
          <Link href={`/${lang}/os-classic`}>Voir le parcours complet, niveau par niveau →</Link>
        </p>
      </footer>
    </main>
  );
}

const CSS = `
.hd { background: var(--bg); color: var(--ink); }
.hd-btn { display: inline-block; font-family: var(--font-mono); font-size: 14px; font-weight: 500; letter-spacing: .02em; padding: 12px 24px; text-decoration: none; border: 1px solid transparent; }
.hd-btn.primary { background: var(--red); color: #fff; }
.hd-btn.primary:hover { background: var(--ink); }
.hd-btn.ghost { background: transparent; color: var(--ink); border-color: var(--ink); }
.hd-btn.ghost:hover { background: var(--ink); color: var(--bg); }
.hd-btn.lg { padding: 16px 34px; font-size: 15px; }

/* HERO */
.hd-hero { max-width: 860px; margin: 0 auto; padding: 84px 24px 56px; text-align: center; }
.hd-lockup { height: 34px; width: auto; margin: 0 auto 34px; display: block; }
.hd-badge { display: inline-block; font-family: var(--font-mono); font-size: 11px; font-weight: 500; letter-spacing: .14em; text-transform: uppercase; color: var(--red); background: var(--tint); padding: 6px 12px; margin: 0 0 26px; }
.hd-h1 { font-family: var(--font-body); font-size: clamp(40px, 6vw, 72px); line-height: 1.02; font-weight: 600; letter-spacing: -0.04em; text-wrap: balance; margin: 0; }
.hd-red { color: var(--red); }
.hd-lede { max-width: 620px; margin: 26px auto 0; font-family: var(--font-mono); font-size: 15px; line-height: 1.65; color: var(--muted); }
.hd-hero-cta { display: flex; gap: 12px; justify-content: center; flex-wrap: wrap; margin-top: 34px; }

/* TRUST */
.hd-trust { border-top: 1px solid var(--line); border-bottom: 1px solid var(--line); padding: 32px 24px; }
.hd-trust-lab { color: var(--faint); font-family: var(--font-mono); font-size: 11px; letter-spacing: .2em; text-transform: uppercase; text-align: center; margin: 0 0 24px; }
.hd-logos { display: flex; flex-wrap: wrap; align-items: center; justify-content: center; gap: clamp(26px, 5vw, 56px); max-width: 1000px; margin: 0 auto; }
.hd-logos img { height: 28px; max-width: 130px; width: auto; object-fit: contain; filter: grayscale(1); opacity: .68; transition: opacity .2s, filter .2s; }
.hd-logos img:hover { opacity: 1; filter: grayscale(0); }
.hd-logos img.logo-cn { height: 48px; max-width: 190px; }

/* CATALOGUE */
.hd-catalog { max-width: 1180px; margin: 0 auto; padding: 72px 24px 24px; }
.hd-catalog-head { max-width: 720px; margin: 0 auto 38px; text-align: center; }
.hd-catalog-sub { font-family: var(--font-mono); font-size: 14px; line-height: 1.6; color: var(--muted); margin: 16px auto 0; max-width: 660px; }
.hd-agent-grid { display: grid; grid-template-columns: repeat(4, minmax(0, 1fr)); border: 1px solid var(--line); }
.hd-agent { min-width: 0; display: flex; flex-direction: column; background: var(--bg); }
.hd-agent + .hd-agent { border-left: 1px solid var(--line); }
.hd-agent-top { display: grid; grid-template-columns: 1fr 92px; gap: 14px; align-items: end; min-height: 146px; padding: 22px 20px 18px; border-bottom: 1px solid var(--line); }
.hd-agent-label { font-family: var(--font-mono); font-size: 11px; letter-spacing: .14em; text-transform: uppercase; color: var(--red); margin: 0 0 8px; }
.hd-agent-name { font-family: var(--font-body); font-size: clamp(24px, 2.4vw, 32px); line-height: 1; font-weight: 600; letter-spacing: -0.04em; margin: 0; }
.hd-agent-img { width: 92px; height: 112px; object-fit: cover; border: 1px solid var(--line); background: var(--band); align-self: center; }
.hd-agent-cases { list-style: none; margin: 0; padding: 0; }
.hd-agent-case { padding: 17px 20px 18px; border-bottom: 1px solid var(--line); }
.hd-case-title { display: block; font-family: var(--font-body); font-size: 17px; line-height: 1.15; font-weight: 600; letter-spacing: -0.03em; color: var(--ink); margin: 0 0 7px; }
.hd-case-desc { display: block; font-family: var(--font-mono); font-size: 12.5px; line-height: 1.5; color: var(--muted); margin: 0 0 10px; }
.hd-case-meta { display: inline-block; max-width: 100%; font-family: var(--font-mono); font-size: 10px; letter-spacing: .09em; text-transform: uppercase; color: var(--red); background: var(--tint); padding: 4px 7px; overflow-wrap: anywhere; }
.hd-agent-more { font-family: var(--font-mono); font-size: 11.5px; line-height: 1.5; color: var(--faint); margin: auto 0 0; padding: 16px 20px 18px; }
.hd-catalog-foot { font-family: var(--font-mono); font-size: 12px; line-height: 1.5; color: var(--muted); text-align: center; margin: 22px auto 0; }

/* PRIX */
.hd-pricing { max-width: 1120px; margin: 0 auto; padding: 72px 24px 54px; }
.hd-price-grid { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); border: 1px solid var(--line); }
.hd-price + .hd-price { border-left: 1px solid var(--line); }
/* Sprint mis en avant : accent rouge sobre, pas de bloc noir agressif (feedback Paul 11/07). */
.hd-price.featured { border-left: 2px solid var(--red); }
.hd-price.featured .hd-pilier-format { color: var(--red); border-color: var(--red); }

/* PRODUIT D'APPEL - bandeau Veille (sombre, distinct des offres) */
.hd-veille { background: var(--ink); color: var(--bg); }
.hd-veille-inner { max-width: 1120px; margin: 0 auto; padding: 44px 24px; display: grid; grid-template-columns: 1fr auto; gap: 28px; align-items: center; }
.hd-veille-eyebrow { font-family: var(--font-mono); font-size: 11px; letter-spacing: .16em; text-transform: uppercase; color: var(--bg); margin: 0 0 12px; }
.hd-veille-h { font-family: var(--font-body); font-size: clamp(24px, 3.2vw, 36px); line-height: 1.05; font-weight: 600; letter-spacing: -0.04em; margin: 0 0 12px; color: var(--bg); }
.hd-veille-p { font-family: var(--font-mono); font-size: 14px; line-height: 1.6; color: rgba(255,253,250,.72); margin: 0; max-width: 620px; }
.hd-btn.onink { background: var(--red); color: #fff; white-space: nowrap; }
.hd-btn.onink:hover { background: var(--bg); color: var(--ink); }

/* PILIERS */
.hd-piliers { max-width: 1120px; margin: 0 auto; padding: 72px 24px 24px; }
.hd-piliers-head { text-align: center; margin: 0 0 40px; }
.hd-eyebrow { font-family: var(--font-mono); font-size: 12px; letter-spacing: .16em; text-transform: uppercase; color: var(--red); margin: 0 0 12px; }
.hd-h2 { font-family: var(--font-body); font-size: clamp(26px, 3.4vw, 40px); line-height: 1.1; font-weight: 600; letter-spacing: -0.04em; text-wrap: balance; margin: 0; }
.hd-grid { display: grid; grid-template-columns: 1fr 1fr; border: 1px solid var(--line); }
.hd-pilier { display: flex; flex-direction: column; padding: 36px 34px 34px; }
.hd-pilier + .hd-pilier { border-left: 1px solid var(--line); }
.hd-pilier-tag { display: flex; align-items: center; gap: 12px; margin: 0 0 18px; }
.hd-pilier-n { font-family: var(--font-mono); font-size: 12px; font-weight: 600; color: #fff; background: var(--red); padding: 4px 9px; }
.hd-pilier-eye { font-family: var(--font-mono); font-size: 12px; letter-spacing: .14em; text-transform: uppercase; color: var(--muted); }
.hd-pilier-title { font-family: var(--font-body); font-size: clamp(22px, 2.6vw, 30px); line-height: 1.12; font-weight: 600; letter-spacing: -0.04em; margin: 0 0 14px; }
.hd-pilier-desc { font-family: var(--font-mono); font-size: 14px; line-height: 1.6; color: var(--muted); margin: 0 0 24px; }

.hd-pilier-format { font-family: var(--font-mono); font-size: 11px; letter-spacing: .04em; color: var(--red); border: 1px solid var(--line); padding: 3px 8px; margin-left: auto; }
/* Offre 01 - parcours 5 étapes (colonne vertébrale) */
.hd-steps { list-style: none; margin: 0 0 22px; padding: 0; border-top: 1px solid var(--line); }
.hd-step { display: flex; align-items: baseline; gap: 14px; padding: 12px 0; border-bottom: 1px solid var(--line); }
.hd-step-n { font-family: var(--font-mono); font-size: 12px; font-weight: 600; color: var(--red); min-width: 22px; }
.hd-step-label { font-family: var(--font-body); font-size: 15px; font-weight: 500; letter-spacing: -0.02em; color: var(--ink); }
/* Offre 02 - 3 formes d'intervention */
.hd-forms { list-style: none; margin: 0 0 22px; padding: 0; }
.hd-form { position: relative; font-family: var(--font-mono); font-size: 13.5px; line-height: 1.5; color: var(--ink); padding: 12px 0 12px 22px; border-bottom: 1px solid var(--line); }
.hd-form:first-child { border-top: 1px solid var(--line); }
.hd-form::before { content: "→"; position: absolute; left: 0; color: var(--red); }

.hd-pilier-proof { font-family: var(--font-mono); font-size: 12px; line-height: 1.5; color: var(--faint); margin: 0 0 22px; }
.hd-pilier-link { margin-top: auto; font-family: var(--font-mono); font-size: 14px; font-weight: 500; letter-spacing: .02em; color: var(--red); text-decoration: none; border-bottom: 1px solid var(--red); padding-bottom: 3px; align-self: flex-start; }
.hd-pilier-link:hover { color: var(--ink); border-color: var(--ink); }

/* TRANSFORMATIONS */
.hd-transfos { max-width: 1120px; margin: 0 auto; padding: 72px 24px 24px; border-top: 1px solid var(--line); }
.hd-transfos-head { max-width: 720px; margin: 0 0 40px; }
.hd-transfos-sub { font-family: var(--font-mono); font-size: 14px; line-height: 1.6; color: var(--muted); margin: 16px 0 0; }
.hd-transfos-grid { display: grid; grid-template-columns: 1.15fr 1fr; border: 1px solid var(--line); }
.hd-feat { display: flex; text-decoration: none; color: inherit; background: var(--ink); }
.hd-feat-body { display: flex; flex-direction: column; padding: 34px 32px; }
.hd-feat .hd-art-cat { color: #fff; background: var(--red); }
.hd-feat .hd-art-time { color: rgba(255,255,255,.55); }
.hd-feat-title { font-family: var(--font-body); font-size: clamp(24px, 2.8vw, 34px); line-height: 1.1; font-weight: 600; letter-spacing: -0.04em; color: #fff; margin: 16px 0 14px; }
.hd-feat-desc { font-family: var(--font-mono); font-size: 14px; line-height: 1.65; color: rgba(255,255,255,.72); margin: 0 0 24px; }
.hd-feat-link { margin-top: auto; font-family: var(--font-mono); font-size: 14px; font-weight: 500; color: #fff; }
.hd-feat:hover .hd-feat-link { color: var(--red); }

.hd-art-list { list-style: none; margin: 0; padding: 0; display: flex; flex-direction: column; border-left: 1px solid var(--line); }
.hd-art-list li + li { border-top: 1px solid var(--line); }
.hd-art { display: block; text-decoration: none; color: inherit; padding: 22px 26px; transition: background .15s ease; }
.hd-art:hover { background: var(--band); }
.hd-art-meta { display: flex; align-items: center; gap: 12px; margin: 0 0 10px; }
.hd-art-cat { font-family: var(--font-mono); font-size: 10px; font-weight: 600; letter-spacing: .1em; text-transform: uppercase; color: var(--red); background: var(--tint); padding: 4px 8px; }
.hd-art-time { font-family: var(--font-mono); font-size: 11px; letter-spacing: .08em; text-transform: uppercase; color: var(--faint); }
.hd-art-title { font-family: var(--font-body); font-size: 18px; line-height: 1.2; font-weight: 600; letter-spacing: -0.03em; color: var(--ink); margin: 0 0 6px; }
.hd-art-desc { font-family: var(--font-mono); font-size: 12.5px; line-height: 1.55; color: var(--muted); margin: 0; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; }
.hd-transfos-foot { display: flex; justify-content: center; margin: 34px 0 0; }

/* LAUNCHES */
.hd-launches { max-width: 1120px; margin: 0 auto; padding: 64px 24px 24px; border-top: 1px solid var(--line); }
.hd-launches-head { display: flex; flex-direction: column; align-items: center; text-align: center; gap: 6px; margin: 0 0 34px; }
.hd-launches-all { font-family: var(--font-mono); font-size: 13px; letter-spacing: .04em; color: var(--red); text-decoration: none; margin-top: 6px; }
.hd-launch-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 20px; }

/* CTA */
.hd-cta { max-width: 720px; margin: 0 auto; padding: 80px 24px 110px; text-align: center; }
.hd-cta-h { font-family: var(--font-body); font-size: clamp(28px, 4vw, 44px); line-height: 1.05; font-weight: 600; letter-spacing: -0.04em; margin: 0 0 16px; }
.hd-cta-p { font-family: var(--font-mono); font-size: 15px; line-height: 1.6; color: var(--muted); margin: 0 auto 30px; max-width: 520px; }
.hd-cta-old { margin: 34px 0 0; }
.hd-cta-old a { font-family: var(--font-mono); font-size: 12px; letter-spacing: .06em; text-transform: uppercase; color: var(--faint); text-decoration: none; }
.hd-cta-old a:hover { color: var(--ink); }

@media (max-width: 820px) {
  .hd-grid { grid-template-columns: 1fr; }
  .hd-pilier + .hd-pilier { border-left: 0; border-top: 1px solid var(--line); }
  .hd-agent-grid { grid-template-columns: repeat(2, minmax(0, 1fr)); }
  .hd-agent + .hd-agent { border-left: 0; }
  .hd-agent:nth-child(2n) { border-left: 1px solid var(--line); }
  .hd-agent:nth-child(n+3) { border-top: 1px solid var(--line); }
  .hd-price-grid { grid-template-columns: 1fr; }
  .hd-price + .hd-price { border-left: 0; border-top: 1px solid var(--line); }
  .hd-launch-grid { grid-template-columns: 1fr; }
  .hd-transfos-grid { grid-template-columns: 1fr; }
  .hd-art-list { border-left: 0; border-top: 1px solid var(--line); }
  .hd-veille-inner { grid-template-columns: 1fr; }
}
@media (max-width: 520px) {
  .hd-hero { padding-top: 58px; }
  .hd-h1 { font-size: clamp(36px, 13vw, 52px); }
  .hd-agent-grid { grid-template-columns: 1fr; }
  .hd-agent:nth-child(2n) { border-left: 0; }
  .hd-agent:nth-child(n+2) { border-top: 1px solid var(--line); }
  .hd-agent-top { grid-template-columns: 1fr 82px; padding: 20px 18px 16px; }
  .hd-agent-img { width: 82px; height: 102px; }
  .hd-transfo { grid-template-columns: 1fr; }
  .hd-transfo-col.apres { border-left: 0; border-top: 1px solid var(--line); }
  .hd-transfo-arrow { display: none; }
}
`;
