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
  href: "deployer" | "croissance" | "transmettre";
  label: string;
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
  cases: {
    kicker: string;
    titleBefore: string;
    titleRed: string;
    titleAfter: string;
    note: string;
    items: { name: string; sector: string; did: string; desc: string; more: string }[];
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
    navCta: "Nous écrire",
    navLinks: [
      { href: "deployer", label: "Déployer" },
      { href: "croissance", label: "Croissance" },
      { href: "transmettre", label: "Transmettre" },
    ],
    a11y: {
      nav: "Navigation principale",
      tools: "Outils",
      footerOffers: "Offres Parrit",
    },
    hero: {
      eyebrow: "Fractional AI Operator · Ingénierie agentique",
      chips: ["Claude Code", "Codex", "Serveurs MCP"],
      before: "Au-delà de l'IA qui discute. ",
      redOne: "L'IA qui agit pour vous",
      middle: ", en ",
      redTwo: "14 jours",
      after: ".",
      sub: "Le point de départ est votre réalité opérationnelle. Que vous ayez besoin d'augmenter votre chiffre d'affaires ou de gagner du temps sur l'administratif, nous adaptons la création de nos agents IA pour générer le résultat qui vous correspond.",
      primary: "On en parle 15 min ?",
      secondary: "Voir nos réalisations",
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
      kicker: "Comment ça se passe",
      titleBefore: "On regarde, on construit, on vous rend ",
      titleRed: "autonome",
      titleAfter: ".",
      steps: [
        {
          title: "01 — On regarde",
          note: "le diagnostic",
          body: "On cartographie vos process et on repère les tâches qui vous coûtent le plus cher, et celles qui génèrent du revenu.",
        },
        {
          title: "02 — On construit",
          note: "14 jours, en production",
          body: "On installe l'outil directement dans vos outils. Il tourne et génère un résultat dès 14 jours après le diagnostic.",
        },
        {
          title: "03 — On vous rend autonome",
          note: "la passation",
          body: "On forme vos équipes. Elles repartent en sachant piloter et faire évoluer leurs agents seules, et surtout elles savent exprimer leurs besoins.",
        },
      ],
      ladder: [
        { label: "Audit de transformation IA", price: "point d'entrée" },
        { label: "Sprint à impact", tag: "Format phare", price: "à partir de 1 197 €" },
        { label: "Déploiement d'agents IA", price: "à partir de 2 994 €" },
        { label: "Formation à l'utilisation agentique (non-tech)", price: "à partir de 3 497 € · finançable OPCO" },
        { label: "Accompagnement · Operating Partner", price: "à partir de 247 €/h" },
      ],
    },
    cases: {
      kicker: "Déjà en production",
      titleBefore: "Exemples de cas déployés chez nos ",
      titleRed: "clients",
      titleAfter: ".",
      note: "Cliquez pour voir le détail de chaque réalisation.",
      items: [
        {
          name: "Agent mail",
          sector: "ex. Clevery",
          did: "Vos emails triés, rédigés, prêts à envoyer.",
          desc: "L'agent lit, classe et prépare les réponses. Vous relisez, vous envoyez. Pensé pour les boîtes qui croulent sous le mail.",
          more: "Voir le cas →",
        },
        {
          name: "Agent de veille",
          sector: "clients & prospects",
          did: "Vos comptes sous surveillance, en continu.",
          desc: "Il suit l'actualité de vos clients et prospects et repère les signaux : levée, recrutement, appel d'offres. Vous êtes alerté au bon moment.",
          more: "Voir le cas →",
        },
        {
          name: "CRM piloté par agents",
          sector: "ex. Laparra",
          did: "Votre CRM se tient à jour tout seul.",
          desc: "Vous parlez à votre CRM en langage naturel, depuis un chat. Un ou plusieurs agents tiennent les fiches et les relances à jour.",
          more: "Voir le cas →",
        },
        {
          name: "Outil propriétaire sur-mesure",
          sector: "sur votre process",
          did: "L'outil métier qui n'existe pas encore.",
          desc: "On construit l'application qui vous manque, autour de votre métier. Par exemple : un agent qui dialogue directement avec votre CRM.",
          more: "Voir le cas →",
        },
        {
          name: "Alertes intelligentes",
          sector: "au bon moment",
          did: "La bonne alerte, au bon moment.",
          desc: "Des alertes générées automatiquement : produits de saison, ruptures de stock, échéances, pics d'activité. Vos équipes ne ratent plus rien.",
          more: "Voir le cas →",
        },
        {
          name: "Formation agentique",
          sector: "ex. Joone",
          did: "Vos équipes deviennent autonomes.",
          desc: "On forme vos référents IA et on configure Claude Code, Codex et vos outils agentiques. Ils repartent en sachant construire et piloter leurs agents.",
          more: "Voir le cas →",
        },
      ],
    },
    cta: {
      titleBefore: "On en parle ",
      titleRed: "15 minutes",
      titleAfter: " ?",
      fine: "Laissez votre email et votre numéro : on vous rappelle pour repérer les deux ou trois agents qui se rembourseraient dès le premier mois.",
      email: "Votre email professionnel",
      phone: "Votre téléphone",
      submit: "Être rappelé",
      submitting: "Envoi…",
      thanks: "Merci. On vous rappelle rapidement.",
      error: "Échec d'envoi. Écrivez à paul.larmaraud@parrit.ai.",
      whatsapp: "WhatsApp",
      mail: "ou écrire directement à Paul",
      qualiopi: "Nos formations sont ",
      qualiopiStrong: "finançables par votre OPCO",
      qualiopiAlt: "Qualiopi — processus certifié — République Française",
    },
    footer: "Paul Larmaraud & Yukun Leng · un réseau d'experts · paul.larmaraud@parrit.ai",
  },
  en: {
    navCta: "Contact us",
    navLinks: [
      { href: "deployer", label: "Deploy" },
      { href: "croissance", label: "Growth" },
      { href: "transmettre", label: "Transmit" },
    ],
    a11y: {
      nav: "Primary navigation",
      tools: "Tools",
      footerOffers: "Parrit offers",
    },
    hero: {
      eyebrow: "Fractional AI Operator · Agentic engineering",
      chips: ["Claude Code", "Codex", "MCP servers"],
      before: "Beyond AI that talks. ",
      redOne: "AI that acts for you",
      middle: ", in ",
      redTwo: "14 days",
      after: ".",
      sub: "The starting point is your operational reality. Whether you need to grow revenue or save time on admin work, we adapt the way we build AI agents to generate the result that fits you.",
      primary: "Talk for 15 min?",
      secondary: "See our work",
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
      kicker: "How it works",
      titleBefore: "We look, we build, we make you ",
      titleRed: "autonomous",
      titleAfter: ".",
      steps: [
        {
          title: "01 — We look",
          note: "the diagnostic",
          body: "We map your processes and spot the tasks that cost you the most, and those that generate revenue.",
        },
        {
          title: "02 — We build",
          note: "14 days, in production",
          body: "We install the tool directly inside your tools. It runs and creates a result as soon as 14 days after the diagnostic.",
        },
        {
          title: "03 — We make you autonomous",
          note: "the handover",
          body: "We train your teams. They leave knowing how to operate and evolve their agents on their own, and above all how to express their needs.",
        },
      ],
      ladder: [
        { label: "AI transformation audit", price: "entry point" },
        { label: "Impact sprint", tag: "Flagship format", price: "from €1,197" },
        { label: "AI agent deployment", price: "from €2,994" },
        { label: "Agentic usage training (non-tech)", price: "from €3,497 · OPCO-financeable" },
        { label: "Support · Operating Partner", price: "from €247/h" },
      ],
    },
    cases: {
      kicker: "Already in production",
      titleBefore: "Examples of cases deployed with our ",
      titleRed: "clients",
      titleAfter: ".",
      note: "Click to see each project in detail.",
      items: [
        {
          name: "Mail agent",
          sector: "ex. Clevery",
          did: "Your emails sorted, drafted, ready to send.",
          desc: "The agent reads, classifies and prepares replies. You review, you send. Designed for teams drowning in email.",
          more: "See the case →",
        },
        {
          name: "Monitoring agent",
          sector: "clients & prospects",
          did: "Your accounts monitored continuously.",
          desc: "It follows the news around clients and prospects and detects signals: fundraising, hiring, tenders. You are alerted at the right time.",
          more: "See the case →",
        },
        {
          name: "Agent-driven CRM",
          sector: "ex. Laparra",
          did: "Your CRM stays updated by itself.",
          desc: "You talk to your CRM in natural language, from a chat. One or several agents keep records and follow-ups up to date.",
          more: "See the case →",
        },
        {
          name: "Custom proprietary tool",
          sector: "for your process",
          did: "The business tool that does not exist yet.",
          desc: "We build the application you are missing, around your business. For example: an agent that talks directly with your CRM.",
          more: "See the case →",
        },
        {
          name: "Smart alerts",
          sector: "at the right time",
          did: "The right alert, at the right time.",
          desc: "Automatically generated alerts: seasonal products, stockouts, deadlines, activity spikes. Your teams stop missing what matters.",
          more: "See the case →",
        },
        {
          name: "Agentic training",
          sector: "ex. Joone",
          did: "Your teams become autonomous.",
          desc: "We train your AI leads and configure Claude Code, Codex and your agentic tools. They leave knowing how to build and operate their agents.",
          more: "See the case →",
        },
      ],
    },
    cta: {
      titleBefore: "Shall we talk for ",
      titleRed: "15 minutes",
      titleAfter: "?",
      fine: "Leave your email and phone number: we will call you back to identify the two or three agents that could pay for themselves in the first month.",
      email: "Your work email",
      phone: "Your phone number",
      submit: "Call me back",
      submitting: "Sending…",
      thanks: "Thanks. We will call you back shortly.",
      error: "Sending failed. Email paul.larmaraud@parrit.ai.",
      whatsapp: "WhatsApp",
      mail: "or email Paul directly",
      qualiopi: "Our training programs are ",
      qualiopiStrong: "financeable by your OPCO",
      qualiopiAlt: "Qualiopi — certified process — French Republic",
    },
    footer: "Paul Larmaraud & Yukun Leng · a network of experts · paul.larmaraud@parrit.ai",
  },
  "pt-BR": {
    navCta: "Fale conosco",
    navLinks: [
      { href: "deployer", label: "Implantar" },
      { href: "croissance", label: "Crescimento" },
      { href: "transmettre", label: "Transmitir" },
    ],
    a11y: {
      nav: "Navegação principal",
      tools: "Ferramentas",
      footerOffers: "Ofertas Parrit",
    },
    hero: {
      eyebrow: "Fractional AI Operator · Engenharia agentica",
      chips: ["Claude Code", "Codex", "Servidores MCP"],
      before: "Além da IA que conversa. ",
      redOne: "A IA que age por você",
      middle: ", em ",
      redTwo: "14 dias",
      after: ".",
      sub: "O ponto de partida é a sua realidade operacional. Seja para aumentar seu faturamento ou ganhar tempo no administrativo, adaptamos a criação dos nossos agentes de IA para gerar o resultado que corresponde ao seu contexto.",
      primary: "Conversamos 15 min?",
      secondary: "Ver realizações",
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
      kicker: "Como funciona",
      titleBefore: "Observamos, construímos e tornamos você ",
      titleRed: "autônomo",
      titleAfter: ".",
      steps: [
        {
          title: "01 — Observamos",
          note: "o diagnóstico",
          body: "Mapeamos seus processos e identificamos as tarefas que custam mais caro, e aquelas que geram receita.",
        },
        {
          title: "02 — Construímos",
          note: "14 dias, em produção",
          body: "Instalamos a ferramenta diretamente nos seus sistemas. Ela roda e gera resultado a partir de 14 dias após o diagnóstico.",
        },
        {
          title: "03 — Tornamos você autônomo",
          note: "a passagem",
          body: "Formamos suas equipes. Elas saem sabendo pilotar e evoluir seus agentes sozinhas, e sobretudo sabendo expressar suas necessidades.",
        },
      ],
      ladder: [
        { label: "Auditoria de transformação IA", price: "ponto de entrada" },
        { label: "Sprint de impacto", tag: "Formato principal", price: "a partir de 1 197 €" },
        { label: "Deploy de agentes IA", price: "a partir de 2 994 €" },
        { label: "Formação em uso agentico (não técnico)", price: "a partir de 3 497 € · financiável OPCO" },
        { label: "Acompanhamento · Operating Partner", price: "a partir de 247 €/h" },
      ],
    },
    cases: {
      kicker: "Já em produção",
      titleBefore: "Exemplos de casos implantados nos nossos ",
      titleRed: "clientes",
      titleAfter: ".",
      note: "Clique para ver o detalhe de cada realização.",
      items: [
        {
          name: "Agente de email",
          sector: "ex. Clevery",
          did: "Seus emails triados, redigidos, prontos para enviar.",
          desc: "O agente lê, classifica e prepara respostas. Você revisa e envia. Pensado para empresas soterradas por emails.",
          more: "Ver o caso →",
        },
        {
          name: "Agente de monitoramento",
          sector: "clientes & prospects",
          did: "Suas contas sob vigilância contínua.",
          desc: "Ele acompanha notícias de clientes e prospects e detecta sinais: captação, recrutamento, chamada pública. Você é alertado no momento certo.",
          more: "Ver o caso →",
        },
        {
          name: "CRM pilotado por agentes",
          sector: "ex. Laparra",
          did: "Seu CRM se mantém atualizado sozinho.",
          desc: "Você fala com seu CRM em linguagem natural, por chat. Um ou vários agentes mantêm fichas e follow-ups atualizados.",
          more: "Ver o caso →",
        },
        {
          name: "Ferramenta proprietária sob medida",
          sector: "no seu processo",
          did: "A ferramenta de negócio que ainda não existe.",
          desc: "Construímos a aplicação que falta, em torno do seu negócio. Por exemplo: um agente que dialoga diretamente com seu CRM.",
          more: "Ver o caso →",
        },
        {
          name: "Alertas inteligentes",
          sector: "no momento certo",
          did: "O alerta certo, no momento certo.",
          desc: "Alertas gerados automaticamente: produtos sazonais, rupturas de estoque, prazos, picos de atividade. Suas equipes não perdem mais nada.",
          more: "Ver o caso →",
        },
        {
          name: "Formação agentica",
          sector: "ex. Joone",
          did: "Suas equipes se tornam autônomas.",
          desc: "Formamos seus referentes IA e configuramos Claude Code, Codex e suas ferramentas agenticas. Eles saem sabendo construir e pilotar seus agentes.",
          more: "Ver o caso →",
        },
      ],
    },
    cta: {
      titleBefore: "Conversamos ",
      titleRed: "15 minutos",
      titleAfter: "?",
      fine: "Deixe seu email e telefone: ligamos para identificar os dois ou três agentes que se pagariam já no primeiro mês.",
      email: "Seu email profissional",
      phone: "Seu telefone",
      submit: "Quero ser chamado",
      submitting: "Enviando…",
      thanks: "Obrigado. Vamos ligar em breve.",
      error: "Falha no envio. Escreva para paul.larmaraud@parrit.ai.",
      whatsapp: "WhatsApp",
      mail: "ou escrever diretamente para Paul",
      qualiopi: "Nossas formações são ",
      qualiopiStrong: "financiáveis pelo seu OPCO",
      qualiopiAlt: "Qualiopi — processo certificado — República Francesa",
    },
    footer: "Paul Larmaraud & Yukun Leng · uma rede de especialistas · paul.larmaraud@parrit.ai",
  },
  "zh-CN": {
    navCta: "联系我们",
    navLinks: [
      { href: "deployer", label: "部署" },
      { href: "croissance", label: "增长" },
      { href: "transmettre", label: "传递" },
    ],
    a11y: {
      nav: "主导航",
      tools: "工具",
      footerOffers: "Parrit 服务",
    },
    hero: {
      eyebrow: "Fractional AI Operator · 智能体工程",
      chips: ["Claude Code", "Codex", "MCP 服务器"],
      before: "不只是会聊天的 AI。 ",
      redOne: "而是为你行动的 AI",
      middle: "，在 ",
      redTwo: "14 天",
      after: "内。",
      sub: "起点是你的真实运营现场。无论你需要提升营业额，还是节省行政工作的时间，我们都会调整 AI 智能体的构建方式，产出与你匹配的结果。",
      primary: "聊 15 分钟？",
      secondary: "查看案例",
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
      kicker: "流程如何进行",
      titleBefore: "我们观察、构建，并让你变得",
      titleRed: "自主",
      titleAfter: "。",
      steps: [
        {
          title: "01 — 我们观察",
          note: "诊断",
          body: "我们梳理你的流程，找出成本最高的任务，以及真正创造收入的任务。",
        },
        {
          title: "02 — 我们构建",
          note: "14 天，进入生产",
          body: "我们把工具直接装进你的现有工具中。诊断后最快 14 天，它就能运行并产生结果。",
        },
        {
          title: "03 — 我们让你自主",
          note: "交接",
          body: "我们培训你的团队。团队离开时会知道如何独立操作和演进智能体，更重要的是知道如何表达自己的需求。",
        },
      ],
      ladder: [
        { label: "AI 转型审计", price: "入口项目" },
        { label: "Impact sprint", tag: "旗舰格式", price: "起价 1 197 €" },
        { label: "AI 智能体部署", price: "起价 2 994 €" },
        { label: "智能体使用培训（非技术）", price: "起价 3 497 € · 可由 OPCO 资助" },
        { label: "陪跑 · Operating Partner", price: "起价 247 €/h" },
      ],
    },
    cases: {
      kicker: "已经在生产中",
      titleBefore: "已为",
      titleRed: "客户",
      titleAfter: "部署的案例示例。",
      note: "点击查看每个项目的细节。",
      items: [
        {
          name: "邮件智能体",
          sector: "ex. Clevery",
          did: "你的邮件被分类、起草，并准备发送。",
          desc: "智能体读取、分类并准备回复。你审核，然后发送。适合被邮件淹没的团队。",
          more: "查看案例 →",
        },
        {
          name: "监测智能体",
          sector: "客户 & 潜在客户",
          did: "持续监控你的账户。",
          desc: "它跟踪客户和潜在客户的动态，并识别融资、招聘、招标等信号。你会在正确时间收到提醒。",
          more: "查看案例 →",
        },
        {
          name: "智能体驱动的 CRM",
          sector: "ex. Laparra",
          did: "你的 CRM 自动保持更新。",
          desc: "你通过聊天用自然语言和 CRM 对话。一个或多个智能体保持资料和跟进记录更新。",
          more: "查看案例 →",
        },
        {
          name: "定制专有工具",
          sector: "围绕你的流程",
          did: "还不存在的业务工具。",
          desc: "我们围绕你的业务构建你缺少的应用。例如：一个能直接和你的 CRM 对话的智能体。",
          more: "查看案例 →",
        },
        {
          name: "智能提醒",
          sector: "在正确时间",
          did: "正确的提醒，在正确的时间。",
          desc: "自动生成提醒：季节性产品、缺货、截止日期、业务高峰。你的团队不再错过关键事项。",
          more: "查看案例 →",
        },
        {
          name: "智能体培训",
          sector: "ex. Joone",
          did: "你的团队变得自主。",
          desc: "我们培训你的 AI 负责人，并配置 Claude Code、Codex 和你的智能体工具。团队离开时会知道如何构建和操作智能体。",
          more: "查看案例 →",
        },
      ],
    },
    cta: {
      titleBefore: "我们聊 ",
      titleRed: "15 分钟",
      titleAfter: "？",
      fine: "留下你的邮箱和电话：我们会回电，找出两三个从第一个月起就能回本的智能体。",
      email: "你的工作邮箱",
      phone: "你的电话",
      submit: "请回电",
      submitting: "发送中…",
      thanks: "谢谢。我们会尽快回电。",
      error: "发送失败。请写信给 paul.larmaraud@parrit.ai。",
      whatsapp: "WhatsApp",
      mail: "或直接写信给 Paul",
      qualiopi: "我们的培训",
      qualiopiStrong: "可由你的 OPCO 资助",
      qualiopiAlt: "Qualiopi — 认证流程 — 法兰西共和国",
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

export default function HomeClient({ lang }: { lang: Locale }) {
  const copy = COPY[lang] ?? COPY.fr;

  return (
    <main className="home-template">
      <div className="frame" />

      <div className="wrap">
        <nav className="nav" aria-label={copy.a11y.nav}>
          <Logo />
          <div className="nav-links">
            {copy.navLinks.map((item) => (
              <a href={`/${lang}/${item.href}`} key={item.href}>
                {item.label}
              </a>
            ))}
          </div>
          <a className="btn btn-red" href="mailto:paul.larmaraud@parrit.ai">
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
        <div className="chips" aria-label={copy.a11y.tools}>
          {TOOL_CHIPS.map((chip, index) => (
            <span className="chip" key={copy.hero.chips[index]}>
              <img className="ci" src={chip.src} alt="" aria-hidden="true" />
              {copy.hero.chips[index]}
            </span>
          ))}
        </div>
        <div className="cta-row">
          <a className="btn btn-red btn-lg" href="#contact">
            {copy.hero.primary}
          </a>
          <a className="btn btn-ghost btn-lg" href="#cas">
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

      <section className="section band">
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
                  <h3>
                    {card.title} <span className="note">{card.note}</span>
                  </h3>
                  <p>{card.body}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="section">
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

      <section className="section band" id="cas">
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
              <a href={`/${lang}/${item.href}`} key={item.href}>
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
