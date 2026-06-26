"use client";

import { useState } from "react";

const WEBHOOK_URL = "https://n8n.srv1115145.hstgr.cloud/webhook/parrit-lead";

export default function HarnaisGate() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim() || !email.trim()) return;
    try {
      await fetch(WEBHOOK_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: name.trim(),
          email: email.trim(),
          page: "harnais-ia",
          source: "lead-magnet-harnais-cout-ia",
          url: typeof window !== "undefined" ? window.location.href : "",
          timestamp: new Date().toISOString(),
        }),
      });
    } catch {
      // le déblocage ne doit jamais dépendre du réseau
    }
    setSent(true);
  }

  return (
    <div className="gate">
      <div className={`gate-content${sent ? " unblurred" : ""}`} aria-hidden={!sent}>
        <div className="grid2">
          <div className="card">
            <div className="ic">速</div>
            <h3>Le principe : pourquoi 95 % et pas 20 %</h3>
            <p>
              Un modèle frontier (gpt-5.5 : $5/$30 par 1M ; Opus : $5/$25) coûte 30 à 50× plus cher
              qu&apos;un open-weight capable (DeepSeek V4 Flash : $0.09/$0.18). Or ~90 % du volume réel
              ne mérite pas un frontier. L&apos;écart de prix structurel fait l&apos;économie.
            </p>
          </div>
          <div className="card">
            <div className="ic">速</div>
            <h3>La règle d&apos;or</h3>
            <p>
              On ne choisit jamais un modèle par habitude. On classe la tâche, la classe impose le
              modèle, et ce routage devient le défaut, jamais un effort de mémoire. C&apos;est ce qui
              fait tenir le −95 % dans le temps.
            </p>
          </div>
        </div>

        <div className="card" style={{ marginTop: 20 }}>
          <h3>La matrice tâche → modèle</h3>
          <table className="matrix">
            <tbody>
              <tr><th>Classe</th><th>Tâche</th><th>Modèle</th><th>Coût /1M</th></tr>
              <tr><td>déterministe</td><td>regex, filtre, dédup</td><td>aucun LLM</td><td><b>$0</b></td></tr>
              <tr><td>local</td><td>classif offline, prefilter</td><td>gemma3:12b</td><td><b>$0</b></td></tr>
              <tr><td>cheap</td><td>extraction, scoring, routing</td><td>deepseek-v4-flash</td><td>$0.09</td></tr>
              <tr><td>draft</td><td>email, post, copy</td><td>deepseek-v4-pro</td><td>$0.44</td></tr>
              <tr><td>strong</td><td>coding, synthèse, PRD</td><td>glm-5.2</td><td>$0.95</td></tr>
              <tr><td>frontier</td><td>sécu, incident, archi</td><td>Sonnet / GPT-5.5</td><td>$3-5</td></tr>
            </tbody>
          </table>
        </div>

        <div className="grid3" style={{ marginTop: 20 }}>
          <div className="card step"><h3>Étape 1 : Mesurer</h3><p>Lire les 3 surfaces. On découvre que 1-2 concentrent 90 % du coût.</p></div>
          <div className="card step"><h3>Étape 2 : Router</h3><p>Le volume non-critique descend vers l&apos;open-weight, par défaut.</p></div>
          <div className="card step"><h3>Étape 3 : Réserver</h3><p>Le frontier reste pour sécu, incident, archi seulement.</p></div>
        </div>
      </div>

      <div className="gate-capture" id="capture">
        <div className="seal">速</div>
        <h3>Recevez le harnais complet</h3>
        <p className="cap-sub">
          Le playbook (méthode + chiffres), la matrice tâche → modèle, et le calculateur qu&apos;on
          utilise nous-mêmes. Paul vous écrit ensuite pour voir comment l&apos;adapter à votre stack.
        </p>
        {!sent ? (
          <form className="leadform" onSubmit={handleSubmit}>
            <input
              type="text"
              placeholder="Prénom"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
            <input
              type="email"
              placeholder="Email professionnel"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <button type="submit" className="btn btn-red btn-lg">
              Recevoir le harnais + être recontacté →
            </button>
          </form>
        ) : (
          <p className="gate-ok">
            ✓ Merci, le harnais arrive dans votre boîte. Paul vous écrit dans la foulée pour en parler.
          </p>
        )}
        {!sent && (
          <p className="fine">
            Un seul email pour le harnais, puis un mot de Paul. Pas de spam, désinscription en 1 clic.
          </p>
        )}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img className="seal-wm" src="/brand/parrit-seal.svg" alt="" />
      </div>
    </div>
  );
}
