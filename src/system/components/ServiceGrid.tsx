"use client";

import { useCallback, useRef } from "react";
import { useMotionOnView } from "./RevealOnView";
import { readingMs } from "@/system/reading";
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
    // Space starts by half the longest complete sequence: at most two faces,
    // without ever truncating an offer to make room for the next card.
    const sequences = cards.map(card => Array.from(card.querySelectorAll<HTMLLIElement>(".partner-offers li")));
    const longest = Math.max(...sequences.map(texts => texts.reduce((total, text) => total + readingMs(text.textContent ?? ""), 0) + Math.max(0, texts.length - 1) * 300));
    const launchGap = longest / 2 + 290;
    const initialDelay = Math.max(...cards.map(card => readingMs(Array.from(card.querySelectorAll<HTMLElement>(".partner-type .s, .partner-type p")).map(node => node.textContent).join(" "))));
    const later = (callback: () => void, delay: number) => {
      const timer = setTimeout(() => { timers.delete(timer); callback(); }, delay);
      timers.add(timer);
    };
    const close = (card: HTMLElement) => {
      card.classList.remove("flip", "blink");
    };
    let index = 0;
    const tick = () => {
      const card = cards[index];
      const texts = sequences[index];
      const output = card.querySelector<HTMLElement>(".offer")!;
      output.textContent = texts[0].textContent;
      card.classList.add("flip");
      let offer = 0;
      const next = () => {
        offer++;
        if (offer === texts.length) { close(card); return; }
        card.classList.add("blink");
        later(() => {
          output.textContent = texts[offer].textContent;
          card.classList.remove("blink");
          later(next, readingMs(output.textContent ?? "") + 150);
        }, 150);
      };
      later(next, readingMs(output.textContent ?? ""));
      index = (index + 1) % cards.length;
      later(tick, launchGap);
    };
    if (cards.length) later(tick, initialDelay);
    return () => { timers.forEach(clearTimeout); cards.forEach(close); };
  }, []);
  useMotionOnView(ref, start);
  return <div className="partner-motion" ref={ref}><MobileCarousel className="services" label={label}>
    {items.map(([title, text], i) => <div className="partner" key={title} aria-live="off">
      <div className="partner-summary">
        <div className="partner-type"><span className="s">{title}</span><p>{text}</p></div>
        <ul className="partner-offers">{offers[i].map(offer => <li key={offer}>{offer}</li>)}</ul>
      </div>
      <div className="partner-delivery" aria-hidden="true"><span>{deliveryLabel}</span><div className="offer-stack">
        <p className="offer">{offers[i][0]}</p>
        {offers[i].map(offer => <p className="offer-sizer" key={offer}>{offer}</p>)}
      </div></div>
    </div>)}
  </MobileCarousel></div>;
}
