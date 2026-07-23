import Link from "next/link";
import HomeMotion from "@/components/HomeMotion";
import InputOutputFlow, { type IOCopy } from "@/components/InputOutputFlow";
import NewsletterVeille from "@/components/NewsletterVeille";
import type { Locale } from "@/app/[lang]/dictionaries";
import { getCatalog, type AgentGroup } from "@/lib/agents";


// Preuve terrain : vraies photos d'ateliers / masterclass / plénières (ordre = terrainCaps).
const TERRAIN_PHOTOS = [
  "/brand/terrain/masterclass-acculturation.jpg",
];

const HOME_AGENT_CASE_IDS = [
  "acquisition-signal-first",
  "capture-multicanal",
  "facturation-auto",
  "formation-agentique",
] as const;

type Offer = {
  n: string;
  eyebrow: string;
  title: string;
  desc: string;
  points: string[];
  audience: string;
  cta: string;
  href: string;
};

type HomeCopy = {
  badge: string;
  h1a: string;
  h1red: string;
  h1b: string;
  lede: string;
  ctaDiagnostic: string;
  ctaTalk: string;
  io: IOCopy;
  terrainEyebrow: string;
  terrainH: string;
  terrainP: string;
  terrainCaps: string[];
  teamEyebrow: string;
  teamH: string;
  teamPaulRole: string;
  teamPaulProof: string;
  teamNetwork: string;
  teamGoal: string;
  teamCta: string;
  catEyebrow: string;
  catH2: string;
  catSub: string;
  catCta: string;
  agentMore: (list: string) => string;
  offersEyebrow: string;
  offersH2: string;
  offersFoot: string;
  offers: Offer[];
  ctaH: string;
  ctaP: string;
  nlEyebrow: string;
  nlH: string;
  nlP: string;
  nlPlaceholder: string;
  nlBtn: string;
  nlOk: string;
  nlErr: string;
  ctaOld: string;
};

