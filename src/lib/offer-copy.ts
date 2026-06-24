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
    { href: "deployer", label: "Déployer" },
    { href: "croissance", label: "Croissance" },
    { href: "transmettre", label: "Transmettre" },
  ],
  en: [
    { href: "deployer", label: "Deploy" },
    { href: "croissance", label: "Growth" },
    { href: "transmettre", label: "Transmit" },
  ],
  "pt-BR": [
    { href: "deployer", label: "Implantar" },
    { href: "croissance", label: "Crescimento" },
    { href: "transmettre", label: "Transmitir" },
  ],
  "zh-CN": [
    { href: "deployer", label: "部署" },
    { href: "croissance", label: "增长" },
    { href: "transmettre", label: "传递" },
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
        eyebrow: "Offre · Déployer",
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
        cardBody: "Un périmètre et un prix fermés, c'est un engagement signable sans friction. Vous décidez vite, on livre vite, et la sortie est un système utilisable par vos équipes.",
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
        title: "Périmètre, durée, prix : ",
        accent: "fermés à la signature",
        after: ".",
        rows: [
          { label: "Durée", value: "selon périmètre", note: "validée après diagnostic" },
          { label: "Front", value: "OS Opérations ou OS Croissance" },
          { label: "Sprint à impact", value: "à partir de 1 197 €", note: "format phare" },
          { label: "Déploiement d'agents IA", value: "à partir de 2 994 €" },
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
        fine: "Un appel de 30 minutes suffit à choisir le workflow, fixer le prix et bloquer les dates du sprint.",
      },
      footer: "Operating Partner IA. On déploie le système, pas la démo.",
    }),
    croissance: withCommon("fr", {
      meta: {
        title: "Croissance · OS Croissance · Parrit.ai",
        description: "Une machine d'acquisition par signaux pour générer des rendez-vous qualifiés.",
      },
      hero: {
        eyebrow: "Offre · OS Croissance",
        title: "On vous génère le ",
        accent: "business que vous n'alliez pas chercher",
        after: ".",
        sub: "On repère les bonnes entreprises au bon moment, on déclenche une prise de contact ultra-personnalisée, on vous amène des rendez-vous qualifiés.",
        chips: ["Signaux d'intention", "Multi-canal", "Relais humain", "GEO"],
        primary: "Voir la machine",
        secondary: "Voir le cadre",
      },
      intro: {
        kicker: "Pour qui",
        title: "Pour les équipes qui veulent ouvrir un ",
        accent: "nouveau front commercial",
        after: ".",
        lead: "Votre marché bouge dans des podcasts, des événements, des annonces de recrutement et des prises de parole. On transforme ces signaux en séquences utiles et suivies.",
        cardTitle: "Pourquoi agentique",
        cardBody: "L'agent fait la veille, qualifie, prépare la prise de contact et tient la cadence. L'humain reprend au bon moment : quand il y a une réponse ou un signal fort.",
      },
      process: {
        kicker: "Comment ça marche",
        title: "Une machine, ",
        accent: "cinq étapes",
        after: ".",
        cards: [
          { number: "01", title: "Détection des signaux", body: "On écoute podcasts, événements et posts pour repérer les entreprises qui bougent." },
          { number: "02", title: "Qualification ICP", body: "On filtre sur votre profil de client idéal : secteur, taille, fonction décideur." },
          { number: "03", title: "Copywriting personnalisé", body: "Chaque message s'appuie sur un fait récent et précis, avec une raison concrète de vous lire." },
          { number: "04", title: "Envoi multi-canal", body: "Mail et LinkedIn, cadencés et suivis, sans saturer vos cibles." },
          { number: "05", title: "Relais humain", body: "Dès qu'un prospect répond, un humain qualifie. Vous récupérez un rendez-vous prêt à closer." },
        ],
      },
      spec: {
        kicker: "Le cadre",
        title: "Un ",
        accent: "modèle clair",
        after: ", sans surprise.",
        rows: [
          { label: "Modèle", value: "Déploiement puis run fixe", note: "pas de commission" },
          { label: "Déploiement", value: "à partir de 2 994 €", note: "cadrage ICP, signaux, séquences" },
          { label: "Run", value: "Accompagnement · Operating Partner", note: "à partir de 247 €/h" },
          { label: "Signaux", value: "podcasts, événements, LinkedIn" },
          { label: "Bonus", value: "visibilité générative (GEO)", note: "être cité par les moteurs de réponse" },
        ],
      },
      proofs: {
        kicker: "Preuves",
        title: "Des ",
        accent: "pipelines en production",
        after: ".",
        items: [
          { sector: "Scale-up · B2B", pain: "Une équipe commerciale qui ne tenait pas la cadence de prospection.", result: "contacts qualifiés en 60 jours, séquences personnalisées et suivies.", resultAccent: "3 000" },
          { sector: "Courtier énergie", pain: "Cibler les décideurs énergie d'un parc d'hôtels et d'entreprises.", result: "machine d'acquisition par signaux en production.", resultAccent: "Production" },
          { sector: "Pipeline par signaux", pain: "Du business qui dort dans les podcasts, les events et les posts.", result: "détection quotidienne, qualification ICP et envoi multi-canal.", resultAccent: "Continu" },
        ],
      },
      cta: {
        title: "On vous montre la machine sur ",
        accent: "votre marché",
        after: ".",
        fine: "Un appel de 20 minutes : on regarde vos cibles, vos signaux disponibles, et ce qu'on peut déclencher dès le premier mois.",
      },
      footer: "Operating Partner IA. On opère vos deux fronts critiques : back-office et business.",
    }),
    transmettre: withCommon("fr", {
      meta: {
        title: "Transmettre · Formation agentique · Parrit.ai",
        description: "Formation et passation pour rendre vos équipes autonomes avec Claude Code, Codex et les serveurs MCP.",
      },
      hero: {
        eyebrow: "Offre · Transmettre",
        title: "Transmettre. On vous rend ",
        accent: "autonome",
        after: ".",
        sub: "On installe proprement la stack (Claude Code, Codex, MCP, sécurité), on déploie un premier agent avec vous, et chacun repart avec un agent qui tourne.",
        chips: ["Claude Code + Codex", "Serveurs MCP", "Qualiopi", "Human-in-the-loop"],
        primary: "Parler formation",
        secondary: "Voir le cadre",
      },
      intro: {
        kicker: "Trois façons",
        title: "Trois façons de ",
        accent: "rendre vos équipes autonomes",
        after: ".",
        lead: "Du premier agent installé avec vous jusqu'à la gouvernance dans la durée. On choisit selon votre point de départ.",
        cardTitle: "Nom canon",
        cardBody: "Transmettre, c'est la troisième étape du funnel : après avoir audité et déployé, on donne aux équipes la méthode pour piloter et faire évoluer leurs agents.",
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
          { label: "Formation agentique", value: "à partir de 3 497 €", note: "non-tech, finançable OPCO" },
          { label: "Format", value: "Ateliers hands-on", note: "sur vos cas réels" },
          { label: "Stack", value: "Claude Code, Codex, MCP, sécurité" },
          { label: "Accompagnement", value: "à partir de 247 €/h", note: "Operating Partner" },
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
      hero: { eyebrow: "Offer · Deploy", title: "An agent in ", accent: "controlled production", after: ", with scope and trace.", sub: "You choose one critical workflow. We deploy it in a bounded sprint. You leave with a running system, not a demo.", chips: ["Diagnostic", "Clear scope", "In production", "MCP servers"], primary: "Book the sprint", secondary: "See the frame" },
      intro: { kicker: "Who it is for", title: "For teams that need ", accent: "proof, fast", after: ".", lead: "You have a process that costs too much human time and want to see it run agentically before launching a heavier program. We take a real workflow, put it in production, and measure the gain on your own data.", cardTitle: "Why bounded", cardBody: "A fixed scope and fixed price make the decision easy. You decide fast, we ship fast, and the output is a system your teams can actually use." },
      deliverables: { kicker: "What we deliver", title: "A ", accent: "running system", after: " inside your stack.", items: ["One sealed critical workflow, chosen with you.", "Bounded scope, calendar validated after diagnosis.", "Production system inside your IT environment.", "End-of-sprint demo on real cases.", "Quantified scaling recommendation.", "Human-in-the-loop and end-to-end traceability."] },
      spec: { kicker: "Frame", title: "Scope, timing, price: ", accent: "defined before build", after: ".", rows: [{ label: "Duration", value: "based on scope", note: "validated after diagnosis" }, { label: "Front", value: "Operations OS or Growth OS" }, { label: "Impact sprint", value: "from €1,197", note: "flagship format" }, { label: "AI agent deployment", value: "from €2,994" }, { label: "Compliance", value: "GDPR, EU AI Act, your data stays with you" }] },
      proofs: { kicker: "Proof", title: "Already ", accent: "in production", after: ".", items: [{ sector: "Logistics company", pain: "Manual intake sorting and data entry.", result: "processing time on the scoped workflow.", resultAccent: "-40%" }, { sector: "Scale-up", pain: "Contact qualification too slow for the sales pace.", result: "enriched and prioritized by the agent.", resultAccent: "3,000 contacts" }, { sector: "SMB", pain: "Inbound requests lost between channels and inboxes.", result: "automatic capture and routing.", resultAccent: "Zero lost leads" }] },
      cta: { title: "We seal the scope, ", accent: "then deploy", after: ".", fine: "A 30-minute call is enough to choose the workflow, set the price and lock sprint dates." },
      footer: "AI Operating Partner. We deploy the system, not the demo.",
    }),
    croissance: withCommon("en", {
      meta: { title: "Growth · Growth OS · Parrit.ai", description: "A signal-led acquisition machine to generate qualified meetings." },
      hero: { eyebrow: "Offer · Growth OS", title: "We generate the ", accent: "business you were not going after", after: ".", sub: "We detect the right companies at the right moment, trigger ultra-personalized outreach, and bring you qualified meetings.", chips: ["Intent signals", "Multi-channel", "Human handoff", "GEO"], primary: "See the machine", secondary: "See the frame" },
      intro: { kicker: "Who it is for", title: "For teams opening a ", accent: "new commercial front", after: ".", lead: "Your market moves through podcasts, events, hiring news and executive posts. We turn those signals into useful, tracked sequences.", cardTitle: "Why agentic", cardBody: "The agent monitors, qualifies, prepares outreach and keeps the cadence. A human steps in at the right time: when there is a reply or a strong signal." },
      process: { kicker: "How it works", title: "One machine, ", accent: "five steps", after: ".", cards: [{ number: "01", title: "Signal detection", body: "We monitor podcasts, events and posts to spot companies that are moving." }, { number: "02", title: "ICP qualification", body: "We filter by ideal customer profile: sector, size, decision-maker role." }, { number: "03", title: "Personalized copywriting", body: "Every message uses a recent, precise fact and a concrete reason to read you." }, { number: "04", title: "Multi-channel sending", body: "Email and LinkedIn, sequenced and tracked without saturating targets." }, { number: "05", title: "Human handoff", body: "When a prospect replies, a human qualifies. You get a meeting ready to close." }] },
      spec: { kicker: "Frame", title: "A ", accent: "clear model", after: ", no surprises.", rows: [{ label: "Model", value: "Deployment then fixed run", note: "no commission" }, { label: "Deployment", value: "from €2,994", note: "ICP, signals, sequences" }, { label: "Run", value: "Support · Operating Partner", note: "from €247/h" }, { label: "Signals", value: "podcasts, events, LinkedIn" }, { label: "Bonus", value: "Generative visibility (GEO)", note: "being cited by answer engines" }] },
      proofs: { kicker: "Proof", title: "Pipelines ", accent: "in production", after: ".", items: [{ sector: "B2B scale-up", pain: "A sales team that could not keep prospecting cadence.", result: "qualified contacts in 60 days, personalized and tracked sequences.", resultAccent: "3,000" }, { sector: "Energy broker", pain: "Targeting energy decision-makers across hotels and companies.", result: "signal-led acquisition machine in production.", resultAccent: "Production" }, { sector: "Signal pipeline", pain: "Business sleeping in podcasts, events and posts.", result: "daily detection, ICP qualification and multi-channel sending.", resultAccent: "Always on" }] },
      cta: { title: "We show the machine on ", accent: "your market", after: ".", fine: "A 20-minute call: we look at your targets, available signals and what can be triggered in month one." },
      footer: "AI Operating Partner. We operate your two critical fronts: back-office and business.",
    }),
    transmettre: withCommon("en", {
      meta: { title: "Transmit · Agentic training · Parrit.ai", description: "Training and handover to make your teams autonomous with Claude Code, Codex and MCP servers." },
      hero: { eyebrow: "Offer · Transmit", title: "Transmit. We make you ", accent: "autonomous", after: ".", sub: "We install the stack properly (Claude Code, Codex, MCP, security), deploy a first agent with you, and everyone leaves with a running agent.", chips: ["Claude Code + Codex", "MCP servers", "Qualiopi", "Human-in-the-loop"], primary: "Talk training", secondary: "See the frame" },
      intro: { kicker: "Three ways", title: "Three ways to make your teams ", accent: "autonomous", after: ".", lead: "From the first agent installed with you to long-term governance. We choose based on your starting point.", cardTitle: "Canonical name", cardBody: "Transmit is the third stage of the funnel: after auditing and deploying, we give teams the method to operate and evolve their agents." },
      process: { kicker: "Formats", title: "We install, we train, ", accent: "we hand over", after: ".", cards: [{ title: "Audit & configuration", body: "Agentic stack installed, security framed, software connected. First agent included." }, { title: "One-day agent / hackathon", body: "One hands-on day: everyone builds their own agent on a real business case." }, { title: "Fractional AI Operator", body: "Maintenance, governance, scaling, EU AI Act compliance, security and budget follow-up." }] },
      deliverables: { kicker: "What everyone leaves with", title: "By the end, everyone has an agent ", accent: "that really runs", after: ".", items: ["An agent running on their own scope, in production.", "The deployment method to build others without us.", "Security and budget guardrails, set and understood.", "Autonomy to spread the practice across the team and organization."] },
      spec: { kicker: "Frame", title: "A ", accent: "simple, legible", after: " frame.", rows: [{ label: "Agentic training", value: "from €3,497", note: "non-tech, OPCO-financeable" }, { label: "Format", value: "Hands-on workshops", note: "on your real cases" }, { label: "Stack", value: "Claude Code, Codex, MCP, security" }, { label: "Support", value: "from €247/h", note: "Operating Partner" }] },
      proofs: { kicker: "Proof", title: "Teams ", accent: "in control", after: ".", items: [{ sector: "Marketing team", pain: "Content production and reporting scattered across tools.", result: "agents configured on their own workflows.", resultAccent: "Autonomy" }, { sector: "Business leadership", pain: "Need to express use cases without depending on technical teams.", result: "framing and operating method transferred.", resultAccent: "Handover" }, { sector: "AI leads", pain: "Stack to install without weakening security.", result: "guardrails set, usage documented.", resultAccent: "Security" }] },
      cta: { title: "Shall we talk for ", accent: "15 minutes", after: "?", fine: "We look together at a real case from your business, and say plainly whether agentic work changes anything for you. Remote or onsite." },
      footer: "Agentic Operating Partner · paul.larmaraud@parrit.ai",
    }),
  },
  "pt-BR": {
    deployer: withCommon("pt-BR", {
      meta: { title: "Implantar · Sprint agentico · Parrit.ai", description: "Um workflow crítico transformado em agente IA em produção, com escopo, prazo e preço fechados." },
      hero: { eyebrow: "Oferta · Implantar", title: "Um agente em ", accent: "produção em 14 dias", after: ", com escopo e preço fechados.", sub: "Você escolhe um workflow crítico. Nós implantamos em um sprint delimitado. Você sai com um sistema rodando, não uma demonstração.", chips: ["14 dias", "Preço fixo", "Em produção", "Servidores MCP"], primary: "Reservar o sprint", secondary: "Ver o quadro" },
      intro: { kicker: "Para quem", title: "Para equipes que querem uma ", accent: "prova, rápido", after: ".", lead: "Você tem um processo caro em tempo humano e quer vê-lo rodar com agentes antes de abrir um projeto pesado. Pegamos um workflow real, colocamos em produção e medimos o ganho nos seus próprios dados.", cardTitle: "Por que delimitado", cardBody: "Escopo e preço fechados tornam a decisão simples. Você decide rápido, nós entregamos rápido, e a saída é um sistema utilizável pela equipe." },
      deliverables: { kicker: "O que entregamos", title: "Um ", accent: "sistema que roda", after: " dentro do seu ambiente.", items: ["Um workflow crítico selado, escolhido com você.", "Sprint de 14 a 21 dias, calendário fixo.", "Sistema em produção no seu ambiente.", "Demonstração final em casos reais.", "Recomendação de escala quantificada.", "Human-in-the-loop e rastreabilidade ponta a ponta."] },
      spec: { kicker: "Quadro", title: "Escopo, duração, preço: ", accent: "fechados na assinatura", after: ".", rows: [{ label: "Duração", value: "14 a 21 dias", note: "calendário fixo" }, { label: "Frente", value: "OS Operações ou OS Crescimento" }, { label: "Sprint de impacto", value: "a partir de 1 197 €", note: "formato principal" }, { label: "Deploy de agentes IA", value: "a partir de 2 994 €" }, { label: "Conformidade", value: "GDPR, EU AI Act, dados com você" }] },
      proofs: { kicker: "Provas", title: "Já ", accent: "em produção", after: ".", items: [{ sector: "ETI logística", pain: "Triagem e entrada manual de um fluxo recebido.", result: "de tempo de tratamento, entregue em 14 dias.", resultAccent: "-40%" }, { sector: "Scale-up", pain: "Qualificação de contatos lenta demais para o ritmo comercial.", result: "enriquecidos e priorizados pelo agente.", resultAccent: "3 000 contatos" }, { sector: "PME", pain: "Demandas perdidas entre canais e caixas de email.", result: "captura e roteamento automáticos.", resultAccent: "Zero lead perdido" }] },
      cta: { title: "Fechamos o escopo, ", accent: "implantamos", after: ".", fine: "Uma chamada de 30 minutos basta para escolher o workflow, fixar o preço e reservar as datas do sprint." },
      footer: "Operating Partner IA. Implantamos o sistema, não a demonstração.",
    }),
    croissance: withCommon("pt-BR", {
      meta: { title: "Crescimento · OS Crescimento · Parrit.ai", description: "Uma máquina de aquisição por sinais para gerar reuniões qualificadas." },
      hero: { eyebrow: "Oferta · OS Crescimento", title: "Geramos o ", accent: "business que você não iria buscar", after: ".", sub: "Identificamos as empresas certas no momento certo, acionamos contato ultra-personalizado e trazemos reuniões qualificadas.", chips: ["Sinais de intenção", "Multi-canal", "Relé humano", "GEO"], primary: "Ver a máquina", secondary: "Ver o quadro" },
      intro: { kicker: "Para quem", title: "Para equipes abrindo uma ", accent: "nova frente comercial", after: ".", lead: "Seu mercado se move em podcasts, eventos, anúncios de contratação e posts de executivos. Transformamos esses sinais em sequências úteis e acompanhadas.", cardTitle: "Por que agentico", cardBody: "O agente monitora, qualifica, prepara o contato e mantém a cadência. O humano entra no momento certo: quando há resposta ou sinal forte." },
      process: { kicker: "Como funciona", title: "Uma máquina, ", accent: "cinco etapas", after: ".", cards: [{ number: "01", title: "Detecção de sinais", body: "Monitoramos podcasts, eventos e posts para identificar empresas em movimento." }, { number: "02", title: "Qualificação ICP", body: "Filtramos pelo seu cliente ideal: setor, porte, função decisora." }, { number: "03", title: "Copy personalizada", body: "Cada mensagem usa um fato recente e preciso, com uma razão concreta para ler você." }, { number: "04", title: "Envio multi-canal", body: "Email e LinkedIn, cadenciados e acompanhados sem saturar." }, { number: "05", title: "Relé humano", body: "Quando o prospect responde, um humano qualifica. Você recebe uma reunião pronta para fechar." }] },
      spec: { kicker: "Quadro", title: "Um ", accent: "modelo claro", after: ", sem surpresa.", rows: [{ label: "Modelo", value: "Deploy depois run fixo", note: "sem comissão" }, { label: "Deploy", value: "a partir de 2 994 €", note: "ICP, sinais, sequências" }, { label: "Run", value: "Acompanhamento · Operating Partner", note: "a partir de 247 €/h" }, { label: "Sinais", value: "podcasts, eventos, LinkedIn" }, { label: "Bônus", value: "Visibilidade generativa (GEO)", note: "ser citado por motores de resposta" }] },
      proofs: { kicker: "Provas", title: "Pipelines ", accent: "em produção", after: ".", items: [{ sector: "Scale-up · B2B", pain: "Equipe comercial sem cadência suficiente de prospecção.", result: "contatos qualificados em 60 dias, sequências personalizadas e acompanhadas.", resultAccent: "3 000" }, { sector: "Corretor energia", pain: "Mirar decisores energia em hotéis e empresas.", result: "máquina de aquisição por sinais em produção.", resultAccent: "Produção" }, { sector: "Pipeline por sinais", pain: "Business adormecido em podcasts, eventos e posts.", result: "detecção diária, qualificação ICP e envio multi-canal.", resultAccent: "Contínuo" }] },
      cta: { title: "Mostramos a máquina no ", accent: "seu mercado", after: ".", fine: "Uma chamada de 20 minutos: olhamos seus alvos, sinais disponíveis e o que dá para ativar no primeiro mês." },
      footer: "Operating Partner IA. Operamos suas duas frentes críticas: back-office e business.",
    }),
    transmettre: withCommon("pt-BR", {
      meta: { title: "Transmitir · Formação agentica · Parrit.ai", description: "Formação e passagem para tornar suas equipes autônomas com Claude Code, Codex e servidores MCP." },
      hero: { eyebrow: "Oferta · Transmitir", title: "Transmitir. Tornamos você ", accent: "autônomo", after: ".", sub: "Instalamos a stack corretamente (Claude Code, Codex, MCP, segurança), implantamos um primeiro agente com você, e cada pessoa sai com um agente rodando.", chips: ["Claude Code + Codex", "Servidores MCP", "Qualiopi", "Human-in-the-loop"], primary: "Falar formação", secondary: "Ver o quadro" },
      intro: { kicker: "Três formas", title: "Três formas de tornar suas equipes ", accent: "autônomas", after: ".", lead: "Do primeiro agente instalado com você até a governança de longo prazo. Escolhemos conforme seu ponto de partida.", cardTitle: "Nome canônico", cardBody: "Transmitir é a terceira etapa do funil: depois de auditar e implantar, damos às equipes o método para operar e evoluir seus agentes." },
      process: { kicker: "Formatos", title: "Instalamos, formamos, ", accent: "passamos a mão", after: ".", cards: [{ title: "Auditoria & configuração", body: "Stack agentica instalada, segurança enquadrada, softwares conectados. Primeiro agente incluído." }, { title: "Agente em 1 dia / hackathon", body: "Um dia hands-on: cada pessoa constrói seu próprio agente em um caso real de negócio." }, { title: "Fractional AI Operator", body: "Manutenção, governança, escala, conformidade EU AI Act, segurança e orçamento acompanhados." }] },
      deliverables: { kicker: "Com o que cada um sai", title: "No fim, cada pessoa tem um agente ", accent: "que roda de verdade", after: ".", items: ["Um agente rodando no próprio perímetro, em produção.", "O método de implantação para construir outros sem nós.", "Guardrails de segurança e orçamento, definidos e compreendidos.", "Autonomia para espalhar a prática na equipe e na organização."] },
      spec: { kicker: "Quadro", title: "Um quadro ", accent: "simples e legível", after: ".", rows: [{ label: "Formação agentica", value: "a partir de 3 497 €", note: "não técnica, financiável OPCO" }, { label: "Formato", value: "Workshops hands-on", note: "nos seus casos reais" }, { label: "Stack", value: "Claude Code, Codex, MCP, segurança" }, { label: "Acompanhamento", value: "a partir de 247 €/h", note: "Operating Partner" }] },
      proofs: { kicker: "Provas", title: "Equipes ", accent: "no comando", after: ".", items: [{ sector: "Equipe marketing", pain: "Produção de conteúdo e reporting dispersos.", result: "agentes configurados nos próprios workflows.", resultAccent: "Autonomia" }, { sector: "Direção métier", pain: "Necessidade de expressar casos sem depender de times técnicos.", result: "método de enquadramento e pilotagem transmitido.", resultAccent: "Passagem" }, { sector: "Referentes IA", pain: "Stack a instalar sem fragilizar a segurança.", result: "guardrails definidos, usos documentados.", resultAccent: "Segurança" }] },
      cta: { title: "Conversamos ", accent: "15 minutos", after: "?", fine: "Olhamos juntos um caso real do seu negócio e dizemos com franqueza se o agentico muda algo para você. Remoto ou presencial." },
      footer: "Operating Partner agentico · paul.larmaraud@parrit.ai",
    }),
  },
  "zh-CN": {
    deployer: withCommon("zh-CN", {
      meta: { title: "部署 · 智能体冲刺 · Parrit.ai", description: "把一个关键工作流变成生产中的 AI 智能体，范围、周期和价格都先确定。" },
      hero: { eyebrow: "服务 · 部署", title: "一个智能体在 ", accent: "14 天内进入生产", after: "，范围和价格固定。", sub: "你选择一个关键工作流。我们用有边界的冲刺部署它。最后你得到的是运行中的系统，不是演示。", chips: ["14 天", "固定价格", "生产中", "MCP 服务器"], primary: "预约冲刺", secondary: "查看框架" },
      intro: { kicker: "适合谁", title: "适合需要快速获得", accent: "真实证明", after: "的团队。", lead: "你有一个消耗大量人工时间的流程，想在启动大项目之前看到它以智能体方式运行。我们拿一个真实工作流上线，并在你的数据上衡量收益。", cardTitle: "为什么有边界", cardBody: "固定范围和固定价格让决策更容易。你快速决定，我们快速交付，最终产物是团队能用的系统。" },
      deliverables: { kicker: "交付内容", title: "一个", accent: "真正运行的系统", after: "，在你的环境中。", items: ["一个与你一起选定的关键工作流。", "14 到 21 天冲刺，日程固定。", "在你的 IT 环境中进入生产。", "基于真实案例的冲刺结束演示。", "量化的规模化建议。", "Human-in-the-loop 和端到端可追踪。"] },
      spec: { kicker: "框架", title: "范围、周期、价格：", accent: "签约时确定", after: "。", rows: [{ label: "周期", value: "14 到 21 天", note: "固定日程" }, { label: "战线", value: "运营 OS 或增长 OS" }, { label: "Impact sprint", value: "起价 1 197 €", note: "旗舰格式" }, { label: "AI 智能体部署", value: "起价 2 994 €" }, { label: "合规", value: "GDPR、EU AI Act，数据留在你方" }] },
      proofs: { kicker: "证明", title: "已经", accent: "在生产中", after: "。", items: [{ sector: "物流 ETI", pain: "入站流程的人工分类和录入。", result: "处理时间，14 天交付。", resultAccent: "-40%" }, { sector: "Scale-up", pain: "联系人资格判断跟不上销售节奏。", result: "由智能体丰富并排序。", resultAccent: "3 000 个联系人" }, { sector: "中小企业", pain: "进线需求散落在渠道和邮箱之间。", result: "自动捕获和路由。", resultAccent: "零线索丢失" }] },
      cta: { title: "我们确定范围，", accent: "然后部署", after: "。", fine: "30 分钟通话足以选择工作流、确定价格并锁定冲刺日期。" },
      footer: "AI Operating Partner。我们部署系统，不交付演示。",
    }),
    croissance: withCommon("zh-CN", {
      meta: { title: "增长 · 增长 OS · Parrit.ai", description: "基于信号的获客机器，用来产生合格会议。" },
      hero: { eyebrow: "服务 · 增长 OS", title: "我们为你生成那些", accent: "原本不会主动寻找的业务", after: "。", sub: "我们在正确时刻识别正确公司，触发高度个性化触达，并带来合格会议。", chips: ["意图信号", "多渠道", "人工接手", "GEO"], primary: "查看机器", secondary: "查看框架" },
      intro: { kicker: "适合谁", title: "适合正在打开", accent: "新商业战线", after: "的团队。", lead: "你的市场在播客、活动、招聘动态和高管发声中移动。我们把这些信号变成有用且可追踪的触达序列。", cardTitle: "为什么用智能体", cardBody: "智能体负责监测、筛选、准备触达并保持节奏。人在正确时刻接手：当出现回复或强信号。" },
      process: { kicker: "如何运行", title: "一台机器，", accent: "五个步骤", after: "。", cards: [{ number: "01", title: "信号检测", body: "监测播客、活动和帖子，发现正在变化的公司。" }, { number: "02", title: "ICP 筛选", body: "按理想客户画像过滤：行业、规模、决策岗位。" }, { number: "03", title: "个性化文案", body: "每条消息基于近期且具体的事实，给出阅读理由。" }, { number: "04", title: "多渠道发送", body: "邮件和 LinkedIn，有节奏、有跟踪，不轰炸目标。" }, { number: "05", title: "人工接手", body: "潜在客户回复后由人工判断。你获得可以推进的会议。" }] },
      spec: { kicker: "框架", title: "一个", accent: "清晰模型", after: "，没有意外。", rows: [{ label: "模式", value: "部署后固定 run", note: "不抽佣" }, { label: "部署", value: "起价 2 994 €", note: "ICP、信号、序列" }, { label: "Run", value: "Accompagnement · Operating Partner", note: "起价 247 €/h" }, { label: "信号", value: "播客、活动、LinkedIn" }, { label: "加分项", value: "生成式可见性 (GEO)", note: "被答案引擎引用" }] },
      proofs: { kicker: "证明", title: "Pipeline ", accent: "已经生产运行", after: "。", items: [{ sector: "B2B scale-up", pain: "销售团队无法保持开发节奏。", result: "60 天内的合格联系人，个性化且可追踪序列。", resultAccent: "3 000" }, { sector: "能源经纪", pain: "定位酒店和企业中的能源决策者。", result: "基于信号的获客机器已上线。", resultAccent: "生产中" }, { sector: "信号 pipeline", pain: "业务机会沉睡在播客、活动和帖子中。", result: "每日检测、ICP 筛选和多渠道发送。", resultAccent: "持续运行" }] },
      cta: { title: "我们在", accent: "你的市场", after: "上展示这台机器。", fine: "20 分钟通话：一起看你的目标、可用信号，以及第一个月能启动什么。" },
      footer: "AI Operating Partner。我们运营你的两条关键战线：后台和业务。",
    }),
    transmettre: withCommon("zh-CN", {
      meta: { title: "传递 · 智能体培训 · Parrit.ai", description: "培训和交接，让团队能自主使用 Claude Code、Codex 和 MCP 服务器。" },
      hero: { eyebrow: "服务 · 传递", title: "传递。我们让你变得", accent: "自主", after: "。", sub: "我们正确安装 stack（Claude Code、Codex、MCP、安全），和你一起部署第一个智能体，每个人离开时都有一个运行中的智能体。", chips: ["Claude Code + Codex", "MCP 服务器", "Qualiopi", "Human-in-the-loop"], primary: "聊培训", secondary: "查看框架" },
      intro: { kicker: "三种方式", title: "三种方式让团队", accent: "自主", after: "。", lead: "从与你一起安装第一个智能体，到长期治理。我们根据你的起点选择方式。", cardTitle: "规范名称", cardBody: "传递是漏斗的第三步：审计和部署之后，我们把操作和演进智能体的方法交给团队。" },
      process: { kicker: "形式", title: "我们安装、培训，", accent: "然后交接", after: "。", cards: [{ title: "审计与配置", body: "智能体 stack 安装完成，安全框架明确，软件连接。包含第一个智能体。" }, { title: "一日智能体 / hackathon", body: "一天 hands-on：每个人基于真实业务案例构建自己的智能体。" }, { title: "Fractional AI Operator", body: "维护、治理、规模化、EU AI Act 合规、安全和预算跟踪。" }] },
      deliverables: { kicker: "每个人带走什么", title: "结束时，每个人都有一个", accent: "真正运行的智能体", after: "。", items: ["在自己范围内运行、进入生产的智能体。", "可以不依赖我们继续构建的部署方法。", "已经设定并理解的安全和预算护栏。", "把方法扩散到团队和组织其他部分的自主能力。"] },
      spec: { kicker: "框架", title: "一个", accent: "简单清晰", after: "的框架。", rows: [{ label: "智能体培训", value: "起价 3 497 €", note: "非技术，可由 OPCO 资助" }, { label: "形式", value: "Hands-on 工作坊", note: "基于你的真实案例" }, { label: "Stack", value: "Claude Code、Codex、MCP、安全" }, { label: "陪跑", value: "起价 247 €/h", note: "Operating Partner" }] },
      proofs: { kicker: "证明", title: "团队", accent: "掌握主动权", after: "。", items: [{ sector: "市场团队", pain: "内容生产和报告分散在多个工具中。", result: "在自己的工作流上配置智能体。", resultAccent: "自主" }, { sector: "业务管理层", pain: "需要表达用例，而不依赖技术团队。", result: "用例框定和操作方法已传递。", resultAccent: "交接" }, { sector: "AI 负责人", pain: "安装 stack 但不能削弱安全。", result: "护栏已设置，用法已记录。", resultAccent: "安全" }] },
      cta: { title: "我们聊 ", accent: "15 分钟", after: "？", fine: "一起看你业务中的真实案例，并坦率判断智能体工作方式是否对你有改变。远程或现场。" },
      footer: "Agentic Operating Partner · paul.larmaraud@parrit.ai",
    }),
  },
};

export const getOfferCopy = (lang: Locale, offer: OfferKind) => OFFER_COPY[lang][offer];
