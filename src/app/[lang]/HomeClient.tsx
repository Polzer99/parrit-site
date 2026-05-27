"use client";

import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import LanguageSwitcher from "@/components/LanguageSwitcher";
import { captureTouch, getAttribution } from "@/lib/attribution";
import type { Dictionary, Locale } from "./dictionaries";

const WEBHOOK_URL = "https://n8n.srv1115145.hstgr.cloud/webhook/parrit-lead";

/* ───────────────────────────────────────────────
   COPY — bilingue inline (anti-jargon, simple)
   ─────────────────────────────────────────────── */
type Lang = "fr" | "en" | "pt-BR";

const COPY = {
  fr: {
    osTitle: "parrit.ai — Operating System",
    brand: "PARRIT",
    tagline: "Une équipe d'agents IA qui bosse pour vous.",
    sub: "Quatre agents sur mesure, branchés sur votre stack. Ils opèrent votre back-office, génèrent vos rendez-vous, prototypent vos outils, forment vos équipes. Même quand vous dormez.",
    cta: "Parler à Paul",
    ctaMicro: "Réponse sous 24h · sans engagement",
    leftDock: {
      title: "Bureau",
      items: [
        { id: "manifeste", label: "Manifeste.md", icon: "doc" },
        { id: "methode", label: "Méthode.md", icon: "doc" },
        { id: "cas", label: "Cas-clients.md", icon: "folder" },
        { id: "paul", label: "Paul.vcf", icon: "person" },
        { id: "yukun", label: "Yukun.vcf", icon: "person" },
        { id: "open", label: "LinkedIn Paul ↗", icon: "external", href: "https://www.linkedin.com/in/paullarmaraud/" },
      ],
    },
    rightDock: {
      title: "Offres",
      hint: "Cliquer une offre pour ouvrir le détail",
    },
    offers: [
      {
        id: "back-office",
        chip: "Back-office",
        title: "Gains de temps sur les tâches admin & répétitives",
        sub: "(Transformation administrative du quotidien)",
        pitch: "On automatise ce qui pèse sur vos équipes : paperasse, conformité, suivi RFP, reporting consolidé. Un outil propriétaire, livré et posé chez vous.",
        bullets: [
          "Cadrage 45 min : on choisit un seul use case précis",
          "Outil livré en 5 à 15 jours, code audité par notre agence partenaire",
          "Forme : interface web légère, agent silencieux dans votre stack, ou simple automation",
          "Mise en prod + formation de vos équipes inclus",
        ],
        proof: [
          "Compliance officer agent — vérification automatique de factures, contrats, RFP",
          "Reporting CEO consolidé — KPIs commerciaux + opérationnels (Excel, CRM, ERP)",
          "OS d'exploitation cabinet d'avocats — mails, RFP, suivi clients orchestrés",
        ],
        notfor: "Si vous voulez « tester l'IA » sans use case précis, ce n'est pas pour vous.",
        accent: "#5FAF8E",
        clusters: [
          {
            label: "Finance & Compliance",
            agents: [
              { name: "Compliance officer", status: "live" },
              { name: "Reporting CEO consolidé", status: "live" },
              { name: "Suivi RFP & devis", status: "live" },
              { name: "Audit factures auto", status: "live" },
            ],
          },
          {
            label: "Opérations & Supply",
            agents: [
              { name: "Gestion des stocks", status: "live" },
              { name: "Supply chain monitor", status: "live" },
              { name: "Suivi commandes e-commerce", status: "live" },
              { name: "Inventaire multi-canaux", status: "soon" },
            ],
          },
          {
            label: "Documents & Mails",
            agents: [
              { name: "Tri inbox dirigeant", status: "live" },
              { name: "Réponse semi-auto", status: "live" },
              { name: "Veille juridique daily", status: "live" },
              { name: "Archivage intelligent", status: "soon" },
            ],
          },
        ],
      },
      {
        id: "business",
        chip: "Acquisition",
        title: "Génération de business",
        sub: "RDV qualifiés via signaux d'intention",
        pitch: "On capte les signaux en ligne (podcasts, events, posts LinkedIn) au bon moment, et on déclenche une prise de contact ultra-personnalisée. Pas de blast Sales Nav.",
        bullets: [
          "Identification cible + timing d'achat (levée, recrutement, prise de parole)",
          "Capture auto 7j/7 des signaux → enrichissement contacts (Hunter, Enrow)",
          "Copywriting ancré sur le verbatim exact de la personne",
          "Alerte Telegram + brief contextualisé avant chaque RDV",
        ],
        proof: [
          "Marque luxe — RDV direction marketing suite à un panel IA retail",
          "Courtier énergie B2B — pipeline syndic copro, 4 TPs séquencés",
          "Parrit pour son propre compte — deals en cours avec marques internationales",
        ],
        notfor: "Ticket moyen faible ou logique volume ? Pas pour vous.",
        accent: "#c8956c",
        clusters: [
          {
            label: "Growth & Acquisition",
            agents: [
              { name: "Équipe growth outbound", status: "live" },
              { name: "Référencement acquisition", status: "live" },
              { name: "Capture signaux podcasts", status: "live" },
              { name: "Capture signaux events B2B", status: "live" },
            ],
          },
          {
            label: "Marketing & Copy",
            agents: [
              { name: "Équipe marketing copywriting", status: "live" },
              { name: "Personnalisation 1-to-1", status: "live" },
              { name: "A/B testing copy", status: "live" },
              { name: "Brand voice tuner", status: "soon" },
            ],
          },
          {
            label: "Sales & RDV",
            agents: [
              { name: "Brief prospect avant RDV", status: "live" },
              { name: "Pipeline CRM auto-update", status: "live" },
              { name: "Relances multi-canaux", status: "live" },
              { name: "Closing playbook agent", status: "soon" },
            ],
          },
        ],
      },
      {
        id: "prototype",
        chip: "Prototypage",
        title: "Prototypage rapide",
        sub: "Voir l'IA marcher avant d'investir lourd",
        pitch: "Vous avez identifié un sujet pénible dans la boîte. On le transforme en outil qui marche, livré en quelques jours. Audit code par agence partenaire avant livraison.",
        bullets: [
          "Un sujet, défini, mesurable — pas un programme",
          "Stack Claude Code = 10× plus vite que les méthodes classiques",
          "Trois familles : back-office pénible / business / agent qui reproduit un humain",
          "Documentation technique + formation à la livraison",
        ],
        proof: [
          "Capture leads multi-canaux artisan haut de gamme — TikTok/Snap/e-commerce → WhatsApp",
          "Référencement Amazon vendeur retail — réécriture auto fiches produits",
          "Bot supervision veille cabinet d'avocats — filtre humain en amont",
        ],
        notfor: "Vous cherchez un consultant qui produit un audit ou un deck ? Pas pour vous.",
        accent: "#C44536",
        clusters: [
          {
            label: "Engineering",
            agents: [
              { name: "Full-stack builder", status: "live" },
              { name: "API integrator", status: "live" },
              { name: "Merge conflict mediator", status: "live" },
              { name: "Test runner auto", status: "soon" },
            ],
          },
          {
            label: "Produit & UX",
            agents: [
              { name: "PRD V0 auto-généré", status: "live" },
              { name: "User research synthétiseur", status: "live" },
              { name: "Wireframe to code", status: "soon" },
              { name: "Persona simulator", status: "soon" },
            ],
          },
          {
            label: "Data & Veille",
            agents: [
              { name: "Scraper marché ciblé", status: "live" },
              { name: "Veille concurrentielle", status: "live" },
              { name: "GEO / Amazon Rufus", status: "live" },
              { name: "Dashboard KPI sur mesure", status: "live" },
            ],
          },
        ],
      },
      {
        id: "formation",
        chip: "Formation",
        title: "Formation hands-on",
        sub: "Vos équipes construisent leur agent en 2 jours",
        pitch: "Format Sprint Builders : chaque participant prototype son cas métier réel avec Claude Code + Gemini. Sortie : un outil qui tourne dans leur quotidien.",
        bullets: [
          "Hackathon Découverte 1j — premier agent posé",
          "Sprint Builder 2j (format phare) — 6 à 8 personnes, cas réels",
          "Cohorte Stratégique 6 semaines — équipe complète",
          "Train-the-Trainer pour internaliser la méthode",
        ],
        proof: [
          "Decathlon — Sprint Builders en discussion (United T&D)",
          "Catho Lille — Sprint Builders dirigeants (Sprint Builders Université)",
          "Didier Barbanneau — pack hands-on autonomie Claude Code (B2C)",
        ],
        notfor: "Qualiopi finalisée juin 2026. D'ici là, financement OPCO non garanti.",
        accent: "#2A2420",
        clusters: [
          {
            label: "Formats",
            agents: [
              { name: "Hackathon Découverte 1j", status: "live" },
              { name: "Sprint Builder 2j", status: "live" },
              { name: "Cohorte Stratégique 6 sem", status: "live" },
              { name: "Train-the-Trainer", status: "live" },
            ],
          },
          {
            label: "Stack enseignée",
            agents: [
              { name: "Claude Code (Anthropic)", status: "live" },
              { name: "Gemini Vertex AI", status: "live" },
              { name: "n8n workflow orchestration", status: "live" },
              { name: "MCP servers maison", status: "live" },
            ],
          },
          {
            label: "Cas-types prototypés",
            agents: [
              { name: "Agent recherche d'emploi", status: "live" },
              { name: "Veille juridique CEO", status: "live" },
              { name: "Capture WhatsApp leads", status: "live" },
              { name: "GEO e-commerce marketplace", status: "live" },
            ],
          },
        ],
      },
    ],
    panel: {
      manifeste: {
        title: "Manifeste",
        body: [
          "On construit. On ne conseille pas.",
          "Pas de deck. Pas de TJM. Pas de mot inventé pour faire pro.",
          "Un sujet précis défini en 45 minutes. Un outil livré en quelques jours, posé chez vous. Code audité par une agence dev partenaire avant la mise en prod.",
          "On garde la main : Paul shippe le 0 → 1, Yukun pousse en production. Pas de junior, pas de sous-traitant.",
          "Si ça ne tourne pas en prod à la fin, on n'a pas fait notre travail.",
        ],
      },
      methode: {
        title: "Méthode",
        steps: [
          { n: "01", t: "Cadrage 45 min — gratuit", d: "Un call avec Paul. On choisit un sujet précis, mesurable. Pas un programme de transformation. Si ce n'est pas pour vous, on vous le dit." },
          { n: "02", t: "Construction 5-15 jours", d: "Paul code l'outil avec Claude Code, branché sur votre stack (Gmail, CRM, ERP, Google Sheets…). Point hebdo de 30 min pour ajuster en marchant." },
          { n: "03", t: "Audit code par agence partenaire", d: "Avant livraison, une agence dev sénior (10+ ans d'expérience) audite la sécurité, la maintenabilité et la conformité. C'est ce qui rassure votre DSI." },
          { n: "04", t: "Livraison + formation chez vous", d: "Mise en prod sur votre infrastructure. Documentation technique. Demi-journée de formation à vos équipes. Vous repartez autonome." },
        ],
      },
      cas: {
        title: "Cas clients",
        intro: "Cas réels Parrit, anonymisés par respect de la confidentialité. Détails et chiffres en call.",
        items: [
          { t: "Marque artisan haut de gamme — coutellerie", d: "Capture leads multi-canaux (TikTok + Snapchat + e-commerce + tel) → WhatsApp segmenté par typologie d'acheteur (B2C / B2B Pro Restau / Collector)" },
          { t: "Cabinet d'avocats d'affaires", d: "OS d'exploitation pour la direction : tri inbox, suivi RFP, veille juridique daily, filtres humains avant publication" },
          { t: "Courtier énergie B2B (PME / syndic copro)", d: "Pipeline outbound 4 touchpoints séquencés ancrés sur la fraîcheur du signal — copy raffinée par persona réel" },
          { t: "Groupe armement (sous NDA)", d: "Compliance officer agent : RFP et contrats vérifiés automatiquement, doublé d'un filtre humain pour validation" },
          { t: "Agence dev sénior", d: "Reporting CEO consolidé — agrégation KPIs commerciaux + opérationnels (Excel, CRM, ERP) en une vue lundi matin" },
          { t: "Décathlon (en discussion)", d: "Sprint Builders dirigeants hands-on — chaque participant prototype son cas métier en 2 jours avec Claude Code + Gemini" },
        ],
      },
      paul: {
        title: "Paul Larmaraud",
        role: "Fondateur · Couteau suisse 0 → 1",
        lines: [
          "Paul Larmaraud",
          "Fondateur Parrit.ai",
          "Code chaque jour, assisté par agents — ship des prototypes",
        ],
        story: [
          "Paul code tous les jours, assisté par ses agents. C'est lui qui shippe les prototypes : pas un sous-traitant, pas un junior.",
          "Avec vous, il construit le périmètre du projet et calcule le retour sur investissement attendu avant de toucher une ligne de code. On ne déploie pas un outil pour le plaisir.",
          "Il préconfigure ensuite les agents — modèles, prompts, intégrations, garde-fous — puis passe le relais à Yukun pour la mise en production.",
          "Son background — produit, opérations, tech et SaaS — fait de lui un vrai couteau suisse pour passer chaque projet de 0 à 1.",
        ],
        facts: [
          { k: "Background", v: "Produit · Opérations · Tech · SaaS" },
          { k: "Stack quotidienne", v: "Claude Code · n8n · Supabase · Vercel" },
          { k: "Email", v: "paul.larmaraud@parrit.ai" },
          { k: "Téléphone", v: "+33 6 83 76 22 19" },
        ],
        cta: "Réserver 15 min avec Paul",
      },
      yukun: {
        title: "Yukun Leng",
        role: "Co-fondatrice · Mise en production",
        lines: [
          "Yukun Leng — 冷宇坤",
          "Co-fondatrice Parrit.ai",
          "10 ans de gestion de flux dans les grands groupes",
        ],
        story: [
          "Yukun prend les agents préconfigurés par Paul et les pousse en production. C'est ce qui fait qu'un prototype tient quand il rencontre vos systèmes réels.",
          "Dix ans comme consultante SAP, à orchestrer les flux opérationnels chez LVMH et d'autres grands groupes. Elle sait ce que veut dire « ça doit tourner tous les jours, sans accroc ».",
          "Sur les projets Parrit, elle pilote l'intégration aux outils du client (ERP, CRM, finance), les tests d'usage métier, et la qualité de service une fois le système livré.",
          "Elle apporte aussi la moitié chinoise de la culture Parrit : exigence, rigueur, et une vraie pratique des deux mondes — pas un cabinet français qui plaque de la « tech Asia ».",
        ],
        facts: [
          { k: "Expérience", v: "10 ans · Consultante SAP · grands groupes" },
          { k: "Rôle chez Parrit", v: "Passage en production · qualité de service" },
          { k: "Langues", v: "Français · Mandarin · Anglais" },
          { k: "Contact", v: "Via Paul — paul.larmaraud@parrit.ai" },
        ],
        cta: "En parler dans un call avec Paul",
      },
    },
    contact: {
      title: "Parler à Paul",
      sub: "Email, téléphone, LinkedIn ou WhatsApp — au choix. Réponse sous 24h.",
      placeholder: "Votre email ou téléphone",
      submit: "Envoyer",
      submitting: "Envoi…",
      thanks: "Merci. Je reviens sous 24h.",
      error: "Échec d'envoi. Écrivez à paul.larmaraud@parrit.ai.",
      micro: "Vos coordonnées ne quittent pas Parrit. RGPD-friendly.",
    },
    waitlist: {
      eyebrow: "Bienvenue chez Parrit",
      title: "Démarrons votre onboarding.",
      sub: "Laissez votre email pro. Paul reprend la main personnellement pour cadrer votre cas et démarrer.",
      placeholder: "nom@entreprise.com",
      hint: "ex : prenom@entreprise.com",
      submit: "Continuer",
      submitting: "Inscription…",
      thanks: "Merci. Paul revient vers vous sous 24h pour démarrer.",
      error: "Échec. Réessayez ou écrivez à paul.larmaraud@parrit.ai.",
      navLabel: "S'inscrire",
      ctaSecondary: "Ou laisser mon email →",
    },
  },
  en: {
    osTitle: "parrit.ai — Operating System",
    brand: "PARRIT",
    tagline: "An AI team working for you.",
    sub: "Four custom agents plugged into your stack. They run your back-office, generate your meetings, prototype your tools, train your teams. Even when you're asleep.",
    cta: "Talk to Paul",
    ctaMicro: "Reply within 24h · no commitment",
    leftDock: {
      title: "Desktop",
      items: [
        { id: "manifeste", label: "Manifesto.md", icon: "doc" },
        { id: "methode", label: "Method.md", icon: "doc" },
        { id: "cas", label: "Case-studies.md", icon: "folder" },
        { id: "paul", label: "Paul.vcf", icon: "person" },
        { id: "open", label: "Open parrit.ai ↗", icon: "external", href: "https://www.linkedin.com/in/paullarmaraud/" },
      ],
    },
    rightDock: {
      title: "Offers",
      hint: "Click an offer to open details",
    },
    offers: [
      {
        id: "back-office",
        chip: "Back-office",
        title: "Time saved on admin & repetitive tasks",
        sub: "(Day-to-day admin transformation)",
        pitch: "We automate what weighs on your teams: paperwork, compliance, RFP tracking, consolidated reporting. A proprietary tool, delivered and deployed at your site.",
        bullets: [
          "45-min scoping call: we pick one precise use case",
          "Tool delivered in 5–15 days, code audited by our partner agency",
          "Form: light web UI, silent agent in your stack, or simple automation",
          "Production deployment + team training included",
        ],
        proof: [
          "Compliance officer agent — auto-check of invoices, contracts, RFPs",
          "Consolidated CEO reporting — sales + ops KPIs (Excel, CRM, ERP)",
          "Law firm operating system — mail, RFPs, client follow-up orchestrated",
        ],
        notfor: "If you want to \"test AI\" without a precise use case, this isn't for you.",
        accent: "#5FAF8E",
      },
      {
        id: "business",
        chip: "Acquisition",
        title: "Business generation",
        sub: "Qualified meetings via intent signals",
        pitch: "We capture online signals (podcasts, events, LinkedIn posts) at the right moment and trigger a hyper-personalized outreach. No Sales Nav blast.",
        bullets: [
          "Target + buying timing identification (fundraise, key hire, public speaking)",
          "24/7 auto capture of signals → contact enrichment (Hunter, Enrow)",
          "Copy anchored on the exact verbatim of the person",
          "Telegram alert + contextual brief before every meeting",
        ],
        proof: [
          "Luxury brand — marketing director meeting after a retail AI panel",
          "B2B energy broker — co-property syndic pipeline, 4 sequenced TPs",
          "Parrit for itself — deals in progress with international brands",
        ],
        notfor: "Low avg ticket or volume play? Not for you.",
        accent: "#c8956c",
      },
      {
        id: "prototype",
        chip: "Prototyping",
        title: "Rapid prototyping",
        sub: "See AI work before heavy investment",
        pitch: "You've spotted a painful topic in the business. We turn it into a working tool, delivered in days. Code audited by partner agency before delivery.",
        bullets: [
          "One topic, defined, measurable — not a program",
          "Claude Code stack = 10× faster than classic methods",
          "Three families: painful back-office / business / human-mimicking agent",
          "Technical documentation + training at delivery",
        ],
        proof: [
          "Premium artisan brand — multi-channel lead capture → WhatsApp",
          "Amazon retail seller — auto product listings rewrite",
          "Law firm watch supervision bot — human filter upfront",
        ],
        notfor: "Looking for a consultant who delivers an audit or deck? Not for you.",
        accent: "#8B6F47",
      },
      {
        id: "formation",
        chip: "Training",
        title: "Hands-on training",
        sub: "Your team builds their agent in 2 days",
        pitch: "Sprint Builders format: each participant prototypes their real business case with Claude Code + Gemini. Output: a tool running in their daily work.",
        bullets: [
          "Discovery Hackathon 1-day — first agent shipped",
          "Sprint Builder 2-day (flagship) — 6 to 8 people, real cases",
          "Strategic Cohort 6 weeks — full team",
          "Train-the-Trainer to internalize the method",
        ],
        proof: [
          "Decathlon — Sprint Builders in discussion (United T&D)",
          "Catho Lille — Executive Sprint Builders",
          "Didier Barbanneau — Claude Code autonomy pack (B2C)",
        ],
        notfor: "Qualiopi finalized June 2026. OPCO funding not guaranteed before then.",
        accent: "#2A2420",
      },
    ],
    panel: {
      manifeste: {
        title: "Manifesto",
        body: [
          "We build. We don't advise.",
          "No deck. No day rate. No made-up word to sound pro.",
          "One precise topic scoped in 45 min. One delivered tool, deployed at your site, in days. Code audited by a partner dev agency before production.",
          "We stay in the seat: Paul ships the 0 → 1, Yukun pushes it to production. No junior, no subcontractor.",
          "If it doesn't run in production at the end, we didn't do our job.",
        ],
      },
      methode: {
        title: "Method",
        steps: [
          { n: "01", t: "45-min scoping — free", d: "A call with Paul. We pick one precise, measurable topic. Not a transformation program. If it's not for you, we say so." },
          { n: "02", t: "5–15 day build", d: "Paul codes the tool with Claude Code, wired into your stack (Gmail, CRM, ERP, Sheets…). 30-min weekly check-in to course-correct." },
          { n: "03", t: "Code audit by partner agency", d: "Before delivery, a senior dev agency (10+ years) audits security, maintainability and compliance. That's what reassures your IT lead." },
          { n: "04", t: "Delivery + training at your site", d: "Deploy on your infrastructure. Technical documentation. Half-day training for your teams. You walk away autonomous." },
        ],
      },
      cas: {
        title: "Case studies",
        intro: "Real Parrit cases, anonymized to respect confidentiality. Details and numbers on call.",
        items: [
          { t: "Premium artisan brand — cutlery", d: "Multi-channel lead capture (TikTok + Snapchat + e-commerce + phone) → WhatsApp segmented by buyer type (B2C / B2B Pro / Collector)" },
          { t: "Business law firm", d: "Operating system for the management: inbox triage, RFP tracking, daily legal watch, human filter before publication" },
          { t: "B2B energy broker", d: "4-touchpoint outbound pipeline anchored on signal freshness — copy refined per real persona" },
          { t: "Defense group (NDA)", d: "Compliance officer agent: RFPs and contracts auto-checked, doubled with a human validation filter" },
          { t: "Senior dev agency", d: "Consolidated CEO reporting — sales + ops KPIs aggregated (Excel, CRM, ERP) into one Monday-morning view" },
          { t: "Decathlon (in discussion)", d: "Executive Sprint Builders hands-on — each participant prototypes their real case in 2 days with Claude Code + Gemini" },
        ],
      },
      paul: {
        title: "Paul Larmaraud",
        role: "Founder · 0 → 1 Swiss army knife",
        lines: [
          "Paul Larmaraud",
          "Founder Parrit.ai",
          "Codes daily, agent-assisted — ships prototypes",
        ],
        story: [
          "Paul codes every day, assisted by his agents. He ships the prototypes himself — no subcontractor, no junior.",
          "With you, he defines the project scope and computes the expected return on investment before writing a line of code. We don't deploy a tool for the sake of it.",
          "He then pre-configures the agents — models, prompts, integrations, guardrails — and hands them off to Yukun for the production rollout.",
          "His background — product, operations, tech and SaaS — makes him a real Swiss army knife to take any project from 0 to 1.",
        ],
        facts: [
          { k: "Background", v: "Product · Operations · Tech · SaaS" },
          { k: "Daily stack", v: "Claude Code · n8n · Supabase · Vercel" },
          { k: "Email", v: "paul.larmaraud@parrit.ai" },
          { k: "Phone", v: "+33 6 83 76 22 19" },
        ],
        cta: "Book 15 min with Paul",
      },
      yukun: {
        title: "Yukun Leng",
        role: "Co-founder · Production rollout",
        lines: [
          "Yukun Leng — 冷宇坤",
          "Co-founder Parrit.ai",
          "10 years orchestrating flows in large groups",
        ],
        story: [
          "Yukun takes the agents Paul has pre-configured and pushes them into production. That's what makes a prototype hold up against your real systems.",
          "Ten years as an SAP consultant, orchestrating operational flows at LVMH and other large groups. She knows what \"it has to run every day, no glitch\" actually means.",
          "On Parrit projects she owns the integration into your tools (ERP, CRM, finance), the business-side user testing, and the quality of service once the system is live.",
          "She also brings the Chinese half of Parrit's culture: rigor, precision, and a real practice of both worlds — not a French firm pasting on \"Asia tech\".",
        ],
        facts: [
          { k: "Experience", v: "10 years · SAP consultant · large groups" },
          { k: "Role at Parrit", v: "Production rollout · quality of service" },
          { k: "Languages", v: "French · Mandarin · English" },
          { k: "Contact", v: "Via Paul — paul.larmaraud@parrit.ai" },
        ],
        cta: "Discuss on a call with Paul",
      },
    },
    contact: {
      title: "Talk to Paul",
      sub: "Email, phone, LinkedIn or WhatsApp — your call. Reply within 24h.",
      placeholder: "Your email or phone",
      submit: "Send",
      submitting: "Sending…",
      thanks: "Thanks. I'll come back within 24h.",
      error: "Send failed. Write to paul.larmaraud@parrit.ai.",
      micro: "Your details stay at Parrit. GDPR-friendly.",
    },
    waitlist: {
      eyebrow: "Welcome to Parrit",
      title: "Start your onboarding.",
      sub: "Drop your work email. Paul personally takes over to scope your case and get you started.",
      placeholder: "name@company.com",
      hint: "e.g. name@company.com",
      submit: "Continue",
      submitting: "Subscribing…",
      thanks: "Thanks. Paul will reach out within 24h.",
      error: "Failed. Retry or write to paul.larmaraud@parrit.ai.",
      navLabel: "Sign up",
      ctaSecondary: "Or just drop my email →",
    },
  },
  "pt-BR": {
    osTitle: "parrit.ai — Operating System",
    brand: "PARRIT",
    tagline: "A gente codifica a ferramenta. A gente entrega.",
    sub: "Sem deck. Sem TJM. Um sistema em produção em dias.",
    cta: "Falar com Paul",
    ctaMicro: "Resposta em 24h · sem compromisso",
    leftDock: {
      title: "Área de trabalho",
      items: [
        { id: "manifeste", label: "Manifesto.md", icon: "doc" },
        { id: "methode", label: "Método.md", icon: "doc" },
        { id: "cas", label: "Casos.md", icon: "folder" },
        { id: "paul", label: "Paul.vcf", icon: "person" },
        { id: "open", label: "Abrir parrit.ai ↗", icon: "external", href: "https://www.linkedin.com/in/paullarmaraud/" },
      ],
    },
    rightDock: { title: "Ofertas", hint: "Clique uma oferta para abrir os detalhes" },
    offers: [], // PT-BR uses EN fallback for offers (Paul flies today, EN/FR is the priority)
    panel: {
      manifeste: { title: "Manifesto", body: [] },
      methode: { title: "Método", steps: [] },
      cas: { title: "Casos", intro: "", items: [] },
      paul: { title: "Paul", role: "", lines: [], story: [], facts: [], cta: "" },
      yukun: { title: "Yukun", role: "", lines: [], story: [], facts: [], cta: "" },
    },
    contact: {
      title: "Falar com Paul",
      sub: "Email, telefone, LinkedIn ou WhatsApp. Resposta em 24h.",
      placeholder: "Seu email ou telefone",
      submit: "Enviar",
      submitting: "Enviando…",
      thanks: "Obrigado. Volto em 24h.",
      error: "Falha. Escreva para paul.larmaraud@parrit.ai.",
      micro: "Seus dados ficam na Parrit. RGPD-friendly.",
    },
    waitlist: {
      eyebrow: "Bem-vindo à Parrit",
      title: "Comece seu onboarding.",
      sub: "Deixe seu email. Paul retoma pessoalmente para iniciar.",
      placeholder: "nome@empresa.com",
      hint: "ex: nome@empresa.com",
      submit: "Continuar",
      submitting: "Inscrevendo…",
      thanks: "Obrigado. Paul retorna em 24h.",
      error: "Falha. Tente de novo.",
      navLabel: "Inscrever",
      ctaSecondary: "Ou só deixar meu email →",
    },
  },
} as const;

