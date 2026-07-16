import Link from "next/link";

type Temps = {
  n: string;
  epoque: string;
  title: string;
  who: string; // « qui fait le travail »
  shift?: boolean; // le palier où le digital bascule vers la machine
  vo: string;
};

// La métamorphose du commercial -- 7 temps. Source : dictée de Paul (29/06), cohérente avec la loop vidéo.
const COMMERCIAL: Temps[] = [
  {
    n: "01",
    epoque: "Hier",
    title: "Le porte-à-porte",
    who: "Vous · sur le terrain",
    vo: "Au début, on frappe aux portes. Une poignée de main, un refus, une autre porte. Le métier est tout entier dans la présence physique.",
  },
  {
    n: "02",
    epoque: "Puis",
    title: "Le téléphone",
    who: "Vous · au combiné",
    vo: "Le téléphone raccourcit les distances. On appelle plus de monde, plus vite. On gagne en portée, on perd un peu le regard de l'autre.",
  },
  {
    n: "03",
    epoque: "Puis",
    title: "L'emailing",
    who: "Vous · en nombre",
    vo: "L'email industrialise la prise de contact. Des centaines de messages partent. La portée explose, l'attention se dilue.",
  },
  {
    n: "04",
    epoque: "Puis",
    title: "LinkedIn",
    who: "Vous · en réseau",
    vo: "Le réseau social professionnel remet du visage sur le contact. On commente, on engage, on se rend visible avant de parler.",
  },
  {
    n: "05",
    epoque: "Aujourd'hui",
    title: "La prospection par signal",
    who: "L'IA · repère le bon moment",
    vo: "L'IA écoute les signaux faibles : un recrutement, une levée, un post, un changement. Elle vous dit qui contacter, et surtout quand. La même question qu'au porte-à-porte, enfin résolue : le bon client, au bon moment.",
  },
  {
    n: "06",
    epoque: "Le basculement",
    title: "L'administratif, tout seul",
    who: "L'IA · comptes-rendus, CRM, relances",
    shift: true,
    vo: "C'est ici que le métier se retourne. Les comptes-rendus, le CRM, les relances : trois heures par jour, avant. Aujourd'hui, ça se remplit tout seul. L'invisible, celui qui mangeait vos journées, passe à la machine.",
  },
  {
    n: "07",
    epoque: "Demain",
    title: "Le retour chez le client",
    who: "Vous · en face",
    vo: "Quand l'IA absorbe tout ce qui se fait derrière un écran, il reste une chose qu'elle ne fera jamais à votre place : être là. Ce n'est pas un retour vers le passé. C'est le présentiel qui redevient le luxe, parce qu'on a enfin le temps de le rendre.",
  },
];

// Autres métiers -- à remplir au fil du calendrier de contenu (1 loop / semaine = 1 métier).
const A_VENIR = [
  { nom: "Le dirigeant", sous: "Décider avec une vue temps réel, pas un reporting d'il y a trois semaines" },
  { nom: "Le support client", sous: "Répondre vite et juste, garder l'humain pour ce qui compte" },
  { nom: "La finance", sous: "Le rapprochement, les relances, la clôture : en pilote automatique" },
  { nom: "Les RH", sous: "Sourcing, tri, onboarding : la machine prépare, vous décidez" },
  { nom: "Le marketing", sous: "Produire du contenu en série, sans diluer la voix de la marque" },
  { nom: "Les opérations", sous: "Les process répétitifs branchés directement dans vos outils" },
];

// Les 7 paliers du chemin de l'IA (cf. /chemin) - repris en frise de drapeaux sous la vidéo.
const CHEMIN_FLAGS = [
  { lv: "N1", nom: "L'éveil" },
  { lv: "N2", nom: "L'usage" },
  { lv: "N3", nom: "L'action" },
  { lv: "N4", nom: "Le diagnostic" },
  { lv: "N5", nom: "Le déploiement" },
  { lv: "N6", nom: "L'autonomie" },
  { lv: "N7", nom: "La gouvernance" },
];

