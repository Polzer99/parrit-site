"use client";

import { useEffect, useRef, type ReactNode, type RefObject } from "react";

type StartMotion = (element: HTMLElement) => () => void;
const cssMotion: StartMotion = () => () => {};

/** Static SSR is complete. Only an intersecting, motion-enabled section is animated. */
export function observeMotion(element: HTMLElement, start: StartMotion = cssMotion) {
  const media = window.matchMedia("(prefers-reduced-motion: reduce)");
  let stop: (() => void) | undefined;
  let entered = false;
  let visible = false;
  const update = () => {
    stop?.();
    stop = undefined;
    if (media.matches) {
      delete element.dataset.anim;
    } else if (entered && visible) {
      element.dataset.anim = "in";
      stop = start(element);
    } else {
      element.dataset.anim = entered ? "out" : "armed";
    }
  };
  // Observe the heading for long mobile sections: 25% of a multi-screen grid
  // could never intersect. The full section separately controls offscreen pause.
  const entry = new IntersectionObserver(entries => {
    if (!entries.some(item => item.isIntersecting && item.intersectionRatio >= .25)) return;
    entered = true;
    visible = true;
    update();
    entry.disconnect();
  }, { threshold: .25 });
  const visibility = new IntersectionObserver(entries => {
    const next = entries.some(item => item.isIntersecting);
    if (next === visible) return;
    visible = next;
    update();
  });
  update();
  entry.observe(element.querySelector("h2") ?? element);
  visibility.observe(element);
  media.addEventListener("change", update);
  return () => {
    entry.disconnect();
    visibility.disconnect();
    media.removeEventListener("change", update);
    stop?.();
    delete element.dataset.anim;
  };
}

export function useMotionOnView(ref: RefObject<HTMLElement | null>, start: StartMotion = cssMotion) {
  useEffect(() => {
    if (ref.current) return observeMotion(ref.current, start);
  }, [ref, start]);
}

export function RevealOnView({ children, className }: { children: ReactNode; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  useMotionOnView(ref);
  return <div ref={ref} className={className}>{children}</div>;
}
