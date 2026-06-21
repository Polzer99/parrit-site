"use client";

/* ════════════════════════════════════════════════════════════════════════
   parrit.ai — home « desktop-OS ». Carte du fichier (voir /AGENTS.md) :
   1. const COPY (DICT) ≈ ll.27-1620 — CONTENU, un bloc par langue :
      fr ≈28 · en ≈418 · "pt-BR" ≈807 · "zh-CN" ≈1174.
      Même forme partout : offers[], panel.{manifeste,transformation,methode,
      cas,paul,yukun}, contact, waitlist, docks. Éditer 1 langue = répliquer ×4.
   2. Types (AgentBox/OfferCopy/PanelCopy/FullCopy) + getCopy() ≈1543-1624.
   3. Composants (STYLE, inline) ≈1631-3450 : Icon*, HeroScene, Win (modale),
      SlotPicker, ContactBlock, WaitlistWindow, OfferWindow, PanelContent
      (rend les panels), WorldMap.
   4. export default HomeClient ≈3455 : topbar → grid (docks+hero) → deux fronts
      → carte monde → modales → blog → statusbar.
   Palette : crème #FEFDF9 / encre #0C0C0D / rouge #D1132F UNIQUEMENT (BRAND.md).
   Avant push : scripts/contrast-audit.py (cible TOTAL=0) + npm run build.
   ════════════════════════════════════════════════════════════════════════ */

