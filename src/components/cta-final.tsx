"use client";

import { useScrollFade } from "./hooks";
import { CTAButton } from "./cta-button";

export function CTAFinal() {
  const fadeRef = useScrollFade();

  return (
    <section className="py-28 sm:py-36 px-6">
      <div
        className="fade-in max-w-3xl mx-auto flex flex-col items-center text-center"
        ref={fadeRef}
      >
        <h2
          className="text-5xl sm:text-6xl font-semibold mb-10"
          style={{ letterSpacing: "-0.03em" }}
        >
          Pr&ecirc;t ?
        </h2>
        <CTAButton />
      </div>
    </section>
  );
}
