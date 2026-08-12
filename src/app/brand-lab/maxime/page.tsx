import type { Metadata } from "next";
import Reveal from "../_components/Reveal";
import { Section, Wrap, Head, Stack, Slot, Cta, Card } from "../_components/kit";
import { OFFER, METHOD, ARC, price } from "../_lib/offer";
import "./maxime.css";

export const metadata: Metadata = {
  title: "Maxime · Parrit Brand Lab",
  robots: { index: false, follow: false },
};

/*
 * DIRECTION MAXIME · Heart. Confidence. Learning. Progress.
 *
 * Mécanique des marques personnelles, registre d'un dirigeant. Le produit est
 * exactement celui de Paul. Ce qui change, c'est le point d'entrée : un état
 * intérieur, pas un système.
 *
 * Contrainte tenue partout : un patron de PME de 52 ans doit pouvoir envoyer
 * cette page à son associé sans avoir honte. Donc : le visage et la vidéo, oui.
 * Le noir et or, les captures de revenus et la promesse chiffrée, jamais.
 */

export default function MaximePage() {
  return (
    <main className="t-maxime">
      {/* 1 · HERO HUMAIN */}
      <Section variant="flush">
        <Wrap size="wide">
          <div className="mx-hero">
            <div className="mx-hero__text">
              <Stack gap={5}>
                <span className="lab-label">Apprendre avec Maxime</span>
                <h1 className="lab-h1">
                  Vous n&apos;avez pas besoin de savoir par où commencer. C&apos;est
                  justement le travail.
                </h1>
                <p className="lab-lead">
                  Dix heures ensemble. On part de ce qui vous prend du temps, on construit
                  une chose qui marche, et vous repartez en sachant continuer.
                </p>

                <div className="mx-hero__facts">
                  {[
                    ["Avec qui", "Maxime, en direct. Pas une équipe qui tourne."],
                    ["Sur quoi", "Vos vrais dossiers, pas un exemple."],
                    ["Après", "Vous savez refaire seul les petits sujets."],
                  ].map(([k, v]) => (
                    <div key={k} className="mx-hero__fact">
                      <span className="lab-label">{k}</span>
                      <span>{v}</span>
                    </div>
                  ))}
                </div>

                <div className="mx-hero__price">
                  <div className="lab-price">
                    <span className="lab-price__amount">{price.amount}</span>
                    <span className="lab-price__unit">
                      {price.unit} · {OFFER.hours} heures
                    </span>
                  </div>
                  <div className="lab-cta-row">
                    <Cta href="#offre" variant="primary" size="lg">
                      Commencer les 10 heures
                    </Cta>
                    <Cta href="#video" variant="ghost">
                      Voir en 2 minutes
                    </Cta>
                  </div>
                </div>
              </Stack>
            </div>

            <div className="mx-hero__portrait">
              <Slot
                kind="PORTRAIT SLOT · IMAGE REQUISE"
                what="Portrait de Maxime, cadrage buste, lumière naturelle, regard caméra, tenue de travail. Le dépôt ne contient aujourd'hui aucune image de Maxime. Cet emplacement reste vide tant qu'elle manque : le hero de cette direction ne fonctionne pas sans visage, et c'est la première chose à produire."
                ratio="4 / 5"
              />
            </div>
          </div>
        </Wrap>
      </Section>

      {/* 2 · L'ÉTAT DE DÉPART */}
      <Section id="depart">
        <Wrap size="wide">
          <Head
            num="01"
            label="You don't need to know where to start"
            title="Si vous vous reconnaissez dans une de ces phrases, on a déjà de quoi travailler."
            lead="Ce n'est pas un défaut de compétence. C'est l'état normal de quelqu'un qui dirige une entreprise pendant que le sujet bouge tous les mois."
          />
          <div className="mx-said">
            {[
              "« Je comprends qu'il se passe quelque chose d'important, mais je suis perdu. »",
              "« J'ai essayé des outils. Je ne sais pas quoi en faire dans mon entreprise. »",
              "« Je ne sais pas ce qui vaut vraiment la peine d'être construit. »",
              "« Mon équipe attend que je tranche, et je n'ai pas d'avis solide. »",
            ].map((s, i) => (
              <Reveal key={s} delay={i * 70}>
                <p className="mx-said__line">{s}</p>
              </Reveal>
            ))}
          </div>
          <p className="mx-said__after">
            On ne commence pas par vous expliquer la technologie. On commence par
            regarder votre semaine.
          </p>
        </Wrap>
      </Section>

      {/* 3 · VIDÉO */}
      <Section id="video" variant="alt">
        <Wrap size="wide">
          <div className="mx-video">
            <div className="mx-video__frame">
              <Slot
                kind="VIDEO SLOT · 2 MINUTES"
                what="Maxime face caméra, sans montage clinquant : ce qu'on fait pendant les 10 heures, ce qu'on ne fait pas, à quoi ressemble la fin. Sous-titres obligatoires, compréhensible sans le son. Aucun chiffre de résultat à l'image."
                ratio="16 / 9"
              />
            </div>
            <Stack gap={4}>
              <span className="lab-num">02</span>
              <h2 className="lab-h3">
                Deux minutes pour savoir si vous avez envie de travailler avec moi.
              </h2>
              <p className="lab-body">
                Pas de promesse, pas de méthode secrète. Je montre une chose construite
                pendant une session, et je dis à quel moment ça coince.
              </p>
              <p className="lab-body">
                Si après ça vous hésitez encore, on prend 30 minutes au téléphone. C&apos;est
                gratuit et ça n&apos;engage rien.
              </p>
            </Stack>
          </div>
        </Wrap>
      </Section>

      {/* 4 · CE SUR QUOI ON PEUT TRAVAILLER */}
      <Section id="sujets">
        <Wrap size="wide">
          <Head
            num="03"
            label="Real things we can work on"
            title="Des sujets que vous reconnaissez, pas des cas d'usage."
            lead="On en prend un seul. Le bon. Choisir est la moitié du travail, et c'est la partie que personne ne fait."
          />
          <div className="lab-grid lab-grid--3">
            {[
              {
                k: "Le lundi matin",
                t: "Le document que vous refaites tous les mois",
                b: "Vous savez déjà comment il doit être. Le temps part dans le recopiage et la vérification, pas dans la décision.",
              },
              {
                k: "Le suivi",
                t: "Les relances qui tombent entre deux",
                b: "Ce n'est pas un problème d'outil. C'est qu'il n'y a personne dont c'est le travail à ce moment précis de la semaine.",
              },
              {
                k: "La préparation",
                t: "Le rendez-vous que vous préparez dans la voiture",
                b: "L'information existe, elle est éparpillée. On la fait arriver avant, sous une forme que vous lisez en trois minutes.",
              },
              {
                k: "Les pièces",
                t: "Les documents que vous relisez avant de signer",
                b: "L'objectif n'est pas de signer sans lire. C'est d'arriver à la lecture avec les points d'attention déjà remontés.",
              },
              {
                k: "Le savoir",
                t: "Ce que seule une personne sait faire",
                b: "On l'écrit avec elle. Ce n'est pas la remplacer, c'est arrêter de dépendre de sa présence pour une tâche répétitive.",
              },
              {
                k: "L'écrit",
                t: "Ce que vous écrivez dix fois par mois",
                b: "Sous une forme légèrement différente à chaque fois. C'est le sujet le plus facile à traiter, et c'est souvent le premier.",
              },
            ].map((c, i) => (
              <Reveal key={c.t} delay={i * 50}>
                <Card kicker={c.k} title={c.t}>
                  <p>{c.b}</p>
                </Card>
              </Reveal>
            ))}
          </div>
        </Wrap>
      </Section>

      {/* 5 · PREUVE */}
      <Section id="preuve" variant="deep">
        <Wrap size="wide">
          <Head
            num="04"
            label="Proof"
            title="Ce qu'on peut montrer, et ce qu'on ne peut pas encore."
            lead="Aucun nom, aucun chiffre de résultat. Ce qui suit est ce qui a été constaté, pas ce qui a été promis."
          />
          <div className="mx-proof">
            <div className="mx-proof__real">
              <Stack gap={4}>
                <span className="lab-label">Constaté</span>
                <p className="mx-proof__line">
                  Un dirigeant qui suivait son marché à la main, dans un classeur, reçoit
                  maintenant chaque semaine ce qui bouge, trié. Il compare aux sorties de
                  sa propre méthode et conteste quand ça ne va pas. C&apos;est ce
                  va-et-vient qui a fait le système, pas la première livraison.
                </p>
                <p className="mx-proof__line">
                  Une entreprise qui retraitait à la main un export comptable de plusieurs
                  centaines de comptes produit maintenant son document mensuel par une
                  chaîne écrite, avec une page de contrôles qui interdit la diffusion si un
                  total ne retombe pas.
                </p>
                <p className="lab-card__body">
                  Ces deux systèmes sont en production. Ce qui n&apos;est pas mesuré, on ne
                  le raconte pas.
                </p>
              </Stack>
            </div>
            <Slot
              kind="PROOF SLOT · VERBATIM CLIENT REQUIS"
              what="Un témoignage écrit, daté, avec accord de citation anonymisée. Des retours écrits datés existent en source primaire, mais aucun n'est autorisé à la citation aujourd'hui. Tant qu'aucun accord n'est obtenu, cette carte reste vide : on ne fabrique pas un verbatim."
            />
          </div>
        </Wrap>
      </Section>

      {/* 6 · CE QUE VOUS SAUREZ APRÈS */}
      <Section id="apres">
        <Wrap size="wide">
          <Head
            num="05"
            label="What you will understand after 10 hours"
            title="Le chemin, dit simplement."
            lead="Ce n'est pas un programme. C'est ce qui se passe, dans cet ordre, quand on travaille sur votre matière."
          />
          <div className="mx-arc">
            {ARC.map((a, i) => (
              <Reveal key={a.state} delay={i * 80}>
                <div className={`mx-arc__row${i === ARC.length - 1 ? " is-last" : ""}`}>
                  <span className="mx-arc__idx">{String(i + 1).padStart(2, "0")}</span>
                  <div>
                    <h3 className="mx-arc__state">{a.state}</h3>
                    <p className="lab-card__body">{a.line}</p>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>

          <div className="mx-method">
            <span className="lab-label">Les dix heures, dans le détail</span>
            <div className="mx-method__grid">
              {METHOD.map((m) => (
                <div key={m.key} className="mx-method__cell">
                  <span className="lab-label">{m.fr}</span>
                  <p className="lab-card__body">{m.line}</p>
                </div>
              ))}
            </div>
          </div>
        </Wrap>
      </Section>

      {/* 7 · CONTENU */}
      <Section id="contenu" variant="alt">
        <Wrap size="wide">
          <Head
            num="06"
            label="Latest insights"
            title="Ce que j'écris entre deux sessions."
            lead="Une idée à la fois, tirée de ce qui s'est passé la semaine d'avant. Pas de veille recopiée."
          />
          <div className="lab-grid lab-grid--3">
            {[
              "Pourquoi le premier sujet qu'on veut automatiser est presque toujours le mauvais",
              "Ce qu'un dirigeant doit savoir dire non à, avant de dire oui",
              "La différence entre gagner du temps et arrêter de subir",
            ].map((t, i) => (
              <Reveal key={t} delay={i * 60}>
                <article className="mx-post">
                  <span className="lab-label">Lettre</span>
                  <h3 className="lab-card__title">{t}</h3>
                  <span className="mx-post__more">Lire</span>
                </article>
              </Reveal>
            ))}
          </div>
          <Slot
            kind="CONTENT SLOT · TITRES À VALIDER"
            what="Ces trois titres sont des directions de sujet proposées pour le lab, pas des articles écrits. À remplacer par les vrais titres publiés de Maxime avant toute utilisation hors atelier."
          />
        </Wrap>
      </Section>

      {/* 8 · OFFRE */}
      <Section id="offre">
        <Wrap size="wide">
          <div className="mx-offer">
            <Stack gap={5}>
              <span className="lab-num">07</span>
              <h2 className="lab-h2">Les 10 heures</h2>
              <p className="lab-lead" style={{ maxWidth: "40ch" }}>
                {OFFER.format}
              </p>
              <ul className="lab-proof__facts">
                {OFFER.outcomes.map((o) => (
                  <li key={o}>
                    <span>{o}</span>
                  </li>
                ))}
              </ul>
              <p className="lab-card__body">
                Ce que ce n&apos;est pas : {OFFER.isNot.join(", ")}.
              </p>
            </Stack>

            <div className="mx-offer__box">
              <span className="lab-label">Build With You</span>
              <div className="lab-price">
                <span className="lab-price__amount">{price.amount}</span>
                <span className="lab-price__unit">{price.unit}</span>
              </div>
              <p className="lab-card__body">
                {OFFER.hours} heures, à votre rythme. On commence par 30 minutes au
                téléphone, gratuites, pour vérifier qu&apos;il y a un vrai sujet.
              </p>
              <Cta href="#offre" variant="primary" size="lg">
                Commencer les 10 heures
              </Cta>
              <Cta href="#offre" variant="ghost">
                Parler 30 minutes d&apos;abord
              </Cta>
              <p className="mx-offer__conf">
                Vos documents restent chez vous. Rien ne sort sans que vous ayez relu.
              </p>
            </div>
          </div>
        </Wrap>
      </Section>

      {/* 9 · CTA HUMAIN */}
      <Section variant="deep">
        <Wrap size="text">
          <Stack gap={5}>
            <h2 className="lab-h2">
              Dites-moi ce qui vous prend du temps en ce moment. Je vous dis si on peut en
              faire quelque chose.
            </h2>
            <p className="lab-body">
              Si la réponse est non, je vous le dis pendant l&apos;appel. C&apos;est
              arrivé, et ça arrivera encore.
            </p>
            <div className="lab-cta-row">
              <Cta href="#offre" variant="primary" size="lg">
                Prendre 30 minutes
              </Cta>
            </div>
          </Stack>
        </Wrap>
      </Section>

      <footer className="lab-foot">
        <Wrap size="wide">Parrit Brand Lab · direction Maxime · interne, non public</Wrap>
      </footer>
    </main>
  );
}
