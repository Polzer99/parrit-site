"use client";

import { useCallback, useRef } from "react";
import type { Locale } from "@/system/locale";
import { SINGLE_PAGE_EN } from "@/system/single-page-copy";
import { useMotionOnView } from "./RevealOnView";

type Point = readonly [number, number];
const data = { "E-mails": [150, 60], Clients: [280, 60], Stocks: [410, 60], Factures: [540, 60], Commandes: [670, 60] } as const;
const rules = { Validation: [180, 175], Droits: [330, 175], Seuils: [480, 175], Échéances: [630, 175] } as const;
const agents = { Commercial: [130, 300], Relances: [250, 300], ADV: [370, 300], Stock: [490, 300], Compta: [610, 300], Pilotage: [730, 300] } as const;
const points = { ...data, ...rules, ...agents };
type NodeName = keyof typeof points;
type Story = { label: string; route: readonly NodeName[]; result: string; cap: string };
const ambient: readonly (readonly [NodeName, NodeName])[] = [["E-mails", "Validation"], ["Clients", "Validation"], ["Clients", "Droits"], ["Stocks", "Seuils"], ["Commandes", "Droits"], ["Commandes", "Seuils"], ["Factures", "Échéances"], ["Commandes", "Échéances"], ["Validation", "Commercial"], ["Validation", "Relances"], ["Droits", "ADV"], ["Seuils", "Stock"], ["Seuils", "ADV"], ["Échéances", "Compta"], ["Échéances", "Relances"], ["Droits", "Pilotage"]];
const talk: readonly (readonly [NodeName, NodeName])[] = [["Commercial", "Relances"], ["ADV", "Stock"], ["Compta", "Pilotage"], ["Relances", "ADV"], ["Stock", "Compta"]];
const stories: readonly Story[] = [
  { label: "E-mail client", route: ["E-mails", "Clients", "Validation", "Commercial", "Relances"], result: "Relance prête", cap: "Un client écrit. L'agent commercial le reconnaît, l'agent de relance prépare la réponse." },
  { label: "Stock bas", route: ["Stocks", "Seuils", "Stock", "ADV"], result: "Commande fournisseur prête", cap: "Un article passe sous son seuil. L'agent de stock alerte l'administration des ventes, qui prépare la commande." },
  { label: "Facture échue", route: ["Factures", "Échéances", "Compta", "Pilotage"], result: "Trésorerie à jour", cap: "Une facture arrive à échéance. L'agent comptable la rapproche, le tableau de pilotage se met à jour." },
  { label: "Bon de commande", route: ["E-mails", "Commandes", "Droits", "ADV"], result: "Commande saisie", cap: "Un client envoie son bon de commande. L'administration des ventes le saisit, vous vérifiez." },
  { label: "Demande de devis", route: ["Clients", "Commandes", "Validation", "Commercial"], result: "Devis à valider", cap: "Un prospect demande un devis. L'agent commercial le prépare selon vos conditions, vous le validez." },
  { label: "Vendredi soir", route: ["Commandes", "Échéances", "Pilotage"], result: "Rapport de la semaine prêt", cap: "Le vendredi, l'agent de pilotage rassemble commandes et échéances dans un rapport." },
];
const SLOT_Y = [70, 132, 194, 256] as const;
const DURATION = 4200;
const GAP = 2300;
const svgNS = "http://www.w3.org/2000/svg";
function svgElement<K extends keyof SVGElementTagNameMap>(tag: K, attrs: Record<string, string>, parent: SVGElement) {
  const node = document.createElementNS(svgNS, tag);
  for (const [key, value] of Object.entries(attrs)) node.setAttribute(key, value);
  parent.append(node);
  return node;
}

// Keep the SVG labels readable at the smaller screen-sized figure.
function resultLines(text: string) {
  const lines: string[] = [];
  for (const word of text.split(" ")) {
    const last = lines.length - 1;
    if (last < 0 || lines[last].length + word.length + 1 > 18) lines.push(word);
    else lines[last] += ` ${word}`;
  }
  return lines;
}