type AgentBox = {
  label: string;
  agents: readonly { name: string; status: "live" | "soon" }[];
};
type OfferCopy = {
  id: string;
  chip: string;
  title: string;
  sub: string;
  pitch: string;
  bullets: readonly string[];
  proof: readonly string[];
  notfor: string;
  accent: string;
  clusters?: readonly AgentBox[];
};
type PanelCopy = {
  manifeste: { title: string; body: readonly string[] };
  methode: { title: string; steps: readonly { n: string; t: string; d: string }[] };
  cas: { title: string; intro: string; items: readonly { t: string; d: string }[] };
  paul: {
    title: string;
    role: string;
    lines: readonly string[];
    story: readonly string[];
    facts: readonly { k: string; v: string }[];
    cta: string;
  };
  yukun: {
    title: string;
    role: string;
    lines: readonly string[];
    story: readonly string[];
    facts: readonly { k: string; v: string }[];
    cta: string;
  };
};

type FullCopy = {
  osTitle: string;
  brand: string;
  tagline: string;
  sub: string;
  cta: string;
  ctaMicro: string;
  leftDock: { title: string; items: readonly { id: string; label: string; icon: string; href?: string }[] };
  rightDock: { title: string; hint: string };
  offers: readonly OfferCopy[];
  panel: PanelCopy;
  contact: {
    title: string;
    sub: string;
    placeholder: string;
    submit: string;
    submitting: string;
    thanks: string;
    error: string;
    micro: string;
  };
  waitlist: {
    eyebrow: string;
    title: string;
    sub: string;
    placeholder: string;
    hint: string;
    submit: string;
    submitting: string;
    thanks: string;
    error: string;
    navLabel: string;
    ctaSecondary: string;
  };
};