const DICT: Record<Locale, HomeCopy> = {
  fr: {
    badge: "AI operating partners · on demand",
    h1a: "Passez de l'IA qui discute à l'IA qui ",
    h1red: "agit",
    h1b: ".",
    lede: "Vos partenaires d'exploitation IA, à la demande. On installe des agents qui travaillent dans vos workflows. Vous gardez la main, ils font le travail. Des humains réels, qui ont déjà déployé pour de vrai.",
    ctaDiagnostic: "Réserver un diagnostic de faisabilité",
    ctaTalk: "Parler à Paul",
    io: {
      eyebrow: "Input → Output",
      title: "Vous posez le cas. On rend le résultat.",
      sub: "On prend l'entrée, on rend la sortie. Faisabilité, cadrage, mise en œuvre : ça se passe derrière.",
      foot: "On prend le cas, on dit si c'est faisable et en combien de temps.",
      labIn: "Input",
      labOut: "Output",
      cases: [
        { i: "Un CRM rempli à la main.", o: "Un CRM à jour tout seul." },
        { i: "Des sources de veille éparpillées.", o: "Un mail, chaque matin." },
        { i: "Des devis tapés un par un.", o: "Des devis prêts en un clic." },
        { i: "Un tableur par ouverture.", o: "Un pilotage, une seule vue." },
        { i: "Votre cas.", o: "Un agent en production." },
      ],
    },
    terrainEyebrow: "Sur le terrain",
    terrainH: "On déploie avec vos équipes, pas à distance.",
    terrainP: "Cartographie des workflows, acculturation, prise de parole : on installe l'IA au contact de vos équipes, dans vos murs.",
    terrainCaps: ["Atelier · acculturation IA"],
    teamEyebrow: "Paul + le réseau",
    teamH: "Qui est derrière",
    teamPaulRole: "Fondateur",
    teamPaulProof: "Un agent en production lui prend une journée.",
    teamNetwork: "Autour de lui, une vingtaine d'experts, moitié métier, moitié technique. Ils mettent l'IA entre les mains de vos équipes, règlent le harnais, et elle se met à bosser pour elles.",
    teamGoal: "Le jour où vous n'avez plus besoin de nous, c'est gagné.",
    teamCta: "Rencontrer les fondateurs",
    catEyebrow: "Catalogue",
    catH2: "Pas des slides. Des agents qui tournent en production.",
    catSub: "Des systèmes opérationnels sur vos fonctions clés, avec un périmètre défini, des accès encadrés et un responsable. Vous gardez le contrôle et la traçabilité.",
    catCta: "Posez votre cas",
    agentMore: (list) => `Aussi en production : ${list}.`,
    offersEyebrow: "Nos offres",
    offersH2: "Trois façons de mettre l'IA au travail chez vous.",
    offersFoot: "La bonne porte dépend de votre cas. On vous oriente.",
    offers: [
      { n: "01", eyebrow: "Transformation IA", title: "Faire de l'IA un levier, pas des POC.", desc: "On cartographie, on déploie les agents qui comptent, on forme vos équipes. De bout en bout, jusqu'à ce que ça tourne sans nous.", points: ["Audit", "Cas d'usage prioritaires", "Déploiement", "Passation"], audience: "Pour les directions métiers.", cta: "Découvrir la Transformation", href: "croissance" },
      { n: "02", eyebrow: "Agent IA", title: "Un agent en production. Vite.", desc: "Votre cas, votre entrée, votre sortie. On prototype, on vous dit si c'est faisable et en combien de temps. Les premiers prototypes sont offerts.", points: ["Le cas", "L'input", "L'output", "En production"], audience: "Pour les DSI et les équipes ops.", cta: "Découvrir le déploiement d'agent", href: "deployer" },
      { n: "03", eyebrow: "Coaching & Formation", title: "Vos équipes prennent l'agentique en main.", desc: "De la découverte au hands-on : prendre Claude Code en main, même sans profil technique. 100 % agentique. Certifié Qualiopi.", points: ["Claude Code + Codex", "Ateliers hands-on", "100 % agentique", "Qualiopi"], audience: "Pour les DRH.", cta: "Découvrir la formation", href: "transmettre" },
    ],
    ctaH: "On en parle 15 minutes ?",
    ctaP: "On part de votre cas concret. Le diagnostic établit ce qui est faisable, dans quel périmètre et en combien de temps.",
    nlEyebrow: "La veille",
    nlH: "Les news IA qui comptent, chaque semaine.",
    nlP: "Ce qui sort, ce qui marche, et ce qu'on en fait chez nos clients. Décrypté simplement, sans hype.",
    nlPlaceholder: "votre@email.pro",
    nlBtn: "Recevoir la veille",
    nlOk: "C'est noté. À très vite dans votre boîte mail.",
    nlErr: "Un problème est survenu. Réessayez.",
    ctaOld: "Voir le parcours complet, niveau par niveau →",
  },
  en: {
    badge: "AI operating partners · on demand",
    h1a: "Go from AI that talks to AI that ",
    h1red: "acts",
    h1b: ".",
    lede: "Your AI operating partners, on demand. We put agents to work inside your workflows. You keep control, they do the work. Real people who have already deployed for real.",
    ctaDiagnostic: "Book a feasibility check",
    ctaTalk: "Talk to Paul",
    io: {
      eyebrow: "Input → Output",
      title: "You bring the case. We ship the result.",
      sub: "You give the input, we return the output. Feasibility, scoping, rollout: that happens behind the scenes.",
      foot: "We take the case, we tell you if it's doable and how long it takes.",
      labIn: "Input",
      labOut: "Output",
      cases: [
        { i: "A CRM filled in by hand.", o: "A CRM that updates itself." },
        { i: "Monitoring scattered across sources.", o: "One email, every morning." },
        { i: "Quotes typed one by one.", o: "Quotes ready in one click." },
        { i: "One spreadsheet per opening.", o: "One view, full oversight." },
        { i: "Your case.", o: "An agent in production." },
      ],
    },
    terrainEyebrow: "On the ground",
    terrainH: "We deploy with your teams, not from a distance.",
    terrainP: "Workflow mapping, upskilling, speaking: we install AI next to your teams, on your premises.",
    terrainCaps: ["Workshop · AI enablement"],
    teamEyebrow: "Paul + the network",
    teamH: "Who is behind Parrit",
    teamPaulRole: "Founder",
    teamPaulProof: "Shipping an agent to production takes him a day.",
    teamNetwork: "Around him, some twenty experts, half business, half technical. They put AI in your teams' hands, set the harness, and it starts working for them.",
    teamGoal: "The day you no longer need us, we've won.",
    teamCta: "Meet the founders",
    catEyebrow: "Catalog",
    catH2: "Not slides. Agents running in production.",
    catSub: "Production-grade systems across your core functions, each with a defined scope, gated access and a named owner. You keep control and full auditability.",
    catCta: "Bring us your case",
    agentMore: (list) => `Also in production: ${list}.`,
    offersEyebrow: "Our offers",
    offersH2: "Three ways to put AI to work inside your company.",
    offersFoot: "The right door depends on your case. We point you to it.",
    offers: [
      { n: "01", eyebrow: "AI Transformation", title: "Make AI a real lever, not POCs.", desc: "We map, we deploy the agents that matter, we train your teams. End to end, until it runs without us.", points: ["Audit", "Priority use cases", "Deployment", "Handover"], audience: "For business-line leaders.", cta: "Explore Transformation", href: "croissance" },
      { n: "02", eyebrow: "AI Agent", title: "An agent in production. Fast.", desc: "Your case, your input, your output. We prototype, we tell you if it's doable and how long it takes. First prototypes are on us.", points: ["The case", "The input", "The output", "In production"], audience: "For IT and ops teams.", cta: "Explore agent deployment", href: "deployer" },
      { n: "03", eyebrow: "Coaching & Training", title: "Your teams take agentic AI into their own hands.", desc: "From discovery to hands-on: getting a grip on Claude Code, even without a technical background. 100% agentic. Qualiopi-certified.", points: ["Claude Code + Codex", "Hands-on workshops", "100% agentic", "Qualiopi"], audience: "For HR leaders.", cta: "Explore training", href: "transmettre" },
    ],
    ctaH: "Shall we talk for 15 minutes?",
    ctaP: "We start from your concrete case. The feasibility check establishes what can be done, within what scope and how long it will take.",
    nlEyebrow: "The brief",
    nlH: "The AI news that matters, every week.",
    nlP: "What ships, what works, and what we do with it for our clients. Explained simply, no hype.",
    nlPlaceholder: "you@company.com",
    nlBtn: "Get the brief",
    nlOk: "Noted. See you in your inbox.",
    nlErr: "Something went wrong. Please try again.",
    ctaOld: "See the full path, level by level →",
  },
  "pt-BR": {
    badge: "AI operating partners · on demand",
    h1a: "Passe da IA que conversa para a IA que ",
    h1red: "age",
    h1b: ".",
    lede: "Seus parceiros de operação em IA, sob demanda. Colocamos agentes para trabalhar nos seus fluxos. Você mantém o controle, eles fazem o trabalho. Pessoas reais, que já fizeram implantações de verdade.",
    ctaDiagnostic: "Reservar um diagnóstico de viabilidade",
    ctaTalk: "Falar com Paul",
    io: {
      eyebrow: "Input → Output",
      title: "Você traz o caso. A gente entrega o resultado.",
      sub: "Você dá a entrada, a gente devolve a saída. Viabilidade, enquadramento, implementação: acontece nos bastidores.",
      foot: "A gente pega o caso e diz se dá e em quanto tempo.",
      labIn: "Input",
      labOut: "Output",
      cases: [
        { i: "Um CRM preenchido à mão.", o: "Um CRM que se atualiza sozinho." },
        { i: "Fontes de monitoramento espalhadas.", o: "Um e-mail, toda manhã." },
        { i: "Orçamentos digitados um a um.", o: "Orçamentos prontos num clique." },
        { i: "Uma planilha por abertura.", o: "Uma visão, controle total." },
        { i: "O seu caso.", o: "Um agente em produção." },
      ],
    },
    terrainEyebrow: "No terreno",
    terrainH: "Implantamos com suas equipes, não à distância.",
    terrainP: "Mapeamento de fluxos, capacitação, palestras: instalamos a IA junto das suas equipes, na sua empresa.",
    terrainCaps: ["Workshop · capacitação em IA"],
    teamEyebrow: "Paul + a rede",
    teamH: "Quem está por trás",
    teamPaulRole: "Fundador",
    teamPaulProof: "Colocar um agente em produção leva um dia para ele.",
    teamNetwork: "Ao redor dele, uns vinte especialistas, metade negócio, metade técnica. Eles colocam a IA nas mãos das suas equipes, ajustam o arnês, e ela começa a trabalhar para elas.",
    teamGoal: "No dia em que você não precisar mais da gente, nós ganhamos.",
    teamCta: "Conhecer os fundadores",
    catEyebrow: "Catálogo",
    catH2: "Nada de slides. Agentes rodando em produção.",
    catSub: "Sistemas operacionais nas suas funções-chave, com perímetro definido, acessos controlados e um responsável. Você mantém o controle e a rastreabilidade.",
    catCta: "Traga o seu caso",
    agentMore: (list) => `Também em produção: ${list}.`,
    offersEyebrow: "Nossas ofertas",
    offersH2: "Três formas de colocar a IA para trabalhar na sua empresa.",
    offersFoot: "A porta certa depende do seu caso. A gente te orienta.",
    offers: [
      { n: "01", eyebrow: "Transformação IA", title: "Fazer da IA uma alavanca, não POCs.", desc: "A gente mapeia, implanta os agentes que importam, treina os times. De ponta a ponta, até rodar sem a gente.", points: ["Auditoria", "Casos de uso prioritários", "Implementação", "Passagem"], audience: "Para as áreas de negócio.", cta: "Conhecer a Transformação", href: "croissance" },
      { n: "02", eyebrow: "Agente IA", title: "Um agente em produção. Rápido.", desc: "Seu caso, sua entrada, sua saída. A gente prototipa e diz se dá e em quanto tempo. Os primeiros protótipos são por nossa conta.", points: ["O caso", "O input", "O output", "Em produção"], audience: "Para TI e times de operações.", cta: "Conhecer o agente", href: "deployer" },
      { n: "03", eyebrow: "Coaching & Formação", title: "Seus times assumem a IA agêntica.", desc: "Da descoberta ao hands-on: dominar o Claude Code, mesmo sem perfil técnico. 100% agêntico. Certificado Qualiopi.", points: ["Claude Code + Codex", "Workshops hands-on", "100% agêntico", "Qualiopi"], audience: "Para o RH.", cta: "Conhecer a formação", href: "transmettre" },
    ],
    ctaH: "Vamos conversar 15 minutos?",
    ctaP: "Partimos do seu caso concreto. O diagnóstico define o que é viável, em qual perímetro e em quanto tempo.",
    nlEyebrow: "Radar IA",
    nlH: "As notícias de IA que importam, toda semana.",
    nlP: "O que sai, o que funciona, e o que fazemos com isso para nossos clientes. Explicado de forma simples, sem hype.",
    nlPlaceholder: "voce@empresa.com",
    nlBtn: "Receber o radar",
    nlOk: "Anotado. Até breve na sua caixa de entrada.",
    nlErr: "Ocorreu um problema. Tente novamente.",
    ctaOld: "Ver o percurso completo, nível por nível →",
  },
  "zh-CN": {
    badge: "AI operating partners · on demand",
    h1a: "从只会聊天的 AI，到真正会",
    h1red: "干活",
    h1b: "的 AI。",
    lede: "你的 AI 运营合伙人，按需接入。我们把智能体放进你的工作流里干活；你掌控全局，它们完成工作。真实的人，真正做过生产部署。",
    ctaDiagnostic: "预约可行性诊断",
    ctaTalk: "与 Paul 交流",
    io: {
      eyebrow: "Input → Output",
      title: "你给出场景，我们交付结果。",
      sub: "你给输入，我们给输出。可行性、梳理、落地：都在后台完成。",
      foot: "把场景交给我们，我们告诉你能不能做、要多久。",
      labIn: "输入",
      labOut: "输出",
      cases: [
        { i: "手工填的 CRM。", o: "自动更新的 CRM。" },
        { i: "分散的情报来源。", o: "每天早上一封邮件。" },
        { i: "一个个手打的报价。", o: "一键生成的报价。" },
        { i: "每次开店一张表格。", o: "一个视图，尽在掌握。" },
        { i: "你的场景。", o: "一个上线的智能体。" },
      ],
    },
    terrainEyebrow: "在一线",
    terrainH: "我们和你的团队一起部署，而不是远程交付。",
    terrainP: "梳理工作流、团队培训、现场分享：我们在你的团队身边、在你的办公室里落地 AI。",
    terrainCaps: ["工作坊 · AI 培训"],
    teamEyebrow: "Paul 与合作网络",
    teamH: "谁在背后",
    teamPaulRole: "创始人",
    teamPaulProof: "把一个智能体部署上线，他只需要一天。",
    teamNetwork: "他身边有二十来位专家，一半懂业务，一半懂技术。他们把 AI 交到你团队手里，调好缰绳，让它真正为团队干活。",
    teamGoal: "当你不再需要我们的那一天，就是我们赢的那一天。",
    teamCta: "认识创始人",
    catEyebrow: "目录",
    catH2: "不是幻灯片，而是真正在生产环境运行的智能体。",
    catSub: "覆盖你核心职能的生产系统：边界清晰、权限受控、责任到人。你始终掌控全局，全程可追溯。",
    catCta: "提出你的场景",
    agentMore: (list) => `同样在生产中：${list}。`,
    offersEyebrow: "我们的服务",
    offersH2: "让 AI 在你公司里干活的三种方式。",
    offersFoot: "该走哪扇门，取决于你的场景。我们帮你定位。",
    offers: [
      { n: "01", eyebrow: "AI 转型", title: "让 AI 成为真正的杠杆，而不是 POC。", desc: "我们梳理流程、部署真正有用的智能体、培训你的团队。端到端，直到无需我们也能运转。", points: ["审计", "优先场景", "部署", "交接"], audience: "面向业务部门。", cta: "了解转型", href: "croissance" },
      { n: "02", eyebrow: "AI 智能体", title: "让智能体快速上线。", desc: "你的场景、你的输入、你的输出。我们做原型，告诉你能不能做、要多久。首批原型免费。", points: ["场景", "输入", "输出", "上线"], audience: "面向 IT 与运营团队。", cta: "了解智能体部署", href: "deployer" },
      { n: "03", eyebrow: "辅导与培训", title: "让团队真正上手智能体。", desc: "从入门到实操：即使没有技术背景，也能上手 Claude Code。100% 聚焦智能体。Qualiopi 认证。", points: ["Claude Code + Codex", "实操工作坊", "100% 智能体", "Qualiopi"], audience: "面向 HR。", cta: "了解培训", href: "transmettre" },
    ],
    ctaH: "聊 15 分钟？",
    ctaP: "我们从你的具体场景出发。可行性诊断会明确能否实现、实施范围以及所需时间。",
    nlEyebrow: "AI 周报",
    nlH: "每周真正重要的 AI 新闻。",
    nlP: "最新发布、真正有效的实践，以及我们如何为客户落地。简单解读，不吹嘘。",
    nlPlaceholder: "you@company.com",
    nlBtn: "订阅周报",
    nlOk: "已收到，我们邮箱见。",
    nlErr: "出现问题，请重试。",
    ctaOld: "查看完整路径，逐级了解 →",
  },
};

