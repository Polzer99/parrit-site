"use client";

/* eslint-disable @next/next/no-img-element */

import { useState } from "react";
import { getAttribution } from "@/lib/attribution";
import type { Locale } from "./dictionaries";

const WEBHOOK_URL = "https://n8n.srv1115145.hstgr.cloud/webhook/parrit-lead";

type OfferRow = {
  label: string;
  price: string;
  tag?: string;
};

type OfferNavItem = {
  href: string;
  label: string;
};

type MaturiteTile = {
  id: string;
  label: string;
  phrase: string;
  href: string;
};

const MATURITE_POINTS: Record<string, { x: number; y: number; tipX: number; tipY: number }> = {
  N1: { x: 130, y: 390, tipX: 58, tipY: 250 },
  N2: { x: 260, y: 342, tipX: 184, tipY: 204 },
  N3: { x: 390, y: 286, tipX: 308, tipY: 146 },
  N4: { x: 520, y: 226, tipX: 430, tipY: 88 },
  N5: { x: 650, y: 160, tipX: 548, tipY: 22 },
  N6: { x: 770, y: 96, tipX: 636, tipY: 158 },
  N7: { x: 890, y: 36, tipX: 710, tipY: 206 },
};

type HomeCopy = {
  navCta: string;
  navLinks: OfferNavItem[];
  a11y: {
    nav: string;
    tools: string;
    footerOffers: string;
  };
  hero: {
    eyebrow: string;
    chips: string[];
    before: string;
    redOne: string;
    middle: string;
    redTwo: string;
    after: string;
    sub: string;
    primary: string;
    secondary: string;
  };
  logosLabel: string;
  what: {
    kicker: string;
    titleBefore: string;
    titleTime: string;
    titleMiddle: string;
    titleBusiness: string;
    titleAfter: string;
    lead: string;
    cards: { title: string; note: string; body: string }[];
  };
  how: {
    kicker: string;
    titleBefore: string;
    titleRed: string;
    titleAfter: string;
    steps: { title: string; note: string; body: string }[];
    ladder: OfferRow[];
  };
  maturite: {
    kicker: string;
    title: string;
    lead: string;
    diagnostic: {
      title: string;
      body: string;
      cta: string;
      href: string;
    };
    action: string;
    levels: MaturiteTile[];
    beforeLabel: string;
    afterLabel: string;
    examples: { level: string; title: string; before: string; after: string }[];
  };
  cases: {
    kicker: string;
    titleBefore: string;
    titleRed: string;
    titleAfter: string;
    note: string;
    beforeLabel: string;
    afterLabel: string;
    items: { name: string; sector: string; did: string; before: string; after: string; desc: string; more: string }[];
  };
  cta: {
    titleBefore: string;
    titleRed: string;
    titleAfter: string;
    fine: string;
    email: string;
    phone: string;
    submit: string;
    submitting: string;
    thanks: string;
    error: string;
    whatsapp: string;
    mail: string;
    qualiopi: string;
    qualiopiStrong: string;
    qualiopiAlt: string;
  };
  footer: string;
};