function getCopy(lang: Lang): FullCopy {
  if (lang === "pt-BR") {
    // PT-BR shell uses EN content for offers/panel until translated
    const base = COPY["pt-BR"] as unknown as FullCopy;
    return {
      ...base,
      offers: COPY.en.offers as unknown as readonly OfferCopy[],
      panel: COPY.en.panel as unknown as PanelCopy,
    };
  }
  return COPY[lang] as unknown as FullCopy;
}

/* ───────────────────────────────────────────────
   ICONS — pixel/comic style inline SVG
   ─────────────────────────────────────────────── */
function IconDoc({ size = 56 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" fill="none">
      <path d="M14 8 H42 L52 18 V56 H14 Z" fill="#F5EBD8" stroke="#2A2420" strokeWidth="2.5" strokeLinejoin="round" />
      <path d="M42 8 V18 H52" fill="none" stroke="#2A2420" strokeWidth="2.5" strokeLinejoin="round" />
      <line x1="22" y1="28" x2="44" y2="28" stroke="#2A2420" strokeWidth="2" />
      <line x1="22" y1="36" x2="44" y2="36" stroke="#2A2420" strokeWidth="2" />
      <line x1="22" y1="44" x2="38" y2="44" stroke="#2A2420" strokeWidth="2" />
    </svg>
  );
}
function IconFolder({ size = 56 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" fill="none">
      <path d="M8 16 H26 L30 22 H56 V52 H8 Z" fill="#c8956c" stroke="#2A2420" strokeWidth="2.5" strokeLinejoin="round" />
      <line x1="12" y1="32" x2="52" y2="32" stroke="#2A2420" strokeWidth="1.5" opacity="0.4" />
    </svg>
  );
}
function IconPerson({ size = 56 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" fill="none">
      <circle cx="32" cy="22" r="10" fill="#F5EBD8" stroke="#2A2420" strokeWidth="2.5" />
      <path d="M14 56 C14 42 21 36 32 36 C43 36 50 42 50 56 Z" fill="#F5EBD8" stroke="#2A2420" strokeWidth="2.5" strokeLinejoin="round" />
      <path d="M24 22 Q24 14 32 14 Q40 14 40 22" stroke="#2A2420" strokeWidth="2" fill="none" />
      <circle cx="28" cy="22" r="1.5" fill="#2A2420" />
      <circle cx="36" cy="22" r="1.5" fill="#2A2420" />
    </svg>
  );
}
function IconExternal({ size = 56 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" fill="none">
      <rect x="10" y="10" width="36" height="36" rx="4" fill="#F5EBD8" stroke="#2A2420" strokeWidth="2.5" />
      <path d="M30 18 H46 V34" stroke="#2A2420" strokeWidth="2.5" fill="none" strokeLinecap="round" />
      <line x1="46" y1="18" x2="28" y2="36" stroke="#2A2420" strokeWidth="2.5" strokeLinecap="round" />
    </svg>
  );
}
function LeftIcon({ name }: { name: string }) {
  if (name === "folder") return <IconFolder />;
  if (name === "person") return <IconPerson />;
  if (name === "external") return <IconExternal />;
  return <IconDoc />;
}

