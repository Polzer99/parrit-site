"use client";

import { useScrollFade } from "./hooks";
import { clients } from "./data";

export function SocialProof() {
  const fadeRef = useScrollFade();

  return (
    <section className="py-12 px-6">
      <div className="fade-in max-w-3xl mx-auto text-center" ref={fadeRef}>
        <p className="text-sm text-text-muted tracking-wide">
          {clients.map((c, i) => (
            <span key={c}>
              {c}
              {i < clients.length - 1 && (
                <span className="mx-3 opacity-40">&middot;</span>
              )}
            </span>
          ))}
        </p>
      </div>
    </section>
  );
}
