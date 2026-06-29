import Link from "next/link";

const SITE_URL = "https://parrit.ai";

export type CheminLang = "fr" | "en" | "pt-BR" | "zh-CN";

type Visual =
  | { kind: "shot"; src: string; alt: string }
  | { kind: "svg" };

type CheminStep = {
  n: string;
  level: string;
  banane: string;
  title: string;
  modeLabel: string;
  mode: string;
  shift?: boolean;
  vo: string;
  caption: string;
  slug: string;
  cta: string;
  visual: Visual;
};

type Territory = {
  nom: string;
  sous: string;
  chips: string[];
  wide?: boolean;
};

type CheminCopy = {
  meta: {
    title: string;
    description: string;
    ogTitle: string;
    ogDescription: string;
    ogLocale: string;
    ogAlt: string;
  };
  jsonLdName: string;
  cartographyLabel: string;
  hero: {
    back: string;
    kicker: string;
    h1: [string, string];
    lede: string;
    scroll: string;
  };
  steps: CheminStep[];
  cartography: {
    hub: string;
    territories: Territory[];
  };
  footer: {
    title: string;
    body: string;
    primary: string;
    secondary: string;
    mailSubject: string;
  };
};

const COMMON_VISUALS = {
  chat: {
    kind: "shot",
    src: "/chemin/01-chat.png",
    alt: "Ecran de conversation avec une question posee a l'assistant.",
  },
  projets: {
    kind: "shot",
    src: "/chemin/02-projets.png",
    alt: "Liste de projets organises par sujet et par metier.",
  },
  mcp: {
    kind: "shot",
    src: "/chemin/03-mcp.png",
    alt: "Menu de connecteurs vers Gmail, Calendar, Drive et le navigateur.",
  },
  cartography: { kind: "svg" },
  agent: {
    kind: "shot",
    src: "/chemin/05-agent-n8n.png",
    alt: "Schema d'un agent avec declencheur, conditions, modele et actions.",
  },
  code: {
    kind: "shot",
    src: "/chemin/06-claude-code.png",
    alt: "Agent de code au travail dans un terminal.",
  },
  fleet: {
    kind: "shot",
    src: "/chemin/07-flotte.png",
    alt: "Cartographie d'une flotte d'agents en production.",
  },
} as const satisfies Record<string, Visual>;

