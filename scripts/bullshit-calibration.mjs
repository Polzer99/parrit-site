#!/usr/bin/env node
// Batterie de calibration du Detecteur de Bullshit (REGLES-DOR §14 : garde-fou qualite).
// Gate anti-regression : a chaque changement de prompt/modele, on rejoue les 8 cas etiquetes.
// Usage : node scripts/bullshit-calibration.mjs            (defaut http://localhost:3939)
//         BSD_BASE=http://localhost:3000 node scripts/bullshit-calibration.mjs
// Code de sortie = nombre de cas hors fourchette (0 = batterie verte).

const BASE = process.env.BSD_BASE || "http://localhost:3939";

const CORPUS = [
  { id: "bs_moon",        min: 78, max: 100, label: "promet la lune",
    text: "L'IA va TOUT changer en 2026. Ceux qui ne s'adaptent pas vont disparaitre. J'accompagne les entreprises dans leur transformation digitale grace a des solutions d'IA generative revolutionnaires. Le futur appartient aux audacieux. Qui est pret ? Dites-le moi en commentaire." },
  { id: "bs_humility",    min: 72, max: 100, label: "humilite performative + faux secrets",
    text: "Il y a 2 ans, j'etais nul en IA. Aujourd'hui je forme des CEO du CAC40. Voici les 3 secrets que personne ne vous dira jamais sur l'intelligence artificielle. Thread." },
  { id: "bs_cliche",      min: 60, max: 100, label: "idee recue regurgitee",
    text: "L'IA ne remplacera pas votre travail. Mais quelqu'un qui utilise l'IA, oui. Pensez-y. Le monde change, soyez du bon cote." },
  { id: "bs_emotion",     min: 74, max: 100, label: "pathos pur",
    text: "Je suis BLUFFE. Jamais vu un truc aussi dingue. Cet outil d'IA est un game-changer absolu, c'est fou. Vous devez absolument tester ca, ca va vous retourner le cerveau." },
  { id: "bs_numbers",     min: 64, max: 100, label: "chiffres inventes sans methode",
    text: "Grace a l'IA, on a multiplie notre productivite par 10 et augmente nos ventes de +300% en 3 mois. La preuve que l'IA est l'avenir du business. Ceux qui hesitent encore vont le regretter." },
  { id: "sub_operator",   min: 0,  max: 25,  label: "substance, recit d'execution",
    text: "Hier j'ai branche un agent sur notre boite mail support. 1er essai : il repondait n'importe quoi sur les remboursements. J'ai du lui donner acces au CSV des commandes et ecrire une quarantaine de regles metier. Maintenant il traite environ 120 mails par jour ; j'escalade a la main les litiges et les cas council. Ca m'a pris trois soirees." },
  { id: "honest_empty",   min: 33, max: 58,  label: "PIEGE : vide-mais-honnete (milieu)",
    text: "L'IA est un sujet important pour les entreprises aujourd'hui. Il faut se former et rester a jour sur ces evolutions. Bonne semaine a tous." },
  { id: "sub_light_hook", min: 0,  max: 32,  label: "PIEGE faux-positif : substance + 1 emoji",
    text: "Petit retour terrain : j'ai automatise la facturation Qonto d'un client. Le piege ? Les avoirs. J'ai du gerer 3 cas distincts (acompte, remboursement partiel, geste commercial), chacun avec sa logique. Deux jours de dev, un jour de recette. Ca tourne depuis trois semaines, zero intervention." },
];

function pad(s, n) { s = String(s); return s + " ".repeat(Math.max(0, n - s.length)); }

const results = [];
for (const c of CORPUS) {
  try {
    const r = await fetch(`${BASE}/api/bullshit`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text: c.text }),
    });
    const d = await r.json();
    if (!r.ok || typeof d.score !== "number") {
      results.push({ ...c, ok: false, score: "ERR", note: d.error || `HTTP ${r.status}` });
      continue;
    }
    const ok = d.score >= c.min && d.score <= c.max;
    const ax = (d.axes || []).map((a) => `${a.key.slice(0, 3)}=${a.score}`).join(" ");
    results.push({ ...c, ok, score: d.score, band: d.band, guard: d.guard, ax });
  } catch (e) {
    results.push({ ...c, ok: false, score: "ERR", note: String(e).slice(0, 80) });
  }
}

console.log("\n  DETECTEUR DE BULLSHIT — batterie de calibration (" + BASE + ")\n");
console.log("  " + pad("cas", 16) + pad("attendu", 9) + pad("score", 7) + pad("ok", 4) + "axes / note");
console.log("  " + "-".repeat(78));
let fails = 0;
for (const r of results) {
  if (!r.ok) fails++;
  const range = `${r.min}-${r.max}`;
  const mark = r.ok ? "OK " : "XX ";
  const tail = r.score === "ERR" ? r.note : `${r.ax}  [${r.band}${r.guard ? " · garde:" + r.guard : ""}]`;
  console.log("  " + pad(r.id, 16) + pad(range, 9) + pad(r.score, 7) + mark + " " + tail);
}
console.log("  " + "-".repeat(78));
console.log(`\n  ${results.length - fails}/${results.length} cas dans la fourchette. ${fails === 0 ? "BATTERIE VERTE." : fails + " hors fourchette."}\n`);
process.exit(fails);
