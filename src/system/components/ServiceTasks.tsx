"use client";

import { useCallback, useRef } from "react";
import type { Locale } from "@/system/locale";
import { SINGLE_PAGE_EN, SERVICE_CASES } from "@/system/single-page-copy";
import { useMotionOnView } from "./RevealOnView";
import { MobileCarousel } from "./MobileCarousel";

export function ServiceTasks({ locale }: { locale: Locale }) {
  const ref = useRef<HTMLDivElement>(null);
  const start = useCallback((element: HTMLElement) => {
    const timers = new Set<ReturnType<typeof setTimeout>>();
    const later = (callback: () => void, delay: number) => {
      const timer = setTimeout(() => { timers.delete(timer); callback(); }, delay);
      timers.add(timer);
    };
    const cards = element.querySelectorAll<HTMLElement>(".use-case");
    const show = (card: HTMLElement, index: number) => {
      card.dataset.case = String(index);
      card.querySelectorAll(".case").forEach((node, i) => node.classList.toggle("visually-hidden", i !== index));
      card.querySelectorAll(".case-dots i").forEach((dot, i) => dot.classList.toggle("on", i === index));
    };
    cards.forEach((card, i) => {
      let index = i % 2;
      show(card, index);
      const next = () => {
        card.classList.add("blink");
        later(() => {
          index = (index + 1) % 4;
          show(card, index);
          card.classList.remove("blink");
          later(next, 3500);
        }, 120);
      };
      later(next, 3500 + i * 290);
    });
    return () => {
      timers.forEach(clearTimeout);
      cards.forEach(card => { show(card, 0); card.classList.remove("blink"); });
    };
  }, []);
  useMotionOnView(ref, start);
  const t = (text: string) => locale === "fr" ? text : SINGLE_PAGE_EN[text];
  return <div ref={ref}><MobileCarousel className="service-tasks" label={locale === "fr" ? "Cas d'usage par service" : "Use cases by department"}>
    {SERVICE_CASES.map(([title, cases]) => <div className="use-case" key={title} aria-live="off" data-case="0">
      <span className="s">{t(title)}</span>
      {cases.map((text, i) => <div key={text} className={`case${i ? " visually-hidden" : ""}`}>
        <p className="case-text">{t(text)}</p><span className={`tag ${i % 2 ? "new" : "bo"}`}>{t(i % 2 ? "Nouveau" : "Back-office")}</span>
      </div>)}
      <span className="case-dots" aria-hidden="true">{cases.map((_, i) => <i key={i} className={i === 0 ? "on" : undefined}/>)}</span>
    </div>)}
  </MobileCarousel></div>;
}
