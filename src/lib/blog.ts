import { generatedBlogPosts } from "./blog-generated";
import type { PillarSlug } from "./pillars";

export type BlogLocale = "fr" | "en" | "pt-BR";
export type { PillarSlug };

export interface BlogPost {
  slug: string;
  title: string;
  description: string;
  date: string; // ISO date (creation)
  publishedAt: string; // ISO date, when visible publicly (drip schedule)
  updatedAt?: string; // ISO date, true substantive update only
  author: string;
  category: string;
  readingTime: string;
  content: string;
  videoUrl?: string;
  ogImage?: string;
  tags?: readonly string[];
  relatedSlugs?: readonly string[];
  pillar?: PillarSlug;
  tldr?: string;
  faq?: { q: string; a: string }[];
  keyword?: string;
  searchIntent?: "informational" | "commercial" | "transactional";
  sources?: { label: string; url: string }[];
}

interface BlogPostTranslation {
  title: string;
  description: string;
  category: string;
  readingTime: string;
  content: string;
  tldr?: string;
  faq?: { q: string; a: string }[];
}

export interface BlogPostSource {
  slug: string;
  date: string;
  publishedAt?: string; // defaults to `date` if not set
  updatedAt?: string; // defaults to `date` if not set
  author: string;
  videoUrl?: string;
  ogImage?: string;
  tags?: readonly string[];
  relatedSlugs?: readonly string[];
  pillar?: PillarSlug;
  keyword?: string;
  searchIntent?: "informational" | "commercial" | "transactional";
  sources?: { label: string; url: string }[];
  translations: Record<BlogLocale, BlogPostTranslation>;
}

export interface BlogSitemapEntry {
  slug: string;
  lastModified: string;
}

