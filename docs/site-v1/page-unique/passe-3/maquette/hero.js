// Maquette : ontologie racontée (haut de page) + marcheur du parcours.
const SVGNS = "http://www.w3.org/2000/svg";
const el = (tag, attrs, parent, text) => { const e = document.createElementNS(SVGNS, tag); for (const k in attrs) e.setAttribute(k, attrs[k]); if (text) e.textContent = text; if (parent) parent.appendChild(e); return e; };
const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;

/* ---------- ontologie ---------- */
(function hero() {
  const svg = document.getElementById("onto"); if (!svg) return;
  const D = { "E-mails": [150, 60], "Clients": [280, 60], "Stocks": [410, 60], "Factures": [540, 60], "Commandes": [670, 60] };
  const R = { "Validation": [180, 175], "Droits": [330, 175], "Seuils": [480, 175], "Échéances": [630, 175] };
  const A = { "Commercial": [130, 300], "Relances": [250, 300], "ADV": [370, 300], "Stock": [490, 300], "Compta": [610, 300], "Pilotage": [730, 300] };
  [["Vos données", 60], ["Vos règles", 175], ["Vos agents", 300]].forEach(([t, y]) => { el("line", { x1: 0, y1: y, x2: 770, y2: y, class: "layer" }, svg); el("text", { x: 0, y: y - 12, class: "lab" }, svg, t); });
  const ambient = [["E-mails","Validation"],["Clients","Validation"],["Clients","Droits"],["Stocks","Seuils"],["Commandes","Droits"],["Commandes","Seuils"],["Factures","Échéances"],["Commandes","Échéances"],
    ["Validation","Commercial"],["Validation","Relances"],["Droits","ADV"],["Seuils","Stock"],["Seuils","ADV"],["Échéances","Compta"],["Échéances","Relances"],["Droits","Pilotage"]];
  const P = { ...D, ...R, ...A };
  const paths = ambient.map(([a, b], i) => el("path", { id: "amb" + i, d: `M${P[a][0]} ${P[a][1]} L${P[b][0]} ${P[b][1]}`, class: "edge" }, svg));
  // agents qui se parlent
  [["Commercial","Relances"],["ADV","Stock"],["Compta","Pilotage"],["Relances","ADV"],["Stock","Compta"]].forEach(([a,b],i)=>el("path",{id:"talk"+i,d:`M${A[a][0]} ${A[a][1]+18} Q${(A[a][0]+A[b][0])/2} ${A[a][1]+48} ${A[b][0]} ${A[b][1]+18}`,class:"edge talk"},svg));
  for (const [k, [x, y]] of Object.entries(D)) { el("rect", { x: x - 6, y: y - 6, width: 12, height: 12, class: "node" }, svg); el("text", { x: x + 12, y: y + 22, class: "nt" }, svg, k); }
  for (const [k, [x, y]] of Object.entries(R)) { el("rect", { x: x - 6, y: y - 6, width: 12, height: 12, class: "node r" }, svg); el("text", { x: x + 12, y: y + 22, class: "nt" }, svg, k); }
  const agentEls = {};
  for (const [k, [x, y]] of Object.entries(A)) {
    const g = el("g", { transform: `translate(${x} ${y})`, class: "agent" }, svg);
    el("rect", { x: -14, y: -26, width: 28, height: 28, class: "ag" }, g); el("rect", { x: -8, y: -18, width: 5, height: 6, class: "eye" }, g); el("rect", { x: 3, y: -18, width: 5, height: 6, class: "eye" }, g);
    el("text", { x: 0, y: 22, "text-anchor": "middle", class: "nt" }, g, k); agentEls[k] = g;
  }
  // pulsations d'ambiance
  if (!reduce) paths.concat([...svg.querySelectorAll(".talk")]).forEach((p, i) => { const r = el("rect", { width: 6, height: 6, x: -3, y: -3, class: "pulse" }, svg); const m = el("animateMotion", { dur: (2.6 + (i % 5) * 0.4) + "s", begin: (i * 0.37 % 3) + "s", repeatCount: "indefinite" }, r); el("mpath", { href: "#" + p.id }, m); });
  // colonne résultats
  el("text", { x: 820, y: 48, class: "lab" }, svg, "Résultats");
  const slots = [110, 180, 250].map(y => { const g = el("g", { transform: `translate(820 ${y})`, class: "res" }, svg); el("rect", { width: 250, height: 50, class: "resbox" }, g); el("text", { x: 16, y: 31, class: "rest" }, g, ""); return g; });
  const stories = [
    { label: "E-mail client", route: ["E-mails", "Clients", "Validation", "Commercial", "Relances"], result: "Relance prête", cap: "Un client écrit. L'agent commercial le reconnaît, l'agent de relance prépare la réponse." },
    { label: "Stock bas", route: ["Stocks", "Seuils", "Stock", "ADV"], result: "Commande fournisseur prête", cap: "Un article passe sous son seuil. L'agent de stock alerte l'administration des ventes, qui prépare la commande." },
    { label: "Facture échue", route: ["Factures", "Échéances", "Compta", "Pilotage"], result: "Trésorerie à jour", cap: "Une facture arrive à échéance. L'agent comptable la rapproche, le tableau de pilotage se met à jour." },
  ];
  const cap = document.getElementById("ontocap");
  const tok = el("g", { class: "story" }, svg); el("rect", { x: -7, y: -7, width: 14, height: 14, class: "token" }, tok); const tl = el("text", { x: 12, y: -10, class: "toklab" }, tok, "");
  const showAll = () => stories.forEach((s, i) => { slots[i].querySelector("text").textContent = s.result; slots[i].classList.add("on"); });
  if (reduce) { showAll(); tok.style.display = "none"; cap.textContent = stories[0].cap; return; }
  let si = 0;
  const run = () => {
    const s = stories[si]; if (si === 0) slots.forEach(g => { g.classList.remove("on", "hot"); g.querySelector("text").textContent = ""; });
    const pts = s.route.map(k => P[k]).concat([[820, [110, 180, 250][si] + 25]]);
    tl.textContent = s.label; cap.textContent = s.cap; cap.classList.remove("fade"); void cap.offsetWidth; cap.classList.add("fade");
    const seg = pts.slice(1).map((p, i) => Math.hypot(p[0] - pts[i][0], p[1] - pts[i][1])); const total = seg.reduce((a, b) => a + b, 0); const dur = 4200; const t0 = performance.now();
    s.route.filter(k => A[k]).forEach((k, i) => setTimeout(() => { agentEls[k].classList.add("busy"); setTimeout(() => agentEls[k].classList.remove("busy"), 900); }, 600 + i * 1100));
    const step = now => {
      let d = Math.min(1, (now - t0) / dur) * total, i = 0; while (i < seg.length - 1 && d > seg[i]) { d -= seg[i]; i++; }
      const f = seg[i] ? Math.min(1, d / seg[i]) : 1; const x = pts[i][0] + (pts[i + 1][0] - pts[i][0]) * f, y = pts[i][1] + (pts[i + 1][1] - pts[i][1]) * f;
      tok.setAttribute("transform", `translate(${x} ${y})`);
      if (now - t0 < dur) requestAnimationFrame(step);
      else { slots.forEach(g => g.classList.remove("hot")); slots[si].querySelector("text").textContent = s.result; slots[si].classList.add("on", "hot"); tl.textContent = ""; si = (si + 1) % stories.length; setTimeout(run, si === 0 ? 3200 : 1600); }
    };
    requestAnimationFrame(step);
  };
  run();
})();

