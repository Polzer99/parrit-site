"use client";

import { useCallback, useRef } from "react";
import type { Locale } from "@/system/locale";
import { SINGLE_PAGE_EN } from "@/system/single-page-copy";
import { useMotionOnView } from "./RevealOnView";

type Point = readonly [number, number];
const data = { "E-mails": [150, 60], Clients: [280, 60], Stocks: [410, 60], Factures: [540, 60], Commandes: [670, 60] } as const;
const rules = { Validation: [180, 175], Droits: [330, 175], Seuils: [480, 175], Échéances: [630, 175] } as const;
const agents = { Commercial: [130, 300], Relances: [250, 300], ADV: [370, 300], Stock: [490, 300], Compta: [610, 300], Pilotage: [730, 300] } as const;
const points: Readonly<Record<string, Point>> = { ...data, ...rules, ...agents };
const ambient = [["E-mails", "Validation"], ["Clients", "Validation"], ["Clients", "Droits"], ["Stocks", "Seuils"], ["Commandes", "Droits"], ["Commandes", "Seuils"], ["Factures", "Échéances"], ["Commandes", "Échéances"], ["Validation", "Commercial"], ["Validation", "Relances"], ["Droits", "ADV"], ["Seuils", "Stock"], ["Seuils", "ADV"], ["Échéances", "Compta"], ["Échéances", "Relances"], ["Droits", "Pilotage"]];
const talk = [["Commercial", "Relances"], ["ADV", "Stock"], ["Compta", "Pilotage"], ["Relances", "ADV"], ["Stock", "Compta"]];
const stories = [
  { label: "E-mail client", route: ["E-mails", "Clients", "Validation", "Commercial", "Relances"], result: "Relance prête", cap: "Un client écrit. L'agent commercial le reconnaît, l'agent de relance prépare la réponse." },
  { label: "Stock bas", route: ["Stocks", "Seuils", "Stock", "ADV"], result: "Commande fournisseur prête", cap: "Un article passe sous son seuil. L'agent de stock alerte l'administration des ventes, qui prépare la commande." },
  { label: "Facture échue", route: ["Factures", "Échéances", "Compta", "Pilotage"], result: "Trésorerie à jour", cap: "Une facture arrive à échéance. L'agent comptable la rapproche, le tableau de pilotage se met à jour." },
];
const svgNS = "http://www.w3.org/2000/svg";
function svgElement<K extends keyof SVGElementTagNameMap>(tag: K, attrs: Record<string, string>, parent: SVGElement) {
  const node = document.createElementNS(svgNS, tag);
  for (const [key, value] of Object.entries(attrs)) node.setAttribute(key, value);
  parent.append(node);
  return node;
}

