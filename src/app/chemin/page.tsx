import Link from "next/link";

const SITE_URL = "https://parrit.ai";

type Visual =
  | { kind: "shot"; src: string; alt: string }
  | { kind: "svg" };

type Step = {
  n: string;
  level: string;
  banane: string;
  title: string;
  mode: string; // « qui fait le travail » — la colonne qui fait comprendre ce qu'est un agent
  shift?: boolean; // le palier où le travail bascule vers la machine
  vo: string;
  caption: string;
  href: string;
  cta: string;
  visual: Visual;
};

// Voix off prête pour la VSL : on lit le chemin de haut en bas, une phrase par palier.
const STEPS: Step[] = [
  {
    n: "01",
    level: "N1",
    banane: "L'éveil",
    title: "Tout commence par une conversation",
    mode: "Vous parlez · ça répond",
    vo: "Au début, on parle. On pose une question à l'écran, il répond. C'est le premier réflexe, et c'est utile. Mais gardez ça en tête pour la suite : à ce stade, l'IA répond. Elle n'agit pas encore.",
    caption: "Le chat. La première fois qu'on demande, et que la machine comprend.",
    href: "/fr/masterclass-ia",
    cta: "Découvrir le palier 1",
    visual: { kind: "shot", src: "/chemin/01-chat.png", alt: "Écran de conversation : « Bonsoir, Paul. Comment puis-je vous aider ? »" },
  },
  {
    n: "02",
    level: "N2",
    banane: "L'usage",
    title: "On range l'IA par métier",
    mode: "Vous parlez · ça se souvient",
    vo: "Très vite, une conversation ne suffit plus. On crée un espace par sujet, par métier : la longévité, l'automatisation interne, un projet client. Chaque équipe retrouve son contexte au lieu de tout réexpliquer.",
    caption: "Les projets. Un espace de travail par métier, avec sa mémoire.",
    href: "/fr/masterclass-metier",
    cta: "Découvrir le palier 2",
    visual: { kind: "shot", src: "/chemin/02-projets.png", alt: "Liste de projets : Longévité, Interne automation, SAP, LinkedIn, Build AI custom project, Chatbot" },
  },
  {
    n: "03",
    level: "N3",
    banane: "L'action",
    title: "On lui branche vos outils",
    mode: "Vous parlez · ça atteint vos outils",
    vo: "L'IA seule est aveugle. On la connecte à vos logiciels : la boîte mail, l'agenda, les fichiers, le navigateur. À partir de là, elle ne se contente plus de répondre, elle peut aller chercher et préparer le terrain.",
    caption: "Les connexions. Gmail, Calendar, Drive, le navigateur : tout devient accessible.",
    href: "/fr/sessions-mcp",
    cta: "Découvrir le palier 3",
    visual: { kind: "shot", src: "/chemin/03-mcp.png", alt: "Menu de connecteurs : Canva, Gmail, Google Calendar, Google Drive, Claude in Chrome, Control Chrome" },
  },
  {
    n: "04",
    level: "N4",
    banane: "Le diagnostic",
    title: "On cartographie votre terrain",
    mode: "Vous décidez quoi lui confier",
    vo: "Avant de construire, on dresse la carte. Reporting, CRM tenu à jour tout seul, production de logiciels, contenu, alerting, veille des signaux faibles, et la mémoire de toute l'entreprise au même endroit. L'IA vient se brancher directement dans vos process, PME comme grand groupe. On voit tout le terrain d'un coup, et on choisit par où commencer.",
    caption: "La cartographie. L'IA branchée directement dans vos process.",
    href: "/fr/audit",
    cta: "Découvrir le palier 4",
    visual: { kind: "svg" },
  },
  {
    n: "05",
    level: "N5",
    banane: "Le déploiement",
    title: "Un premier agent prend la main",
    mode: "Il agit seul, en continu",
    shift: true,
    vo: "C'est ici que le mot « agent » prend tout son sens. Ce n'est plus une IA qui répond quand on lui parle : c'est une IA qui fait. Un flux qui revient tout le temps, l'agent le traite semaine après semaine, sans qu'on lui redemande. Il prépare, il trace, et il escalade les cas sensibles à un humain.",
    caption: "Le premier agent. Il travaille tout seul, même quand vous n'êtes pas là.",
    href: "/fr/deploiement-agents",
    cta: "Découvrir le palier 5",
    visual: { kind: "shot", src: "/chemin/05-agent-n8n.png", alt: "Diagramme d'un agent : déclencheur, conditions, modèle, envoi de réponse, connexions multiples" },
  },
  {
    n: "06",
    level: "N6",
    banane: "L'autonomie",
    title: "Vos équipes construisent elles-mêmes",
    mode: "Vos équipes en fabriquent",
    vo: "On passe la main. Avec les bons outils, vos équipes métier ne dépendent plus d'un prestataire pour chaque idée. Elles cadrent, elles testent, elles livrent leurs propres agents internes.",
    caption: "Claude Code et Codex. On décrit, l'agent écrit le code, on relit, on livre.",
    href: "/fr/outils-agentiques",
    cta: "Découvrir le palier 6",
    visual: { kind: "shot", src: "/chemin/06-claude-code.png", alt: "Claude Code au travail dans le terminal : récap du chantier en cours et raisonnement de l'agent" },
  },
  {
    n: "07",
    level: "N7",
    banane: "La gouvernance",
    title: "Une flotte qui travaille seule",
    mode: "Ils tournent sans vous",
    shift: true,
    vo: "Au bout du chemin, ce ne sont plus un ou deux agents, c'est une flotte. On la pilote, on traite la dette technique, on maîtrise les coûts, et on installe les boucles qui la font s'améliorer toute seule.",
    caption: "La flotte. Tous les agents en production, d'un seul coup d'œil.",
    href: "/fr/optimisation-flotte",
    cta: "Découvrir le palier 7",
    visual: { kind: "shot", src: "/chemin/07-flotte.png", alt: "Cartographie de la flotte Parrit : agents d'acquisition, de closing et de livraison posés sur un socle commun" },
  },
];

