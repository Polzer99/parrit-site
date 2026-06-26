/* eslint-disable @next/next/no-img-element */
import HarnaisGate from "./HarnaisGate";

export default function HarnaisIaPage() {
  return (
    <>
      <div className="frame" />

      <div className="wrap">
        <nav>
          <div className="logo">
            <img className="logo-img" src="/brand/parrit-lockup-red.svg" alt="Parrit·AI" />
          </div>
          <a className="btn btn-red" href="#capture">Recevoir le harnais</a>
        </nav>
      </div>

      <section className="hero left">
        <img className="seal-wm" src="/brand/parrit-seal.svg" alt="" />
        <div className="wrap">
          <span className="kicker">Étude de cas interne · Fractional AI Operator</span>
          <h1>
            On a divisé nos coûts IA par <span className="red">20</span>.
            <br />
            Voici le harnais exact, mesuré.
          </h1>
          <p className="sub">
            Pas une promesse marketing. Sur trois semaines de notre propre activité (Codex + Claude
            Code), on a mesuré chaque token, routé chaque tâche vers le modèle open-weight le moins
            cher qui fait le travail, et gardé le frontier pour les 10 % critiques. Méthode
            reproductible, chiffres à l&apos;appui.
          </p>
          <div className="chips">
            <span className="chip"><img className="ci" src="/brand/tool-logos/claude.svg" alt="" /> Claude Code</span>
            <span className="chip"><img className="ci" src="/brand/tool-logos/openai.svg" alt="" /> Codex</span>
            <span className="chip"><span className="dot" /> DeepSeek V4</span>
            <span className="chip"><span className="dot" /> GLM-5.2</span>
            <span className="chip"><span className="dot" /> Gemma local</span>
          </div>

          <div className="proof">
            <div className="bc">
              <div className="sec">Volume mesuré</div>
              <div className="res">1,13 <b>Md</b></div>
              <div className="pain">tokens consommés en 17 jours, sur la seule surface Codex.</div>
            </div>
            <div className="bc">
              <div className="sec">Coût équivalent-API</div>
              <div className="res"><b>−95 %</b></div>
              <div className="pain">même travail, routé vers l&apos;open-weight au lieu du frontier.</div>
            </div>
            <div className="bc">
              <div className="sec">Limites de plan</div>
              <div className="res"><b>0</b> blocage</div>
              <div className="pain">plus jamais coupé en pleine session par un quota épuisé.</div>
            </div>
          </div>
        </div>
      </section>

      <section className="section band">
        <div className="wrap">
          <div className="section-head">
            <span className="kicker">Le harnais complet</span>
            <h2>Playbook + matrice tâche → modèle + calculateur</h2>
            <p className="lead">
              Laissez votre email, on vous l&apos;envoie. Lecture 8 minutes, applicable aujourd&apos;hui.
            </p>
          </div>
          <HarnaisGate />
        </div>
      </section>

      <div className="wrap">
        <footer className="dim">
          <div className="logo">
            <img className="logo-img" src="/brand/parrit-lockup-red.svg" alt="Parrit·AI" />
          </div>
          <span className="mono">Au-delà de ChatGPT · en production en 14 jours · paul.larmaraud@parrit.ai</span>
        </footer>
      </div>
    </>
  );
}