export function OntologyHero({ locale }: { locale: Locale }) {
  const ref = useRef<HTMLDivElement>(null);
  const start = useCallback((element: HTMLElement) => {
    const t = (text: string) => locale === "fr" ? text : SINGLE_PAGE_EN[text];
    const svg = element.querySelector<SVGSVGElement>("svg")!;
    const caption = element.querySelector<HTMLParagraphElement>(".ontocap")!;
    const slots = Array.from(svg.querySelectorAll<SVGGElement>(".res"));
    const motion = svgElement("g", { class: "ontology-motion" }, svg);
    svg.querySelectorAll<SVGPathElement>(".edge").forEach((path, i) => {
      const pulse = svgElement("rect", { width: "6", height: "6", x: "-3", y: "-3", class: "pulse" }, motion);
      const animation = svgElement("animateMotion", { dur: `${2.6 + i % 5 * .4}s`, begin: `${i * .37 % 3}s`, repeatCount: "indefinite" }, pulse);
      svgElement("mpath", { href: `#${path.id}` }, animation);
    });
    const token = svgElement("g", { class: "story" }, motion);
    svgElement("rect", { x: "-7", y: "-7", width: "14", height: "14", class: "token" }, token);
    const label = svgElement("text", { x: "12", y: "-10", class: "toklab" }, token);
    let frame = 0;
    const timers = new Set<ReturnType<typeof setTimeout>>();
    const later = (callback: () => void, delay: number) => {
      const timer = setTimeout(() => { timers.delete(timer); callback(); }, delay);
      timers.add(timer);
    };
    let index = 0;
    const run = () => {
      const story = stories[index];
      if (index === 0) slots.forEach(slot => { slot.classList.remove("on", "hot"); slot.querySelector("text")!.textContent = ""; });
      const route: Point[] = [...story.route.map(key => points[key]), [820, [135, 205, 275][index]]];
      label.textContent = t(story.label);
      caption.textContent = t(story.cap);
      token.style.visibility = "visible";
      const lengths = route.slice(1).map((point, i) => Math.hypot(point[0] - route[i][0], point[1] - route[i][1]));
      const total = lengths.reduce((a, b) => a + b, 0);
      const began = performance.now();
      story.route.filter(key => key in agents).forEach((key, i) => {
        const agent = svg.querySelector<SVGGElement>(`[data-agent="${key}"]`)!;
        later(() => { agent.classList.add("busy"); later(() => agent.classList.remove("busy"), 900); }, 600 + i * 1100);
      });
      const step = (now: number) => {
        let distance = Math.min(1, (now - began) / 4200) * total;
        let i = 0;
        while (i < lengths.length - 1 && distance > lengths[i]) { distance -= lengths[i]; i++; }
        const fraction = lengths[i] ? Math.min(1, distance / lengths[i]) : 1;
        const x = route[i][0] + (route[i + 1][0] - route[i][0]) * fraction;
        const y = route[i][1] + (route[i + 1][1] - route[i][1]) * fraction;
        token.setAttribute("transform", `translate(${x} ${y})`);
        if (now - began < 4200) frame = requestAnimationFrame(step);
        else {
          slots.forEach(slot => slot.classList.remove("hot"));
          slots[index].querySelector("text")!.textContent = t(story.result);
          slots[index].classList.add("on", "hot");
          token.style.visibility = "hidden";
          index = (index + 1) % stories.length;
          later(run, index === 0 ? 3200 : 1600);
        }
      };
      frame = requestAnimationFrame(step);
    };
    run();
    return () => {
      cancelAnimationFrame(frame);
      timers.forEach(clearTimeout);
      motion.remove();
      svg.querySelectorAll(".busy").forEach(agent => agent.classList.remove("busy"));
      slots.forEach((slot, i) => { slot.setAttribute("class", "res on"); slot.querySelector("text")!.textContent = t(stories[i].result); });
      caption.textContent = t(stories[0].cap);
    };
  }, [locale]);
  useMotionOnView(ref, start);
  const t = (text: string) => locale === "fr" ? text : SINGLE_PAGE_EN[text];
  return <div className="ontology-hero" ref={ref}>
    <svg className="onto" viewBox="0 0 1080 360" aria-hidden="true">
      {[["Vos données", 60], ["Vos règles", 175], ["Vos agents", 300]].map(([label, y]) => <g key={label}><line x1="0" y1={y} x2="770" y2={y} className="layer"/><text x="0" y={Number(y) - 12} className="lab">{t(String(label))}</text></g>)}
      {ambient.map(([a, b], i) => <path key={i} id={`onto-amb${i}`} d={`M${points[a].join(" ")} L${points[b].join(" ")}`} className="edge"/>)}
      {talk.map(([a, b], i) => <path key={i} id={`onto-talk${i}`} d={`M${points[a][0]} 318 Q${(points[a][0] + points[b][0]) / 2} 348 ${points[b][0]} 318`} className="edge talk"/>)}
      {[data, rules].map((layer, i) => Object.entries(layer).map(([label, [x, y]]) => <g key={label}><rect x={x - 6} y={y - 6} width="12" height="12" className={i ? "node r" : "node"}/><text x={x + 12} y={y + 22} className="nt">{t(label)}</text></g>))}
      {Object.entries(agents).map(([label, [x, y]]) => <g key={label} data-agent={label} transform={`translate(${x} ${y})`} className="agent"><rect x="-14" y="-26" width="28" height="28" className="ag"/><rect x="-8" y="-18" width="5" height="6" className="eye"/><rect x="3" y="-18" width="5" height="6" className="eye"/><text x="0" y="22" textAnchor="middle" className="nt">{t(label)}</text></g>)}
      <text x="820" y="48" className="lab">{t("Résultats")}</text>
      {stories.map((story, i) => <g key={story.result} transform={`translate(820 ${[110, 180, 250][i]})`} className="res on"><rect width="250" height="50" className="resbox"/><text x="16" y="31" className="rest">{t(story.result)}</text></g>)}
    </svg>
    <p className="ontocap" aria-live="off">{t(stories[0].cap)}</p>
  </div>;
}