import React, { useEffect, useMemo, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import LanguageSwitcher from "@/components/LanguageSwitcher";
import { captureTouch, getAttribution } from "@/lib/attribution";
import type { Dictionary, Locale } from "./dictionaries";
import { WORLD_DOTS, WORLD_H, WORLD_PINS, WORLD_W } from "./worldMapData";

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
    tagline: "On déploie l'IA dans votre entreprise. Et on l'opère avec vous.",
    sub: "Sur le front qui fait tourner votre boîte comme sur celui qui la fait grandir. Des outils qui tournent en production, qu'on porte avec vous. Tout ce qu'on montre ici, on l'a déjà déployé.",
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
        { id: "open", label: "LinkedIn Paul ↗", icon: "external", href: "https://www.linkedin.com/in/paul-larmaraud-365538179/" },
        { id: "diagnostic", label: "Parler à Parrit ↗", icon: "external", href: "/diagnostic" },
        { id: "outils", label: "Détecteur.app ↗", icon: "external", href: "/outils/detecteur-bullshit" },
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
          "Cadrage 45 min : on choisit un seul sujet précis",
          "Outil livré en 5 à 15 jours, code audité par notre agence partenaire",
          "Forme : interface web légère, agent silencieux dans votre stack, ou simple automation",
          "Mise en prod + formation de vos équipes inclus",
        ],
        proof: [
          "Compliance officer agent — vérification automatique de factures, contrats, RFP",
          "Reporting CEO consolidé — KPIs commerciaux + opérationnels (Excel, CRM, ERP)",
          "OS d'exploitation cabinet d'avocats — mails, RFP, suivi clients orchestrés",
          "Réunions → CRM sans saisie — comptes-rendus ingérés automatiquement, fiches à jour, relances datées posées au calendrier",
          "Visibilité dans l'IA d'achat d'Amazon — mesure continue de ce que Rufus recommande, pour une marque de café internationale",
          "Agent WhatsApp de pilotage — le dirigeant interroge son CRM et pose ses rappels à la voix",
        ],
        notfor: "Si vous voulez « tester l'IA » sans sujet précis, ce n'est pas pour vous.",
        accent: "#0C0C0D",
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
        pitch: "On capte les signaux en ligne (podcasts, events, posts LinkedIn) au bon moment, et on déclenche une prise de contact personnalisée, ancrée sur ce que la personne vient de dire en public.",
        bullets: [
          "Identification cible + timing d'achat (levée, recrutement, prise de parole)",
          "Capture auto 7j/7 des signaux → enrichissement contacts (Hunter, Enrow)",
          "Copywriting ancré sur le verbatim exact de la personne",
          "Alerte Telegram + brief contextualisé avant chaque RDV",
        ],
        proof: [
          "Marque luxe — RDV direction marketing suite à un panel IA retail",
          "Pipeline signaux podcasts & events en production — dirigeants contactés sur leur prise de parole récente",
          "Parrit pour son propre compte — deals en cours avec marques internationales",
        ],
        notfor: "Ticket moyen faible ou logique volume ? Pas pour vous.",
        accent: "#0C0C0D",
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
          "Claude Code : on livre en jours ce qui prenait des semaines",
          "Trois familles : back-office pénible / business / agent qui reproduit un humain",
          "Documentation technique + formation à la livraison",
        ],
        proof: [
          "Capture leads multi-canaux artisan haut de gamme — TikTok/Snap/e-commerce → WhatsApp",
          "Référencement Amazon vendeur retail — réécriture auto fiches produits",
          "Bot supervision veille cabinet d'avocats — filtre humain en amont",
        ],
        notfor: "Vous cherchez un consultant qui produit un audit ou un deck ? Pas pour vous.",
        accent: "#D1132F",
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
        accent: "#0C0C0D",
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
      {
        id: "claude-code",
        chip: "Claude Code",
        title: "Claude Code as a service",
        sub: "Audit, configuration & sprint : vos équipes équipées et autonomes",
        pitch: "Claude Code, c'est la plateforme d'agents d'Anthropic : celle qui fait tourner tout le système interne de Parrit. On l'installe proprement dans vos outils existants : audit de l'existant, configuration aux standards de production, modules de contexte prêts à l'emploi, et maîtrise des coûts d'utilisation (les tokens) dès le premier jour. Pour PME, ETI et grandes écoles, en France et en Europe.",
        bullets: [
          "Audit de votre environnement de dev et de vos cas d'usage : 1 journée, plan d'action concret",
          "Configuration complète : connaissance de vos projets, compétences métier sur mesure, garde-fous de dépense, optimisation des coûts",
          "Sprint Claude Code : accompagnement intensif de 1 à 4 jours, on construit avec vos équipes, chez vous ou à distance",
          "Modules prêts à l'emploi ingérés par votre instance + support asynchrone entre les sessions",
        ],
        proof: [
          "Grande école de management internationale — audit & configuration pour 2 profils basés à Singapour (cadrage en cours)",
          "Dirigeant pharma en transition — autonomie complète Claude Code en 8 heures",
          "Parrit pour son propre compte — tout notre OS interne tourne sur Claude Code",
        ],
        notfor: "Vous cherchez une licence ou un outil sur étagère sans accompagnement ? Ce n'est pas pour vous.",
        accent: "#0C0C0D",
        clusters: [
          {
            label: "Formats",
            agents: [
              { name: "Audit 1 jour — plan d'action", status: "live" },
              { name: "Audit & Configuration", status: "live" },
              { name: "Sprint Claude Code 1-4j", status: "live" },
              { name: "Setup équipes + suivi", status: "live" },
            ],
          },
          {
            label: "Ce qu'on configure",
            agents: [
              { name: "Mémoire projet & skills", status: "live" },
              { name: "Optimisation tokens & caching", status: "live" },
              { name: "Garde-fous de dépense", status: "live" },
              { name: "Pipelines agentiques (CI/CD)", status: "live" },
            ],
          },
        ],
        pages: [
          { label: "Audit Claude Code", href: "/fr/audit-claude-code" },
          { label: "Sprint Claude Code", href: "/fr/sprint" },
          { label: "Setup équipes", href: "/fr/setup-claude-code" },
        ],
      },
    ],
    panel: {
      manifeste: {
        title: "Manifeste",
        body: [
          "Parrit, c'est deux personnes et une conviction simple : on transforme une entreprise en y posant un outil qui tourne, pas en lui remettant un rapport qui finit dans un tiroir.",
          "Paul code. Tous les jours, assisté par ses agents, il fabrique de ses mains le prototype qui n'existait pas la semaine d'avant. Yukun, dix ans passés à orchestrer les flux de grands groupes entre la France et la Chine, le reprend et le pousse en production là où tout se joue : dans vos vrais systèmes, le lundi matin. 速 veut dire vitesse. C'est notre nom, et c'est notre rythme : un premier prototype dès le premier appel.",
          "On ne vend ni slides, ni jours-homme, ni mot inventé pour faire sérieux. On choisit ensemble un sujet précis en 45 minutes, on construit l'outil en quelques jours, on le fait auditer par une agence de développeurs seniors, et on vous le livre posé chez vous : documenté, et déjà entre les mains de vos équipes, sans qu'on ait besoin d'être à côté.",
          "Un outil à la fois. Pas trente. Celui qui vous fait gagner du temps chaque semaine, ou celui qui vous ramène du business. Et on le mesure vraiment : le temps gagné, le chiffre en plus, la marge libérée.",
          "Si, au bout du compte, il ne tourne pas en production, c'est qu'on n'a pas fait notre travail.",
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
        intro: "Cas réels Parrit, anonymisés par respect de la confidentialité. Le statut de chaque mission est affiché tel quel : on ne survend rien. Détails et chiffres en call.",
        items: [
          { t: "Cabinet d'avocats d'affaires", s: "en production", d: "Bot de supervision de veille juridique : sources dépouillées chaque nuit, synthèse filtrée par un humain avant diffusion aux clients du cabinet. Tourne au quotidien. Extension en cours : OS d'exploitation pour la direction (tri inbox, suivi RFP)." },
          { t: "Marque artisan haut de gamme — coutellerie", s: "démo livrée · cadrage final", d: "Capture de leads multi-canaux (TikTok, Snapchat, e-commerce, téléphone) → relances WhatsApp segmentées par typologie d'acheteur (B2C, B2B restauration, collectionneur). Démo fonctionnelle présentée au client." },
          { t: "Vendeur retail Amazon", s: "outil en production", d: "Outil d'optimisation pour les assistants d'achat IA (GEO e-commerce) : mesure la visibilité des produits dans les réponses d'assistants type Amazon Rufus, identifie les questions où la marque est absente, corrige les fiches produits. Tourne en continu pour un premier client." },
          { t: "Dirigeant pharma en transition", s: "livré", d: "Pack hands-on : le client a construit lui-même, en 8 heures accompagnées, son agent de veille du marché caché pour sa recherche de poste de direction. Autonome sur son poste depuis." },
          { t: "Grande école de management internationale", s: "cadrage en cours", d: "Audit & configuration Claude Code pour deux profils basés à Singapour : environnement, mémoire projet, skills, normes de sécurité, et limites de consommation mesurées agent par agent après les premiers déploiements." },
          { t: "Grande enseigne sport", s: "en discussion", d: "Programme dirigeant Sprint Builders hands-on : chaque participant prototype son cas métier réel en 2 jours avec Claude Code + Gemini. Échanges en cours avec l'équipe Training & Development AI." },
          { t: "Agence dev sénior", d: "Reporting CEO consolidé : agrégation des KPIs commerciaux + opérationnels (Excel, CRM, ERP) en une vue lundi matin." },
        ],
      },
      paul: {
        title: "Paul Larmaraud",
        role: "AI Manager · Fondateur",
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
        role: "AI Manager · Co-fondatrice",
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
    tagline: "We deploy AI inside your company. And we run it with you.",
    sub: "On the front that keeps your company running and the one that makes it grow. Tools that run in production, that we carry with you. Everything we show here, we've already deployed.",
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
        { id: "open", label: "LinkedIn Paul ↗", icon: "external", href: "https://www.linkedin.com/in/paul-larmaraud-365538179/" },
        { id: "diagnostic", label: "Parler à Parrit ↗", icon: "external", href: "/diagnostic" },
        { id: "outils", label: "Détecteur.app ↗", icon: "external", href: "/outils/detecteur-bullshit" },
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
          "45-min scoping call: we pick one precise topic",
          "Tool delivered in 5–15 days, code audited by our partner agency",
          "Form: light web UI, silent agent in your stack, or simple automation",
          "Production deployment + team training included",
        ],
        proof: [
          "Compliance officer agent — auto-check of invoices, contracts, RFPs",
          "Consolidated CEO reporting — sales + ops KPIs (Excel, CRM, ERP)",
          "Law firm operating system — mail, RFPs, client follow-up orchestrated",
          "Meetings → CRM with zero typing — call notes ingested automatically, records updated, dated follow-ups pushed to the calendar",
          "Visibility inside Amazon's shopping AI — continuous measurement of what Rufus recommends, for an international coffee brand",
          "WhatsApp command agent — the CEO queries the CRM and sets reminders by voice",
        ],
        notfor: "If you want to \"test AI\" without a precise topic, this isn't for you.",
        accent: "#0C0C0D",
        clusters: [
          {
            label: "Finance & Compliance",
            agents: [
              { name: "Compliance officer", status: "live" },
              { name: "Consolidated CEO reporting", status: "live" },
              { name: "RFP & quotes tracking", status: "live" },
              { name: "Auto invoice audit", status: "live" },
            ],
          },
          {
            label: "Operations & Supply",
            agents: [
              { name: "Inventory management", status: "live" },
              { name: "Supply chain monitor", status: "live" },
              { name: "E-commerce order tracking", status: "live" },
              { name: "Multi-channel inventory", status: "soon" },
            ],
          },
          {
            label: "Documents & Mail",
            agents: [
              { name: "Executive inbox triage", status: "live" },
              { name: "Semi-auto replies", status: "live" },
              { name: "Daily legal watch", status: "live" },
              { name: "Smart archiving", status: "soon" },
            ],
          },
        ],
      },
      {
        id: "business",
        chip: "Acquisition",
        title: "Business generation",
        sub: "Qualified meetings via intent signals",
        pitch: "We capture online signals (podcasts, events, LinkedIn posts) at the right moment and trigger a personalized outreach, anchored on what the person just said in public.",
        bullets: [
          "Target + buying timing identification (fundraise, key hire, public speaking)",
          "24/7 auto capture of signals → contact enrichment (Hunter, Enrow)",
          "Copy anchored on the exact verbatim of the person",
          "Telegram alert + contextual brief before every meeting",
        ],
        proof: [
          "Luxury brand — marketing director meeting after a retail AI panel",
          "Podcast & B2B event signal pipeline in production — executives contacted about their recent talks",
          "Parrit for itself — deals in progress with international brands",
        ],
        notfor: "Low avg ticket or volume play? Not for you.",
        accent: "#0C0C0D",
        clusters: [
          {
            label: "Growth & Acquisition",
            agents: [
              { name: "Outbound growth squad", status: "live" },
              { name: "Acquisition SEO/GEO", status: "live" },
              { name: "Podcast signal capture", status: "live" },
              { name: "B2B event signal capture", status: "live" },
            ],
          },
          {
            label: "Marketing & Copy",
            agents: [
              { name: "Copywriting squad", status: "live" },
              { name: "1-to-1 personalization", status: "live" },
              { name: "Copy A/B testing", status: "live" },
              { name: "Brand voice tuner", status: "soon" },
            ],
          },
          {
            label: "Sales & Meetings",
            agents: [
              { name: "Pre-meeting prospect brief", status: "live" },
              { name: "CRM auto-update pipeline", status: "live" },
              { name: "Multi-channel follow-ups", status: "live" },
              { name: "Closing playbook agent", status: "soon" },
            ],
          },
        ],
      },
      {
        id: "prototype",
        chip: "Prototyping",
        title: "Rapid prototyping",
        sub: "See AI work before heavy investment",
        pitch: "You've spotted a painful topic in the business. We turn it into a working tool, delivered in days. Code audited by partner agency before delivery.",
        bullets: [
          "One topic, defined, measurable — not a program",
          "Claude Code: we ship in days what used to take weeks",
          "Three families: painful back-office / business / human-mimicking agent",
          "Technical documentation + training at delivery",
        ],
        proof: [
          "Premium artisan brand — multi-channel lead capture → WhatsApp",
          "Amazon retail seller — auto product listings rewrite",
          "Law firm watch supervision bot — human filter upfront",
        ],
        notfor: "Looking for a consultant who delivers an audit or deck? Not for you.",
        accent: "#D1132F",
        clusters: [
          {
            label: "Engineering",
            agents: [
              { name: "Full-stack builder", status: "live" },
              { name: "API integrator", status: "live" },
              { name: "Merge conflict mediator", status: "live" },
              { name: "Auto test runner", status: "soon" },
            ],
          },
          {
            label: "Product & UX",
            agents: [
              { name: "Auto-generated PRD V0", status: "live" },
              { name: "User research synthesizer", status: "live" },
              { name: "Wireframe to code", status: "soon" },
              { name: "Persona simulator", status: "soon" },
            ],
          },
          {
            label: "Data & Watch",
            agents: [
              { name: "Targeted market scraper", status: "live" },
              { name: "Competitive watch", status: "live" },
              { name: "GEO / Amazon Rufus", status: "live" },
              { name: "Custom KPI dashboard", status: "live" },
            ],
          },
        ],
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
        accent: "#0C0C0D",
        clusters: [
          {
            label: "Formats",
            agents: [
              { name: "Discovery Hackathon 1-day", status: "live" },
              { name: "Sprint Builder 2-day", status: "live" },
              { name: "Strategic Cohort 6 weeks", status: "live" },
              { name: "Train-the-Trainer", status: "live" },
            ],
          },
          {
            label: "Stack taught",
            agents: [
              { name: "Claude Code (Anthropic)", status: "live" },
              { name: "Gemini Vertex AI", status: "live" },
              { name: "n8n workflow orchestration", status: "live" },
              { name: "In-house MCP servers", status: "live" },
            ],
          },
          {
            label: "Prototyped cases",
            agents: [
              { name: "Job search agent", status: "live" },
              { name: "CEO legal watch", status: "live" },
              { name: "WhatsApp lead capture", status: "live" },
              { name: "E-commerce GEO", status: "live" },
            ],
          },
        ],
      },
      {
        id: "claude-code",
        chip: "Claude Code",
        title: "Claude Code as a Service",
        sub: "Audit, setup & sprint: your team equipped and autonomous",
        pitch: "Claude Code is Anthropic's agent platform: the one running Parrit's own internal system. We install it properly in your existing tools: audit of your stack, production-grade configuration, ready-to-use context modules, and usage-cost control (tokens) from day one. For SMEs, mid-caps and schools, in France and across Europe.",
        bullets: [
          "Audit of your dev environment and use cases: 1 day, concrete action plan",
          "Full configuration: knowledge of your projects, custom business skills, spend guardrails, cost optimization",
          "Claude Code Sprint: an intensive 1-to-4-day build with your team, on-site or remote",
          "Ready-made modules ingested by your instance + async support between sessions",
        ],
        proof: [
          "International management school — audit & setup for 2 profiles based in Singapore (scoping underway)",
          "Pharma executive in transition — full Claude Code autonomy in 8 hours",
          "Parrit itself — our entire internal OS runs on Claude Code",
        ],
        notfor: "Looking for a license or an off-the-shelf tool with no enablement? Not for you.",
        accent: "#0C0C0D",
        clusters: [
          {
            label: "Formats",
            agents: [
              { name: "1-day audit — action plan", status: "live" },
              { name: "Audit & Setup", status: "live" },
              { name: "Claude Code Sprint 1-4 days", status: "live" },
              { name: "Team setup + follow-up", status: "live" },
            ],
          },
          {
            label: "What we configure",
            agents: [
              { name: "Project memory & skills", status: "live" },
              { name: "Token optimization & caching", status: "live" },
              { name: "Spend guardrails", status: "live" },
              { name: "Agentic pipelines (CI/CD)", status: "live" },
            ],
          },
        ],
        pages: [
          { label: "Claude Code Audit", href: "/en/audit-claude-code" },
          { label: "Claude Code Sprint", href: "/en/sprint" },
          { label: "Team Setup", href: "/en/setup-claude-code" },
        ],
      },
    ],
    panel: {
      manifeste: {
        title: "Manifesto",
        body: [
          "Parrit is two people and one simple conviction: you transform a company by putting a tool that runs inside it, not by handing over a report that ends up in a drawer.",
          "Paul codes. Every day, with his agents at his side, he builds with his own hands the prototype that didn't exist the week before. Yukun, ten years spent orchestrating the operations of large groups between France and China, takes it and pushes it into production where it truly matters: inside your real systems, on Monday morning. 速 means speed. It's our name, and it's our pace: a first prototype from the very first call.",
          "We don't sell slides, day rates, or words invented to sound serious. Together we pick one precise subject in 45 minutes, we build the tool in a few days, we have it audited by a senior development agency, and we deliver it installed at your site: documented, and already in your teams' hands, without us needing to stand beside them.",
          "One tool at a time. Not thirty. The one that saves you time every week, or the one that brings you business. And we measure it for real: the time saved, the extra revenue, the margin freed up.",
          "If, in the end, it doesn't run in production, then we haven't done our job.",
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
        intro: "Real Parrit cases, anonymized for confidentiality. Each engagement status is shown as is: we oversell nothing. Details and numbers on call.",
        items: [
          { t: "Business law firm", s: "in production", d: "Legal watch supervision bot: sources combed every night, digest filtered by a human before reaching the firm's clients. Runs daily. In progress: an operating system for the management (inbox triage, RFP tracking)." },
          { t: "Premium artisan brand — cutlery", s: "demo delivered · final scoping", d: "Multi-channel lead capture (TikTok, Snapchat, e-commerce, phone) → WhatsApp follow-ups segmented by buyer type (B2C, B2B restaurants, collectors). Working demo presented to the client." },
          { t: "Amazon retail seller", s: "tool in production", d: "Optimization tool for AI shopping assistants (e-commerce GEO): measures product visibility inside answers from assistants like Amazon Rufus, spots the questions where the brand is absent, fixes the listings. Running continuously for a first client." },
          { t: "Pharma executive in transition", s: "delivered", d: "Hands-on pack: the client built his own hidden-job-market watch agent in 8 guided hours, for his executive job search. Autonomous on his machine since." },
          { t: "International management school", s: "scoping underway", d: "Claude Code audit & setup for two profiles based in Singapore: environment, project memory, skills, security standards, and consumption limits measured agent by agent after the first deployments." },
          { t: "Major sports retailer", s: "in discussion", d: "Hands-on Sprint Builders executive program: each participant prototypes their real business case in 2 days with Claude Code + Gemini. Ongoing discussions with the Training & Development AI team." },
          { t: "Senior dev agency", d: "Consolidated CEO reporting: sales + ops KPIs aggregated (Excel, CRM, ERP) into one Monday-morning view." },
        ],
      },
      paul: {
        title: "Paul Larmaraud",
        role: "AI Manager · Founder",
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
        role: "AI Manager · Co-founder",
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
    tagline: "Implantamos a IA na sua empresa. E a operamos com você.",
    sub: "Na frente que faz a empresa girar e na que a faz crescer. Ferramentas que rodam em produção, que carregamos com você. Tudo o que mostramos aqui, já implantamos.",
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
        { id: "open", label: "LinkedIn Paul ↗", icon: "external", href: "https://www.linkedin.com/in/paul-larmaraud-365538179/" },
        { id: "diagnostic", label: "Parler à Parrit ↗", icon: "external", href: "/diagnostic" },
        { id: "outils", label: "Détecteur.app ↗", icon: "external", href: "/outils/detecteur-bullshit" },
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
          "Briefing de 45 min: escolhemos um assunto preciso",
          "Ferramenta entregue em 5 a 15 dias, código auditado pela agência parceira",
          "Forma: UI web leve, agente silencioso na sua stack, ou simples automação",
          "Deploy em produção + treinamento das equipes incluído",
        ],
        proof: [
          "Compliance officer agent — verificação automática de faturas, contratos, RFPs",
          "Relatório CEO consolidado — KPIs comerciais + operacionais (Excel, CRM, ERP)",
          "OS para escritório de advocacia — emails, RFPs, follow-up cliente orquestrados",
          "Reuniões → CRM sem digitação — atas ingeridas automaticamente, fichas atualizadas, follow-ups datados no calendário",
          "Visibilidade na IA de compras da Amazon — medição contínua do que o Rufus recomenda, para uma marca de café internacional",
          "Agente WhatsApp de comando — o dirigente consulta o CRM e cria lembretes por voz",
        ],
        notfor: "Se você quer \"testar IA\" sem um assunto preciso, não é para você.",
        accent: "#0C0C0D",
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
        pitch: "Captamos sinais online (podcasts, eventos, posts LinkedIn) no momento certo e disparamos um contato personalizado, ancorado no que a pessoa acabou de dizer em público.",
        bullets: [
          "Identificação do alvo + timing de compra (rodada, contratação, fala pública)",
          "Captura automática 24/7 dos sinais → enriquecimento contatos (Hunter, Enrow)",
          "Copywriting ancorado no verbatim exato da pessoa",
          "Alerta Telegram + briefing contextualizado antes de cada encontro",
        ],
        proof: [
          "Marca de luxo — encontro com diretor de marketing após painel IA retail",
          "Pipeline de sinais podcasts & eventos em produção — executivos contactados sobre suas falas recentes",
          "Parrit para si mesma — deals em andamento com marcas internacionais",
        ],
        notfor: "Ticket médio baixo ou lógica de volume? Não é para você.",
        accent: "#0C0C0D",
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
          "Claude Code: entregamos em dias o que levava semanas",
          "Três famílias: back-office doloroso / negócios / agente que reproduz um humano",
          "Documentação técnica + treinamento na entrega",
        ],
        proof: [
          "Marca artesanal premium — captura leads multi-canal → WhatsApp",
          "Vendedor Amazon — reescrita automática de fichas de produto",
          "Bot supervisão watch escritório advocacia — filtro humano antes",
        ],
        notfor: "Buscando um consultor que entrega um audit ou um deck? Não é para você.",
        accent: "#D1132F",
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
        accent: "#0C0C0D",
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
      {
        id: "claude-code",
        chip: "Claude Code",
        title: "Claude Code as a Service",
        sub: "Auditoria, configuração & sprint: sua equipe equipada e autônoma",
        pitch: "Claude Code é a plataforma de agentes da Anthropic: a mesma que roda todo o sistema interno da Parrit. Instalamos do jeito certo nas suas ferramentas existentes: auditoria, configuração padrão de produção, módulos prontos para uso e controle dos custos de uso (tokens) desde o primeiro dia.",
        bullets: [
          "Auditoria do seu ambiente de dev e dos seus casos de uso: 1 dia, plano de ação concreto",
          "Configuração completa: conhecimento dos seus projetos, competências de negócio sob medida, limites de gasto, otimização de custos",
          "Sprint Claude Code: acompanhamento intensivo de 1 a 4 dias, construímos com sua equipe, presencial ou remoto",
          "Módulos prontos ingeridos pela sua instância + suporte assíncrono entre as sessões",
        ],
        proof: [
          "Escola de gestão internacional — auditoria & configuração para 2 perfis em Singapura (cadragem em andamento)",
          "Executivo farma em transição — autonomia completa Claude Code em 8 horas",
          "A própria Parrit — todo nosso OS interno roda em Claude Code",
        ],
        notfor: "Procura uma licença ou ferramenta de prateleira sem acompanhamento? Não é para você.",
        accent: "#0C0C0D",
        pages: [
          { label: "Auditoria Claude Code", href: "/pt-BR/audit-claude-code" },
          { label: "Sprint Claude Code", href: "/pt-BR/sprint" },
          { label: "Setup de equipes", href: "/pt-BR/setup-claude-code" },
        ],
      },
    ],
    panel: {
      manifeste: {
        title: "Manifesto",
        body: [
          "A Parrit são duas pessoas e uma convicção simples: a gente transforma uma empresa instalando nela uma ferramenta que roda, não entregando um relatório que acaba numa gaveta.",
          "Paul programa. Todos os dias, com seus agentes ao lado, ele constrói com as próprias mãos o protótipo que não existia na semana anterior. Yukun, dez anos orquestrando os fluxos de grandes grupos entre a França e a China, o retoma e o coloca em produção onde tudo se decide: dentro dos seus sistemas reais, na segunda de manhã. 速 quer dizer velocidade. É o nosso nome, e é o nosso ritmo: um primeiro protótipo já na primeira chamada.",
          "A gente não vende slides, nem horas-homem, nem palavra inventada para soar sério. Escolhemos juntos um assunto preciso em 45 minutos, construímos a ferramenta em alguns dias, mandamos auditar por uma agência de desenvolvedores seniores, e entregamos instalada na sua empresa: documentada, e já nas mãos das suas equipes, sem que a gente precise estar do lado.",
          "Uma ferramenta de cada vez. Não trinta. A que te faz ganhar tempo toda semana, ou a que te traz negócio. E a gente mede de verdade: o tempo ganho, a receita a mais, a margem liberada.",
          "Se, no fim das contas, ela não rodar em produção, é porque a gente não fez o nosso trabalho.",
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
        intro: "Casos reais Parrit, anonimizados por confidencialidade. O status de cada missão é mostrado como é: não vendemos além do real. Detalhes e números na call.",
        items: [
          { t: "Escritório de advocacia", s: "em produção", d: "Bot de supervisão de watch jurídico: fontes analisadas toda noite, síntese filtrada por um humano antes de chegar aos clientes. Roda diariamente. Em andamento: operating system para a direção (triagem inbox, RFPs)." },
          { t: "Marca artesanal premium — cutelaria", s: "demo entregue · escopo final", d: "Captura de leads multi-canal (TikTok, Snapchat, e-commerce, telefone) → follow-ups WhatsApp segmentados por tipo de comprador. Demo funcional apresentada ao cliente." },
          { t: "Vendedor Amazon", s: "ferramenta em produção", d: "Ferramenta de otimização para assistentes de compra IA (GEO e-commerce): mede a visibilidade dos produtos nas respostas de assistentes como o Amazon Rufus, identifica as perguntas onde a marca está ausente, corrige as fichas. Rodando em contínuo para um primeiro cliente." },
          { t: "Executivo farma em transição", s: "entregue", d: "Pacote hands-on: o cliente construiu sozinho, em 8 horas acompanhadas, seu agente de watch do mercado oculto para sua busca de cargo executivo. Autônomo desde então." },
          { t: "Escola de gestão internacional", s: "escopo em andamento", d: "Auditoria & configuração Claude Code para dois perfis em Singapura: ambiente, memória de projeto, skills, normas de segurança, e limites de consumo medidos agente por agente após os primeiros deploys." },
          { t: "Grande varejista esportiva", s: "em discussão", d: "Programa executivo Sprint Builders hands-on: cada participante prototipa seu caso real em 2 dias com Claude Code + Gemini. Conversas em andamento com o time Training & Development AI." },
          { t: "Agência dev sênior", d: "Relatório CEO consolidado: KPIs comerciais + operacionais (Excel, CRM, ERP) em uma vista de segunda de manhã." },
        ],
      },
      paul: {
        title: "Paul Larmaraud",
        role: "AI Manager · Fundador",
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
        role: "AI Manager · Co-fundadora",
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
    tagline: "我们把 AI 部署到您的企业，并与您一起运营它。",
    sub: "在让公司运转的战线，也在让公司成长的战线。在生产环境中运行的工具，由我们与您共同承担。这里展示的一切，我们都已落地。",
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
        { id: "open", label: "LinkedIn Paul ↗", icon: "external", href: "https://www.linkedin.com/in/paul-larmaraud-365538179/" },
        { id: "diagnostic", label: "Parler à Parrit ↗", icon: "external", href: "/diagnostic" },
        { id: "outils", label: "Détecteur.app ↗", icon: "external", href: "/outils/detecteur-bullshit" },
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
          "45 分钟需求梳理：选定一个精确的课题",
          "5 到 15 天交付工具，代码经合作伙伴代理审核",
          "形式：轻量 Web 界面、嵌入您技术栈的静默智能体、或简单自动化",
          "包含生产部署和团队培训",
        ],
        proof: [
          "合规官智能体 — 自动审核发票、合同、RFP",
          "CEO 合并报告 — 商业 + 运营 KPI(Excel、CRM、ERP)",
          "律所运营系统 — 邮件、RFP、客户跟进协调",
          "会议 → CRM 零录入 — 会议纪要自动接入，档案实时更新，带日期的跟进自动排入日历",
          "亚马逊购物 AI 可见度 — 持续测量 Rufus 推荐内容，服务一家国际咖啡品牌",
          "WhatsApp 指挥智能体 — 管理者语音查询 CRM、设置提醒",
        ],
        notfor: "如果您只想\"测试 AI\"而没有精确课题，不适合您。",
        accent: "#0C0C0D",
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
          "播客与 B2B 活动信号管道(生产中)— 基于高管最新公开发言进行触达",
          "Parrit 自身 — 与国际品牌的合作进行中",
        ],
        notfor: "客单价低或追求数量逻辑?不适合您。",
        accent: "#0C0C0D",
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
          "Claude Code：几天交付过去需要数周的成果",
          "三大类:痛苦后台 / 业务 / 模拟人工的智能体",
          "技术文档 + 交付时培训",
        ],
        proof: [
          "高端手工艺品牌 — 多渠道线索捕捉 → WhatsApp",
          "亚马逊零售卖家 — 自动重写产品页",
          "律所监测机器人 — 人工前置过滤",
        ],
        notfor: "寻找做审计或交付 PPT 的顾问?不适合您。",
        accent: "#D1132F",
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
        accent: "#0C0C0D",
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
      {
        id: "claude-code",
        chip: "Claude Code",
        title: "Claude Code as a Service",
        sub: "审计、配置与 Sprint:让您的团队装备齐全、自主上手",
        pitch: "Claude Code 是 Anthropic 的智能体平台:Parrit 自己的整套内部系统就运行在它之上。我们将它正确部署进您现有的工具:审计现状、生产级配置、开箱即用的上下文模块,并从第一天起掌控使用成本(token)。",
        bullets: [
          "审计您的开发环境与用例:1 天,输出具体行动计划",
          "完整配置:您项目的知识、定制业务技能、支出护栏、成本优化",
          "Claude Code Sprint:1 到 4 天强化陪跑,与您的团队一起构建,现场或远程",
          "现成模块直接导入您的实例 + 课间异步支持",
        ],
        proof: [
          "国际管理学院 — 为常驻新加坡的 2 位成员做审计与配置(框架洽谈中)",
          "制药公司转型高管 — 8 小时实现 Claude Code 完全自主",
          "Parrit 自身 — 我们整个内部 OS 都运行在 Claude Code 上",
        ],
        notfor: "只想要一个许可证或现成工具、不需要陪跑?那不适合您。",
        accent: "#0C0C0D",
        pages: [
          { label: "Claude Code 审计", href: "/zh-CN/audit-claude-code" },
          { label: "Claude Code Sprint", href: "/zh-CN/sprint" },
          { label: "团队配置", href: "/zh-CN/setup-claude-code" },
        ],
      },
    ],
    panel: {
      manifeste: {
        title: "宣言",
        body: [
          "Parrit 是两个人，和一个朴素的信念:转型一家企业，靠的是在它内部装上一个真正能跑起来的工具，而不是交给它一份最终躺进抽屉的报告。",
          "Paul 写代码。每一天，在智能体的协助下，他亲手做出上周还不存在的原型。Yukun，十年间在法国与中国之间为大型集团编排业务流，把原型接过来，推上生产，落在真正要紧的地方:你们真实的系统里，周一早晨。速,意为速度。这是我们的名字，也是我们的节奏:首次通话即出原型。",
          "我们不卖幻灯片，不卖人天，也不用为了显得专业而生造的词。我们一起在 45 分钟内选定一个具体的课题，用几天把工具做出来，交给一支资深开发团队做代码审计，再把它装好、交付到你们这边:有文档，并且已经在你们团队手里，无需我们守在一旁。",
          "一次一个工具。不是三十个。要么帮你每周省下时间，要么帮你带来生意。而且我们实打实地衡量它:省下的时间、多出的营收、释放的利润。",
          "如果到头来它跑不进生产环境，那就是我们没把活儿做好。",
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
        intro: "Parrit 真实案例,出于保密考虑已匿名化。每个项目的状态如实展示:我们不夸大。详情和数字在通话中分享。",
        items: [
          { t: "商业法律事务所", s: "生产运行中", d: "法律监测机器人:每晚梳理信源,人工过滤后再分发给律所客户。每日运行。进行中:管理层运营系统(收件箱分拣、RFP 跟进)。" },
          { t: "高端手工艺品牌 — 刀具", s: "演示已交付 · 最终范围确认中", d: "多渠道线索捕捉(TikTok、Snapchat、电商、电话)→ 按买家类型分群的 WhatsApp 跟进。功能演示已向客户展示。" },
          { t: "亚马逊零售卖家", s: "工具生产运行中", d: "面向 AI 购物助手的优化工具(电商 GEO):衡量产品在 Amazon Rufus 等助手回答中的可见度,找出品牌缺席的问题并修正产品页。已为首个客户持续运行。" },
          { t: "制药公司转型高管", s: "已交付", d: "实战套件:客户在 8 小时陪跑中亲手构建了自己的隐性市场监测智能体,用于高管求职。此后在其电脑上自主运行。" },
          { t: "国际管理学院", s: "框架洽谈中", d: "为常驻新加坡的两位成员做 Claude Code 审计与配置:环境、项目记忆、skills、安全规范,并在首批部署后逐个智能体测算消耗上限。" },
          { t: "大型运动零售商", s: "洽谈中", d: "高管 Sprint Builders 实战项目:每位参与者用 Claude Code + Gemini 在 2 天内为自己的真实业务做原型。正与 Training & Development AI 团队洽谈。" },
          { t: "资深开发代理", d: "合并 CEO 报告:商业 + 运营 KPI(Excel、CRM、ERP)汇总为周一早晨视图。" },
        ],
      },
      paul: {
        title: "Paul Larmaraud",
        role: "AI Manager · 创始人",
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
        role: "AI Manager · 联合创始人",
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
  pages?: readonly { label: string; href: string }[];
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
  cas: { title: string; intro: string; items: readonly { t: string; d: string; s?: string }[] };
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
      <path d="M14 8 H42 L52 18 V56 H14 Z" fill="#FEFDF9" stroke="#0C0C0D" strokeWidth="2.5" strokeLinejoin="round" />
      <path d="M42 8 V18 H52" fill="none" stroke="#0C0C0D" strokeWidth="2.5" strokeLinejoin="round" />
      <line x1="22" y1="28" x2="44" y2="28" stroke="#0C0C0D" strokeWidth="2" />
      <line x1="22" y1="36" x2="44" y2="36" stroke="#0C0C0D" strokeWidth="2" />
      <line x1="22" y1="44" x2="38" y2="44" stroke="#0C0C0D" strokeWidth="2" />
    </svg>
  );
}
function IconFolder({ size = 56 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" fill="none">
      <path d="M8 16 H26 L30 22 H56 V52 H8 Z" fill="#0C0C0D" stroke="#0C0C0D" strokeWidth="2.5" strokeLinejoin="round" />
      <line x1="12" y1="32" x2="52" y2="32" stroke="#0C0C0D" strokeWidth="1.5" opacity="0.4" />
    </svg>
  );
}
function IconPerson({ size = 56 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" fill="none">
      <circle cx="32" cy="22" r="10" fill="#FEFDF9" stroke="#0C0C0D" strokeWidth="2.5" />
      <path d="M14 56 C14 42 21 36 32 36 C43 36 50 42 50 56 Z" fill="#FEFDF9" stroke="#0C0C0D" strokeWidth="2.5" strokeLinejoin="round" />
      <path d="M24 22 Q24 14 32 14 Q40 14 40 22" stroke="#0C0C0D" strokeWidth="2" fill="none" />
      <circle cx="28" cy="22" r="1.5" fill="#0C0C0D" />
      <circle cx="36" cy="22" r="1.5" fill="#0C0C0D" />
    </svg>
  );
}
function IconExternal({ size = 56 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" fill="none">
      <rect x="10" y="10" width="36" height="36" rx="4" fill="#FEFDF9" stroke="#0C0C0D" strokeWidth="2.5" />
      <path d="M30 18 H46 V34" stroke="#0C0C0D" strokeWidth="2.5" fill="none" strokeLinecap="round" />
      <line x1="46" y1="18" x2="28" y2="36" stroke="#0C0C0D" strokeWidth="2.5" strokeLinecap="round" />
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
        <rect x="6" y="6" width="52" height="52" rx="10" fill={accent} stroke="#0C0C0D" strokeWidth="2.5" />
        <path d="M32 18 L34 24 L40 24 L35 28 L37 34 L32 30 L27 34 L29 28 L24 24 L30 24 Z" fill="#FEFDF9" stroke="#0C0C0D" strokeWidth="2" strokeLinejoin="round" />
        <circle cx="32" cy="44" r="4" fill="#FEFDF9" stroke="#0C0C0D" strokeWidth="2" />
        <line x1="32" y1="48" x2="32" y2="52" stroke="#0C0C0D" strokeWidth="2" />
      </svg>
    );
  }
  if (idx === 1) {
    return (
      <svg {...common}>
        <rect x="6" y="6" width="52" height="52" rx="10" fill={accent} stroke="#0C0C0D" strokeWidth="2.5" />
        <path d="M18 42 L26 30 L32 36 L46 18" stroke="#FEFDF9" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" fill="none" />
        <circle cx="46" cy="18" r="3" fill="#FEFDF9" stroke="#0C0C0D" strokeWidth="1.5" />
        <circle cx="18" cy="42" r="3" fill="#FEFDF9" stroke="#0C0C0D" strokeWidth="1.5" />
      </svg>
    );
  }
  if (idx === 2) {
    return (
      <svg {...common}>
        <rect x="6" y="6" width="52" height="52" rx="10" fill={accent} stroke="#0C0C0D" strokeWidth="2.5" />
        <path d="M22 14 L42 14 L42 22 L32 22 L32 50 L22 50 Z" fill="#FEFDF9" stroke="#0C0C0D" strokeWidth="2.5" strokeLinejoin="round" />
        <circle cx="42" cy="40" r="6" fill="#FEFDF9" stroke="#0C0C0D" strokeWidth="2" />
        <line x1="46" y1="44" x2="50" y2="48" stroke="#0C0C0D" strokeWidth="2.5" strokeLinecap="round" />
      </svg>
    );
  }
  if (idx === 3) {
    return (
      <svg {...common}>
        <rect x="6" y="6" width="52" height="52" rx="10" fill={accent === "#0C0C0D" ? "#0C0C0D" : accent} stroke="#0C0C0D" strokeWidth="2.5" />
        <path d="M14 28 L32 18 L50 28 L32 38 Z" fill="#FEFDF9" stroke="#0C0C0D" strokeWidth="2" strokeLinejoin="round" />
        <line x1="32" y1="38" x2="32" y2="48" stroke="#0C0C0D" strokeWidth="2.5" />
        <path d="M22 33 V42 Q22 46 32 46 Q42 46 42 42 V33" stroke="#0C0C0D" strokeWidth="2" fill="none" />
      </svg>
    );
  }
  // idx 4+ — terminal prompt (Claude Code)
  return (
    <svg {...common}>
      <rect x="6" y="6" width="52" height="52" rx="10" fill={accent} stroke="#0C0C0D" strokeWidth="2.5" />
      <path d="M17 23 L28 32 L17 41" stroke="#FEFDF9" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round" fill="none" />
      <line x1="32" y1="44" x2="47" y2="44" stroke="#FEFDF9" strokeWidth="3.5" strokeLinecap="round" />
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
    { cx: 110, cy: 150, fill: "#0C0C0D", label: labels.agents[0], phase: 0 },     // back-office
    { cx: 100, cy: 310, fill: "#D1132F", label: labels.agents[1], phase: 1.2 },   // business (flagship → rouge)
    { cx: 470, cy: 150, fill: "#D1132F", label: labels.agents[2], phase: 0.6 },   // prototype
    { cx: 480, cy: 310, fill: "#0C0C0D", label: labels.agents[3], phase: 1.8 },   // formation (violet)
    { cx: 290, cy: 385, fill: "#0C0C0D", label: labels.agents[4], phase: 2.4 },   // claude code (dark)
  ].filter((a) => a.label);

  return (
    <svg viewBox="0 0 580 460" width="100%" style={{ maxWidth: 600, height: "auto", display: "block" }} aria-label="Parrit AI agents constellation">
      <defs>
        <pattern id="dots-bg" width="14" height="14" patternUnits="userSpaceOnUse">
          <circle cx="2" cy="2" r="1" fill="#0C0C0D" opacity="0.06" />
        </pattern>
        <radialGradient id="parrit-glow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#D1132F" stopOpacity="0.18" />
          <stop offset="100%" stopColor="#D1132F" stopOpacity="0" />
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
              stroke="#0C0C0D"
              strokeWidth="1.8"
              strokeDasharray="3 6"
              fill="none"
              opacity="0.4"
            />
            {/* flowing data dot */}
            <circle r="3.2" fill={a.fill} stroke="#0C0C0D" strokeWidth="1">
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
        <rect x="22" y="36" width="106" height="44" rx="8" fill="#0C0C0D" />
        <text x="75" y="55" fontSize="13" fontWeight="700" textAnchor="middle" fill="#FEFDF9" fontFamily="DM Sans, sans-serif">{labels.you}</text>
        <text x="75" y="70" fontSize="10" textAnchor="middle" fill="#8A8A8F" fontFamily="DM Sans, sans-serif">{labels.youSub}</text>
        <path d="M 128 62 Q 152 70 175 80" stroke="#0C0C0D" strokeWidth="1.5" fill="none" strokeLinecap="round" />
        <polygon points="175,80 169,76 170,84" fill="#0C0C0D" />
      </g>

      {/* Founder ↔ Parrit primary connection — bold solid line + flowing pulse */}
      <g>
        <path
          id="founder-link"
          d={`M 220 116 C 240 150 ${centerX - 50} 180 ${centerX - 36} ${centerY - 32}`}
          stroke="#0C0C0D"
          strokeWidth="3"
          fill="none"
          strokeLinecap="round"
        />
        {/* pulsing flow particles */}
        <circle r="4" fill="#D1132F" stroke="#0C0C0D" strokeWidth="1.2">
          <animateMotion dur="2.6s" repeatCount="indefinite" path={`M 220 116 C 240 150 ${centerX - 50} 180 ${centerX - 36} ${centerY - 32}`} />
        </circle>
        <circle r="4" fill="#D1132F" stroke="#0C0C0D" strokeWidth="1.2">
          <animateMotion dur="2.6s" repeatCount="indefinite" begin="1.3s" path={`M 220 116 C 240 150 ${centerX - 50} 180 ${centerX - 36} ${centerY - 32}`} />
        </circle>
        {/* arrow head near Parrit */}
        <polygon points={`${centerX - 36},${centerY - 32} ${centerX - 46},${centerY - 38} ${centerX - 44},${centerY - 28}`} fill="#0C0C0D" />
      </g>

      {/* "You" — small purple bubble (gently floating) */}
      <g>
        <g>
          <animateTransform attributeName="transform" type="translate" values="0 0; 0 -4; 0 0" dur="3.5s" repeatCount="indefinite" />
          <circle cx="200" cy="100" r="32" fill="#FEFDF9" stroke="#0C0C0D" strokeWidth="2.5" />
          <circle cx="192" cy="98" r="2.5" fill="#0C0C0D" />
          <circle cx="208" cy="98" r="2.5" fill="#0C0C0D" />
          <path d="M 192 108 Q 200 113 208 108" stroke="#0C0C0D" strokeWidth="2" fill="none" strokeLinecap="round" />
          <path d="M 178 126 Q 200 118 222 126 L 220 130 L 180 130 Z" fill="#0C0C0D" stroke="#0C0C0D" strokeWidth="2" strokeLinejoin="round" />
        </g>
      </g>

      {/* PARRIT — center copilot bubble (gentle pulse) */}
      <g>
        <g>
          <animateTransform attributeName="transform" type="translate" values="0 0; 0 -3; 0 0" dur="4s" repeatCount="indefinite" />
          {/* perforated stamp border */}
          <circle cx={centerX} cy={centerY} r="60" fill="#FEFDF9" stroke="#0C0C0D" strokeWidth="3" />
          <circle cx={centerX} cy={centerY} r="60" fill="none" stroke="#D1132F" strokeWidth="1.5" strokeDasharray="3 4" opacity="0.7">
            <animateTransform attributeName="transform" type="rotate" from={`0 ${centerX} ${centerY}`} to={`360 ${centerX} ${centerY}`} dur="30s" repeatCount="indefinite" />
          </circle>
          {/* face */}
          <circle cx={centerX - 14} cy={centerY - 4} r="3.5" fill="#0C0C0D" />
          <circle cx={centerX + 14} cy={centerY - 4} r="3.5" fill="#0C0C0D" />
          <path d={`M ${centerX - 14} ${centerY + 12} Q ${centerX} ${centerY + 20} ${centerX + 14} ${centerY + 12}`} stroke="#0C0C0D" strokeWidth="2.5" fill="none" strokeLinecap="round" />
          {/* layered pancake stack base */}
          <ellipse cx={centerX} cy={centerY + 40} rx="42" ry="6" fill="#D1132F" stroke="#0C0C0D" strokeWidth="2" />
          <ellipse cx={centerX} cy={centerY + 32} rx="46" ry="7" fill="#0C0C0D" stroke="#0C0C0D" strokeWidth="2" />
          <ellipse cx={centerX} cy={centerY + 24} rx="50" ry="8" fill="#0C0C0D" stroke="#0C0C0D" strokeWidth="2" />
        </g>
      </g>

      {/* Parrit label — below the bubble to avoid satellite overlap */}
      <g>
        <rect x={centerX - 60} y={centerY + 70} width="120" height="40" rx="8" fill="#0C0C0D" />
        <text x={centerX} y={centerY + 87} fontSize="13" fontWeight="700" textAnchor="middle" fill="#FEFDF9" fontFamily="DM Sans, sans-serif">{labels.parrit}</text>
        <text x={centerX} y={centerY + 101} fontSize="10" textAnchor="middle" fill="#8A8A8F" fontFamily="DM Sans, sans-serif">{labels.parritSub}</text>
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
              <ellipse cx={a.cx} cy={a.cy + 32} rx="22" ry="3.5" fill="#0C0C0D" opacity="0.1" />
              {/* body */}
              <circle cx={a.cx} cy={a.cy} r="28" fill={a.fill} stroke="#0C0C0D" strokeWidth="2.5" />
              {/* eyes (blink) — ellipses : seul rx/ry est animable, circle+ry était sans effet */}
              <g>
                <circle cx={a.cx - 8} cy={a.cy - 3} r="2.5" fill="#FEFDF9" />
                <circle cx={a.cx + 8} cy={a.cy - 3} r="2.5" fill="#FEFDF9" />
                <ellipse cx={a.cx - 8} cy={a.cy - 3} rx="1.1" ry="1.1" fill="#0C0C0D">
                  <animate attributeName="ry" values="1.1;0.15;1.1" dur="6s" repeatCount="indefinite" begin={`${i * 1.4}s`} />
                </ellipse>
                <ellipse cx={a.cx + 8} cy={a.cy - 3} rx="1.1" ry="1.1" fill="#0C0C0D">
                  <animate attributeName="ry" values="1.1;0.15;1.1" dur="6s" repeatCount="indefinite" begin={`${i * 1.4}s`} />
                </ellipse>
              </g>
              {/* small smile */}
              <path d={`M ${a.cx - 6} ${a.cy + 6} Q ${a.cx} ${a.cy + 10} ${a.cx + 6} ${a.cy + 6}`} stroke={a.fill === "#0C0C0D" ? "#FEFDF9" : "#0C0C0D"} strokeWidth="1.5" fill="none" strokeLinecap="round" />
              {/* chinese red stamp dot top-right */}
              <circle cx={a.cx + 19} cy={a.cy - 19} r="4" fill="#D1132F" stroke="#0C0C0D" strokeWidth="1">
                <animate attributeName="r" values="4;5;4" dur="2.4s" repeatCount="indefinite" begin={`${a.phase}s`} />
              </circle>
            </g>
            {/* label (static, doesn't float with bubble) */}
            <g>
              <rect x={a.cx - 42} y={a.cy + 38} width="84" height="20" rx="4" fill="#FFFFFF" stroke="#0C0C0D" strokeWidth="1.5" />
              <text x={a.cx} y={a.cy + 51} fontSize="10" fontWeight="700" textAnchor="middle" fill="#0C0C0D" fontFamily="DM Sans, sans-serif">{a.label}</text>
            </g>
          </g>
        );
      })}

      {/* sparkles */}
      <g fill="#D1132F">
        <polygon points="40,230 44,226 48,230 44,234">
          <animate attributeName="opacity" values="0.3;1;0.3" dur="2.5s" repeatCount="indefinite" />
        </polygon>
        <polygon points="540,230 544,226 548,230 544,234">
          <animate attributeName="opacity" values="1;0.3;1" dur="2.5s" repeatCount="indefinite" />
        </polygon>
      </g>
      <g fill="#0C0C0D">
        <polygon points="64,408 68,404 72,408 68,412">
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
          background: "#FEFDF9",
          border: "2px solid #0C0C0D",
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
            background: accent ? `linear-gradient(180deg, ${accent}33, ${accent}11)` : "#F2F0EA",
            borderBottom: "2px solid #0C0C0D",
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
                border: "1.5px solid #0C0C0D",
                cursor: "pointer",
                padding: 0,
              }}
            />
            <span style={{ width: 14, height: 14, borderRadius: "50%", background: "#F5D67E", border: "1.5px solid #0C0C0D" }} />
            <span style={{ width: 14, height: 14, borderRadius: "50%", background: "#85C285", border: "1.5px solid #0C0C0D" }} />
          </div>
          <div
            style={{
              flex: 1,
              textAlign: "center",
              fontFamily: "var(--font-body)",
              fontSize: 13,
              fontWeight: 600,
              letterSpacing: "0.02em",
              color: "#0C0C0D",
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
          background: "rgba(12,12,13,0.04)",
          border: "2px solid #0C0C0D",
          borderRadius: 12,
          textAlign: "center",
        }}
      >
        <p style={{ margin: 0, fontFamily: "var(--font-heading)", fontSize: 20, fontWeight: 500, color: "#0C0C0D" }}>
          ✓ Créneau demandé
        </p>
        <p style={{ margin: "6px 0 0", fontFamily: "var(--font-body)", fontSize: 13.5, color: "#4A4A4E", lineHeight: 1.5 }}>
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
          color: "#8A8A8F",
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
                color: "#4A4A4E",
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
                color: "#8A8A8F",
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
                      background: isSelected ? (accent || "#0C0C0D") : "#FFFFFF",
                      color: isSelected ? "#0C0C0D" : "#4A4A4E",
                      border: `1.5px solid ${isSelected ? "#0C0C0D" : "#0C0C0D1A"}`,
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
          color: "#8A8A8F",
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
          color: "#8A8A8F",
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
          border: "2px solid #0C0C0D",
          borderRadius: 8,
          background: "#FFFFFF",
          fontFamily: "var(--font-body)",
          fontSize: 14,
          color: "#0C0C0D",
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
          border: "2px solid #0C0C0D",
          borderRadius: 8,
          background: "#FFFFFF",
          fontFamily: "var(--font-body)",
          fontSize: 13,
          color: "#0C0C0D",
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
          background: (slot && email.includes("@")) ? "var(--parrit-red)" : "#8A8A8F",
          color: "#FFFFFF",
          border: "2px solid #0C0C0D",
          borderRadius: 10,
          fontFamily: "var(--font-body)",
          fontSize: 14,
          fontWeight: 700,
          cursor: (slot && email.includes("@")) ? "pointer" : "not-allowed",
          boxShadow: (slot && email.includes("@")) ? "4px 4px 0 #0C0C0D" : "none",
          transition: "all 0.1s",
        }}
      >
        {state === "sending" ? "Envoi…" : "Demander le créneau →"}
      </button>
      {state === "error" && (
        <p style={{ marginTop: 8, color: "#D1132F", fontSize: 12, textAlign: "center" }}>
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
          color: "#4A4A4E",
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
          color: "#8A8A8F",
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
            border: "2px solid #0C0C0D",
            borderRadius: 8,
            background: "#FFFFFF",
            fontFamily: "var(--font-body)",
            fontSize: 14,
            color: "#0C0C0D",
            outline: "none",
          }}
        />
        <button
          type="submit"
          disabled={state === "sending" || state === "sent" || !value.trim()}
          style={{
            padding: "12px 22px",
            border: "2px solid #0C0C0D",
            borderRadius: 8,
            background: accent || "#0C0C0D",
            color: "#0C0C0D",
            fontFamily: "var(--font-body)",
            fontSize: 14,
            fontWeight: 600,
            cursor: state === "sending" || state === "sent" ? "default" : "pointer",
            boxShadow: "3px 3px 0 #0C0C0D",
            transition: "transform 0.08s",
          }}
        >
          {state === "sending" ? copy.submitting : state === "sent" ? "✓" : copy.submit}
        </button>
      </form>
      <p style={{ marginTop: 10, fontSize: 12, color: "#8A8A8F", fontFamily: "var(--font-body)" }}>
        {state === "sent" ? copy.thanks : state === "error" ? copy.error : copy.micro}
      </p>
      <div
        style={{
          marginTop: 18,
          paddingTop: 16,
          borderTop: "1px dashed #0C0C0D",
          fontFamily: "var(--font-body)",
          fontSize: 13,
          color: "#4A4A4E",
          display: "flex",
          gap: 18,
          flexWrap: "wrap",
        }}
      >
        <a href="mailto:paul.larmaraud@parrit.ai" style={{ color: "#0C0C0D", textDecoration: "underline" }}>
          paul.larmaraud@parrit.ai
        </a>
        <a href="tel:+33683762219" style={{ color: "#0C0C0D", textDecoration: "underline" }}>
          +33 6 83 76 22 19
        </a>
        <a
          href="https://www.linkedin.com/in/paul-larmaraud-365538179/"
          target="_blank"
          rel="noreferrer"
          style={{ color: "#0C0C0D", textDecoration: "underline" }}
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
          <circle cx="50" cy="50" r="42" fill="#FEFDF9" stroke="#0C0C0D" strokeWidth="2.5" />
          <circle cx="50" cy="50" r="42" fill="none" stroke="#D1132F" strokeWidth="1.5" strokeDasharray="3 4" opacity="0.7" />
          <circle cx="40" cy="46" r="3" fill="#0C0C0D" />
          <circle cx="60" cy="46" r="3" fill="#0C0C0D" />
          <path d="M 40 58 Q 50 65 60 58" stroke="#0C0C0D" strokeWidth="2.5" fill="none" strokeLinecap="round" />
          <ellipse cx="50" cy="80" rx="28" ry="4" fill="#D1132F" stroke="#0C0C0D" strokeWidth="1.5" />
          <ellipse cx="50" cy="76" rx="30" ry="4.5" fill="#0C0C0D" stroke="#0C0C0D" strokeWidth="1.5" />
          <ellipse cx="50" cy="72" rx="33" ry="5" fill="#0C0C0D" stroke="#0C0C0D" strokeWidth="1.5" />
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
          color: "#0C0C0D",
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
          color: "#4A4A4E",
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
            border: "2px solid #0C0C0D",
            borderRadius: 12,
            background: "#FFFFFF",
            fontFamily: "var(--font-body)",
            fontSize: 15,
            color: "#0C0C0D",
            outline: "none",
            marginBottom: 6,
          }}
        />
        <p
          style={{
            fontSize: 12,
            color: "#8A8A8F",
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
            border: "2px solid #0C0C0D",
            borderRadius: 12,
            background: "#FFFFFF",
            fontFamily: "var(--font-body)",
            fontSize: 14,
            color: "#0C0C0D",
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
            background: state === "sent" ? "#0C0C0D" : "var(--parrit-red)",
            color: "#FFFFFF",
            border: "2px solid #0C0C0D",
            borderRadius: 12,
            fontFamily: "var(--font-body)",
            fontSize: 15,
            fontWeight: 700,
            cursor: state === "sending" || state === "sent" ? "default" : "pointer",
            boxShadow: "5px 5px 0 #0C0C0D",
            transition: "transform 0.1s, box-shadow 0.1s, background 0.2s",
            letterSpacing: "0.02em",
          }}
        >
          {state === "sending" ? copy.submitting : state === "sent" ? "✓ " + copy.thanks : copy.submit}
        </button>
      </form>

      {state === "error" && (
        <p style={{ marginTop: 12, color: "#D1132F", fontSize: 13, fontFamily: "var(--font-body)" }}>
          {copy.error}
        </p>
      )}

      <p
        style={{
          marginTop: 20,
          fontFamily: "var(--font-body)",
          fontSize: 12,
          color: "#8A8A8F",
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
  lang,
}: {
  offer: OfferCopy;
  contact: ReturnType<typeof getCopy>["contact"];
  onOpenContact: () => void;
  lang: string;
}) {
  // Labels de sections localisés (étaient hardcodés en français)
  const L =
    lang === "en"
      ? { how: "How it works", agents: "Agents ready to deploy", cases: "Real cases (anonymized)", live: "In production", soon: "In progress" }
      : lang === "pt-BR"
      ? { how: "Como funciona", agents: "Agentes prontos para implantar", cases: "Casos reais (anonimizados)", live: "Em produção", soon: "Em andamento" }
      : lang === "zh-CN"
      ? { how: "如何运作", agents: "可部署的智能体", cases: "真实案例(匿名)", live: "生产中", soon: "进行中" }
      : { how: "Comment ça marche", agents: "Agents prêts à déployer", cases: "Cas réels (anonymisés)", live: "En production", soon: "En cours" };
  // Accent sombre (#0C0C0D, offre Claude Code) : texte crème sur l'accent, marqueurs caramel
  const darkAccent = offer.accent === "#0C0C0D";
  const onAccent = darkAccent ? "#FEFDF9" : "#0C0C0D";
  const markerAccent = darkAccent ? "#0C0C0D" : offer.accent;
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
          color: onAccent,
          background: offer.accent,
          borderRadius: 4,
          border: "1.5px solid #0C0C0D",
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
          color: "#0C0C0D",
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
          color: "#8A8A8F",
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
          color: "#0C0C0D",
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
            color: "#8A8A8F",
            margin: "0 0 10px",
          }}
        >
          {L.how}
        </p>
        <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: 10 }}>
          {offer.bullets.map((b, i) => (
            <li
              key={i}
              style={{
                fontFamily: "var(--font-body)",
                fontSize: 14,
                lineHeight: 1.55,
                color: "#0C0C0D",
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
                  background: markerAccent,
                  border: "1.5px solid #0C0C0D",
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
              color: "#8A8A8F",
              margin: "0 0 10px",
            }}
          >
            {L.agents}
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
                    color: "#0C0C0D",
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
                        background: "#FFFFFF",
                        border: "1px solid #0C0C0D",
                        borderRadius: 6,
                        padding: "5px 8px 5px 22px",
                        fontFamily: "var(--font-body)",
                        fontSize: 12,
                        color: "#0C0C0D",
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
                          background: ag.status === "live" ? "#0C0C0D" : "#D1132F",
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
              color: "#8A8A8F",
              margin: "10px 0 0",
              textAlign: "center",
              fontStyle: "italic",
            }}
          >
            <span style={{ display: "inline-block", width: 7, height: 7, borderRadius: "50%", background: "#0C0C0D", marginRight: 6, verticalAlign: "middle" }} />
            {L.live}
            <span style={{ display: "inline-block", width: 7, height: 7, borderRadius: "50%", background: "#D1132F", marginRight: 6, marginLeft: 12, verticalAlign: "middle" }} />
            {L.soon}
          </p>
        </div>
      )}

      <div
        style={{
          marginBottom: 22,
          padding: "14px 16px",
          background: "#FFFFFF",
          border: "1.5px dashed #0C0C0D",
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
            color: "#8A8A8F",
            margin: "0 0 8px",
          }}
        >
          {L.cases}
        </p>
        <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: 6 }}>
          {offer.proof.map((p, i) => (
            <li
              key={i}
              style={{
                fontFamily: "var(--font-body)",
                fontSize: 13.5,
                lineHeight: 1.55,
                color: "#0C0C0D",
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
          color: "#8A8A8F",
          margin: "0 0 22px",
        }}
      >
        {offer.notfor}
      </p>

      {offer.pages && offer.pages.length > 0 && (
        <div style={{ display: "flex", flexWrap: "wrap", gap: 10, margin: "0 0 22px" }}>
          {offer.pages.map((p) => (
            <a
              key={p.href}
              href={p.href}
              style={{
                padding: "8px 16px",
                background: "#FFFDF8",
                border: "1.5px solid #0C0C0D",
                borderRadius: 8,
                fontFamily: "var(--font-body)",
                fontSize: 13,
                fontWeight: 600,
                color: "#0C0C0D",
                textDecoration: "none",
                boxShadow: "3px 3px 0 #0C0C0D",
                transition: "transform 0.08s",
              }}
            >
              {p.label} →
            </a>
          ))}
        </div>
      )}

      <button
        onClick={onOpenContact}
        style={{
          padding: "12px 24px",
          background: offer.accent,
          border: "2px solid #0C0C0D",
          borderRadius: 8,
          fontFamily: "var(--font-body)",
          fontSize: 14,
          fontWeight: 600,
          color: onAccent,
          cursor: "pointer",
          boxShadow: "4px 4px 0 #0C0C0D",
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
      <div style={{ maxWidth: 640 }}>
        {panel.manifeste.body.map((line, i, arr) => {
          const isFirst = i === 0;
          const isLast = i === arr.length - 1;
          return (
            <p
              key={i}
              style={{
                fontFamily: "var(--font-serif)",
                fontSize: isFirst
                  ? "clamp(23px, 3.6vw, 29px)"
                  : isLast
                  ? "clamp(20px, 2.9vw, 23px)"
                  : "clamp(18px, 2.6vw, 21px)",
                fontWeight: isFirst ? 500 : isLast ? 500 : 400,
                fontStyle: isLast ? "italic" : "normal",
                lineHeight: isFirst ? 1.4 : isLast ? 1.5 : 1.62,
                color: "#0C0C0D",
                margin: isFirst ? "0 0 22px" : isLast ? "26px 0 0" : "0 0 18px",
                paddingLeft: isLast ? 22 : 0,
                borderLeft: isLast ? "3px solid var(--parrit-red)" : "none",
                letterSpacing: isFirst ? "-0.01em" : "0",
              }}
            >
              {line}
            </p>
          );
        })}
      </div>
    );
  }
  if (which === "transformation") {
    const t = panel.transformation;
    const tagColors = ["#D1132F", "#0C0C0D", "#8A8A8F"];
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
                background: "#FFFFFF",
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
                  color: "#0C0C0D",
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
            color: "#0C0C0D",
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
              border: "2px solid #0C0C0D",
              borderRadius: 8,
              fontFamily: "var(--font-body)",
              fontSize: 14,
              fontWeight: 700,
              color: "#FFFFFF",
              cursor: "pointer",
              boxShadow: "3px 3px 0 #0C0C0D",
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
              background: "#FFFFFF",
              border: "1.5px solid #0C0C0D",
              borderRadius: 8,
            }}
          >
            <span
              style={{
                fontFamily: "var(--font-heading)",
                fontSize: 30,
                fontWeight: 500,
                color: "#0C0C0D",
                lineHeight: 1,
              }}
            >
              {s.n}
            </span>
            <div>
              <p style={{ margin: 0, fontFamily: "var(--font-body)", fontSize: 15, fontWeight: 600, color: "#0C0C0D" }}>
                {s.t}
              </p>
              <p style={{ margin: "4px 0 0", fontFamily: "var(--font-body)", fontSize: 13.5, color: "#4A4A4E", lineHeight: 1.5 }}>
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
            color: "#8A8A8F",
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
                background: "#FFFFFF",
                border: "1.5px solid #0C0C0D",
                borderRadius: 8,
                boxShadow: "3px 3px 0 #0C0C0D",
              }}
            >
              {c.s && (
                <span
                  style={{
                    display: "inline-block",
                    padding: "2px 8px",
                    marginBottom: 8,
                    fontFamily: "var(--font-body)",
                    fontSize: 10,
                    fontWeight: 700,
                    letterSpacing: "0.08em",
                    textTransform: "uppercase",
                    color: /livr|production|deliver|entregue|produç|运行|交付/.test(c.s) ? "#FEFDF9" : "#0C0C0D",
                    background: /livr|production|deliver|entregue|produç|运行|交付/.test(c.s) ? "#0C0C0D" : "transparent",
                    border: "1px solid #0C0C0D",
                    borderRadius: 4,
                  }}
                >
                  {c.s}
                </span>
              )}
              <p style={{ margin: 0, fontFamily: "var(--font-body)", fontSize: 14, fontWeight: 600, color: "#0C0C0D" }}>
                {c.t}
              </p>
              <p style={{ margin: "4px 0 0", fontFamily: "var(--font-body)", fontSize: 13, color: "#4A4A4E", lineHeight: 1.5 }}>
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
            background: "#0C0C0D",
            border: "2px solid #0C0C0D",
            borderRadius: 8,
            fontFamily: "var(--font-body)",
            fontSize: 14,
            fontWeight: 600,
            color: "#FEFDF9",
            cursor: "pointer",
            boxShadow: "4px 4px 0 var(--parrit-red)",
          }}
        >
          {contact.title} →
        </button>
      </div>
    );
  }
  // paul or yukun — bio panel
  const person = which === "paul" ? panel.paul : panel.yukun;
  const accent = which === "paul" ? "#0C0C0D" : "#D1132F";
  return (
    <div>
      <div style={{ display: "flex", gap: 22, alignItems: "flex-start", flexWrap: "wrap", marginBottom: 20 }}>
        <div
          style={{
            position: "relative",
            flexShrink: 0,
            transform: which === "yukun" ? "rotate(1.6deg)" : "rotate(-2deg)",
            marginTop: 4,
          }}
        >
          <div className="parrit-os-stamp" style={{ width: 152, padding: 8, margin: 0, cursor: "default" }}>
            <div className="parrit-os-stamp-img" style={{ aspectRatio: "1 / 1" }}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={which === "paul" ? "/team/paul-portrait.jpg" : "/team/yukun-portrait.jpg"}
                alt={person.lines[0]}
                style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "center", display: "block" }}
              />
            </div>
            <div className="parrit-os-stamp-meta">
              <span className="parrit-os-stamp-origin" style={{ color: accent }}>
                {which === "yukun" ? "巴黎 · Paris" : "Paris · 巴黎"}
              </span>
            </div>
          </div>
          {/* Chinese-red stamp mark — DA signature */}
          <span
            aria-hidden
            style={{
              position: "absolute",
              top: -10,
              right: -10,
              width: 34,
              height: 34,
              background: "var(--parrit-red)",
              border: "2px solid #0C0C0D",
              borderRadius: "50%",
              boxShadow: "3px 3px 0 rgba(42,36,32,0.18)",
              backgroundImage:
                "linear-gradient(45deg, transparent 45%, #0C0C0D 45%, #0C0C0D 55%, transparent 55%), linear-gradient(-45deg, transparent 45%, #0C0C0D 45%, #0C0C0D 55%, transparent 55%)",
              backgroundSize: "16px 16px",
              backgroundPosition: "center",
              backgroundRepeat: "no-repeat",
            }}
          />
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
                color: i === 0 ? "#0C0C0D" : "#4A4A4E",
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
          background: "#FFFFFF",
          border: "1.5px solid #0C0C0D",
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
              color: "#0C0C0D",
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
                color: "#4A4A4E",
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
                color: "#0C0C0D",
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
          border: "2px solid #0C0C0D",
          borderRadius: 8,
          fontFamily: "var(--font-body)",
          fontSize: 14,
          fontWeight: 600,
          color: "#FEFDF9",
          cursor: "pointer",
          boxShadow: which === "yukun" ? "4px 4px 0 #0C0C0D" : "4px 4px 0 var(--parrit-red)",
        }}
      >
        {person.cta} →
      </button>
      <Link
        href="/fondateurs"
        style={{
          display: "inline-block",
          marginLeft: 14,
          fontFamily: "var(--font-body)",
          fontSize: 13.5,
          fontWeight: 600,
          color: accent,
          textDecoration: "underline",
          textUnderlineOffset: 3,
        }}
      >
        Notre histoire →
      </Link>
    </div>
  );
}