// La cartographie « parle aux entreprises » — PME comme grands groupes : les territoires concrets que l'IA couvre.
const TERRITOIRES: { nom: string; sous: string; chips: string[]; wide?: boolean }[] = [
  { nom: "Production de logiciel", sous: "Sites, outils internes, intégrations sur mesure", chips: ["Sites web", "Outils internes", "Intégrations"] },
  { nom: "Reporting", sous: "Vos chiffres synthétisés, chaque matin", chips: ["Tableaux de bord", "Synthèses", "KPIs"] },
  { nom: "Remplissage du CRM", sous: "Des fiches à jour, sans saisie manuelle", chips: ["Notes d'appel", "Suivi auto", "Données propres"] },
  { nom: "Création de contenu", sous: "Ce que vous publiez, produit en série", chips: ["Articles", "Vidéos", "Newsletters"] },
  { nom: "Alerting", sous: "Être prévenu au bon moment, automatiquement", chips: ["Deals qui bougent", "Clients à risque", "Événements"] },
  { nom: "Veille des signaux faibles", sous: "Le bruit utile : clients, prospects, marché", chips: ["Vos clients", "Vos prospects", "Le marché"] },
  { nom: "Second cerveau de l'entreprise", sous: "Toute la connaissance interne, à jour et accessible à chaque équipe", chips: ["Mémoire partagée", "Procédures", "Recherche interne"], wide: true },
];