const COPY: Record<CheminLang, CheminCopy> = {
  fr: {
    meta: {
      title: "Le chemin de l'IA : du premier chat à la flotte d'agents | Parrit.ai",
      description:
        "Un parcours en sept étapes, du premier chat jusqu'à une flotte d'agents qui travaillent seuls. À chaque palier, ce qu'on déploie concrètement, en images.",
      ogTitle: "Le chemin de l'IA, étape par étape | Parrit.ai",
      ogDescription:
        "Du premier chat à la flotte d'agents autonomes : les sept paliers de maturité, en images. Trouvez où vous en êtes.",
      ogLocale: "fr_FR",
      ogAlt: "Le chemin de l'IA par Parrit.ai",
    },
    jsonLdName: "Le chemin de l'IA, 7 paliers de maturité",
    cartographyLabel:
      "Cartographie des territoires que l'IA peut couvrir : production de logiciel, reporting, CRM, création de contenu, alerting, veille des signaux faibles, second cerveau de l'entreprise",
    hero: {
      back: "Parrit.ai",
      kicker: "De l'IA générative à l'IA agentique",
      h1: ["On vous emmène jusqu'à l'IA", "qui agit pour vous."],
      lede:
        "Tout le monde parle d'« agents IA ». Voici, concrètement, le chemin pour y arriver : du premier chat à une flotte qui travaille seule. Descendez palier par palier, regardez qui fait le travail, et ouvrez chaque étape pour des exemples parlants.",
      scroll: "Descendez le chemin",
    },
    steps: [
      {
        n: "01",
        level: "N1",
        banane: "L'éveil",
        title: "Tout commence par une conversation",
        modeLabel: "Le travail",
        mode: "Vous parlez · ça répond",
        vo: "Au début, on parle. On pose une question à l'écran, il répond. C'est le premier réflexe, et c'est utile. Mais gardez ça en tête pour la suite : à ce stade, l'IA répond. Elle n'agit pas encore.",
        caption: "Le chat. La première fois qu'on demande, et que la machine comprend.",
        slug: "masterclass-ia",
        cta: "Découvrir le palier 1",
        visual: {
          ...COMMON_VISUALS.chat,
          alt: "Écran de conversation : « Bonsoir, Paul. Comment puis-je vous aider ? »",
        },
      },
      {
        n: "02",
        level: "N2",
        banane: "L'usage",
        title: "On range l'IA par métier",
        modeLabel: "Le travail",
        mode: "Vous parlez · ça se souvient",
        vo: "Très vite, une conversation ne suffit plus. On crée un espace par sujet, par métier : la longévité, l'automatisation interne, un projet client. Chaque équipe retrouve son contexte au lieu de tout réexpliquer.",
        caption: "Les projets. Un espace de travail par métier, avec sa mémoire.",
        slug: "masterclass-metier",
        cta: "Découvrir le palier 2",
        visual: {
          ...COMMON_VISUALS.projets,
          alt: "Liste de projets : Longévité, Interne automation, SAP, LinkedIn et Build AI custom project",
        },
      },
      {
        n: "03",
        level: "N3",
        banane: "L'action",
        title: "On lui branche vos outils",
        modeLabel: "Le travail",
        mode: "Vous parlez · ça atteint vos outils",
        vo: "L'IA seule est aveugle. On la connecte à vos logiciels : la boîte mail, l'agenda, les fichiers, le navigateur. À partir de là, elle ne se contente plus de répondre, elle peut aller chercher et préparer le terrain.",
        caption: "Les connexions. Gmail, Calendar, Drive, le navigateur : tout devient accessible.",
        slug: "sessions-mcp",
        cta: "Découvrir le palier 3",
        visual: {
          ...COMMON_VISUALS.mcp,
          alt: "Menu de connecteurs : Canva, Gmail, Google Calendar, Google Drive, Claude in Chrome, Control Chrome",
        },
      },
      {
        n: "04",
        level: "N4",
        banane: "Le diagnostic",
        title: "On cartographie votre terrain",
        modeLabel: "Le travail",
        mode: "Vous décidez quoi lui confier",
        vo: "Avant de construire, on dresse la carte. Reporting, CRM tenu à jour tout seul, production de logiciels, contenu, alerting, veille des signaux faibles, et la mémoire de toute l'entreprise au même endroit. L'IA vient se brancher directement dans vos process, PME comme grand groupe. On voit tout le terrain d'un coup, et on choisit par où commencer.",
        caption: "La cartographie. L'IA branchée directement dans vos process.",
        slug: "audit",
        cta: "Découvrir le palier 4",
        visual: COMMON_VISUALS.cartography,
      },
      {
        n: "05",
        level: "N5",
        banane: "Le déploiement",
        title: "Un premier agent prend la main",
        modeLabel: "Le travail",
        mode: "Il agit seul, en continu",
        shift: true,
        vo: "C'est ici que le mot « agent » prend tout son sens. Ce n'est plus une IA qui répond quand on lui parle : c'est une IA qui fait. Un flux qui revient tout le temps, l'agent le traite semaine après semaine, sans qu'on lui redemande. Il prépare, il trace, et il escalade les cas sensibles à un humain.",
        caption: "Le premier agent. Il travaille tout seul, même quand vous n'êtes pas là.",
        slug: "deploiement-agents",
        cta: "Découvrir le palier 5",
        visual: {
          ...COMMON_VISUALS.agent,
          alt: "Diagramme d'un agent : déclencheur, conditions, modèle, envoi de réponse, connexions multiples",
        },
      },
      {
        n: "06",
        level: "N6",
        banane: "L'autonomie",
        title: "Vos équipes construisent elles-mêmes",
        modeLabel: "Le travail",
        mode: "Vos équipes en fabriquent",
        vo: "On passe la main. Avec les bons outils, vos équipes métier ne dépendent plus d'un prestataire pour chaque idée. Elles cadrent, elles testent, elles livrent leurs propres agents internes.",
        caption: "Claude Code et Codex. On décrit, l'agent écrit le code, on relit, on livre.",
        slug: "outils-agentiques",
        cta: "Découvrir le palier 6",
        visual: {
          ...COMMON_VISUALS.code,
          alt: "Claude Code au travail dans le terminal : récap du chantier en cours et raisonnement de l'agent",
        },
      },
      {
        n: "07",
        level: "N7",
        banane: "La gouvernance",
        title: "Une flotte qui travaille seule",
        modeLabel: "Le travail",
        mode: "Ils tournent sans vous",
        shift: true,
        vo: "Au bout du chemin, ce ne sont plus un ou deux agents, c'est une flotte. On la pilote, on traite la dette technique, on maîtrise les coûts, et on installe les boucles qui la font s'améliorer toute seule.",
        caption: "La flotte. Tous les agents en production, d'un seul coup d'œil.",
        slug: "optimisation-flotte",
        cta: "Découvrir le palier 7",
        visual: {
          ...COMMON_VISUALS.fleet,
          alt: "Cartographie de la flotte Parrit : agents d'acquisition, de closing et de livraison posés sur un socle commun",
        },
      },
    ],
    cartography: {
      hub: "L'IA, branchée directement dans vos process · PME comme grand groupe",
      territories: [
        { nom: "Production de logiciel", sous: "Sites, outils internes, intégrations sur mesure", chips: ["Sites web", "Outils internes", "Intégrations"] },
        { nom: "Reporting", sous: "Vos chiffres synthétisés, chaque matin", chips: ["Tableaux de bord", "Synthèses", "KPIs"] },
        { nom: "Remplissage du CRM", sous: "Des fiches à jour, sans saisie manuelle", chips: ["Notes d'appel", "Suivi auto", "Données propres"] },
        { nom: "Création de contenu", sous: "Ce que vous publiez, produit en série", chips: ["Articles", "Vidéos", "Newsletters"] },
        { nom: "Alerting", sous: "Être prévenu au bon moment, automatiquement", chips: ["Deals qui bougent", "Clients à risque", "Événements"] },
        { nom: "Veille des signaux faibles", sous: "Le bruit utile : clients, prospects, marché", chips: ["Vos clients", "Vos prospects", "Le marché"] },
        { nom: "Second cerveau de l'entreprise", sous: "Toute la connaissance interne, à jour et accessible à chaque équipe", chips: ["Mémoire partagée", "Procédures", "Recherche interne"], wide: true },
      ],
    },
    footer: {
      title: "Vous êtes quelque part sur ce chemin.",
      body:
        "Vos équipes sont probablement réparties sur plusieurs de ces paliers à la fois. On commence par poser votre niveau réel, puis on déploie la bonne marche, pour les bonnes personnes.",
      primary: "Demander l'audit de transformation",
      secondary: "Voir Parrit.ai",
      mailSubject: "Le chemin de l'IA",
    },
  },
  en: {
    meta: {
      title: "The AI path: from first chat to agent fleet | Parrit.ai",
      description:
        "A seven-step path from the first chat to a fleet of agents working on their own. At each step, see what gets deployed in practice.",
      ogTitle: "The AI path, step by step | Parrit.ai",
      ogDescription:
        "From first chat to autonomous agent fleet: seven maturity steps, shown in concrete examples. Find where you stand.",
      ogLocale: "en_US",
      ogAlt: "The AI path by Parrit.ai",
    },
    jsonLdName: "The AI path, 7 maturity steps",
    cartographyLabel:
      "Map of the business areas AI can cover: software production, reporting, CRM, content, alerts, weak-signal watch, company second brain",
    hero: {
      back: "Parrit.ai",
      kicker: "From generative AI to agentic work",
      h1: ["We take you to AI", "that acts for you."],
      lede:
        "Everyone talks about AI agents. Here is the practical path to get there: from the first chat to a fleet that works on its own. Move step by step, see who does the work, and open each stage for concrete examples.",
      scroll: "Follow the path",
    },
    steps: [
      {
        n: "01",
        level: "N1",
        banane: "Awakening",
        title: "It starts with a conversation",
        modeLabel: "The work",
        mode: "You speak · it answers",
        vo: "At first, you talk. You ask a question on screen, it answers. That first reflex is useful. Keep this in mind for the rest: at this stage, AI answers. It does not act yet.",
        caption: "The chat. The first time you ask, and the machine understands.",
        slug: "masterclass-ia",
        cta: "Open step 1",
        visual: { ...COMMON_VISUALS.chat, alt: "Conversation screen where an assistant answers a direct question." },
      },
      {
        n: "02",
        level: "N2",
        banane: "Usage",
        title: "AI gets organized by job",
        modeLabel: "The work",
        mode: "You speak · it remembers",
        vo: "One conversation is quickly not enough. You create one space per subject, per job: longevity, internal automation, a client project. Each team finds its context again instead of explaining everything from scratch.",
        caption: "Projects. One workspace per job, with its memory.",
        slug: "masterclass-metier",
        cta: "Open step 2",
        visual: { ...COMMON_VISUALS.projets, alt: "Project list organized by business subject and recurring workstream." },
      },
      {
        n: "03",
        level: "N3",
        banane: "Action",
        title: "You connect it to your tools",
        modeLabel: "The work",
        mode: "You speak · it reaches your tools",
        vo: "AI alone is blind. You connect it to your software: email, calendar, files, browser. From there, it does more than answer. It can retrieve, compare and prepare the ground.",
        caption: "Connections. Gmail, Calendar, Drive, the browser: the work surface opens up.",
        slug: "sessions-mcp",
        cta: "Open step 3",
        visual: { ...COMMON_VISUALS.mcp, alt: "Connector menu for Gmail, Google Calendar, Google Drive and browser control." },
      },
      {
        n: "04",
        level: "N4",
        banane: "Diagnosis",
        title: "You map your terrain",
        modeLabel: "The work",
        mode: "You decide what to hand over",
        vo: "Before building, you draw the map. Reporting, CRM updates, software production, content, alerts, weak signals, and company memory in one place. AI plugs into your real processes, in an SMB or a large group. You see the whole terrain and choose where to start.",
        caption: "The map. AI connected directly to your processes.",
        slug: "audit",
        cta: "Open step 4",
        visual: COMMON_VISUALS.cartography,
      },
      {
        n: "05",
        level: "N5",
        banane: "Deployment",
        title: "A first agent takes the work",
        modeLabel: "The work",
        mode: "It acts alone, continuously",
        shift: true,
        vo: "This is where the word agent starts to mean something. It is no longer AI that answers when spoken to. It is AI that does the work. A recurring flow comes back every week, and the agent handles it without being asked again. It prepares, records, and sends sensitive cases back to a human.",
        caption: "The first agent. It works alone, even when you are not there.",
        slug: "deploiement-agents",
        cta: "Open step 5",
        visual: { ...COMMON_VISUALS.agent, alt: "Agent diagram with trigger, conditions, model, response and several connected tools." },
      },
      {
        n: "06",
        level: "N6",
        banane: "Autonomy",
        title: "Your teams build by themselves",
        modeLabel: "The work",
        mode: "Your teams make agents",
        vo: "You take the handover. With the right tools, business teams no longer need a provider for every idea. They frame, test and ship their own internal agents.",
        caption: "Claude Code and Codex. You describe, the agent writes code, you review, you ship.",
        slug: "outils-agentiques",
        cta: "Open step 6",
        visual: { ...COMMON_VISUALS.code, alt: "Coding agent working in a terminal with a concise work summary." },
      },
      {
        n: "07",
        level: "N7",
        banane: "Governance",
        title: "A fleet works on its own",
        modeLabel: "The work",
        mode: "They run without you",
        shift: true,
        vo: "At the end of the path, it is no longer one or two agents. It is a fleet. You pilot it, handle technical debt, control costs, and install the loops that make it improve over time.",
        caption: "The fleet. All production agents in one view.",
        slug: "optimisation-flotte",
        cta: "Open step 7",
        visual: { ...COMMON_VISUALS.fleet, alt: "Map of production agents grouped around acquisition, closing and delivery." },
      },
    ],
    cartography: {
      hub: "AI connected directly to your processes · SMB and large group",
      territories: [
        { nom: "Software production", sous: "Websites, internal tools, custom integrations", chips: ["Websites", "Internal tools", "Integrations"] },
        { nom: "Reporting", sous: "Your numbers summarized every morning", chips: ["Dashboards", "Briefs", "KPIs"] },
        { nom: "CRM updates", sous: "Clean records without manual entry", chips: ["Call notes", "Auto follow-up", "Clean data"] },
        { nom: "Content creation", sous: "What you publish, produced in series", chips: ["Articles", "Videos", "Newsletters"] },
        { nom: "Alerts", sous: "The right signal, at the right time", chips: ["Moving deals", "Risk accounts", "Events"] },
        { nom: "Weak-signal watch", sous: "Useful noise from clients, prospects and market", chips: ["Clients", "Prospects", "Market"] },
        { nom: "Company second brain", sous: "Internal knowledge kept current and accessible to every team", chips: ["Shared memory", "Procedures", "Internal search"], wide: true },
      ],
    },
    footer: {
      title: "You are somewhere on this path.",
      body:
        "Your teams are probably spread across several steps at once. We start by naming your real level, then deploy the right next step for the right people.",
      primary: "Request the transformation audit",
      secondary: "See Parrit.ai",
      mailSubject: "The AI path",
    },
  },
  "pt-BR": {
    meta: {
      title: "O caminho da IA: do primeiro chat à frota de agentes | Parrit.ai",
      description:
        "Um percurso em sete etapas, do primeiro chat até uma frota de agentes trabalhando sozinha. Em cada etapa, o que é implantado de verdade.",
      ogTitle: "O caminho da IA, etapa por etapa | Parrit.ai",
      ogDescription:
        "Do primeiro chat à frota de agentes autônomos: sete níveis de maturidade, com exemplos concretos. Veja onde sua empresa está.",
      ogLocale: "pt_BR",
      ogAlt: "O caminho da IA pela Parrit.ai",
    },
    jsonLdName: "O caminho da IA, 7 níveis de maturidade",
    cartographyLabel:
      "Mapa das áreas que a IA pode cobrir: produção de software, relatórios, CRM, conteúdo, alertas, sinais fracos, segundo cérebro da empresa",
    hero: {
      back: "Parrit.ai",
      kicker: "Da IA generativa ao trabalho agentico",
      h1: ["Levamos você até a IA", "que age por você."],
      lede:
        "Todo mundo fala de agentes de IA. Aqui está o caminho concreto para chegar lá: do primeiro chat a uma frota que trabalha sozinha. Desça etapa por etapa, veja quem faz o trabalho e abra cada nível para exemplos claros.",
      scroll: "Desça o caminho",
    },
    steps: [
      {
        n: "01",
        level: "N1",
        banane: "O despertar",
        title: "Tudo começa com uma conversa",
        modeLabel: "O trabalho",
        mode: "Você fala · ele responde",
        vo: "No começo, você conversa. Faz uma pergunta na tela, ele responde. É o primeiro reflexo, e é útil. Guarde isto para a sequência: nesse ponto, a IA responde. Ela ainda não age.",
        caption: "O chat. A primeira vez em que você pede, e a máquina entende.",
        slug: "masterclass-ia",
        cta: "Abrir o nível 1",
        visual: { ...COMMON_VISUALS.chat, alt: "Tela de conversa em que um assistente responde a uma pergunta direta." },
      },
      {
        n: "02",
        level: "N2",
        banane: "O uso",
        title: "A IA é organizada por função",
        modeLabel: "O trabalho",
        mode: "Você fala · ele lembra",
        vo: "Logo, uma conversa só não basta. Você cria um espaço por assunto, por função: longevidade, automação interna, um projeto de cliente. Cada equipe reencontra seu contexto sem explicar tudo de novo.",
        caption: "Os projetos. Um espaço de trabalho por função, com memória.",
        slug: "masterclass-metier",
        cta: "Abrir o nível 2",
        visual: { ...COMMON_VISUALS.projets, alt: "Lista de projetos organizada por assunto de negócio e fluxo recorrente." },
      },
      {
        n: "03",
        level: "N3",
        banane: "A ação",
        title: "Você conecta seus sistemas",
        modeLabel: "O trabalho",
        mode: "Você fala · ele alcança suas ferramentas",
        vo: "IA sozinha é cega. Você a conecta aos seus sistemas: e-mail, agenda, arquivos, navegador. A partir daí, ela deixa de apenas responder. Ela busca, compara e prepara o terreno.",
        caption: "As conexões. Gmail, Calendar, Drive, navegador: a superfície de trabalho fica acessível.",
        slug: "sessions-mcp",
        cta: "Abrir o nível 3",
        visual: { ...COMMON_VISUALS.mcp, alt: "Menu de conectores para Gmail, Google Calendar, Google Drive e controle do navegador." },
      },
      {
        n: "04",
        level: "N4",
        banane: "O diagnóstico",
        title: "Você mapeia o terreno",
        modeLabel: "O trabalho",
        mode: "Você decide o que entregar",
        vo: "Antes de construir, desenhamos o mapa. Relatórios, CRM atualizado, produção de software, conteúdo, alertas, sinais fracos e memória da empresa no mesmo lugar. A IA entra nos processos reais, em PME ou em grande grupo. Você enxerga o terreno inteiro e escolhe por onde começar.",
        caption: "O mapa. IA conectada diretamente aos seus processos.",
        slug: "audit",
        cta: "Abrir o nível 4",
        visual: COMMON_VISUALS.cartography,
      },
      {
        n: "05",
        level: "N5",
        banane: "A implantação",
        title: "Um primeiro agente assume",
        modeLabel: "O trabalho",
        mode: "Ele age sozinho, em contínuo",
        shift: true,
        vo: "É aqui que a palavra agente ganha sentido. Não é mais uma IA que responde quando alguém fala. É uma IA que faz. Um fluxo que volta toda semana, o agente trata sem novo pedido. Ele prepara, registra e escala os casos sensíveis para uma pessoa.",
        caption: "O primeiro agente. Ele trabalha sozinho, mesmo quando você não está lá.",
        slug: "deploiement-agents",
        cta: "Abrir o nível 5",
        visual: { ...COMMON_VISUALS.agent, alt: "Diagrama de agente com gatilho, condições, modelo, resposta e várias ferramentas conectadas." },
      },
      {
        n: "06",
        level: "N6",
        banane: "A autonomia",
        title: "Suas equipes constroem sozinhas",
        modeLabel: "O trabalho",
        mode: "Suas equipes fabricam agentes",
        vo: "A mão passa para dentro. Com as ferramentas certas, as equipes de negócio não dependem de um prestador para cada ideia. Elas enquadram, testam e entregam seus próprios agentes internos.",
        caption: "Claude Code e Codex. Você descreve, o agente escreve o código, você revisa, você entrega.",
        slug: "outils-agentiques",
        cta: "Abrir o nível 6",
        visual: { ...COMMON_VISUALS.code, alt: "Agente de código trabalhando no terminal com um resumo do trabalho em andamento." },
      },
      {
        n: "07",
        level: "N7",
        banane: "A governança",
        title: "Uma frota trabalha sozinha",
        modeLabel: "O trabalho",
        mode: "Eles rodam sem você",
        shift: true,
        vo: "No fim do caminho, não são mais um ou dois agentes. É uma frota. Você pilota, trata a dívida técnica, controla custos e instala os ciclos que fazem o sistema melhorar com o tempo.",
        caption: "A frota. Todos os agentes em produção, em uma única visão.",
        slug: "optimisation-flotte",
        cta: "Abrir o nível 7",
        visual: { ...COMMON_VISUALS.fleet, alt: "Mapa de agentes em produção agrupados em aquisição, fechamento e entrega." },
      },
    ],
    cartography: {
      hub: "IA conectada diretamente aos seus processos · PME e grande grupo",
      territories: [
        { nom: "Produção de software", sous: "Sites, ferramentas internas, integrações sob medida", chips: ["Sites", "Ferramentas internas", "Integrações"] },
        { nom: "Relatórios", sous: "Seus números sintetizados toda manhã", chips: ["Painéis", "Sínteses", "KPIs"] },
        { nom: "Atualização do CRM", sous: "Fichas limpas, sem digitação manual", chips: ["Notas de ligação", "Follow-up auto", "Dados limpos"] },
        { nom: "Criação de conteúdo", sous: "O que você publica, produzido em série", chips: ["Artigos", "Vídeos", "Newsletters"] },
        { nom: "Alertas", sous: "Ser avisado no momento certo", chips: ["Deals em movimento", "Clientes em risco", "Eventos"] },
        { nom: "Sinais fracos", sous: "O ruído útil: clientes, prospects, mercado", chips: ["Clientes", "Prospects", "Mercado"] },
        { nom: "Segundo cérebro da empresa", sous: "Conhecimento interno atualizado e acessível a cada equipe", chips: ["Memória compartilhada", "Procedimentos", "Busca interna"], wide: true },
      ],
    },
    footer: {
      title: "Sua empresa está em algum ponto desse caminho.",
      body:
        "Suas equipes provavelmente estão espalhadas por vários níveis ao mesmo tempo. Começamos nomeando o nível real, depois implantamos o próximo passo certo, para as pessoas certas.",
      primary: "Pedir o diagnóstico de transformação",
      secondary: "Ver Parrit.ai",
      mailSubject: "O caminho da IA",
    },
  },
  "zh-CN": {
    meta: {
      title: "AI 路线：从第一次聊天到智能体舰队 | Parrit.ai",
      description:
        "一条七步路线，从第一次聊天，到一组能独立工作的智能体。每一步都说明实际部署什么。",
      ogTitle: "AI 路线，一步一步看清楚 | Parrit.ai",
      ogDescription:
        "从第一次聊天到自主运行的智能体舰队：七个成熟度阶段，用具体例子说明。看清你现在的位置。",
      ogLocale: "zh_CN",
      ogAlt: "Parrit.ai 的 AI 路线",
    },
    jsonLdName: "AI 路线，7 个成熟度阶段",
    cartographyLabel:
      "AI 可以覆盖的业务地图：软件生产、报表、CRM、内容、提醒、弱信号监测、企业第二大脑",
    hero: {
      back: "Parrit.ai",
      kicker: "从生成式 AI 到能做事的 AI",
      h1: ["我们把你带到", "真正会行动的 AI。"],
      lede:
        "很多人都在谈 AI 智能体。这里给出一条具体路线：从第一次聊天，到一组能自己工作的智能体。一步一步往下看，谁在做事，每个阶段打开后都有清楚的例子。",
      scroll: "沿着路线往下看",
    },
    steps: [
      {
        n: "01",
        level: "N1",
        banane: "觉醒",
        title: "一切从一次对话开始",
        modeLabel: "工作方式",
        mode: "你说 · 它回答",
        vo: "一开始，就是对话。你在屏幕上问一个问题，它回答。这是第一个动作，也有用。但要记住：这个阶段，AI 只是回答。它还没有行动。",
        caption: "聊天。第一次提问，机器听懂了。",
        slug: "masterclass-ia",
        cta: "打开第 1 阶段",
        visual: { ...COMMON_VISUALS.chat, alt: "一个助手回答直接问题的对话界面。" },
      },
      {
        n: "02",
        level: "N2",
        banane: "使用",
        title: "按业务把 AI 放好",
        modeLabel: "工作方式",
        mode: "你说 · 它记住",
        vo: "很快，一次对话不够用。你按主题、按岗位建立空间：长期项目、内部自动化、客户项目。每个团队都能找回上下文，不必每次重新解释。",
        caption: "项目空间。每个业务一块工作区，并保留记忆。",
        slug: "masterclass-metier",
        cta: "打开第 2 阶段",
        visual: { ...COMMON_VISUALS.projets, alt: "按业务主题和重复工作流整理的项目列表。" },
      },
      {
        n: "03",
        level: "N3",
        banane: "行动",
        title: "把它接到你的工具上",
        modeLabel: "工作方式",
        mode: "你说 · 它进入工具",
        vo: "孤立的 AI 是盲的。你把它接到邮件、日历、文件和浏览器。到了这里，它不只是回答。它可以去查、对比、准备下一步。",
        caption: "连接。Gmail、Calendar、Drive、浏览器，工作面开始打开。",
        slug: "sessions-mcp",
        cta: "打开第 3 阶段",
        visual: { ...COMMON_VISUALS.mcp, alt: "连接 Gmail、Google Calendar、Google Drive 和浏览器控制的菜单。" },
      },
      {
        n: "04",
        level: "N4",
        banane: "诊断",
        title: "先画出你的业务地形",
        modeLabel: "工作方式",
        mode: "你决定交给它什么",
        vo: "建设之前，先画地图。报表、CRM 更新、软件生产、内容、提醒、弱信号、企业记忆，放在同一张图里。AI 直接接入真实流程，不管是 PME 还是大集团。先看全局，再决定从哪里开始。",
        caption: "地图。AI 直接接到你的业务流程。",
        slug: "audit",
        cta: "打开第 4 阶段",
        visual: COMMON_VISUALS.cartography,
      },
      {
        n: "05",
        level: "N5",
        banane: "部署",
        title: "第一个智能体接手",
        modeLabel: "工作方式",
        mode: "它持续独立行动",
        shift: true,
        vo: "到这里，智能体这个词才真正有意义。它不再是你问它答，而是它去做。一个每周都会重复出现的流程，由智能体处理，不需要你重新开口。它准备、记录，把敏感情况交回给人。",
        caption: "第一个智能体。即使你不在，它也在工作。",
        slug: "deploiement-agents",
        cta: "打开第 5 阶段",
        visual: { ...COMMON_VISUALS.agent, alt: "包含触发器、条件、模型、回复和多个工具连接的智能体图。" },
      },
      {
        n: "06",
        level: "N6",
        banane: "自主",
        title: "你的团队自己构建",
        modeLabel: "工作方式",
        mode: "团队自己制造智能体",
        vo: "交接开始。工具到位后，业务团队不用每个想法都等外部服务商。他们自己界定、测试、交付内部智能体。",
        caption: "Claude Code 和 Codex。你描述，智能体写代码，你检查，然后交付。",
        slug: "outils-agentiques",
        cta: "打开第 6 阶段",
        visual: { ...COMMON_VISUALS.code, alt: "代码智能体在终端中工作，并显示当前任务摘要。" },
      },
      {
        n: "07",
        level: "N7",
        banane: "治理",
        title: "一支舰队独立运行",
        modeLabel: "工作方式",
        mode: "它们无需你盯着",
        shift: true,
        vo: "走到最后，就不再是一两个智能体，而是一支舰队。你驾驶它，处理技术债，控制成本，并安装让系统持续改善的循环。",
        caption: "舰队。所有生产中的智能体，在一张视图里。",
        slug: "optimisation-flotte",
        cta: "打开第 7 阶段",
        visual: { ...COMMON_VISUALS.fleet, alt: "围绕获客、成交和交付分组的生产智能体地图。" },
      },
    ],
    cartography: {
      hub: "AI 直接接入你的流程 · PME 和大集团都适用",
      territories: [
        { nom: "软件生产", sous: "网站、内部工具、定制集成", chips: ["网站", "内部工具", "集成"] },
        { nom: "报表", sous: "每天早上整理关键数字", chips: ["仪表盘", "摘要", "KPI"] },
        { nom: "CRM 更新", sous: "资料保持干净，不再手工录入", chips: ["通话记录", "自动跟进", "干净数据"] },
        { nom: "内容生产", sous: "把要发布的内容批量产出", chips: ["文章", "视频", "Newsletter"] },
        { nom: "提醒", sous: "在正确时刻收到信号", chips: ["推进中的交易", "风险客户", "事件"] },
        { nom: "弱信号监测", sous: "从客户、潜在客户和市场里提取有用噪声", chips: ["客户", "潜在客户", "市场"] },
        { nom: "企业第二大脑", sous: "内部知识保持更新，并让每个团队都能访问", chips: ["共享记忆", "流程", "内部搜索"], wide: true },
      ],
    },
    footer: {
      title: "你的公司就在这条路线的某个位置。",
      body:
        "你的团队很可能同时分布在几个阶段。我们先说清真实水平，再部署合适的下一步，交给合适的人。",
      primary: "申请转型诊断",
      secondary: "查看 Parrit.ai",
      mailSubject: "AI 路线",
    },
  },
};

