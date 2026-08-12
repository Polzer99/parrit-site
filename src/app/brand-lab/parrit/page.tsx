import type { Metadata } from "next";
import Link from "next/link";
import Reveal from "../_components/Reveal";
import { Section, Wrap, Head, Stack, Slot, Cta } from "../_components/kit";
import { PROOFS } from "../_lib/proof";
import "./parrit.css";

export const metadata: Metadata = {
  title: "Parrit · Parrit Brand Lab",
  robots: { index: false, follow: false },
};

/*
 * DIRECTION PARRIT · Expansion. Mastery. Permanence.
 * Aman et Bang & Olufsen pour la retenue, Palantir pour la profondeur, Apple
 * comme étalon de simplicité produit.
 *
 * Deux règles structurelles, tenues sans exception :
 *   1. Aucun prix. L'échelle de croissance se lit sans montant.
 *   2. Le vocabulaire IA est absent. On parle travail, opérations, décisions,
 *      systèmes, résultats, capacité, autonomie.
 *
 * Les 10 heures n'apparaissent qu'à la toute fin, comme deux portes d'entrée.
 */

const FLOW = [
  { n: "01", name: "Signal", note: "Quelque chose bouge, dehors ou dedans. Aujourd'hui, personne ne le voit passer." },
  { n: "02", name: "Contexte", note: "Le signal est recoupé avec ce que l'entreprise sait déjà." },
  { n: "03", name: "Préparation", note: "Le travail est fait avant la réunion : trié, chiffré, mis en forme." },
  { n: "04", name: "Décision", note: "Une personne tranche. C'est le seul endroit où le système s'arrête et attend.", human: true },
  { n: "05", name: "Action", note: "Ce qui a été décidé part, avec sa trace et son auteur." },
  { n: "06", name: "Résultat", note: "L'effet revient dans le système, et corrige le tri de la fois suivante." },
];

const DOMAINS = [
  { k: "Finance", t: "La clôture, les comptes rendus, ce qui part aux investisseurs" },
  { k: "Commerce", t: "La préparation, le suivi, ce qui se perd entre deux relances" },
  { k: "Opérations", t: "Les enchaînements que tout le monde connaît et que personne n'a écrits" },
  { k: "Connaissance", t: "Ce que seule une personne sait, rendu disponible sans elle" },
  { k: "Direction", t: "Savoir ce que les systèmes ont produit, et qui a validé quoi" },
  { k: "Contenu", t: "Ce qui s'écrit dix fois par mois sous une forme légèrement différente" },
];

const LADDER = [
  { n: "I", t: "Un système", d: "Une chose bornée qui tourne sur des données réelles, avec ses validations." },
  { n: "II", t: "Une infrastructure dédiée", d: "Le socle sur lequel les suivants se posent sans être refaits." },
  { n: "III", t: "Une couche d'exploitation", d: "Plusieurs systèmes reliés, une seule manière de savoir ce qui s'est passé." },
  { n: "IV", t: "Super App", d: "L'entreprise pilote ses systèmes depuis une interface simple, y compris depuis un téléphone." },
];