export function OntologyHero({ locale }: { locale: Locale }) {
  const ref = useRef<HTMLDivElement>(null);
  const start = useCallback((element: HTMLElement) => {
    const t = (text: string) => locale === "fr" ? text : SINGLE_PAGE_EN[text];
    const svg = element.querySelector<SVGSVGElement>("svg")!;
    const caption = element.querySelector<HTMLParagraphElement>(".ontocap")!;
    const motion = svgElement("g", { class: "ontology-motion" }, svg);
    const frames = new Set<number>();
    const timers = new Set<ReturnType<typeof setTimeout>>();
    const animations = new Set<Animation>();
    const highlights = new Map<SVGElement, ReturnType<typeof setTimeout>>();
    let stopped = false;
    const nextFrame = (callback: FrameRequestCallback) => {
      const frame = requestAnimationFrame(now => {
        frames.delete(frame);
        if (!stopped) callback(now);
      });
      frames.add(frame);
    };
    const later = (callback: () => void, delay: number) => {
      const timer = setTimeout(() => {
        timers.delete(timer);
        if (!stopped) callback();
      }, delay);
      timers.add(timer);
      return timer;
    };
    const animate = (target: Element, keyframes: Keyframe[], duration: number, done?: () => void) => {
      const animation = target.animate(keyframes, { duration, easing: "ease-out" });
      animations.add(animation);
      animation.onfinish = () => {
        animations.delete(animation);
        animation.onfinish = null;
        if (!stopped) done?.();
      };
    };
    svg.querySelectorAll<SVGPathElement>(".edge").forEach((path, i) => {
      const pulse = svgElement("rect", { width: "6", height: "6", x: "-3", y: "-3", class: "pulse" }, motion);
      const animation = svgElement("animateMotion", { dur: `${2.6 + i % 5 * .4}s`, begin: `${i * .37 % 3}s`, repeatCount: "indefinite" }, pulse);
      svgElement("mpath", { href: `#${path.id}` }, animation);
    });
    const trails = svgElement("g", { class: "trails" }, motion);
    const feedGroup = svgElement("g", { class: "feed live-feed" }, motion);
    const feed: SVGGElement[] = [];
    const pushResult = (result: string) => {
      const slot = svgElement("g", { class: "res on hot" }, feedGroup);
      // Keep reading order aligned with the newest-first visual stack.
      feedGroup.prepend(slot);
      svgElement("rect", { width: "250", height: "50", class: "resbox" }, slot);
      const lines = resultLines(t(result));
      const label = svgElement("text", { class: "rest" }, slot);
      lines.forEach((line, i) => {
        svgElement("tspan", { x: "12", y: String(lines.length === 1 ? 31 : 20 + i * 23) }, label).textContent = line + (i < lines.length - 1 ? " " : "");
      });
      slot.style.transform = `translate(820px, ${SLOT_Y[0]}px)`;
      // Reveal at full opacity once the previous result has vacated this row.
      // An opaque entrance above it would overlap the heading and old result.
      if (feed.length) slot.style.visibility = "hidden";
      feed.forEach(item => item.classList.remove("hot"));
      feed.unshift(slot);
      const outgoing = feed.length > SLOT_Y.length ? feed.pop() : undefined;
      outgoing?.remove();
      nextFrame(() => nextFrame(() => {
        feed.forEach((item, i) => {
          item.style.transform = `translate(820px, ${SLOT_Y[i]}px)`;
        });
        later(() => { slot.style.removeProperty("visibility"); }, 500);
      }));
    };
    const highlight = (key: NodeName) => {
      const node = svg.querySelector<SVGElement>(`[data-node="${key}"], [data-agent="${key}"]`)!;
      const previous = highlights.get(node);
      if (previous !== undefined) { clearTimeout(previous); timers.delete(previous); }
      node.classList.add(key in agents ? "busy" : "lit");
      highlights.set(node, later(() => {
        node.classList.remove("busy", "lit");
        highlights.delete(node);
      }, 900));
    };
    let active = 0;
    const launch = (story: Story) => {
      active++;
      motion.querySelectorAll(".toklab").forEach(label => label.classList.add("previous"));
      const route: Point[] = [...story.route.map(key => points[key]), [820, SLOT_Y[0] + 25]];
      const lengths = route.slice(1).map((point, i) => Math.hypot(point[0] - route[i][0], point[1] - route[i][1]));
      const total = lengths.reduce((a, b) => a + b, 0);
      const trail = svgElement("path", { d: `M${route.map(point => point.join(" ")).join(" L")}`, class: "trail" }, trails);
      trail.style.strokeDasharray = String(total);
      trail.style.strokeDashoffset = String(total);
      const token = svgElement("g", { class: "story", transform: `translate(${route[0].join(" ")})` }, motion);
      svgElement("rect", { x: "-7", y: "-7", width: "14", height: "14", class: "token" }, token);
      const label = svgElement("text", { class: "toklab" }, token);
      label.textContent = t(story.label);
      const positionLabel = (x: number) => {
        const right = x > 540;
        label.setAttribute("x", right ? "-12" : "12");
        label.setAttribute("y", right ? "-14" : "-10");
        label.setAttribute("text-anchor", right ? "end" : "start");
      };
      positionLabel(route[0][0]);
      caption.textContent = t(story.cap);
      animate(caption, [{ transform: "translateY(4px)" }, { transform: "translateY(0)" }], 600);
      let travelled = 0;
      story.route.forEach((key, i) => {
        later(() => highlight(key), travelled / total * DURATION);
        travelled += lengths[i];
      });
      const began = performance.now();
      const step = (now: number) => {
        const progress = Math.min(1, (now - began) / DURATION);
        trail.style.strokeDashoffset = String(total * (1 - progress));
        let distance = progress * total;
        let i = 0;
        while (i < lengths.length - 1 && distance > lengths[i]) { distance -= lengths[i]; i++; }
        const fraction = lengths[i] ? Math.min(1, distance / lengths[i]) : 1;
        const x = route[i][0] + (route[i + 1][0] - route[i][0]) * fraction;
        const y = route[i][1] + (route[i + 1][1] - route[i][1]) * fraction;
        token.setAttribute("transform", `translate(${x} ${y})`);
        positionLabel(x);
        if (progress < 1) nextFrame(step);
        else {
          active--;
          token.remove();
          pushResult(story.result);
          animate(trail, [{ opacity: 1 }, { opacity: 0 }], 900, () => trail.remove());
        }
      };
      nextFrame(step);
    };
    let index = 0;
    const tick = () => {
      // A background tab may delay frames while timers keep firing: never queue a third token.
      if (active < 2) {
        launch(stories[index]);
        index = (index + 1) % stories.length;
      }
      later(tick, GAP);
    };
    tick();
    return () => {
      stopped = true;
      frames.forEach(cancelAnimationFrame);
      timers.forEach(clearTimeout);
      animations.forEach(animation => { animation.onfinish = null; animation.cancel(); });
      svg.querySelectorAll(".busy, .lit").forEach(node => node.classList.remove("busy", "lit"));
      element.getAnimations({ subtree: true }).forEach(animation => animation.cancel());
      motion.remove();
      caption.textContent = t(stories[0].cap);
    };
  }, [locale]);
  useMotionOnView(ref, start);
  const t = (text: string) => locale === "fr" ? text : SINGLE_PAGE_EN[text];
  return <div className="ontology-hero" ref={ref} tabIndex={0} role="region" aria-label={locale === "fr" ? "Des données aux résultats" : "From data to results"}>
    <svg className="onto" viewBox="0 0 1080 360" aria-hidden="true">
      {[["Vos données", 60], ["Vos règles", 175], ["Vos agents", 300]].map(([label, y]) => <g key={label}><line x1="0" y1={y} x2="770" y2={y} className="layer"/><text x="0" y={Number(y) - 36} className="lab">{t(String(label))}</text></g>)}
      {ambient.map(([a, b], i) => <path key={i} id={`onto-amb${i}`} d={`M${points[a].join(" ")} L${points[b].join(" ")}`} className="edge"/>)}
      {talk.map(([a, b], i) => <path key={i} id={`onto-talk${i}`} d={`M${points[a][0]} 318 Q${(points[a][0] + points[b][0]) / 2} 348 ${points[b][0]} 318`} className="edge talk"/>)}
      {[data, rules].map((layer, i) => Object.entries(layer).map(([label, [x, y]]) => <g key={label}><rect data-node={label} x={x - 6} y={y - 6} width="12" height="12" className={i ? "node r" : "node"}/><text x={x + 12} y={y + 22} className="nt">{t(label)}</text></g>))}
      {Object.entries(agents).map(([label, [x, y]]) => <g key={label} data-agent={label} transform={`translate(${x} ${y})`} className="agent"><rect x="-14" y="-26" width="28" height="28" className="ag"/><rect x="-8" y="-18" width="5" height="6" className="eye"/><rect x="3" y="-18" width="5" height="6" className="eye"/><text x="0" y="22" textAnchor="middle" className="nt">{t(label)}</text></g>)}
      <text x="820" y="48" className="lab">{t("Résultats")}</text>
      <g className="feed static-feed">
        {stories.slice(0, 4).map((story, i) => <g key={story.result} transform={`translate(820 ${SLOT_Y[i]})`} opacity={1} className={i === 0 ? "res on hot" : "res on"}><rect width="250" height="50" className="resbox"/><text className="rest">{resultLines(t(story.result)).map((line, index, lines) => <tspan key={index} x="12" y={lines.length === 1 ? 31 : 20 + index * 23}>{line}{index < lines.length - 1 ? " " : ""}</tspan>)}</text></g>)}
      </g>
    </svg>
    <p className="ontocap" aria-live="off">{t(stories[0].cap)}</p>
  </div>;
}