const canonicalPosts: BlogPostSource[] = [
  {
    slug: "evaluation-adoption-sap-intelligence-artificielle",
    date: "2026-04-12",
    author: "Paul Larmaraud",
    pillar: "agents-ia",
    translations: {
      fr: {
        title:
          "Évaluer l'adoption de SAP par l'IA : en finir avec les formations qui ne servent à rien",
        description:
          "Les éditeurs forment, personne n'utilise. Un outil d'évaluation IA mesure la vraie maîtrise de SAP et pilote le change management.",
        category: "SAP & IA",
        readingTime: "6 min",
        content: `
      <p>Les entreprises investissent des centaines de milliers d'euros dans SAP. Puis des dizaines de milliers en formation. Un an plus tard, le constat est toujours le même : personne ne l'utilise correctement. Le problème n'est pas SAP : c'est qu'on ne mesure jamais la vraie maîtrise des utilisateurs.</p>
      <h2>Le trou noir de l'adoption</h2>
      <p>Les éditeurs livrent des formations génériques. Trois jours de slides, un quiz de fin de session, et c'est terminé. Aucun suivi dans le temps. Aucune mesure de ce que les utilisateurs font réellement dans le système. Les mauvaises habitudes s'installent, les contournements se multiplient, et l'investissement SAP ne produit qu'une fraction de sa valeur.</p>
      <h2>Évaluer au lieu de former</h2>
      <p>L'approche inverse fonctionne : au lieu de former puis espérer, on évalue d'abord. Un outil d'évaluation IA pose des questions concrètes : "Comment créez-vous une commande d'achat ?" : et analyse la réponse. La méthode est-elle correcte ? Existe-t-il un chemin plus rapide ? L'utilisateur connaît-il les transactions clés ?</p>
      <p>Le résultat : un score de maîtrise individuel, par module, par équipe. Pas un ressenti : une mesure objective.</p>
      <h2>Du scoring au change management</h2>
      <p>Le score n'est pas une fin en soi. Il alimente des tableaux de bord qui permettent aux directions de piloter l'adoption : quels modules sont sous-utilisés, quelles équipes ont besoin d'accompagnement, où se concentrent les erreurs de process. Le change management devient piloté par la donnée au lieu d'être piloté par l'intuition.</p>
      <h2>Pourquoi l'IA change la donne</h2>
      <p>Un quiz classique est statique : 20 questions identiques pour tout le monde. Un outil d'évaluation IA s'adapte : il comprend les réponses en langage naturel, détecte les méthodes sous-optimales, et propose des parcours de montée en compétence personnalisés. Il peut évaluer des centaines d'utilisateurs simultanément sans mobiliser de formateurs.</p>
      <h2>L'avantage décisif : pas de connexion IT requise</h2>
      <p>Contrairement aux agents qui s'intègrent directement dans SAP (avec les risques de mises à jour cassantes et de validations IT interminables), un outil d'évaluation fonctionne en parallèle du système. Pas de connexion au SI, pas de compliance à négocier, pas de risque pour la production. Déployable en semaines, pas en mois.</p>
    `,
      },
      en: {
        title:
          "Measuring SAP adoption with AI: putting an end to useless training",
        description:
          "Vendors train, no one uses it. An AI evaluation tool measures real SAP proficiency and drives change management.",
        category: "SAP & AI",
        readingTime: "6 min",
        content: `
      <p>Companies invest hundreds of thousands of euros in SAP. Then tens of thousands in training. A year later, the verdict is always the same: nobody uses it properly. The problem isn't SAP : it's that real user proficiency is never measured.</p>
      <h2>The adoption black hole</h2>
      <p>Vendors deliver generic training. Three days of slides, an end-of-session quiz, and that's it. No follow-up over time. No measurement of what users actually do in the system. Bad habits set in, workarounds multiply, and the SAP investment delivers only a fraction of its value.</p>
      <h2>Measure instead of train</h2>
      <p>The opposite approach works: instead of training and hoping, measure first. An AI evaluation tool asks concrete questions : "How do you create a purchase order?" : and analyzes the answer. Is the method correct? Is there a faster path? Does the user know the key transactions?</p>
      <p>The result: an individual proficiency score, per module, per team. Not a feeling : an objective measurement.</p>
      <h2>From scoring to change management</h2>
      <p>The score isn't an end in itself. It feeds dashboards that let leadership steer adoption: which modules are underused, which teams need support, where process errors concentrate. Change management becomes data-driven instead of intuition-driven.</p>
      <h2>Why AI changes the game</h2>
      <p>A traditional quiz is static : 20 identical questions for everyone. An AI evaluation tool adapts: it understands natural-language answers, detects sub-optimal methods, and proposes personalized learning paths. It can evaluate hundreds of users simultaneously without mobilizing trainers.</p>
      <h2>The decisive advantage: no IT connection required</h2>
      <p>Unlike agents that integrate directly into SAP (with the risk of breaking updates and endless IT approvals), an evaluation tool runs alongside the system. No connection to the information system, no compliance to negotiate, no risk to production. Deployable in weeks, not months.</p>
    `,
      },
      "pt-BR": {
        title:
          "Avaliar a adoção do SAP com IA: o fim dos treinamentos que não servem para nada",
        description:
          "Os fornecedores treinam, ninguém usa. Uma ferramenta de avaliação por IA mede o domínio real do SAP e conduz o change management.",
        category: "SAP & IA",
        readingTime: "6 min",
        content: `
      <p>As empresas investem centenas de milhares de euros em SAP. Depois dezenas de milhares em treinamento. Um ano depois, o diagnóstico é sempre o mesmo: ninguém usa corretamente. O problema não é o SAP : é que nunca se mede o domínio real dos usuários.</p>
      <h2>O buraco negro da adoção</h2>
      <p>Os fornecedores entregam treinamentos genéricos. Três dias de slides, um quiz no fim da sessão, e acabou. Nenhum acompanhamento ao longo do tempo. Nenhuma medição do que os usuários realmente fazem no sistema. Os maus hábitos se instalam, os contornos se multiplicam, e o investimento em SAP entrega apenas uma fração do seu valor.</p>
      <h2>Avaliar em vez de treinar</h2>
      <p>A abordagem inversa funciona: em vez de treinar e torcer, avaliar primeiro. Uma ferramenta de avaliação por IA faz perguntas concretas : "Como você cria um pedido de compra?" : e analisa a resposta. O método está correto? Existe um caminho mais rápido? O usuário conhece as transações-chave?</p>
      <p>O resultado: uma pontuação de domínio individual, por módulo, por equipe. Não uma percepção : uma medição objetiva.</p>
      <h2>Do scoring ao change management</h2>
      <p>A pontuação não é um fim em si. Ela alimenta dashboards que permitem às lideranças pilotar a adoção: quais módulos estão subutilizados, quais equipes precisam de apoio, onde se concentram os erros de processo. O change management passa a ser guiado por dados, não por intuição.</p>
      <h2>Por que a IA muda o jogo</h2>
      <p>Um quiz tradicional é estático : 20 perguntas idênticas para todo mundo. Uma ferramenta de avaliação por IA se adapta: entende respostas em linguagem natural, detecta métodos subótimos e propõe trilhas de capacitação personalizadas. Pode avaliar centenas de usuários simultaneamente sem mobilizar formadores.</p>
      <h2>A vantagem decisiva: nenhuma conexão de TI exigida</h2>
      <p>Ao contrário dos agentes que se integram diretamente ao SAP (com riscos de atualizações que quebram o sistema e validações de TI intermináveis), uma ferramenta de avaliação funciona em paralelo ao sistema. Sem conexão ao sistema de informação, sem compliance a negociar, sem risco para a produção. Implantável em semanas, não em meses.</p>
    `,
      },
    },
  },
  {
    slug: "crm-automatise-pme-artisans",
    date: "2026-04-08",
    author: "Paul Larmaraud",
    pillar: "logiciel-ia-sur-mesure",
    translations: {
      fr: {
        title: "CRM automatisé pour PME et artisans : fini les relances oubliées",
        description:
          "Un CRM qui relance vos clients automatiquement, détecte les saisons creuses et envoie les bons messages au bon moment.",
        category: "CRM & Automatisation",
        readingTime: "5 min",
        content: `
      <p>Pour un artisan ou une PME de services, le carnet de commandes se gère souvent au feeling. Les relances clients partent en retard : ou pas du tout. Les périodes creuses arrivent sans préavis. On perd du chiffre d'affaires par simple oubli.</p>
      <h2>Le problème : un CRM que personne n'utilise</h2>
      <p>La plupart des PME ont essayé un CRM. Excel, HubSpot, Axonaut : peu importe. Le résultat est toujours le même : après trois semaines, personne ne le remplit. L'outil devient une base de données morte.</p>
      <p>La raison est simple : un CRM classique demande de la saisie. Et la saisie, c'est exactement ce que les artisans et les commerciaux détestent faire.</p>
      <h2>La solution : un CRM qui travaille tout seul</h2>
      <p>Un CRM automatisé par IA inverse la logique. Au lieu de demander à l'utilisateur de remplir des champs, le système capte les informations depuis les emails, les appels et les messages WhatsApp. Il détecte les opportunités de relance. Il envoie les messages automatiquement.</p>
      <p>Le gérant ne gère plus le CRM. Le CRM gère les relances pour lui.</p>
      <h2>Les alertes saisonnières : anticiper au lieu de subir</h2>
      <p>Un paysagiste sait que mars-avril est sa haute saison. Mais prépare-t-il ses relances en janvier ? Rarement. Un CRM automatisé détecte les cycles passés et déclenche les campagnes de relance au bon moment : avant que le client n'appelle un concurrent.</p>
      <h2>Résultat concret</h2>
      <p>Les entreprises de services qui automatisent leurs relances observent en moyenne +20 à 30% de taux de réponse, zéro client oublié, et plusieurs heures par semaine récupérées par le dirigeant.</p>
    `,
      },
      en: {
        title:
          "Automated CRM for SMEs and tradespeople: no more forgotten follow-ups",
        description:
          "A CRM that follows up with your customers automatically, detects slow seasons and sends the right messages at the right time.",
        category: "CRM & Automation",
        readingTime: "5 min",
        content: `
      <p>For a tradesperson or a small service company, the order book is often managed by gut feel. Customer follow-ups go out late : or not at all. Slow periods arrive without warning. Revenue leaks through sheer forgetfulness.</p>
      <h2>The problem: a CRM nobody uses</h2>
      <p>Most SMEs have tried a CRM. Excel, HubSpot, Axonaut : it doesn't matter. The result is always the same: after three weeks, nobody fills it in. The tool becomes a dead database.</p>
      <p>The reason is simple: a classic CRM demands manual entry. And manual entry is exactly what tradespeople and sales reps hate doing.</p>
      <h2>The solution: a CRM that works on its own</h2>
      <p>An AI-powered CRM flips the logic. Instead of asking the user to fill in fields, the system captures information from emails, calls and WhatsApp messages. It detects follow-up opportunities. It sends the messages automatically.</p>
      <p>The owner no longer manages the CRM. The CRM manages follow-ups for them.</p>
      <h2>Seasonal alerts: anticipate instead of react</h2>
      <p>A landscaper knows March-April is peak season. But do they prepare their outreach in January? Rarely. An automated CRM detects past cycles and triggers campaigns at the right moment : before the customer calls a competitor.</p>
      <h2>Concrete result</h2>
      <p>Service businesses that automate their follow-ups typically see +20 to 30% response rates, zero forgotten customers, and several hours per week recovered by the owner.</p>
    `,
      },
      "pt-BR": {
        title:
          "CRM automatizado para PMEs e autônomos: fim dos follow-ups esquecidos",
        description:
          "Um CRM que acompanha seus clientes automaticamente, detecta temporadas baixas e envia as mensagens certas no momento certo.",
        category: "CRM & Automação",
        readingTime: "5 min",
        content: `
      <p>Para um autônomo ou uma pequena empresa de serviços, a carteira de pedidos costuma ser gerida no feeling. Os follow-ups de clientes saem atrasados : ou nem saem. Os períodos fracos chegam sem aviso. Perde-se faturamento por puro esquecimento.</p>
      <h2>O problema: um CRM que ninguém usa</h2>
      <p>A maior parte das PMEs já tentou um CRM. Excel, HubSpot, Axonaut : tanto faz. O resultado é sempre o mesmo: depois de três semanas, ninguém preenche. A ferramenta vira um banco de dados morto.</p>
      <p>A razão é simples: um CRM tradicional exige digitação manual. E digitação manual é exatamente o que autônomos e vendedores odeiam fazer.</p>
      <h2>A solução: um CRM que trabalha sozinho</h2>
      <p>Um CRM automatizado por IA inverte a lógica. Em vez de pedir que o usuário preencha campos, o sistema capta as informações dos e-mails, das ligações e das mensagens de WhatsApp. Detecta oportunidades de follow-up. Envia as mensagens automaticamente.</p>
      <p>O gestor não gerencia mais o CRM. O CRM cuida dos follow-ups por ele.</p>
      <h2>Alertas sazonais: antecipar em vez de reagir</h2>
      <p>Um paisagista sabe que março-abril é a alta temporada. Mas prepara os contatos em janeiro? Raramente. Um CRM automatizado detecta os ciclos passados e dispara as campanhas no momento certo : antes que o cliente ligue para um concorrente.</p>
      <h2>Resultado concreto</h2>
      <p>As empresas de serviços que automatizam seus follow-ups observam em média +20 a 30% de taxa de resposta, zero cliente esquecido, e várias horas por semana recuperadas pelo dirigente.</p>
    `,
      },
    },
  },
  {
    slug: "agent-whatsapp-business-entreprise",
    date: "2026-04-02",
    author: "Paul Larmaraud",
    pillar: "agents-ia",
    translations: {
      fr: {
        title:
          "Agent WhatsApp Business : automatiser la relation client sans perdre le contact humain",
        description:
          "WhatsApp est le canal préféré de vos clients. Un agent IA peut y répondre, qualifier et relancer : tout en gardant votre ton.",
        category: "WhatsApp & IA",
        readingTime: "4 min",
        content: `
      <p>En France, 78% des professionnels utilisent WhatsApp pour communiquer avec leurs clients. Pourtant, la plupart gèrent ces conversations manuellement : entre deux rendez-vous, le soir, le week-end. C'est épuisant et ça laisse des messages sans réponse.</p>
      <h2>Pourquoi WhatsApp et pas un assistant conversationnel sur votre site</h2>
      <p>Vos clients sont déjà sur WhatsApp. Ils y sont à l'aise, ils y répondent vite, ils y font confiance. Un assistant conversationnel sur votre site web, personne ne l'utilise. Un agent WhatsApp, tout le monde l'adopte : parce qu'il est là où les gens vivent.</p>
      <h2>Ce que fait un agent WhatsApp IA</h2>
      <p>L'agent répond aux messages entrants en reprenant votre ton et votre manière de parler. Il qualifie les demandes : devis, information, urgence. Il programme des relances automatiques. Il met à jour votre CRM en temps réel.</p>
      <p>Et quand la conversation nécessite un humain : une négociation, un cas complexe : il passe la main proprement avec tout le contexte.</p>
      <h2>La ligne rouge : ne jamais mentir au client</h2>
      <p>Un agent WhatsApp bien conçu ne se fait pas passer pour un humain. Il est transparent. Il dit "je suis l'assistant de [votre nom]" et agit en conséquence. La confiance du client est non négociable.</p>
      <h2>Impact mesurable</h2>
      <p>Temps de réponse moyen divisé par 10. Taux de conversion des demandes entrantes en hausse de 35%. Et le dirigeant récupère ses soirées.</p>
    `,
      },
      en: {
        title:
          "WhatsApp Business agent: automating customer relations without losing the human touch",
        description:
          "WhatsApp is your customers' favorite channel. An AI agent can respond, qualify and follow up : all while keeping your tone.",
        category: "WhatsApp & AI",
        readingTime: "4 min",
        content: `
      <p>In France, 78% of professionals use WhatsApp to communicate with their customers. Yet most handle these conversations manually : between meetings, in the evening, on weekends. It's exhausting and leaves messages unanswered.</p>
      <h2>Why WhatsApp and not a website assistant</h2>
      <p>Your customers are already on WhatsApp. They're comfortable there, they respond quickly, they trust it. A website assistant : nobody uses it. A WhatsApp agent : everyone adopts it, because it lives where people already live.</p>
      <h2>What an AI WhatsApp agent does</h2>
      <p>The agent replies to incoming messages while matching your tone and your way of speaking. It qualifies requests: quote, information, urgent. It schedules automatic follow-ups. It updates your CRM in real time.</p>
      <p>And when a conversation needs a human : a negotiation, a complex case : it hands over cleanly with full context.</p>
      <h2>The red line: never lie to the customer</h2>
      <p>A well-designed WhatsApp agent does not pretend to be human. It's transparent. It says "I'm [your name]'s assistant" and acts accordingly. Customer trust is non-negotiable.</p>
      <h2>Measurable impact</h2>
      <p>Average response time divided by 10. Inbound request conversion rate up 35%. And the owner gets their evenings back.</p>
    `,
      },
      "pt-BR": {
        title:
          "Agente WhatsApp Business: automatizar o relacionamento com clientes sem perder o toque humano",
        description:
          "O WhatsApp é o canal preferido dos seus clientes. Um agente de IA pode responder, qualificar e fazer follow-up : mantendo o seu tom.",
        category: "WhatsApp & IA",
        readingTime: "4 min",
        content: `
      <p>No Brasil, o WhatsApp é o canal principal de contato com os clientes para a imensa maioria das empresas. Ainda assim, a maior parte trata essas conversas manualmente : entre reuniões, à noite, no fim de semana. É exaustivo e deixa mensagens sem resposta.</p>
      <h2>Por que WhatsApp, e não um assistente de site</h2>
      <p>Seus clientes já estão no WhatsApp. Eles se sentem à vontade, respondem rápido, confiam no canal. Um assistente de site, ninguém usa. Um agente no WhatsApp, todo mundo adota : porque está onde as pessoas já estão.</p>
      <h2>O que um agente de IA no WhatsApp faz</h2>
      <p>O agente responde às mensagens recebidas adotando o seu tom e o seu jeito de falar. Qualifica as demandas: orçamento, informação, urgência. Agenda follow-ups automáticos. Atualiza o seu CRM em tempo real.</p>
      <p>E quando a conversa exige um humano : uma negociação, um caso complexo : ele passa o bastão de forma limpa, com todo o contexto.</p>
      <h2>A linha vermelha: nunca mentir para o cliente</h2>
      <p>Um agente de WhatsApp bem desenhado não se passa por humano. Ele é transparente. Diz "sou o assistente de [seu nome]" e age nessa linha. A confiança do cliente não é negociável.</p>
      <h2>Impacto mensurável</h2>
      <p>Tempo médio de resposta dividido por 10. Taxa de conversão de demandas recebidas +35%. E o dirigente recupera as noites.</p>
    `,
      },
    },
  },
  {
    slug: "veille-juridique-automatisee-avocats",
    date: "2026-03-25",
    author: "Paul Larmaraud",
    pillar: "agents-ia",
    translations: {
      fr: {
        title:
          "Veille juridique automatisée pour avocats : ne plus jamais rater une évolution légale",
        description:
          "Comment l'IA surveille Légifrance, les cours d'appel et la doctrine pour livrer un briefing personnalisé chaque lundi matin.",
        category: "Juridique & IA",
        readingTime: "5 min",
        content: `
      <p>Un avocat doit rester à jour sur les évolutions législatives, la jurisprudence et la doctrine. En pratique, cette veille passe souvent à la trappe : noyée sous les dossiers clients et les audiences.</p>
      <h2>Le coût de la veille manuelle</h2>
      <p>Surveiller Légifrance, les décisions de cours d'appel, les publications doctrinales : c'est un travail de fond qui demande au minimum 2 à 3 heures par semaine pour être fait sérieusement. Heures que la plupart des avocats n'ont pas.</p>
      <p>Résultat : on rate une réforme, on découvre un revirement de jurisprudence en plein dossier, on perd en crédibilité face au client.</p>
      <h2>L'IA comme associé de veille</h2>
      <p>Un système de veille automatisé scanne les sources pertinentes pour chaque domaine de pratique : droit des sociétés, droit du travail, contentieux commercial. Il filtre le bruit, extrait l'essentiel, et livre un briefing synthétique chaque semaine.</p>
      <p>Pas un résumé générique : un briefing ciblé sur vos domaines d'expertise, avec les références complètes et les implications pratiques.</p>
      <h2>Le format qui fonctionne</h2>
      <p>Un email hebdomadaire, toujours au même moment. Cinq rubriques maximum. Chaque point en trois lignes : ce qui a changé, pourquoi c'est important, ce qu'il faut faire. Liens vers les sources. Durée de lecture : 3 minutes.</p>
      <h2>Ce que cela change pour un cabinet</h2>
      <p>Le cabinet gagne en réactivité vis-à-vis de ses clients. Il peut les alerter proactivement sur les évolutions qui les concernent : avant même qu'ils ne posent la question. C'est un levier de fidélisation puissant.</p>
    `,
      },
      en: {
        title:
          "Automated legal intelligence for lawyers: never miss a legal development again",
        description:
          "How AI monitors case law, appeals courts and legal doctrine to deliver a personalized briefing every Monday morning.",
        category: "Legal & AI",
        readingTime: "5 min",
        content: `
      <p>A lawyer has to stay current on legislative changes, case law and legal doctrine. In practice, this watch often falls by the wayside : drowned under client files and hearings.</p>
      <h2>The cost of manual monitoring</h2>
      <p>Monitoring official legal sources, appeals court rulings, doctrinal publications : it's serious work that requires at least 2 to 3 hours per week to be done properly. Hours most lawyers don't have.</p>
      <p>The consequence: you miss a reform, you discover a shift in case law mid-matter, you lose credibility with your client.</p>
      <h2>AI as your monitoring partner</h2>
      <p>An automated intelligence system scans the relevant sources for each practice area: corporate law, employment law, commercial litigation. It filters the noise, extracts the essentials, and delivers a synthetic briefing each week.</p>
      <p>Not a generic summary : a briefing targeted at your areas of expertise, with full references and practical implications.</p>
      <h2>The format that works</h2>
      <p>A weekly email, always at the same time. Five sections maximum. Each item in three lines: what changed, why it matters, what to do. Links to sources. Reading time: 3 minutes.</p>
      <h2>What it changes for a firm</h2>
      <p>The firm gains responsiveness toward its clients. It can alert them proactively about developments that affect them : before they even ask. That's a powerful retention lever.</p>
    `,
      },
      "pt-BR": {
        title:
          "Monitoramento jurídico automatizado para advogados: nunca mais perder uma evolução legal",
        description:
          "Como a IA monitora jurisprudência, tribunais e doutrina para entregar um briefing personalizado toda segunda de manhã.",
        category: "Jurídico & IA",
        readingTime: "5 min",
        content: `
      <p>Um advogado precisa se manter atualizado sobre mudanças legislativas, jurisprudência e doutrina. Na prática, esse monitoramento costuma ficar para depois : sufocado pelos dossiês dos clientes e pelas audiências.</p>
      <h2>O custo do monitoramento manual</h2>
      <p>Acompanhar as fontes oficiais, as decisões dos tribunais, as publicações doutrinárias : é um trabalho de fundo que exige no mínimo 2 a 3 horas por semana para ser feito a sério. Horas que a maior parte dos advogados não tem.</p>
      <p>O resultado: perde-se uma reforma, descobre-se uma mudança de jurisprudência no meio de um caso, perde-se credibilidade diante do cliente.</p>
      <h2>A IA como sócio de monitoramento</h2>
      <p>Um sistema de monitoramento automatizado varre as fontes relevantes para cada área de atuação: direito societário, direito do trabalho, contencioso comercial. Filtra o ruído, extrai o essencial e entrega um briefing sintético toda semana.</p>
      <p>Não um resumo genérico : um briefing focado nas suas áreas de expertise, com as referências completas e as implicações práticas.</p>
      <h2>O formato que funciona</h2>
      <p>Um e-mail semanal, sempre no mesmo horário. No máximo cinco seções. Cada ponto em três linhas: o que mudou, por que é importante, o que fazer. Links para as fontes. Tempo de leitura: 3 minutos.</p>
      <h2>O que isso muda para um escritório</h2>
      <p>O escritório ganha em reatividade diante dos clientes. Pode alertá-los proativamente sobre as evoluções que os afetam : antes mesmo que perguntem. É uma alavanca poderosa de fidelização.</p>
    `,
      },
    },
  },
  {
    slug: "facturation-automatique-ia-pme",
    date: "2026-03-18",
    author: "Paul Larmaraud",
    pillar: "logiciel-ia-sur-mesure",
    translations: {
      fr: {
        title: "Facturation automatique par IA : zéro saisie, zéro oubli",
        description:
          "Vos factures se génèrent, s'envoient et se rapprochent automatiquement. Votre comptabilité se fait toute seule.",
        category: "Comptabilité & IA",
        readingTime: "4 min",
        content: `
      <p>La facturation est le cauchemar silencieux des indépendants et des petites structures. On oublie d'envoyer une facture. On ne relance pas. On passe des heures à rapprocher les paiements. Et le comptable reçoit un dossier en vrac en fin de trimestre.</p>
      <h2>Le flux classique (et ses fuites)</h2>
      <p>Prestation terminée → créer la facture (si on y pense) → l'envoyer (si on a le temps) → vérifier le paiement (si on s'en souvient) → rapprocher dans la compta (si on sait comment). À chaque étape, une fuite potentielle.</p>
      <h2>L'automatisation bout en bout</h2>
      <p>Un agent IA connecté à votre banque et à votre boîte email peut automatiser toute la chaîne. Il détecte les factures reçues, les rattache aux transactions bancaires, génère vos factures de vente, et alerte en cas de paiement manquant.</p>
      <p>Le format Factur-X (PDF lisible par les humains ET par les machines) garantit la conformité avec les nouvelles obligations de facturation électronique.</p>
      <h2>Le résultat</h2>
      <p>Zéro facture oubliée. Zéro saisie manuelle. Un dossier comptable propre en permanence. Et surtout : une trésorerie qui respire parce que les relances partent automatiquement.</p>
    `,
      },
      en: {
        title: "Automated invoicing with AI: zero entry, zero forgotten invoices",
        description:
          "Your invoices are generated, sent and reconciled automatically. Your bookkeeping runs itself.",
        category: "Accounting & AI",
        readingTime: "4 min",
        content: `
      <p>Invoicing is the silent nightmare of freelancers and small companies. You forget to send an invoice. You don't follow up. You spend hours reconciling payments. And your accountant gets a pile of unsorted files at the end of each quarter.</p>
      <h2>The classic flow (and its leaks)</h2>
      <p>Engagement complete → create the invoice (if you remember) → send it (if you have time) → check the payment (if you think of it) → reconcile in accounting (if you know how). At every step, a potential leak.</p>
      <h2>End-to-end automation</h2>
      <p>An AI agent connected to your bank and your inbox can automate the whole chain. It detects incoming invoices, matches them to bank transactions, generates your outgoing invoices, and alerts on missing payments.</p>
      <p>The Factur-X format (a PDF readable by humans AND machines) ensures compliance with the new electronic invoicing requirements rolling out across Europe.</p>
      <h2>The result</h2>
      <p>Zero forgotten invoices. Zero manual entry. A clean accounting file, all the time. And most importantly: cash flow that breathes, because follow-ups go out automatically.</p>
    `,
      },
      "pt-BR": {
        title: "Faturamento automático com IA: zero digitação, zero esquecimento",
        description:
          "Suas notas e cobranças são geradas, enviadas e conciliadas automaticamente. Seu financeiro anda sozinho.",
        category: "Contabilidade & IA",
        readingTime: "4 min",
        content: `
      <p>O faturamento é o pesadelo silencioso de autônomos e pequenas estruturas. Esquece-se de enviar uma fatura. Não se faz o follow-up. Passam-se horas conciliando pagamentos. E o contador recebe uma pilha desorganizada no fim do trimestre.</p>
      <h2>O fluxo clássico (e suas brechas)</h2>
      <p>Serviço entregue → criar a fatura (se lembrar) → enviá-la (se tiver tempo) → verificar o pagamento (se prestar atenção) → conciliar na contabilidade (se souber como). Em cada etapa, uma brecha em potencial.</p>
      <h2>A automação de ponta a ponta</h2>
      <p>Um agente de IA conectado ao seu banco e ao seu e-mail pode automatizar toda a cadeia. Ele detecta as faturas recebidas, associa às transações bancárias, gera as cobranças enviadas e alerta em caso de pagamento em atraso.</p>
      <p>O formato Factur-X (PDF legível por humanos E por máquinas) garante a conformidade com as novas obrigações de faturamento eletrônico.</p>
      <h2>O resultado</h2>
      <p>Zero fatura esquecida. Zero digitação manual. Um dossiê contábil sempre limpo. E, sobretudo: um fluxo de caixa que respira, porque os follow-ups saem automaticamente.</p>
    `,
      },
    },
  },
  {
    slug: "prospection-ia-signaux-podcasts-linkedin",
    date: "2026-03-10",
    author: "Paul Larmaraud",
    pillar: "agents-ia",
    translations: {
      fr: {
        title:
          "Prospection IA : détecter vos futurs clients grâce aux signaux faibles",
        description:
          "Podcasts, posts LinkedIn, événements B2B : l'IA identifie les décideurs qui ont besoin de vous avant qu'ils ne le sachent.",
        category: "Prospection & IA",
        readingTime: "5 min",
        content: `
      <p>La prospection classique est un jeu de volume : envoyer 500 emails pour obtenir 5 réponses. La prospection par signaux est un jeu de timing : contacter la bonne personne au bon moment, avec le bon message.</p>
      <h2>Qu'est-ce qu'un signal faible</h2>
      <p>Un dirigeant qui passe dans un podcast pour parler de ses défis opérationnels. Un décideur qui commente un post LinkedIn sur l'automatisation. Un speaker à Vivatech qui mentionne un problème que vous résolvez. Ce sont des signaux d'intention : bien plus puissants qu'une liste achetée.</p>
      <h2>Le pipeline de détection</h2>
      <p>L'IA surveille en continu les sources de signaux : chaînes YouTube de podcasts business, posts d'influenceurs LinkedIn, programmes d'événements B2B. Elle transcrit, analyse et filtre. Seuls les signaux pertinents remontent : avec un message de prospection personnalisé prêt à l'envoi.</p>
      <h2>Personnalisation à l'échelle</h2>
      <p>Quand vous contactez quelqu'un en disant "j'ai écouté votre passage dans [podcast] et votre point sur [sujet spécifique] m'a interpellé", le taux de réponse explose. Ce n'est pas de la flatterie : c'est de la pertinence. L'IA rend cette personnalisation possible à grande échelle.</p>
      <h2>Les chiffres</h2>
      <p>La prospection par signaux génère typiquement un taux de réponse de 25 à 40%, contre 2 à 5% en cold email classique. La différence : le timing et la pertinence du message.</p>
    `,
      },
      en: {
        title:
          "AI prospecting: spotting your next customers through weak signals",
        description:
          "Podcasts, LinkedIn posts, B2B events : AI identifies the decision-makers who need you before they know it themselves.",
        category: "Prospecting & AI",
        readingTime: "5 min",
        content: `
      <p>Classic prospecting is a volume game: send 500 emails to get 5 replies. Signal-based prospecting is a timing game: contact the right person at the right moment, with the right message.</p>
      <h2>What is a weak signal</h2>
      <p>An executive appearing on a podcast to talk about operational challenges. A decision-maker commenting on a LinkedIn post about automation. A speaker at a B2B event mentioning a problem you solve. These are intent signals : far more powerful than a bought list.</p>
      <h2>The detection pipeline</h2>
      <p>AI continuously monitors signal sources: YouTube channels of business podcasts, posts from LinkedIn influencers, B2B event programs. It transcribes, analyzes and filters. Only the relevant signals surface : with a personalized outreach message ready to send.</p>
      <h2>Personalization at scale</h2>
      <p>When you contact someone with "I listened to your podcast appearance and your point on [specific topic] caught my attention," reply rates explode. That's not flattery : it's relevance. AI makes this kind of personalization possible at scale.</p>
      <h2>The numbers</h2>
      <p>Signal-based prospecting typically generates 25 to 40% reply rates, vs 2 to 5% for classic cold email. The difference: timing and message relevance.</p>
    `,
      },
      "pt-BR": {
        title:
          "Prospecção com IA: identificar seus próximos clientes pelos sinais fracos",
        description:
          "Podcasts, posts no LinkedIn, eventos B2B : a IA identifica os decisores que precisam de você antes que eles mesmos saibam.",
        category: "Prospecção & IA",
        readingTime: "5 min",
        content: `
      <p>A prospecção clássica é um jogo de volume: enviar 500 e-mails para obter 5 respostas. A prospecção por sinais é um jogo de timing: contatar a pessoa certa no momento certo, com a mensagem certa.</p>
      <h2>O que é um sinal fraco</h2>
      <p>Um executivo que passa em um podcast falando sobre seus desafios operacionais. Um decisor que comenta um post no LinkedIn sobre automação. Um palestrante em um evento B2B que menciona um problema que você resolve. Esses são sinais de intenção : muito mais poderosos do que uma lista comprada.</p>
      <h2>O pipeline de detecção</h2>
      <p>A IA monitora continuamente as fontes de sinais: canais do YouTube de podcasts de negócios, posts de influenciadores no LinkedIn, programas de eventos B2B. Transcreve, analisa e filtra. Só os sinais relevantes sobem : com uma mensagem de prospecção personalizada pronta para envio.</p>
      <h2>Personalização em escala</h2>
      <p>Quando você contata alguém dizendo "escutei sua participação em [podcast] e o seu ponto sobre [tema específico] me chamou a atenção", a taxa de resposta explode. Não é bajulação : é relevância. A IA torna esse tipo de personalização possível em escala.</p>
      <h2>Os números</h2>
      <p>A prospecção por sinais gera tipicamente uma taxa de resposta de 25 a 40%, contra 2 a 5% no cold e-mail clássico. A diferença: timing e relevância da mensagem.</p>
    `,
      },
    },
  },
  {
    slug: "securite-agents-ia-entreprise",
    date: "2026-06-29",
    publishedAt: "2026-06-29",
    updatedAt: "2026-06-29",
    author: "Paul Larmaraud",
    pillar: "agents-ia",
    keyword: "sécurité des agents IA en entreprise",
    searchIntent: "informational",
    sources: [
      {
        label: "OWASP Top 10 for LLM Applications",
        url: "https://owasp.org/www-project-top-10-for-large-language-model-applications/",
      },
      {
        label: "CNIL – Intelligence artificielle",
        url: "https://www.cnil.fr/fr/intelligence-artificielle",
      },
      {
        label: "CNIL – RGPD",
        url: "https://www.cnil.fr/fr/reglement-europeen-protection-donnees",
      },
      {
        label: "Anthropic – Trust Center",
        url: "https://trust.anthropic.com/",
      },
    ],
    tags: ["sécurité", "agents IA", "RGPD", "souveraineté"],
    relatedSlugs: [
      "agent-whatsapp-business-entreprise",
      "veille-juridique-automatisee-avocats",
    ],
    translations: {
      fr: {
        title:
          "Sécurité des agents IA en entreprise : les règles qu'on applique",
        description:
          "Déployer un agent IA, c'est lui donner accès à vos données. Les 8 règles de sécurité qu'on applique à chaque déploiement, et les questions à poser à un prestataire.",
        category: "Sécurité & IA",
        readingTime: "6 min",
        tldr: "Déployer un agent IA, c'est lui donner accès à vos données et à vos outils. La sécurité ne se joue pas sur la question « l'IA est-elle dangereuse », mais sur ce qu'on l'autorise à faire et sur ce qui reste verrouillé. Voici les huit règles appliquées à chaque déploiement, et les questions à poser à n'importe quel prestataire pour vérifier qu'il les respecte.",
        faq: [
          {
            q: "Mes données servent-elles à entraîner l'IA ?",
            a: "Non. Les agents qu'on déploie passent par des accès qui interdisent la réutilisation de vos données pour l'entraînement, et les données restent dans votre infrastructure.",
          },
          {
            q: "Un agent peut-il agir tout seul sans qu'on le sache ?",
            a: "Non sur l'irréversible. Toute action qui sort de l'entreprise ou qu'on ne peut pas annuler demande une validation humaine. Le reste, automatisable sans risque, est tracé.",
          },
          {
            q: "Est-ce compatible avec le RGPD ?",
            a: "Oui, c'est même un point de départ : données minimisées, hébergement maîtrisé, cloisonnement par utilisateur, et possibilité de router vers des modèles européens.",
          },
          {
            q: "Qu'est-ce qui me reste si j'arrête ?",
            a: "Le code et le système, qui tournent sur votre infrastructure. Vous n'êtes pas locataire d'une boîte noire.",
          },
        ],
        content: `<p>Un agent IA ne reste pas à répondre dans un coin. Il lit vos fichiers, agit dans vos logiciels, déclenche des actions. C'est précisément ce qui le rend utile, et c'est ce qui demande un cadre clair. La plupart des incidents ne viennent pas du modèle qui « dérape », mais d'un accès trop large donné sans réfléchir, d'un secret qui traîne, ou d'une action automatique qu'on aurait dû laisser à un humain.</p>
<h2>1. Vos données restent chez vous</h2>
<p>L'agent tourne dans votre infrastructure, pas sur une plateforme tierce qu'on contrôlerait. Vos données ne servent jamais à entraîner un modèle. Quand un fournisseur de modèle entre dans la boucle, on passe par des accès qui interdisent la réutilisation de vos données pour l'entraînement.</p>
<h2>2. Moindre privilège</h2>
<p>Un agent ne reçoit que les accès strictement nécessaires à sa tâche. Par défaut il lit, il n'écrit pas. La prod, la base client, le cœur métier restent fermés tant que vous n'avez pas ouvert l'accès vous-même, périmètre par périmètre.</p>
<h2>3. Secrets verrouillés</h2>
<p>Les clés et mots de passe vivent côté serveur, hors de portée de l'agent, jamais écrits en dur dans le code. Chaque accès est limité à ce qu'il doit toucher, et peut être révoqué ou changé à tout moment sans rien casser.</p>
<h2>4. Humain à la gâchette sur l'irréversible</h2>
<p>Tout ce qui sort de l'entreprise ou ne se rattrape pas, envoyer de l'argent, un mail à un client, publier quelque chose, demande une validation humaine. L'agent prépare et propose, une personne appuie. On automatise l'ennuyeux, pas l'engageant.</p>
<h2>5. Garde-fous testés avant la prod</h2>
<p>Avant qu'un agent passe en production, il franchit une batterie de tests et dispose d'un retour arrière. On vérifie qu'il fait ce qu'il doit, et seulement ça. Rien ne part en vrai sur la foi d'une démo qui a marché une fois.</p>
<h2>6. Auditable et réversible</h2>
<p>Le code est à vous, sur une stack ouverte, avec des traces que vos équipes peuvent lire. Vous pouvez l'auditer, le faire vérifier par un tiers, le reprendre ou le couper. Pas de boîte noire dont vous dépendriez.</p>
<h2>7. Agnostique et souverain</h2>
<p>Pas de verrou sur un seul fournisseur. Le système peut router vers une autre IA, y compris européenne ou open-weight, sans tout réécrire. Si un fournisseur change ses règles ou coupe l'accès, vous n'êtes pas bloqués.</p>
<h2>8. Cloisonnement des données</h2>
<p>Quand plusieurs personnes ou plusieurs clients partagent un même système, chacun ne voit que ses propres données. La séparation est posée dans la base elle-même, pas seulement dans l'application, pour qu'une erreur de code ne puisse pas exposer ce qui ne devrait pas l'être.</p>
<h2>Les questions à poser à votre prestataire</h2>
<p>Vous n'avez pas besoin d'être technique pour vérifier qu'un prestataire prend la sécurité au sérieux. Posez-lui ces questions et écoutez s'il répond précisément ou s'il botte en touche :</p>
<ul>
<li>Où tournent les agents, et où vivent mes données ?</li>
<li>Mes données peuvent-elles servir à entraîner un modèle ?</li>
<li>Quels accès l'agent a-t-il exactement, et qui les a accordés ?</li>
<li>Qu'est-ce qui se déclenche automatiquement, et qu'est-ce qui attend une validation humaine ?</li>
<li>Est-ce que je récupère le code, et puis-je le faire auditer ?</li>
<li>Que se passe-t-il si je veux changer de fournisseur d'IA ?</li>
</ul>`,
      },
      en: {
        title: "AI agent security in the enterprise: the rules we apply",
        description:
          "Deploying an AI agent means giving it access to your data. The 8 security rules we apply to every deployment, and the questions to ask any provider.",
        category: "Security & AI",
        readingTime: "6 min",
        tldr: "Deploying an AI agent means giving it access to your data and your tools. Security is not about asking whether AI is dangerous, but about what you allow it to do and what stays locked down. Here are the eight rules applied to every deployment, and the questions to ask any provider to verify they follow them.",
        faq: [
          {
            q: "Is my data used to train the AI?",
            a: "No. The agents we deploy use access agreements that prohibit your data from being used for training, and the data stays in your infrastructure.",
          },
          {
            q: "Can an agent act on its own without anyone knowing?",
            a: "Not on irreversible actions. Any action that leaves the company or cannot be undone requires human validation. Everything else, automatable without risk, is logged.",
          },
          {
            q: "Is this GDPR-compliant?",
            a: "Yes, it is actually a starting point: minimal data, controlled hosting, per-user isolation, and the ability to route to European models.",
          },
          {
            q: "What do I keep if I stop?",
            a: "The code and the system, running on your infrastructure. You are not a tenant of a black box.",
          },
        ],
        content: `<p>An AI agent does not just answer in a corner. It reads your files, acts inside your software, and triggers actions. That is precisely what makes it useful, and it is what requires a clear framework. Most incidents do not come from a model going off the rails, but from access granted too broadly without thinking, a secret left lying around, or an automated action that should have stayed with a human.</p>
<h2>1. Your data stays with you</h2>
<p>The agent runs inside your infrastructure, not on a third-party platform we control. Your data is never used to train a model. When a model provider enters the loop, we use access agreements that prohibit your data from being used for training.</p>
<h2>2. Least privilege</h2>
<p>An agent receives only the access strictly necessary for its task. By default it reads; it does not write. Production, the customer database, and business-critical systems remain closed until you open access yourself, scope by scope.</p>
<h2>3. Locked secrets</h2>
<p>Keys and passwords live server-side, out of the agent's reach, never hard-coded in the code. Each access is limited to what it needs to touch, and can be revoked or rotated at any time without breaking anything.</p>
<h2>4. Human in the loop on irreversible actions</h2>
<p>Anything that leaves the company or cannot be undone, sending money, an email to a client, publishing something, requires human validation. The agent prepares and proposes; a person presses the button. We automate the tedious, not the consequential.</p>
<h2>5. Guard-rails tested before production</h2>
<p>Before an agent goes into production, it passes a test battery and has a rollback path. We verify it does what it is supposed to do, and only that. Nothing goes live on the strength of a demo that worked once.</p>
<h2>6. Auditable and reversible</h2>
<p>The code belongs to you, on an open stack, with logs your teams can read. You can audit it, have it reviewed by a third party, take it back, or switch it off. No black box you depend on.</p>
<h2>7. Agnostic and sovereign</h2>
<p>No lock-in to a single provider. The system can route to another AI, including a European or open-weight one, without rewriting everything. If a provider changes its terms or cuts access, you are not stuck.</p>
<h2>8. Data isolation</h2>
<p>When multiple people or multiple clients share the same system, each one sees only their own data. The separation is enforced at the database level, not just in the application, so a code error cannot expose what should not be exposed.</p>
<h2>Questions to ask your provider</h2>
<p>You do not need to be technical to verify that a provider takes security seriously. Ask them these questions and listen to whether they answer precisely or deflect:</p>
<ul>
<li>Where do the agents run, and where does my data live?</li>
<li>Can my data be used to train a model?</li>
<li>What access does the agent have exactly, and who granted it?</li>
<li>What triggers automatically, and what waits for human validation?</li>
<li>Do I get the code back, and can I have it audited?</li>
<li>What happens if I want to change AI provider?</li>
</ul>`,
      },
      "pt-BR": {
        title:
          "Segurança dos agentes de IA na empresa: as regras que aplicamos",
        description:
          "Implantar um agente de IA é dar a ele acesso aos seus dados. As 8 regras de segurança que aplicamos em cada implantação, e as perguntas a fazer a qualquer fornecedor.",
        category: "Segurança & IA",
        readingTime: "6 min",
        tldr: "Implantar um agente de IA é dar a ele acesso aos seus dados e às suas ferramentas. A segurança não se decide pela pergunta \"a IA é perigosa\", mas pelo que você autoriza ela a fazer e pelo que permanece bloqueado. Aqui estão as oito regras aplicadas em cada implantação, e as perguntas a fazer a qualquer fornecedor para verificar se ele as respeita.",
        faq: [
          {
            q: "Meus dados são usados para treinar a IA?",
            a: "Não. Os agentes que implantamos utilizam acessos que proíbem a reutilização dos seus dados para treinamento, e os dados permanecem na sua infraestrutura.",
          },
          {
            q: "Um agente pode agir sozinho sem que ninguém saiba?",
            a: "Não no irreversível. Qualquer ação que saia da empresa ou que não possa ser desfeita exige validação humana. O restante, automatizável sem risco, é registrado.",
          },
          {
            q: "É compatível com a LGPD?",
            a: "Sim, é inclusive um ponto de partida: dados minimizados, hospedagem controlada, isolamento por usuário e possibilidade de rotear para modelos europeus.",
          },
          {
            q: "O que fica comigo se eu parar?",
            a: "O código e o sistema, rodando na sua infraestrutura. Você não é inquilino de uma caixa-preta.",
          },
        ],
        content: `<p>Um agente de IA não fica apenas respondendo num canto. Ele lê seus arquivos, age dentro dos seus sistemas, dispara ações. É exatamente isso que o torna útil, e é o que exige um enquadramento claro. A maioria dos incidentes não vem de um modelo que "perde o controle", mas de um acesso concedido de forma muito ampla sem reflexão, de um segredo exposto, ou de uma ação automática que deveria ter ficado com um humano.</p>
<h2>1. Seus dados ficam com você</h2>
<p>O agente roda na sua infraestrutura, não em uma plataforma terceira que controlaríamos. Seus dados nunca são usados para treinar um modelo. Quando um fornecedor de modelo entra no fluxo, usamos acessos que proíbem a reutilização dos seus dados para treinamento.</p>
<h2>2. Mínimo privilégio</h2>
<p>Um agente recebe apenas os acessos estritamente necessários para sua tarefa. Por padrão ele lê, não escreve. A produção, a base de clientes, o núcleo do negócio permanecem fechados até que você mesmo abra o acesso, escopo por escopo.</p>
<h2>3. Segredos bloqueados</h2>
<p>Chaves e senhas vivem no servidor, fora do alcance do agente, nunca escritas diretamente no código. Cada acesso é limitado ao que precisa tocar e pode ser revogado ou alterado a qualquer momento sem quebrar nada.</p>
<h2>4. Humano no controle do irreversível</h2>
<p>Tudo que sai da empresa ou que não tem volta, enviar dinheiro, um e-mail para um cliente, publicar algo, exige validação humana. O agente prepara e propõe; uma pessoa confirma. Automatizamos o tedioso, não o consequente.</p>
<h2>5. Guarda-chuvas testados antes da produção</h2>
<p>Antes de um agente entrar em produção, ele passa por uma bateria de testes e dispõe de um caminho de retorno. Verificamos que ele faz o que deve, e apenas isso. Nada vai para o ar apenas porque uma demonstração funcionou uma vez.</p>
<h2>6. Auditável e reversível</h2>
<p>O código é seu, em uma stack aberta, com rastros que suas equipes podem ler. Você pode auditá-lo, fazer com que um terceiro o revise, retomá-lo ou desligá-lo. Nenhuma caixa-preta da qual você dependeria.</p>
<h2>7. Agnóstico e soberano</h2>
<p>Sem bloqueio em um único fornecedor. O sistema pode rotear para outra IA, inclusive europeia ou open-weight, sem reescrever tudo. Se um fornecedor mudar as regras ou cortar o acesso, você não fica preso.</p>
<h2>8. Isolamento de dados</h2>
<p>Quando várias pessoas ou vários clientes compartilham o mesmo sistema, cada um vê apenas seus próprios dados. A separação é imposta na própria base de dados, não apenas na aplicação, para que um erro de código não possa expor o que não deveria ser exposto.</p>
<h2>Perguntas a fazer ao seu fornecedor</h2>
<p>Você não precisa ser técnico para verificar se um fornecedor leva a segurança a sério. Faça essas perguntas e observe se ele responde com precisão ou desvia:</p>
<ul>
<li>Onde os agentes rodam e onde ficam meus dados?</li>
<li>Meus dados podem ser usados para treinar um modelo?</li>
<li>Quais acessos o agente tem exatamente, e quem os concedeu?</li>
<li>O que dispara automaticamente e o que aguarda validação humana?</li>
<li>Eu fico com o código e posso mandá-lo auditar?</li>
<li>O que acontece se eu quiser trocar de fornecedor de IA?</li>
</ul>`,
      },
    },
  },
];

