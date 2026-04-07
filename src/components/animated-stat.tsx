"use client";

import { useEffect, useRef, useState } from "react";

export function AnimatedStat({
  value,
  label,
}: {
  value: string;
  label: string;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const [displayed, setDisplayed] = useState(value);
  const hasAnimated = useRef(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const numericValue = parseInt(value, 10);
    const isNumeric = !isNaN(numericValue) && value !== "\u221e";
    if (!isNumeric) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting || hasAnimated.current) return;
        hasAnimated.current = true;

        const duration = 1200;
        const start = performance.now();

        function tick(now: number) {
          const elapsed = now - start;
          const progress = Math.min(elapsed / duration, 1);
          const eased = 1 - Math.pow(1 - progress, 3);
          setDisplayed(Math.round(eased * numericValue).toString());
          if (progress < 1) requestAnimationFrame(tick);
          else setDisplayed(value);
        }

        requestAnimationFrame(tick);
      },
      { threshold: 0.5 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [value]);

  return (
    <div className="flex flex-col items-center gap-3">
      <span
        ref={ref}
        className="text-7xl sm:text-8xl md:text-[96px] font-semibold tracking-tight"
        style={{ color: "var(--accent)", letterSpacing: "-0.03em" }}
      >
        {displayed}
      </span>
      <span className="text-sm text-text-muted">{label}</span>
    </div>
  );
}
