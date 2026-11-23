"use client";

import { createContext, useContext, useState, type ReactNode } from "react";
import { localizedPath, type Locale } from "@/system/locale";
import { GOAL_GROUPS, GOAL_PLANES, HOME_GOALS, goalNodeLabel, homeGoal, type HomeGoal } from "@/system/home-goals";
import { homeSectionHeadings } from "@/system/home-layers";
import { SINGLE_PAGE_EN } from "@/system/single-page-copy";
import { avecSource } from "@/lib/registry/cta";
import { bookingParameters, type BookingSearchParams } from "@/system/booking";
import { AppointmentLink } from "./AppointmentLink";
import { BrandConnector } from "./BrandConnector";
import { ParritCalInline } from "./CalInline";

const GoalContext = createContext<{ goal: HomeGoal; choose: (id: string) => void; query: string } | null>(null);
function useGoal() {
  const value = useContext(GoalContext);
  if (!value) throw new Error("Home goals require HomeGoalProvider");
  return value;
}
export function HomeGoalProvider({ query, children }: { query: string; children: ReactNode }) {
  const [goal, setGoal] = useState(() => {
    const parameters = new URLSearchParams(query);
    const source = parameters.get("source") ?? "";
    // A booking link can open in a new tab or be reloaded after a client selection.
    const attributed = source.startsWith("accueil-") ? source.slice(8) : "";
    return homeGoal(HOME_GOALS.some(item => item.id === attributed) ? attributed : parameters.get("objectif"));
  });
  return <GoalContext.Provider value={{ goal, choose: id => setGoal(homeGoal(id)), query }}>{children}</GoalContext.Provider>;
}

const centers = [112, 292, 472];
function position(plane: number, index: number) {
  return [260 + (index % 4 - Math.floor(index / 4)) * 47, centers[plane] + (index % 4 + Math.floor(index / 4) - 3) * 14] as const;
}
export function GoalDiagram({ locale }: { locale: Locale }) {
  const { goal } = useGoal();
  const active = GOAL_PLANES.map((plane, p) => {
    const index = plane.nodes.findIndex(node => node.fr === goal.path[2 - p]);
    return { point: position(p, index), label: goalNodeLabel(plane.nodes[index], locale) };
  });
  return <figure className="goal-schema" aria-labelledby="goal-schema-title">
    <svg className="goal-diagram" viewBox="0 0 520 590" role="img" aria-labelledby="goal-schema-title" aria-describedby="goal-schema-description">
      <title id="goal-schema-title">{locale === "fr" ? "De ce que vous avez déjà à ce que vous obtenez" : "From what you already have to what you get"}</title>
      <desc id="goal-schema-description">{[...active].reverse().map(item => item.label).join(", ")}</desc>
      {Array.from({ length: 16 }, (_, k) => [[2, 1, k * 5 % 16], [1, 0, (k * 3 + 1) % 16]].map(([from, to, j]) => {
        const a = position(from, k), b = position(to, j);
        return <line className="goal-wire" key={`${k}-${from}`} x1={a[0]} y1={a[1]} x2={b[0]} y2={b[1]}/>;
      }))}
      {GOAL_PLANES.map((plane, p) => <g key={p} data-plane={p}>
        <polygon className="goal-slab" points={`55,${centers[p]+9} 260,${centers[p]-51} 465,${centers[p]+9} 260,${centers[p]+69}`}/>
        <polygon className="goal-plane" points={`55,${centers[p]} 260,${centers[p]-60} 465,${centers[p]} 260,${centers[p]+60}`}/>
        {plane.nodes.map((node, k) => {
          const [x, y] = position(p, k), lit = node.fr === goal.path[2-p], size = lit ? 8 : 4;
          return <rect key={node.fr} data-node={node.fr} data-active={lit} className="goal-node" x={x-size} y={y-size} width={size*2} height={size*2}><title>{goalNodeLabel(node, locale)}</title></rect>;
        })}
      </g>)}
      <polyline key={goal.id} className="goal-path" data-path={goal.id} points={[...active].reverse().map(item => item.point.join(",")).join(" ")} pathLength="1"/>
    </svg>
    {GOAL_PLANES.map((plane, p) => <span key={p} className="goal-plane-title" style={{ top: `${(centers[p]-94)/590*100}%` }}>{plane.label[locale]}</span>)}
    {GOAL_PLANES.map((plane, p) => plane.nodes.map((node, k) => {
      const [x, y] = position(p, k);
      return <span key={`${p}-${node.fr}`} className="goal-node-label" aria-hidden="true" data-active={node.fr === goal.path[2-p]} style={{ left: `clamp(32%, ${x/520*100}%, 68%)`, top: `${(y+18)/590*100}%` }}>{goalNodeLabel(node, locale)}</span>;
    }))}
  </figure>;
}

