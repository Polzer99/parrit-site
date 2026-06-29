import type { Locale } from "@/app/[lang]/dictionaries";

// Base partagée entre les langues : structure du parcours (ne se traduit pas).
export type LogoVisual = { src: string; label: string };
export type StepVisual =
  | { kind: "logos"; logos: LogoVisual[] }
  | { kind: "badges" }
  | { kind: "mcp"; src: string }
  | { kind: "cartography" }
  | { kind: "agent"; logo: LogoVisual; src: string }
  | { kind: "training"; logos: LogoVisual[] }
  | { kind: "fleet" };

// video : chemin d'une vidéo stylée par étape (public/chemin/videos/xx.mp4). Si défini,
// elle remplace le visuel statique dans la carte. Laisser vide tant que la vidéo n'existe pas.
export const STEP_BASE: { n: string; level: string; slug: string; shift?: boolean; video?: string; visual: StepVisual }[] = [
  {
    n: "01",
    level: "N1",
    slug: "masterclass-ia",
    visual: {
      kind: "logos",
      logos: [
        { src: "/logos/claude.svg", label: "Claude" },
        { src: "/logos/openai.svg", label: "OpenAI" },
        { src: "/logos/googlegemini.svg", label: "Google Gemini" },
        { src: "/logos/mistralai.svg", label: "Mistral AI" },
      ],
    },
  },
  { n: "02", level: "N2", slug: "masterclass-metier", visual: { kind: "badges" } },
  { n: "03", level: "N3", slug: "sessions-mcp", visual: { kind: "mcp", src: "/chemin/03-mcp.png" } },
  { n: "04", level: "N4", slug: "audit", visual: { kind: "cartography" } },
  {
    n: "05",
    level: "N5",
    slug: "deploiement-agents",
    shift: true,
    visual: { kind: "logos", logos: [{ src: "/logos/n8n.svg", label: "n8n" }] },
  },
  {
    n: "06",
    level: "N6",
    slug: "outils-agentiques",
    visual: {
      kind: "training",
      logos: [
        { src: "/logos/claude.svg", label: "Claude Code" },
        { src: "/logos/openai.svg", label: "Codex" },
      ],
    },
  },
  { n: "07", level: "N7", slug: "optimisation-flotte", shift: true, visual: { kind: "fleet" } },
];

// Texte traduit, aligné par index sur STEP_BASE.
export type FleetPole = { title: string; items: string[] };
export type StepVisualText =
  | { kind: "badges"; badges: string[] }
  | { kind: "mcp"; badge: string; connectors: string[] }
  | { kind: "training"; badge: string }
  | { kind: "fleet"; poles: FleetPole[] };
export type StepText = {
  banane: string;
  title: string;
  mode: string;
  vo: string;
  caption: string;
  cta: string;
  alt: string;
  note?: string; // petite ligne sous le visuel (ex. « pas seulement n8n »)
  visualText?: StepVisualText;
};
export type Territoire = { nom: string; sous: string; chips: string[]; wide?: boolean };

export type CheminContent = {
  back: string;
  kicker: string;
  h1Line1: string;
  h1Line2: string;
  lede: string;
  scroll: string;
  departure: string;
  arrivalTitle: string;
  arrivalSubtitle: string;
  modeKicker: string;
  steps: StepText[];
  cartoHub: string;
  cartoAxes: string[];
  territoires: Territoire[];
  ctaH: string;
  ctaP: string;
  ctaPrimary: string;
  ctaGhost: string;
  metaTitle: string;
  metaDesc: string;
};