/* ───────────────────────────────────────────────
   MAIN
   ─────────────────────────────────────────────── */

/* ── Carte du monde — présence internationale (Paris·Lille + partenaires Belo Horizonte / Douala / Guangzhou) ── */
function WorldMap({ lang }: { lang: Locale }) {
  const dotsPath = useMemo(
    () => WORLD_DOTS.split(";").map((pt) => { const [x, y] = pt.split(","); return `M${x} ${y}h.01`; }).join(""),
    []
  );
  const P = WORLD_PINS;
  const partners = [
    { key: "belo", pin: P.belo, label: lang === "fr" ? "Brésil · Belo Horizonte" : lang === "en" ? "Brazil · Belo Horizonte" : lang === "zh-CN" ? "巴西 · 贝洛奥里藏特" : "Brasil · Belo Horizonte", lx: P.belo.x, ly: P.belo.y + 3.1, anchor: "middle", dur: "3.8s" },
    { key: "douala", pin: P.douala, label: lang === "fr" ? "Cameroun · Douala" : lang === "en" ? "Cameroon · Douala" : lang === "zh-CN" ? "喀麦隆 · 杜阿拉" : "Camarões · Douala", lx: P.douala.x + 2.2, ly: P.douala.y + 2.6, anchor: "start", dur: "3.2s" },
    { key: "guangzhou", pin: P.guangzhou, label: lang === "fr" ? "Chine · Guangzhou" : lang === "en" ? "China · Guangzhou" : lang === "zh-CN" ? "中国 · 广州" : "China · Guangzhou", lx: P.guangzhou.x, ly: P.guangzhou.y - 2.4, anchor: "middle", dur: "4.4s" },
  ];
  const curve = (t: { x: number; y: number }) => {
    const a = P.paris, mx = (a.x + t.x) / 2, my = Math.min(a.y, t.y) - Math.hypot(t.x - a.x, t.y - a.y) * 0.18;
    return `M${a.x} ${a.y} Q ${mx} ${my} ${t.x} ${t.y}`;
  };
  return (
    <svg viewBox={`0 0 ${WORLD_W} ${WORLD_H + 2}`} width="100%" style={{ display: "block", height: "auto" }} role="img"
      aria-label={lang === "fr" ? "Carte : Parrit à Paris et Lille, partenaires à Belo Horizonte, Douala et Guangzhou" : "Map: Parrit in Paris and Lille, partners in Belo Horizonte, Douala and Guangzhou"}>
      <path d={dotsPath} stroke="#0C0C0D" strokeOpacity={0.16} strokeWidth={0.55} strokeLinecap="round" fill="none" />
      {partners.map((pt) => (
        <g key={pt.key}>
          <path d={curve(pt.pin)} fill="none" stroke="var(--parrit-red)" strokeOpacity={0.4} strokeWidth={0.22} strokeDasharray=".7 .9" />
          <circle r={0.36} fill="var(--parrit-red)" opacity={0.85}>
            <animateMotion dur={pt.dur} repeatCount="indefinite" path={curve(pt.pin)} />
          </circle>
          <circle cx={pt.pin.x} cy={pt.pin.y} r={0.62} fill="#0C0C0D" stroke="#0C0C0D" strokeWidth={0.14} />
          <circle cx={pt.pin.x} cy={pt.pin.y} r={0.62} fill="none" stroke="#0C0C0D" strokeWidth={0.18}>
            <animate attributeName="r" values=".8;1.9;.8" dur="2.6s" repeatCount="indefinite" />
            <animate attributeName="stroke-opacity" values=".8;0;.8" dur="2.6s" repeatCount="indefinite" />
          </circle>
          <text x={pt.lx} y={pt.ly} textAnchor={pt.anchor as "middle" | "start"} fontFamily="var(--font-body)" fontWeight={700} fontSize={1.75} fill="#0C0C0D">{pt.label}</text>
        </g>
      ))}
      <circle cx={P.lille.x} cy={P.lille.y} r={0.5} fill="var(--parrit-red)" stroke="#0C0C0D" strokeWidth={0.14} />
      <circle cx={P.paris.x} cy={P.paris.y} r={0.66} fill="var(--parrit-red)" stroke="#0C0C0D" strokeWidth={0.14} />
      <circle cx={P.paris.x} cy={P.paris.y} r={0.66} fill="none" stroke="var(--parrit-red)" strokeWidth={0.2}>
        <animate attributeName="r" values=".9;2.1;.9" dur="2.2s" repeatCount="indefinite" />
        <animate attributeName="stroke-opacity" values=".9;0;.9" dur="2.2s" repeatCount="indefinite" />
      </circle>
      <text x={P.paris.x} y={P.lille.y - 1.9} textAnchor="middle" fontFamily="var(--font-body)" fontWeight={800} fontSize={1.85} fill="var(--parrit-red)">
        {lang === "fr" ? "France · Paris · Lille" : lang === "en" ? "France · Paris · Lille" : lang === "zh-CN" ? "法国 · 巴黎 · 里尔" : "França · Paris · Lille"}
      </text>
    </svg>
  );
}

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
          <Link className="parrit-os-topbar-link" href={`/${lang}/actualite`}>
            {dict.actualite.navTitle}
          </Link>
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
            // Lien réel pour les items externes (LinkedIn) : window.open était bloqué
            // comme popup par Safari et invisible sans JS / pour les crawlers.
            if ("href" in it && it.href) {
              return (
                <a key={it.id} className="parrit-os-icon" href={it.href} target="_blank" rel="noopener noreferrer" style={{ textDecoration: "none" }}>
                  <LeftIcon name={it.icon} />
                  <span>{it.label}</span>
                </a>
              );
            }
            const onClick = () => {
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
              lang === "fr" ? "Operating Partner · 速 vitesse d'exécution"
              : lang === "en" ? "Operating Partner · 速 speed of execution"
              : lang === "zh-CN" ? "Operating Partner · 速 执行速度"
              : "Operating Partner · 速 velocidade de execução"
            }</p>
            <h1 className="parrit-os-wordmark-h1">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/brand/parrit-lockup.svg"
                alt="PARRIT·AI"
                className="parrit-os-wordmark"
                width={440}
                height={67}
              />
            </h1>
            <div className="parrit-os-chips">
              {(lang === "fr"
                ? ["Transformation IA", "Management d'agents IA", "Formation au management d'agents IA"]
                : lang === "en"
                  ? ["AI Transformation", "AI agent management", "Training in AI agent management"]
                  : lang === "zh-CN"
                    ? ["AI 转型", "AI 智能体管理", "AI 智能体管理培训"]
                    : ["Transformação IA", "Gestão de agentes IA", "Formação em gestão de agentes IA"]
              ).map((c) => (
                <span key={c} className="parrit-os-chip">{c}</span>
              ))}
            </div>
            <p className="parrit-os-tagline">{copy.tagline}</p>
            <p className="parrit-os-sub">{copy.sub}</p>
            <div className="parrit-os-cta-row">
              <a
                className="parrit-os-cta parrit-os-cta-parrit"
                href={`/diagnostic?lang=${lang}`}
                aria-label={lang === "fr" ? "Parler à Parrit" : lang === "en" ? "Talk to Parrit" : lang === "zh-CN" ? "和 Parrit 对话" : "Falar com Parrit"}
              >
                {lang === "fr" ? "Parler à Parrit" : lang === "en" ? "Talk to Parrit" : lang === "zh-CN" ? "和 Parrit 对话" : "Falar com Parrit"} →
              </a>
              <button
                className="parrit-os-cta-secondary"
                onClick={() => openContact()}
                aria-label={copy.cta}
              >
                {copy.cta}
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
          {copy.offers.map((o, i) => {
            const isFlagship = o.id === "business";
            return (
              <button
                key={o.id}
                className={`parrit-os-icon parrit-os-offer ${isFlagship ? "parrit-os-offer-flagship" : ""}`}
                onClick={() => openOffer(i)}
                aria-label={o.title}
              >
                {isFlagship && (
                  <span className="parrit-os-flagship-badge">
                    {lang === "fr" ? "Phare" : lang === "en" ? "Flagship" : lang === "zh-CN" ? "旗舰" : "Carro-chefe"}
                  </span>
                )}
                <OfferIcon idx={i} accent={o.accent} />
                <span>{o.chip}</span>
              </button>
            );
          })}
          <p className="parrit-os-dock-hint">{copy.rightDock.hint}</p>
        </aside>
      </div>

      {/* ── Deux fronts — back-office / business (tout dirigeant s'y reconnaît) ── */}
      <section className="parrit-os-chain" aria-label="Intervention — deux fronts">
        <p className="parrit-os-chain-eyebrow">
          {lang === "fr"
            ? "On opère vos deux fronts critiques"
            : lang === "en"
            ? "We run both of your critical fronts"
            : lang === "zh-CN"
            ? "我们运营您的两大关键战线"
            : "Operamos suas duas frentes críticas"}
        </p>
        {(() => {
          const fronts =
            lang === "fr"
              ? [
                  { tag: "Back-office", desc: "ce qui fait tourner la boîte", kind: "backoffice", steps: ["Administratif & conformité", "Opérations & supply", "Finance & reporting", "Connaissance client"] },
                  { tag: "Business", desc: "ce qui la fait grandir", kind: "business", steps: ["Acquisition", "Relation client", "Marketing & contenu", "Innovation & produit"] },
                ]
              : lang === "en"
              ? [
                  { tag: "Back-office", desc: "what keeps the company running", kind: "backoffice", steps: ["Admin & compliance", "Operations & supply", "Finance & reporting", "Customer knowledge"] },
                  { tag: "Business", desc: "what makes it grow", kind: "business", steps: ["Acquisition", "Customer relationship", "Marketing & content", "Innovation & product"] },
                ]
              : lang === "zh-CN"
              ? [
                  { tag: "后台运营", desc: "支撑公司运转", kind: "backoffice", steps: ["行政与合规", "运营与供应", "财务与报告", "客户洞察"] },
                  { tag: "业务增长", desc: "助公司成长", kind: "business", steps: ["获客", "客户关系", "营销与内容", "创新与产品"] },
                ]
              : [
                  { tag: "Back-office", desc: "o que faz a empresa girar", kind: "backoffice", steps: ["Administrativo & conformidade", "Operações & supply", "Finanças & relatórios", "Conhecimento do cliente"] },
                  { tag: "Business", desc: "o que a faz crescer", kind: "business", steps: ["Aquisição", "Relação com cliente", "Marketing & conteúdo", "Inovação & produto"] },
                ];
          return fronts.map((front) => (
            <div className="parrit-os-chain-front" key={front.tag}>
              <p className={`parrit-os-chain-front-label parrit-os-front-${front.kind}`}>
                <span className="parrit-os-front-tag">{front.tag}</span>
                <span className="parrit-os-front-desc">{front.desc}</span>
              </p>
              <div className="parrit-os-chain-row">
                {front.steps.map((label, i, arr) => (
                  <React.Fragment key={label}>
                    <motion.div
                      className="parrit-os-chain-step"
                      style={{ ["--step-color" as string]: front.kind === "business" ? "#D1132F" : "#0C0C0D" } as React.CSSProperties}
                      initial={{ opacity: 0, y: 8 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true, margin: "-40px" }}
                      transition={{ duration: 0.35, delay: i * 0.07 }}
                    >
                      <span className="parrit-os-chain-dot" />
                      <span className="parrit-os-chain-label">{label}</span>
                    </motion.div>
                    {i < arr.length - 1 && <span className="parrit-os-chain-arrow" aria-hidden>›</span>}
                  </React.Fragment>
                ))}
              </div>
            </div>
          ));
        })()}
        <p className="parrit-os-chain-sub">
          {lang === "fr"
            ? "Operating Partner : on déploie et on opère des agents sur le front qui compte pour vous, celui qui fait tourner votre boîte comme celui qui la fait grandir. Tout ça, on l'a déjà déployé."
            : lang === "en"
            ? "Operating Partner: we deploy and run agents on the front that matters to you, the one that runs your company and the one that makes it grow. All of it, already deployed."
            : lang === "zh-CN"
            ? "Operating Partner：我们在对您重要的战线上部署并运营智能体，无论是支撑公司运转，还是助其成长。这一切，我们都已落地。"
            : "Operating Partner: implantamos e operamos agentes na frente que importa para você, a que faz a empresa girar e a que a faz crescer. Tudo isso, já implantado."}
        </p>
      </section>

      {/* ── Carte du monde — présence internationale ── */}
      <section className="parrit-os-world" aria-label="International presence">
        <p className="parrit-os-chain-eyebrow">
          {lang === "fr" ? "Présence internationale" : lang === "en" ? "International presence" : lang === "zh-CN" ? "国际布局" : "Presença internacional"}
        </p>
        <h2 className="parrit-os-world-title">
          {lang === "fr"
            ? "Paris & Lille, et des partenaires sur quatre continents"
            : lang === "en"
            ? "Paris & Lille, with partners across four continents"
            : lang === "zh-CN"
            ? "立足巴黎与里尔，伙伴遍布四大洲"
            : "Paris & Lille, com parceiros em quatro continentes"}
        </h2>
        <p className="parrit-os-chain-sub" style={{ marginTop: 10 }}>
          <span style={{ color: "var(--parrit-red)", fontWeight: 700 }}>速</span>{" "}
          {lang === "fr"
            ? "veut dire « vitesse ». C'est notre nom, et notre délai : un prototype dès le premier appel. De Paris et Lille à Canton, avec Yukun (冷宇坤)."
            : lang === "en"
            ? "means “speed”. It's our name and our turnaround: a prototype from the very first call. From Paris and Lille to Canton, with Yukun (冷宇坤)."
            : lang === "zh-CN"
            ? "意为「速度」。这是我们的名字，也是我们的交付节奏：首次通话即出原型。从巴黎、里尔到广州，与 Yukun（冷宇坤）。"
            : "significa “velocidade”. É o nosso nome e o nosso prazo: um protótipo já na primeira chamada. De Paris e Lille a Cantão, com Yukun (冷宇坤)."}
        </p>
        <motion.div
          className="parrit-os-world-card"
          initial={{ opacity: 0, y: 14 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.45 }}
        >
          <WorldMap lang={lang} />
        </motion.div>
        <div className="parrit-os-world-legend">
          <span className="parrit-os-world-chip"><span className="dot" style={{ background: "var(--parrit-red)" }} />{lang === "fr" ? "Parrit · Paris & Lille" : lang === "en" ? "Parrit · Paris & Lille" : lang === "zh-CN" ? "Parrit · 巴黎 & 里尔" : "Parrit · Paris & Lille"}</span>
          <span className="parrit-os-world-chip"><span className="dot" style={{ background: "#0C0C0D" }} />{lang === "fr" ? "Partenaire · Belo Horizonte" : lang === "en" ? "Partner · Belo Horizonte" : lang === "zh-CN" ? "合作伙伴 · 贝洛奥里藏特" : "Parceiro · Belo Horizonte"}</span>
          <span className="parrit-os-world-chip"><span className="dot" style={{ background: "#0C0C0D" }} />{lang === "fr" ? "Partenaire · Douala" : lang === "en" ? "Partner · Douala" : lang === "zh-CN" ? "合作伙伴 · 杜阿拉" : "Parceiro · Douala"}</span>
          <span className="parrit-os-world-chip"><span className="dot" style={{ background: "#0C0C0D" }} />{lang === "fr" ? "Partenaire · Guangzhou" : lang === "en" ? "Partner · Guangzhou" : lang === "zh-CN" ? "合作伙伴 · 广州" : "Parceiro · Guangzhou"}</span>
        </div>
      </section>

      {/* ── Mobile dock fallback ─────────────────── */}
      <div className="parrit-os-mobile-offers">
        {copy.offers.map((o, i) => {
          const isFlagship = o.id === "business";
          return (
            <button
              key={o.id}
              className={`parrit-os-mobile-offer ${isFlagship ? "parrit-os-mobile-offer-flagship" : ""}`}
              onClick={() => openOffer(i)}
            >
              <OfferIcon idx={i} accent={o.accent} />
              <div>
                {isFlagship && (
                  <span className="parrit-os-flagship-badge-mobile">
                    {lang === "fr" ? "Offre phare" : lang === "en" ? "Flagship offer" : lang === "zh-CN" ? "旗舰服务" : "Carro-chefe"}
                  </span>
                )}
                <strong>{o.chip}</strong>
                <span>{o.title}</span>
              </div>
            </button>
          );
        })}
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
              lang={lang}
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
            accent="#D1132F"
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
              const accents = ["#D1132F", "#0C0C0D", "#D1132F", "#0C0C0D"];
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
                        color: accent === "#0C0C0D" ? "#FFFFFF" : "#0C0C0D",
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