export default function MetiersPage() {
  const itemList = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: "L'IA métier par métier : la métamorphose du commercial",
    itemListElement: COMMERCIAL.map((t, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: t.title,
    })),
  };

  return (
    <main className="met">
      <style>{CSS}</style>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(itemList) }} />

      <header className="met-hero">
        <Link href="/fr" className="nav-logo">Parrit.ai</Link>
        <p className="met-kicker">L'IA, métier par métier</p>
        <h1 className="met-h1">Voilà ce que ça change<br />pour votre métier.</h1>
        <p className="met-lede">
          <Link href="/fr">Le chemin de l&apos;IA</Link>{" "}décrit où en est votre organisation. Ici, on
          descend dans le concret, un métier à la fois. On commence par celui qu&apos;on connaît le mieux :
          le commercial.
        </p>
        <span className="met-scroll">La métamorphose du commercial ↓</span>
      </header>

      <section className="met-film">
        <div className="met-film-frame">
          <video
            controls
            playsInline
            preload="metadata"
            poster="https://dgjgscstyzcmtwgjrrda.supabase.co/storage/v1/object/public/artefacts/content/commercial-poster.jpg"
            src="https://dgjgscstyzcmtwgjrrda.supabase.co/storage/v1/object/public/artefacts/content/commercial-metamorphose.mp4"
          />
        </div>
        <p className="met-film-cap">
          La métamorphose du commercial, en trente-cinq secondes. Du porte-à-porte à la prospection par
          signal, jusqu&apos;à l&apos;administratif qui se fait seul.
        </p>
      </section>

      <section className="met-cta1">
        <p className="met-cta1-k">Et vous, où en êtes-vous ?</p>
        <h2 className="met-cta1-h">Cette transformation suit un chemin. On vous situe dessus.</h2>
        <ol className="met-flags" aria-label="Les sept paliers du chemin de l'IA">
          {CHEMIN_FLAGS.map((f, i) => (
            <li className={`met-flag ${i === CHEMIN_FLAGS.length - 1 ? "is-goal" : ""}`} key={f.lv} title={`${f.lv} · ${f.nom}`}>
              <svg className="met-flag-ico" width="13" height="17" viewBox="0 0 13 17" aria-hidden>
                <path d="M2 0.5v16" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" fill="none" />
                <path d="M2 1.5h8.5l-2.2 2.8 2.2 2.8H2z" fill="currentColor" />
              </svg>
              <span className="met-flag-lv">{f.lv}</span>
            </li>
          ))}
        </ol>
        <div className="met-cta1-row">
          <Link className="met-btn primary" href="/diagnostic">Situer mon organisation sur le chemin →</Link>
          <Link className="met-btn ghost" href="/fr">Voir le chemin complet</Link>
        </div>
      </section>

      <div className="met-path">
        <span className="met-spine" aria-hidden />
        {COMMERCIAL.map((t, i) => (
          <section className={`met-step ${i % 2 === 0 ? "is-left" : "is-right"}`} key={t.n}>
            <span className="met-node" aria-hidden>{t.n}</span>
            <div className="met-copy">
              <p className="met-tag">
                <span className="met-ep">{t.epoque}</span>
              </p>
              <h2 className="met-title">{t.title}</h2>
              <p className={`met-who ${t.shift ? "shift" : ""}`}>
                <span className="met-who-k">Le travail</span>
                {t.who}
              </p>
              <p className="met-vo">{t.vo}</p>
            </div>
          </section>
        ))}
      </div>

      <section className="met-next">
        <h2 className="met-next-h">Et pour les autres métiers ?</h2>
        <p className="met-next-p">
          On déroule la même métamorphose, métier par métier. Une nouvelle vidéo chaque semaine.
        </p>
        <div className="met-grid">
          {A_VENIR.map((m) => (
            <div className="met-card" key={m.nom}>
              <span className="met-card-soon">Bientôt</span>
              <p className="met-card-nom">{m.nom}</p>
              <p className="met-card-sous">{m.sous}</p>
            </div>
          ))}
        </div>
      </section>

      <footer className="met-cta">
        <h2 className="met-cta-h">Et le vôtre, de métier ?</h2>
        <p className="met-cta-p">
          On pose votre niveau réel sur le chemin de l&apos;IA, puis on déploie la bonne marche, pour les
          bonnes personnes. En commençant par le métier qui en a le plus besoin chez vous.
        </p>
        <div className="met-cta-row">
          <a className="met-btn primary" href="mailto:paul.larmaraud@parrit.ai?subject=L'IA%20pour%20mon%20m%C3%A9tier">Demander l&apos;audit de transformation</a>
          <Link className="met-btn ghost" href="/fr">Voir le chemin de l&apos;IA</Link>
        </div>
      </footer>
    </main>
  );
}