/* Offer icons — bold comic style boxes with accent color */
function OfferIcon({ idx, accent }: { idx: number; accent: string }) {
  // 4 visual variants: gear, signal, hammer, classroom
  const common = {
    width: 64,
    height: 64,
    viewBox: "0 0 64 64",
    fill: "none" as const,
  };
  if (idx === 0) {
    return (
      <svg {...common}>
        <rect x="6" y="6" width="52" height="52" rx="10" fill={accent} stroke="#2A2420" strokeWidth="2.5" />
        <path d="M32 18 L34 24 L40 24 L35 28 L37 34 L32 30 L27 34 L29 28 L24 24 L30 24 Z" fill="#F5EBD8" stroke="#2A2420" strokeWidth="2" strokeLinejoin="round" />
        <circle cx="32" cy="44" r="4" fill="#F5EBD8" stroke="#2A2420" strokeWidth="2" />
        <line x1="32" y1="48" x2="32" y2="52" stroke="#2A2420" strokeWidth="2" />
      </svg>
    );
  }
  if (idx === 1) {
    return (
      <svg {...common}>
        <rect x="6" y="6" width="52" height="52" rx="10" fill={accent} stroke="#2A2420" strokeWidth="2.5" />
        <path d="M18 42 L26 30 L32 36 L46 18" stroke="#F5EBD8" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" fill="none" />
        <circle cx="46" cy="18" r="3" fill="#F5EBD8" stroke="#2A2420" strokeWidth="1.5" />
        <circle cx="18" cy="42" r="3" fill="#F5EBD8" stroke="#2A2420" strokeWidth="1.5" />
      </svg>
    );
  }
  if (idx === 2) {
    return (
      <svg {...common}>
        <rect x="6" y="6" width="52" height="52" rx="10" fill={accent} stroke="#2A2420" strokeWidth="2.5" />
        <path d="M22 14 L42 14 L42 22 L32 22 L32 50 L22 50 Z" fill="#F5EBD8" stroke="#2A2420" strokeWidth="2.5" strokeLinejoin="round" />
        <circle cx="42" cy="40" r="6" fill="#F5EBD8" stroke="#2A2420" strokeWidth="2" />
        <line x1="46" y1="44" x2="50" y2="48" stroke="#2A2420" strokeWidth="2.5" strokeLinecap="round" />
      </svg>
    );
  }
  return (
    <svg {...common}>
      <rect x="6" y="6" width="52" height="52" rx="10" fill={accent === "#2A2420" ? "#c8956c" : accent} stroke="#2A2420" strokeWidth="2.5" />
      <path d="M14 28 L32 18 L50 28 L32 38 Z" fill="#F5EBD8" stroke="#2A2420" strokeWidth="2" strokeLinejoin="round" />
      <line x1="32" y1="38" x2="32" y2="48" stroke="#2A2420" strokeWidth="2.5" />
      <path d="M22 33 V42 Q22 46 32 46 Q42 46 42 42 V33" stroke="#2A2420" strokeWidth="2" fill="none" />
    </svg>
  );
}

/* ───────────────────────────────────────────────
   HERO illustration — animated agent constellation
   ─────────────────────────────────────────────── */
