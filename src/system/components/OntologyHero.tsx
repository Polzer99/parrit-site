"use client";

import { useCallback, useRef, useState, type CSSProperties, type ReactNode } from "react";
import type { Locale } from "@/system/locale";
import { SINGLE_PAGE_EN } from "@/system/single-page-copy";
import { HERO_STORIES, NODES, ROWS, ZONES, LAYERS, UP, REL, TOP, type Plane, type NodeId } from "@/system/ontology-hero-data";
import { OntologyGlyph } from "./OntologyGlyph";
import { useMotionOnView } from "./RevealOnView";

type Point = readonly [number, number];
const DESKTOP = { cx: 968, w: 330, h: 88, slab: 9, planes: { top: 186, mid: 382, bot: 578 } };
const COMPACT = { cx: 195, w: 168, h: 46, slab: 5, planes: { top: 74, mid: 196, bot: 318 } };
const planes = ["top", "mid", "bot"] as const;
// Two static path groups share one SVG and 33 HTML nodes. CSS selects the
// visible group before hydration, without viewport measurement or CSS d.
function project([x, y]: Point, compact: boolean): Point {
  return compact ? [x * 820 / 390, y * 630 / 380] : [x - 620, y - 70];
}
function position(id: NodeId, compact = false): Point {
  const geo = compact ? COMPACT : DESKTOP;
  for (const plane of planes) {
    const index = NODES[plane].findIndex(node => node[0] === id);
    if (index >= 0) {
      const [s, t] = ROWS[index];
      return project([geo.cx + s * geo.w / 2, geo.planes[plane] + t * geo.h / 2], compact);
    }
  }
  throw new Error(`Unknown ontology node: ${id}`);
}
function location(desktop: Point, compact: Point): CSSProperties {
  return { "--x": `${desktop[0] / 820 * 100}%`, "--y": `${desktop[1] / 630 * 100}%`, "--compact-x": `${compact[0] / 820 * 100}%`, "--compact-y": `${compact[1] / 630 * 100}%` } as CSSProperties;
}
function path(points: readonly Point[], closed = false) {
  return `M${points.map(p => p.join(" ")).join(" L")}${closed ? " Z" : ""}`;
}
function planePaths(plane: Plane, compact: boolean) {
  const { cx, w, h, slab, planes } = compact ? COMPACT : DESKTOP;
  const cy = planes[plane];
  const paths: Point[][] = [
    [[cx - w, cy], [cx, cy + h], [cx, cy + h + slab], [cx - w, cy + slab]],
    [[cx, cy + h], [cx + w, cy], [cx + w, cy + slab], [cx, cy + h + slab]],
    [[cx, cy - h], [cx + w, cy], [cx, cy + h], [cx - w, cy]],
  ];
  for (let i = 1; i < 8; i++) {
    const u = -1 + i / 4;
    paths.push([[cx + (u + 1) * w / 2, cy + (u - 1) * h / 2], [cx + (u - 1) * w / 2, cy + (u + 1) * h / 2]]);
    paths.push([[cx + (-1 - u) * w / 2, cy + (u - 1) * h / 2], [cx + (1 - u) * w / 2, cy + (1 + u) * h / 2]]);
  }
  return paths.map((points, index) => path(points.map(point => project(point, compact)), index < 3));
}
function PlaneSurface({ plane, compact }: { plane: Plane; compact: boolean }) {
  return <g data-plane={plane}>{planePaths(plane, compact).map((d, i) => <path key={i} d={d} vectorEffect="non-scaling-stroke" className={i < 2 ? `onto-slab side-${i}` : i === 2 ? "onto-surface" : "onto-grid"}/>)}</g>;
}