const fr: CheminContent = {
  back: "Parrit.ai",
  kicker: "De l'IA générative à l'IA agentique",
  h1Line1: "On vous emmène jusqu'à l'IA",
  h1Line2: "qui agit pour vous.",
  lede: "Tout le monde parle d'« agents IA ». Voici, concrètement, le chemin pour y arriver : du premier chat à une flotte qui travaille seule. Descendez palier par palier, regardez qui fait le travail, et ouvrez chaque étape pour des exemples parlants.",
  scroll: "Descendez le chemin ↓",
  departure: "Départ",
  arrivalTitle: "L'IA qui agit pour vous",
  arrivalSubtitle: "Arrivée : une flotte qui travaille seule",
  modeKicker: "Le travail",
  steps: [
    {
      banane: "L'éveil",
      title: "Tout commence par une conversation",
      mode: "Vous parlez · ça répond",
      vo: "Au début, on parle. On pose une question à l'écran, il répond. C'est le premier réflexe, et c'est utile. Mais gardez ça en tête pour la suite : à ce stade, l'IA répond. Elle n'agit pas encore.",
      caption: "Le chat. La première fois qu'on demande, et que la machine comprend.",
      cta: "Découvrir le palier 1",
      alt: "Écran de conversation : « Bonsoir, Paul. Comment puis-je vous aider ? »",
    },
    {
      banane: "L'usage",
      title: "On range l'usage par métier",
      mode: "Vous parlez · ça se souvient",
      vo: "Très vite, une conversation ne suffit plus. On crée un espace par sujet, par métier : la longévité, l'automatisation interne, un projet client. Chaque équipe retrouve son contexte au lieu de tout réexpliquer.",
      caption: "Les projets. Un espace de travail par métier, avec sa mémoire.",
      cta: "Découvrir le palier 2",
      alt: "Liste de projets : Longévité, Interne automation, SAP, LinkedIn, Build AI custom project, Chatbot",
      visualText: { kind: "badges", badges: ["Mode Projet", "Custom GPT", "Gems"] },
    },
    {
      banane: "L'action",
      title: "On lui branche vos outils",
      mode: "Vous parlez · ça atteint vos outils",
      vo: "L'IA seule est aveugle. On la connecte à vos logiciels : la boîte mail, l'agenda, les fichiers, le navigateur. À partir de là, elle ne se contente plus de répondre, elle peut aller chercher et préparer le terrain.",
      caption: "Les connexions. Gmail, Calendar, Drive, le navigateur : tout devient accessible.",
      cta: "Découvrir le palier 3",
      alt: "Menu de connecteurs : Canva, Gmail, Google Calendar, Google Drive, Claude in Chrome, Control Chrome",
      visualText: { kind: "mcp", badge: "MCP", connectors: ["Mail", "Agenda", "Fichiers", "Navigateur"] },
    },
    {
      banane: "Le diagnostic",
      title: "On cartographie votre terrain",
      mode: "Vous décidez quoi lui confier",
      vo: "Avant de construire, on dresse la carte. Reporting, CRM tenu à jour tout seul, production de logiciels, contenu, alerting, veille des signaux faibles, et la mémoire de toute l'entreprise au même endroit. L'IA vient se brancher directement dans vos process, PME comme grand groupe. On voit tout le terrain d'un coup, et on choisit par où commencer.",
      caption: "La cartographie. L'IA branchée directement dans vos process.",
      cta: "Découvrir le palier 4",
      alt: "Carte des territoires que l'IA peut couvrir : production de logiciel, reporting, CRM, contenu, alerting, veille, second cerveau",
    },
    {
      banane: "Le déploiement",
      title: "Un premier agent prend la main",
      mode: "Il agit seul, en continu",
      vo: "C'est ici que le mot « agent » prend tout son sens. Ce n'est plus une IA qui répond quand on lui parle : c'est une IA qui fait. Un flux qui revient tout le temps, l'agent le traite semaine après semaine, sans qu'on lui redemande. Il prépare, il trace, et il escalade les cas sensibles à un humain.",
      caption: "Le premier agent. Il travaille tout seul, même quand vous n'êtes pas là.",
      cta: "Découvrir le palier 5",
      alt: "Diagramme d'un agent : déclencheur, conditions, modèle, envoi de réponse, connexions multiples",
      note: "Pas seulement n8n : Hermès et des agents sur mesure.",
    },
    {
      banane: "L'autonomie",
      title: "Vos équipes construisent elles-mêmes",
      mode: "Vos équipes en fabriquent",
      vo: "On passe la main. Avec les bons outils, vos équipes métier ne dépendent plus d'un prestataire pour chaque idée. Elles cadrent, elles testent, elles livrent leurs propres agents internes.",
      caption: "Claude Code et Codex. On décrit, l'agent écrit le code, on relit, on livre.",
      cta: "Découvrir le palier 6",
      alt: "Claude Code au travail dans le terminal : récap du chantier en cours et raisonnement de l'agent",
      visualText: { kind: "training", badge: "Formation Loop Engineering" },
    },
    {
      banane: "La gouvernance",
      title: "Une flotte qui travaille seule",
      mode: "Ils tournent sans vous",
      vo: "Au bout du chemin, ce ne sont plus un ou deux agents, c'est une flotte. On la pilote, on traite la dette technique, on maîtrise les coûts, et on installe les boucles qui la font s'améliorer toute seule.",
      caption: "La flotte. Tous les agents en production, d'un seul coup d'œil.",
      cta: "Découvrir le palier 7",
      alt: "Cartographie de la flotte Parrit : agents d'acquisition, de closing et de livraison posés sur un socle commun",
      visualText: {
        kind: "fleet",
        poles: [
          { title: "Back-office / Admin", items: ["Compta", "RH", "Support", "Juridique"] },
          { title: "Croissance", items: ["Vente", "Marketing", "Contenu", "Acquisition"] },
        ],
      },
    },
  ],
  cartoHub: "L'IA, branchée directement dans vos process · PME comme grand groupe",
  cartoAxes: ["Production de logiciel", "Reporting & CRM", "Création de contenu", "Veille & alerting"],
  territoires: [
    { nom: "Production de logiciel", sous: "Sites, outils internes, intégrations sur mesure", chips: ["Sites web", "Outils internes", "Intégrations"] },
    { nom: "Reporting", sous: "Vos chiffres synthétisés, chaque matin", chips: ["Tableaux de bord", "Synthèses", "KPIs"] },
    { nom: "Remplissage du CRM", sous: "Des fiches à jour, sans saisie manuelle", chips: ["Notes d'appel", "Suivi auto", "Données propres"] },
    { nom: "Création de contenu", sous: "Ce que vous publiez, produit en série", chips: ["Articles", "Vidéos", "Newsletters"] },
    { nom: "Alerting", sous: "Être prévenu au bon moment, automatiquement", chips: ["Deals qui bougent", "Clients à risque", "Événements"] },
    { nom: "Veille des signaux faibles", sous: "Le bruit utile : clients, prospects, marché", chips: ["Vos clients", "Vos prospects", "Le marché"] },
    { nom: "Second cerveau de l'entreprise", sous: "Toute la connaissance interne, à jour et accessible à chaque équipe", chips: ["Mémoire partagée", "Procédures", "Recherche interne"], wide: true },
  ],
  ctaH: "Vous êtes quelque part sur ce chemin.",
  ctaP: "Vos équipes sont probablement réparties sur plusieurs de ces paliers à la fois. On commence par poser votre niveau réel, puis on déploie la bonne marche, pour les bonnes personnes.",
  ctaPrimary: "Demander l'audit de transformation",
  ctaGhost: "Voir les offres Parrit.ai",
  metaTitle: "Le chemin de l'IA : du premier chat à la flotte d'agents | Parrit.ai",
  metaDesc: "Un parcours en sept étapes, du premier chat jusqu'à une flotte d'agents qui travaillent seuls. À chaque palier, ce qu'on déploie concrètement, en images. Trouvez votre point de départ.",
};