function HeroScene({ labels }: { labels: { you: string; youSub: string; parrit: string; parritSub: string; agents: string[] } }) {
  // Satellite agent positions — spread wider, label below each
  const centerX = 290;
  const centerY = 230;
  const agents = [
    { cx: 110, cy: 150, fill: "#5FAF8E", label: labels.agents[0], phase: 0 },     // back-office
    { cx: 100, cy: 310, fill: "#c8956c", label: labels.agents[1], phase: 1.2 },   // business
    { cx: 470, cy: 150, fill: "#C44536", label: labels.agents[2], phase: 0.6 },   // prototype
    { cx: 480, cy: 310, fill: "#2A2420", label: labels.agents[3], phase: 1.8 },   // formation
  ];

  return (
    <svg viewBox="0 0 580 460" width="100%" height="100%" style={{ maxWidth: 600 }} aria-label="Parrit AI agents constellation">
      <defs>
        <pattern id="dots-bg" width="14" height="14" patternUnits="userSpaceOnUse">
          <circle cx="2" cy="2" r="1" fill="#2A2420" opacity="0.06" />
        </pattern>
        <radialGradient id="parrit-glow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#C44536" stopOpacity="0.18" />
          <stop offset="100%" stopColor="#C44536" stopOpacity="0" />
        </radialGradient>
      </defs>
      <rect width="580" height="460" fill="url(#dots-bg)" />

      {/* Parrit glow halo */}
      <circle cx={centerX} cy={centerY} r="110" fill="url(#parrit-glow)">
        <animate attributeName="r" values="100;115;100" dur="4s" repeatCount="indefinite" />
      </circle>

      {/* dotted curves from Parrit to agents, with flowing data dots */}
      {agents.map((a, i) => {
        const dx = (a.cx - centerX) / 2;
        const dy = (a.cy - centerY) / 2;
        const ctrlX = centerX + dx + (i % 2 === 0 ? -36 : 36);
        const ctrlY = centerY + dy + (i < 2 ? -30 : 30);
        const pathD = `M ${centerX} ${centerY} Q ${ctrlX} ${ctrlY} ${a.cx} ${a.cy}`;
        return (
          <g key={`path-${i}`}>
            <path
              d={pathD}
              stroke="#2A2420"
              strokeWidth="1.8"
              strokeDasharray="3 6"
              fill="none"
              opacity="0.4"
            />
            {/* flowing data dot */}
            <circle r="3.2" fill={a.fill} stroke="#2A2420" strokeWidth="1">
              <animateMotion
                dur={`${3 + i * 0.4}s`}
                repeatCount="indefinite"
                begin={`${i * 0.6}s`}
                path={pathD}
              />
              <animate attributeName="opacity" values="0;1;1;0" dur={`${3 + i * 0.4}s`} repeatCount="indefinite" begin={`${i * 0.6}s`} />
            </circle>
          </g>
        );
      })}

      {/* "You — the founder" badge top-left */}
      <g>
        <rect x="22" y="36" width="106" height="44" rx="8" fill="#2A2420" />
        <text x="75" y="55" fontSize="13" fontWeight="700" textAnchor="middle" fill="#F5EBD8" fontFamily="DM Sans, sans-serif">{labels.you}</text>
        <text x="75" y="70" fontSize="10" textAnchor="middle" fill="#A09688" fontFamily="DM Sans, sans-serif">{labels.youSub}</text>
        <path d="M 128 62 Q 152 70 175 80" stroke="#2A2420" strokeWidth="1.5" fill="none" strokeLinecap="round" />
        <polygon points="175,80 169,76 170,84" fill="#2A2420" />
      </g>

      {/* Founder ↔ Parrit primary connection — bold solid line + flowing pulse */}
      <g>
        <path
          id="founder-link"
          d={`M 220 116 C 240 150 ${centerX - 50} 180 ${centerX - 36} ${centerY - 32}`}
          stroke="#2A2420"
          strokeWidth="3"
          fill="none"
          strokeLinecap="round"
        />
        {/* pulsing flow particles */}
        <circle r="4" fill="#C44536" stroke="#2A2420" strokeWidth="1.2">
          <animateMotion dur="2.6s" repeatCount="indefinite" path={`M 220 116 C 240 150 ${centerX - 50} 180 ${centerX - 36} ${centerY - 32}`} />
        </circle>
        <circle r="4" fill="#C44536" stroke="#2A2420" strokeWidth="1.2">
          <animateMotion dur="2.6s" repeatCount="indefinite" begin="1.3s" path={`M 220 116 C 240 150 ${centerX - 50} 180 ${centerX - 36} ${centerY - 32}`} />
        </circle>
        {/* arrow head near Parrit */}
        <polygon points={`${centerX - 36},${centerY - 32} ${centerX - 46},${centerY - 38} ${centerX - 44},${centerY - 28}`} fill="#2A2420" />
      </g>

      {/* "You" — small purple bubble (gently floating) */}
      <g>
        <g>
          <animateTransform attributeName="transform" type="translate" values="0 0; 0 -4; 0 0" dur="3.5s" repeatCount="indefinite" />
          <circle cx="200" cy="100" r="32" fill="#E8D9F2" stroke="#2A2420" strokeWidth="2.5" />
          <circle cx="192" cy="98" r="2.5" fill="#2A2420" />
          <circle cx="208" cy="98" r="2.5" fill="#2A2420" />
          <path d="M 192 108 Q 200 113 208 108" stroke="#2A2420" strokeWidth="2" fill="none" strokeLinecap="round" />
          <path d="M 178 126 Q 200 118 222 126 L 220 130 L 180 130 Z" fill="#9F7BC2" stroke="#2A2420" strokeWidth="2" strokeLinejoin="round" />
        </g>
      </g>

      {/* PARRIT — center copilot bubble (gentle pulse) */}
      <g>
        <g>
          <animateTransform attributeName="transform" type="translate" values="0 0; 0 -3; 0 0" dur="4s" repeatCount="indefinite" />
          {/* perforated stamp border */}
          <circle cx={centerX} cy={centerY} r="60" fill="#F5EBD8" stroke="#2A2420" strokeWidth="3" />
          <circle cx={centerX} cy={centerY} r="60" fill="none" stroke="#C44536" strokeWidth="1.5" strokeDasharray="3 4" opacity="0.7">
            <animateTransform attributeName="transform" type="rotate" from={`0 ${centerX} ${centerY}`} to={`360 ${centerX} ${centerY}`} dur="30s" repeatCount="indefinite" />
          </circle>
          {/* face */}
          <circle cx={centerX - 14} cy={centerY - 4} r="3.5" fill="#2A2420" />
          <circle cx={centerX + 14} cy={centerY - 4} r="3.5" fill="#2A2420" />
          <path d={`M ${centerX - 14} ${centerY + 12} Q ${centerX} ${centerY + 20} ${centerX + 14} ${centerY + 12}`} stroke="#2A2420" strokeWidth="2.5" fill="none" strokeLinecap="round" />
          {/* layered pancake stack base */}
          <ellipse cx={centerX} cy={centerY + 40} rx="42" ry="6" fill="#C44536" stroke="#2A2420" strokeWidth="2" />
          <ellipse cx={centerX} cy={centerY + 32} rx="46" ry="7" fill="#9F7BC2" stroke="#2A2420" strokeWidth="2" />
          <ellipse cx={centerX} cy={centerY + 24} rx="50" ry="8" fill="#c8956c" stroke="#2A2420" strokeWidth="2" />
        </g>
      </g>

      {/* Parrit label — below the bubble to avoid satellite overlap */}
      <g>
        <rect x={centerX - 60} y={centerY + 70} width="120" height="40" rx="8" fill="#2A2420" />
        <text x={centerX} y={centerY + 87} fontSize="13" fontWeight="700" textAnchor="middle" fill="#F5EBD8" fontFamily="DM Sans, sans-serif">{labels.parrit}</text>
        <text x={centerX} y={centerY + 101} fontSize="10" textAnchor="middle" fill="#A09688" fontFamily="DM Sans, sans-serif">{labels.parritSub}</text>
      </g>

      {/* 4 agent satellites (each floats with its own phase) */}
      {agents.map((a, i) => {
        const dy = 4 + (i % 2) * 2;
        const dur = 3 + (i % 2);
        return (
          <g key={`agent-${i}`}>
            <g>
              <animateTransform
                attributeName="transform"
                type="translate"
                values={`0 0; 0 -${dy}; 0 0`}
                dur={`${dur}s`}
                repeatCount="indefinite"
                begin={`${a.phase}s`}
              />
              {/* shadow */}
              <ellipse cx={a.cx} cy={a.cy + 32} rx="22" ry="3.5" fill="#2A2420" opacity="0.1" />
              {/* body */}
              <circle cx={a.cx} cy={a.cy} r="28" fill={a.fill} stroke="#2A2420" strokeWidth="2.5" />
              {/* eyes (blink) */}
              <g>
                <circle cx={a.cx - 8} cy={a.cy - 3} r="2.5" fill="#F5EBD8" />
                <circle cx={a.cx + 8} cy={a.cy - 3} r="2.5" fill="#F5EBD8" />
                <circle cx={a.cx - 8} cy={a.cy - 3} r="1.1" fill="#2A2420">
                  <animate attributeName="ry" values="1.1;0.15;1.1" dur="6s" repeatCount="indefinite" begin={`${i * 1.4}s`} />
                </circle>
                <circle cx={a.cx + 8} cy={a.cy - 3} r="1.1" fill="#2A2420">
                  <animate attributeName="ry" values="1.1;0.15;1.1" dur="6s" repeatCount="indefinite" begin={`${i * 1.4}s`} />
                </circle>
              </g>
              {/* small smile */}
              <path d={`M ${a.cx - 6} ${a.cy + 6} Q ${a.cx} ${a.cy + 10} ${a.cx + 6} ${a.cy + 6}`} stroke={a.fill === "#2A2420" ? "#F5EBD8" : "#2A2420"} strokeWidth="1.5" fill="none" strokeLinecap="round" />
              {/* chinese red stamp dot top-right */}
              <circle cx={a.cx + 19} cy={a.cy - 19} r="4" fill="#C44536" stroke="#2A2420" strokeWidth="1">
                <animate attributeName="r" values="4;5;4" dur="2.4s" repeatCount="indefinite" begin={`${a.phase}s`} />
              </circle>
            </g>
            {/* label (static, doesn't float with bubble) */}
            <g>
              <rect x={a.cx - 42} y={a.cy + 38} width="84" height="20" rx="4" fill="#FFFCF5" stroke="#2A2420" strokeWidth="1.5" />
              <text x={a.cx} y={a.cy + 51} fontSize="10" fontWeight="700" textAnchor="middle" fill="#2A2420" fontFamily="DM Sans, sans-serif">{a.label}</text>
            </g>
          </g>
        );
      })}

      {/* sparkles */}
      <g fill="#C44536">
        <polygon points="40,230 44,226 48,230 44,234">
          <animate attributeName="opacity" values="0.3;1;0.3" dur="2.5s" repeatCount="indefinite" />
        </polygon>
        <polygon points="540,230 544,226 548,230 544,234">
          <animate attributeName="opacity" values="1;0.3;1" dur="2.5s" repeatCount="indefinite" />
        </polygon>
      </g>
      <g fill="#c8956c">
        <polygon points="290,420 294,416 298,420 294,424">
          <animate attributeName="opacity" values="0.4;1;0.4" dur="3s" repeatCount="indefinite" />
        </polygon>
      </g>
    </svg>
  );
}

/* ───────────────────────────────────────────────
   WINDOW (modal) — PostHog-style chrome
   ─────────────────────────────────────────────── */
function Win({
  title,
  onClose,
  children,
  maxWidth = 720,
  accent,
}: {
  title: string;
  onClose: () => void;
  children: React.ReactNode;
  maxWidth?: number;
  accent?: string;
}) {
  return (
    <motion.div
      key={title}
      role="dialog"
      aria-modal="true"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.18 }}
      onClick={onClose}
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(42, 36, 32, 0.45)",
        backdropFilter: "blur(2px)",
        zIndex: 200,
        display: "flex",
        alignItems: "flex-start",
        justifyContent: "center",
        padding: "min(8vh, 80px) 16px 16px",
        overflowY: "auto",
      }}
    >
      <motion.div
        initial={{ y: 20, scale: 0.97, opacity: 0 }}
        animate={{ y: 0, scale: 1, opacity: 1 }}
        exit={{ y: 10, scale: 0.98, opacity: 0 }}
        transition={{ type: "spring", damping: 24, stiffness: 240 }}
        onClick={(e) => e.stopPropagation()}
        style={{
          width: "100%",
          maxWidth,
          background: "#F5EBD8",
          border: "2px solid #2A2420",
          borderRadius: 12,
          boxShadow: "8px 8px 0 rgba(42,36,32,0.18)",
          overflow: "hidden",
        }}
      >
        {/* title bar */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 10,
            padding: "10px 14px",
            background: accent ? `linear-gradient(180deg, ${accent}33, ${accent}11)` : "#EADFC4",
            borderBottom: "2px solid #2A2420",
          }}
        >
          <div style={{ display: "flex", gap: 6 }}>
            <button
              aria-label="close"
              onClick={onClose}
              style={{
                width: 14,
                height: 14,
                borderRadius: "50%",
                background: "#E57373",
                border: "1.5px solid #2A2420",
                cursor: "pointer",
                padding: 0,
              }}
            />
            <span style={{ width: 14, height: 14, borderRadius: "50%", background: "#F5D67E", border: "1.5px solid #2A2420" }} />
            <span style={{ width: 14, height: 14, borderRadius: "50%", background: "#85C285", border: "1.5px solid #2A2420" }} />
          </div>
          <div
            style={{
              flex: 1,
              textAlign: "center",
              fontFamily: "var(--font-body)",
              fontSize: 13,
              fontWeight: 600,
              letterSpacing: "0.02em",
              color: "#2A2420",
            }}
          >
            {title}
          </div>
          <div style={{ width: 56 }} />
        </div>
        {/* content */}
        <div style={{ padding: "26px 28px 30px" }}>{children}</div>
      </motion.div>
    </motion.div>
  );
}

/* ───────────────────────────────────────────────
   QUICK CONTACT inline (window content)
   ─────────────────────────────────────────────── */