const CSS = `
.met { background: var(--bg); color: var(--ink); }
.met-hero { max-width: 880px; margin: 0 auto; padding: 88px 24px 24px; text-align: center; }
.met-back { font-family: var(--font-mono); font-size: 12px; letter-spacing: .14em; text-transform: uppercase; color: var(--muted); text-decoration: none; }
.met-kicker { margin: 40px 0 14px; font-family: var(--font-mono); font-size: 12px; letter-spacing: .16em; text-transform: uppercase; color: var(--accent); }
.met-h1 { font-size: clamp(30px, 5vw, 52px); line-height: 1.08; font-weight: 800; letter-spacing: -0.02em; margin: 0; }
.met-lede { max-width: 640px; margin: 22px auto 0; font-size: 18px; line-height: 1.6; color: var(--muted); }
.met-lede a { color: var(--accent); text-decoration: none; }
.met-lede a:hover { text-decoration: underline; }
.met-scroll { display: inline-block; margin-top: 30px; font-family: var(--font-mono); font-size: 12px; letter-spacing: .12em; text-transform: uppercase; color: var(--faint); }

.met-film { max-width: 420px; margin: 36px auto 0; padding: 0 24px; }
.met-film-frame { border-radius: 0; overflow: hidden; background: var(--card-dark); padding: 10px; border: 1px solid var(--border); box-shadow: none; }
.met-film-frame video { display: block; width: 100%; height: auto; border-radius: 0; aspect-ratio: 9 / 16; background: #000; }
.met-film-cap { margin: 14px 4px 0; font-size: 13.5px; line-height: 1.5; color: var(--faint); text-align: center; }

.met-cta1 { max-width: 720px; margin: 34px auto 0; padding: 30px 24px 34px; text-align: center; background: var(--surface); border: 1px solid var(--line); border-radius: 0; box-shadow: none; }
.met-cta1-k { font-family: var(--font-mono); font-size: 12px; letter-spacing: .14em; text-transform: uppercase; color: var(--accent); margin: 0 0 10px; }
.met-cta1-h { font-size: clamp(19px, 2.6vw, 25px); font-weight: 800; letter-spacing: -0.018em; line-height: 1.2; margin: 0 0 22px; }
.met-flags { list-style: none; display: flex; align-items: flex-end; justify-content: space-between; gap: 6px; margin: 0 auto 24px; padding: 0; max-width: 440px; position: relative; }
.met-flags::before { content: ""; position: absolute; left: 6px; right: 6px; bottom: 7px; height: 2px; background: var(--dash); z-index: 0; }
.met-flag { position: relative; z-index: 1; display: flex; flex-direction: column; align-items: center; gap: 5px; color: var(--muted); }
.met-flag-ico { display: block; }
.met-flag-lv { font-family: var(--font-mono); font-size: 11px; font-weight: 700; letter-spacing: .04em; }
.met-flag.is-goal { color: var(--accent); }
.met-cta1-row { display: flex; gap: 12px; justify-content: center; flex-wrap: wrap; }
@media (max-width: 520px) { .met-cta1-h { font-size: 19px; } .met-flags { max-width: 100%; } }

.met-path { position: relative; max-width: 760px; margin: 48px auto 0; padding: 20px 24px 20px; }
.met-spine { position: absolute; left: 28px; top: 0; bottom: 0; width: 2px; transform: translateX(-50%); background: linear-gradient(var(--dash), var(--dash)); }
.met-step { position: relative; padding: 30px 0 30px 64px; }
.met-node { position: absolute; left: 28px; top: 32px; transform: translate(-50%, 0); width: 44px; height: 44px; border-radius: 50%; background: var(--surface); border: 2px solid var(--accent); color: var(--accent); font-family: var(--font-mono); font-size: 14px; font-weight: 700; display: grid; place-items: center; z-index: 2; box-shadow: none; }
.met-tag { margin: 0 0 10px; }
.met-ep { font-family: var(--font-mono); font-size: 12px; letter-spacing: .14em; text-transform: uppercase; color: var(--muted); }
.met-title { font-size: clamp(21px, 3vw, 28px); line-height: 1.15; font-weight: 800; letter-spacing: -0.015em; margin: 0 0 12px; }
.met-who { display: inline-flex; align-items: center; gap: 9px; font-family: var(--font-mono); font-size: 13px; color: var(--text); background: var(--surface); border: 1px solid var(--line-2); border-radius: 0; padding: 6px 13px 6px 7px; margin: 0 0 14px; }
.met-who-k { font-size: 10px; font-weight: 700; letter-spacing: .1em; text-transform: uppercase; color: var(--muted); background: var(--band); border-radius: 0; padding: 3px 8px; }
.met-who.shift { color: var(--accent); border-color: var(--tint-bd); background: var(--tint); font-weight: 600; }
.met-who.shift .met-who-k { color: #fff; background: var(--accent); }
.met-vo { font-size: 17px; line-height: 1.62; color: var(--text); opacity: .82; margin: 0; }

.met-next { max-width: 1000px; margin: 40px auto 0; padding: 56px 24px 0; text-align: center; }
.met-next-h { font-size: clamp(22px, 3.2vw, 30px); font-weight: 800; letter-spacing: -0.02em; margin: 0 0 12px; }
.met-next-p { font-size: 17px; line-height: 1.6; color: var(--muted); margin: 0 auto 30px; max-width: 540px; }
.met-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 14px; text-align: left; }
.met-card { background: var(--surface); border: 1px solid var(--line); border-radius: 0; padding: 18px 18px 20px; }
.met-card-soon { font-family: var(--font-mono); font-size: 10.5px; letter-spacing: .1em; text-transform: uppercase; color: var(--faint); }
.met-card-nom { font-size: 17px; font-weight: 700; letter-spacing: -0.01em; margin: 8px 0 5px; }
.met-card-sous { font-size: 14px; line-height: 1.5; color: var(--muted); margin: 0; }
@media (max-width: 760px) { .met-grid { grid-template-columns: 1fr; } }

.met-cta { max-width: 760px; margin: 20px auto 0; padding: 64px 24px 110px; text-align: center; }
.met-cta-h { font-size: clamp(24px, 3.6vw, 34px); font-weight: 800; letter-spacing: -0.02em; margin: 0 0 16px; }
.met-cta-p { font-size: 17px; line-height: 1.6; color: var(--muted); margin: 0 auto 28px; max-width: 600px; }
.met-cta-row { display: flex; gap: 14px; justify-content: center; flex-wrap: wrap; }
.met-btn { font-family: var(--font-mono); font-size: 13px; font-weight: 600; letter-spacing: .04em; padding: 13px 22px; border-radius: 0; text-decoration: none; }
.met-btn.primary { background: var(--accent); color: #fff; }
.met-btn.primary:hover { background: var(--accent-hover); }
.met-btn.ghost { background: transparent; color: var(--ink); border: 1px solid var(--line-2); }
.met-btn.ghost:hover { background: var(--band); }
`;
