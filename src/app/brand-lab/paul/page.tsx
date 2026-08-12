import type { Metadata } from "next";
import Reveal from "../_components/Reveal";
import { Section, Wrap, Head, Stack, Slot, Cta, Badge } from "../_components/kit";
import { OFFER, METHOD, ARC, MATERIAL, price } from "../_lib/offer";
import { PROOFS } from "../_lib/proof";
import "./paul.css";

export const metadata: Metadata = {
  title: "Paul · Parrit Brand Lab",
  robots: { index: false, follow: false },
};

/*
 * DIRECTION PAUL · Reason. Conquest. Systems. 0 vers 1.
 * Palantir et Linear pour la tenue, Wispr Flow pour la simplicité de l'action.
 *
 * Le pari de composition : le visage arrive tard et petit. Ce qui porte la
 * confiance, c'est la manière de penser, les systèmes montrés, les critères de
 * décision. Le prix est visible au-dessus de la ligne de flottaison.
 */

const HEADLINES = [
  { key: "A", text: "De perdu à autonome. En construisant sur votre vrai travail." },
  { key: "B", text: "Apprenez en construisant ce dont votre entreprise a besoin." },
  { key: "C", text: "10 heures pour comprendre, construire, et travailler autrement." },
];

export default function PaulPage() {
  return (
    <main className="t-paul">
      {/* 1 · HERO */}
      <Section variant="flush">
        <Wrap size="wide">
          <div className="paul-hero">
            <div className="paul-hero__text">
              <Stack gap={5}>
                <span className="lab-label lab-label--signal">Build with Paul</span>
                <h1 className="lab-h1">{HEADLINES[0].text}</h1>
                <p className="lab-lead">
                  Dix heures avec vous, sur vos propres dossiers. À la fin, une chose
                  fonctionne, et vous savez pourquoi.
                </p>
                <div className="paul-hero__price">
                  <div className="lab-price">
                    <span className="lab-price__amount">{price.amount}</span>
                    <span className="lab-price__unit">
                      {price.unit} · {OFFER.hours} heures
                    </span>
                  </div>
                </div>
                <div className="lab-cta-row">
                  <Cta href="#offre" variant="primary" size="lg">
                    Réserver les 10 heures
                  </Cta>
                  <Cta href="#travail" variant="ghost">
                    Voir sur quoi on travaille
                  </Cta>
                </div>
                <p className="paul-hero__note">
                  Un appel de 30 minutes avant de décider quoi que ce soit. Si votre sujet
                  ne mérite pas d&apos;être construit, je vous le dis à ce moment-là.
                </p>
              </Stack>
            </div>

            <div className="paul-hero__ui">
              <div className="lab-ui">
                <div className="lab-ui__bar">
                  <i className="lab-dot" style={{ color: "var(--signal)" }} aria-hidden />
                  Session 03 · construction en direct
                </div>
                {[
                  { t: "Votre export mensuel", s: "lu, structuré", tag: "fait" },
                  { t: "Les règles que vous appliquez à la main", s: "écrites, relues par vous", tag: "fait" },
                  { t: "Le contrôle avant envoi", s: "bloque si un total ne retombe pas", tag: "actif" },
                  { t: "Le document final", s: "attend votre signature", tag: "humain" },
                ].map((r) => (
                  <div className="lab-ui__row" key={r.t}>
                    <i className="lab-dot" aria-hidden />
                    <span>
                      <strong>{r.t}</strong>
                      <br />
                      {r.s}
                    </span>
                    <span className="lab-ui__tag">{r.tag}</span>
                  </div>
                ))}
              </div>
              <p className="paul-hero__cap">
                Schéma de principe. Aucune donnée client, aucun chiffre réel.
              </p>
            </div>
          </div>
        </Wrap>
      </Section>

      {/* 2 · CE QU'ON FAIT VRAIMENT ENSEMBLE */}
      <Section id="ensemble">
        <Wrap size="wide">
          <Head
            num="01"
            label="What we actually do together"
            title="On ne parle pas d'IA pendant dix heures. On construit une chose qui vous sert."
            lead="La plupart des gens arrivent avec la même phrase : « j'ai bien compris qu'il se passe quelque chose, je ne sais pas quoi en faire chez moi ». Le travail commence là, pas sur un catalogue d'outils."
          />
          <div className="lab-grid lab-grid--3">
            {[
              {
                t: "On part de votre travail réel",
                b: "Vos fichiers, vos dossiers, vos allers-retours. Pas un cas d'école, pas un jeu de données de démonstration.",
              },
              {
                t: "On choisit un seul sujet",
                b: "Tout ne mérite pas d'être automatisé. Dire non à un sujet fait partie du travail, et c'est souvent la partie qui vous fait gagner du temps.",
              },
              {
                t: "Vous gardez la main",
                b: "Vous voyez ce qui est construit, ligne à ligne si vous voulez. Rien ne part vers l'extérieur sans que vous ayez relu.",
              },
            ].map((c, i) => (
              <Reveal key={c.t} delay={i * 60}>
                <article className="lab-card">
                  <span className="lab-num">{String(i + 1).padStart(2, "0")}</span>
                  <h3 className="lab-card__title">{c.t}</h3>
                  <p className="lab-card__body">{c.b}</p>
                </article>
              </Reveal>
            ))}
          </div>

          <div className="paul-isnot">
            <span className="lab-label">Ce que ce n&apos;est pas</span>
            <div className="paul-isnot__row">
              {OFFER.isNot.map((x) => (
                <span key={x} className="paul-isnot__item">
                  {x}
                </span>
              ))}
            </div>
          </div>
        </Wrap>
      </Section>

      {/* 3 · VOTRE MATIÈRE */}
      <Section id="travail" variant="deep">
        <Wrap size="wide">
          <Head
            num="02"
            label="Start with your real work"
            title="On travaille sur ce que vous avez déjà sous la main."
            lead="Vous n'avez rien à préparer. La matière existe : c'est ce qui vous prend du temps toutes les semaines."
          />
          <div className="paul-matter">
            {MATERIAL.map((m, i) => (
              <Reveal key={m.k} delay={i * 40}>
                <div className="paul-matter__row">
                  <span className="paul-matter__k">{m.k}</span>
                  <span className="paul-matter__v">{m.v}</span>
                </div>
              </Reveal>
            ))}
          </div>
        </Wrap>
      </Section>

      {/* 4 · PREUVES */}
      <Section id="preuves">
        <Wrap size="wide">
          <Head
            num="03"
            label="Selected builds"
            title="Ce qui a été construit, et jusqu'où ça va vraiment."
            lead="Aucun nom de client. Aucun résultat que nous n'ayons pas constaté. Quand une preuve s'arrête, la fiche le dit."
          />
          <div className="paul-proofs">
            {PROOFS.slice(0, 3).map((p, i) => (
              <Reveal key={p.id} delay={i * 70}>
                <article className="lab-proof">
                  <div className="lab-proof__head">
                    <span className="lab-label">{p.who}</span>
                    <span className="lab-proof__level">niveau de preuve {p.level}</span>
                  </div>
                  <h3 className="lab-card__title">{p.title}</h3>
                  <p className="lab-card__body">{p.before}</p>
                  <ul className="lab-proof__facts">
                    {p.built.map((b) => (
                      <li key={b}>
                        <span>{b}</span>
                      </li>
                    ))}
                  </ul>
                  <div className="paul-proofs__foot">
                    <Badge>{p.status}</Badge>
                    {p.gap ? <p className="paul-proofs__gap">{p.gap}</p> : null}
                  </div>
                </article>
              </Reveal>
            ))}
            <Slot
              kind="PROOF SLOT · PRIMARY EVIDENCE REQUIRED"
              what="Une capture réelle d'un système en fonctionnement, autorisée par le client ou floutée. Aucune capture publiable n'existe aujourd'hui dans le dépôt. Tant qu'elle manque, cet emplacement reste vide plutôt que rempli."
            />
          </div>
        </Wrap>
      </Section>

      {/* 5 · COMMENT PAUL PENSE */}
      <Section id="pensee" variant="alt">
        <Wrap size="wide">
          <div className="lab-split lab-split--wide-right">
            <Stack gap={5}>
              <span className="lab-num">04</span>
              <span className="lab-label">How Paul thinks</span>
              <h2 className="lab-h2">
                Les critères existent avant la conversation. Ils ne sont pas improvisés
                devant vous.
              </h2>
              <p className="lab-body">
                Six critères écrits décident de ce qu&apos;on construit en premier. Ils
                servent autant à écarter un sujet qu&apos;à en retenir un.
              </p>
              <div className="paul-face">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src="/team/paul-portrait.jpg" alt="Paul Larmaraud" loading="lazy" />
                <span>
                  Paul Larmaraud
                  <br />
                  <span className="lab-label">Parrit.ai</span>
                </span>
              </div>
            </Stack>

            <div className="paul-criteria">
              {[
                ["Pénibilité", "est-ce que ça use quelqu'un chaque semaine"],
                ["Temps passé", "combien d'heures, et prises à qui"],
                ["Technicité", "est-ce que les règles peuvent s'écrire"],
                ["Accès à la donnée", "est-ce que la matière est disponible maintenant"],
                ["Réversibilité", "est-ce qu'une erreur se rattrape"],
                ["Place de l'humain", "où faut-il que quelqu'un relise et signe"],
              ].map(([k, v], i) => (
                <Reveal key={k} delay={i * 50}>
                  <div className="paul-criteria__row">
                    <span className="lab-num">{String(i + 1).padStart(2, "0")}</span>
                    <span className="paul-criteria__k">{k}</span>
                    <span className="paul-criteria__v">{v}</span>
                  </div>
                </Reveal>
              ))}
              <p className="paul-criteria__rule">
                La règle : on construit ce qui est répétitif, fréquent, à règles claires,
                avec des données disponibles, et où une erreur se rattrape. Le rare, le
                nouveau et le jugement restent à vous.
              </p>
            </div>
          </div>
        </Wrap>
      </Section>

      {/* 6 · LES 10 HEURES */}
      <Section id="methode">
        <Wrap size="wide">
          <Head
            num="05"
            label="How the 10 hours work"
            title="Six mouvements. Pas un programme scolaire."
            lead="Ils ne durent pas tous pareil. Certains prennent vingt minutes, d'autres trois heures. L'ordre, lui, ne change pas."
          />
          <div className="lab-ladder">
            {METHOD.map((m, i) => (
              <div className="lab-ladder__step" key={m.key}>
                <span className="lab-num">{String(i + 1).padStart(2, "0")}</span>
                <div>
                  <h3 className="lab-card__title">
                    {m.label} <span className="paul-method__fr">{m.fr}</span>
                  </h3>
                  <p className="lab-card__body">{m.line}</p>
                </div>
              </div>
            ))}
          </div>
        </Wrap>
      </Section>

      {/* 7 · L'AUTONOMIE APRÈS */}
      <Section id="autonomie" variant="deep">
        <Wrap size="wide">
          <Head
            num="06"
            label="What autonomy means afterwards"
            title="Le vrai produit, ce n'est pas le système. C'est ce que vous savez faire après."
            lead="On vise un point précis : que vous n'ayez plus besoin de nous pour les petits sujets. C'est ce qui rend la suite possible, sur les gros."
          />
          <div className="paul-arc">
            {ARC.map((a, i) => (
              <Reveal key={a.state} delay={i * 60}>
                <div className={`paul-arc__step${i === ARC.length - 1 ? " is-last" : ""}`}>
                  <span className="lab-num">{String(i + 1).padStart(2, "0")}</span>
                  <h3 className="paul-arc__state">{a.state}</h3>
                  <p className="paul-arc__line">{a.line}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </Wrap>
      </Section>

      {/* 8 · OFFRE */}
      <Section id="offre">
        <Wrap size="wide">
          <div className="paul-offer">
            <Stack gap={5}>
              <span className="lab-num">07</span>
              <h2 className="lab-h2">Build with Paul</h2>
              <p className="lab-body">{OFFER.format}</p>
              <ul className="lab-proof__facts">
                {OFFER.outcomes.map((o) => (
                  <li key={o}>
                    <span>{o}</span>
                  </li>
                ))}
              </ul>
            </Stack>
            <div className="paul-offer__box">
              <div className="lab-price">
                <span className="lab-price__amount">{price.amount}</span>
                <span className="lab-price__unit">{price.unit}</span>
              </div>
              <p className="lab-card__body">
                {OFFER.hours} heures, réparties selon votre rythme. Un appel de 30 minutes
                avant, sans engagement, pour vérifier qu&apos;il y a un sujet.
              </p>
              <Cta href="#offre" variant="primary" size="lg">
                Réserver les 10 heures
              </Cta>
              <Cta href="#offre" variant="ghost">
                Parler 30 minutes d&apos;abord
              </Cta>
            </div>
          </div>
        </Wrap>
      </Section>

      {/* 9 · CTA FINAL */}
      <Section variant="alt">
        <Wrap size="text">
          <Stack gap={5}>
            <h2 className="lab-h2">
              Dites-moi ce qui vous prend du temps. On regarde si ça vaut le coup de le
              construire.
            </h2>
            <div className="lab-cta-row">
              <Cta href="#offre" variant="primary" size="lg">
                Réserver les 10 heures
              </Cta>
            </div>
          </Stack>
        </Wrap>
      </Section>

      {/* Bandeau d'arbitrage : visible dans le lab, jamais dans une page publique. */}
      <Section variant="flush">
        <Wrap size="wide">
          <div className="paul-variants">
            <span className="lab-label">Variantes de titre à arbitrer</span>
            {HEADLINES.map((h) => (
              <div key={h.key} className="paul-variants__row">
                <span className="lab-num">{h.key}</span>
                <span>{h.text}</span>
                {h.key === "A" ? <Badge>affichée</Badge> : null}
              </div>
            ))}
            <p className="lab-card__body">
              Le prix affiché vient de <code>_lib/offer.ts</code>. Deux ancrages sont
              câblés, {price.amount} et la variante psychologique. Aucun composant ne
              connaît le montant.
            </p>
          </div>
        </Wrap>
      </Section>

      <footer className="lab-foot">
        <Wrap size="wide">Parrit Brand Lab · direction Paul · interne, non public</Wrap>
      </footer>
    </main>
  );
}
