import type { Locale } from "@/app/[lang]/dictionaries";

export type OfferKind = "deployer" | "croissance" | "transmettre";

export type OfferNavItem = {
  href: OfferKind;
  label: string;
};

export type OfferCopy = {
  navCta: string;
  navLinks: OfferNavItem[];
  a11y: {
    nav: string;
    offers: string;
    chips: string;
  };
  meta: {
    title: string;
    description: string;
  };
  hero: {
    eyebrow: string;
    title: string;
    accent: string;
    after: string;
    sub: string;
    chips: string[];
    primary: string;
    secondary: string;
  };
  intro: {
    kicker: string;
    title: string;
    accent: string;
    after: string;
    lead: string;
    cardTitle: string;
    cardBody: string;
  };
  process?: {
    kicker: string;
    title: string;
    accent: string;
    after: string;
    cards: { number?: string; title: string; body: string }[];
  };
  deliverables?: {
    kicker: string;
    title: string;
    accent: string;
    after: string;
    items: string[];
  };
  spec: {
    kicker: string;
    title: string;
    accent: string;
    after: string;
    rows: { label: string; value: string; note?: string }[];
  };
  proofs: {
    kicker: string;
    title: string;
    accent: string;
    after: string;
    items: { sector: string; pain: string; result: string; resultAccent: string }[];
  };
  cta: {
    title: string;
    accent: string;
    after: string;
    fine: string;
    email: string;
    phone: string;
    submit: string;
    submitting: string;
    thanks: string;
    error: string;
    whatsapp: string;
    mail: string;
  };
  footer: string;
};

type OfferDraft = Omit<OfferCopy, "navCta" | "navLinks" | "a11y" | "cta"> & {
  cta: Pick<OfferCopy["cta"], "title" | "accent" | "after" | "fine">;
};

export const OFFER_NAV: Record<Locale, OfferNavItem[]> = {
  fr: [
    { href: "croissance", label: "Transformation IA" },
    { href: "deployer", label: "Agent IA" },
    { href: "transmettre", label: "Coaching" },
  ],
  en: [
    { href: "croissance", label: "AI Transformation" },
    { href: "deployer", label: "AI Agent" },
    { href: "transmettre", label: "Coaching" },
  ],
  "pt-BR": [
    { href: "croissance", label: "Transformação IA" },
    { href: "deployer", label: "Agente IA" },
    { href: "transmettre", label: "Coaching" },
  ],
  "zh-CN": [
    { href: "croissance", label: "AI 转型" },
    { href: "deployer", label: "AI 智能体" },
    { href: "transmettre", label: "辅导" },
  ],
};

const COMMON = {
  fr: {
    navCta: "Écrire à Paul",
    a11y: { nav: "Navigation principale", offers: "Offres Parrit", chips: "Points clés" },
    cta: {
      email: "Votre email professionnel",
      phone: "Votre téléphone",
      submit: "Être rappelé",
      submitting: "Envoi...",
      thanks: "Merci. On vous rappelle rapidement.",
      error: "Échec d'envoi. Écrivez à paul.larmaraud@parrit.ai.",
      whatsapp: "WhatsApp",
      mail: "ou écrire directement à Paul",
    },
  },
  en: {
    navCta: "Email Paul",
    a11y: { nav: "Primary navigation", offers: "Parrit offers", chips: "Key points" },
    cta: {
      email: "Your work email",
      phone: "Your phone number",
      submit: "Call me back",
      submitting: "Sending...",
      thanks: "Thanks. We will call you back shortly.",
      error: "Sending failed. Email paul.larmaraud@parrit.ai.",
      whatsapp: "WhatsApp",
      mail: "or email Paul directly",
    },
  },
  "pt-BR": {
    navCta: "Escrever para Paul",
    a11y: { nav: "Navegação principal", offers: "Ofertas Parrit", chips: "Pontos-chave" },
    cta: {
      email: "Seu email profissional",
      phone: "Seu telefone",
      submit: "Quero ser chamado",
      submitting: "Enviando...",
      thanks: "Obrigado. Vamos ligar em breve.",
      error: "Falha no envio. Escreva para paul.larmaraud@parrit.ai.",
      whatsapp: "WhatsApp",
      mail: "ou escrever diretamente para Paul",
    },
  },
  "zh-CN": {
    navCta: "写信给 Paul",
    a11y: { nav: "主导航", offers: "Parrit 服务", chips: "关键点" },
    cta: {
      email: "你的工作邮箱",
      phone: "你的电话",
      submit: "请回电",
      submitting: "发送中...",
      thanks: "谢谢。我们会尽快回电。",
      error: "发送失败。请写信给 paul.larmaraud@parrit.ai。",
      whatsapp: "WhatsApp",
      mail: "或直接写信给 Paul",
    },
  },
} satisfies Record<Locale, { navCta: string; a11y: OfferCopy["a11y"]; cta: Omit<OfferCopy["cta"], "title" | "accent" | "after" | "fine"> }>;

const withCommon = (lang: Locale, offer: OfferDraft): OfferCopy => ({
  ...offer,
  navCta: COMMON[lang].navCta,
  navLinks: OFFER_NAV[lang],
  a11y: COMMON[lang].a11y,
  cta: {
    ...offer.cta,
    ...COMMON[lang].cta,
  },
});