export default function ParritPage() {
  return (
    <main className="t-parrit">
      {/* 1 · HERO */}
      <Section variant="flush">
        <Wrap size="wide">
          <div className="pr-hero">
            <Stack gap={6}>
              <span className="lab-label">Parrit</span>
              <h1 className="lab-h1">
                Nous transformons des problèmes opérationnels en systèmes qui
                fonctionnent.
              </h1>
            </Stack>
          </div>
        </Wrap>
        <div className="pr-hero__stage">
          <Wrap size="wide">
            <div className="lab-ui pr-stage">
              <div className="lab-ui__bar">
                <i className="lab-dot" style={{ color: "var(--signal)" }} aria-hidden />
                Ce matin
              </div>
              {[
                ["Trois choses ont bougé cette nuit", "triées, recoupées", "prêt"],
                ["Une demande attend une réponse", "réponse préparée, à relire", "humain"],
                ["La clôture du mois", "contrôles passés, un écart signalé", "attention"],
              ].map(([t, s, tag]) => (
                <div className="lab-ui__row" key={t}>
                  <i className="lab-dot" aria-hidden />
                  <span>
                    <strong>{t}</strong>
                    <br />
                    {s}
                  </span>
                  <span className="lab-ui__tag">{tag}</span>
                </div>
              ))}
            </div>
            <p className="pr-stage__cap">
              Schéma de principe. Aucune donnée réelle, aucun chiffre.
            </p>
          </Wrap>
        </div>
      </Section>

      {/* 2 · WATCH IT WORK */}
      <Section id="fonctionnement">
        <Wrap size="wide">
          <Head
            num="01"
            label="Watch it work"
            title="Du signal au résultat, avec une décision humaine au milieu."
            lead="Six étapes. Une seule s'arrête et attend quelqu'un. C'est celle qui rend le reste acceptable."
          />
          <div className="lab-flow">
            {FLOW.map((f) => (
              <div
                key={f.n}
                className={`lab-flow__node${f.human ? " lab-flow__node--human" : ""}`}
              >
                <span className="lab-flow__idx">{f.n}</span>
                <span className="lab-flow__name">{f.name}</span>
                <span className="lab-flow__note">{f.note}</span>
              </div>
            ))}
          </div>
          <div className="pr-watch">
            <Slot
              kind="MEDIA SLOT · ENREGISTREMENT REQUIS"
              what="Un enregistrement d'écran d'un système réel, du signal jusqu'au résultat, sans donnée client lisible. C'est la pièce qui manque le plus à cette page : la section explique, elle ne montre pas encore."
              ratio="21 / 9"
            />
          </div>
        </Wrap>
      </Section>

      {/* 3 · DOMAINES */}
      <Section id="domaines" variant="alt">
        <Wrap size="wide">
          <Head num="02" label="Where it applies" title="Là où le travail se répète, et où l'erreur coûte." />
          <div className="pr-domains">
            {DOMAINS.map((d, i) => (
              <Reveal key={d.k} delay={i * 60}>
                <div className="pr-domains__row">
                  <span className="pr-domains__k">{d.k}</span>
                  <span className="pr-domains__t">{d.t}</span>
                </div>
              </Reveal>
            ))}
          </div>
        </Wrap>
      </Section>

      {/* 4 · PREUVE */}
      <Section id="preuve">
        <Wrap size="wide">
          <Head
            num="03"
            label="Proof"
            title="Peu de cas. Ceux qui tiennent."
            lead="Aucun nom, aucun résultat non constaté. Quand une preuve s'arrête, c'est écrit."
          />
          <div className="pr-proofs">
            {PROOFS.filter((p) => p.level === "L5").map((p, i) => (
              <Reveal key={p.id} delay={i * 90}>
                <article className="pr-proof">
                  <div className="pr-proof__meta">
                    <span className="lab-label">{p.who}</span>
                    <span className="lab-proof__level">{p.level}</span>
                  </div>
                  <h3 className="pr-proof__title">{p.title}</h3>
                  <p className="pr-proof__before">{p.before}</p>
                  <p className="pr-proof__status">{p.status}</p>
                  {p.gap ? <p className="pr-proof__gap">{p.gap}</p> : null}
                </article>
              </Reveal>
            ))}
          </div>
        </Wrap>
      </Section>

      {/* 5 · ÉCHELLE */}
      <Section id="echelle" variant="deep">
        <Wrap size="wide">
          <Head
            num="04"
            label="Expansion"
            title="Ce que ça devient, si vous continuez."
            lead="Personne ne commence en IV. On ne vend pas non plus le IV à quelqu'un qui n'a pas fait le I."
          />
          <div className="pr-ladder">
            {LADDER.map((l, i) => (
              <Reveal key={l.n} delay={i * 90}>
                <div className="pr-ladder__row">
                  <span className="pr-ladder__n">{l.n}</span>
                  <div>
                    <h3 className="pr-ladder__t">{l.t}</h3>
                    <p className="pr-ladder__d">{l.d}</p>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
          <p className="pr-ladder__note">
            Aucun montant sur cette page. Ce qui se décide ici se décide en parlant, une
            fois le périmètre écrit.
          </p>
        </Wrap>
      </Section>

      {/* 6 · SUPER APP */}
      <Section id="superapp">
        <Wrap size="wide">
          <div className="pr-app">
            <Stack gap={5}>
              <span className="lab-num">05</span>
              <span className="lab-label">Super App</span>
              <h2 className="lab-h2">
                Une entreprise qui tient ses systèmes dans une main.
              </h2>
              <p className="lab-body">
                Pas un tableau de bord de plus. Une seule surface où l&apos;on voit ce qui
                a tourné, ce qui attend une décision, et ce qui est parti au nom de qui.
                Le reste est en dessous, et n&apos;a pas besoin d&apos;être vu.
              </p>
              <p className="lab-body">
                C&apos;est la destination. Elle ne se vend pas au premier rendez-vous.
              </p>
            </Stack>
            <div className="pr-app__device">
              <Slot
                kind="MEDIA SLOT · CAPTURES MOBILE"
                what="Captures de l'application mobile déployée. Elles existent probablement hors de ce dépôt. Sans elles, la destination reste une phrase au lieu d'une image, et c'est le point faible de cette page."
                ratio="9 / 19"
              />
            </div>
          </div>
        </Wrap>
      </Section>

      {/* 7 · DEUX PORTES */}
      <Section id="entrer" variant="alt">
        <Wrap size="wide">
          <Head
            num="06"
            label="Start with us"
            title="Deux manières d'entrer. Le même point de départ."
            lead="Dix heures, sur votre travail réel. Vous choisissez avec qui."
          />
          <div className="pr-doors">
            <Reveal>
              <article className="pr-door">
                <span className="lab-label">Paul</span>
                <h3 className="pr-door__t">
                  Vous voulez construire, et comprendre comment c&apos;est fait.
                </h3>
                <p className="lab-card__body">
                  Systèmes, décisions, exécution. On entre dans le problème et on le fait
                  avancer pendant la séance.
                </p>
                <Link className="lab-btn lab-btn--ghost" href="/brand-lab/paul">
                  Build with Paul
                </Link>
              </article>
            </Reveal>
            <Reveal delay={90}>
              <article className="pr-door">
                <span className="lab-label">Maxime</span>
                <h3 className="pr-door__t">
                  Vous voulez d&apos;abord comprendre, sans vous sentir largué.
                </h3>
                <p className="lab-card__body">
                  On part de votre semaine, on avance à votre rythme, et on construit
                  quand même quelque chose de réel.
                </p>
                <Link className="lab-btn lab-btn--ghost" href="/brand-lab/maxime">
                  Apprendre avec Maxime
                </Link>
              </article>
            </Reveal>
          </div>
          <div className="pr-final">
            <Cta href="/brand-lab/paul" variant="primary" size="lg">
              Commencer
            </Cta>
          </div>
        </Wrap>
      </Section>

      <footer className="lab-foot">
        <Wrap size="wide">
          Parrit Brand Lab · direction Parrit · interne, non public · aucun prix affiché
        </Wrap>
      </footer>
    </main>
  );
}
