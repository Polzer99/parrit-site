"use client";

import { ExternalLink, Users, Terminal, FileText, Cog, Mail, ArrowRight } from "lucide-react";
import { WhatsAppIcon, LinkedInIcon } from "./icons";
import { WA_LINK, painPoints, services, caseStudies, teamMembers } from "./data";

type FadeRef = (node: HTMLElement | null) => void;

const serviceIcons = {
  users: Users,
  terminal: Terminal,
  file: FileText,
  cog: Cog,
} as const;

/* ---- Nav ---- */
export function Nav({ scrolled }: { scrolled: boolean }) {
  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 h-14 flex items-center justify-between px-6 md:px-12 transition-all duration-300 ${
        scrolled ? "nav-scrolled" : ""
      }`}
    >
      <span
        className="text-base tracking-[0.2em] uppercase"
        style={{ fontFamily: "Georgia, 'Times New Roman', serif", color: "#c8956c" }}
      >
        PARRIT.AI
      </span>
      <div className="flex items-center gap-6">
        <a
          href="#cas"
          className="hidden sm:inline text-sm text-muted hover:text-foreground transition-colors"
        >
          Cas d&apos;usage
        </a>
        <a
          href="#contact"
          className="hidden sm:inline text-sm text-muted hover:text-foreground transition-colors"
        >
          Contact
        </a>
        <a
          href={WA_LINK}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2 px-4 py-1.5 text-sm font-medium transition-colors"
          style={{
            backgroundColor: "#c8956c",
            color: "#2a2420",
            borderRadius: "4px",
          }}
        >
          <WhatsAppIcon className="w-4 h-4" />
          <span className="hidden sm:inline">WhatsApp</span>
        </a>
      </div>
    </nav>
  );
}

/* ---- Hero ---- */
export function Hero({ fadeRef }: { fadeRef: FadeRef }) {
  return (
    <section className="min-h-screen flex flex-col items-center justify-center px-6 text-center pt-14">
      <div className="fade-in max-w-4xl" ref={fadeRef}>
        <h1
          className="text-4xl sm:text-5xl md:text-6xl leading-[1.15] mb-6"
          style={{ fontFamily: "Georgia, 'Times New Roman', serif", color: "#c8956c" }}
        >
          Votre entreprise, avec deux fois moins de taches repetitives des aujourd&apos;hui
        </h1>
        <p className="text-lg sm:text-xl text-muted max-w-2xl mx-auto mb-10">
          Automatisation des processus par IA &middot; Laissez votre equipe se concentrer sur ce qui compte vraiment
        </p>
        <div className="flex flex-col items-center gap-4 mb-8">
          <a
            href={WA_LINK}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-10 py-4 text-lg font-medium transition-colors"
            style={{
              backgroundColor: "#c8956c",
              color: "#2a2420",
              borderRadius: "4px",
            }}
          >
            Discuter avec Paul
            <ArrowRight className="w-5 h-5" />
          </a>
          <p className="text-sm text-muted">
            Reponse en moins de 2 heures &middot; Gratuit et sans engagement
          </p>
        </div>
        <p className="text-xs text-muted">
          Parrit.ai &middot; Entreprise francaise &middot; Paul Larmaraud &amp; Yukun Leng
        </p>
      </div>
    </section>
  );
}

/* ---- Pain Points ---- */
export function PainPoints({ fadeRef }: { fadeRef: FadeRef }) {
  return (
    <section className="py-24 sm:py-32 px-6">
      <div className="max-w-5xl mx-auto">
        <h2
          className="fade-in text-3xl sm:text-4xl text-center mb-16"
          ref={fadeRef}
          style={{ fontFamily: "Georgia, 'Times New Roman', serif", color: "#c8956c" }}
        >
          Avez-vous ces problemes ?
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {painPoints.map((p) => (
            <div
              key={p.title}
              className="fade-in p-6 transition-colors"
              ref={fadeRef}
              style={{
                backgroundColor: "#332d28",
                borderLeft: "2px solid #c8956c",
                borderRadius: "4px",
              }}
            >
              <h3 className="text-base font-semibold mb-2 text-foreground">{p.title}</h3>
              <p className="text-sm text-muted leading-relaxed">{p.desc}</p>
            </div>
          ))}
        </div>
        <div
          className="fade-in mt-12 p-6 text-center"
          ref={fadeRef}
          style={{
            backgroundColor: "#332d28",
            borderRadius: "4px",
            borderLeft: "2px solid #c8956c",
          }}
        >
          <p className="text-foreground text-sm sm:text-base leading-relaxed">
            Ces taches, l&apos;IA peut les faire a votre place. Votre equipe merite de se concentrer sur l&apos;essentiel.
          </p>
        </div>
      </div>
    </section>
  );
}

/* ---- Services ---- */
export function Services({ fadeRef }: { fadeRef: FadeRef }) {
  return (
    <section className="py-24 sm:py-32 px-6">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-16">
          <h2
            className="fade-in text-3xl sm:text-4xl mb-4"
            ref={fadeRef}
            style={{ fontFamily: "Georgia, 'Times New Roman', serif", color: "#c8956c" }}
          >
            Nos quatre services cles
          </h2>
          <p className="fade-in text-muted text-base" ref={fadeRef}>
            Couvrant les points de douleur les plus courants en entreprise
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {services.map((s) => {
            const Icon = serviceIcons[s.icon];
            return (
              <div
                key={s.title}
                className="fade-in p-6 transition-colors"
                ref={fadeRef}
                style={{
                  backgroundColor: "#332d28",
                  borderLeft: "2px solid #c8956c",
                  borderRadius: "4px",
                }}
              >
                <div
                  className="w-10 h-10 rounded-full flex items-center justify-center mb-4"
                  style={{ backgroundColor: "rgba(200, 149, 108, 0.15)" }}
                >
                  <Icon className="w-5 h-5" style={{ color: "#c8956c" }} />
                </div>
                <h3 className="text-base font-semibold mb-2 text-foreground">{s.title}</h3>
                <p className="text-sm text-muted leading-relaxed">{s.desc}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

/* ---- Case Studies ---- */
export function CaseStudies({ fadeRef }: { fadeRef: FadeRef }) {
  return (
    <section id="cas" className="py-24 sm:py-32 px-6">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-16">
          <h2
            className="fade-in text-3xl sm:text-4xl mb-4"
            ref={fadeRef}
            style={{ fontFamily: "Georgia, 'Times New Roman', serif", color: "#c8956c" }}
          >
            Mis en production
          </h2>
          <p className="fade-in text-muted text-base" ref={fadeRef}>
            Pas des demos. Des systemes qui tournent.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {caseStudies.map((c) => (
            <CaseCard key={c.name} study={c} fadeRef={fadeRef} />
          ))}
        </div>
      </div>
    </section>
  );
}

function CaseCard({
  study,
  fadeRef,
}: {
  study: (typeof caseStudies)[number];
  fadeRef: FadeRef;
}) {
  return (
    <div
      className="fade-in p-6 flex flex-col transition-colors"
      ref={fadeRef}
      style={{
        backgroundColor: "#332d28",
        borderLeft: "2px solid #c8956c",
        borderRadius: "4px",
      }}
    >
      <span
        className="inline-block self-start text-xs font-medium px-2.5 py-1 mb-4"
        style={{
          backgroundColor: "rgba(200, 149, 108, 0.15)",
          color: "#c8956c",
          borderRadius: "4px",
          letterSpacing: "0.05em",
        }}
      >
        {study.badge}
      </span>
      <h3 className="text-lg font-semibold mb-1 text-foreground">{study.name}</h3>
      <p className="text-sm text-muted mb-1">{study.subtitle}</p>
      <p className="text-xs text-muted mb-3">{study.details}</p>

      {study.problem && (
        <p className="text-sm text-muted leading-relaxed mb-1">
          <span className="text-foreground font-medium">Probleme :</span> {study.problem}
        </p>
      )}
      {study.solution && (
        <p className="text-sm text-muted leading-relaxed mb-4">
          <span className="text-foreground font-medium">Solution :</span> {study.solution}
        </p>
      )}

      <div className="flex items-center justify-between mt-auto pt-4" style={{ borderTop: "1px solid #4a3f37" }}>
        <span className="flex items-center gap-2 text-xs text-muted">
          <span
            className="w-2 h-2 rounded-full inline-block"
            style={{ backgroundColor: "#22c55e" }}
          />
          {study.status}
        </span>
        {study.link && (
          <a
            href={study.link}
            target="_blank"
            rel="noopener noreferrer"
            className="transition-colors"
            style={{ color: "#c8956c" }}
          >
            <ExternalLink className="w-4 h-4" />
          </a>
        )}
      </div>
    </div>
  );
}

/* ---- Team ---- */
export function Team({ fadeRef }: { fadeRef: FadeRef }) {
  return (
    <section className="py-24 sm:py-32 px-6">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-6">
          <h2
            className="fade-in text-3xl sm:text-4xl mb-4"
            ref={fadeRef}
            style={{ fontFamily: "Georgia, 'Times New Roman', serif", color: "#c8956c" }}
          >
            Qui sommes-nous ?
          </h2>
          <p className="fade-in text-muted text-base max-w-2xl mx-auto mb-12" ref={fadeRef}>
            Parrit.ai &mdash; Experts en automatisation IA qui comprennent votre metier. Plus de dix ans d&apos;experience dans les grandes entreprises.
          </p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 max-w-3xl mx-auto">
          {teamMembers.map((member) => (
            <div
              key={member.name}
              className="fade-in p-6 transition-colors"
              ref={fadeRef}
              style={{
                backgroundColor: "#332d28",
                borderLeft: "2px solid #c8956c",
                borderRadius: "4px",
              }}
            >
              <h3 className="text-lg font-semibold mb-1 text-foreground">{member.name}</h3>
              <p className="text-sm mb-3" style={{ color: "#c8956c" }}>
                {member.role}
              </p>
              <p className="text-sm text-muted leading-relaxed mb-4">{member.desc}</p>
              <a
                href={member.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-sm transition-colors"
                style={{ color: "#c8956c" }}
              >
                <LinkedInIcon className="w-4 h-4" />
                LinkedIn
              </a>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ---- CTA Final ---- */
export function CTAFinal({ fadeRef }: { fadeRef: FadeRef }) {
  return (
    <section id="contact" className="py-24 sm:py-32 px-6">
      <div className="fade-in max-w-3xl mx-auto text-center" ref={fadeRef}>
        <h2
          className="text-3xl sm:text-5xl mb-4"
          style={{ fontFamily: "Georgia, 'Times New Roman', serif", color: "#c8956c" }}
        >
          Pret a automatiser ?
        </h2>
        <p className="text-muted text-base mb-10">
          Un appel de 15 minutes suffit pour identifier vos gains.
        </p>
        <div className="flex flex-col items-center gap-4 mb-8">
          <a
            href={WA_LINK}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-10 py-4 text-lg font-medium transition-colors"
            style={{
              backgroundColor: "#c8956c",
              color: "#2a2420",
              borderRadius: "4px",
            }}
          >
            Discuter avec Paul sur WhatsApp
            <ArrowRight className="w-5 h-5" />
          </a>
        </div>
        <a
          href="mailto:paul@parrit.ai"
          className="inline-flex items-center gap-2 text-muted hover:text-foreground transition-colors text-sm"
        >
          <Mail className="w-4 h-4" />
          Ou ecrivez-nous : paul@parrit.ai
        </a>
      </div>
    </section>
  );
}

/* ---- Footer ---- */
export function Footer() {
  return (
    <footer className="py-8 px-6" style={{ borderTop: "1px solid #4a3f37" }}>
      <div className="max-w-5xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-muted">
        <span>&copy; 2026 SASU PARRIT.AI &mdash; Rueil-Malmaison</span>
        <div className="flex items-center gap-4">
          <a href="mailto:paul@parrit.ai" className="hover:text-foreground transition-colors">
            paul@parrit.ai
          </a>
          <a
            href={WA_LINK}
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-foreground transition-colors"
          >
            WhatsApp
          </a>
          <a
            href="https://www.linkedin.com/in/paul-larmaraud/"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-foreground transition-colors"
          >
            LinkedIn
          </a>
        </div>
      </div>
    </footer>
  );
}

/* ---- Floating WhatsApp ---- */
export function FloatingWhatsApp() {
  return (
    <a
      href={WA_LINK}
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full flex items-center justify-center shadow-lg transition-colors"
      style={{ backgroundColor: "#c8956c" }}
      aria-label="Contacter sur WhatsApp"
    >
      <WhatsAppIcon className="w-7 h-7" style={{ color: "#2a2420" }} />
    </a>
  );
}
