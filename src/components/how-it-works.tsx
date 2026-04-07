"use client";

import { useScrollFade } from "./hooks";
import { AnimatedStat } from "./animated-stat";
import { stats } from "./data";

export function HowItWorks() {
  const fadeRef = useScrollFade();

  return (
    <section className="py-28 sm:py-36 px-6">
      <div
        className="fade-in max-w-4xl mx-auto grid grid-cols-1 sm:grid-cols-3 gap-16 text-center"
        ref={fadeRef}
      >
        {stats.map((s) => (
          <AnimatedStat key={s.label} value={s.value} label={s.label} />
        ))}
      </div>
    </section>
  );
}