// EN / pt-BR / zh-CN : traduction voix Parrit (voir scripts de génération).
const en: CheminContent = {
  back: "Parrit.ai",
  kicker: "From generative AI to agentic AI",
  h1Line1: "We take you all the way to the AI",
  h1Line2: "that acts for you.",
  lede: "Everyone talks about \"AI agents.\" Here, concretely, is the path to get there: from the first chat to a fleet that works on its own. Go down stage by stage, watch who does the work, and open each step for concrete examples.",
  scroll: "Scroll down the path ↓",
  departure: "Start",
  arrivalTitle: "AI that acts for you",
  arrivalSubtitle: "Finish: a fleet that works on its own",
  modeKicker: "The work",
  steps: [
    {
      banane: "Awakening",
      title: "It all starts with a conversation",
      mode: "You talk · it responds",
      vo: "At first, we talk. We ask a question on screen, it answers. That is the first reflex, and it is useful. But keep this in mind for what follows: at this stage, the AI responds. It does not act yet.",
      caption: "The chat. The first time you ask, and the machine understands.",
      cta: "Explore stage 1",
      alt: "Chat screen: \"Good evening, Paul. How can I help you?\"",
    },
    {
      banane: "Usage",
      title: "We organize usage by function",
      mode: "You talk · it remembers",
      vo: "Very quickly, one conversation is no longer enough. We create a space by topic, by function: longevity, internal automation, a client project. Each team finds its context instead of re-explaining everything.",
      caption: "Projects. A workspace by function, with its own memory.",
      cta: "Explore stage 2",
      alt: "Project list: Longevity, Internal automation, SAP, LinkedIn, Build AI custom project, Chatbot",
      visualText: { kind: "badges", badges: ["Project Mode", "Custom GPT", "Gems"] },
    },
    {
      banane: "Action",
      title: "We connect your tools to it",
      mode: "You talk · it reaches your tools",
      vo: "AI alone is blind. We connect it to your software: the mailbox, the calendar, the files, the browser. From there, it no longer just responds, it can go fetch and prepare the ground.",
      caption: "The connections. Gmail, Calendar, Drive, the browser: everything becomes accessible.",
      cta: "Explore stage 3",
      alt: "Connector menu: Canva, Gmail, Google Calendar, Google Drive, Claude in Chrome, Control Chrome",
      visualText: { kind: "mcp", badge: "MCP", connectors: ["Mail", "Calendar", "Files", "Browser"] },
    },
    {
      banane: "Diagnosis",
      title: "We map your landscape",
      mode: "You decide what to hand over",
      vo: "Before building, we draw the map. Reporting, CRM kept up to date on its own, software production, content, alerting, weak-signal monitoring, and the memory of the entire company in one place. AI connects directly into your processes, for small businesses and large groups alike. We see the whole landscape at once, and we choose where to start.",
      caption: "The mapping. AI connected directly into your processes.",
      cta: "Explore stage 4",
      alt: "Map of territories AI can cover: software production, reporting, CRM, content, alerting, monitoring, second brain",
    },
    {
      banane: "Deployment",
      title: "A first agent takes over",
      mode: "It acts alone, continuously",
      vo: "This is where the word \"agent\" takes on its full meaning. It is no longer an AI that responds when you talk to it: it is an AI that does. A recurring workflow, the agent handles it week after week, without being asked again. It prepares, it tracks, and it escalates sensitive cases to a human.",
      caption: "The first agent. It works on its own, even when you are not there.",
      cta: "Explore stage 5",
      alt: "Agent diagram: trigger, conditions, model, response dispatch, multiple connections",
      note: "Not only n8n: Hermès and custom agents.",
    },
    {
      banane: "Autonomy",
      title: "Your teams build on their own",
      mode: "Your teams build them",
      vo: "We hand it over. With the right tools, your business teams no longer depend on a contractor for every idea. They scope, they test, they deliver their own internal agents.",
      caption: "Claude Code and Codex. We describe, the agent writes the code, we review, we deliver.",
      cta: "Explore stage 6",
      alt: "Claude Code at work in the terminal: summary of the current task and agent reasoning",
      visualText: { kind: "training", badge: "Loop Engineering Training" },
    },
    {
      banane: "Governance",
      title: "A fleet that works on its own",
      mode: "They run without you",
      vo: "At the end of the path, it is no longer one or two agents, it is a fleet. We pilot it, handle the technical debt, control the costs, and install the loops that make it improve on its own.",
      caption: "The fleet. All agents in production, at a glance.",
      cta: "Explore stage 7",
      alt: "Parrit fleet map: acquisition, closing, and delivery agents built on a shared foundation",
      visualText: {
        kind: "fleet",
        poles: [
          { title: "Back-office / Admin", items: ["Accounting", "HR", "Support", "Legal"] },
          { title: "Growth", items: ["Sales", "Marketing", "Content", "Acquisition"] },
        ],
      },
    },
  ],
  cartoHub: "AI connected directly into your processes · from small businesses to large groups",
  cartoAxes: ["Software production", "Reporting & CRM", "Content creation", "Monitoring & alerting"],
  territoires: [
    { nom: "Software production", sous: "Sites, internal tools, custom integrations", chips: ["Websites", "Internal tools", "Integrations"] },
    { nom: "Reporting", sous: "Your numbers synthesized, every morning", chips: ["Dashboards", "Summaries", "KPIs"] },
    { nom: "CRM filling", sous: "Up-to-date records, without manual entry", chips: ["Call notes", "Auto follow-up", "Clean data"] },
    { nom: "Content creation", sous: "What you publish, produced at scale", chips: ["Articles", "Videos", "Newsletters"] },
    { nom: "Alerting", sous: "Notified at the right moment, automatically", chips: ["Moving deals", "At-risk clients", "Events"] },
    { nom: "Weak signal monitoring", sous: "The useful noise: clients, prospects, market", chips: ["Your clients", "Your prospects", "The market"] },
    { nom: "Company second brain", sous: "All internal knowledge, up to date and accessible to every team", chips: ["Shared memory", "Procedures", "Internal search"], wide: true },
  ],
  ctaH: "You are somewhere on this path.",
  ctaP: "Your teams are probably spread across several of these stages at once. We start by establishing your real level, then deploy the right step, for the right people.",
  ctaPrimary: "Request the transformation audit",
  ctaGhost: "See Parrit.ai offerings",
  metaTitle: "The AI path: from the first chat to a fleet of agents | Parrit.ai",
  metaDesc: "A seven-step journey, from the first chat to a fleet of agents that work on their own. At each stage, what we deploy concretely, in images. Find your starting point.",
};

