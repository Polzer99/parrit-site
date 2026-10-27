"use client";

import { useCallback, useRef } from "react";
import { useMotionOnView } from "./RevealOnView";
import { MobileCarousel } from "./MobileCarousel";

export function ServiceGrid({ items, offers, deliveryLabel, label }: {
  items: readonly (readonly [string, string])[];
  offers: readonly (readonly string[])[];
  deliveryLabel: string; label: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const start = useCallback((element: HTMLElement) => {
    const cards = Array.from(element.querySelectorAll<HTMLElement>(".partner"));
    const timers = new Set<ReturnType<typeof setTimeout>>();
    const active: HTMLElement[] = [];
    const later = (callback: () => void, delay: number) => {
      const timer = setTimeout(() => { timers.delete(timer); callback(); }, delay);
      timers.add(timer);
    };
    const close = (card: HTMLElement) => {
      card.classList.remove("flip", "blink");
      const index = active.indexOf(card);
      if (index >= 0) active.splice(index, 1);
    };
    let index = 0;
    const tick = () => {
      // 3 × 2200 + 2 × 150 = 6900 ms, exceeding two starts (6800 ms).
      // Close the oldest face before opening a third, preserving the 3400 ms cadence.
      if (active.length === 2) close(active[0]);
      const card = cards[index];
      const texts = Array.from(card.querySelectorAll<HTMLLIElement>(".partner-offers li"));
      const output = card.querySelector<HTMLElement>(".offer")!;
      output.textContent = texts[0].textContent;
      card.classList.add("flip"); active.push(card);
      let offer = 0;
      const next = () => {
        if (!active.includes(card)) return;
        offer++;
        if (offer === texts.length) { close(card); return; }
        card.classList.add("blink");
        later(() => {
          if (!active.includes(card)) return;
          output.textContent = texts[offer].textContent;
          card.classList.remove("blink");
          later(next, 2200);
        }, 150);
      };
      later(next, 2200);
      index = (index + 1) % cards.length;
      later(tick, 3400);
    };
    later(tick, 1200);
    return () => { timers.forEach(clearTimeout); cards.forEach(close); };
  }, []);
  useMotionOnView(ref, start);
  return <div className="partner-motion" ref={ref}><MobileCarousel className="services" label={label}>
    {items.map(([title, text], i) => <div className="partner" key={title} aria-live="off">
      <div className="partner-type"><span className="s">{title}</span><p>{text}</p></div>
      <ul className="partner-offers">{offers[i].map(offer => <li key={offer}>{offer}</li>)}</ul>
      <div className="partner-delivery" aria-hidden="true"><span>{deliveryLabel}</span><p className="offer">{offers[i][0]}</p></div>
    </div>)}
  </MobileCarousel></div>;
}