export const OFFER_COPY: Record<Locale, Record<OfferKind, OfferCopy>> = {
  fr: {
    deployer: withCommon("fr", {
      meta: {
        title: "Déployer · Sprint agentique · Parrit.ai",
        description: "Un workflow critique transformé en agent IA en production, avec périmètre clair, validation humaine et trace.",
      },
      hero: {
        eyebrow: "Offre · Agent IA",
        title: "Un agent en ",
        accent: "production contrôlée",
        after: ", avec périmètre et trace.",
        sub: "Vous choisissez un workflow critique. On le déploie en sprint borné. Vous repartez avec un système qui tourne, pas une démo.",
        chips: ["Diagnostic", "Périmètre clair", "En production", "Serveurs MCP"],
        primary: "Réserver le sprint",
        secondary: "Voir le cadre",
      },
      intro: {
        kicker: "Pour qui",
        title: "Pour les équipes qui veulent une ",
        accent: "preuve, vite",
        after: ".",
        lead: "Vous avez un process qui coûte cher en temps humain et vous voulez le voir tourner en agentique avant d'engager un chantier lourd. On prend un workflow réel, on le met en production, vous mesurez le gain sur vos propres données.",
        cardTitle: "Pourquoi borné",
        cardBody: "Un périmètre fermé, c'est un engagement signable sans friction. Vous décidez vite, on livre vite, et la sortie est un système utilisable par vos équipes.",
      },
      deliverables: {
        kicker: "Ce qu'on livre",
        title: "Un ",
        accent: "système qui tourne",
        after: ", dans votre SI.",
        items: [
          "1 workflow critique scellé, choisi avec vous.",
          "Périmètre borné, calendrier validé après diagnostic.",
          "Système en production dans votre SI.",
          "Démo de fin de sprint sur cas réels.",
          "Recommandation de mise à l'échelle chiffrée.",
          "Human-in-the-loop et traçabilité de bout en bout.",
        ],
      },
      spec: {
        kicker: "Le cadre",
        title: "Un agent, un périmètre : ",
        accent: "clair dès le départ",
        after: ".",
        rows: [
          
          { label: "Modèle", value: "Un agent, un périmètre", note: "vous en ajoutez au besoin" },
          { label: "Cible", value: "DSI et équipes ops" },
          { label: "Durée", value: "selon périmètre", note: "validée après diagnostic" },
          { label: "Conformité", value: "RGPD, EU AI Act, données chez vous" },
        ],
      },
      proofs: {
        kicker: "Preuves",
        title: "Déjà ",
        accent: "en production",
        after: ".",
        items: [
          { sector: "ETI logistique", pain: "Saisie et tri manuels d'un flux entrant.", result: "de temps de traitement sur le flux cadré.", resultAccent: "-40 %" },
          { sector: "Scale-up", pain: "Qualification de contacts trop lente pour suivre la cadence commerciale.", result: "enrichis et priorisés par l'agent.", resultAccent: "3 000 contacts" },
          { sector: "PME", pain: "Demandes entrantes perdues entre les canaux et les boîtes mail.", result: "capture et routage automatiques.", resultAccent: "Zéro lead perdu" },
        ],
      },
      cta: {
        title: "On scelle le périmètre, ",
        accent: "on déploie",
        after: ".",
        fine: "Un appel de 30 minutes suffit à choisir le workflow, cadrer le périmètre et bloquer les dates du sprint.",
      },
      footer: "Operating Partner IA. On déploie le système, pas la démo.",
    }),
    croissance: withCommon("fr", {
      meta: {
        title: "Transformation IA · Parrit.ai",
        description: "Un programme de transformation par l'IA : audit, cartographie des cas d'usage prioritaires et déploiement, pour directions métiers.",
      },
      hero: {
        eyebrow: "Offre · Transformation IA",
        title: "La transformation IA de votre organisation, ",
        accent: "pilotée bout en bout",
        after: ".",
        sub: "On audite vos opérations, on cartographie les cas d'usage qui comptent, on déploie les agents et on rend vos équipes autonomes. Un partenaire, pas un cabinet de slides.",
        chips: ["Audit", "Cas d'usage prioritaires", "Déploiement", "Directions métiers"],
        primary: "Parler de votre transformation",
        secondary: "Voir le cadre",
      },
      intro: {
        kicker: "Pour qui",
        title: "Pour les ",
        accent: "directions métiers",
        after: " qui pilotent le sujet IA.",
        lead: "Vous devez faire de l'IA un levier réel, pas une collection de POC. On part de vos processus, on priorise les cas d'usage à impact, et on déploie ceux qui créent de la valeur, avec la sécurité et la conformité posées dès le départ.",
        cardTitle: "Pourquoi sur devis",
        cardBody: "Une transformation dépend de votre point de départ, de votre SI et de vos priorités. On cadre le périmètre en audit, puis on chiffre un plan de déploiement clair, sans forfait creux.",
      },
      process: {
        kicker: "Comment ça marche",
        title: "Un programme, ",
        accent: "quatre temps",
        after: ".",
        cards: [
          { number: "01", title: "Audit", body: "On cartographie vos processus, vos données et vos outils pour repérer où l'IA crée vraiment de la valeur." },
          { number: "02", title: "Cas d'usage prioritaires", body: "On hiérarchise les cas par impact et faisabilité, et on chiffre le déploiement." },
          { number: "03", title: "Déploiement", body: "On met les agents en production dans votre SI, avec validation humaine, traçabilité et conformité." },
          { number: "04", title: "Passation", body: "On forme vos équipes et vos référents pour qu'ils pilotent et fassent évoluer les agents sans nous." },
        ],
      },
      spec: {
        kicker: "Le cadre",
        title: "Un programme ",
        accent: "sur devis",
        after: ", cadré par l'audit.",
        rows: [
          
          { label: "Point de départ", value: "Audit", note: "cartographie des cas d'usage" },
          { label: "Cible", value: "directions métiers" },
          { label: "Déploiement", value: "Cas d'usage prioritaires", note: "en production, par étapes" },
          { label: "Conformité", value: "RGPD, EU AI Act, données chez vous" },
        ],
      },
      proofs: {
        kicker: "Preuves",
        title: "Déjà ",
        accent: "en production",
        after: ".",
        items: [
          { sector: "ETI logistique", pain: "Saisie et tri manuels d'un flux entrant qui coûtait cher en temps humain.", result: "de temps de traitement sur le flux cadré.", resultAccent: "-40 %" },
          { sector: "Direction & pilotage", pain: "Des signaux de marché éparpillés, jamais consolidés.", result: "veille et priorisation automatisées, remontées chaque semaine.", resultAccent: "Continu" },
          { sector: "Multi-directions", pain: "Des cas d'usage IA identifiés mais jamais mis en production.", result: "déploiement par étapes, mesuré sur vos données.", resultAccent: "En production" },
        ],
      },
      cta: {
        title: "On cadre votre transformation en ",
        accent: "un audit",
        after: ".",
        fine: "Un premier échange pour comprendre vos priorités, puis un audit qui débouche sur un plan de déploiement chiffré. En visio ou en présentiel.",
      },
      footer: "Operating Partner IA. On déploie la transformation, pas un rapport.",
    }),
    transmettre: withCommon("fr", {
      meta: {
        title: "Transmettre · Formation agentique · Parrit.ai",
        description: "Formation et passation pour rendre vos équipes autonomes avec Claude Code, Codex et les serveurs MCP.",
      },
      hero: {
        eyebrow: "Offre · Coaching",
        title: "Coaching. On vous rend ",
        accent: "autonome",
        after: ".",
        sub: "On installe proprement la stack (Claude Code, Codex, MCP, sécurité), on déploie un premier agent avec vous, et chacun repart avec un agent qui tourne.",
        chips: ["Claude Code + Codex", "Serveurs MCP", "Certification Qualiopi", "Human-in-the-loop"],
        primary: "Parler coaching",
        secondary: "Voir le cadre",
      },
      intro: {
        kicker: "Trois façons",
        title: "Trois façons de ",
        accent: "rendre vos équipes autonomes",
        after: ".",
        lead: "Du premier agent installé avec vous jusqu'à la gouvernance dans la durée. On choisit selon votre point de départ.",
        cardTitle: "Pourquoi le coaching",
        cardBody: "Le coaching, c'est la dernière étape : après avoir audité et déployé, on donne aux équipes la méthode pour piloter et faire évoluer leurs agents sans nous.",
      },
      process: {
        kicker: "Formats",
        title: "On installe, on forme, ",
        accent: "on passe la main",
        after: ".",
        cards: [
          { title: "Audit & configuration", body: "Stack agentique installée, sécurité cadrée, logiciels connectés. Premier agent inclus." },
          { title: "Agent en 1 jour / hackathon", body: "Une journée hands-on : chacun construit son propre agent sur un cas réel de son métier." },
          { title: "Fractional AI Operator", body: "Maintien, gouvernance, montée en charge, conformité EU AI Act, sécurité et budget suivis." },
        ],
      },
      deliverables: {
        kicker: "Ce que chacun repart avec",
        title: "À la fin, chacun a un agent ",
        accent: "qui tourne pour de vrai",
        after: ".",
        items: [
          "Un agent qui tourne sur son propre périmètre, en production.",
          "La méthode de déploiement, pour en construire d'autres sans nous.",
          "Les garde-fous sécurité et budget, posés et compris.",
          "L'autonomie pour essaimer dans l'équipe et le reste de l'organisation.",
        ],
      },
      spec: {
        kicker: "Le cadre",
        title: "Un cadre ",
        accent: "simple et lisible",
        after: ".",
        rows: [
          
          { label: "Certification", value: "Qualiopi", note: "organisme certifié, finançable OPCO" },
          { label: "Cible", value: "DRH, Learning & Development" },
          { label: "Format", value: "Ateliers hands-on", note: "sur vos cas réels" },
          { label: "Stack", value: "Claude Code, Codex, MCP, sécurité" },
        ],
      },
      proofs: {
        kicker: "Preuves",
        title: "Des équipes ",
        accent: "aux commandes",
        after: ".",
        items: [
          { sector: "Équipe marketing", pain: "Production de contenus et reporting dispersés.", result: "agents configurés sur leurs propres workflows.", resultAccent: "Autonomie" },
          { sector: "Direction métier", pain: "Besoin d'exprimer les cas sans dépendre d'une équipe technique.", result: "méthode de cadrage et de pilotage transmise.", resultAccent: "Passation" },
          { sector: "Référents IA", pain: "Stack à installer sans fragiliser la sécurité.", result: "garde-fous posés, usages documentés.", resultAccent: "Sécurité" },
        ],
      },
      cta: {
        title: "On en parle ",
        accent: "15 minutes",
        after: " ?",
        fine: "On regarde ensemble un cas réel de votre métier, et on dit franchement si l'agentique change quelque chose pour vous. En visio ou en présentiel.",
      },
      footer: "Operating Partner agentique · paul.larmaraud@parrit.ai",
    }),
  },
  en: {
    deployer: withCommon("en", {
      meta: { title: "Deploy · Agentic sprint · Parrit.ai", description: "A critical workflow turned into a production AI agent with clear scope, human validation and traceability." },
      hero: { eyebrow: "Offer · AI Agent", title: "An agent in ", accent: "controlled production", after: ", with scope and trace.", sub: "You choose one critical workflow. We deploy it in a bounded sprint. You leave with a running system, not a demo.", chips: ["Diagnostic", "Clear scope", "In production", "MCP servers"], primary: "Book the sprint", secondary: "See the frame" },
      intro: { kicker: "Who it is for", title: "For teams that need ", accent: "proof, fast", after: ".", lead: "You have a process that costs too much human time and want to see it run agentically before launching a heavier program. We take a real workflow, put it in production, and measure the gain on your own data.", cardTitle: "Why bounded", cardBody: "A fixed scope makes the decision easy. You decide fast, we ship fast, and the output is a system your teams can actually use." },
      deliverables: { kicker: "What we deliver", title: "A ", accent: "running system", after: " inside your stack.", items: ["One sealed critical workflow, chosen with you.", "Bounded scope, calendar validated after diagnosis.", "Production system inside your IT environment.", "End-of-sprint demo on real cases.", "Quantified scaling recommendation.", "Human-in-the-loop and end-to-end traceability."] },
      spec: { kicker: "Frame", title: "One agent, one scope: ", accent: "clear upfront", after: ".", rows: [{ label: "Model", value: "One agent, one scope", note: "add more as needed" }, { label: "For", value: "IT and ops teams" }, { label: "Duration", value: "based on scope", note: "validated after diagnosis" }, { label: "Compliance", value: "GDPR, EU AI Act, your data stays with you" }] },
      proofs: { kicker: "Proof", title: "Already ", accent: "in production", after: ".", items: [{ sector: "Logistics company", pain: "Manual intake sorting and data entry.", result: "processing time on the scoped workflow.", resultAccent: "-40%" }, { sector: "Scale-up", pain: "Contact qualification too slow for the sales pace.", result: "enriched and prioritized by the agent.", resultAccent: "3,000 contacts" }, { sector: "SMB", pain: "Inbound requests lost between channels and inboxes.", result: "automatic capture and routing.", resultAccent: "Zero lost leads" }] },
      cta: { title: "We seal the scope, ", accent: "then deploy", after: ".", fine: "A 30-minute call is enough to choose the workflow, scope it and lock sprint dates." },
      footer: "AI Operating Partner. We deploy the system, not the demo.",
    }),
    croissance: withCommon("en", {
      meta: { title: "AI Transformation · Parrit.ai", description: "An AI transformation program: audit, mapping of priority use cases and deployment, for business-line leaders." },
      hero: { eyebrow: "Offer · AI Transformation", title: "Your organization's AI transformation, ", accent: "run end to end", after: ".", sub: "We audit your operations, map the use cases that matter, deploy the agents and make your teams autonomous. A partner, not a slide deck.", chips: ["Audit", "Priority use cases", "Deployment", "ExCom & IT"], primary: "Discuss your transformation", secondary: "See the frame" },
      intro: { kicker: "Who it is for", title: "For ", accent: "business-line leaders", after: " driving AI.", lead: "You need to make AI a real lever, not a pile of POCs. We start from your processes, prioritize high-impact use cases, and deploy the ones that create value, with security and compliance set from day one.", cardTitle: "Why custom quote", cardBody: "A transformation depends on your starting point, your systems and your priorities. We scope it in an audit, then quote a clear deployment plan, with no hollow package." },
      process: { kicker: "How it works", title: "One program, ", accent: "four stages", after: ".", cards: [{ number: "01", title: "Audit", body: "We map your processes, data and tools to find where AI truly creates value." }, { number: "02", title: "Priority use cases", body: "We rank cases by impact and feasibility, and quote the deployment." }, { number: "03", title: "Deployment", body: "We put agents in production inside your systems, with human validation, traceability and compliance." }, { number: "04", title: "Handover", body: "We train your teams and leads so they operate and evolve the agents without us." }] },
      spec: { kicker: "Frame", title: "A program ", accent: "on custom quote", after: ", scoped by the audit.", rows: [{ label: "Starting point", value: "Audit", note: "use-case mapping" }, { label: "For", value: "Business-line leaders" }, { label: "Deployment", value: "Priority use cases", note: "in production, in stages" }, { label: "Compliance", value: "GDPR, EU AI Act, your data stays with you" }] },
      proofs: { kicker: "Proof", title: "Already ", accent: "in production", after: ".", items: [{ sector: "Logistics company", pain: "Manual intake sorting costing heavy human time.", result: "processing time on the scoped workflow.", resultAccent: "-40%" }, { sector: "Leadership & steering", pain: "Market signals scattered, never consolidated.", result: "monitoring and prioritization automated, surfaced weekly.", resultAccent: "Always on" }, { sector: "Cross-department", pain: "AI use cases identified but never shipped.", result: "staged deployment, measured on your data.", resultAccent: "In production" }] },
      cta: { title: "We scope your transformation with ", accent: "one audit", after: ".", fine: "A first exchange to understand your priorities, then an audit that leads to a quoted deployment plan. Remote or onsite." },
      footer: "AI Operating Partner. We deploy the transformation, not a report.",
    }),
    transmettre: withCommon("en", {
      meta: { title: "Transmit · Agentic training · Parrit.ai", description: "Training and handover to make your teams autonomous with Claude Code, Codex and MCP servers." },
      hero: { eyebrow: "Offer · Coaching", title: "Coaching. We make you ", accent: "autonomous", after: ".", sub: "We install the stack properly (Claude Code, Codex, MCP, security), deploy a first agent with you, and everyone leaves with a running agent.", chips: ["Claude Code + Codex", "MCP servers", "Qualiopi certification", "Human-in-the-loop"], primary: "Talk coaching", secondary: "See the frame" },
      intro: { kicker: "Three ways", title: "Three ways to make your teams ", accent: "autonomous", after: ".", lead: "From the first agent installed with you to long-term governance. We choose based on your starting point.", cardTitle: "Why coaching", cardBody: "Coaching is the last stage: after auditing and deploying, we give teams the method to operate and evolve their agents without us." },
      process: { kicker: "Formats", title: "We install, we train, ", accent: "we hand over", after: ".", cards: [{ title: "Audit & configuration", body: "Agentic stack installed, security framed, software connected. First agent included." }, { title: "One-day agent / hackathon", body: "One hands-on day: everyone builds their own agent on a real business case." }, { title: "Fractional AI Operator", body: "Maintenance, governance, scaling, EU AI Act compliance, security and budget follow-up." }] },
      deliverables: { kicker: "What everyone leaves with", title: "By the end, everyone has an agent ", accent: "that really runs", after: ".", items: ["An agent running on their own scope, in production.", "The deployment method to build others without us.", "Security and budget guardrails, set and understood.", "Autonomy to spread the practice across the team and organization."] },
      spec: { kicker: "Frame", title: "A ", accent: "simple, legible", after: " frame.", rows: [{ label: "Certification", value: "Qualiopi", note: "certified training provider" }, { label: "For", value: "HR leaders" }, { label: "Format", value: "Hands-on workshops", note: "on your real cases" }, { label: "Stack", value: "Claude Code, Codex, MCP, security" }] },
      proofs: { kicker: "Proof", title: "Teams ", accent: "in control", after: ".", items: [{ sector: "Marketing team", pain: "Content production and reporting scattered across tools.", result: "agents configured on their own workflows.", resultAccent: "Autonomy" }, { sector: "Business leadership", pain: "Need to express use cases without depending on technical teams.", result: "framing and operating method transferred.", resultAccent: "Handover" }, { sector: "AI leads", pain: "Stack to install without weakening security.", result: "guardrails set, usage documented.", resultAccent: "Security" }] },
      cta: { title: "Shall we talk for ", accent: "15 minutes", after: "?", fine: "We look together at a real case from your business, and say plainly whether agentic work changes anything for you. Remote or onsite." },
      footer: "Agentic Operating Partner · paul.larmaraud@parrit.ai",
    }),
  },
  "pt-BR": {
    deployer: withCommon("pt-BR", {
      meta: { title: "Implantar · Sprint agentico · Parrit.ai", description: "Um workflow crítico transformado em agente IA em produção, com escopo e prazo fechados." },
      hero: { eyebrow: "Oferta · Agente IA", title: "Um agente em ", accent: "produção controlada", after: ", com escopo e rastreio.", sub: "Você escolhe um workflow crítico. Nós implantamos em um sprint delimitado. Você sai com um sistema rodando, não uma demonstração.", chips: ["Diagnóstico", "Escopo claro", "Em produção", "Servidores MCP"], primary: "Reservar o sprint", secondary: "Ver o quadro" },
      intro: { kicker: "Para quem", title: "Para equipes que querem uma ", accent: "prova, rápido", after: ".", lead: "Você tem um processo caro em tempo humano e quer vê-lo rodar com agentes antes de abrir um projeto pesado. Pegamos um workflow real, colocamos em produção e medimos o ganho nos seus próprios dados.", cardTitle: "Por que delimitado", cardBody: "Escopo e preço fechados tornam a decisão simples. Você decide rápido, nós entregamos rápido, e a saída é um sistema utilizável pela equipe." },
      deliverables: { kicker: "O que entregamos", title: "Um ", accent: "sistema que roda", after: " dentro do seu ambiente.", items: ["Um workflow crítico selado, escolhido com você.", "Sprint de 14 a 21 dias, calendário fixo.", "Sistema em produção no seu ambiente.", "Demonstração final em casos reais.", "Recomendação de escala quantificada.", "Human-in-the-loop e rastreabilidade ponta a ponta."] },
      spec: { kicker: "Quadro", title: "Um agente, um escopo: ", accent: "claro desde o início", after: ".", rows: [{ label: "Modelo", value: "Um agente, um escopo", note: "adicione conforme a necessidade" }, { label: "Para", value: "TI e times de operações" }, { label: "Duração", value: "conforme escopo", note: "validada após diagnóstico" }, { label: "Conformidade", value: "GDPR, EU AI Act, dados com você" }] },
      proofs: { kicker: "Provas", title: "Já ", accent: "em produção", after: ".", items: [{ sector: "ETI logística", pain: "Triagem e entrada manual de um fluxo recebido.", result: "de tempo de tratamento, entregue em 14 dias.", resultAccent: "-40%" }, { sector: "Scale-up", pain: "Qualificação de contatos lenta demais para o ritmo comercial.", result: "enriquecidos e priorizados pelo agente.", resultAccent: "3 000 contatos" }, { sector: "PME", pain: "Demandas perdidas entre canais e caixas de email.", result: "captura e roteamento automáticos.", resultAccent: "Zero lead perdido" }] },
      cta: { title: "Fechamos o escopo, ", accent: "implantamos", after: ".", fine: "Uma chamada de 30 minutos basta para escolher o workflow, fixar o preço e reservar as datas do sprint." },
      footer: "Operating Partner IA. Implantamos o sistema, não a demonstração.",
    }),
    croissance: withCommon("pt-BR", {
      meta: { title: "Transformação IA · Parrit.ai", description: "Um programa de transformação por IA: auditoria, mapeamento dos casos de uso prioritários e implantação, para comitês executivos e liderança de TI." },
      hero: { eyebrow: "Oferta · Transformação IA", title: "A transformação IA da sua organização, ", accent: "conduzida de ponta a ponta", after: ".", sub: "Auditamos suas operações, mapeamos os casos de uso que importam, implantamos os agentes e tornamos suas equipes autônomas. Um parceiro, não um deck de slides.", chips: ["Auditoria", "Casos de uso prioritários", "Implantação", "Áreas de negócio"], primary: "Falar da sua transformação", secondary: "Ver o quadro" },
      intro: { kicker: "Para quem", title: "Para ", accent: "comitês executivos e líderes de TI", after: " que conduzem a IA.", lead: "Você precisa fazer da IA uma alavanca real, não uma pilha de POCs. Partimos dos seus processos, priorizamos os casos de uso de impacto e implantamos os que criam valor, com segurança e conformidade desde o início.", cardTitle: "Por que sob consulta", cardBody: "Uma transformação depende do seu ponto de partida, dos seus sistemas e das suas prioridades. Enquadramos o escopo em uma auditoria e depois orçamos um plano de implantação claro, sem pacote vazio." },
      process: { kicker: "Como funciona", title: "Um programa, ", accent: "quatro etapas", after: ".", cards: [{ number: "01", title: "Auditoria", body: "Mapeamos processos, dados e ferramentas para achar onde a IA realmente cria valor." }, { number: "02", title: "Casos de uso prioritários", body: "Ordenamos os casos por impacto e viabilidade e orçamos a implantação." }, { number: "03", title: "Implantação", body: "Colocamos agentes em produção nos seus sistemas, com validação humana, rastreabilidade e conformidade." }, { number: "04", title: "Passagem", body: "Formamos suas equipes e referentes para operar e evoluir os agentes sem nós." }] },
      spec: { kicker: "Quadro", title: "Um programa ", accent: "sob consulta", after: ", enquadrado pela auditoria.", rows: [{ label: "Ponto de partida", value: "Auditoria", note: "mapeamento dos casos de uso" }, { label: "Para", value: "Áreas de negócio" }, { label: "Implantação", value: "Casos de uso prioritários", note: "em produção, por etapas" }, { label: "Conformidade", value: "GDPR, EU AI Act, dados com você" }] },
      proofs: { kicker: "Provas", title: "Já ", accent: "em produção", after: ".", items: [{ sector: "ETI logística", pain: "Triagem manual custando muito tempo humano.", result: "de tempo de tratamento no fluxo enquadrado.", resultAccent: "-40%" }, { sector: "Direção & pilotagem", pain: "Sinais de mercado dispersos, nunca consolidados.", result: "monitoramento e priorização automatizados, entregues toda semana.", resultAccent: "Contínuo" }, { sector: "Multi-áreas", pain: "Casos de uso de IA identificados mas nunca colocados em produção.", result: "implantação por etapas, medida nos seus dados.", resultAccent: "Em produção" }] },
      cta: { title: "Enquadramos sua transformação com ", accent: "uma auditoria", after: ".", fine: "Uma primeira conversa para entender suas prioridades e depois uma auditoria que leva a um plano de implantação orçado. Remoto ou presencial." },
      footer: "Operating Partner IA. Implantamos a transformação, não um relatório.",
    }),
    transmettre: withCommon("pt-BR", {
      meta: { title: "Transmitir · Formação agentica · Parrit.ai", description: "Formação e passagem para tornar suas equipes autônomas com Claude Code, Codex e servidores MCP." },
      hero: { eyebrow: "Oferta · Coaching", title: "Coaching. Tornamos você ", accent: "autônomo", after: ".", sub: "Instalamos a stack corretamente (Claude Code, Codex, MCP, segurança), implantamos um primeiro agente com você, e cada pessoa sai com um agente rodando.", chips: ["Claude Code + Codex", "Servidores MCP", "Certificação Qualiopi", "Human-in-the-loop"], primary: "Falar coaching", secondary: "Ver o quadro" },
      intro: { kicker: "Três formas", title: "Três formas de tornar suas equipes ", accent: "autônomas", after: ".", lead: "Do primeiro agente instalado com você até a governança de longo prazo. Escolhemos conforme seu ponto de partida.", cardTitle: "Por que coaching", cardBody: "O coaching é a última etapa: depois de auditar e implantar, damos às equipes o método para operar e evoluir seus agentes sem nós." },
      process: { kicker: "Formatos", title: "Instalamos, formamos, ", accent: "passamos a mão", after: ".", cards: [{ title: "Auditoria & configuração", body: "Stack agentica instalada, segurança enquadrada, softwares conectados. Primeiro agente incluído." }, { title: "Agente em 1 dia / hackathon", body: "Um dia hands-on: cada pessoa constrói seu próprio agente em um caso real de negócio." }, { title: "Fractional AI Operator", body: "Manutenção, governança, escala, conformidade EU AI Act, segurança e orçamento acompanhados." }] },
      deliverables: { kicker: "Com o que cada um sai", title: "No fim, cada pessoa tem um agente ", accent: "que roda de verdade", after: ".", items: ["Um agente rodando no próprio perímetro, em produção.", "O método de implantação para construir outros sem nós.", "Guardrails de segurança e orçamento, definidos e compreendidos.", "Autonomia para espalhar a prática na equipe e na organização."] },
      spec: { kicker: "Quadro", title: "Um quadro ", accent: "simples e legível", after: ".", rows: [{ label: "Certificação", value: "Qualiopi", note: "organismo certificado" }, { label: "Para", value: "RH" }, { label: "Formato", value: "Workshops hands-on", note: "nos seus casos reais" }, { label: "Stack", value: "Claude Code, Codex, MCP, segurança" }] },
      proofs: { kicker: "Provas", title: "Equipes ", accent: "no comando", after: ".", items: [{ sector: "Equipe marketing", pain: "Produção de conteúdo e reporting dispersos.", result: "agentes configurados nos próprios workflows.", resultAccent: "Autonomia" }, { sector: "Direção métier", pain: "Necessidade de expressar casos sem depender de times técnicos.", result: "método de enquadramento e pilotagem transmitido.", resultAccent: "Passagem" }, { sector: "Referentes IA", pain: "Stack a instalar sem fragilizar a segurança.", result: "guardrails definidos, usos documentados.", resultAccent: "Segurança" }] },
      cta: { title: "Conversamos ", accent: "15 minutos", after: "?", fine: "Olhamos juntos um caso real do seu negócio e dizemos com franqueza se o agentico muda algo para você. Remoto ou presencial." },
      footer: "Operating Partner agentico · paul.larmaraud@parrit.ai",
    }),
  },
  "zh-CN": {
    deployer: withCommon("zh-CN", {
      meta: { title: "部署 · 智能体冲刺 · Parrit.ai", description: "把一个关键工作流变成生产中的 AI 智能体，范围、周期和价格都先确定。" },
      hero: { eyebrow: "服务 · AI 智能体", title: "一个智能体在 ", accent: "受控生产中", after: "，有范围、可追踪。", sub: "你选择一个关键工作流。我们用有边界的冲刺部署它。最后你得到的是运行中的系统，不是演示。", chips: ["诊断", "范围清晰", "生产中", "MCP 服务器"], primary: "预约冲刺", secondary: "查看框架" },
      intro: { kicker: "适合谁", title: "适合需要快速获得", accent: "真实证明", after: "的团队。", lead: "你有一个消耗大量人工时间的流程，想在启动大项目之前看到它以智能体方式运行。我们拿一个真实工作流上线，并在你的数据上衡量收益。", cardTitle: "为什么有边界", cardBody: "固定范围和固定价格让决策更容易。你快速决定，我们快速交付，最终产物是团队能用的系统。" },
      deliverables: { kicker: "交付内容", title: "一个", accent: "真正运行的系统", after: "，在你的环境中。", items: ["一个与你一起选定的关键工作流。", "14 到 21 天冲刺，日程固定。", "在你的 IT 环境中进入生产。", "基于真实案例的冲刺结束演示。", "量化的规模化建议。", "Human-in-the-loop 和端到端可追踪。"] },
      spec: { kicker: "框架", title: "一个智能体，一个范围：", accent: "从一开始就清晰", after: "。", rows: [{ label: "模式", value: "一个智能体，一个范围", note: "按需增加" }, { label: "适合", value: "IT 与运营团队" }, { label: "周期", value: "按范围", note: "诊断后确认" }, { label: "合规", value: "GDPR、EU AI Act，数据留在你方" }] },
      proofs: { kicker: "证明", title: "已经", accent: "在生产中", after: "。", items: [{ sector: "物流 ETI", pain: "入站流程的人工分类和录入。", result: "处理时间，14 天交付。", resultAccent: "-40%" }, { sector: "Scale-up", pain: "联系人资格判断跟不上销售节奏。", result: "由智能体丰富并排序。", resultAccent: "3 000 个联系人" }, { sector: "中小企业", pain: "进线需求散落在渠道和邮箱之间。", result: "自动捕获和路由。", resultAccent: "零线索丢失" }] },
      cta: { title: "我们确定范围，", accent: "然后部署", after: "。", fine: "30 分钟通话足以选择工作流、确定价格并锁定冲刺日期。" },
      footer: "AI Operating Partner。我们部署系统，不交付演示。",
    }),
    croissance: withCommon("zh-CN", {
      meta: { title: "AI 转型 · Parrit.ai", description: "一套 AI 转型项目：审计、优先用例梳理与部署，面向管理层和 IT 负责人。" },
      hero: { eyebrow: "服务 · AI 转型", title: "你组织的 AI 转型，", accent: "端到端主导", after: "。", sub: "我们审计你的运营，梳理真正重要的用例，部署智能体，并让团队变得自主。是伙伴，不是幻灯片。", chips: ["审计", "优先用例", "部署", "管理层 & IT"], primary: "聊你的转型", secondary: "查看框架" },
      intro: { kicker: "适合谁", title: "适合", accent: "主导 AI 的管理层和 IT 负责人", after: "。", lead: "你需要让 AI 成为真正的杠杆，而不是一堆 POC。我们从你的流程出发，优先高影响用例，部署真正创造价值的用例，并从第一天起就设定安全与合规。", cardTitle: "为什么按需报价", cardBody: "转型取决于你的起点、系统和优先级。我们在审计中框定范围，再报出一个清晰的部署计划，没有空洞套餐。" },
      process: { kicker: "如何运行", title: "一个项目，", accent: "四个阶段", after: "。", cards: [{ number: "01", title: "审计", body: "梳理你的流程、数据和工具，找到 AI 真正创造价值的地方。" }, { number: "02", title: "优先用例", body: "按影响和可行性排序，并对部署报价。" }, { number: "03", title: "部署", body: "在你的系统中把智能体投入生产，配合人工验证、可追踪和合规。" }, { number: "04", title: "交接", body: "培训你的团队和负责人，让他们不依赖我们也能运营和演进智能体。" }] },
      spec: { kicker: "框架", title: "一个", accent: "按需报价", after: "的项目，由审计框定。", rows: [{ label: "起点", value: "审计", note: "用例梳理" }, { label: "适合", value: "业务部门" }, { label: "部署", value: "优先用例", note: "分阶段投入生产" }, { label: "合规", value: "GDPR、EU AI Act，数据留在你方" }] },
      proofs: { kicker: "证明", title: "已经", accent: "在生产中", after: "。", items: [{ sector: "物流 ETI", pain: "人工分类耗费大量人力时间。", result: "受控工作流的处理时间。", resultAccent: "-40%" }, { sector: "管理与决策", pain: "市场信号分散，从未整合。", result: "监测与优先级自动化，每周汇总。", resultAccent: "持续运行" }, { sector: "跨部门", pain: "识别了 AI 用例但从未上线。", result: "分阶段部署，在你的数据上衡量。", resultAccent: "在生产中" }] },
      cta: { title: "我们用", accent: "一次审计", after: "框定你的转型。", fine: "先一次交流了解你的优先级，再做一次审计，产出一个带报价的部署计划。远程或现场。" },
      footer: "AI Operating Partner。我们部署转型，不是报告。",
    }),
    transmettre: withCommon("zh-CN", {
      meta: { title: "传递 · 智能体培训 · Parrit.ai", description: "培训和交接，让团队能自主使用 Claude Code、Codex 和 MCP 服务器。" },
      hero: { eyebrow: "服务 · 辅导", title: "辅导。我们让你变得", accent: "自主", after: "。", sub: "我们正确安装 stack（Claude Code、Codex、MCP、安全），和你一起部署第一个智能体，每个人离开时都有一个运行中的智能体。", chips: ["Claude Code + Codex", "MCP 服务器", "Qualiopi 认证", "Human-in-the-loop"], primary: "聊辅导", secondary: "查看框架" },
      intro: { kicker: "三种方式", title: "三种方式让团队", accent: "自主", after: "。", lead: "从与你一起安装第一个智能体，到长期治理。我们根据你的起点选择方式。", cardTitle: "为什么辅导", cardBody: "辅导是最后一步：审计和部署之后，我们把方法交给团队，让他们不依赖我们也能运营和演进智能体。" },
      process: { kicker: "形式", title: "我们安装、培训，", accent: "然后交接", after: "。", cards: [{ title: "审计与配置", body: "智能体 stack 安装完成，安全框架明确，软件连接。包含第一个智能体。" }, { title: "一日智能体 / hackathon", body: "一天 hands-on：每个人基于真实业务案例构建自己的智能体。" }, { title: "Fractional AI Operator", body: "维护、治理、规模化、EU AI Act 合规、安全和预算跟踪。" }] },
      deliverables: { kicker: "每个人带走什么", title: "结束时，每个人都有一个", accent: "真正运行的智能体", after: "。", items: ["在自己范围内运行、进入生产的智能体。", "可以不依赖我们继续构建的部署方法。", "已经设定并理解的安全和预算护栏。", "把方法扩散到团队和组织其他部分的自主能力。"] },
      spec: { kicker: "框架", title: "一个", accent: "简单清晰", after: "的框架。", rows: [{ label: "认证", value: "Qualiopi", note: "已认证培训机构" }, { label: "适合", value: "HR" }, { label: "形式", value: "Hands-on 工作坊", note: "基于你的真实案例" }, { label: "Stack", value: "Claude Code、Codex、MCP、安全" }] },
      proofs: { kicker: "证明", title: "团队", accent: "掌握主动权", after: "。", items: [{ sector: "市场团队", pain: "内容生产和报告分散在多个工具中。", result: "在自己的工作流上配置智能体。", resultAccent: "自主" }, { sector: "业务管理层", pain: "需要表达用例，而不依赖技术团队。", result: "用例框定和操作方法已传递。", resultAccent: "交接" }, { sector: "AI 负责人", pain: "安装 stack 但不能削弱安全。", result: "护栏已设置，用法已记录。", resultAccent: "安全" }] },
      cta: { title: "我们聊 ", accent: "15 分钟", after: "？", fine: "一起看你业务中的真实案例，并坦率判断智能体工作方式是否对你有改变。远程或现场。" },
      footer: "Agentic Operating Partner · paul.larmaraud@parrit.ai",
    }),
  },
};

export const getOfferCopy = (lang: Locale, offer: OfferKind) => OFFER_COPY[lang][offer];