function Cartographie() {
  // Carte des territoires métier (HTML, DA Parrit) : on contrôle la charte, pas une image AI.
  return (
    <div className="cmap" role="img" aria-label="Cartographie des territoires que l'IA peut couvrir : production de logiciel, reporting, CRM, création de contenu, alerting, veille des signaux faibles, second cerveau de l'entreprise">
      <div className="cmap-hub">L&apos;IA, branchée directement dans vos process · PME comme grand groupe</div>
      <div className="cmap-grid">
        {TERRITOIRES.map((t) => (
          <div className={`cmap-zone ${t.wide ? "wide" : ""}`} key={t.nom}>
            <p className="cmap-nom">{t.nom}</p>
            <p className="cmap-sous">{t.sous}</p>
            <div className="cmap-chips">
              {t.chips.map((c) => (
                <span className="cmap-chip" key={c}>{c}</span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function CheminPage() {
  const itemList = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: "Le chemin de l'IA — 7 paliers de maturité",
    itemListElement: STEPS.map((s, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: s.title,
      url: `${SITE_URL}${s.href}`,
    })),
  };

  return (
    <main className="chemin">
      <style>{CSS}</style>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(itemList) }} />

      <header className="chemin-hero">
        <Link href="/fr" className="chemin-back">Parrit.ai</Link>
        <p className="chemin-kicker">De l'IA générative à l'IA agentique</p>
        <h1 className="chemin-h1">On vous emmène jusqu'à l'IA<br />qui agit pour vous.</h1>
        <p className="chemin-lede">
          Tout le monde parle d'« agents IA ». Voici, concrètement, le chemin pour y arriver : du premier chat à
          une flotte qui travaille seule. Descendez palier par palier, regardez qui fait le travail, et ouvrez
          chaque étape pour des exemples parlants.
        </p>
        <span className="chemin-scroll">Descendez le chemin ↓</span>
      </header>

      <div className="chemin-path">
        <span className="chemin-spine" aria-hidden />
        {STEPS.map((s, i) => (
          <section className={`chemin-step ${i % 2 === 0 ? "is-left" : "is-right"}`} key={s.n}>
            <span className="chemin-node" aria-hidden>{s.n}</span>

            <div className="chemin-visual">
              <div className={`chemin-frame ${s.visual.kind === "svg" ? "is-svg" : ""}`}>
                {s.visual.kind === "shot" ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={s.visual.src} alt={s.visual.alt} loading="lazy" />
                ) : (
                  <Cartographie />
                )}
              </div>
              <p className="chemin-caption">{s.caption}</p>
            </div>

            <div className="chemin-copy">
              <p className="chemin-tag">
                <span className="chemin-lv">{s.level}</span>
                <span className="chemin-banane">{s.banane}</span>
              </p>
              <h2 className="chemin-title">
                <Link href={s.href}>{s.title}</Link>
              </h2>
              <p className={`chemin-mode ${s.shift ? "shift" : ""}`}>
                <span className="chemin-mode-k">Le travail</span>
                {s.mode}
              </p>
              <p className="chemin-vo">{s.vo}</p>
              <Link href={s.href} className="chemin-link">{s.cta} →</Link>
            </div>
          </section>
        ))}
      </div>

      <footer className="chemin-cta">
        <h2 className="chemin-cta-h">Vous êtes quelque part sur ce chemin.</h2>
        <p className="chemin-cta-p">
          Vos équipes sont probablement réparties sur plusieurs de ces paliers à la fois. On commence par poser
          votre niveau réel, puis on déploie la bonne marche, pour les bonnes personnes.
        </p>
        <div className="chemin-cta-row">
          <a className="chemin-btn primary" href="mailto:paul.larmaraud@parrit.ai?subject=Le%20chemin%20de%20l'IA">Demander l'audit de transformation</a>
          <Link className="chemin-btn ghost" href="/fr">Voir Parrit.ai</Link>
        </div>
      </footer>
    </main>
  );
}

const CSS = `
.chemin { background: var(--bg); color: var(--ink); }
.chemin-hero { max-width: 880px; margin: 0 auto; padding: 88px 24px 24px; text-align: center; }
.chemin-back { font-family: var(--font-mono); font-size: 12px; letter-spacing: .14em; text-transform: uppercase; color: var(--muted); text-decoration: none; }
.chemin-kicker { margin: 40px 0 14px; font-family: var(--font-mono); font-size: 12px; letter-spacing: .16em; text-transform: uppercase; color: var(--accent); }
.chemin-h1 { font-size: clamp(30px, 5vw, 52px); line-height: 1.08; font-weight: 800; letter-spacing: -0.02em; margin: 0; }
.chemin-lede { max-width: 660px; margin: 22px auto 0; font-size: 18px; line-height: 1.6; color: var(--muted); }
.chemin-scroll { display: inline-block; margin-top: 30px; font-family: var(--font-mono); font-size: 12px; letter-spacing: .12em; text-transform: uppercase; color: var(--faint); }

.chemin-path { position: relative; max-width: 1120px; margin: 40px auto 0; padding: 20px 24px 40px; }
.chemin-spine { position: absolute; left: 50%; top: 0; bottom: 0; width: 2px; transform: translateX(-50%); background: linear-gradient(var(--dash), var(--dash)); }

.chemin-step { position: relative; display: grid; grid-template-columns: 1fr 1fr; gap: 56px; align-items: center; padding: 56px 0; }
.chemin-step.is-right .chemin-visual { order: 2; }
.chemin-step.is-right .chemin-copy { order: 1; text-align: right; }
.chemin-step.is-right .chemin-tag { justify-content: flex-end; }

.chemin-node { position: absolute; left: 50%; top: 56px; transform: translate(-50%, -4px); width: 46px; height: 46px; border-radius: 50%; background: var(--surface); border: 2px solid var(--accent); color: var(--accent); font-family: var(--font-mono); font-size: 15px; font-weight: 700; display: grid; place-items: center; z-index: 2; box-shadow: var(--shadow-sm); }

.chemin-frame { border-radius: 16px; overflow: hidden; background: var(--card-dark); padding: 12px; border: 1px solid var(--border); box-shadow: var(--shadow-lg); }
.chemin-frame.is-svg { background: var(--surface); padding: 22px; }
.chemin-frame img { display: block; width: 100%; height: auto; border-radius: 8px; }
.chemin-caption { margin: 14px 2px 0; font-size: 13.5px; line-height: 1.5; color: var(--faint); }

.chemin-tag { display: flex; align-items: center; gap: 10px; margin: 0 0 14px; }
.chemin-lv { font-family: var(--font-mono); font-size: 12px; font-weight: 700; letter-spacing: .08em; color: #fff; background: var(--accent); padding: 3px 8px; border-radius: 6px; }
.chemin-banane { font-family: var(--font-mono); font-size: 12px; letter-spacing: .14em; text-transform: uppercase; color: var(--muted); }
.chemin-title { font-size: clamp(22px, 3vw, 30px); line-height: 1.15; font-weight: 800; letter-spacing: -0.015em; margin: 0 0 14px; }
.chemin-title a { color: inherit; text-decoration: none; transition: color .15s ease; }
.chemin-title a:hover { color: var(--accent); }
.chemin-mode { display: inline-flex; align-items: center; gap: 9px; font-family: var(--font-mono); font-size: 13px; letter-spacing: .01em; color: var(--text); background: var(--surface); border: 1px solid var(--line-2); border-radius: 999px; padding: 6px 13px 6px 7px; margin: 0 0 16px; }
.chemin-mode-k { font-size: 10px; font-weight: 700; letter-spacing: .1em; text-transform: uppercase; color: var(--muted); background: var(--band); border-radius: 999px; padding: 3px 8px; }
.chemin-mode.shift { color: var(--accent); border-color: var(--tint-bd); background: var(--tint); font-weight: 600; }
.chemin-mode.shift .chemin-mode-k { color: #fff; background: var(--accent); }
.chemin-step.is-right .chemin-mode { flex-direction: row-reverse; }

.cmap { width: 100%; }
.cmap-hub { font-family: var(--font-mono); font-size: 11.5px; letter-spacing: .04em; color: #fff; background: var(--accent); border-radius: 8px; padding: 9px 12px; text-align: center; margin-bottom: 12px; }
.cmap-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; }
.cmap-zone { background: var(--bg); border: 1px solid var(--line); border-radius: 12px; padding: 12px 13px; }
.cmap-zone.wide { grid-column: 1 / -1; background: var(--tint); border-color: var(--tint-bd); }
.cmap-nom { font-size: 14.5px; font-weight: 700; letter-spacing: -0.01em; margin: 0 0 3px; }
.cmap-zone.wide .cmap-nom { color: var(--accent); }
.cmap-sous { font-family: var(--font-mono); font-size: 10.5px; line-height: 1.4; color: var(--muted); margin: 0 0 9px; }
.cmap-chips { display: flex; flex-wrap: wrap; gap: 6px; }
.cmap-chip { font-family: var(--font-mono); font-size: 10.5px; color: var(--text); background: var(--surface); border: 1px solid var(--line); border-radius: 999px; padding: 3px 9px; }
@media (max-width: 520px) { .cmap-grid { grid-template-columns: 1fr; } }
.chemin-vo { font-size: 17px; line-height: 1.62; color: var(--text); opacity: .82; margin: 0 0 18px; }
.chemin-link { font-family: var(--font-mono); font-size: 13px; font-weight: 600; letter-spacing: .04em; color: var(--accent); text-decoration: none; border-bottom: 1px solid var(--tint-bd); padding-bottom: 2px; }
.chemin-link:hover { border-color: var(--accent); }

.chemin-cta { max-width: 760px; margin: 30px auto 0; padding: 64px 24px 110px; text-align: center; }
.chemin-cta-h { font-size: clamp(24px, 3.6vw, 34px); font-weight: 800; letter-spacing: -0.02em; margin: 0 0 16px; }
.chemin-cta-p { font-size: 17px; line-height: 1.6; color: var(--muted); margin: 0 auto 28px; max-width: 600px; }
.chemin-cta-row { display: flex; gap: 14px; justify-content: center; flex-wrap: wrap; }
.chemin-btn { font-family: var(--font-mono); font-size: 13px; font-weight: 600; letter-spacing: .04em; padding: 13px 22px; border-radius: 10px; text-decoration: none; }
.chemin-btn.primary { background: var(--accent); color: #fff; }
.chemin-btn.primary:hover { background: var(--accent-hover); }
.chemin-btn.ghost { background: transparent; color: var(--ink); border: 1px solid var(--line-2); }
.chemin-btn.ghost:hover { background: var(--band); }

@media (max-width: 760px) {
  .chemin-spine { left: 22px; }
  .chemin-step { grid-template-columns: 1fr; gap: 18px; padding: 28px 0 28px 52px; }
  .chemin-step.is-right .chemin-visual,
  .chemin-step.is-right .chemin-copy { order: initial; text-align: left; }
  .chemin-step.is-right .chemin-tag { justify-content: flex-start; }
  .chemin-node { left: 22px; top: 30px; width: 38px; height: 38px; font-size: 13px; }
}
`;
