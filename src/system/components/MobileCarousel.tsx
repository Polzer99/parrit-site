"use client";

import { Children, useEffect, useRef, type ReactNode } from "react";

/** Native scrolling and all cards work before hydration. Dots follow manual scrolling too. */
export function MobileCarousel({ children, className, label }: {
  children: ReactNode; className: string; label: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const dots = useRef<HTMLDivElement>(null);
  const items = Children.toArray(children);
  useEffect(() => {
    const box = ref.current;
    if (!box) return;
    const sync = () => {
      const left = box.getBoundingClientRect().left + parseFloat(getComputedStyle(box).paddingLeft);
      const cards = Array.from(box.children);
      const nearest = cards.reduce((best, card, i) => Math.abs(card.getBoundingClientRect().left - left) < Math.abs(cards[best].getBoundingClientRect().left - left) ? i : best, 0);
      dots.current?.querySelectorAll("i").forEach((dot, i) => dot.classList.toggle("on", i === nearest));
    };
    const key = (event: KeyboardEvent) => {
      if (!window.matchMedia("(max-width: 760px)").matches || !["ArrowLeft", "ArrowRight", "Home", "End"].includes(event.key)) return;
      event.preventDefault();
      const cards = Array.from(box.children);
      const left = box.getBoundingClientRect().left + parseFloat(getComputedStyle(box).paddingLeft);
      const current = cards.reduce((best, card, i) => Math.abs(card.getBoundingClientRect().left - left) < Math.abs(cards[best].getBoundingClientRect().left - left) ? i : best, 0);
      const index = event.key === "Home" ? 0 : event.key === "End" ? cards.length - 1 : Math.max(0, Math.min(cards.length - 1, current + (event.key === "ArrowRight" ? 1 : -1)));
      box.scrollTo({ left: box.scrollLeft + cards[index].getBoundingClientRect().left - left, behavior: "instant" });
    };
    box.addEventListener("keydown", key);
    box.addEventListener("scroll", sync, { passive: true });
    window.addEventListener("resize", sync);
    sync();
    return () => {
      box.removeEventListener("scroll", sync); window.removeEventListener("resize", sync);
      box.removeEventListener("keydown", key);
    };
  }, []);
  return <><div className={`${className} mobile-carousel`} ref={ref} tabIndex={0} role="region" aria-label={label}>{items}</div>
    <div className="swipe-dots" ref={dots} aria-hidden="true">{items.map((_, i) => <i key={i} className={i === 0 ? "on" : undefined}/>)}</div></>;
}