function ContactBlock({
  copy,
  accent,
}: {
  copy: ReturnType<typeof getCopy>["contact"];
  accent?: string;
}) {
  const [value, setValue] = useState("");
  const [state, setState] = useState<"idle" | "sending" | "sent" | "error">("idle");

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!value.trim()) return;
    setState("sending");
    const utms = getAttribution();
    try {
      await fetch(WEBHOOK_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          source: "parrit.ai",
          action: "quick_contact",
          contact: value,
          page: "desktop-home",
          ts: new Date().toISOString(),
          ...utms,
        }),
      });
      setState("sent");
    } catch {
      setState("error");
    }
  }

  return (
    <div>
      <p
        style={{
          margin: "0 0 18px",
          fontFamily: "var(--font-body)",
          fontSize: 15,
          lineHeight: 1.6,
          color: "#5A5047",
        }}
      >
        {copy.sub}
      </p>
      <form onSubmit={submit} style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
        <input
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder={copy.placeholder}
          disabled={state === "sending" || state === "sent"}
          style={{
            flex: "1 1 240px",
            padding: "12px 14px",
            border: "2px solid #2A2420",
            borderRadius: 8,
            background: "#FFFCF5",
            fontFamily: "var(--font-body)",
            fontSize: 14,
            color: "#2A2420",
            outline: "none",
          }}
        />
        <button
          type="submit"
          disabled={state === "sending" || state === "sent" || !value.trim()}
          style={{
            padding: "12px 22px",
            border: "2px solid #2A2420",
            borderRadius: 8,
            background: accent || "#c8956c",
            color: "#2A2420",
            fontFamily: "var(--font-body)",
            fontSize: 14,
            fontWeight: 600,
            cursor: state === "sending" || state === "sent" ? "default" : "pointer",
            boxShadow: "3px 3px 0 #2A2420",
            transition: "transform 0.08s",
          }}
        >
          {state === "sending" ? copy.submitting : state === "sent" ? "✓" : copy.submit}
        </button>
      </form>
      <p style={{ marginTop: 10, fontSize: 12, color: "#8A7E70", fontFamily: "var(--font-body)" }}>
        {state === "sent" ? copy.thanks : state === "error" ? copy.error : copy.micro}
      </p>
      <div
        style={{
          marginTop: 18,
          paddingTop: 16,
          borderTop: "1px dashed #2A2420",
          fontFamily: "var(--font-body)",
          fontSize: 13,
          color: "#5A5047",
          display: "flex",
          gap: 18,
          flexWrap: "wrap",
        }}
      >
        <a href="mailto:paul.larmaraud@parrit.ai" style={{ color: "#2A2420", textDecoration: "underline" }}>
          paul.larmaraud@parrit.ai
        </a>
        <a href="tel:+33683762219" style={{ color: "#2A2420", textDecoration: "underline" }}>
          +33 6 83 76 22 19
        </a>
        <a
          href="https://www.linkedin.com/in/paullarmaraud/"
          target="_blank"
          rel="noreferrer"
          style={{ color: "#2A2420", textDecoration: "underline" }}
        >
          LinkedIn
        </a>
      </div>
    </div>
  );
}

/* ───────────────────────────────────────────────
   WAITLIST WINDOW — Pancake-style welcome screen
   ─────────────────────────────────────────────── */
function WaitlistWindow({
  copy,
}: {
  copy: { eyebrow: string; title: string; sub: string; placeholder: string; hint: string; submit: string; submitting: string; thanks: string; error: string; ctaSecondary: string };
}) {
  const [email, setEmail] = useState("");
  const [company, setCompany] = useState("");
  const [state, setState] = useState<"idle" | "sending" | "sent" | "error">("idle");

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!email.includes("@")) return;
    setState("sending");
    const utms = getAttribution();
    try {
      await fetch(WEBHOOK_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          source: "parrit.ai",
          action: "waitlist_signup",
          email,
          company,
          page: "desktop-home",
          ts: new Date().toISOString(),
          ...utms,
        }),
      });
      setState("sent");
    } catch {
      setState("error");
    }
  }

  return (
    <div style={{ textAlign: "center", padding: "12px 4px 4px" }}>
      {/* Parrit copilot face (small) */}
      <div style={{ display: "flex", justifyContent: "center", marginBottom: 18 }}>
        <svg width="88" height="88" viewBox="0 0 100 100">
          <circle cx="50" cy="50" r="42" fill="#F5EBD8" stroke="#2A2420" strokeWidth="2.5" />
          <circle cx="50" cy="50" r="42" fill="none" stroke="#C44536" strokeWidth="1.5" strokeDasharray="3 4" opacity="0.7" />
          <circle cx="40" cy="46" r="3" fill="#2A2420" />
          <circle cx="60" cy="46" r="3" fill="#2A2420" />
          <path d="M 40 58 Q 50 65 60 58" stroke="#2A2420" strokeWidth="2.5" fill="none" strokeLinecap="round" />
          <ellipse cx="50" cy="80" rx="28" ry="4" fill="#C44536" stroke="#2A2420" strokeWidth="1.5" />
          <ellipse cx="50" cy="76" rx="30" ry="4.5" fill="#9F7BC2" stroke="#2A2420" strokeWidth="1.5" />
          <ellipse cx="50" cy="72" rx="33" ry="5" fill="#c8956c" stroke="#2A2420" strokeWidth="1.5" />
        </svg>
      </div>

      <p
        style={{
          fontFamily: "var(--font-body)",
          fontSize: 11,
          fontWeight: 700,
          letterSpacing: "0.2em",
          textTransform: "uppercase",
          color: "var(--parrit-red)",
          margin: "0 0 10px",
        }}
      >
        {copy.eyebrow}
      </p>
      <h2
        style={{
          margin: 0,
          fontFamily: "var(--font-heading)",
          fontSize: "clamp(26px, 4vw, 36px)",
          fontWeight: 500,
          color: "#2A2420",
          lineHeight: 1.15,
          letterSpacing: "-0.01em",
        }}
      >
        {copy.title}
      </h2>
      <p
        style={{
          margin: "12px auto 24px",
          fontFamily: "var(--font-body)",
          fontSize: 15,
          lineHeight: 1.55,
          color: "#5A5047",
          maxWidth: 440,
        }}
      >
        {copy.sub}
      </p>

      <form
        onSubmit={submit}
        style={{ maxWidth: 420, margin: "0 auto", textAlign: "left" }}
      >
        <input
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder={copy.placeholder}
          disabled={state === "sending" || state === "sent"}
          style={{
            width: "100%",
            padding: "16px 18px",
            border: "2px solid #2A2420",
            borderRadius: 12,
            background: "#FFFCF5",
            fontFamily: "var(--font-body)",
            fontSize: 15,
            color: "#2A2420",
            outline: "none",
            marginBottom: 6,
          }}
        />
        <p
          style={{
            fontSize: 12,
            color: "#8A7E70",
            margin: "0 0 14px 4px",
            fontFamily: "var(--font-body)",
          }}
        >
          {copy.hint}
        </p>
        <input
          type="text"
          value={company}
          onChange={(e) => setCompany(e.target.value)}
          placeholder="Entreprise / Company"
          disabled={state === "sending" || state === "sent"}
          style={{
            width: "100%",
            padding: "14px 18px",
            border: "2px solid #2A2420",
            borderRadius: 12,
            background: "#FFFCF5",
            fontFamily: "var(--font-body)",
            fontSize: 14,
            color: "#2A2420",
            outline: "none",
            marginBottom: 18,
          }}
        />
        <button
          type="submit"
          disabled={state === "sending" || state === "sent" || !email.includes("@")}
          style={{
            width: "100%",
            padding: "16px 24px",
            background: state === "sent" ? "#5FAF8E" : "var(--parrit-red)",
            color: "#FFFCF5",
            border: "2px solid #2A2420",
            borderRadius: 12,
            fontFamily: "var(--font-body)",
            fontSize: 15,
            fontWeight: 700,
            cursor: state === "sending" || state === "sent" ? "default" : "pointer",
            boxShadow: "5px 5px 0 #2A2420",
            transition: "transform 0.1s, box-shadow 0.1s, background 0.2s",
            letterSpacing: "0.02em",
          }}
        >
          {state === "sending" ? copy.submitting : state === "sent" ? "✓ " + copy.thanks : copy.submit}
        </button>
      </form>

      {state === "error" && (
        <p style={{ marginTop: 12, color: "#C44536", fontSize: 13, fontFamily: "var(--font-body)" }}>
          {copy.error}
        </p>
      )}

      <p
        style={{
          marginTop: 20,
          fontFamily: "var(--font-body)",
          fontSize: 12,
          color: "#8A7E70",
        }}
      >
        Paul Larmaraud · paul.larmaraud@parrit.ai
      </p>
    </div>
  );
}

/* ───────────────────────────────────────────────
   OFFER WINDOW content
   ─────────────────────────────────────────────── */