export function GoalHero({ locale }: { locale: Locale }) {
  const { goal, choose, query } = useGoal();
  const heading = homeSectionHeadings(locale).hero;
  const t = (text: string) => locale === "fr" ? text : SINGLE_PAGE_EN[text];
  return <section className="hero" id="haut"><div className="wrap goal-hero">
    <div className="hero-intro">
      <h1>{heading[0]}{" "}<b>{heading[1]}</b></h1>
      {/* Décision de Paul du 23/11/2026 : le métier est dit sous le titre. */}
      <p className="hero-metier">{t("Des audits pour choisir où agir. Des logiciels conçus autour de votre métier.")}</p>
      <form className="goal-form" method="get" action={`${localizedPath("/", locale)}#haut`}>
        <label htmlFor="objectif">{locale === "fr" ? "Je veux" : "I want to"}</label>
        <span className="goal-select">
          <span className="goal-select-sizer" aria-hidden="true">{HOME_GOALS.map(item => <span key={item.id}>{item.label[locale]}</span>)}</span>
          <select id="objectif" name="objectif" value={goal.id} onChange={event => choose(event.target.value)} aria-describedby="goal-result">
            {GOAL_GROUPS.map(group => <optgroup key={group.id} label={group.label[locale]}>
              {HOME_GOALS.filter(item => item.group === group.id).map(item => <option key={item.id} value={item.id}>{item.label[locale]}</option>)}
            </optgroup>)}
          </select>
        </span>
        {Array.from(new URLSearchParams(query)).filter(([key]) => key.startsWith("utm_")).map(([name, value], i) => <input key={i} type="hidden" name={name} value={value}/>)}
        <noscript><button className="btn rev-button ghost" type="submit">{locale === "fr" ? "Je veux" : "I want to"}<BrandConnector/></button></noscript>
      </form>
      <div className="goal-results" id="goal-result" aria-live="polite" aria-atomic="true">
        {HOME_GOALS.map(item => <p key={item.id} data-result={item.id} hidden={item.id !== goal.id}>{item.result[locale]}</p>)}
        <div className="goal-result-sizer" aria-hidden="true">{HOME_GOALS.map(item => <p key={item.id}>{item.result[locale]}</p>)}</div>
      </div>
      <div className="actions"><AppointmentLink locale={locale} placement="hero" query={query} source={`accueil-${goal.id}`}><BrandConnector/></AppointmentLink></div>
      <p className="hero-note">{t("15 minutes pour présenter votre besoin et parler de ce qui est réalisable.")}</p>
    </div>
    <GoalDiagram locale={locale}/>
  </div></section>;
}

export function GoalBooking({ locale }: { locale: Locale }) {
  const { goal, query } = useGoal();
  const destination = avecSource(`/?${query}`, `accueil-${goal.id}`);
  const search = new URLSearchParams(destination.split("?")[1]);
  const bookingQuery: BookingSearchParams = {};
  search.forEach((_, key) => {
    const values = search.getAll(key);
    bookingQuery[key] = values.length === 1 ? values[0] : values;
  });
  const parameters = bookingParameters(bookingQuery);
  return <ParritCalInline locale={locale} bookingParams={parameters}/>;
}