const posts: BlogPostSource[] = [...generatedBlogPosts, ...canonicalPosts];

function toBlogPost(src: BlogPostSource, locale: BlogLocale): BlogPost {
  const t = src.translations[locale];
  return {
    slug: src.slug,
    date: src.date,
    publishedAt: src.publishedAt ?? src.date,
    updatedAt: src.updatedAt ?? src.date,
    author: src.author,
    videoUrl: src.videoUrl,
    ogImage: src.ogImage,
    tags: src.tags,
    relatedSlugs: src.relatedSlugs,
    pillar: src.pillar,
    keyword: src.keyword,
    searchIntent: src.searchIntent,
    sources: src.sources,
    title: t.title,
    description: t.description,
    category: t.category,
    readingTime: t.readingTime,
    content: t.content,
    tldr: t.tldr,
    faq: t.faq,
  };
}

function isPublished(src: BlogPostSource): boolean {
  const publishDate = new Date(src.publishedAt ?? src.date);
  return publishDate.getTime() <= Date.now();
}

export function getAllPosts(locale: BlogLocale = "fr"): BlogPost[] {
  return posts
    .filter(isPublished)
    .map((p) => toBlogPost(p, locale))
    .sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime());
}

export function getPostBySlug(
  slug: string,
  locale: BlogLocale = "fr",
): BlogPost | undefined {
  const src = posts.find((p) => p.slug === slug);
  if (!src) return undefined;
  // Hide if not yet published (unless we add a preview mode later)
  if (!isPublished(src)) return undefined;
  return toBlogPost(src, locale);
}