function OfferWindow({
  offer,
  contact,
  onOpenContact,
}: {
  offer: OfferCopy;
  contact: ReturnType<typeof getCopy>["contact"];
  onOpenContact: () => void;
}) {
  return (
    <div>
      <div
        style={{
          display: "inline-block",
          padding: "4px 10px",
          fontFamily: "var(--font-body)",
          fontSize: 11,
          fontWeight: 700,
          letterSpacing: "0.18em",
          textTransform: "uppercase",
          color: "#2A2420",
          background: offer.accent,
          borderRadius: 4,
          border: "1.5px solid #2A2420",
          marginBottom: 14,
        }}
      >
        {offer.chip}
      </div>
      <h2
        style={{
          margin: 0,
          fontFamily: "var(--font-heading)",
          fontSize: "clamp(26px, 4vw, 34px)",
          fontWeight: 500,
          color: "#2A2420",
          lineHeight: 1.15,
          letterSpacing: "-0.01em",
        }}
      >
        {offer.title}
      </h2>
      <p
        style={{
          margin: "6px 0 16px",
          fontFamily: "var(--font-body)",
          fontSize: 14,
          color: "#8A7E70",
          fontStyle: "italic",
        }}
      >
        {offer.sub}
      </p>
      <p
        style={{
          fontFamily: "var(--font-body)",
          fontSize: 15,
          lineHeight: 1.65,
          color: "#2A2420",
          margin: "0 0 22px",
        }}
      >
        {offer.pitch}
      </p>

      <div style={{ marginBottom: 22 }}>
        <p
          style={{
            fontFamily: "var(--font-body)",
            fontSize: 11,
            fontWeight: 700,
            letterSpacing: "0.18em",
            textTransform: "uppercase",
            color: "#8A7E70",
            margin: "0 0 10px",
          }}
        >
          Comment ça marche
        </p>
        <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: 10 }}>
          {offer.bullets.map((b, i) => (
            <li
              key={i}
              style={{
                fontFamily: "var(--font-body)",
                fontSize: 14,
                lineHeight: 1.55,
                color: "#2A2420",
                paddingLeft: 22,
                position: "relative",
              }}
            >
              <span
                style={{
                  position: "absolute",
                  left: 0,
                  top: 6,
                  width: 12,
                  height: 12,
                  background: offer.accent,
                  border: "1.5px solid #2A2420",
                  borderRadius: 2,
                }}
              />
              {b}
            </li>
          ))}
        </ul>
      </div>

      {offer.clusters && offer.clusters.length > 0 && (
        <div style={{ marginBottom: 22 }}>
          <p
            style={{
              fontFamily: "var(--font-body)",
              fontSize: 11,
              fontWeight: 700,
              letterSpacing: "0.18em",
              textTransform: "uppercase",
              color: "#8A7E70",
              margin: "0 0 10px",
            }}
          >
            Agents prêts à déployer
          </p>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
              gap: 10,
            }}
          >
            {offer.clusters.map((box) => (
              <div
                key={box.label}
                style={{
                  padding: "12px 14px",
                  background: `${offer.accent}1A`,
                  border: `1.5px solid ${offer.accent}66`,
                  borderRadius: 12,
                }}
              >
                <p
                  style={{
                    fontFamily: "var(--font-body)",
                    fontSize: 12,
                    fontWeight: 700,
                    color: "#2A2420",
                    margin: "0 0 8px",
                    textAlign: "center",
                  }}
                >
                  {box.label}
                </p>
                <ul
                  style={{
                    listStyle: "none",
                    padding: 0,
                    margin: 0,
                    display: "flex",
                    flexDirection: "column",
                    gap: 4,
                  }}
                >
                  {box.agents.map((ag) => (
                    <li
                      key={ag.name}
                      style={{
                        background: "#FFFCF5",
                        border: "1px solid #2A2420",
                        borderRadius: 6,
                        padding: "5px 8px 5px 22px",
                        fontFamily: "var(--font-body)",
                        fontSize: 12,
                        color: "#2A2420",
                        position: "relative",
                        lineHeight: 1.3,
                      }}
                    >
                      <span
                        style={{
                          position: "absolute",
                          left: 7,
                          top: "50%",
                          transform: "translateY(-50%)",
                          width: 8,
                          height: 8,
                          borderRadius: "50%",
                          background: ag.status === "live" ? "#5FAF8E" : "#C44536",
                        }}
                      />
                      {ag.name}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
          <p
            style={{
              fontFamily: "var(--font-body)",
              fontSize: 11,
              color: "#8A7E70",
              margin: "10px 0 0",
              textAlign: "center",
              fontStyle: "italic",
            }}
          >
            <span style={{ display: "inline-block", width: 7, height: 7, borderRadius: "50%", background: "#5FAF8E", marginRight: 6, verticalAlign: "middle" }} />
            En production
            <span style={{ display: "inline-block", width: 7, height: 7, borderRadius: "50%", background: "#C44536", marginRight: 6, marginLeft: 12, verticalAlign: "middle" }} />
            En cours
          </p>
        </div>
      )}

      <div
        style={{
          marginBottom: 22,
          padding: "14px 16px",
          background: "#FFFCF5",
          border: "1.5px dashed #2A2420",
          borderRadius: 8,
        }}
      >
        <p
          style={{
            fontFamily: "var(--font-body)",
            fontSize: 11,
            fontWeight: 700,
            letterSpacing: "0.18em",
            textTransform: "uppercase",
            color: "#8A7E70",
            margin: "0 0 8px",
          }}
        >
          Cas réels (anonymisés)
        </p>
        <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: 6 }}>
          {offer.proof.map((p, i) => (
            <li
              key={i}
              style={{
                fontFamily: "var(--font-body)",
                fontSize: 13.5,
                lineHeight: 1.55,
                color: "#2A2420",
              }}
            >
              → {p}
            </li>
          ))}
        </ul>
      </div>

      <p
        style={{
          fontFamily: "var(--font-body)",
          fontSize: 13,
          fontStyle: "italic",
          color: "#8A7E70",
          margin: "0 0 22px",
        }}
      >
        {offer.notfor}
      </p>

      <button
        onClick={onOpenContact}
        style={{
          padding: "12px 24px",
          background: offer.accent,
          border: "2px solid #2A2420",
          borderRadius: 8,
          fontFamily: "var(--font-body)",
          fontSize: 14,
          fontWeight: 600,
          color: "#2A2420",
          cursor: "pointer",
          boxShadow: "4px 4px 0 #2A2420",
          transition: "transform 0.08s",
        }}
      >
        {contact.title} →
      </button>
    </div>
  );
}

/* ───────────────────────────────────────────────
   PANEL CONTENT for Manifeste / Méthode / Cas / Paul
   ─────────────────────────────────────────────── */
function PanelContent({
  which,
  panel,
  contact,
  onOpenContact,
}: {
  which: "manifeste" | "methode" | "cas" | "paul" | "yukun" | "yukun";
  panel: PanelCopy;
  contact: ReturnType<typeof getCopy>["contact"];
  onOpenContact: () => void;
}) {
  if (which === "manifeste") {
    return (
      <div>
        {panel.manifeste.body.map((line, i) => (
          <p
            key={i}
            style={{
              fontFamily: "var(--font-heading)",
              fontSize: "clamp(20px, 3vw, 24px)",
              fontWeight: 400,
              lineHeight: 1.45,
              color: "#2A2420",
              margin: "0 0 18px",
            }}
          >
            {line}
          </p>
        ))}
      </div>
    );
  }
  if (which === "methode") {
    return (
      <div style={{ display: "grid", gridTemplateColumns: "1fr", gap: 14 }}>
        {panel.methode.steps.map((s) => (
          <div
            key={s.n}
            style={{
              display: "flex",
              gap: 16,
              padding: "16px 18px",
              background: "#FFFCF5",
              border: "1.5px solid #2A2420",
              borderRadius: 8,
            }}
          >
            <span
              style={{
                fontFamily: "var(--font-heading)",
                fontSize: 30,
                fontWeight: 500,
                color: "#c8956c",
                lineHeight: 1,
              }}
            >
              {s.n}
            </span>
            <div>
              <p style={{ margin: 0, fontFamily: "var(--font-body)", fontSize: 15, fontWeight: 600, color: "#2A2420" }}>
                {s.t}
              </p>
              <p style={{ margin: "4px 0 0", fontFamily: "var(--font-body)", fontSize: 13.5, color: "#5A5047", lineHeight: 1.5 }}>
                {s.d}
              </p>
            </div>
          </div>
        ))}
      </div>
    );
  }
  if (which === "cas") {
    return (
      <div>
        <p
          style={{
            margin: "0 0 18px",
            fontFamily: "var(--font-body)",
            fontSize: 13,
            fontStyle: "italic",
            color: "#8A7E70",
          }}
        >
          {panel.cas.intro}
        </p>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: 12 }}>
          {panel.cas.items.map((c) => (
            <div
              key={c.t}
              style={{
                padding: "14px 16px",
                background: "#FFFCF5",
                border: "1.5px solid #2A2420",
                borderRadius: 8,
              }}
            >
              <p style={{ margin: 0, fontFamily: "var(--font-body)", fontSize: 14, fontWeight: 600, color: "#2A2420" }}>
                {c.t}
              </p>
              <p style={{ margin: "4px 0 0", fontFamily: "var(--font-body)", fontSize: 13, color: "#5A5047", lineHeight: 1.5 }}>
                {c.d}
              </p>
            </div>
          ))}
        </div>
        <button
          onClick={onOpenContact}
          style={{
            marginTop: 22,
            padding: "12px 22px",
            background: "#c8956c",
            border: "2px solid #2A2420",
            borderRadius: 8,
            fontFamily: "var(--font-body)",
            fontSize: 14,
            fontWeight: 600,
            color: "#2A2420",
            cursor: "pointer",
            boxShadow: "3px 3px 0 #2A2420",
          }}
        >
          {contact.title} →
        </button>
      </div>
    );
  }
  // paul or yukun — bio panel
  const person = which === "paul" ? panel.paul : panel.yukun;
  const accent = which === "paul" ? "#c8956c" : "#C44536";
  return (
    <div>
      <div style={{ display: "flex", gap: 22, alignItems: "flex-start", flexWrap: "wrap", marginBottom: 20 }}>
        <div style={{ flexShrink: 0 }}>
          <IconPerson size={108} />
        </div>
        <div style={{ flex: 1, minWidth: 200 }}>
          <p
            style={{
              fontFamily: "var(--font-body)",
              fontSize: 11,
              fontWeight: 700,
              letterSpacing: "0.18em",
              textTransform: "uppercase",
              color: accent,
              margin: "0 0 6px",
            }}
          >
            {person.role}
          </p>
          {person.lines.map((l, i) => (
            <p
              key={i}
              style={{
                margin: "0 0 4px",
                fontFamily: i === 0 ? "var(--font-heading)" : "var(--font-body)",
                fontSize: i === 0 ? 26 : 14,
                fontWeight: i === 0 ? 500 : 400,
                color: i === 0 ? "#2A2420" : "#5A5047",
                lineHeight: 1.35,
                letterSpacing: i === 0 ? "-0.01em" : "0",
              }}
            >
              {l}
            </p>
          ))}
        </div>
      </div>

      {/* Story paragraphs */}
      <div
        style={{
          background: "#FFFCF5",
          border: "1.5px solid #2A2420",
          borderRadius: 12,
          padding: "18px 20px",
          marginBottom: 18,
        }}
      >
        {person.story.map((p, i) => (
          <p
            key={i}
            style={{
              margin: i === 0 ? "0 0 12px" : "0 0 12px",
              fontFamily: "var(--font-body)",
              fontSize: 14.5,
              lineHeight: 1.6,
              color: "#2A2420",
            }}
          >
            {p}
          </p>
        ))}
      </div>

      {/* Facts grid */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
          gap: 10,
          marginBottom: 20,
        }}
      >
        {person.facts.map((f) => (
          <div
            key={f.k}
            style={{
              padding: "10px 14px",
              background: `${accent}14`,
              border: `1.5px solid ${accent}66`,
              borderRadius: 8,
            }}
          >
            <p
              style={{
                margin: "0 0 3px",
                fontFamily: "var(--font-body)",
                fontSize: 10.5,
                fontWeight: 700,
                letterSpacing: "0.14em",
                textTransform: "uppercase",
                color: "#8A7E70",
              }}
            >
              {f.k}
            </p>
            <p
              style={{
                margin: 0,
                fontFamily: "var(--font-body)",
                fontSize: 13.5,
                fontWeight: 500,
                color: "#2A2420",
                lineHeight: 1.4,
              }}
            >
              {f.v}
            </p>
          </div>
        ))}
      </div>

      <button
        onClick={onOpenContact}
        style={{
          padding: "12px 22px",
          background: accent,
          border: "2px solid #2A2420",
          borderRadius: 8,
          fontFamily: "var(--font-body)",
          fontSize: 14,
          fontWeight: 600,
          color: which === "yukun" ? "#FFFCF5" : "#2A2420",
          cursor: "pointer",
          boxShadow: "3px 3px 0 #2A2420",
        }}
      >
        {person.cta} →
      </button>
    </div>
  );
}

/* ───────────────────────────────────────────────
   MAIN
   ─────────────────────────────────────────────── */
