"use client";

import { createContext, useContext, useState, type ReactNode } from "react";
import { localizedPath, type Locale } from "@/system/locale";
import { GOAL_GROUPS, GOAL_PLANES, HOME_GOALS, goalNodeLabel, homeGoal, type HomeGoal } from "@/system/home-goals";
import { CALCULATOR_COPY, HOURLY_COST_DEFAULT, QUOTE_DEFAULTS, TIME_TASKS, formatEuros, formatHours, quotesAtStake, taskCost } from "@/system/home-calculator";
import { homeSectionHeadings } from "@/system/home-layers";
import { avecSource } from "@/lib/registry/cta";
import { bookingParameters, type BookingSearchParams } from "@/system/booking";
import { AppointmentLink } from "./AppointmentLink";
import { BrandConnector } from "./BrandConnector";
import { MobileCarousel } from "./MobileCarousel";
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
  return <section className="hero" id="haut"><div className="wrap goal-hero">
    <div className="hero-intro">
      <h1>{heading[0]}{" "}<b>{heading[1]}</b></h1>
      <form className="goal-form" method="get" action={`${localizedPath("/", locale)}#haut`}>
        <label htmlFor="objectif">{locale === "fr" ? "Je veux" : "I want"}</label>
        <span className="goal-select">
          <span className="goal-select-sizer" aria-hidden="true">{HOME_GOALS.map(item => <span key={item.id}>{item.label[locale]}</span>)}</span>
          <select id="objectif" name="objectif" value={goal.id} onChange={event => choose(event.target.value)} aria-describedby="goal-result">
            {GOAL_GROUPS.map(group => <optgroup key={group.id} label={group.label[locale]}>
              {HOME_GOALS.filter(item => item.group === group.id).map(item => <option key={item.id} value={item.id}>{item.label[locale]}</option>)}
            </optgroup>)}
          </select>
        </span>
        {Array.from(new URLSearchParams(query)).filter(([key]) => key.startsWith("utm_")).map(([name, value], i) => <input key={i} type="hidden" name={name} value={value}/>)}
        <noscript><button className="btn rev-button ghost" type="submit">{locale === "fr" ? "Je veux" : "I want"}<BrandConnector/></button></noscript>
      </form>
      <div className="goal-results" id="goal-result" aria-live="polite" aria-atomic="true">
        {HOME_GOALS.map(item => <p key={item.id} data-result={item.id} hidden={item.id !== goal.id}>{item.result[locale]}</p>)}
        <div className="goal-result-sizer" aria-hidden="true">{HOME_GOALS.map(item => <p key={item.id}>{item.result[locale]}</p>)}</div>
      </div>
      <div className="actions"><AppointmentLink locale={locale} placement="hero" query={query} source={`accueil-${goal.id}`}><BrandConnector/></AppointmentLink></div>
    </div>
    <GoalDiagram locale={locale}/>
  </div></section>;
}

function CalculatorField({ id, label, value, onChange }: { id: string; label: string; value: string; onChange: (value: string) => void }) {
  return <label className="calc-field" htmlFor={id}><span>{label}</span>
    <input id={id} type="number" inputMode="decimal" min={0} step="any" value={value} onChange={event => onChange(event.target.value)}/>
  </label>;
}

/** Décision de Paul du 15/11/2026 : ce que les tâches coûtent aujourd'hui, avec les chiffres du visiteur. */
export function GoalMotors({ locale }: { locale: Locale }) {
  const { query } = useGoal();
  const copy = CALCULATOR_COPY[locale];
  const [quotes, setQuotes] = useState(String(QUOTE_DEFAULTS.quotes));
  const [share, setShare] = useState(String(QUOTE_DEFAULTS.signedShare));
  const [amount, setAmount] = useState(String(QUOTE_DEFAULTS.amount));
  const [taskId, setTaskId] = useState<string>(TIME_TASKS[0].id);
  const [perWeek, setPerWeek] = useState(String(TIME_TASKS[0].perWeek));
  const [minutes, setMinutes] = useState(String(TIME_TASKS[0].minutes));
  const [rate, setRate] = useState(String(HOURLY_COST_DEFAULT));
  const stake = quotesAtStake(quotes, share, amount);
  const time = taskCost(perWeek, minutes, rate);
  const chooseTask = (id: string) => {
    const task = TIME_TASKS.find(item => item.id === id) ?? TIME_TASKS[0];
    setTaskId(task.id); setPerWeek(String(task.perWeek)); setMinutes(String(task.minutes));
  };
  return <section className="home-motors home-calculator" id={locale === "fr" ? "en-production" : "in-production"}><div className="wrap">
    <span id="services" className="home-anchor-alias" aria-hidden="true"/>
    <span id="ce-qui-change" className="home-anchor-alias" aria-hidden="true"/><span id="what-changes" className="home-anchor-alias" aria-hidden="true"/>
    <h2>{homeSectionHeadings(locale).motors[0]}</h2>
    <p className="calc-note">{copy.note}</p>
    <MobileCarousel className="calc-grid" label={locale === "fr" ? "Calculateurs" : "Calculators"}>
      <div className="calc-card" data-calculator="croissance">
        <h3>{copy.growth}</h3>
        <p className="calc-process">{copy.growthProcess}</p>
        <div className="calc-fields">
          <CalculatorField id={`calc-devis-${locale}`} label={copy.quotes} value={quotes} onChange={setQuotes}/>
          <CalculatorField id={`calc-part-${locale}`} label={copy.signedShare} value={share} onChange={setShare}/>
          <CalculatorField id={`calc-montant-${locale}`} label={copy.amount} value={amount} onChange={setAmount}/>
        </div>
        <p className="calc-result" aria-live="polite"><strong data-calc-result="croissance">{formatEuros(stake, locale)}</strong> <span>{copy.growthResult}</span></p>
      </div>
      <div className="calc-card" data-calculator="temps">
        <h3>{copy.time}</h3>
        {/* 18/11 : le menu fait face au sous-titre de l'autre carte ; son nom accessible reste « Tâche ». */}
        <div className="calc-field calc-task">
          <select id={`calc-tache-${locale}`} aria-label={copy.task} value={taskId} onChange={event => chooseTask(event.target.value)}>
            {TIME_TASKS.map(task => <option key={task.id} value={task.id}>{task.label[locale]}</option>)}
          </select>
        </div>
        <div className="calc-fields">
          <CalculatorField id={`calc-volume-${locale}`} label={copy.perWeek} value={perWeek} onChange={setPerWeek}/>
          <CalculatorField id={`calc-minutes-${locale}`} label={copy.minutes} value={minutes} onChange={setMinutes}/>
          <CalculatorField id={`calc-taux-${locale}`} label={copy.hourlyCost} value={rate} onChange={setRate}/>
        </div>
        <p className="calc-result" aria-live="polite"><strong data-calc-result="temps">{formatHours(time.hours, locale)}</strong> <span>{copy.timeResult(formatEuros(time.cost, locale))}</span></p>
      </div>
    </MobileCarousel>
    <div className="calc-footer"><p className="motors-principle">{locale === "fr" ? "L'assistant prépare. Vous validez." : "The assistant prepares. You approve."}</p>
      <AppointmentLink locale={locale} placement="bandeau" query={query} source="accueil-calculateur"><BrandConnector/></AppointmentLink>
    </div>
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
