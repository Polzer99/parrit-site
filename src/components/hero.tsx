"use client";

import { CTAButton } from "./cta-button";

export function Hero() {
  return (
    <section className="relative min-h-screen flex flex-col items-center justify-center px-6 text-center hero-glow">
      <p
        className="hero-animate text-sm tracking-[0.25em] uppercase mb-8"
        style={{ color: "var(--accent)" }}
      >
        PARRIT.AI
      </p>

      <h1
        className="hero-animate hero-animate-delay-1 text-5xl sm:text-6xl md:text-7xl lg:text-[80px] font-semibold leading-[1.05] max-w-4xl"
        style={{ letterSpacing: "-0.03em" }}
      >
        Deux fois moins de t&acirc;ches
        <br />
        r&eacute;p&eacute;titives. D&egrave;s maintenant.
      </h1>

      <p className="hero-animate hero-animate-delay-2 mt-8 max-w-xl text-lg text-text-muted font-light leading-relaxed">
        On automatise vos processus avec l&rsquo;IA.
        <br />
        Prototypage en 48h. D&eacute;ploiement inclus.
      </p>

      <div className="hero-animate hero-animate-delay-3 mt-10 flex flex-col items-center gap-3">
        <CTAButton />
        <p className="text-xs text-text-muted" style={{ opacity: 0.6 }}>
          R&eacute;ponse en moins de 2h &middot; Gratuit
        </p>
      </div>
    </section>
  );
}
