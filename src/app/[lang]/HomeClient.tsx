"use client";

import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import LanguageSwitcher from "@/components/LanguageSwitcher";
import { captureTouch, getAttribution } from "@/lib/attribution";
import type { Dictionary, Locale } from "./dictionaries";

export type FeaturedPost = {
  slug: string;
  title: string;
  description: string;
  category: string;
  readingTime: string;
  date: string;
};

const WEBHOOK_URL = "https://n8n.srv1115145.hstgr.cloud/webhook/parrit-lead";

/* ───────────────────────────────────────────────
   COPY — bilingue inline (anti-jargon, simple)
   ─────────────────────────────────────────────── */
type Lang = "fr" | "en" | "pt-BR" | "zh-CN";

const COPY = {
  fr: {
    osTitle: "parrit.ai — Operating System",
    brand: "PARRIT",
    tagline: "Des batteries d'agents IA sur mesure, déployées chez vous.",
    sub: "Trois voies où on déploie pour vous — back-office, business, prototype. Une quatrième où on entraîne vos équipes à déployer leurs propres agents. Autant d'agents que votre opération en a besoin, branchés sur votre stack. Même quand vous dormez.",
    cta: "Parler à Paul",
    ctaMicro: "Réponse sous 24h · sans engagement",
    leftDock: {
      title: "Bureau",
      items: [
        { id: "manifeste", label: "Manifeste.md", icon: "doc" },
        { id: "transformation", label: "Transformation.md", icon: "doc" },
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
          "Grande enseigne sport — programme dirigeant en discussion (équipe T&D AI)",
          "Université de management — Sprint Builders dirigeants exec ed",
          "Dirigeant pharma en transition — pack hands-on autonomie Claude Code (B2C)",
        ],
        notfor: "Qualiopi finalisée juin 2026. D'ici là, financement OPCO non garanti.",
        accent: "#7C5BA1",
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
      transformation: {
        title: "Notre définition de la transformation",
        eyebrow: "Anti-jargon · Anti-cabinet",
        blocks: [
          {
            tag: "Ce que ce n'est pas",
            body: "Pour nous, transformer une entreprise, ce n'est ni un audit, ni un programme à trois ans, ni un cabinet qui passe six mois à cartographier vos process avant de produire un PowerPoint. Ça, c'est ce qui ralentit votre transformation.",
          },
          {
            tag: "Ce que c'est",
            body: "Une transformation IA réussie, c'est un outil qui n'existait pas la semaine d'avant, qui tourne en production dans vos opérations le lundi suivant, et qu'un de vos collaborateurs utilise sans qu'on ait besoin d'être à côté. On la mesure : temps gagné par semaine, business additionnel, marge libérée.",
          },
          {
            tag: "Comment on s'y prend",
            body: "On choisit un sujet précis avec vous en 45 minutes. Paul code l'outil avec ses agents, le fait auditer par une agence partenaire, puis Yukun pousse en production sur votre stack. Trois à six semaines après le premier call, vous avez gagné votre premier outil. Un. Pas trente. C'est comme ça qu'on transforme : un outil livré à la fois, sans bullshit.",
          },
        ],
        closing: "Si vous voulez un cabinet qui produit un audit ou un deck, ce n'est pas nous. Si vous voulez un outil qui tourne lundi matin, on est faits l'un pour l'autre.",
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
          { t: "Grande enseigne sport (en discussion)", d: "Sprint Builders dirigeants hands-on — chaque participant prototype son cas métier en 2 jours avec Claude Code + Gemini" },
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
    tagline: "Fleets of custom AI agents, deployed at your site.",
    sub: "Three lanes where we deploy for you — back-office, business, prototype. A fourth where we train your teams to deploy their own. As many agents as your operations need, plugged into your stack. Even when you're asleep.",
    cta: "Talk to Paul",
    ctaMicro: "Reply within 24h · no commitment",
    leftDock: {
      title: "Desktop",
      items: [
        { id: "manifeste", label: "Manifesto.md", icon: "doc" },
        { id: "transformation", label: "Transformation.md", icon: "doc" },
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
          "Major sports retailer — executive program in discussion (T&D AI team)",
          "Management school — Executive Sprint Builders exec ed",
          "Pharma executive in transition — Claude Code autonomy pack (B2C)",
        ],
        notfor: "Qualiopi finalized June 2026. OPCO funding not guaranteed before then.",
        accent: "#7C5BA1",
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
      transformation: {
        title: "Our definition of transformation",
        eyebrow: "Anti-jargon · Anti-consulting",
        blocks: [
          {
            tag: "What it's NOT",
            body: "For us, transforming a business is not an audit, not a three-year program, not a firm that spends six months mapping your processes to produce a PowerPoint. That's what slows your transformation down.",
          },
          {
            tag: "What it IS",
            body: "A successful AI transformation is a tool that didn't exist last week, that runs in production inside your operations the following Monday, and that one of your team members uses without us standing next to them. We measure it: time saved per week, additional business, margin freed.",
          },
          {
            tag: "How we do it",
            body: "We pick one precise topic with you in 45 minutes. Paul codes the tool with his agents, gets it audited by a partner agency, then Yukun rolls it out to production on your stack. Three to six weeks after the first call, you've earned your first tool. One. Not thirty. That's how we transform: one tool at a time, no bullshit.",
          },
        ],
        closing: "If you want a firm that delivers an audit or a deck, that's not us. If you want a tool that runs on Monday morning, we're made for each other.",
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
          { t: "Major sports retailer (in discussion)", d: "Executive Sprint Builders hands-on — each participant prototypes their real case in 2 days with Claude Code + Gemini" },
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
    tagline: "Frotas de agentes IA sob medida, implantadas na sua empresa.",
    sub: "Três caminhos onde a gente implanta para você — back-office, negócios, protótipo. Um quarto onde a gente treina sua equipe a implantar os seus próprios. Quantos agentes sua operação precisar, conectados à sua stack. Mesmo quando você dorme.",
    cta: "Falar com Paul",
    ctaMicro: "Resposta em 24h · sem compromisso",
    leftDock: {
      title: "Área de trabalho",
      items: [
        { id: "manifeste", label: "Manifesto.md", icon: "doc" },
        { id: "transformation", label: "Transformação.md", icon: "doc" },
        { id: "methode", label: "Método.md", icon: "doc" },
        { id: "cas", label: "Casos.md", icon: "folder" },
        { id: "paul", label: "Paul.vcf", icon: "person" },
        { id: "yukun", label: "Yukun.vcf", icon: "person" },
        { id: "open", label: "LinkedIn Paul ↗", icon: "external", href: "https://www.linkedin.com/in/paullarmaraud/" },
      ],
    },
    rightDock: { title: "Ofertas", hint: "Clique uma oferta para abrir os detalhes" },
    offers: [
      {
        id: "back-office",
        chip: "Back-office",
        title: "Tempo recuperado nas tarefas admin & repetitivas",
        sub: "(Transformação administrativa do dia a dia)",
        pitch: "Automatizamos o que pesa em suas equipes: papelada, compliance, RFP, relatórios consolidados. Uma ferramenta proprietária, entregue e instalada na sua empresa.",
        bullets: [
          "Briefing de 45 min: escolhemos um caso de uso preciso",
          "Ferramenta entregue em 5 a 15 dias, código auditado pela agência parceira",
          "Forma: UI web leve, agente silencioso na sua stack, ou simples automação",
          "Deploy em produção + treinamento das equipes incluído",
        ],
        proof: [
          "Compliance officer agent — verificação automática de faturas, contratos, RFPs",
          "Relatório CEO consolidado — KPIs comerciais + operacionais (Excel, CRM, ERP)",
          "OS para escritório de advocacia — emails, RFPs, follow-up cliente orquestrados",
        ],
        notfor: "Se você quer \"testar IA\" sem um caso de uso preciso, não é para você.",
        accent: "#5FAF8E",
        clusters: [
          {
            label: "Finanças & Compliance",
            agents: [
              { name: "Compliance officer", status: "live" },
              { name: "Relatório CEO consolidado", status: "live" },
              { name: "Acompanhamento RFP", status: "live" },
              { name: "Auditoria faturas auto", status: "live" },
            ],
          },
          {
            label: "Operações & Supply",
            agents: [
              { name: "Gestão de estoques", status: "live" },
              { name: "Supply chain monitor", status: "live" },
              { name: "Pedidos e-commerce", status: "live" },
              { name: "Inventário multi-canal", status: "soon" },
            ],
          },
          {
            label: "Documentos & Emails",
            agents: [
              { name: "Triagem inbox executivo", status: "live" },
              { name: "Resposta semi-auto", status: "live" },
              { name: "Watch jurídico diário", status: "live" },
              { name: "Arquivamento inteligente", status: "soon" },
            ],
          },
        ],
      },
      {
        id: "business",
        chip: "Acquisition",
        title: "Geração de negócios",
        sub: "Encontros qualificados via sinais de intenção",
        pitch: "Captamos sinais online (podcasts, eventos, posts LinkedIn) no momento certo e disparamos um contato hiper-personalizado. Sem blast no Sales Nav.",
        bullets: [
          "Identificação do alvo + timing de compra (rodada, contratação, fala pública)",
          "Captura automática 24/7 dos sinais → enriquecimento contatos (Hunter, Enrow)",
          "Copywriting ancorado no verbatim exato da pessoa",
          "Alerta Telegram + briefing contextualizado antes de cada encontro",
        ],
        proof: [
          "Marca de luxo — encontro com diretor de marketing após painel IA retail",
          "Corretora de energia B2B — pipeline cooperativas, 4 TPs sequenciados",
          "Parrit para si mesma — deals em andamento com marcas internacionais",
        ],
        notfor: "Ticket médio baixo ou lógica de volume? Não é para você.",
        accent: "#c8956c",
        clusters: [
          {
            label: "Growth & Acquisition",
            agents: [
              { name: "Time growth outbound", status: "live" },
              { name: "Referenciamento aquisição", status: "live" },
              { name: "Captura sinais podcasts", status: "live" },
              { name: "Captura sinais eventos B2B", status: "live" },
            ],
          },
          {
            label: "Marketing & Copy",
            agents: [
              { name: "Time copywriting", status: "live" },
              { name: "Personalização 1-a-1", status: "live" },
              { name: "Teste A/B de copy", status: "live" },
              { name: "Brand voice tuner", status: "soon" },
            ],
          },
          {
            label: "Sales & Encontros",
            agents: [
              { name: "Briefing antes do encontro", status: "live" },
              { name: "CRM auto-atualizado", status: "live" },
              { name: "Follow-up multi-canal", status: "live" },
              { name: "Closing playbook agent", status: "soon" },
            ],
          },
        ],
      },
      {
        id: "prototype",
        chip: "Prototyping",
        title: "Prototipagem rápida",
        sub: "Ver a IA funcionando antes de investir pesado",
        pitch: "Você identificou um tema doloroso na empresa. Transformamos em uma ferramenta que funciona, entregue em dias. Código auditado pela agência parceira antes da entrega.",
        bullets: [
          "Um tema, definido, mensurável — não um programa",
          "Stack Claude Code = 10× mais rápido que os métodos clássicos",
          "Três famílias: back-office doloroso / negócios / agente que reproduz um humano",
          "Documentação técnica + treinamento na entrega",
        ],
        proof: [
          "Marca artesanal premium — captura leads multi-canal → WhatsApp",
          "Vendedor Amazon — reescrita automática de fichas de produto",
          "Bot supervisão watch escritório advocacia — filtro humano antes",
        ],
        notfor: "Buscando um consultor que entrega um audit ou um deck? Não é para você.",
        accent: "#C44536",
        clusters: [
          {
            label: "Engineering",
            agents: [
              { name: "Full-stack builder", status: "live" },
              { name: "Integrador API", status: "live" },
              { name: "Merge conflict mediator", status: "live" },
              { name: "Test runner auto", status: "soon" },
            ],
          },
          {
            label: "Produto & UX",
            agents: [
              { name: "PRD V0 auto-gerado", status: "live" },
              { name: "Sintetizador de user research", status: "live" },
              { name: "Wireframe para código", status: "soon" },
              { name: "Persona simulator", status: "soon" },
            ],
          },
          {
            label: "Data & Watch",
            agents: [
              { name: "Scraper de mercado", status: "live" },
              { name: "Watch concorrencial", status: "live" },
              { name: "GEO / Amazon Rufus", status: "live" },
              { name: "Dashboard KPI sob medida", status: "live" },
            ],
          },
        ],
      },
      {
        id: "formation",
        chip: "Training",
        title: "Treinamento hands-on",
        sub: "Sua equipe constrói seu agente em 2 dias",
        pitch: "Formato Sprint Builders: cada participante prototipa seu caso real com Claude Code + Gemini. Saída: uma ferramenta rodando no dia a dia.",
        bullets: [
          "Discovery Hackathon 1 dia — primeiro agente entregue",
          "Sprint Builder 2 dias (flagship) — 6 a 8 pessoas, casos reais",
          "Cohorte Estratégica 6 semanas — equipe completa",
          "Train-the-Trainer para internalizar o método",
        ],
        proof: [
          "Grande varejista esportiva — programa executivo em discussão (time T&D AI)",
          "Escola de gestão — Sprint Builders executivos exec ed",
          "Executivo farma em transição — pacote autonomia Claude Code (B2C)",
        ],
        notfor: "Qualiopi finalizado junho 2026. Antes disso, financiamento OPCO não garantido.",
        accent: "#7C5BA1",
        clusters: [
          {
            label: "Formatos",
            agents: [
              { name: "Discovery Hackathon 1 dia", status: "live" },
              { name: "Sprint Builder 2 dias", status: "live" },
              { name: "Cohorte Estratégica 6 sem", status: "live" },
              { name: "Train-the-Trainer", status: "live" },
            ],
          },
          {
            label: "Stack ensinada",
            agents: [
              { name: "Claude Code (Anthropic)", status: "live" },
              { name: "Gemini Vertex AI", status: "live" },
              { name: "n8n workflow", status: "live" },
              { name: "MCP servers caseiros", status: "live" },
            ],
          },
          {
            label: "Casos prototipados",
            agents: [
              { name: "Agente busca de emprego", status: "live" },
              { name: "Watch jurídico CEO", status: "live" },
              { name: "Captura leads WhatsApp", status: "live" },
              { name: "GEO e-commerce", status: "live" },
            ],
          },
        ],
      },
    ],
    panel: {
      manifeste: {
        title: "Manifesto",
        body: [
          "A gente constrói. A gente não dá conselho.",
          "Sem deck. Sem TJM. Sem palavra inventada para soar pro.",
          "Um tema preciso definido em 45 minutos. Uma ferramenta entregue em dias, instalada no seu site. Código auditado por uma agência dev parceira antes da produção.",
          "A gente fica no leme: Paul shipa o 0 → 1, Yukun coloca em produção. Sem júnior, sem subcontratado.",
          "Se não roda em produção no final, a gente não fez o trabalho.",
        ],
      },
      transformation: {
        title: "Nossa definição de transformação",
        eyebrow: "Anti-jargão · Anti-consultoria",
        blocks: [
          {
            tag: "O que NÃO é",
            body: "Para nós, transformar uma empresa não é um audit, nem um programa de três anos, nem uma consultoria que passa seis meses mapeando seus processos para entregar um PowerPoint. Isso é o que freia sua transformação.",
          },
          {
            tag: "O que É",
            body: "Uma transformação IA bem-sucedida é uma ferramenta que não existia semana passada, que roda em produção dentro das suas operações na segunda-feira, e que um colaborador seu usa sem precisar da gente do lado. A gente mede: tempo ganho por semana, negócio adicional, margem liberada.",
          },
          {
            tag: "Como fazemos",
            body: "Escolhemos um tema preciso com você em 45 minutos. Paul codifica a ferramenta com seus agentes, audita com uma agência parceira, depois Yukun coloca em produção na sua stack. Três a seis semanas após o primeiro call, você ganhou sua primeira ferramenta. Uma. Não trinta. É assim que a gente transforma: uma ferramenta por vez, sem bullshit.",
          },
        ],
        closing: "Se você quer uma consultoria que entrega um audit ou um deck, não é a gente. Se você quer uma ferramenta que roda segunda-feira de manhã, fomos feitos um para o outro.",
      },
      methode: {
        title: "Método",
        steps: [
          { n: "01", t: "Briefing 45 min — grátis", d: "Uma call com Paul. Escolhemos um tema preciso, mensurável. Não um programa de transformação. Se não é para você, falamos." },
          { n: "02", t: "Build 5–15 dias", d: "Paul codifica a ferramenta com Claude Code, conectado à sua stack (Gmail, CRM, ERP, Sheets…). Check-in semanal de 30 min." },
          { n: "03", t: "Auditoria de código por agência parceira", d: "Antes da entrega, uma agência dev sênior (10+ anos) audita segurança, manutenção e compliance. É isso que tranquiliza seu TI." },
          { n: "04", t: "Entrega + treinamento na sua empresa", d: "Deploy na sua infraestrutura. Documentação técnica. Meio-dia de treinamento. Você fica autônomo." },
        ],
      },
      cas: {
        title: "Casos de cliente",
        intro: "Casos reais Parrit, anonimizados. Detalhes e números na call.",
        items: [
          { t: "Marca artesanal premium — cutelaria", d: "Captura leads multi-canal (TikTok + Snapchat + e-com + tel) → WhatsApp segmentado" },
          { t: "Escritório de advocacia", d: "Operating system: triagem inbox, RFPs, watch jurídico daily" },
          { t: "Corretora de energia B2B", d: "Pipeline outbound 4 TPs sequenciados ancorado em sinal fresco" },
          { t: "Grupo de defesa (NDA)", d: "Compliance officer agent — RFPs e contratos auditados auto" },
          { t: "Agência dev sênior", d: "Relatório CEO consolidado Excel + CRM + ERP em uma vista lunes manhã" },
          { t: "Grande varejista esportiva (em discussão)", d: "Sprint Builders executivos hands-on agentes IA" },
        ],
      },
      paul: {
        title: "Paul Larmaraud",
        role: "Fundador · Canivete suíço 0 → 1",
        lines: [
          "Paul Larmaraud",
          "Fundador Parrit.ai",
          "Codifica todos os dias, assistido por agentes — entrega protótipos",
        ],
        story: [
          "Paul codifica todos os dias, assistido pelos seus agentes. Ele entrega os protótipos — sem subcontratado, sem júnior.",
          "Com você, ele define o perímetro do projeto e calcula o ROI esperado antes de tocar uma linha de código. A gente não deploya por deployar.",
          "Ele pré-configura os agentes — modelos, prompts, integrações, garde-fous — e passa o bastão para Yukun para o rollout em produção.",
          "Seu background — produto, operações, tech e SaaS — faz dele um canivete suíço para tomar qualquer projeto de 0 a 1.",
        ],
        facts: [
          { k: "Background", v: "Produto · Operações · Tech · SaaS" },
          { k: "Stack diária", v: "Claude Code · n8n · Supabase · Vercel" },
          { k: "Email", v: "paul.larmaraud@parrit.ai" },
          { k: "Telefone", v: "+33 6 83 76 22 19" },
        ],
        cta: "Agendar 15 min com Paul",
      },
      yukun: {
        title: "Yukun Leng",
        role: "Co-fundadora · Rollout em produção",
        lines: [
          "Yukun Leng — 冷宇坤",
          "Co-fundadora Parrit.ai",
          "10 anos orquestrando fluxos em grandes grupos",
        ],
        story: [
          "Yukun pega os agentes que Paul pré-configurou e os coloca em produção. É isso que faz um protótipo aguentar contra os seus sistemas reais.",
          "Dez anos como consultora SAP, orquestrando fluxos operacionais na LVMH e outros grandes grupos. Ela sabe o que significa \"tem que rodar todos os dias, sem falha\".",
          "Nos projetos Parrit, ela cuida da integração nas suas ferramentas (ERP, CRM, finanças), dos testes de uso do negócio, e da qualidade de serviço uma vez que o sistema está ao vivo.",
          "Ela também traz a metade chinesa da cultura Parrit: rigor, precisão, e uma prática real dos dois mundos — não uma firma francesa colando \"tech Asia\" por cima.",
        ],
        facts: [
          { k: "Experiência", v: "10 anos · Consultora SAP · grandes grupos" },
          { k: "Papel na Parrit", v: "Rollout produção · qualidade serviço" },
          { k: "Línguas", v: "Francês · Mandarim · Inglês" },
          { k: "Contato", v: "Via Paul — paul.larmaraud@parrit.ai" },
        ],
        cta: "Falar disso numa call com Paul",
      },
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
      sub: "Deixe seu email pro. Paul retoma pessoalmente para escopar seu caso e iniciar.",
      placeholder: "nome@empresa.com",
      hint: "ex: nome@empresa.com",
      submit: "Continuar",
      submitting: "Inscrevendo…",
      thanks: "Obrigado. Paul retorna em 24h.",
      error: "Falha. Tente de novo ou escreva para paul.larmaraud@parrit.ai.",
      navLabel: "Inscrever",
      ctaSecondary: "Ou só deixar meu email →",
    },
  },
  "zh-CN": {
    osTitle: "parrit.ai — 操作系统",
    brand: "PARRIT",
    tagline: "在您的公司部署成批定制 AI 智能体。",
    sub: "三条路径,我们为您部署 — 后台、商机、原型。第四条路径,我们培训您的团队自己部署。您的运营需要多少智能体,我们就接入多少,直接接入您的技术栈。即使您在睡觉。",
    cta: "联系 Paul",
    ctaMicro: "24 小时内回复 · 无承诺",
    leftDock: {
      title: "桌面",
      items: [
        { id: "manifeste", label: "宣言.md", icon: "doc" },
        { id: "transformation", label: "转型.md", icon: "doc" },
        { id: "methode", label: "方法.md", icon: "doc" },
        { id: "cas", label: "客户案例.md", icon: "folder" },
        { id: "paul", label: "Paul.vcf", icon: "person" },
        { id: "yukun", label: "Yukun.vcf", icon: "person" },
        { id: "open", label: "LinkedIn Paul ↗", icon: "external", href: "https://www.linkedin.com/in/paullarmaraud/" },
      ],
    },
    rightDock: { title: "服务", hint: "点击服务查看详情" },
    offers: [
      {
        id: "back-office",
        chip: "后台运营",
        title: "节省管理与重复任务的时间",
        sub: "(日常行政转型)",
        pitch: "我们将团队负担的工作自动化：文档、合规、RFP 跟进、合并报告。一个专属工具，交付并部署在您的公司。",
        bullets: [
          "45 分钟需求梳理：选定一个精确的用例",
          "5 到 15 天交付工具，代码经合作伙伴代理审核",
          "形式：轻量 Web 界面、嵌入您技术栈的静默智能体、或简单自动化",
          "包含生产部署和团队培训",
        ],
        proof: [
          "合规官智能体 — 自动审核发票、合同、RFP",
          "CEO 合并报告 — 商业 + 运营 KPI(Excel、CRM、ERP)",
          "律所运营系统 — 邮件、RFP、客户跟进协调",
        ],
        notfor: "如果您只想\"测试 AI\"而没有精确用例，不适合您。",
        accent: "#5FAF8E",
        clusters: [
          {
            label: "财务与合规",
            agents: [
              { name: "合规官", status: "live" },
              { name: "CEO 合并报告", status: "live" },
              { name: "RFP 跟进", status: "live" },
              { name: "发票自动审计", status: "live" },
            ],
          },
          {
            label: "运营与供应链",
            agents: [
              { name: "库存管理", status: "live" },
              { name: "供应链监控", status: "live" },
              { name: "电商订单跟进", status: "live" },
              { name: "多渠道库存", status: "soon" },
            ],
          },
          {
            label: "文档与邮件",
            agents: [
              { name: "领导收件箱分拣", status: "live" },
              { name: "半自动回复", status: "live" },
              { name: "每日法律监测", status: "live" },
              { name: "智能归档", status: "soon" },
            ],
          },
        ],
      },
      {
        id: "business",
        chip: "商机获取",
        title: "业务增长",
        sub: "通过意向信号获取合格会议",
        pitch: "我们在正确的时机捕捉在线信号(播客、活动、LinkedIn 帖子),并触发超个性化的联系。不是 Sales Nav 群发。",
        bullets: [
          "目标识别 + 购买时机(融资、关键招聘、公开发言)",
          "24/7 自动捕捉信号 → 联系人富集(Hunter、Enrow)",
          "基于对方原话锚定的文案撰写",
          "每次会议前 Telegram 提醒 + 情境简报",
        ],
        proof: [
          "奢侈品牌 — 通过零售 AI 小组会后与营销总监会面",
          "B2B 能源经纪人 — 物业管理公司外联管道,4 个序列接触点",
          "Parrit 自身 — 与国际品牌的合作进行中",
        ],
        notfor: "客单价低或追求数量逻辑?不适合您。",
        accent: "#c8956c",
        clusters: [
          {
            label: "增长获客",
            agents: [
              { name: "增长外联团队", status: "live" },
              { name: "获客引荐", status: "live" },
              { name: "播客信号捕捉", status: "live" },
              { name: "B2B 活动信号捕捉", status: "live" },
            ],
          },
          {
            label: "营销与文案",
            agents: [
              { name: "营销文案团队", status: "live" },
              { name: "一对一个性化", status: "live" },
              { name: "A/B 文案测试", status: "live" },
              { name: "品牌语调调校", status: "soon" },
            ],
          },
          {
            label: "销售与会议",
            agents: [
              { name: "会前简报", status: "live" },
              { name: "CRM 自动更新", status: "live" },
              { name: "多渠道跟进", status: "live" },
              { name: "成单剧本智能体", status: "soon" },
            ],
          },
        ],
      },
      {
        id: "prototype",
        chip: "快速原型",
        title: "快速原型",
        sub: "重投入前先看到 AI 运行",
        pitch: "您发现公司里有个痛点。我们在几天内把它变成一个能跑的工具。交付前由合作伙伴代理审计代码。",
        bullets: [
          "一个主题,定义清晰,可衡量 — 不是一个项目",
          "Claude Code 技术栈 = 比经典方法快 10×",
          "三大类:痛苦后台 / 业务 / 模拟人工的智能体",
          "技术文档 + 交付时培训",
        ],
        proof: [
          "高端手工艺品牌 — 多渠道线索捕捉 → WhatsApp",
          "亚马逊零售卖家 — 自动重写产品页",
          "律所监测机器人 — 人工前置过滤",
        ],
        notfor: "寻找做审计或交付 PPT 的顾问?不适合您。",
        accent: "#C44536",
        clusters: [
          {
            label: "工程",
            agents: [
              { name: "全栈构建者", status: "live" },
              { name: "API 集成者", status: "live" },
              { name: "合并冲突调解", status: "live" },
              { name: "自动测试运行", status: "soon" },
            ],
          },
          {
            label: "产品与体验",
            agents: [
              { name: "PRD V0 自动生成", status: "live" },
              { name: "用户研究合成器", status: "live" },
              { name: "线框图转代码", status: "soon" },
              { name: "用户画像模拟器", status: "soon" },
            ],
          },
          {
            label: "数据与监测",
            agents: [
              { name: "市场爬虫", status: "live" },
              { name: "竞品监测", status: "live" },
              { name: "GEO / Amazon Rufus", status: "live" },
              { name: "定制 KPI 仪表板", status: "live" },
            ],
          },
        ],
      },
      {
        id: "formation",
        chip: "培训",
        title: "实战培训",
        sub: "您的团队 2 天构建自己的智能体",
        pitch: "Sprint Builders 形式:每位参与者用 Claude Code + Gemini 为自己真实的业务用例做原型。产出:在日常工作中运行的工具。",
        bullets: [
          "探索黑客松 1 天 — 第一个智能体上线",
          "Sprint Builder 2 天(旗舰)— 6 到 8 人,真实案例",
          "战略队列 6 周 — 完整团队",
          "讲师培训 — 内化方法论",
        ],
        proof: [
          "大型运动零售商 — 高管项目讨论中 (T&D AI 团队)",
          "管理学院 — 高管 Sprint Builders 培训",
          "制药公司转型高管 — Claude Code 自主性套件 (B2C)",
        ],
        notfor: "Qualiopi 资格 2026 年 6 月生效。在此之前,OPCO 资助无法保证。",
        accent: "#7C5BA1",
        clusters: [
          {
            label: "形式",
            agents: [
              { name: "探索黑客松 1 天", status: "live" },
              { name: "Sprint Builder 2 天", status: "live" },
              { name: "战略队列 6 周", status: "live" },
              { name: "讲师培训", status: "live" },
            ],
          },
          {
            label: "教授的技术栈",
            agents: [
              { name: "Claude Code (Anthropic)", status: "live" },
              { name: "Gemini Vertex AI", status: "live" },
              { name: "n8n 工作流", status: "live" },
              { name: "自建 MCP 服务", status: "live" },
            ],
          },
          {
            label: "已原型化的案例",
            agents: [
              { name: "求职智能体", status: "live" },
              { name: "CEO 法律监测", status: "live" },
              { name: "WhatsApp 线索捕获", status: "live" },
              { name: "电商 GEO", status: "live" },
            ],
          },
        ],
      },
    ],
    panel: {
      manifeste: {
        title: "宣言",
        body: [
          "我们构建。我们不咨询。",
          "没有 PPT。没有日费率。没有为了显得专业而发明的词。",
          "45 分钟定义精确的主题。几天内交付工具,部署在您的公司。生产前由合作伙伴代理审计代码。",
          "我们亲自操刀:Paul 负责 0 → 1 的交付,Yukun 负责生产部署。没有初级,没有外包。",
          "如果最后没在生产环境运行,我们就没完成工作。",
        ],
      },
      transformation: {
        title: "我们对转型的定义",
        eyebrow: "反术语 · 反咨询",
        blocks: [
          {
            tag: "不是什么",
            body: "对我们来说,企业转型不是一份审计、不是一个三年计划、也不是一家公司花六个月画您的流程图最后交付一份 PowerPoint。那种东西正在拖慢您的转型。",
          },
          {
            tag: "是什么",
            body: "一次成功的 AI 转型,是上周还不存在的一个工具,下周一就在您的运营中跑起来,而您的一位同事不需要我们在旁边就能使用它。我们衡量它:每周节省的时间、额外的业务、释放的利润。",
          },
          {
            tag: "我们怎么做",
            body: "我们在 45 分钟内和您一起选一个精确的主题。Paul 用他的智能体编写工具,由合作伙伴代理审计,然后 Yukun 在您的技术栈上推到生产。第一次通话后三到六周,您赢得第一个工具。一个。不是三十个。这就是我们转型的方式:一次一个工具,不胡扯。",
          },
        ],
        closing: "如果您想要一家交付审计或 PPT 的咨询公司,那不是我们。如果您想要一个周一早上就能运行的工具,我们是天造地设。",
      },
      methode: {
        title: "方法",
        steps: [
          { n: "01", t: "45 分钟需求梳理 — 免费", d: "和 Paul 通话。我们选一个精确、可衡量的主题。不是一个转型计划。如果不适合您,我们会说。" },
          { n: "02", t: "5–15 天构建", d: "Paul 用 Claude Code 编写工具,接入您的技术栈(Gmail、CRM、ERP、Sheets…)。每周 30 分钟同步,边走边调。" },
          { n: "03", t: "合作伙伴代理代码审计", d: "交付前,资深开发代理(10+ 年经验)审计安全性、可维护性、合规性。这是让您 IT 部门放心的关键。" },
          { n: "04", t: "交付 + 现场培训", d: "在您的基础设施上部署。技术文档。半天团队培训。您离开时自主。" },
        ],
      },
      cas: {
        title: "客户案例",
        intro: "Parrit 真实案例,出于保密考虑已匿名化。详情和数字在通话中分享。",
        items: [
          { t: "高端手工艺品牌 — 刀具", d: "多渠道线索捕捉(TikTok + Snapchat + 电商 + 电话)→ 按买家类型分群的 WhatsApp" },
          { t: "商业法律事务所", d: "管理层运营系统:收件箱分拣、RFP、每日法律监测" },
          { t: "B2B 能源经纪人", d: "4 个序列接触点的外联管道,基于新鲜信号" },
          { t: "防务集团(NDA)", d: "合规官智能体 — RFP 和合同自动审核" },
          { t: "资深开发代理", d: "合并 CEO 报告 Excel + CRM + ERP 在周一晨视图" },
          { t: "大型运动零售商 (讨论中)", d: "高管 Sprint Builders 实战 AI 智能体" },
        ],
      },
      paul: {
        title: "Paul Larmaraud",
        role: "创始人 · 0 → 1 瑞士军刀",
        lines: [
          "Paul Larmaraud",
          "Parrit.ai 创始人",
          "每天编码,由智能体辅助 — 交付原型",
        ],
        story: [
          "Paul 每天编码,由他的智能体辅助。他亲自交付原型 — 没有外包,没有初级。",
          "他和您一起定义项目范围,在写一行代码前计算预期投资回报。我们不为了部署而部署。",
          "然后他预配置智能体 — 模型、提示词、集成、护栏 — 并把接力棒交给 Yukun 进行生产推出。",
          "他的背景 — 产品、运营、技术和 SaaS — 让他成为一把真正的瑞士军刀,把任何项目从 0 推到 1。",
        ],
        facts: [
          { k: "背景", v: "产品 · 运营 · 技术 · SaaS" },
          { k: "日常技术栈", v: "Claude Code · n8n · Supabase · Vercel" },
          { k: "邮箱", v: "paul.larmaraud@parrit.ai" },
          { k: "电话", v: "+33 6 83 76 22 19" },
        ],
        cta: "预约 Paul 15 分钟",
      },
      yukun: {
        title: "冷宇坤 Yukun Leng",
        role: "联合创始人 · 生产部署",
        lines: [
          "冷宇坤 — Yukun Leng",
          "Parrit.ai 联合创始人",
          "10 年大集团流程编排经验",
        ],
        story: [
          "Yukun 把 Paul 预配置好的智能体推到生产。这就是为什么原型能在您的真实系统中站住脚。",
          "10 年 SAP 顾问,在 LVMH 和其他大集团编排运营流程。她知道\"必须每天运行,无故障\"是什么意思。",
          "在 Parrit 项目中,她负责集成到您的工具(ERP、CRM、财务)、业务侧用户测试、系统上线后的服务质量。",
          "她也带来 Parrit 文化中的中国一面:严谨、精确,以及两个世界的真实实践 — 不是法国公司贴上\"亚洲科技\"的标签。",
        ],
        facts: [
          { k: "经验", v: "10 年 · SAP 顾问 · 大集团" },
          { k: "Parrit 角色", v: "生产部署 · 服务质量" },
          { k: "语言", v: "法语 · 普通话 · 英语" },
          { k: "联系", v: "通过 Paul — paul.larmaraud@parrit.ai" },
        ],
        cta: "通过和 Paul 通话讨论",
      },
    },
    contact: {
      title: "联系 Paul",
      sub: "邮箱、电话、LinkedIn 或 WhatsApp — 您选。24 小时内回复。",
      placeholder: "您的邮箱或电话",
      submit: "发送",
      submitting: "发送中…",
      thanks: "谢谢。我会在 24 小时内回复。",
      error: "发送失败。请写信至 paul.larmaraud@parrit.ai。",
      micro: "您的信息留在 Parrit。符合 GDPR。",
    },
    waitlist: {
      eyebrow: "欢迎来到 Parrit",
      title: "开始您的入职。",
      sub: "留下您的工作邮箱。Paul 会亲自接手,梳理您的案例并启动。",
      placeholder: "name@company.com",
      hint: "例如:name@company.com",
      submit: "继续",
      submitting: "订阅中…",
      thanks: "谢谢。Paul 会在 24 小时内联系您。",
      error: "失败。请重试或写信至 paul.larmaraud@parrit.ai。",
      navLabel: "注册",
      ctaSecondary: "或留下我的邮箱 →",
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
  transformation: {
    title: string;
    eyebrow: string;
    blocks: readonly { tag: string; body: string }[];
    closing: string;
  };
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
    { cx: 480, cy: 310, fill: "#7C5BA1", label: labels.agents[3], phase: 1.8 },   // formation (violet)
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
   SLOT PICKER — custom scheduler (no Calendly subscription)
   Posts to webhook with action=meeting_request, Paul confirms via Telegram
   ─────────────────────────────────────────────── */
function SlotPicker({ accent }: { accent?: string }) {
  const [email, setEmail] = useState("");
  const [slot, setSlot] = useState<{ day: string; period: string } | null>(null);
  const [note, setNote] = useState("");
  const [state, setState] = useState<"idle" | "sending" | "sent" | "error">("idle");

  // Generate next 5 weekdays
  const days = useNextWeekdays(5);
  const periods = [
    { id: "morning", label: "Matin", time: "9h–12h" },
    { id: "afternoon", label: "Après-midi", time: "14h–18h" },
  ];

  async function submitSlot(e: React.FormEvent) {
    e.preventDefault();
    if (!slot || !email.includes("@")) return;
    setState("sending");
    const utms = getAttribution();
    try {
      await fetch(WEBHOOK_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          source: "parrit.ai",
          action: "meeting_request",
          email,
          slot_day: slot.day,
          slot_period: slot.period,
          note,
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

  if (state === "sent") {
    return (
      <div
        style={{
          padding: "20px 22px",
          background: "#5FAF8E22",
          border: "2px solid #5FAF8E",
          borderRadius: 12,
          textAlign: "center",
        }}
      >
        <p style={{ margin: 0, fontFamily: "var(--font-heading)", fontSize: 20, fontWeight: 500, color: "#2A2420" }}>
          ✓ Créneau demandé
        </p>
        <p style={{ margin: "6px 0 0", fontFamily: "var(--font-body)", fontSize: 13.5, color: "#5A5047", lineHeight: 1.5 }}>
          Paul reçoit l'alerte sur Telegram. Il confirme et vous envoie le lien visio sous 24h.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={submitSlot}>
      <p
        style={{
          margin: "0 0 10px",
          fontFamily: "var(--font-body)",
          fontSize: 12,
          fontWeight: 700,
          letterSpacing: "0.16em",
          textTransform: "uppercase",
          color: "#8A7E70",
        }}
      >
        1 · Choisissez un créneau
      </p>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: `repeat(${days.length}, 1fr)`,
          gap: 6,
          marginBottom: 10,
        }}
      >
        {days.map((d) => (
          <div key={d.iso}>
            <p
              style={{
                margin: "0 0 4px",
                fontFamily: "var(--font-body)",
                fontSize: 10.5,
                fontWeight: 700,
                color: "#5A5047",
                textAlign: "center",
                letterSpacing: "0.04em",
              }}
            >
              {d.label}
            </p>
            <p
              style={{
                margin: "0 0 4px",
                fontFamily: "var(--font-body)",
                fontSize: 9,
                color: "#8A7E70",
                textAlign: "center",
              }}
            >
              {d.short}
            </p>
            <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
              {periods.map((p) => {
                const isSelected = slot?.day === d.iso && slot?.period === p.id;
                return (
                  <button
                    key={p.id}
                    type="button"
                    onClick={() => setSlot({ day: d.iso, period: p.id })}
                    style={{
                      padding: "8px 4px",
                      background: isSelected ? (accent || "#c8956c") : "#FFFCF5",
                      color: isSelected ? "#2A2420" : "#5A5047",
                      border: `1.5px solid ${isSelected ? "#2A2420" : "#2A24201A"}`,
                      borderRadius: 6,
                      fontFamily: "var(--font-body)",
                      fontSize: 10,
                      fontWeight: isSelected ? 700 : 500,
                      cursor: "pointer",
                      transition: "all 0.12s",
                      lineHeight: 1.1,
                    }}
                  >
                    {p.label}
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </div>
      <p
        style={{
          margin: "0 0 10px",
          fontFamily: "var(--font-body)",
          fontSize: 11,
          color: "#8A7E70",
          textAlign: "center",
        }}
      >
        Heure Paris · Paul vous proposera un créneau précis dans la plage choisie.
      </p>

      <p
        style={{
          margin: "16px 0 8px",
          fontFamily: "var(--font-body)",
          fontSize: 12,
          fontWeight: 700,
          letterSpacing: "0.16em",
          textTransform: "uppercase",
          color: "#8A7E70",
        }}
      >
        2 · Votre email
      </p>
      <input
        type="email"
        required
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="nom@entreprise.com"
        disabled={state === "sending"}
        style={{
          width: "100%",
          padding: "12px 14px",
          border: "2px solid #2A2420",
          borderRadius: 8,
          background: "#FFFCF5",
          fontFamily: "var(--font-body)",
          fontSize: 14,
          color: "#2A2420",
          outline: "none",
          marginBottom: 10,
        }}
      />
      <input
        type="text"
        value={note}
        onChange={(e) => setNote(e.target.value)}
        placeholder="Sujet (facultatif) — ex : automatiser notre reporting"
        disabled={state === "sending"}
        style={{
          width: "100%",
          padding: "10px 14px",
          border: "2px solid #2A2420",
          borderRadius: 8,
          background: "#FFFCF5",
          fontFamily: "var(--font-body)",
          fontSize: 13,
          color: "#2A2420",
          outline: "none",
          marginBottom: 14,
        }}
      />

      <button
        type="submit"
        disabled={!slot || !email.includes("@") || state === "sending"}
        style={{
          width: "100%",
          padding: "14px 22px",
          background: (slot && email.includes("@")) ? "var(--parrit-red)" : "#A09488",
          color: "#FFFCF5",
          border: "2px solid #2A2420",
          borderRadius: 10,
          fontFamily: "var(--font-body)",
          fontSize: 14,
          fontWeight: 700,
          cursor: (slot && email.includes("@")) ? "pointer" : "not-allowed",
          boxShadow: (slot && email.includes("@")) ? "4px 4px 0 #2A2420" : "none",
          transition: "all 0.1s",
        }}
      >
        {state === "sending" ? "Envoi…" : "Demander le créneau →"}
      </button>
      {state === "error" && (
        <p style={{ marginTop: 8, color: "#C44536", fontSize: 12, textAlign: "center" }}>
          Échec d'envoi. Essayez l'email plus bas ou paul.larmaraud@parrit.ai.
        </p>
      )}
    </form>
  );
}

function useNextWeekdays(count: number) {
  const days: { iso: string; label: string; short: string }[] = [];
  const d = new Date();
  while (days.length < count) {
    d.setDate(d.getDate() + 1);
    const wd = d.getDay();
    if (wd === 0 || wd === 6) continue; // skip weekend
    const labels = ["Dim", "Lun", "Mar", "Mer", "Jeu", "Ven", "Sam"];
    const months = ["jan", "fév", "mar", "avr", "mai", "jui", "jui", "aoû", "sep", "oct", "nov", "déc"];
    days.push({
      iso: d.toISOString().slice(0, 10),
      label: labels[wd],
      short: `${d.getDate()} ${months[d.getMonth()]}`,
    });
  }
  return days;
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

      <SlotPicker accent={accent} />

      <p
        style={{
          margin: "16px 0 12px",
          fontFamily: "var(--font-body)",
          fontSize: 11,
          fontWeight: 700,
          letterSpacing: "0.18em",
          textTransform: "uppercase",
          color: "#8A7E70",
          textAlign: "center",
        }}
      >
        — ou juste un mot —
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
  which: "manifeste" | "transformation" | "methode" | "cas" | "paul" | "yukun" | "yukun";
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
  if (which === "transformation") {
    const t = panel.transformation;
    const tagColors = ["#C44536", "#5FAF8E", "#c8956c"];
    return (
      <div>
        <p
          style={{
            fontFamily: "var(--font-body)",
            fontSize: 11,
            fontWeight: 700,
            letterSpacing: "0.2em",
            textTransform: "uppercase",
            color: "var(--parrit-red)",
            margin: "0 0 18px",
          }}
        >
          {t.eyebrow}
        </p>
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          {t.blocks.map((b, i) => (
            <div
              key={b.tag}
              style={{
                padding: "16px 18px",
                background: "#FFFCF5",
                border: `1.5px solid ${tagColors[i]}`,
                borderLeft: `5px solid ${tagColors[i]}`,
                borderRadius: 10,
              }}
            >
              <p
                style={{
                  margin: "0 0 8px",
                  fontFamily: "var(--font-body)",
                  fontSize: 11,
                  fontWeight: 700,
                  letterSpacing: "0.16em",
                  textTransform: "uppercase",
                  color: tagColors[i],
                }}
              >
                {b.tag}
              </p>
              <p
                style={{
                  margin: 0,
                  fontFamily: "var(--font-body)",
                  fontSize: 14.5,
                  lineHeight: 1.6,
                  color: "#2A2420",
                }}
              >
                {b.body}
              </p>
            </div>
          ))}
        </div>
        <p
          style={{
            marginTop: 20,
            fontFamily: "var(--font-heading)",
            fontSize: 17,
            fontStyle: "italic",
            lineHeight: 1.5,
            color: "#2A2420",
            textAlign: "center",
            padding: "0 4px",
          }}
        >
          {t.closing}
        </p>
        <div style={{ textAlign: "center", marginTop: 20 }}>
          <button
            onClick={onOpenContact}
            style={{
              padding: "12px 22px",
              background: "var(--parrit-red)",
              border: "2px solid #2A2420",
              borderRadius: 8,
              fontFamily: "var(--font-body)",
              fontSize: 14,
              fontWeight: 700,
              color: "#FFFCF5",
              cursor: "pointer",
              boxShadow: "3px 3px 0 #2A2420",
            }}
          >
            {contact.title} →
          </button>
        </div>
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
export default function HomeClient({
  dict,
  lang,
  featuredPosts = [],
}: {
  dict: Dictionary;
  lang: Locale;
  featuredPosts?: FeaturedPost[];
}) {
  const copy = getCopy(lang);
  const [open, setOpen] = useState<null | { kind: "offer"; idx: number } | { kind: "panel"; which: "manifeste" | "transformation" | "methode" | "cas" | "paul" | "yukun" } | { kind: "contact"; accent?: string } | { kind: "waitlist" }>(null);

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
  const openPanel = (which: "manifeste" | "transformation" | "methode" | "cas" | "paul" | "yukun") =>
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
              if (it.id === "manifeste" || it.id === "transformation" || it.id === "methode" || it.id === "cas" || it.id === "paul" || it.id === "yukun") {
                openPanel(it.id as "manifeste" | "transformation" | "methode" | "cas" | "paul" | "yukun");
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
            <p className="parrit-os-eyebrow">{
              lang === "fr" ? "Transformation IA · de 0 à la production"
              : lang === "en" ? "AI transformation · from 0 to production"
              : lang === "zh-CN" ? "AI 转型 · 从 0 到生产"
              : "Transformação IA · do 0 à produção"
            }</p>
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
                you: lang === "fr" ? "Vous" : lang === "zh-CN" ? "您" : lang === "pt-BR" ? "Você" : "You",
                youSub: lang === "fr" ? "Le dirigeant" : lang === "zh-CN" ? "决策者" : lang === "pt-BR" ? "O líder" : "The founder",
                parrit: "Parrit",
                parritSub: lang === "fr" ? "Votre copilot" : lang === "zh-CN" ? "您的副驾" : lang === "pt-BR" ? "Seu copiloto" : "Your copilot",
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

      {/* ── Blog grid — what we write about ── */}
      {featuredPosts.length > 0 && (
        <section className="parrit-os-blog-row" aria-label="Articles">
          <p className="parrit-os-stamps-eyebrow">
            {lang === "fr"
              ? "On écrit · Comment on transforme concrètement"
              : lang === "en"
              ? "We write · How we transform, concretely"
              : lang === "zh-CN"
              ? "我们的文章 · 我们如何具体地推进转型"
              : "A gente escreve · Como a gente transforma, concretamente"}
          </p>
          <div className="parrit-os-blog-cards">
            {featuredPosts.slice(0, 4).map((post, i) => {
              const accents = ["#5FAF8E", "#c8956c", "#C44536", "#7C5BA1"];
              const accent = accents[i % accents.length];
              const blogLang = lang === "zh-CN" ? "en" : lang;
              return (
                <motion.div
                  key={post.slug}
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-40px" }}
                  transition={{ duration: 0.4, delay: i * 0.08 }}
                  style={{ display: "flex" }}
                >
                  <Link
                    href={`/${blogLang}/blog/${post.slug}`}
                    className="parrit-os-blog-card"
                    style={{ ["--card-accent" as string]: accent } as React.CSSProperties}
                  >
                    <span
                      className="parrit-os-blog-card-chip"
                      style={{
                        background: accent,
                        color: accent === "#2A2420" ? "#FFFCF5" : "#2A2420",
                      }}
                    >
                      {post.category}
                    </span>
                    <h3 className="parrit-os-blog-card-title">{post.title}</h3>
                    <p className="parrit-os-blog-card-desc">{post.description}</p>
                    <div className="parrit-os-blog-card-footer">
                      <span>{post.readingTime}</span>
                      <span>{post.date.slice(0, 10)}</span>
                    </div>
                    <span className="parrit-os-blog-card-cta">
                      {lang === "fr" ? "Lire l'article →" : lang === "en" ? "Read article →" : lang === "zh-CN" ? "阅读文章 →" : "Ler artigo →"}
                    </span>
                  </Link>
                </motion.div>
              );
            })}
          </div>
          <div style={{ textAlign: "center", marginTop: 18 }}>
            <Link
              href={`/${lang === "zh-CN" ? "en" : lang}/blog`}
              style={{
                fontFamily: "var(--font-body)",
                fontSize: 13,
                fontWeight: 600,
                color: "var(--parrit-red)",
                textDecoration: "underline",
                textUnderlineOffset: 4,
              }}
            >
              {lang === "fr" ? "Voir tous les articles" : lang === "en" ? "See all articles" : lang === "zh-CN" ? "查看全部文章" : "Ver todos os artigos"} →
            </Link>
          </div>
        </section>
      )}


      {/* ── Bottom status bar ─────────────────── */}
      <footer className="parrit-os-statusbar">
        <span>● parrit.ai</span>
        <span>Paul Larmaraud · paul.larmaraud@parrit.ai</span>
        <span className="parrit-os-clock">{new Date().toLocaleDateString(lang === "fr" ? "fr-FR" : lang === "zh-CN" ? "zh-CN" : lang === "pt-BR" ? "pt-BR" : "en-US", { day: "2-digit", month: "short" })}</span>
      </footer>
    </div>
  );
}