export function getAllSlugs(): string[] {
  return posts.filter(isPublished).map((p) => p.slug);
}

export function getAllBlogSitemapEntries(): BlogSitemapEntry[] {
  return posts.filter(isPublished).map((p) => ({
    slug: p.slug,
    lastModified: p.updatedAt ?? p.publishedAt ?? p.date,
  }));
}

export function getPostsByPillar(
  pillar: PillarSlug,
  locale: BlogLocale,
): BlogPost[] {
  return posts
    .filter((p) => isPublished(p) && p.pillar === pillar)
    .map((p) => toBlogPost(p, locale))
    .sort(
      (a, b) =>
        new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime(),
    );
}

/** Returns related posts via explicit `relatedSlugs` or by shared tag/category if none set. */
export function getRelatedPosts(
  slug: string,
  locale: BlogLocale = "fr",
  limit = 3,
): BlogPost[] {
  const src = posts.find((p) => p.slug === slug);
  if (!src) return [];

  // 1. Explicit relatedSlugs
  if (src.relatedSlugs && src.relatedSlugs.length > 0) {
    return src.relatedSlugs
      .map((s) => posts.find((p) => p.slug === s))
      .filter((p): p is BlogPostSource => !!p && isPublished(p) && p.slug !== slug)
      .slice(0, limit)
      .map((p) => toBlogPost(p, locale));
  }

  // 2. Fallback: same category, by tag overlap, then by date proximity
  const srcCategory = src.translations[locale]?.category;
  const srcTags = new Set(src.tags ?? []);
  const candidates = posts
    .filter((p) => p.slug !== slug && isPublished(p))
    .map((p) => {
      let score = 0;
      if (p.translations[locale]?.category === srcCategory) score += 3;
      const overlap = (p.tags ?? []).filter((t) => srcTags.has(t)).length;
      score += overlap * 2;
      return { p, score };
    })
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
    .map(({ p }) => toBlogPost(p, locale));

  return candidates;
}