function AgentCard({ group }: { group: AgentGroup }) {
  const agentCase = group.cases[0];
  return (
    <article className="hd-agent">
      <div className="hd-agent-top">
        <div className="hd-agent-id">
          <h3 className="hd-agent-name">{group.persona.label}</h3>
        </div>
      </div>
      {agentCase && (
        <div className="hd-agent-case">
          <span className="hd-case-title">{agentCase.title}</span>
          <span className="hd-case-desc">{agentCase.desc}</span>
          <span className="hd-case-meta">{agentCase.sector}</span>
        </div>
      )}
    </article>
  );
}

export default function HomeDeux({ lang }: {
  lang: Locale;
  [key: string]: unknown;
}) {
  const t = DICT[lang] ?? DICT.fr;
  const fullCatalog = getCatalog({ lang });
  const catalogGroups = HOME_AGENT_CASE_IDS.flatMap((caseId) => {
    const group = fullCatalog.groups.find(({ cases }) =>
      cases.some((agentCase) => agentCase.id === caseId)
    );
    const agentCase = group?.cases.find(({ id }) => id === caseId);
    return group && agentCase ? [{ ...group, cases: [agentCase] }] : [];
  });
  return (
    <main className="hd">
      <style>{CSS}</style>
      <HomeMotion />

      {/* ===== HERO ===== */}
      <header className="hd-hero">
        <div className="hd-mark">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img className="hd-mark-seal" src="/brand/parrit-seal.svg" alt="" aria-hidden="true" />
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img className="hd-mark-word" src="/brand/parrit-wordmark-clean.svg" alt="Parrit·ai" />
        </div>
        <p className="hd-badge">{t.badge}</p>
        <h1 className="hd-h1">
          {t.h1a}<span className="hd-red">{t.h1red}</span>{t.h1b}
        </h1>
        <p className="hd-lede">{t.lede}</p>
        <div className="hd-hero-cta">
          <Link className="hd-btn primary hd-act" href="/diagnostic?source=home-diagnostic" data-ph="cta" data-ph-label={t.ctaDiagnostic} data-ph-dest="/diagnostic?source=home-diagnostic" data-ph-placement="home-diagnostic">
            {t.ctaDiagnostic} <span className="hd-cta-arrow" aria-hidden="true">→</span>
          </Link>
          <Link className="hd-btn ghost hd-act" href={`/${lang}/rendez-vous?source=home-parler-paul`} data-ph="cta" data-ph-label={t.ctaTalk} data-ph-dest={`/${lang}/rendez-vous?source=home-parler-paul`} data-ph-placement="home-parler-paul">
            {t.ctaTalk} <span className="hd-cta-arrow" aria-hidden="true">→</span>
          </Link>
        </div>
      </header>

      {/* ===== SUR LE TERRAIN (preuve d'execution, vraies photos) ===== */}
      <section className="hd-terrain" data-reveal aria-labelledby="hd-terrain-h">
        <div className="hd-terrain-inner" data-stagger>
          <div className="hd-terrain-head">
            <p className="hd-eyebrow"><span className="hd-eyebrow-n">01</span> · {t.terrainEyebrow}</p>
            <h2 id="hd-terrain-h" className="hd-h2">{t.terrainH}</h2>
            <p className="hd-terrain-sub">{t.terrainP}</p>
          </div>
          <figure className="hd-terrain-item">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img className="hd-terrain-photo" src={TERRAIN_PHOTOS[0]} alt={t.terrainCaps[0]} loading="lazy" />
            <figcaption className="hd-terrain-cap">{t.terrainCaps[0]}</figcaption>
          </figure>
        </div>
      </section>

      {/* ===== QUI EST DERRIERE (vraies personnes) ===== */}
      <section className="hd-team" data-reveal aria-labelledby="hd-team-h">
        <div className="hd-team-head">
          <p className="hd-eyebrow">{t.teamEyebrow}</p>
          <h2 id="hd-team-h" className="hd-h2">{t.teamH}</h2>
        </div>
        <div className="hd-team-grid" data-stagger>
          <article className="hd-team-card">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img className="hd-team-photo" src="/team/paul-reel.jpg" alt="Paul Larmaraud" loading="lazy" />
            <div className="hd-team-copy">
              <h3 className="hd-team-name">Paul Larmaraud</h3>
              <p className="hd-team-role">{t.teamPaulRole}</p>
              <p className="hd-team-proof">{t.teamPaulProof}</p>
            </div>
          </article>
          <div className="hd-team-network">
            <p>{t.teamNetwork}</p>
            <p className="hd-team-goal">{t.teamGoal}</p>
          </div>
        </div>
        <Link className="hd-team-link" href="/fondateurs">{t.teamCta} →</Link>
      </section>

      {/* ===== SIGNATURE : input -> output (montrer pas prouver) ===== */}
      <InputOutputFlow copy={t.io} />

      {/* ===== CATALOGUE ===== */}
      <section className="hd-catalog" id="catalogue-agents" data-reveal aria-labelledby="hd-catalog-h">
        <div className="hd-catalog-head">
          <p className="hd-eyebrow"><span className="hd-eyebrow-n">02</span> · {t.catEyebrow}</p>
          <h2 id="hd-catalog-h" className="hd-h2">{t.catH2}</h2>
          <p className="hd-catalog-sub">{t.catSub}</p>
        </div>
        <div className="hd-agent-grid" data-stagger>
          {catalogGroups.map((group) => (
            <AgentCard group={group} key={group.persona.key} />
          ))}
        </div>
        <div className="hd-catalog-cta">
          <Link className="hd-btn primary hd-act" href="/diagnostic?source=home-catalog" data-ph="cta" data-ph-label={t.catCta} data-ph-dest="/diagnostic?source=home-catalog" data-ph-placement="home-catalog">
            {t.catCta} <span className="hd-cta-arrow" aria-hidden="true">→</span>
          </Link>
        </div>
      </section>

      {/* ===== OFFRES (sans prix sur la home, detailles sur chaque page offre) ===== */}
      <section className="hd-pricing" id="offres" data-reveal aria-labelledby="hd-offers-h">
        <div className="hd-piliers-head">
          <p className="hd-eyebrow"><span className="hd-eyebrow-n">03</span> · {t.offersEyebrow}</p>
          <h2 id="hd-offers-h" className="hd-h2">{t.offersH2}</h2>
        </div>
        <div className="hd-price-grid" data-stagger>
          {t.offers.map((p) => (
            <article className={p.n === "01" ? "hd-pilier hd-price featured" : "hd-pilier hd-price"} key={p.n}>
              <p className="hd-pilier-tag">
                <span className="hd-pilier-n">{p.n}</span>
                <span className="hd-pilier-eye">{p.eyebrow}</span>
              </p>
              <h3 className="hd-pilier-title">{p.title}</h3>
              <p className="hd-pilier-desc">{p.desc}</p>

              <ul className="hd-forms">
                {p.points.map((f) => (
                  <li className="hd-form" key={f}>{f}</li>
                ))}
              </ul>

              <p className="hd-pilier-proof">{p.audience}</p>
              <Link className="hd-pilier-link" href={`/${lang}/${p.href}`} data-ph="cta" data-ph-label={p.cta} data-ph-dest={`/${lang}/${p.href}`} data-ph-placement="offers">
                {p.cta} →
              </Link>
            </article>
          ))}
        </div>
        <p className="hd-catalog-foot">{t.offersFoot}</p>
      </section>

      {/* ===== CTA FINAL ===== */}
      <section className="hd-nl" data-reveal>
        <p className="hd-eyebrow">{t.nlEyebrow}</p>
        <h2 className="hd-nl-h">{t.nlH}</h2>
        <p className="hd-nl-p">{t.nlP}</p>
        <NewsletterVeille page={`/${lang}`} copy={{ placeholder: t.nlPlaceholder, button: t.nlBtn, ok: t.nlOk, error: t.nlErr }} />
      </section>

      <footer className="hd-cta" data-reveal>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img className="hd-cta-seal" src="/brand/parrit-seal.svg" alt="" aria-hidden="true" />
        <h2 className="hd-cta-h">{t.ctaH}</h2>
        <p className="hd-cta-p">{t.ctaP}</p>
        <Link className="hd-btn primary lg hd-act" href="/diagnostic?source=home-diagnostic" data-ph="cta" data-ph-label={t.ctaDiagnostic} data-ph-dest="/diagnostic?source=home-diagnostic" data-ph-placement="home-diagnostic">
          {t.ctaDiagnostic} <span className="hd-cta-arrow" aria-hidden="true">→</span>
        </Link>
      </footer>

      <div className="hd-legal">
        © {new Date().getFullYear()} SASU PARRIT.AI · Rueil-Malmaison ·{" "}
        <Link href={`/${lang}/mentions-legales`}>
          {lang === "fr" ? "Mentions légales" : "Legal notice"}
        </Link>{" "}
        ·{" "}
        <Link href={`/${lang}/confidentialite`}>
          {lang === "fr" ? "Confidentialité" : "Privacy"}
        </Link>
      </div>
    </main>
  );
}

