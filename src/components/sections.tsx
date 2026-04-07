"use client";

import { ExternalLink, Mail, Phone, MessageCircle, ArrowDown, Zap, Bot, Rocket } from "lucide-react";
import { WhatsAppIcon, LinkedInIcon } from "./icons";
import { WA_LINK, projects, steps, team, pillars } from "./data";

type FadeRef = (node: HTMLElement | null) => void;

const pillarIcons = { zap: Zap, bot: Bot, rocket: Rocket } as const;

/* ---- Nav ---- */
export function Nav({ scrolled }: { scrolled: boolean }) {
  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 h-16 flex items-center justify-between px-6 md:px-12 transition-all duration-300 ${
        scrolled ? "nav-scrolled" : ""
      }`}
    >
      <span className="text-lg font-bold tracking-tight">Parrit.ai</span>
      <div className="flex items-center gap-6">
        <a href="#cas" className="hidden sm:inline text-sm text-muted hover:text-foreground transition-colors">
          Cas d&apos;usage
        </a>
        <a href="#contact" className="hidden sm:inline text-sm text-muted hover:text-foreground transition-colors">
          Contact
        </a>
        <a
          href={WA_LINK}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2 rounded-full bg-whatsapp/90 hover:bg-whatsapp px-4 py-2 text-sm font-medium text-white transition-colors"
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
    <section className="min-h-screen flex flex-col items-center justify-center px-6 text-center pt-16">
      <div className="fade-in max-w-4xl" ref={fadeRef}>
        <h1 className="text-4xl sm:text-5xl md:text-7xl font-bold tracking-tight leading-[1.1] mb-6">
          IA, Automatisation
          <br />& Agents pour entreprises
        </h1>
        <p className="text-lg sm:text-xl text-muted max-w-2xl mx-auto mb-10">
          On construit, on déploie, on opère.
          <br className="hidden sm:block" /> Vous récoltez les résultats.
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12">
          <a
            href={WA_LINK}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 rounded-full bg-accent hover:bg-accent-light px-8 py-3.5 text-base font-medium text-white transition-colors"
          >
            <MessageCircle className="w-5 h-5" />
            Discuter sur WhatsApp
          </a>
          <a
            href="#cas"
            className="flex items-center gap-2 rounded-full border border-card-border hover:border-muted px-8 py-3.5 text-base font-medium text-foreground transition-colors"
          >
            Voir les cas d&apos;usage
            <ArrowDown className="w-4 h-4" />
          </a>
        </div>
        <p className="text-sm text-muted">Fondé par Paul Larmaraud &amp; Yukun Leng</p>
      </div>
    </section>
  );
}

/* ---- Pillars ---- */
export function Pillars({ fadeRef }: { fadeRef: FadeRef }) {
  return (
    <section className="py-24 sm:py-32 px-6">
      <div className="max-w-6xl mx-auto">
        <h2 className="fade-in text-3xl sm:text-4xl font-bold tracking-tight text-center mb-16" ref={fadeRef}>
          Ce qu&apos;on fait
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {pillars.map((p) => {
            const Icon = pillarIcons[p.icon];
            return (
              <div key={p.title} className="fade-in rounded-xl border border-card-border bg-card p-8" ref={fadeRef}>
                <div className="mb-4"><Icon className="w-6 h-6 text-accent" /></div>
                <h3 className="text-lg font-semibold mb-2">{p.title}</h3>
                <p className="text-muted text-sm leading-relaxed">{p.desc}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

/* ---- Projects ---- */
export function Projects({ fadeRef }: { fadeRef: FadeRef }) {
  return (
    <section id="cas" className="py-24 sm:py-32 px-6">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="fade-in text-3xl sm:text-4xl font-bold tracking-tight mb-4" ref={fadeRef}>
            Mis en production
          </h2>
          <p className="fade-in text-muted text-lg" ref={fadeRef}>
            Pas des démos. Des systèmes qui tournent.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((project) => (
            <ProjectCard key={project.name} project={project} fadeRef={fadeRef} />
          ))}
        </div>
      </div>
    </section>
  );
}

function ProjectCard({
  project,
  fadeRef,
}: {
  project: (typeof projects)[number];
  fadeRef: FadeRef;
}) {
  return (
    <div className="fade-in rounded-xl border border-card-border bg-card p-6 flex flex-col" ref={fadeRef}>
      <span className={`inline-block self-start text-xs font-medium px-2.5 py-1 rounded-full mb-4 ${project.badgeColor}`}>
        {project.badge}
      </span>
      <h3 className="text-base font-semibold mb-2">{project.name}</h3>
      <p className="text-muted text-sm leading-relaxed mb-4 flex-1">{project.description}</p>
      <div className="flex items-center justify-between mt-auto pt-4 border-t border-card-border">
        <span className="flex items-center gap-2 text-xs text-muted">
          <span className="w-2 h-2 rounded-full bg-success inline-block" />
          {project.status}
        </span>
        {"link" in project && project.link && (
          <a href={project.link} target="_blank" rel="noopener noreferrer" className="text-accent hover:text-accent-light transition-colors">
            <ExternalLink className="w-4 h-4" />
          </a>
        )}
      </div>
    </div>
  );
}

/* ---- Steps ---- */
export function Steps({ fadeRef }: { fadeRef: FadeRef }) {
  return (
    <section className="py-24 sm:py-32 px-6">
      <div className="max-w-4xl mx-auto">
        <h2 className="fade-in text-3xl sm:text-4xl font-bold tracking-tight text-center mb-16" ref={fadeRef}>
          Comment ça marche
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          {steps.map((step) => (
            <div key={step.num} className="fade-in text-center" ref={fadeRef}>
              <div className="text-accent text-4xl font-bold mb-4">{step.num}</div>
              <h3 className="text-lg font-semibold mb-2">{step.title}</h3>
              <p className="text-muted text-sm leading-relaxed">{step.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ---- Team ---- */
export function Team({ fadeRef }: { fadeRef: FadeRef }) {
  return (
    <section className="py-24 sm:py-32 px-6">
      <div className="max-w-4xl mx-auto">
        <h2 className="fade-in text-3xl sm:text-4xl font-bold tracking-tight text-center mb-16" ref={fadeRef}>
          L&apos;équipe
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 max-w-2xl mx-auto">
          {team.map((member) => (
            <div key={member.name} className="fade-in rounded-xl border border-card-border bg-card p-8 text-center" ref={fadeRef}>
              <h3 className="text-lg font-semibold mb-1">{member.name}</h3>
              <p className="text-muted text-sm mb-4">{member.role}</p>
              <a
                href={member.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-sm text-accent hover:text-accent-light transition-colors"
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

/* ---- CTA ---- */
export function CTA({ fadeRef }: { fadeRef: FadeRef }) {
  return (
    <section id="contact" className="py-24 sm:py-32 px-6">
      <div className="fade-in max-w-3xl mx-auto text-center" ref={fadeRef}>
        <h2 className="text-3xl sm:text-5xl font-bold tracking-tight mb-8">Un projet ? On en parle.</h2>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-8">
          <a
            href={WA_LINK}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 rounded-full bg-whatsapp hover:bg-whatsapp/80 px-8 py-4 text-base font-medium text-white transition-colors"
          >
            <WhatsAppIcon className="w-5 h-5" />
            Discuter sur WhatsApp
          </a>
          <a
            href="tel:+33759665687"
            className="flex items-center gap-2 rounded-full border border-card-border hover:border-muted px-8 py-4 text-base font-medium text-foreground transition-colors"
          >
            <Phone className="w-5 h-5" />
            +33 7 59 66 56 87
          </a>
        </div>
        <a href="mailto:paul@parrit.ai" className="inline-flex items-center gap-2 text-muted hover:text-foreground transition-colors text-sm mb-4">
          <Mail className="w-4 h-4" />
          paul@parrit.ai
        </a>
        <p className="text-muted text-sm">Réponse en moins de 2 heures</p>
      </div>
    </section>
  );
}

/* ---- Footer ---- */
export function Footer() {
  return (
    <footer className="border-t border-card-border py-8 px-6">
      <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-muted">
        <span>&copy; 2026 SASU PARRIT.AI &mdash; Rueil-Malmaison</span>
        <div className="flex items-center gap-4">
          <span>Mentions légales</span>
          <span>CGV</span>
          <span>Tous droits réservés</span>
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
      className="fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full bg-whatsapp hover:bg-whatsapp/80 flex items-center justify-center shadow-lg shadow-whatsapp/25 transition-colors"
      aria-label="Contacter sur WhatsApp"
    >
      <WhatsAppIcon className="w-7 h-7 text-white" />
    </a>
  );
}