const ptBR: CheminContent = {
  back: "Parrit.ai",
  kicker: "Da IA generativa à IA agêntica",
  h1Line1: "Nós levamos você até a IA",
  h1Line2: "que age por você.",
  lede: "Todo mundo fala em \"agentes de IA\". Aqui, de forma concreta, está o caminho para chegar lá: do primeiro chat a uma frota que trabalha sozinha. Desça nível a nível, veja quem faz o trabalho e abra cada etapa para exemplos reais.",
  scroll: "Desça pelo caminho ↓",
  departure: "Partida",
  arrivalTitle: "A IA que age por você",
  arrivalSubtitle: "Chegada: uma frota que trabalha sozinha",
  modeKicker: "O trabalho",
  steps: [
    {
      banane: "O despertar",
      title: "Tudo começa com uma conversa",
      mode: "Você fala · ele responde",
      vo: "No início, a gente fala. Fazemos uma pergunta na tela, ele responde. É o primeiro reflexo, e é útil. Mas tenha isso em mente para o que vem depois: neste estágio, a IA responde. Ela ainda não age.",
      caption: "O chat. A primeira vez que você pergunta, e a máquina entende.",
      cta: "Ver o nível 1",
      alt: "Tela de conversa: \"Boa noite, Paul. Como posso ajudá-lo?\"",
    },
    {
      banane: "O uso",
      title: "Organizamos a IA por área",
      mode: "Você fala · ele lembra",
      vo: "Muito rapidamente, uma conversa não é mais suficiente. Criamos um espaço por tema, por área: longevidade, automação interna, um projeto de cliente. Cada equipe encontra seu contexto em vez de ter que explicar tudo de novo.",
      caption: "Os projetos. Um espaço de trabalho por área, com sua própria memória.",
      cta: "Ver o nível 2",
      alt: "Lista de projetos: Longevidade, Automação interna, SAP, LinkedIn, Build AI custom project, Chatbot",
      visualText: { kind: "badges", badges: ["Modo Projeto", "Custom GPT", "Gems"] },
    },
    {
      banane: "A ação",
      title: "Conectamos suas ferramentas a ele",
      mode: "Você fala · ele acessa suas ferramentas",
      vo: "A IA sozinha é cega. Nós a conectamos aos seus sistemas: a caixa de e-mail, a agenda, os arquivos, o navegador. A partir daí, ela não se limita mais a responder: ela pode buscar e preparar o terreno.",
      caption: "As conexões. Gmail, Calendar, Drive, o navegador: tudo fica acessível.",
      cta: "Ver o nível 3",
      alt: "Menu de conectores: Canva, Gmail, Google Calendar, Google Drive, Claude in Chrome, Control Chrome",
      visualText: { kind: "mcp", badge: "MCP", connectors: ["E-mail", "Agenda", "Arquivos", "Navegador"] },
    },
    {
      banane: "O diagnóstico",
      title: "Mapeamos o seu terreno",
      mode: "Você decide o que delegar",
      vo: "Antes de construir, desenhamos o mapa. Reporting, CRM atualizado sozinho, produção de software, conteúdo, alerting, monitoramento de sinais fracos e a memória de toda a empresa em um só lugar. A IA se conecta diretamente nos seus processos, seja PME ou grande empresa. Vemos todo o terreno de uma vez e escolhemos por onde começar.",
      caption: "O mapeamento. A IA conectada diretamente nos seus processos.",
      cta: "Ver o nível 4",
      alt: "Mapa dos territórios que a IA pode cobrir: produção de software, reporting, CRM, conteúdo, alerting, monitoramento, segundo cérebro",
    },
    {
      banane: "O deployment",
      title: "Um primeiro agente assume o controle",
      mode: "Ele age sozinho, continuamente",
      vo: "É aqui que a palavra \"agente\" ganha todo o seu sentido. Não é mais uma IA que responde quando você fala com ela: é uma IA que faz. Um fluxo que sempre se repete, o agente o trata semana após semana, sem precisar ser solicitado novamente. Ele prepara, rastreia e escala os casos sensíveis para um humano.",
      caption: "O primeiro agente. Ele trabalha sozinho, mesmo quando você não está lá.",
      cta: "Ver o nível 5",
      alt: "Diagrama de um agente: gatilho, condições, modelo, envio de resposta, múltiplas conexões",
    },
    {
      banane: "A autonomia",
      title: "Suas equipes constroem por conta própria",
      mode: "Suas equipes os fabricam",
      vo: "Passamos o bastão. Com as ferramentas certas, suas equipes de negócio não dependem mais de um fornecedor para cada ideia. Elas definem o escopo, testam e entregam seus próprios agentes internos.",
      caption: "Claude Code e Codex. Descrevemos, o agente escreve o código, revisamos e entregamos.",
      cta: "Ver o nível 6",
      alt: "Claude Code trabalhando no terminal: resumo do projeto em andamento e raciocínio do agente",
      visualText: { kind: "training", badge: "Formação Loop Engineering" },
    },
    {
      banane: "A governança",
      title: "Uma frota que trabalha sozinha",
      mode: "Eles rodam sem você",
      vo: "No fim do caminho, não são mais um ou dois agentes, é uma frota. Nós a pilotamos, tratamos a dívida técnica, controlamos os custos e instalamos os loops que a fazem melhorar sozinha.",
      caption: "A frota. Todos os agentes em produção, de uma só olhada.",
      cta: "Ver o nível 7",
      alt: "Mapa da frota Parrit: agentes de aquisição, fechamento e entrega sobre uma base comum",
      visualText: {
        kind: "fleet",
        poles: [
          { title: "Back-office / Admin", items: ["Contabilidade", "RH", "Suporte", "Jurídico"] },
          { title: "Crescimento", items: ["Vendas", "Marketing", "Conteúdo", "Aquisição"] },
        ],
      },
    },
  ],
  cartoHub: "A IA conectada diretamente nos seus processos · PMEs e grandes empresas",
  cartoAxes: ["Produção de software", "Reporting & CRM", "Criação de conteúdo", "Monitoramento & alertas"],
  territoires: [
    { nom: "Produção de software", sous: "Sites, ferramentas internas, integrações personalizadas", chips: ["Sites", "Ferramentas internas", "Integrações"] },
    { nom: "Reporting", sous: "Seus números sintetizados, toda manhã", chips: ["Dashboards", "Sínteses", "KPIs"] },
    { nom: "Preenchimento do CRM", sous: "Fichas atualizadas, sem entrada manual", chips: ["Notas de chamada", "Acompanhamento auto", "Dados limpos"] },
    { nom: "Criação de conteúdo", sous: "O que você publica, produzido em série", chips: ["Artigos", "Vídeos", "Newsletters"] },
    { nom: "Alerting", sous: "Ser avisado no momento certo, automaticamente", chips: ["Deals em movimento", "Clientes em risco", "Eventos"] },
    { nom: "Monitoramento de sinais fracos", sous: "O ruído útil: clientes, prospects, mercado", chips: ["Seus clientes", "Seus prospects", "O mercado"] },
    { nom: "Segundo cérebro da empresa", sous: "Todo o conhecimento interno, atualizado e acessível para cada equipe", chips: ["Memória compartilhada", "Procedimentos", "Busca interna"], wide: true },
  ],
  ctaH: "Você está em algum ponto deste caminho.",
  ctaP: "Suas equipes provavelmente estão distribuídas em vários desses níveis ao mesmo tempo. Começamos por estabelecer seu nível real, depois implantamos a etapa certa, para as pessoas certas.",
  ctaPrimary: "Solicitar o diagnóstico de transformação",
  ctaGhost: "Ver as ofertas Parrit.ai",
  metaTitle: "O caminho da IA: do primeiro chat à frota de agentes | Parrit.ai",
  metaDesc: "Uma jornada em sete etapas, do primeiro chat a uma frota de agentes que trabalham sozinhos. Em cada nível, o que implantamos concretamente, em imagens. Encontre seu ponto de partida.",
};