export function OntologyHero({ locale, children }: { locale: Locale; children: ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);
  const [state, setState] = useState({ story: 0, step: 4 });
  const start = useCallback(() => {
    let story = 0;
    let step = 0;
    let stopped = false;
    let timer: ReturnType<typeof setTimeout>;
    const tick = () => {
      if (stopped) return;
      step++;
      if (step > 4) { story = (story + 1) % HERO_STORIES.length; step = 0; }
      setState({ story, step });
      timer = setTimeout(tick, step === 0 ? 900 : step === 4 ? 3600 : 2700);
    };
    setState({ story, step });
    timer = setTimeout(tick, 2700);
    return () => {
      stopped = true;
      clearTimeout(timer);
      setState({ story: 0, step: 4 });
    };
  }, []);
  useMotionOnView(ref, start);
  const t = (text: string) => locale === "fr" ? text : SINGLE_PAGE_EN[text];
  const story = HERO_STORIES[state.story];
  const litNodes: readonly NodeId[] = [
    ...(state.step >= 1 ? [story.d, story.o1] : []),
    ...(state.step >= 2 ? [story.o2] : []),
    ...(state.step >= 3 ? [story.r, story.out] : []),
    ...(state.step >= 4 ? [story.act] : []),
  ];
  const litLinks = [state.step >= 1 && `up_${story.d}_${story.o1}`, state.step >= 2 && story.rel, state.step >= 3 && story.rl, state.step >= 3 && story.top, state.step >= 4 && story.al];
  const links = (pairs: readonly (readonly [NodeId, NodeId])[], prefix: string, compact: boolean) => pairs.map(([a, b]) => {
    const id = `${prefix}_${a}_${b}`;
    const lit = litLinks.includes(id);
    return <path key={id} d={path([position(a, compact), position(b, compact)])} data-link={id} className={`onto-link${lit ? " is-lit" : ""}${lit && id === story.al ? " is-action" : ""}`} vectorEffect="non-scaling-stroke"/>;
  });
  const caption = (item: typeof HERO_STORIES[number], sizer = false) => <div className={sizer ? "ontocap-sizer" : "ontocap"} aria-hidden={sizer || undefined} aria-live={sizer ? undefined : "off"} key={item.title}>
    <b className="onto-story-title">{t(item.title)}</b>
    <ol>{item.steps.map((text, i) => <li key={text} className={sizer || state.step > i + 1 ? "is-done" : state.step === i + 1 ? "is-current" : "is-future"}><span className="onto-number" aria-hidden="true">{i + 1}</span><span>{t(text)}</span></li>)}</ol>
    <div className={`onto-result${sizer || state.step >= 3 ? " is-visible" : ""}`} aria-hidden={!sizer && state.step < 3 || undefined}>
      <span className="onto-ready">{t("PRÊT")}</span><b>{t(item.result)}</b><span className={`onto-approval${sizer || state.step >= 4 ? " is-visible" : ""}`} aria-hidden={!sizer && state.step < 4 || undefined}>{t(item.verb)}</span>
    </div>
  </div>;
  return <div className="ontology-hero" ref={ref} tabIndex={0} role="region" aria-label={locale === "fr" ? "Des sources aux résultats" : "From sources to results"} data-story={state.story} data-step={state.step}>
    {children}
    <div className="onto-diagram" aria-hidden="true">
      <svg className="onto" viewBox="0 0 820 630" preserveAspectRatio="none" aria-hidden="true">
        {[false, true].map(compact => <g key={String(compact)} className={`onto-geo onto-geo-${compact ? "compact" : "desktop"}`}>
          <PlaneSurface plane="bot" compact={compact}/>{links(UP, "up", compact)}
          <PlaneSurface plane="mid" compact={compact}/>{links(REL, "rel", compact)}{links(TOP, "top", compact)}
          <PlaneSurface plane="top" compact={compact}/>
        </g>)}
      </svg>
      {planes.flatMap(plane => NODES[plane].map(([id, label, glyph]) => <div key={id} data-node={id} style={location(position(id), position(id, true))} className={`onto-node${litNodes.includes(id) ? " is-lit" : ""}${id === story.out && state.step >= 3 ? " is-result" : ""}${id === story.act && state.step >= 4 ? " is-action" : ""}`}>
        <span className="onto-icon"><svg viewBox="0 0 18 18" aria-hidden="true"><OntologyGlyph name={glyph}/></svg></span><span className="onto-label">{t(label)}</span>
      </div>))}
      {planes.flatMap(plane => ZONES[plane].map((zone, i) => {
        const s = [-1.25, 0, 1.25][i];
        const point = project([DESKTOP.cx + s * DESKTOP.w / 2 + [-14, 0, 14][i], DESKTOP.planes[plane] - DESKTOP.h * (1 - Math.abs(s) / 2) - 16], false);
        return <span key={zone} className={`onto-zone zone-${i}`} style={location(point, point)}>{t(zone)}</span>;
      }))}
      {planes.map(plane => <span key={plane} className="onto-layer" style={location(project([1312, DESKTOP.planes[plane] - 14], false), project([16, COMPACT.planes[plane] - COMPACT.h], true))}><b>{t(LAYERS[plane][0])}</b><span>{t(LAYERS[plane][1])}</span></span>)}
      {([story.d, story.o2, story.out, story.act] as const).map((id, i) => <span key={i} className={`onto-badge onto-number${state.step >= i + 1 ? " is-visible" : ""}`} data-badge={i + 1} data-for={id} style={location(position(id), position(id, true))}>{i + 1}</span>)}
    </div>
    <div className="ontocap-stack">{caption(story)}{HERO_STORIES.map(item => caption(item, true))}</div>
    {/* Attribution: https://ico.org.uk/for-the-public/ico-40/data-as-a-commodity/ */}
    <p className="humby">{t("« La donnée est le nouveau pétrole », disait Clive Humby en 2006. Brute, elle ne sert à rien : nous la raffinons.")}</p>
  </div>;
}