const COPY: Record<Locale, HomeCopy> = {
  fr: {
    navCta: "Recevoir mon diagnostic",
    navLinks: [
      { href: "/blog", label: "Articles" },
    ],
    a11y: {
      nav: "Navigation principale",
      tools: "Outils",
      footerOffers: "Offres Parrit",
    },
    hero: {
      eyebrow: "Fractional AI Operator · Ingénierie agentique",
      chips: ["Claude Code", "Codex", "Serveurs MCP"],
      before: "Parrit opère vos ",
      redOne: "deux fronts critiques",
      middle: " : ",
      redTwo: "back-office automatisé",
      after: " et business généré.",
      sub: "Des outils sur-mesure, déployés et opérés avec vous.",
      primary: "Recevoir mon diagnostic",
      secondary: "Voir la transformation",
    },
    logosLabel: "Ils nous ont déjà fait confiance",
    what: {
      kicker: "Ce qu'on fait, concrètement",
      titleBefore: "On vous fait gagner du ",
      titleTime: "temps",
      titleMiddle: ", et générer plus de ",
      titleBusiness: "business",
      titleAfter: ".",
      lead: "La même technologie agentique des deux côtés. D'un côté on enlève le travail qui vous pèse. De l'autre on va chercher des tâches que vous ne pouviez pas imaginer. On vous accompagne pour devenir AI-first sur tous les fronts.",
      cards: [
        {
          title: "Gagner du temps",
          note: "l'OS Opérations",
          body: "On libère vos mains de ce qui consomme votre temps et votre énergie. Ici, on parle des tâches déjà présentes dans votre quotidien.",
        },
        {
          title: "Faire plus de business",
          note: "l'OS Croissance",
          body: "Fluidifier votre cycle de vente et générer plus d'opportunités, en tirant pleinement parti des capacités agentiques.",
        },
      ],
    },
    how: {
      kicker: "La démarche",
      titleBefore: "On commence par un ",
      titleRed: "diagnostic",
      titleAfter: ", puis on transforme.",
      steps: [
        {
          title: "01 · Diagnostic avant rendez-vous",
          note: "la ressource",
          body: "Vous arrivez avec une première lecture : niveau de maturité, flux prioritaire, risque à protéger et ressource utile.",
        },
        {
          title: "02 · Cadrage du flux",
          note: "la décision",
          body: "On choisit un seul flux à transformer : entrées, données, exceptions, validation humaine et mesure.",
        },
        {
          title: "03 · Transformation contrôlée",
          note: "la suite",
          body: "On construit, on transmet ou on optimise selon votre niveau. Chaque étape garde un propriétaire, une trace et un prochain seuil clair.",
        },
      ],
      ladder: [
        { label: "Diagnostic de maturité IA", price: "préparé avant rendez-vous" },
        { label: "Audit de transformation", tag: "Point d'entrée", price: "à partir de 3 500 €" },
        { label: "Déploiement d'agents IA", price: "à partir de 2 994 €" },
        { label: "Formation à l'utilisation agentique (non-tech)", price: "à partir de 3 497 € · finançable OPCO" },
        { label: "Accompagnement · Operating Partner", price: "à partir de 247 €/h" },
      ],
    },
    maturite: {
      kicker: "De l'IA générative à l'IA agentique",
      title: "Où en êtes-vous avec l'IA ?",
      lead: "La montée commence par un diagnostic. Vous repartez avec votre niveau, le premier flux à traiter et la ressource qui vous correspond.",
      diagnostic: {
        title: "Étape 1 · Recevoir votre diagnostic",
        body: "Avant le rendez-vous, on prépare une première lecture de votre maturité : où vous êtes, ce qui bloque, le flux à regarder en premier.",
        cta: "Recevoir mon diagnostic",
        href: "#contact",
      },
      action: "Découvrir ce niveau",
      beforeLabel: "Avant",
      afterLabel: "Après",
      levels: [
        { id: "N1", label: "L'Éveil", phrase: "Je découvre l'IA générative", href: "/masterclass-ia" },
        { id: "N2", label: "L'Usage", phrase: "Je veux l'appliquer à mon secteur", href: "/masterclass-metier" },
        { id: "N3", label: "L'Action", phrase: "Je veux connecter mes logiciels à l'IA", href: "/sessions-mcp" },
        { id: "N4", label: "Audit & diagnostic", phrase: "Je veux cartographier mes process", href: "/audit" },
        { id: "N5", label: "Le Déploiement", phrase: "Je veux un agent en production", href: "/deploiement-agents" },
        { id: "N6", label: "L'Autonomie", phrase: "Je veux maîtriser Claude Code et Codex", href: "/outils-agentiques" },
        { id: "N7", label: "La Gouvernance", phrase: "J'ai une flotte, je veux l'optimiser", href: "/optimisation-flotte" },
      ],
      examples: [
        {
          level: "N1",
          title: "Un COMEX qui découvre",
          before: "Chacun a testé un outil, personne ne sait quoi décider.",
          after: "Le comité repart avec un vocabulaire commun et 4 cas réalistes.",
        },
        {
          level: "N4",
          title: "Avant de produire",
          before: "Des idées, des outils, mais pas de carte claire.",
          after: "Le flux prioritaire, les données et les validations sont posés.",
        },
        {
          level: "N5",
          title: "Le passage en production",
          before: "Une équipe traite à la main le même flux semaine après semaine.",
          after: "Un agent prépare, trace et escalade. L'humain garde la décision.",
        },
      ],
    },
    cases: {
      kicker: "Déjà en production",
      titleBefore: "Exemples de cas déployés chez nos ",
      titleRed: "clients",
      titleAfter: ".",
      note: "Cliquez pour voir le détail de chaque réalisation.",
      beforeLabel: "Avant",
      afterLabel: "Après",
      items: [
        {
          name: "Agent mail",
          sector: "ex. Clevery",
          did: "Vos emails triés, rédigés, prêts à envoyer.",
          before: "Une boîte saturée, des priorités cachées, des réponses qui partent trop tard.",
          after: "Les messages sont classés, les réponses prêtes, l'humain ne garde que la validation.",
          desc: "L'agent lit, classe et prépare les réponses. Vous relisez, vous envoyez. Pensé pour les boîtes qui croulent sous le mail.",
          more: "Voir le cas →",
        },
        {
          name: "Agent de veille",
          sector: "clients & prospects",
          did: "Vos comptes sous surveillance, en continu.",
          before: "Les signaux clients arrivent trop tard ou restent dispersés entre plusieurs sources.",
          after: "Les levées, recrutements, appels d'offres et risques remontent au bon moment.",
          desc: "Il suit l'actualité de vos clients et prospects et repère les signaux : levée, recrutement, appel d'offres. Vous êtes alerté au bon moment.",
          more: "Voir le cas →",
        },
        {
          name: "CRM piloté par agents",
          sector: "ex. Laparra",
          did: "Votre CRM se tient à jour tout seul.",
          before: "Les fiches clients vieillissent, les relances se perdent et l'équipe évite le CRM.",
          after: "Les mises à jour et relances se font en langage naturel, dans le flux de travail.",
          desc: "Vous parlez à votre CRM en langage naturel, depuis un chat. Un ou plusieurs agents tiennent les fiches et les relances à jour.",
          more: "Voir le cas →",
        },
        {
          name: "Outil propriétaire sur-mesure",
          sector: "sur votre process",
          did: "L'outil métier qui n'existe pas encore.",
          before: "Le process critique vit dans des tableurs, des emails et des arbitrages manuels.",
          after: "Une interface métier unique orchestre les données, les actions et les validations.",
          desc: "On construit l'application qui vous manque, autour de votre métier. Par exemple : un agent qui dialogue directement avec votre CRM.",
          more: "Voir le cas →",
        },
        {
          name: "Alertes intelligentes",
          sector: "au bon moment",
          did: "La bonne alerte, au bon moment.",
          before: "Les échéances, ruptures ou pics d'activité sont repérés quand il est déjà tard.",
          after: "Les alertes utiles sortent automatiquement, contextualisées pour la bonne équipe.",
          desc: "Des alertes générées automatiquement : produits de saison, ruptures de stock, échéances, pics d'activité. Vos équipes ne ratent plus rien.",
          more: "Voir le cas →",
        },
        {
          name: "Formation agentique",
          sector: "ex. Joone",
          did: "Vos équipes deviennent autonomes.",
          before: "Quelques personnes testent des outils IA, sans cadre partagé ni passation durable.",
          after: "Les référents savent cadrer, construire et piloter leurs agents avec méthode.",
          desc: "On forme vos référents IA et on configure Claude Code, Codex et vos outils agentiques. Ils repartent en sachant construire et piloter leurs agents.",
          more: "Voir le cas →",
        },
      ],
    },
    cta: {
      titleBefore: "Recevez votre ",
      titleRed: "diagnostic",
      titleAfter: " avant l'échange.",
      fine: "Laissez votre email et votre numéro : on prépare une première lecture de votre maturité, du flux prioritaire et de la ressource à vous envoyer.",
      email: "Votre email professionnel",
      phone: "Votre téléphone",
      submit: "Recevoir mon diagnostic",
      submitting: "Envoi…",
      thanks: "Merci. On prépare votre diagnostic avant l'échange.",
      error: "Échec d'envoi. Écrivez à paul.larmaraud@parrit.ai.",
      whatsapp: "WhatsApp",
      mail: "ou écrire directement à Paul",
      qualiopi: "Nos formations sont ",
      qualiopiStrong: "finançables par votre OPCO",
      qualiopiAlt: "Qualiopi : processus certifié, République Française",
    },
    footer: "Paul Larmaraud & Yukun Leng · un réseau d'experts · paul.larmaraud@parrit.ai",
  },
  en: {
    navCta: "Get my diagnostic",
    navLinks: [
      { href: "/blog", label: "Articles" },
    ],
    a11y: {
      nav: "Primary navigation",
      tools: "Tools",
      footerOffers: "Parrit offers",
    },
    hero: {
      eyebrow: "Fractional AI Operator · Agentic engineering",
      chips: ["Claude Code", "Codex", "MCP servers"],
      before: "Parrit operates your ",
      redOne: "two critical fronts",
      middle: ": ",
      redTwo: "automated back office",
      after: " and generated business.",
      sub: "Custom tools, deployed and operated with you.",
      primary: "Get my diagnostic",
      secondary: "See the transformation",
    },
    logosLabel: "They already trusted us",
    what: {
      kicker: "What we do, concretely",
      titleBefore: "We help you save ",
      titleTime: "time",
      titleMiddle: " and generate more ",
      titleBusiness: "business",
      titleAfter: ".",
      lead: "The same agentic technology on both sides. On one side, we remove the work that weighs you down. On the other, we go after tasks you could not previously imagine. We help you become AI-first on every front.",
      cards: [
        {
          title: "Save time",
          note: "the Operations OS",
          body: "We free your hands from what consumes your time and energy. Here, we mean tasks already present in your day-to-day work.",
        },
        {
          title: "Generate more business",
          note: "the Growth OS",
          body: "Smooth your sales cycle and generate more opportunities by fully using agentic capabilities.",
        },
      ],
    },
    how: {
      kicker: "The method",
      titleBefore: "We start with a ",
      titleRed: "diagnostic",
      titleAfter: ", then transform.",
      steps: [
        {
          title: "01 · Diagnostic before the meeting",
          note: "the resource",
          body: "You arrive with a first read: maturity level, priority workflow, risk to protect and useful resource.",
        },
        {
          title: "02 · Workflow framing",
          note: "the decision",
          body: "We choose one workflow to transform: inputs, data, exceptions, human validation and measurement.",
        },
        {
          title: "03 · Controlled transformation",
          note: "the next step",
          body: "We build, transfer or optimize depending on your level. Every step keeps an owner, a trace and a clear next threshold.",
        },
      ],
      ladder: [
        { label: "AI maturity diagnostic", price: "prepared before the meeting" },
        { label: "Transformation audit", tag: "Entry point", price: "from €3,500" },
        { label: "AI agent deployment", price: "from €2,994" },
        { label: "Agentic usage training (non-tech)", price: "from €3,497 · OPCO-financeable" },
        { label: "Support · Operating Partner", price: "from €247/h" },
      ],
    },
    maturite: {
      kicker: "From generative AI to agentic AI",
      title: "Where are you with AI?",
      lead: "The climb starts with a diagnostic. You leave with your level, the first workflow to inspect and the resource that fits you.",
      diagnostic: {
        title: "Step 1 · Get your diagnostic",
        body: "Before the meeting, we prepare a first read of your maturity: where you stand, what blocks you and which workflow to inspect first.",
        cta: "Get my diagnostic",
        href: "#contact",
      },
      action: "Explore this level",
      beforeLabel: "Before",
      afterLabel: "After",
      levels: [
        { id: "N1", label: "Awakening", phrase: "I'm discovering generative AI", href: "/masterclass-ia" },
        { id: "N2", label: "Usage", phrase: "I want to apply it to my sector", href: "/masterclass-metier" },
        { id: "N3", label: "Action", phrase: "I want to connect my software to AI", href: "/sessions-mcp" },
        { id: "N4", label: "Audit & diagnosis", phrase: "I want to map my processes", href: "/audit" },
        { id: "N5", label: "Deployment", phrase: "I want an agent in production", href: "/deploiement-agents" },
        { id: "N6", label: "Autonomy", phrase: "I want to master Claude Code and Codex", href: "/outils-agentiques" },
        { id: "N7", label: "Governance", phrase: "I have a fleet and want to optimize it", href: "/optimisation-flotte" },
      ],
      examples: [
        {
          level: "N1",
          title: "An executive team discovering AI",
          before: "Everyone has tried a tool, but no one knows what to decide.",
          after: "The team leaves with shared language and four realistic use cases.",
        },
        {
          level: "N4",
          title: "Before production",
          before: "Ideas and tools exist, but there is no clear map.",
          after: "The priority workflow, data and validations are defined.",
        },
        {
          level: "N5",
          title: "The move to production",
          before: "A team handles the same workflow by hand week after week.",
          after: "An agent prepares, traces and escalates. The human keeps the decision.",
        },
      ],
    },
    cases: {
      kicker: "Already in production",
      titleBefore: "Examples of cases deployed with our ",
      titleRed: "clients",
      titleAfter: ".",
      note: "Click to see each project in detail.",
      beforeLabel: "Before",
      afterLabel: "After",
      items: [
        {
          name: "Mail agent",
          sector: "ex. Clevery",
          did: "Your emails sorted, drafted, ready to send.",
          before: "An overloaded inbox, hidden priorities, replies sent too late.",
          after: "Messages are classified, replies are drafted, humans only validate.",
          desc: "The agent reads, classifies and prepares replies. You review, you send. Designed for teams drowning in email.",
          more: "See the case →",
        },
        {
          name: "Monitoring agent",
          sector: "clients & prospects",
          did: "Your accounts monitored continuously.",
          before: "Client signals arrive late or stay scattered across sources.",
          after: "Fundraising, hiring, tenders and risks surface at the right time.",
          desc: "It follows the news around clients and prospects and detects signals: fundraising, hiring, tenders. You are alerted at the right time.",
          more: "See the case →",
        },
        {
          name: "Agent-driven CRM",
          sector: "ex. Laparra",
          did: "Your CRM stays updated by itself.",
          before: "Client records age, follow-ups disappear, the team avoids the CRM.",
          after: "Updates and follow-ups happen in natural language, inside the workflow.",
          desc: "You talk to your CRM in natural language, from a chat. One or several agents keep records and follow-ups up to date.",
          more: "See the case →",
        },
        {
          name: "Custom proprietary tool",
          sector: "for your process",
          did: "The business tool that does not exist yet.",
          before: "A critical process lives across spreadsheets, emails and manual decisions.",
          after: "One business interface orchestrates data, actions and validations.",
          desc: "We build the application you are missing, around your business. For example: an agent that talks directly with your CRM.",
          more: "See the case →",
        },
        {
          name: "Smart alerts",
          sector: "at the right time",
          did: "The right alert, at the right time.",
          before: "Deadlines, stockouts or activity spikes are noticed when it is already late.",
          after: "Useful alerts are generated automatically and routed to the right team.",
          desc: "Automatically generated alerts: seasonal products, stockouts, deadlines, activity spikes. Your teams stop missing what matters.",
          more: "See the case →",
        },
        {
          name: "Agentic training",
          sector: "ex. Joone",
          did: "Your teams become autonomous.",
          before: "A few people test AI tools, without a shared frame or durable handover.",
          after: "AI leads know how to scope, build and operate their agents methodically.",
          desc: "We train your AI leads and configure Claude Code, Codex and your agentic tools. They leave knowing how to build and operate their agents.",
          more: "See the case →",
        },
      ],
    },
    cta: {
      titleBefore: "Get your ",
      titleRed: "diagnostic",
      titleAfter: " before we talk.",
      fine: "Leave your email and phone number: we prepare a first read of your maturity, priority workflow and the resource to send you.",
      email: "Your work email",
      phone: "Your phone number",
      submit: "Get my diagnostic",
      submitting: "Sending…",
      thanks: "Thanks. We will prepare your diagnostic before the meeting.",
      error: "Sending failed. Email paul.larmaraud@parrit.ai.",
      whatsapp: "WhatsApp",
      mail: "or email Paul directly",
      qualiopi: "Our training programs are ",
      qualiopiStrong: "financeable by your OPCO",
      qualiopiAlt: "Qualiopi : certified process, French Republic",
    },
    footer: "Paul Larmaraud & Yukun Leng · a network of experts · paul.larmaraud@parrit.ai",
  },
  "pt-BR": {
    navCta: "Receber diagnóstico",
    navLinks: [
      { href: "/blog", label: "Artigos" },
    ],
    a11y: {
      nav: "Navegação principal",
      tools: "Ferramentas",
      footerOffers: "Ofertas Parrit",
    },
    hero: {
      eyebrow: "Fractional AI Operator · Engenharia agentica",
      chips: ["Claude Code", "Codex", "Servidores MCP"],
      before: "A Parrit opera suas ",
      redOne: "duas frentes críticas",
      middle: ": ",
      redTwo: "back-office automatizado",
      after: " e business gerado.",
      sub: "Ferramentas sob medida, implantadas e operadas com você.",
      primary: "Receber meu diagnóstico",
      secondary: "Ver a transformação",
    },
    logosLabel: "Eles já confiaram em nós",
    what: {
      kicker: "O que fazemos, concretamente",
      titleBefore: "Fazemos você ganhar ",
      titleTime: "tempo",
      titleMiddle: " e gerar mais ",
      titleBusiness: "business",
      titleAfter: ".",
      lead: "A mesma tecnologia agentica dos dois lados. De um lado, removemos o trabalho que pesa. Do outro, buscamos tarefas que você nem podia imaginar. Acompanhamos sua empresa para se tornar AI-first em todas as frentes.",
      cards: [
        {
          title: "Ganhar tempo",
          note: "o OS de Operações",
          body: "Liberamos suas mãos do que consome seu tempo e sua energia. Aqui falamos das tarefas que já existem no seu dia a dia.",
        },
        {
          title: "Gerar mais business",
          note: "o OS de Crescimento",
          body: "Fluidificar seu ciclo de vendas e gerar mais oportunidades, explorando plenamente as capacidades agenticas.",
        },
      ],
    },
    how: {
      kicker: "O método",
      titleBefore: "Começamos por um ",
      titleRed: "diagnóstico",
      titleAfter: ", depois transformamos.",
      steps: [
        {
          title: "01 · Diagnóstico antes da reunião",
          note: "o recurso",
          body: "Você chega com uma primeira leitura: maturidade, fluxo prioritário, risco a proteger e recurso útil.",
        },
        {
          title: "02 · Enquadramento do fluxo",
          note: "a decisão",
          body: "Escolhemos um único fluxo para transformar: entradas, dados, exceções, validação humana e medida.",
        },
        {
          title: "03 · Transformação controlada",
          note: "a sequência",
          body: "Construímos, transferimos ou otimizamos conforme seu nível. Cada etapa mantém um dono, um rastro e um próximo limite claro.",
        },
      ],
      ladder: [
        { label: "Diagnóstico de maturidade IA", price: "preparado antes da reunião" },
        { label: "Auditoria de transformação", tag: "Ponto de entrada", price: "a partir de 3 500 €" },
        { label: "Deploy de agentes IA", price: "a partir de 2 994 €" },
        { label: "Formação em uso agentico (não técnico)", price: "a partir de 3 497 € · financiável OPCO" },
        { label: "Acompanhamento · Operating Partner", price: "a partir de 247 €/h" },
      ],
    },
    maturite: {
      kicker: "Da IA generativa à IA agentica",
      title: "Onde você está com a IA?",
      lead: "A subida começa por um diagnóstico. Você sai com seu nível, o primeiro fluxo a observar e o recurso que combina com você.",
      diagnostic: {
        title: "Etapa 1 · Receber seu diagnóstico",
        body: "Antes da reunião, preparamos uma primeira leitura da sua maturidade: onde você está, o que bloqueia e qual fluxo observar primeiro.",
        cta: "Receber meu diagnóstico",
        href: "#contact",
      },
      action: "Explorar este nível",
      beforeLabel: "Antes",
      afterLabel: "Depois",
      levels: [
        { id: "N1", label: "Despertar", phrase: "Estou descobrindo a IA generativa", href: "/masterclass-ia" },
        { id: "N2", label: "Uso", phrase: "Quero aplicar ao meu setor", href: "/masterclass-metier" },
        { id: "N3", label: "Ação", phrase: "Quero conectar meus softwares à IA", href: "/sessions-mcp" },
        { id: "N4", label: "Auditoria & diagnóstico", phrase: "Quero mapear meus processos", href: "/audit" },
        { id: "N5", label: "Deploy", phrase: "Quero um agente em produção", href: "/deploiement-agents" },
        { id: "N6", label: "Autonomia", phrase: "Quero dominar Claude Code e Codex", href: "/outils-agentiques" },
        { id: "N7", label: "Governança", phrase: "Tenho uma frota, quero otimizá-la", href: "/optimisation-flotte" },
      ],
      examples: [
        {
          level: "N1",
          title: "Uma direção descobrindo IA",
          before: "Cada pessoa testou uma ferramenta, mas ninguém sabe o que decidir.",
          after: "O comitê sai com vocabulário comum e quatro casos realistas.",
        },
        {
          level: "N4",
          title: "Antes de produzir",
          before: "Há ideias e ferramentas, mas nenhum mapa claro.",
          after: "O fluxo prioritário, os dados e as validações são definidos.",
        },
        {
          level: "N5",
          title: "A passagem para produção",
          before: "Uma equipe trata à mão o mesmo fluxo semana após semana.",
          after: "Um agente prepara, registra e escala. O humano mantém a decisão.",
        },
      ],
    },
    cases: {
      kicker: "Já em produção",
      titleBefore: "Exemplos de casos implantados nos nossos ",
      titleRed: "clientes",
      titleAfter: ".",
      note: "Clique para ver o detalhe de cada realização.",
      beforeLabel: "Antes",
      afterLabel: "Depois",
      items: [
        {
          name: "Agente de email",
          sector: "ex. Clevery",
          did: "Seus emails triados, redigidos, prontos para enviar.",
          before: "Uma caixa lotada, prioridades escondidas, respostas enviadas tarde demais.",
          after: "Mensagens classificadas, respostas preparadas, humanos só validam.",
          desc: "O agente lê, classifica e prepara respostas. Você revisa e envia. Pensado para empresas soterradas por emails.",
          more: "Ver o caso →",
        },
        {
          name: "Agente de monitoramento",
          sector: "clientes & prospects",
          did: "Suas contas sob vigilância contínua.",
          before: "Sinais de clientes chegam tarde ou ficam espalhados entre fontes.",
          after: "Captações, recrutamentos, chamadas públicas e riscos aparecem na hora certa.",
          desc: "Ele acompanha notícias de clientes e prospects e detecta sinais: captação, recrutamento, chamada pública. Você é alertado no momento certo.",
          more: "Ver o caso →",
        },
        {
          name: "CRM pilotado por agentes",
          sector: "ex. Laparra",
          did: "Seu CRM se mantém atualizado sozinho.",
          before: "Fichas envelhecem, follow-ups somem e a equipe evita o CRM.",
          after: "Atualizações e follow-ups acontecem em linguagem natural, no fluxo de trabalho.",
          desc: "Você fala com seu CRM em linguagem natural, por chat. Um ou vários agentes mantêm fichas e follow-ups atualizados.",
          more: "Ver o caso →",
        },
        {
          name: "Ferramenta proprietária sob medida",
          sector: "no seu processo",
          did: "A ferramenta de negócio que ainda não existe.",
          before: "Um processo crítico vive em planilhas, emails e decisões manuais.",
          after: "Uma interface de negócio orquestra dados, ações e validações.",
          desc: "Construímos a aplicação que falta, em torno do seu negócio. Por exemplo: um agente que dialoga diretamente com seu CRM.",
          more: "Ver o caso →",
        },
        {
          name: "Alertas inteligentes",
          sector: "no momento certo",
          did: "O alerta certo, no momento certo.",
          before: "Prazos, rupturas ou picos de atividade são percebidos tarde demais.",
          after: "Alertas úteis saem automaticamente e chegam à equipe certa.",
          desc: "Alertas gerados automaticamente: produtos sazonais, rupturas de estoque, prazos, picos de atividade. Suas equipes não perdem mais nada.",
          more: "Ver o caso →",
        },
        {
          name: "Formação agentica",
          sector: "ex. Joone",
          did: "Suas equipes se tornam autônomas.",
          before: "Algumas pessoas testam ferramentas de IA sem quadro comum nem passagem durável.",
          after: "Referentes IA sabem enquadrar, construir e pilotar agentes com método.",
          desc: "Formamos seus referentes IA e configuramos Claude Code, Codex e suas ferramentas agenticas. Eles saem sabendo construir e pilotar seus agentes.",
          more: "Ver o caso →",
        },
      ],
    },
    cta: {
      titleBefore: "Receba seu ",
      titleRed: "diagnóstico",
      titleAfter: " antes da conversa.",
      fine: "Deixe seu email e telefone: preparamos uma primeira leitura da sua maturidade, do fluxo prioritário e do recurso a enviar.",
      email: "Seu email profissional",
      phone: "Seu telefone",
      submit: "Receber meu diagnóstico",
      submitting: "Enviando…",
      thanks: "Obrigado. Vamos preparar seu diagnóstico antes da conversa.",
      error: "Falha no envio. Escreva para paul.larmaraud@parrit.ai.",
      whatsapp: "WhatsApp",
      mail: "ou escrever diretamente para Paul",
      qualiopi: "Nossas formações são ",
      qualiopiStrong: "financiáveis pelo seu OPCO",
      qualiopiAlt: "Qualiopi : processo certificado, República Francesa",
    },
    footer: "Paul Larmaraud & Yukun Leng · uma rede de especialistas · paul.larmaraud@parrit.ai",
  },
  "zh-CN": {
    navCta: "获取诊断",
    navLinks: [
      { href: "/blog", label: "文章" },
    ],
    a11y: {
      nav: "主导航",
      tools: "工具",
      footerOffers: "Parrit 服务",
    },
    hero: {
      eyebrow: "Fractional AI Operator · 智能体工程",
      chips: ["Claude Code", "Codex", "MCP 服务器"],
      before: "Parrit 为你运营",
      redOne: "两个关键战线",
      middle: "：",
      redTwo: "自动化后台",
      after: "和业务增长。",
      sub: "为你定制、部署，并与你一起运营的工具。",
      primary: "获取我的诊断",
      secondary: "查看转型路径",
    },
    logosLabel: "他们已经信任我们",
    what: {
      kicker: "我们具体做什么",
      titleBefore: "我们帮你节省",
      titleTime: "时间",
      titleMiddle: "，并创造更多",
      titleBusiness: "业务",
      titleAfter: "。",
      lead: "两侧使用同一种智能体技术。一侧，我们拿掉拖累你的工作；另一侧，我们寻找过去难以想象的任务。我们陪你在各条战线上变成 AI-first。",
      cards: [
        {
          title: "节省时间",
          note: "运营 OS",
          body: "我们把消耗你时间和精力的工作从你手里释放出来。这里指的是你日常已经存在的任务。",
        },
        {
          title: "创造更多业务",
          note: "增长 OS",
          body: "让销售周期更顺畅，并充分利用智能体能力创造更多机会。",
        },
      ],
    },
    how: {
      kicker: "方法",
      titleBefore: "我们先做",
      titleRed: "诊断",
      titleAfter: "，再推进转型。",
      steps: [
        {
          title: "01 · 会前诊断",
          note: "资源",
          body: "你会带着第一版判断进入交流：成熟度、优先流程、需要保护的风险，以及适合你的资源。",
        },
        {
          title: "02 · 流程界定",
          note: "决策",
          body: "我们只选择一个流程先处理：入口、数据、例外、人工验证和衡量方式。",
        },
        {
          title: "03 · 可控转型",
          note: "下一步",
          body: "根据你的阶段，我们构建、转移能力或优化。每一步都有负责人、记录和清晰的下一道门槛。",
        },
      ],
      ladder: [
        { label: "AI 成熟度诊断", price: "会前准备" },
        { label: "转型审计", tag: "入口项目", price: "起价 3 500 €" },
        { label: "AI 智能体部署", price: "起价 2 994 €" },
        { label: "智能体使用培训（非技术）", price: "起价 3 497 € · 可由 OPCO 资助" },
        { label: "陪跑 · Operating Partner", price: "起价 247 €/h" },
      ],
    },
    maturite: {
      kicker: "从生成式 AI 到智能体 AI",
      title: "您现在处在 AI 的哪个阶段？",
      lead: "上山从诊断开始。你会得到自己的阶段、第一条要看的流程，以及最适合你的资源。",
      diagnostic: {
        title: "第 1 步 · 获取你的诊断",
        body: "会前，我们先准备一版成熟度判断：你在哪里、卡点是什么、第一条应该查看的流程是什么。",
        cta: "获取我的诊断",
        href: "#contact",
      },
      action: "查看这个阶段",
      beforeLabel: "之前",
      afterLabel: "之后",
      levels: [
        { id: "N1", label: "觉醒", phrase: "我正在了解生成式 AI", href: "/masterclass-ia" },
        { id: "N2", label: "使用", phrase: "我想将其应用到我的行业", href: "/masterclass-metier" },
        { id: "N3", label: "行动", phrase: "我想把软件连接到 AI", href: "/sessions-mcp" },
        { id: "N4", label: "审计与诊断", phrase: "我想梳理自己的流程", href: "/audit" },
        { id: "N5", label: "部署", phrase: "我想要一个投入生产的智能体", href: "/deploiement-agents" },
        { id: "N6", label: "自主", phrase: "我想掌握 Claude Code 和 Codex", href: "/outils-agentiques" },
        { id: "N7", label: "治理", phrase: "我有一组智能体，想要优化", href: "/optimisation-flotte" },
      ],
      examples: [
        {
          level: "N1",
          title: "刚开始了解 AI 的管理团队",
          before: "大家都试过工具，但没人知道该做什么决定。",
          after: "团队带着共同语言和四个真实可做的用例离开。",
        },
        {
          level: "N4",
          title: "进入生产前",
          before: "有想法、有工具，但没有清晰地图。",
          after: "优先流程、数据和验证规则被明确。",
        },
        {
          level: "N5",
          title: "进入生产",
          before: "团队每周都在手工处理同一条流程。",
          after: "智能体准备、记录并升级例外。人保留决策。",
        },
      ],
    },
    cases: {
      kicker: "已经在生产中",
      titleBefore: "已为",
      titleRed: "客户",
      titleAfter: "部署的案例示例。",
      note: "点击查看每个项目的细节。",
      beforeLabel: "之前",
      afterLabel: "之后",
      items: [
        {
          name: "邮件智能体",
          sector: "ex. Clevery",
          did: "你的邮件被分类、起草，并准备发送。",
          before: "邮箱过载，优先级被淹没，回复总是太晚。",
          after: "邮件被分类，回复被起草，人工只保留审核。",
          desc: "智能体读取、分类并准备回复。你审核，然后发送。适合被邮件淹没的团队。",
          more: "查看案例 →",
        },
        {
          name: "监测智能体",
          sector: "客户 & 潜在客户",
          did: "持续监控你的账户。",
          before: "客户信号来得太晚，或散落在不同来源里。",
          after: "融资、招聘、招标和风险在正确时间浮现。",
          desc: "它跟踪客户和潜在客户的动态，并识别融资、招聘、招标等信号。你会在正确时间收到提醒。",
          more: "查看案例 →",
        },
        {
          name: "智能体驱动的 CRM",
          sector: "ex. Laparra",
          did: "你的 CRM 自动保持更新。",
          before: "客户资料老化，跟进丢失，团队不愿打开 CRM。",
          after: "更新和跟进用自然语言完成，直接进入工作流。",
          desc: "你通过聊天用自然语言和 CRM 对话。一个或多个智能体保持资料和跟进记录更新。",
          more: "查看案例 →",
        },
        {
          name: "定制专有工具",
          sector: "围绕你的流程",
          did: "还不存在的业务工具。",
          before: "关键流程散落在表格、邮件和人工判断中。",
          after: "一个业务界面统一编排数据、动作和验证。",
          desc: "我们围绕你的业务构建你缺少的应用。例如：一个能直接和你的 CRM 对话的智能体。",
          more: "查看案例 →",
        },
        {
          name: "智能提醒",
          sector: "在正确时间",
          did: "正确的提醒，在正确的时间。",
          before: "截止日期、缺货或业务高峰总是在太晚时才被发现。",
          after: "有用提醒自动生成，并送达正确团队。",
          desc: "自动生成提醒：季节性产品、缺货、截止日期、业务高峰。你的团队不再错过关键事项。",
          more: "查看案例 →",
        },
        {
          name: "智能体培训",
          sector: "ex. Joone",
          did: "你的团队变得自主。",
          before: "少数人在测试 AI 工具，但没有共同框架或可传递方法。",
          after: "AI 负责人知道如何界定、构建并运营智能体。",
          desc: "我们培训你的 AI 负责人，并配置 Claude Code、Codex 和你的智能体工具。团队离开时会知道如何构建和操作智能体。",
          more: "查看案例 →",
        },
      ],
    },
    cta: {
      titleBefore: "交流前先获取你的",
      titleRed: "诊断",
      titleAfter: "。",
      fine: "留下邮箱和电话：我们会准备一版成熟度、优先流程和应发送资源的初步判断。",
      email: "你的工作邮箱",
      phone: "你的电话",
      submit: "获取我的诊断",
      submitting: "发送中…",
      thanks: "谢谢。我们会在交流前准备你的诊断。",
      error: "发送失败。请写信给 paul.larmaraud@parrit.ai。",
      whatsapp: "WhatsApp",
      mail: "或直接写信给 Paul",
      qualiopi: "我们的培训",
      qualiopiStrong: "可由你的 OPCO 资助",
      qualiopiAlt: "Qualiopi：认证流程，法兰西共和国",
    },
    footer: "Paul Larmaraud & Yukun Leng · 专家网络 · paul.larmaraud@parrit.ai",
  },
};