const CSS = `
.hd { background: var(--bg); color: var(--ink); }

/* POLISH — reveal doux au scroll (progressive enhancement, gated .motion-ready) */
.motion-ready [data-reveal] { opacity: 0; transform: translateY(16px); transition: opacity .7s cubic-bezier(.16,1,.3,1), transform .7s cubic-bezier(.16,1,.3,1); }
.motion-ready [data-reveal].is-in { opacity: 1; transform: none; }
@media (prefers-reduced-motion: reduce) { .motion-ready [data-reveal] { opacity: 1 !important; transform: none !important; transition: none !important; } }
/* POLISH — cascade (stagger) des cartes, façon Denem */
.motion-ready [data-stagger] > * { opacity: 0; transform: translateY(14px); transition: opacity .55s cubic-bezier(.16,1,.3,1), transform .55s cubic-bezier(.16,1,.3,1); }
.motion-ready [data-stagger].is-in > * { opacity: 1; transform: none; }
.motion-ready [data-stagger].is-in > *:nth-child(1){transition-delay:.02s}
.motion-ready [data-stagger].is-in > *:nth-child(2){transition-delay:.07s}
.motion-ready [data-stagger].is-in > *:nth-child(3){transition-delay:.12s}
.motion-ready [data-stagger].is-in > *:nth-child(4){transition-delay:.17s}
.motion-ready [data-stagger].is-in > *:nth-child(5){transition-delay:.22s}
.motion-ready [data-stagger].is-in > *:nth-child(6){transition-delay:.27s}
.motion-ready [data-stagger].is-in > *:nth-child(7){transition-delay:.32s}
.motion-ready [data-stagger].is-in > *:nth-child(8){transition-delay:.37s}
@media (prefers-reduced-motion: reduce) { .motion-ready [data-stagger] > * { opacity: 1 !important; transform: none !important; transition: none !important; } }
/* POLISH — micro-interactions léchées */
.hd-agent { transition: background .25s ease; }
.hd-agent:hover { background: var(--band); }
.hd-terrain-item { overflow: hidden; }
.hd-terrain-photo { transition: transform .6s cubic-bezier(.16,1,.3,1); }
.hd-terrain-item:hover .hd-terrain-photo { transform: scale(1.035); }
.hd-btn { display: inline-block; font-family: var(--font-mono); font-size: 14px; font-weight: 500; letter-spacing: .02em; padding: 12px 24px; text-decoration: none; border: 1px solid transparent; transition: background .2s ease, color .2s ease, border-color .2s ease, transform .2s ease; }
.hd-btn:hover { transform: translateY(-1px); }
.hd-btn.primary { background: var(--ink); color: #fff; }
.hd-btn.primary:hover { background: var(--red); }
.hd-btn.ghost { background: transparent; color: var(--ink); border-color: var(--ink); }
.hd-btn.ghost:hover { background: var(--ink); color: var(--bg); }
.hd-btn.lg { padding: 16px 34px; font-size: 15px; }

/* HERO */
.hd-hero { max-width: 860px; margin: 0 auto; padding: 76px 24px 60px; text-align: center; }
.hd-mark { display: flex; flex-direction: column; align-items: center; gap: 16px; margin: 0 auto 30px; }
.hd-mark-seal { height: 82px; width: auto; display: block; }
.hd-mark-word { height: 29px; width: auto; display: block; }
.hd-badge { display: inline-block; font-family: var(--font-mono); font-size: 11px; font-weight: 500; letter-spacing: .14em; text-transform: uppercase; color: var(--red); background: var(--red-tint); padding: 6px 12px; margin: 0 0 26px; }
.hd-h1 { font-family: var(--font-heading); font-size: clamp(40px, 6vw, 72px); line-height: 1.02; font-weight: 600; letter-spacing: -0.04em; text-wrap: balance; margin: 0; }
.hd-red { color: var(--red); }
.hd-lede { max-width: 620px; margin: 26px auto 0; font-family: var(--font-mono); font-size: 15px; line-height: 1.65; color: var(--muted); }
.hd-hero-cta { display: flex; gap: 12px; justify-content: center; flex-wrap: wrap; margin-top: 34px; }

/* AVANT / APRES (preuve concrete) */

/* SUR LE TERRAIN (vraies photos) */
.hd-terrain { max-width: 1120px; margin: 0 auto; padding: 66px 24px 24px; border-top: 1px solid var(--line); }
.hd-terrain-inner { display: grid; grid-template-columns: 1fr 1fr; gap: 56px; align-items: center; }
.hd-terrain-head { max-width: 460px; margin: 0; text-align: left; }
.hd-terrain-sub { font-family: var(--font-mono); font-size: 14px; line-height: 1.6; color: var(--muted); margin: 16px 0 0; max-width: 420px; }
.hd-terrain-item { min-width: 0; margin: 0; display: flex; flex-direction: column; border: 1px solid var(--line); overflow: hidden; }
.hd-terrain-photo { display: block; width: 100%; aspect-ratio: 4 / 5; object-fit: cover; object-position: center 22%; transition: transform .5s cubic-bezier(.16,1,.3,1); }
.hd-terrain-item:hover .hd-terrain-photo { transform: scale(1.035); }
.hd-terrain-cap { font-family: var(--font-mono); font-size: 11px; letter-spacing: .1em; text-transform: uppercase; color: var(--muted); padding: 14px 18px 16px; border-top: 1px solid var(--line); }

/* QUI EST DERRIERE */
.hd-team { max-width: 1120px; margin: 0 auto; padding: 56px 24px 32px; }
.hd-team-head { margin: 0 0 28px; }
.hd-team-grid { display: grid; grid-template-columns: 1fr 1fr; border-top: 1px solid var(--line); border-left: 1px solid var(--line); }
.hd-team-card { min-width: 0; display: grid; grid-template-columns: 132px 1fr; align-items: stretch; border-right: 1px solid var(--line); border-bottom: 1px solid var(--line); background: var(--bg); }
.hd-team-photo { display: block; width: 132px; height: 164px; object-fit: cover; object-position: center 24%; border-right: 1px solid var(--line); }
.hd-team-copy { display: flex; flex-direction: column; justify-content: center; min-width: 0; padding: 22px; }
.hd-team-name { font-family: var(--font-heading); font-size: 21px; line-height: 1.1; font-weight: 600; letter-spacing: -.03em; color: var(--ink); margin: 0 0 9px; }
.hd-team-role { font-family: var(--font-mono); font-size: 11px; line-height: 1.45; letter-spacing: .08em; text-transform: uppercase; color: var(--red); margin: 0; }
.hd-team-proof { font-family: var(--font-mono); font-size: 13px; line-height: 1.55; color: var(--muted); margin: 12px 0 0; }
.hd-team-network { display: flex; flex-direction: column; justify-content: center; gap: 16px; padding: 28px; border-right: 1px solid var(--line); border-bottom: 1px solid var(--line); font-family: var(--font-mono); font-size: 14px; line-height: 1.6; color: var(--muted); }
.hd-team-network p { margin: 0; }
.hd-team-network .hd-team-goal { color: var(--ink); font-weight: 600; }
.hd-team-link { display: inline-block; margin-top: 22px; font-family: var(--font-mono); font-size: 14px; font-weight: 500; color: var(--red); text-decoration: none; border-bottom: 1px solid var(--red); padding-bottom: 3px; }
.hd-team-link:hover { color: var(--ink); border-color: var(--ink); }

/* CATALOGUE */
.hd-catalog { max-width: 1180px; margin: 0 auto; padding: 72px 24px 24px; }
.hd-catalog-head { max-width: 720px; margin: 0 auto 38px; text-align: center; }
.hd-catalog-sub { font-family: var(--font-mono); font-size: 14px; line-height: 1.6; color: var(--muted); margin: 16px auto 0; max-width: 660px; }
.hd-agent-grid { display: grid; grid-template-columns: repeat(4, minmax(0, 1fr)); grid-auto-rows: 1fr; border-top: 1px solid var(--line); border-left: 1px solid var(--line); }
.hd-agent { min-width: 0; display: flex; flex-direction: column; background: var(--bg); border-right: 1px solid var(--line); border-bottom: 1px solid var(--line); }
.hd-agent-top { display: flex; align-items: center; gap: 13px; min-height: 84px; padding: 18px 20px; border-bottom: 1px solid var(--line); }
.hd-agent-id { min-width: 0; }
.hd-agent-name { font-family: var(--font-heading); font-size: 19px; line-height: 1.05; font-weight: 600; letter-spacing: -0.03em; color: var(--ink); margin: 0; }
.hd-agent-case { flex: 1; display: flex; flex-direction: column; padding: 18px 20px 20px; }
.hd-case-title { display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; font-family: var(--font-heading); font-size: 16px; line-height: 1.2; font-weight: 600; letter-spacing: -0.03em; color: var(--ink); margin: 0 0 8px; min-height: 2.4em; }
.hd-case-desc { display: -webkit-box; -webkit-line-clamp: 3; -webkit-box-orient: vertical; overflow: hidden; font-family: var(--font-mono); font-size: 12.5px; line-height: 1.5; color: var(--muted); margin: 0 0 14px; }
.hd-case-meta { align-self: flex-start; margin-top: auto; max-width: 100%; font-family: var(--font-mono); font-size: 10px; letter-spacing: .09em; text-transform: uppercase; color: var(--red); background: var(--tint); padding: 4px 7px; overflow-wrap: anywhere; }
.hd-catalog-foot { font-family: var(--font-mono); font-size: 12px; line-height: 1.5; color: var(--muted); text-align: center; margin: 22px auto 0; }
.hd-catalog-cta { display: flex; justify-content: center; margin: 24px 0 0; }
.hd-act { display: inline-flex; align-items: center; gap: 9px; }
.hd-act .hd-cta-arrow { transition: transform .2s ease; }
.hd-act:hover .hd-cta-arrow { transform: translateX(3px); }
.hd-catalog-cta .hd-act { padding: 15px 28px; font-size: 14.5px; }
/* eyebrow numérotée (façon Denem) */
.hd-eyebrow-n { color: var(--muted); }
/* hovers plus marqués */
.hd-pilier { transition: background .2s ease; }
.hd-pilier:hover { background: var(--band); }

/* PRIX */
.hd-pricing { max-width: 1120px; margin: 0 auto; padding: 72px 24px 54px; }
.hd-price-grid { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); border: 1px solid var(--line); }
.hd-price + .hd-price { border-left: 1px solid var(--line); }
.hd-price.featured { border-left: 1px solid var(--line); }
.hd-price.featured .hd-pilier-format { color: var(--red); border-color: var(--red); }

.hd-btn.onink { background: var(--bg); color: var(--ink); white-space: nowrap; }
.hd-btn.onink:hover { background: var(--red); color: #fff; }

/* PILIERS */
.hd-piliers { max-width: 1120px; margin: 0 auto; padding: 72px 24px 24px; }
.hd-piliers-head { text-align: center; margin: 0 0 40px; }
.hd-eyebrow { font-family: var(--font-mono); font-size: 12px; letter-spacing: .16em; text-transform: uppercase; color: var(--red); margin: 0 0 12px; }
.hd-h2 { font-family: var(--font-heading); font-size: clamp(26px, 3.4vw, 40px); line-height: 1.1; font-weight: 600; letter-spacing: -0.04em; text-wrap: balance; margin: 0; }
.hd-grid { display: grid; grid-template-columns: 1fr 1fr; border: 1px solid var(--line); }
.hd-pilier { display: flex; flex-direction: column; padding: 36px 34px 34px; }
.hd-pilier + .hd-pilier { border-left: 1px solid var(--line); }
.hd-pilier-tag { display: flex; align-items: center; gap: 12px; margin: 0 0 18px; }
.hd-pilier-n { font-family: var(--font-mono); font-size: 12px; font-weight: 600; color: #fff; background: var(--ink); padding: 4px 9px; }
.hd-pilier-eye { font-family: var(--font-mono); font-size: 12px; letter-spacing: .14em; text-transform: uppercase; color: var(--muted); }
.hd-pilier-title { font-family: var(--font-heading); font-size: clamp(22px, 2.6vw, 30px); line-height: 1.12; font-weight: 600; letter-spacing: -0.04em; margin: 0 0 14px; }
.hd-pilier-desc { font-family: var(--font-mono); font-size: 14px; line-height: 1.6; color: var(--muted); margin: 0 0 24px; }

.hd-pilier-format { font-family: var(--font-mono); font-size: 11px; letter-spacing: .04em; color: var(--red); border: 1px solid var(--line); padding: 3px 8px; margin-left: auto; }
.hd-steps { list-style: none; margin: 0 0 22px; padding: 0; border-top: 1px solid var(--line); }
.hd-step { display: flex; align-items: baseline; gap: 14px; padding: 12px 0; border-bottom: 1px solid var(--line); }
.hd-step-n { font-family: var(--font-mono); font-size: 12px; font-weight: 600; color: var(--red); min-width: 22px; }
.hd-step-label { font-family: var(--font-body); font-size: 15px; font-weight: 500; letter-spacing: -0.02em; color: var(--ink); }
.hd-forms { list-style: none; margin: 0 0 22px; padding: 0; }
.hd-form { position: relative; font-family: var(--font-mono); font-size: 13.5px; line-height: 1.5; color: var(--ink); padding: 12px 0 12px 22px; border-bottom: 1px solid var(--line); }
.hd-form:first-child { border-top: 1px solid var(--line); }
.hd-form::before { content: "→"; position: absolute; left: 0; color: var(--red); }

.hd-pilier-proof { font-family: var(--font-mono); font-size: 12px; line-height: 1.5; color: var(--faint); margin: 0 0 22px; }
.hd-pilier-link { margin-top: auto; font-family: var(--font-mono); font-size: 14px; font-weight: 500; letter-spacing: .02em; color: var(--red); text-decoration: none; border-bottom: 1px solid var(--red); padding-bottom: 3px; align-self: flex-start; }
.hd-pilier-link:hover { color: var(--ink); border-color: var(--ink); }

/* CTA */
.hd-cta { max-width: 720px; margin: 0 auto; padding: 80px 24px 110px; text-align: center; }
.hd-cta-seal { height: 52px; width: auto; display: block; margin: 0 auto 26px; }
.hd-nl { text-align: center; padding: 72px 24px; border-top: 1px solid var(--hd-border, rgba(20,20,26,.10)); }
.hd-nl-h { font-family: var(--font-body); font-size: clamp(24px, 3.2vw, 36px); line-height: 1.08; font-weight: 600; letter-spacing: -0.04em; margin: 10px 0 12px; }
.hd-nl-p { font-family: var(--font-mono); font-size: 14px; line-height: 1.6; color: var(--muted); margin: 0 auto 24px; max-width: 460px; }
.hd-nl-form { display: flex; gap: 10px; justify-content: center; flex-wrap: wrap; max-width: 480px; margin: 0 auto; }
.hd-nl-input { font-family: var(--font-mono); font-size: 14px; padding: 12px 14px; border: 1px solid rgba(20,20,26,.18); background: transparent; min-width: 240px; flex: 1; }
.hd-nl-input:focus { outline: 2px solid var(--ink, #0C0C0D); outline-offset: -1px; }
.hd-nl-ok { font-family: var(--font-mono); font-size: 14px; color: var(--ink, #0C0C0D); }
.hd-nl-err { font-family: var(--font-mono); font-size: 13px; color: var(--red, #D1132F); margin-top: 10px; }
.hd-cta-h { font-family: var(--font-body); font-size: clamp(28px, 4vw, 44px); line-height: 1.05; font-weight: 600; letter-spacing: -0.04em; margin: 0 0 16px; }
.hd-cta-p { font-family: var(--font-mono); font-size: 15px; line-height: 1.6; color: var(--muted); margin: 0 auto 30px; max-width: 520px; }
.hd-cta-old { margin: 34px 0 0; }
.hd-cta-old a { font-family: var(--font-mono); font-size: 12px; letter-spacing: .06em; text-transform: uppercase; color: var(--faint); text-decoration: none; }
.hd-cta-old a:hover { color: var(--ink); }

@media (max-width: 820px) {
  .hd-grid { grid-template-columns: 1fr; }
  .hd-pilier + .hd-pilier { border-left: 0; border-top: 1px solid var(--line); }
  .hd-agent-grid { grid-template-columns: repeat(2, minmax(0, 1fr)); }
  .hd-price-grid { grid-template-columns: 1fr; }
  .hd-price + .hd-price { border-left: 0; border-top: 1px solid var(--line); }
  .hd-terrain-inner { grid-template-columns: 1fr; gap: 28px; }
  .hd-terrain-head { max-width: none; }
  .hd-terrain-photo { aspect-ratio: 16 / 11; }
  .hd-team-grid { grid-template-columns: 1fr; }
}
@media (max-width: 520px) {
  .hd-hero { padding-top: 58px; }
  .hd-h1 { font-size: clamp(36px, 13vw, 52px); }
  .hd-agent-grid { grid-template-columns: 1fr; }
  .hd-agent-top { padding: 20px 18px 16px; }
  .hd-team-card { grid-template-columns: 104px 1fr; }
  .hd-team-photo { width: 104px; height: 136px; }
  .hd-team-copy { padding: 18px; }
  .hd-transfo { grid-template-columns: 1fr; }
  .hd-transfo-col.apres { border-left: 0; border-top: 1px solid var(--line); }
  .hd-transfo-arrow { display: none; }
}
.hd-legal { text-align: center; font-family: var(--font-mono); font-size: 12px; color: var(--muted); letter-spacing: .02em; padding: 24px 20px 40px; border-top: 1px solid var(--line); }
.hd-legal a { color: inherit; text-decoration: underline; text-underline-offset: 2px; }
.hd-legal a:hover { color: var(--ink); }
`;