export function getCheminCopy(lang: CheminLang): CheminCopy {
  return COPY[lang];
}

export function getCheminLanguagesMap(route = ""): Record<string, string> {
  return {
    fr: `${SITE_URL}/fr${route}`,
    en: `${SITE_URL}/en${route}`,
    "pt-BR": `${SITE_URL}/pt-BR${route}`,
    "zh-CN": `${SITE_URL}/zh-CN${route}`,
    "x-default": `${SITE_URL}/fr${route}`,
  };
}

export function getCheminItemList(lang: CheminLang) {
  const copy = getCheminCopy(lang);

  return {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: copy.jsonLdName,
    itemListElement: copy.steps.map((step, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: step.title,
      url: `${SITE_URL}/${lang}/${step.slug}`,
    })),
  };
}

function localizedHref(lang: CheminLang, slug: string) {
  return `/${lang}/${slug}`;
}

function Cartographie({
  label,
  hub,
  territories,
}: {
  label: string;
  hub: string;
  territories: Territory[];
}) {
  return (
    <div className="cmap" role="img" aria-label={label}>
      <div className="cmap-hub">{hub}</div>
      <div className="cmap-grid">
        {territories.map((territory) => (
          <div
            className={`cmap-zone ${territory.wide ? "wide" : ""}`}
            key={territory.nom}
          >
            <p className="cmap-nom">{territory.nom}</p>
            <p className="cmap-sous">{territory.sous}</p>
            <div className="cmap-chips">
              {territory.chips.map((chip) => (
                <span className="cmap-chip" key={chip}>
                  {chip}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function Chemin({ lang }: { lang: CheminLang }) {
  const copy = getCheminCopy(lang);
  const itemList = getCheminItemList(lang);
  const mailHref = `mailto:paul.larmaraud@parrit.ai?subject=${encodeURIComponent(copy.footer.mailSubject)}`;

  return (
    <main className="chemin">
      <style>{CSS}</style>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(itemList) }}
      />

      <header className="chemin-hero">
        <Link href={`/${lang}`} className="chemin-back">
          {copy.hero.back}
        </Link>
        <p className="chemin-kicker">{copy.hero.kicker}</p>
        <h1 className="chemin-h1">
          {copy.hero.h1[0]}
          <br />
          {copy.hero.h1[1]}
        </h1>
        <p className="chemin-lede">{copy.hero.lede}</p>
        <span className="chemin-scroll">{copy.hero.scroll} ↓</span>
      </header>

      <div className="chemin-path">
        <span className="chemin-spine" aria-hidden />
        {copy.steps.map((step, index) => (
          <section
            className={`chemin-step ${index % 2 === 0 ? "is-left" : "is-right"}`}
            key={step.n}
          >
            <span className="chemin-node" aria-hidden>
              {step.n}
            </span>

            <div className="chemin-visual">
              <div className={`chemin-frame ${step.visual.kind === "svg" ? "is-svg" : ""}`}>
                {step.visual.kind === "shot" ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={step.visual.src} alt={step.visual.alt} loading="lazy" />
                ) : (
                  <Cartographie
                    label={copy.cartographyLabel}
                    hub={copy.cartography.hub}
                    territories={copy.cartography.territories}
                  />
                )}
              </div>
              <p className="chemin-caption">{step.caption}</p>
            </div>

            <div className="chemin-copy">
              <p className="chemin-tag">
                <span className="chemin-lv">{step.level}</span>
                <span className="chemin-banane">{step.banane}</span>
              </p>
              <h2 className="chemin-title">
                <Link href={localizedHref(lang, step.slug)}>{step.title}</Link>
              </h2>
              <p className={`chemin-mode ${step.shift ? "shift" : ""}`}>
                <span className="chemin-mode-k">{step.modeLabel}</span>
                {step.mode}
              </p>
              <p className="chemin-vo">{step.vo}</p>
              <Link href={localizedHref(lang, step.slug)} className="chemin-link">
                {step.cta} →
              </Link>
            </div>
          </section>
        ))}
      </div>

      <footer className="chemin-cta">
        <h2 className="chemin-cta-h">{copy.footer.title}</h2>
        <p className="chemin-cta-p">{copy.footer.body}</p>
        <div className="chemin-cta-row">
          <a className="chemin-btn primary" href={mailHref}>
            {copy.footer.primary}
          </a>
          <Link className="chemin-btn ghost" href={`/${lang}/os-classic`}>
            {copy.footer.secondary}
          </Link>
        </div>
      </footer>
    </main>
  );
}

const CSS = `
.chemin { background: var(--bg); color: var(--ink); }
.chemin-hero { max-width: 880px; margin: 0 auto; padding: 88px 24px 24px; text-align: center; }
.chemin-back { font-family: var(--font-mono); font-size: 12px; letter-spacing: .14em; text-transform: uppercase; color: var(--muted); text-decoration: none; }
.chemin-kicker { margin: 40px 0 14px; font-family: var(--font-mono); font-size: 12px; letter-spacing: .16em; text-transform: uppercase; color: var(--accent); }
.chemin-h1 { font-size: clamp(30px, 5vw, 52px); line-height: 1.08; font-weight: 800; letter-spacing: -0.02em; margin: 0; }
.chemin-lede { max-width: 660px; margin: 22px auto 0; font-size: 18px; line-height: 1.6; color: var(--muted); }
.chemin-scroll { display: inline-block; margin-top: 30px; font-family: var(--font-mono); font-size: 12px; letter-spacing: .12em; text-transform: uppercase; color: var(--faint); }

.chemin-path { position: relative; max-width: 1120px; margin: 40px auto 0; padding: 20px 24px 40px; }
.chemin-spine { position: absolute; left: 50%; top: 0; bottom: 0; width: 2px; transform: translateX(-50%); background: linear-gradient(var(--dash), var(--dash)); }

.chemin-step { position: relative; display: grid; grid-template-columns: 1fr 1fr; gap: 56px; align-items: center; padding: 56px 0; }
.chemin-step.is-right .chemin-visual { order: 2; }
.chemin-step.is-right .chemin-copy { order: 1; text-align: right; }
.chemin-step.is-right .chemin-tag { justify-content: flex-end; }

.chemin-node { position: absolute; left: 50%; top: 56px; transform: translate(-50%, -4px); width: 46px; height: 46px; border-radius: 50%; background: var(--surface); border: 2px solid var(--accent); color: var(--accent); font-family: var(--font-mono); font-size: 15px; font-weight: 700; display: grid; place-items: center; z-index: 2; box-shadow: var(--shadow-sm); }

.chemin-frame { border-radius: 16px; overflow: hidden; background: var(--card-dark); padding: 12px; border: 1px solid var(--border); box-shadow: var(--shadow-lg); }
.chemin-frame.is-svg { background: var(--surface); padding: 22px; }
.chemin-frame img { display: block; width: 100%; height: auto; border-radius: 8px; }
.chemin-caption { margin: 14px 2px 0; font-size: 13.5px; line-height: 1.5; color: var(--faint); }

.chemin-tag { display: flex; align-items: center; gap: 10px; margin: 0 0 14px; }
.chemin-lv { font-family: var(--font-mono); font-size: 12px; font-weight: 700; letter-spacing: .08em; color: #fff; background: var(--accent); padding: 3px 8px; border-radius: 6px; }
.chemin-banane { font-family: var(--font-mono); font-size: 12px; letter-spacing: .14em; text-transform: uppercase; color: var(--muted); }
.chemin-title { font-size: clamp(22px, 3vw, 30px); line-height: 1.15; font-weight: 800; letter-spacing: -0.015em; margin: 0 0 14px; }
.chemin-title a { color: inherit; text-decoration: none; transition: color .15s ease; }
.chemin-title a:hover { color: var(--accent); }
.chemin-mode { display: inline-flex; align-items: center; gap: 9px; font-family: var(--font-mono); font-size: 13px; letter-spacing: .01em; color: var(--text); background: var(--surface); border: 1px solid var(--line-2); border-radius: 999px; padding: 6px 13px 6px 7px; margin: 0 0 16px; }
.chemin-mode-k { font-size: 10px; font-weight: 700; letter-spacing: .1em; text-transform: uppercase; color: var(--muted); background: var(--band); border-radius: 999px; padding: 3px 8px; }
.chemin-mode.shift { color: var(--accent); border-color: var(--tint-bd); background: var(--tint); font-weight: 600; }
.chemin-mode.shift .chemin-mode-k { color: #fff; background: var(--accent); }
.chemin-step.is-right .chemin-mode { flex-direction: row-reverse; }

.cmap { width: 100%; }
.cmap-hub { font-family: var(--font-mono); font-size: 11.5px; letter-spacing: .04em; color: #fff; background: var(--accent); border-radius: 8px; padding: 9px 12px; text-align: center; margin-bottom: 12px; }
.cmap-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; }
.cmap-zone { background: var(--bg); border: 1px solid var(--line); border-radius: 12px; padding: 12px 13px; }
.cmap-zone.wide { grid-column: 1 / -1; background: var(--tint); border-color: var(--tint-bd); }
.cmap-nom { font-size: 14.5px; font-weight: 700; letter-spacing: -0.01em; margin: 0 0 3px; }
.cmap-zone.wide .cmap-nom { color: var(--accent); }
.cmap-sous { font-family: var(--font-mono); font-size: 10.5px; line-height: 1.4; color: var(--muted); margin: 0 0 9px; }
.cmap-chips { display: flex; flex-wrap: wrap; gap: 6px; }
.cmap-chip { font-family: var(--font-mono); font-size: 10.5px; color: var(--text); background: var(--surface); border: 1px solid var(--line); border-radius: 999px; padding: 3px 9px; }
@media (max-width: 520px) { .cmap-grid { grid-template-columns: 1fr; } }
.chemin-vo { font-size: 17px; line-height: 1.62; color: var(--text); opacity: .82; margin: 0 0 18px; }
.chemin-link { font-family: var(--font-mono); font-size: 13px; font-weight: 600; letter-spacing: .04em; color: var(--accent); text-decoration: none; border-bottom: 1px solid var(--tint-bd); padding-bottom: 2px; }
.chemin-link:hover { border-color: var(--accent); }

.chemin-cta { max-width: 760px; margin: 30px auto 0; padding: 64px 24px 110px; text-align: center; }
.chemin-cta-h { font-size: clamp(24px, 3.6vw, 34px); font-weight: 800; letter-spacing: -0.02em; margin: 0 0 16px; }
.chemin-cta-p { font-size: 17px; line-height: 1.6; color: var(--muted); margin: 0 auto 28px; max-width: 600px; }
.chemin-cta-row { display: flex; gap: 14px; justify-content: center; flex-wrap: wrap; }
.chemin-btn { font-family: var(--font-mono); font-size: 13px; font-weight: 600; letter-spacing: .04em; padding: 13px 22px; border-radius: 10px; text-decoration: none; }
.chemin-btn.primary { background: var(--accent); color: #fff; }
.chemin-btn.primary:hover { background: var(--accent-hover); }
.chemin-btn.ghost { background: transparent; color: var(--ink); border: 1px solid var(--line-2); }
.chemin-btn.ghost:hover { background: var(--band); }

@media (max-width: 760px) {
  .chemin-spine { left: 22px; }
  .chemin-step { grid-template-columns: 1fr; gap: 18px; padding: 28px 0 28px 52px; }
  .chemin-step.is-right .chemin-visual,
  .chemin-step.is-right .chemin-copy { order: initial; text-align: left; }
  .chemin-step.is-right .chemin-tag { justify-content: flex-start; }
  .chemin-node { left: 22px; top: 30px; width: 38px; height: 38px; font-size: 13px; }
}
`;