const TOOL_CHIPS = [
  { src: "/brand/tool-logos/claude.svg" },
  { src: "/brand/tool-logos/openai.svg" },
  { src: "/brand/tool-logos/mcp.svg" },
];

const CLIENT_LOGOS = [
  { alt: "Lavazza", src: "/brand/client-logos/logo-1.png" },
  { alt: "Laparra", src: "/brand/client-logos/logo-2.png" },
  { alt: "SNCF", src: "/brand/client-logos/logo-3.png" },
  { alt: "Joone", src: "/brand/client-logos/logo-4.png" },
  { alt: "Clevery", src: "/brand/client-logos/logo-5.png" },
  { alt: "EFI", src: "/brand/client-logos/logo-6.png" },
  { alt: "Carte Noire", src: "/brand/client-logos/logo-7.png", className: "logo-cn" },
];

function Logo() {
  return (
    <div className="logo">
      <img className="logo-img" src="/brand/parrit-lockup-red.svg" alt="Parrit·AI" />
    </div>
  );
}

function LeadForm({ copy, lang }: { copy: HomeCopy["cta"]; lang: Locale }) {
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [state, setState] = useState<"idle" | "sending" | "sent" | "error">("idle");

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!email.trim() || !phone.trim()) return;

    setState("sending");
    const utms = getAttribution();
    const posthog =
      typeof window !== "undefined"
        ? ((window as unknown as { posthog?: { capture: (event: string, props: Record<string, unknown>) => void; identify: (id: string, props?: Record<string, unknown>) => void } }).posthog)
        : undefined;

    try {
      await fetch(WEBHOOK_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          source: "parrit.ai",
          action: "home_callback_request",
          page: `/${lang}`,
          email: email.trim(),
          telephone: phone.trim(),
          contact_raw: `${email.trim()} · ${phone.trim()}`,
          referrer: typeof document !== "undefined" ? document.referrer : "",
          url: typeof window !== "undefined" ? window.location.href : "",
          timestamp: new Date().toISOString(),
          ...utms,
        }),
      });

      posthog?.identify(email.trim(), { email: email.trim(), phone: phone.trim() });
      posthog?.capture("form_submitted", {
        form: "home_callback",
        page: `/${lang}`,
        ...utms,
      });
      setState("sent");
    } catch {
      posthog?.capture("form_failed", { form: "home_callback", page: `/${lang}`, ...utms });
      setState("error");
    }
  }

  return (
    <form className="leadform" onSubmit={handleSubmit}>
      <input
        type="email"
        name="email"
        autoComplete="email"
        placeholder={copy.email}
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
      />
      <input
        type="tel"
        name="tel"
        autoComplete="tel"
        placeholder={copy.phone}
        value={phone}
        onChange={(e) => setPhone(e.target.value)}
        required
      />
      <button className="btn btn-red btn-lg" type="submit" disabled={state === "sending"}>
        {state === "sending" ? copy.submitting : copy.submit}
      </button>
      {state === "sent" && <p className="lead-status">{copy.thanks}</p>}
      {state === "error" && <p className="lead-status error">{copy.error}</p>}
    </form>
  );
}