export default function HomeClient({ dict, lang }: { dict: Dictionary; lang: Locale }) {
  const copy = getCopy(lang);
  const [open, setOpen] = useState<null | { kind: "offer"; idx: number } | { kind: "panel"; which: "manifeste" | "methode" | "cas" | "paul" | "yukun" } | { kind: "contact"; accent?: string } | { kind: "waitlist" }>(null);

  // Capture attribution on mount
  useEffect(() => {
    try {
      captureTouch();
    } catch {}
  }, []);

  // Escape closes
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(null);
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const openOffer = (idx: number) => setOpen({ kind: "offer", idx });
  const openPanel = (which: "manifeste" | "methode" | "cas" | "paul" | "yukun") =>
    setOpen({ kind: "panel", which });
  const openContact = (accent?: string) => setOpen({ kind: "contact", accent });
  const openWaitlist = () => setOpen({ kind: "waitlist" });

  return (
    <div className="parrit-os-root">
      {/* ── Top window chrome ─────────────────── */}
      <div className="parrit-os-topbar">
        <div className="parrit-os-traffic">
          <span style={{ background: "#E57373" }} />
          <span style={{ background: "#F5D67E" }} />
          <span style={{ background: "#85C285" }} />
        </div>
        <div className="parrit-os-title">{copy.osTitle}</div>
        <div className="parrit-os-topbar-actions">
          <button
            className="parrit-os-signup-btn"
            onClick={openWaitlist}
            aria-label={copy.waitlist.navLabel}
          >
            {copy.waitlist.navLabel}
          </button>
          <div className="parrit-os-lang">
            <LanguageSwitcher currentLang={lang} />
          </div>
        </div>
      </div>

      {/* ── Desktop grid ─────────────────── */}
      <div className="parrit-os-desktop">
        {/* LEFT dock */}
        <aside className="parrit-os-dock parrit-os-dock-left">
          {copy.leftDock.items.map((it) => {
            const onClick = () => {
              if ("href" in it && it.href) {
                window.open(it.href, "_blank", "noopener");
                return;
              }
              if (it.id === "manifeste" || it.id === "methode" || it.id === "cas" || it.id === "paul" || it.id === "yukun") {
                openPanel(it.id as "manifeste" | "methode" | "cas" | "paul" | "yukun");
              }
            };
            return (
              <button key={it.id} className="parrit-os-icon" onClick={onClick}>
                <LeftIcon name={it.icon} />
                <span>{it.label}</span>
              </button>
            );
          })}
        </aside>

        {/* CENTER hero */}
        <main className="parrit-os-center">
          <motion.div
            className="parrit-os-brand-text"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
          >
            <p className="parrit-os-eyebrow">Operating Partner · IA en production</p>
            <h1 className="parrit-os-brand">{copy.brand}</h1>
            <p className="parrit-os-tagline">{copy.tagline}</p>
            <p className="parrit-os-sub">{copy.sub}</p>
            <div className="parrit-os-cta-row">
              <button
                className="parrit-os-cta"
                onClick={() => openContact()}
                aria-label={copy.cta}
              >
                {copy.cta} →
              </button>
              <button
                className="parrit-os-cta-secondary"
                onClick={openWaitlist}
                aria-label={copy.waitlist.navLabel}
              >
                {copy.waitlist.ctaSecondary}
              </button>
            </div>
            <p className="parrit-os-cta-micro">{copy.ctaMicro}</p>
          </motion.div>

          <motion.div
            className="parrit-os-scene"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, ease: "easeOut", delay: 0.1 }}
          >
            <HeroScene
              labels={{
                you: lang === "fr" ? "Vous" : "You",
                youSub: lang === "fr" ? "Le dirigeant" : "The founder",
                parrit: "Parrit",
                parritSub: lang === "fr" ? "Votre copilot" : "Your copilot",
                agents: copy.offers.map((o) => o.chip),
              }}
            />
          </motion.div>
        </main>

        {/* RIGHT dock — offers */}
        <aside className="parrit-os-dock parrit-os-dock-right">
          <div className="parrit-os-dock-title">{copy.rightDock.title}</div>
          {copy.offers.map((o, i) => (
            <button
              key={o.id}
              className="parrit-os-icon parrit-os-offer"
              onClick={() => openOffer(i)}
              aria-label={o.title}
            >
              <OfferIcon idx={i} accent={o.accent} />
              <span>{o.chip}</span>
            </button>
          ))}
          <p className="parrit-os-dock-hint">{copy.rightDock.hint}</p>
        </aside>
      </div>

      {/* ── Mobile dock fallback ─────────────────── */}
      <div className="parrit-os-mobile-offers">
        {copy.offers.map((o, i) => (
          <button key={o.id} className="parrit-os-mobile-offer" onClick={() => openOffer(i)}>
            <OfferIcon idx={i} accent={o.accent} />
            <div>
              <strong>{o.chip}</strong>
              <span>{o.title}</span>
            </div>
          </button>
        ))}
      </div>

      {/* ── Modal windows ─────────────────── */}
      <AnimatePresence>
        {open && open.kind === "offer" && (
          <Win
            title={`${copy.offers[open.idx].chip} — Parrit.ai`}
            onClose={() => setOpen(null)}
            accent={copy.offers[open.idx].accent}
          >
            <OfferWindow
              offer={copy.offers[open.idx]}
              contact={copy.contact}
              onOpenContact={() => openContact(copy.offers[open.idx].accent)}
            />
          </Win>
        )}
        {open && open.kind === "panel" && (
          <Win
            title={`${copy.panel[open.which].title} — Parrit.ai`}
            onClose={() => setOpen(null)}
          >
            <PanelContent
              which={open.which}
              panel={copy.panel}
              contact={copy.contact}
              onOpenContact={() => openContact()}
            />
          </Win>
        )}
        {open && open.kind === "contact" && (
          <Win
            title={`${copy.contact.title} — Parrit.ai`}
            onClose={() => setOpen(null)}
            accent={open.accent}
            maxWidth={560}
          >
            <ContactBlock copy={copy.contact} accent={open.accent} />
          </Win>
        )}
        {open && open.kind === "waitlist" && (
          <Win
            title={`${copy.waitlist.eyebrow} — Parrit.ai`}
            onClose={() => setOpen(null)}
            accent="#C44536"
            maxWidth={520}
          >
            <WaitlistWindow copy={copy.waitlist} />
          </Win>
        )}
      </AnimatePresence>

      {/* ── Stamps strip — franco-chinois DNA, each stamp opens an offer ─────────────────── */}
      <section className="parrit-os-stamps" aria-label="Stamps">
        <p className="parrit-os-stamps-eyebrow">
          {lang === "fr"
            ? "Franco-chinois · Quatre typologies d'offre, un même collectif d'agents"
            : lang === "en"
            ? "Franco-Chinese · Four offer typologies, one agent collective"
            : "Franco-Chinês · Quatro tipologias de oferta, um coletivo"}
        </p>
        <p className="parrit-os-stamps-hint">
          {lang === "fr" ? "Cliquez une œuvre pour ouvrir l'offre" : lang === "en" ? "Click an artwork to open the offer" : "Clique uma obra para abrir a oferta"}
        </p>
        <div className="parrit-os-stamps-row">
          {[
            {
              src: "/stamps/monet-impression.jpg",
              artist: "Claude Monet · 1872",
              rot: -2.2,
              offerIdx: 0, // Back-office → Impression : on capte le détail qui change tout
              teaser: lang === "fr" ? "On capte le détail qui change tout" : lang === "en" ? "We capture the detail that changes everything" : "Captamos o detalhe que muda tudo",
            },
            {
              src: "/stamps/fan-kuan-travelers.jpg",
              artist: "范寬 Fan Kuan · ≈ 1000",
              rot: 1.6,
              offerIdx: 2, // Prototype → Voyageurs : on trace la route en quelques jours
              teaser: lang === "fr" ? "On trace la route en quelques jours" : lang === "en" ? "We chart the path in days" : "Traçamos o caminho em dias",
            },
            {
              src: "/stamps/renoir-canotiers.jpg",
              artist: "Pierre-Auguste Renoir · 1881",
              rot: 1.1,
              offerIdx: 1, // Business → Canotiers : on amène les bons à table
              teaser: lang === "fr" ? "On amène les bons à table" : lang === "en" ? "We bring the right people to the table" : "Trazemos as pessoas certas",
            },
            {
              src: "/stamps/guo-xi-early-spring.jpg",
              artist: "郭熙 Guo Xi · 1072",
              rot: -1.4,
              offerIdx: 3, // Formation → Début du printemps : vos équipes prennent racine
              teaser: lang === "fr" ? "Vos équipes prennent racine" : lang === "en" ? "Your teams take root" : "Suas equipes criam raízes",
            },
          ].map((s) => {
            const offer = copy.offers[s.offerIdx];
            return (
              <motion.button
                key={s.src}
                className="parrit-os-stamp parrit-os-stamp-button"
                onClick={() => openOffer(s.offerIdx)}
                initial={{ opacity: 0, y: 16, rotate: 0 }}
                whileInView={{ opacity: 1, y: 0, rotate: s.rot }}
                viewport={{ once: true, margin: "-40px" }}
                whileHover={{ rotate: 0, y: -6, scale: 1.02 }}
                transition={{ duration: 0.5 }}
                aria-label={`${offer.chip} — ${offer.title}`}
                style={{ ["--stamp-accent" as string]: offer.accent } as React.CSSProperties}
              >
                <div className="parrit-os-stamp-img">
                  <Image src={s.src} alt={offer.chip} fill style={{ objectFit: "cover" }} sizes="180px" />
                  <span className="parrit-os-stamp-overlay">
                    <span className="parrit-os-stamp-chip" style={{ background: offer.accent }}>
                      {offer.chip}
                    </span>
                  </span>
                </div>
                <div className="parrit-os-stamp-meta">
                  <span className="parrit-os-stamp-typology">{offer.chip}</span>
                  <span className="parrit-os-stamp-teaser">{s.teaser}</span>
                  <span className="parrit-os-stamp-origin">{s.artist}</span>
                </div>
              </motion.button>
            );
          })}
        </div>
      </section>

      {/* ── Bottom status bar ─────────────────── */}
      <footer className="parrit-os-statusbar">
        <span>● parrit.ai</span>
        <span>Paul Larmaraud · paul.larmaraud@parrit.ai</span>
        <span className="parrit-os-clock">{new Date().toLocaleDateString(lang === "fr" ? "fr-FR" : "en-US", { day: "2-digit", month: "short" })}</span>
      </footer>
    </div>
  );
}
