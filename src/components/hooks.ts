"use client";

import { useEffect, useRef, useCallback } from "react";

export function useScrollFade() {
  const observerRef = useRef<IntersectionObserver | null>(null);

  useEffect(() => {
    observerRef.current = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) entry.target.classList.add("visible");
        });
      },
      { threshold: 0.1, rootMargin: "0px 0px -40px 0px" }
    );

    document
      .querySelectorAll(".fade-in")
      .forEach((el) => observerRef.current?.observe(el));

    return () => observerRef.current?.disconnect();
  }, []);

  const fadeRef = useCallback(
    (node: HTMLElement | null) => {
      if (node && observerRef.current) {
        observerRef.current.observe(node);
      }
    },
    []
  );

  return fadeRef;
}