function captureHeroCtaClick(lang: Locale, placement: "desktop" | "mobile") {
  if (typeof window === "undefined") return;

  const posthog = (window as unknown as {
    posthog?: { capture: (event: string, props: Record<string, unknown>) => void };
  }).posthog;

  posthog?.capture("hero_cta_click", {
    page: `/${lang}`,
    placement,
    ...getAttribution(),
  });
}

export default function HomeClient({ lang }: { lang: Locale }) {
  const copy = COPY[lang] ?? COPY.fr;

  return (
    <main className="home-template">
      <div className="frame" />

      <div className="wrap">
        <nav className="nav" aria-label={copy.a11y.nav}>
          <Logo />
          <a className="btn btn-red" href="#contact">
            {copy.navCta}
          </a>
        </nav>
      </div>

      <section className="hero">
        <img className="seal-wm" src="/brand/parrit-seal.svg" alt="" aria-hidden="true" />
        <div className="eyebrow">{copy.hero.eyebrow}</div>
        <h1>
          {copy.hero.before}
          <span className="red">{copy.hero.redOne}</span>
          {copy.hero.middle}
          <span className="red">{copy.hero.redTwo}</span>
          {copy.hero.after}
        </h1>
        <p className="sub">{copy.hero.sub}</p>
        <div className="cta-row hero-mobile-cta">
          <a
            className="btn btn-red btn-lg"
            href="#contact"
            onClick={() => captureHeroCtaClick(lang, "mobile")}
          >
            {copy.hero.primary}
          </a>
        </div>
        <div className="chips" aria-label={copy.a11y.tools}>
          {TOOL_CHIPS.map((chip, index) => (
            <span className="chip" key={copy.hero.chips[index]}>
              <img className="ci" src={chip.src} alt="" aria-hidden="true" />
              {copy.hero.chips[index]}
            </span>
          ))}
        </div>
        <div className="cta-row hero-desktop-cta">
          <a
            className="btn btn-red btn-lg"
            href="#contact"
            onClick={() => captureHeroCtaClick(lang, "desktop")}
          >
            {copy.hero.primary}
          </a>
          <a className="btn btn-ghost btn-lg" href="#maturite">
            {copy.hero.secondary}
          </a>
        </div>
      </section>

      <section className="logowall-sec" aria-labelledby="client-logos">
        <div className="wrap">
          <div className="logowall-lab" id="client-logos">
            {copy.logosLabel}
          </div>
          <div className="logowall">
            {CLIENT_LOGOS.map((logo) => (
              <img className={logo.className} src={logo.src} alt={logo.alt} key={logo.alt} />
            ))}
          </div>
        </div>
      </section>

      <section className="section band" id="deployer">
        <div className="wrap">
          <div className="two">
            <div>
              <div className="kicker">{copy.what.kicker}</div>
              <h2>
                {copy.what.titleBefore}
                <span className="red">{copy.what.titleTime}</span>
                {copy.what.titleMiddle}
                <span className="red">{copy.what.titleBusiness}</span>
                {copy.what.titleAfter}
              </h2>
              <p className="lead">{copy.what.lead}</p>
            </div>
            <div className="grid2">
              {copy.what.cards.map((card) => (
                <div className="card" key={card.title}>
                  <div className="ic">速</div>
                  <span className="note note-eyebrow">{card.note}</span>
                  <h3>{card.title}</h3>
                  <p>{card.body}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="section" id="croissance">
        <div className="wrap">
          <div className="section-head">
            <div className="kicker">{copy.how.kicker}</div>
            <h2>
              {copy.how.titleBefore}
              <span className="red">{copy.how.titleRed}</span>
              {copy.how.titleAfter}
            </h2>
          </div>
          <div className="grid3">
            {copy.how.steps.map((step) => (
              <div className="card step" key={step.title}>
                <h3>
                  {step.title} <span className="note">{step.note}</span>
                </h3>
                <p>{step.body}</p>
              </div>
            ))}
          </div>

          <div className="ladder">
            {copy.how.ladder.map((row) => (
              <div className="row" key={row.label}>
                <span className="lab">
                  {row.label}
                  {row.tag && <span className="tag">{row.tag}</span>}
                </span>
                <span className="arr">→</span>
                <span className="price">{row.price}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section" id="maturite">
        <div className="wrap">
          <p className="kicker">{copy.maturite.kicker}</p>
          <h2>{copy.maturite.title}</h2>
          <p className="lead">{copy.maturite.lead}</p>
          <a className="maturite-diagnostic-card" href={copy.maturite.diagnostic.href}>
            <span className="maturite-num">01</span>
            <strong>{copy.maturite.diagnostic.title}</strong>
            <span>{copy.maturite.diagnostic.body}</span>
            <em>
              {copy.maturite.diagnostic.cta}
              <span aria-hidden="true">→</span>
            </em>
          </a>
          <nav className="maturite-mountain" aria-label={copy.maturite.title}>
            <svg viewBox="0 0 960 470" aria-labelledby="maturite-mountain-title maturite-mountain-desc">
              <title id="maturite-mountain-title">{copy.maturite.title}</title>
              <desc id="maturite-mountain-desc">{copy.maturite.lead}</desc>
              <path
                className="mountain-back"
                d="M20 424 L168 242 L246 314 L392 120 L520 300 L646 154 L918 424 Z"
              />
              <path
                className="mountain-mid"
                d="M58 430 L252 224 L338 312 L484 84 L612 268 L754 88 L936 430 Z"
              />
              <path
                className="mountain-front"
                d="M34 432 L174 332 L306 380 L438 234 L548 348 L686 220 L932 432 Z"
              />
              <path
                className="mountain-path"
                d="M58 430 C112 430 96 392 130 390 C202 386 194 342 260 342 C326 342 330 286 390 286 C462 286 452 226 520 226 C592 226 580 160 650 160 C718 160 700 96 770 96 C838 96 820 38 890 36"
              />
              <a className="mountain-start" href={`/${lang}/audit`} aria-label={copy.maturite.diagnostic.cta}>
                <circle cx="58" cy="430" r="16" />
                <text x="58" y="434" textAnchor="middle">
                  1
                </text>
              </a>
              {copy.maturite.levels.map((level) => {
                const point = MATURITE_POINTS[level.id];
                if (!point) return null;

                return (
                  <a
                    className="mountain-point"
                    href={`/${lang}${level.href}`}
                    key={level.id}
                    aria-label={`${level.id} · ${level.label} · ${level.phrase}`}
                  >
                    <circle cx={point.x} cy={point.y} r="20" />
                    <text x={point.x} y={point.y + 4} textAnchor="middle">
                      {level.id}
                    </text>
                    <foreignObject
                      className="mountain-tooltip"
                      x={point.tipX}
                      y={point.tipY}
                      width="226"
                      height="98"
                    >
                      <div>
                        <strong>
                          {level.id} · {level.label}
                        </strong>
                        <span>{level.phrase}</span>
                      </div>
                    </foreignObject>
                  </a>
                );
              })}
            </svg>
          </nav>
          <div className="maturite-grid">
            {copy.maturite.levels.map((level) => (
              <a href={`/${lang}${level.href}`} className="maturite-tile" key={level.id}>
                <span className="maturite-num">{level.id}</span>
                <strong className="maturite-label">{level.label}</strong>
                <em className="maturite-phrase">{level.phrase}</em>
                <span className="maturite-action">
                  {copy.maturite.action}
                  <span aria-hidden="true">→</span>
                </span>
              </a>
            ))}
          </div>
          <div className="maturite-examples">
            {copy.maturite.examples.map((example) => (
              <article className="maturite-example" key={`${example.level}-${example.title}`}>
                <span className="maturite-num">{example.level}</span>
                <h3>{example.title}</h3>
                <div className="maturite-example-flow">
                  <p>
                    <span>{copy.maturite.beforeLabel}</span>
                    {example.before}
                  </p>
                  <p>
                    <span>{copy.maturite.afterLabel}</span>
                    {example.after}
                  </p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="section band" id="transmettre">
        <div className="wrap">
          <div className="section-head">
            <div className="kicker">{copy.cases.kicker}</div>
            <h2>
              {copy.cases.titleBefore}
              <span className="red">{copy.cases.titleRed}</span>
              {copy.cases.titleAfter}
            </h2>
            <p className="note">{copy.cases.note}</p>
          </div>
          <div className="cases">
            {copy.cases.items.map((item) => (
              <a className="case" href="#contact" key={item.name}>
                <div className="who">
                  <span className="nm">{item.name}</span>
                  <span className="sct">{item.sector}</span>
                </div>
                <div className="did">{item.did}</div>
                <div className="case-compare">
                  <p>
                    <span>{copy.cases.beforeLabel}</span>
                    {item.before}
                  </p>
                  <p>
                    <span>{copy.cases.afterLabel}</span>
                    {item.after}
                  </p>
                </div>
                <div className="desc">{item.desc}</div>
                <div className="more">{item.more}</div>
              </a>
            ))}
          </div>
        </div>
      </section>

      <section className="section" id="contact">
        <div className="wrap">
          <div className="ctacard">
            <div>
              <Logo />
              <h2>
                {copy.cta.titleBefore}
                <span className="red">{copy.cta.titleRed}</span>
                {copy.cta.titleAfter}
              </h2>
              <p className="fine">{copy.cta.fine}</p>
              <LeadForm copy={copy.cta} lang={lang} />
              <div className="cta-alt">
                <a className="btn btn-wa btn-lg" href="https://wa.me/33683762219">
                  <img className="ci" src="/brand/tool-logos/whatsapp.svg" alt="" aria-hidden="true" />
                  {copy.cta.whatsapp}
                </a>
                <a className="cta-mail" href="mailto:paul.larmaraud@parrit.ai">
                  {copy.cta.mail}
                </a>
              </div>
            </div>
            <img className="seal-wm" src="/brand/parrit-seal.svg" alt="" aria-hidden="true" />
          </div>
          <div className="trust">
            <img
              className="qualiopi-logo"
              src="/brand/qualiopi/qualiopi-marianne.png"
              alt={copy.cta.qualiopiAlt}
            />
            <span className="qualiopi-note">
              {copy.cta.qualiopi}
              <b>{copy.cta.qualiopiStrong}</b>.
            </span>
          </div>
        </div>
      </section>

      <div className="wrap">
        <footer className="dim">
          <Logo />
          <nav className="footer-links" aria-label={copy.a11y.footerOffers}>
            {copy.navLinks.map((item) => (
              <a href={item.href.startsWith('/') ? `/${lang}${item.href}` : item.href} key={item.href}>
                {item.label}
              </a>
            ))}
          </nav>
          <span className="mono">{copy.footer}</span>
        </footer>
      </div>

      <div className="frame" />
    </main>
  );
}