const zhCN: CheminContent = {
  back: "Parrit.ai",
  kicker: "从生成式 AI 到 AI 智能体",
  h1Line1: "我们带您走向",
  h1Line2: "为您主动行动的 AI。",
  lede: "人人都在谈论“AI 智能体”。以下是实现它的具体路径：从第一次对话到一支自主运转的智能体队列。逐级下探，观察谁在干活，展开每个阶段查看实际案例。",
  scroll: "向下探索路径 ↓",
  departure: "起点",
  arrivalTitle: "为您主动行动的 AI",
  arrivalSubtitle: "终点：一支自主工作的智能体队列",
  modeKicker: "谁在干活",
  steps: [
    {
      banane: "启蒙",
      title: "一切从一次对话开始",
      mode: "你说 · 它答",
      vo: "起初，我们对话。在屏幕上提问，它回答。这是第一个本能反应，也是有用的。但请记住这一点：在这个阶段，AI 只是回应，它还没有行动。",
      caption: "对话界面。第一次提问，机器真正理解了你。",
      cta: "查看第 1 阶段",
      alt: "对话屏幕：“晚上好，Paul。我能为您做什么？”",
    },
    {
      banane: "应用",
      title: "按职能组织 AI",
      mode: "你说 · 它记住",
      vo: "很快，一次对话就不够用了。我们按主题、按职能创建独立空间：长期项目、内部自动化、客户项目。每个团队直接找到上下文，无需重新解释。",
      caption: "项目空间。每个职能一个工作区，拥有独立记忆。",
      cta: "查看第 2 阶段",
      alt: "项目列表：长期规划、内部自动化、SAP、LinkedIn、Build AI custom project、Chatbot",
      visualText: { kind: "badges", badges: ["项目模式", "Custom GPT", "Gems"] },
    },
    {
      banane: "行动",
      title: "为它接入您的工具",
      mode: "你说 · 它触达您的工具",
      vo: "单独的 AI 是盲目的。我们将它连接到您的软件：邮箱、日历、文件、浏览器。从此，它不再只是回答，而是可以主动获取信息、准备工作。",
      caption: "连接器。Gmail、Calendar、Drive、浏览器：一切触手可及。",
      cta: "查看第 3 阶段",
      alt: "连接器菜单：Canva、Gmail、Google Calendar、Google Drive、Claude in Chrome、Control Chrome",
      visualText: { kind: "mcp", badge: "MCP", connectors: ["邮箱", "日历", "文件", "浏览器"] },
    },
    {
      banane: "诊断",
      title: "我们绘制您的全景图",
      mode: "您决定交给它什么",
      vo: "在构建之前，我们先绘制地图。Reporting、自动更新的 CRM、软件生产、内容创作、告警、弱信号监测，以及整个公司的知识库汇聚一处。AI 直接接入您的流程，无论中小企业还是大集团。我们一览全局，选择切入点。",
      caption: "全景图。AI 直接接入您的流程。",
      cta: "查看第 4 阶段",
      alt: "AI 可覆盖领域图：软件生产、reporting、CRM、内容、告警、监测、企业第二大脑",
    },
    {
      banane: "部署",
      title: "第一个智能体接手了",
      mode: "它独立运作，持续不断",
      vo: "\"AI 智能体\"这个词在这里才真正有了意义。它不再是被动回答的 AI，而是主动行动的 AI。一个反复出现的工作流，智能体周复一周地处理它，无需再次发起请求。它准备、追踪，并将敏感案例上报给人类。",
      caption: "第一个智能体。即使您不在场，它也在独立工作。",
      cta: "查看第 5 阶段",
      alt: "智能体架构图：触发器、条件判断、模型、发送响应、多路连接",
    },
    {
      banane: "自主",
      title: "您的团队自主构建",
      mode: "您的团队自己来做",
      vo: "我们交棒。有了合适的工具，您的业务团队不再为每个想法依赖外部服务商。他们自行定义范围、测试并交付自己的内部智能体。",
      caption: "Claude Code 与 Codex。我们描述，智能体写代码，我们审查，我们交付。",
      cta: "查看第 6 阶段",
      alt: "Claude Code 在终端中工作：当前任务摘要与智能体推理过程",
      visualText: { kind: "training", badge: "Loop Engineering 培训" },
    },
    {
      banane: "治理",
      title: "一支自主运转的智能体队列",
      mode: "它们不需要您",
      vo: "走到路径尽头，已不是一两个智能体，而是一支队列。我们统筹调度、处理技术债、控制成本，并构建让它自我进化的反馈循环。",
      caption: "智能体队列。所有在产智能体，一览无余。",
      cta: "查看第 7 阶段",
      alt: "Parrit 智能体队列全图：基于共同底座的获客、成交与交付智能体",
      visualText: {
        kind: "fleet",
        poles: [
          { title: "后台 / 行政", items: ["财务", "HR", "支持", "法务"] },
          { title: "增长", items: ["销售", "营销", "内容", "获客"] },
        ],
      },
    },
  ],
  cartoHub: "AI 直接接入您的流程 · 中小企业与大集团同样适用",
  cartoAxes: ["软件生产", "报表与 CRM", "内容创作", "监测与告警"],
  territoires: [
    { nom: "软件生产", sous: "网站、内部工具、定制集成", chips: ["网站", "内部工具", "集成"] },
    { nom: "Reporting", sous: "每天早上，数字自动汇总", chips: ["仪表板", "摘要", "KPIs"] },
    { nom: "CRM 录入", sous: "记录实时更新，无需手动填写", chips: ["通话记录", "自动跟进", "干净数据"] },
    { nom: "内容创作", sous: "您发布的内容，批量生产", chips: ["文章", "视频", "Newsletters"] },
    { nom: "告警", sous: "在正确时机自动收到提醒", chips: ["进行中的 Deals", "高风险客户", "事件"] },
    { nom: "弱信号监测", sous: "有价值的信号：客户、潜在客户、市场", chips: ["您的客户", "您的潜在客户", "市场"] },
    { nom: "企业第二大脑", sous: "所有内部知识，实时更新，每个团队均可访问", chips: ["共享记忆", "流程规范", "内部搜索"], wide: true },
  ],
  ctaH: "您正处于这条路径的某个位置。",
  ctaP: "您的团队可能同时分布在多个阶段。我们从确认您的真实水平开始，然后为合适的人部署合适的步骤。",
  ctaPrimary: "申请转型诊断",
  ctaGhost: "查看 Parrit.ai 服务",
  metaTitle: "AI 路径：从第一次对话到智能体队列 | Parrit.ai",
  metaDesc: "七步旅程，从第一次对话到自主运转的智能体队列。每个阶段都有具体的部署内容，配图说明。找到您的起点。",
};

export const CHEMIN_CONTENT: Record<Locale, CheminContent> = {
  fr,
  en,
  "pt-BR": ptBR,
  "zh-CN": zhCN,
};