/* ---------- parcours : un humain et son agent marchent ---------- */
(function walker() {
  const svg = document.getElementById("walk"); if (!svg) return;
  el("line", { x1: 0, y1: 120, x2: 1080, y2: 120, class: "ground" }, svg);
  const stops = [180, 540, 900];
  // décors des étapes
  const book = el("g", { transform: "translate(214 44)", class: "prop p1" }, svg); el("rect", { x: 0, y: 0, width: 26, height: 34, class: "pg" }, book); el("rect", { x: 30, y: 0, width: 26, height: 34, class: "pg" }, book); [8, 16, 24].forEach(y => { el("line", { x1: 4, y1: y, x2: 22, y2: y, class: "txt" }, book); el("line", { x1: 34, y1: y, x2: 52, y2: y, class: "txt" }, book); });
  const bars = el("g", { transform: "translate(574 38)", class: "prop p2" }, svg); [[0, 26], [16, 18], [32, 10], [48, 0]].forEach(([x, y], i) => el("rect", { x, y, width: 11, height: 40 - y, class: "bar b" + i }, bars));
  const blocks = el("g", { transform: "translate(934 36)", class: "prop p3" }, svg); [[0, 30], [26, 30], [52, 30], [13, 10], [39, 10]].forEach(([x, y], i) => el("rect", { x, y, width: 22, height: 18, class: "blk k" + i }, blocks));
  const human = el("g", { class: "human" }, svg);
  el("rect", { x: -7, y: -58, width: 14, height: 14, class: "hu" }, human); el("rect", { x: -10, y: -42, width: 20, height: 24, class: "hu" }, human);
  const l1 = el("rect", { x: -8, y: -18, width: 6, height: 18, class: "hu leg l1" }, human); const l2 = el("rect", { x: 2, y: -18, width: 6, height: 18, class: "hu leg l2" }, human);
  const bot = el("g", { class: "bot" }, svg); el("rect", { x: -12, y: -24, width: 24, height: 24, class: "ag2" }, bot); el("rect", { x: -7, y: -17, width: 4, height: 5, class: "eye2" }, bot); el("rect", { x: 3, y: -17, width: 4, height: 5, class: "eye2" }, bot);
  const place = (x, walking) => { human.setAttribute("transform", `translate(${x} 120)`); bot.setAttribute("transform", `translate(${x - 44} 120)`); svg.classList.toggle("walking", walking); };
  if (reduce) { place(900, false); svg.classList.add("s1", "s2", "s3", "withbot"); return; }
  const seq = [[40, 180, 1800, ""], [180, 180, 2600, "s1"], [180, 540, 2600, "s1 withbot"], [540, 540, 2600, "s2 withbot"], [540, 900, 2600, "s2 withbot"], [900, 900, 3200, "s3 withbot"]];
  let i = 0;
  const go = () => {
    const [a, b, d, cls] = seq[i]; svg.setAttribute("class", "walk " + cls); const t0 = performance.now();
    const f = now => { const k = Math.min(1, (now - t0) / d); place(a + (b - a) * (a === b ? 0 : k), a !== b); if (k < 1) requestAnimationFrame(f); else { i = (i + 1) % seq.length; setTimeout(go, i === 0 ? 800 : 0); } };
    requestAnimationFrame(f);
  };
  go();
})();
