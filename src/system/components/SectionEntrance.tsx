"use client";

import { useEffect } from "react";

/** Each section enters once. No SSR hiding, layout changes, timers or replay on scroll. */
export function observeSectionEntrances(root: HTMLElement) {
  if (!("IntersectionObserver" in window)) return () => {};
  const media = window.matchMedia("(prefers-reduced-motion: reduce)");
  const sections = Array.from(root.querySelectorAll<HTMLElement>(":scope > section:not(.hero):not(#contact)"));
  const seen = new Set<Element>();
  let observer: IntersectionObserver | undefined;
  const reset = () => sections.forEach(section => delete section.dataset.entrance);
  const configure = () => {
    observer?.disconnect();
    reset();
    if (media.matches) return;
    observer = new IntersectionObserver(entries => {
      for (const entry of entries) {
        if (!entry.isIntersecting || seen.has(entry.target)) continue;
        seen.add(entry.target);
        (entry.target as HTMLElement).dataset.entrance = "entered";
        observer?.unobserve(entry.target);
      }
    }, { threshold: 0 });
    for (const section of sections) {
      // Do not hide content already visible on hydration (including hash navigation).
      const box = section.getBoundingClientRect();
      if (box.top < window.innerHeight) seen.add(section);
      if (!seen.has(section)) {
        section.dataset.entrance = "pending";
        observer.observe(section);
      }
    }
  };
  configure();
  media.addEventListener("change", configure);
  return () => { observer?.disconnect(); media.removeEventListener("change", configure); reset(); };
}

export function SectionEntrance() {
  useEffect(() => {
    const root = document.querySelector<HTMLElement>("main.single-page");
    if (root) return observeSectionEntrances(root);
  }, []);
  return null;
}
