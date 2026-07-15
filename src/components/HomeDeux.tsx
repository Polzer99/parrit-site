import Link from "next/link";
import LaunchCard from "@/components/LaunchCard";
import type { Locale } from "@/app/[lang]/dictionaries";
import type { Launch } from "@/lib/launches";
import type { BlogPost } from "@/lib/blog";
import { getCatalog, type AgentGroup } from "@/lib/agents";

// Barre de preuve : logos clients, repris de la home historique.
const CLIENT_LOGOS: { alt: string; src: string; cn?: boolean }[] = [
  { alt: "Lavazza", src: "/brand/client-logos/logo-1.png" },
  { alt: "Laparra", src: "/brand/client-logos/logo-2.png" },
  { alt: "SNCF", src: "/brand/client-logos/logo-3.png" },
  { alt: "Joone", src: "/brand/client-logos/logo-4.png" },
  { alt: "Clevery", src: "/brand/client-logos/logo-5.png" },
  { alt: "EFI", src: "/brand/client-logos/logo-6.png" },
  { alt: "Carte Noire", src: "/brand/client-logos/logo-7.png", cn: true },
];

// Preuve terrain : vraies photos d'ateliers / masterclass / plénières (ordre = terrainCaps).
const TERRAIN_PHOTOS = [
  "/brand/terrain/atelier-cartographie.jpg",
  "/brand/terrain/masterclass-acculturation.jpg",
  "/brand/terrain/pleniere-prise-parole.jpg",
];

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
  ctaHire: string;
  ctaDemo: string;
  changeEyebrow: string;
  changeH: string;
  changeSub: string;
  changeAvant: string;
  changeApres: string;
  changeRows: { cas: string; avant: string; apres: string }[];
  trust: string;
  terrainEyebrow: string;
  terrainH: string;
  terrainP: string;
  terrainCaps: string[];
  catEyebrow: string;
  catH2: string;
  catSub: string;
  catFoot: (count: number) => string;
  agentMore: (list: string) => string;
  offersEyebrow: string;
  offersH2: string;
  offersFoot: string;
  offers: Offer[];
  veilleEyebrow: string;
  veilleH: string;
  veilleP: string;
  veilleCta: string;
  transEyebrow: string;
  transH2: string;
  transSub: string;
  readArticle: string;
  allArticles: string;
  launchEyebrow: string;
  launchH2: string;
  allLaunches: string;
  ctaH: string;
  ctaP: string;
  ctaOld: string;
};

const DICT: Record<Locale, HomeCopy> = {
  fr: {
    badge: "Opérateur IA à temps partagé",
    h1a: "On ne vend pas de l'IA. On ",
    h1red: "recrute des agents",
    h1b: " qui travaillent chez vous.",
    lede: "Des collaborateurs virtuels avec une fiche de poste, un périmètre, des accès limités et un responsable humain. Ils tournent sur vos workflows, pas dans un deck.",
    ctaHire: "Embaucher un agent",
    ctaDemo: "Réserver une démo",
    changeEyebrow: "Avant / Après",
    changeH: "Concrètement, ce que ça change.",
    changeSub: "Des cas réels, déjà en production. Avant, après.",
    changeAvant: "Avant",
    changeApres: "Après",
    changeRows: [
      { cas: "CRM agentique · Commercial", avant: "CRM rempli à la main, puis oublié.", apres: "Mis à jour tout seul, à chaque échange." },
      { cas: "Veille · Direction", avant: "Sources dispersées, des heures par semaine.", apres: "Un seul mail condensé, chaque matin." },
      { cas: "Operating system · Cabinet d'avocats", avant: "Mails, agenda et documents en gestes manuels.", apres: "Un système prépare tout — validation humaine." },
      { cas: "Pilotage · Ouverture de franchises", avant: "Chaque ouverture suivie dans des tableurs.", apres: "Un outil centralise toutes les ouvertures." },
      { cas: "Claude Code · Marque DTC", avant: "Produit et tech au rythme d'allers-retours lents.", apres: "L'équipe livre elle-même, chaque semaine." },
    ],
    trust: "Déjà en production chez",
    terrainEyebrow: "Sur le terrain",
    terrainH: "On déploie avec vos équipes, pas à distance.",
    terrainP: "Cartographie des workflows, acculturation, prise de parole : on installe l'IA au contact de vos équipes, dans vos murs.",
    terrainCaps: ["Cartographie de workflow · atelier", "Masterclass d'acculturation", "Prise de parole · plénière"],
    catEyebrow: "Catalogue",
    catH2: "Pas des slides. Des agents qui tournent en production.",
    catSub: "Des profils prêts à entrer dans vos opérations : acquisition, veille, données, contenu, support et pilotage. Chaque cas décrit un agent réel, déjà en production.",
    catFoot: (count) => `${count} agents déjà en production. Ajouter un cas au catalogue le fait remonter ici.`,
    agentMore: (list) => `Aussi en production : ${list}.`,
    offersEyebrow: "Nos offres",
    offersH2: "Trois façons de mettre l'IA au travail chez vous.",
    offersFoot: "Les tarifs sont détaillés sur chaque offre.",
    offers: [
      { n: "01", eyebrow: "Transformation IA", title: "Faire de l'IA un levier réel, pas des POC.", desc: "Audit, cartographie des cas d'usage prioritaires, déploiement. Un partenaire qui pilote la transformation de bout en bout.", points: ["Audit", "Cas d'usage prioritaires", "Déploiement", "Passation"], audience: "Pour les COMEX et les DSI.", cta: "Découvrir la Transformation", href: "croissance" },
      { n: "02", eyebrow: "Agent IA", title: "Un agent recruté, en production.", desc: "On choisit un workflow utile, on met l'agent en production, on passe la main à vos équipes. Un agent, un périmètre.", points: ["Diagnostic", "Périmètre clair", "En production", "Passation"], audience: "Pour les directions métier, la DG et la DSI.", cta: "Découvrir le déploiement d'agent", href: "deployer" },
      { n: "03", eyebrow: "Coaching", title: "On rend vos équipes autonomes.", desc: "On installe la stack, on déploie un premier agent avec vous, et chacun repart capable d'en construire d'autres.", points: ["Claude Code + Codex", "Ateliers hands-on", "Certification Qualiopi"], audience: "Pour la direction générale et les directions métier.", cta: "Découvrir le coaching", href: "transmettre" },
    ],
    veilleEyebrow: "Pour commencer · sans engagement",
    veilleH: "Votre veille, condensée dans un seul mail.",
    veilleP: "Toutes vos sources condensées dans un seul mail, à votre format. On nettoie votre boîte de réception, vous ne ratez plus rien. La porte d'entrée la plus simple pour voir ce qu'on sait faire.",
    veilleCta: "Réserver ma veille",
    transEyebrow: "Cas d'usage",
    transH2: "Ce que l'IA change concrètement, métier par métier.",
    transSub: "Des situations qu'on sait prendre en charge, de la relance commerciale à la veille juridique, expliquées en détail : ce qu'on branche, et ce que ça change au quotidien.",
    readArticle: "Lire l'article →",
    allArticles: "Tous les articles →",
    launchEyebrow: "Build in public",
    launchH2: "Une preuve de fabrication, chaque semaine.",
    allLaunches: "Tous les launches →",
    ctaH: "On en parle 15 minutes ?",
    ctaP: "On part d'un poste à recruter, pas d'une transformation abstraite. En 15 minutes, on choisit le premier agent utile.",
    ctaOld: "Voir le parcours complet, niveau par niveau →",
  },
  en: {
    badge: "Fractional AI operator",
    h1a: "We don't sell AI. We ",
    h1red: "hire agents",
    h1b: " that work inside your company.",
    lede: "Virtual coworkers with a job description, a scope, limited access and a human manager. They run on your real workflows, not in a deck.",
    ctaHire: "Hire an agent",
    ctaDemo: "Book a demo",
    changeEyebrow: "Before / After",
    changeH: "Concretely, what changes.",
    changeSub: "Real cases, already in production. Before, after.",
    changeAvant: "Before",
    changeApres: "After",
    changeRows: [
      { cas: "Agentic CRM · Sales", avant: "CRM filled by hand, then forgotten.", apres: "Updated on its own, after every exchange." },
      { cas: "Monitoring · Leadership", avant: "Scattered sources, hours every week.", apres: "One condensed email, every morning." },
      { cas: "Operating system · Law firm", avant: "Email, calendar and documents handled by hand.", apres: "A system prepares it all — human sign-off." },
      { cas: "Steering · Franchise openings", avant: "Every opening tracked in scattered spreadsheets.", apres: "One tool centralizes every opening." },
      { cas: "Claude Code · DTC brand", avant: "Product and tech stuck on slow back-and-forth.", apres: "The team ships on its own, every week." },
    ],
    trust: "Already in production at",
    terrainEyebrow: "On the ground",
    terrainH: "We deploy with your teams, not from a distance.",
    terrainP: "Workflow mapping, upskilling, speaking: we install AI next to your teams, on your premises.",
    terrainCaps: ["Workflow mapping · workshop", "Upskilling masterclass", "Keynote · plenary"],
    catEyebrow: "Catalog",
    catH2: "Not slides. Agents running in production.",
    catSub: "Profiles ready to step into your operations: acquisition, monitoring, data, content, support and steering. Each case describes a real agent, already in production.",
    catFoot: (count) => `${count} agents already in production. Add a case to the catalog and it shows up here.`,
    agentMore: (list) => `Also in production: ${list}.`,
    offersEyebrow: "Our offers",
    offersH2: "Three ways to put AI to work inside your company.",
    offersFoot: "Pricing is detailed on each offer.",
    offers: [
      { n: "01", eyebrow: "AI Transformation", title: "Make AI a real lever, not a pile of POCs.", desc: "Audit, mapping of priority use cases, deployment. A partner who drives the transformation end to end.", points: ["Audit", "Priority use cases", "Deployment", "Handover"], audience: "For executive committees and IT leaders.", cta: "Explore Transformation", href: "croissance" },
      { n: "02", eyebrow: "AI Agent", title: "One agent hired, in production.", desc: "We pick a useful workflow, put the agent in production, then hand over to your teams. One agent, one scope.", points: ["Diagnosis", "Clear scope", "In production", "Handover"], audience: "For business units, executive and IT leadership.", cta: "Explore agent deployment", href: "deployer" },
      { n: "03", eyebrow: "Coaching", title: "We make your teams autonomous.", desc: "We set up the stack, deploy a first agent with you, and everyone leaves able to build more.", points: ["Claude Code + Codex", "Hands-on workshops", "Qualiopi certification"], audience: "For executive and business leadership.", cta: "Explore coaching", href: "transmettre" },
    ],
    veilleEyebrow: "To start · no commitment",
    veilleH: "Your monitoring, condensed into a single email.",
    veilleP: "All your sources condensed into a single email, in your format. We clean up your inbox, you stop missing things. The simplest way in to see what we can do.",
    veilleCta: "Get my briefing",
    transEyebrow: "Use cases",
    transH2: "What AI actually changes, role by role.",
    transSub: "Situations we know how to handle, from sales follow-up to legal monitoring, explained in detail: what we plug in, and what it changes day to day.",
    readArticle: "Read the article →",
    allArticles: "All articles →",
    launchEyebrow: "Build in public",
    launchH2: "Proof of work, every week.",
    allLaunches: "All launches →",
    ctaH: "Shall we talk for 15 minutes?",
    ctaP: "We start from a role to fill, not an abstract transformation. In 15 minutes, we pick the first useful agent.",
    ctaOld: "See the full path, level by level →",
  },
  "pt-BR": {
    badge: "Operador de IA em tempo compartilhado",
    h1a: "Não vendemos IA. Nós ",
    h1red: "recrutamos agentes",
    h1b: " que trabalham dentro da sua empresa.",
    lede: "Colaboradores virtuais com uma descrição de cargo, um perímetro, acessos limitados e um responsável humano. Eles rodam nos seus fluxos de trabalho reais, não num slide.",
    ctaHire: "Recrutar um agente",
    ctaDemo: "Agendar uma demo",
    changeEyebrow: "Antes / Depois",
    changeH: "Concretamente, o que muda.",
    changeSub: "Casos reais, já em produção. Antes, depois.",
    changeAvant: "Antes",
    changeApres: "Depois",
    changeRows: [
      { cas: "CRM agêntico · Comercial", avant: "CRM preenchido à mão e depois esquecido.", apres: "Atualizado sozinho, a cada interação." },
      { cas: "Monitoramento · Direção", avant: "Fontes dispersas, horas por semana.", apres: "Um único e-mail condensado, toda manhã." },
      { cas: "Operating system · Escritório de advocacia", avant: "E-mails, agenda e documentos em gestos manuais.", apres: "Um sistema prepara tudo — validação humana." },
      { cas: "Pilotagem · Abertura de franquias", avant: "Cada abertura acompanhada em planilhas dispersas.", apres: "Uma ferramenta centraliza todas as aberturas." },
      { cas: "Claude Code · Marca DTC", avant: "Produto e tech no ritmo de idas e vindas lentas.", apres: "A equipe entrega sozinha, toda semana." },
    ],
    trust: "Já em produção na",
    terrainEyebrow: "No terreno",
    terrainH: "Implantamos com suas equipes, não à distância.",
    terrainP: "Mapeamento de fluxos, capacitação, palestras: instalamos a IA junto das suas equipes, na sua empresa.",
    terrainCaps: ["Mapeamento de fluxo · workshop", "Masterclass de capacitação", "Palestra · plenária"],
    catEyebrow: "Catálogo",
    catH2: "Nada de slides. Agentes rodando em produção.",
    catSub: "Perfis prontos para entrar nas suas operações: aquisição, monitoramento, dados, conteúdo, suporte e gestão. Cada caso descreve um agente real, já em produção.",
    catFoot: (count) => `${count} agentes já em produção. Adicionar um caso ao catálogo o traz para cá.`,
    agentMore: (list) => `Também em produção: ${list}.`,
    offersEyebrow: "Nossas ofertas",
    offersH2: "Três formas de colocar a IA para trabalhar na sua empresa.",
    offersFoot: "Os preços são detalhados em cada oferta.",
    offers: [
      { n: "01", eyebrow: "Transformação IA", title: "Fazer da IA uma alavanca real, não uma pilha de POCs.", desc: "Auditoria, mapeamento dos casos de uso prioritários, implantação. Um parceiro que conduz a transformação de ponta a ponta.", points: ["Auditoria", "Casos de uso prioritários", "Implantação", "Passagem"], audience: "Para comitês executivos e líderes de TI.", cta: "Conhecer a Transformação", href: "croissance" },
      { n: "02", eyebrow: "Agente IA", title: "Um agente recrutado, em produção.", desc: "Escolhemos um fluxo útil, colocamos o agente em produção e passamos o bastão para as suas equipes. Um agente, um perímetro.", points: ["Diagnóstico", "Perímetro claro", "Em produção", "Passagem"], audience: "Para as áreas de negócio, a diretoria e a TI.", cta: "Conhecer a implantação de agente", href: "deployer" },
      { n: "03", eyebrow: "Coaching", title: "Tornamos suas equipes autônomas.", desc: "Instalamos a stack, implantamos um primeiro agente com você, e cada um sai capaz de construir outros.", points: ["Claude Code + Codex", "Workshops hands-on", "Certificação Qualiopi"], audience: "Para a diretoria e as áreas de negócio.", cta: "Conhecer o coaching", href: "transmettre" },
    ],
    veilleEyebrow: "Para começar · sem compromisso",
    veilleH: "Sua curadoria, condensada em um único e-mail.",
    veilleP: "Todas as suas fontes condensadas em um único e-mail, no seu formato. Limpamos a sua caixa de entrada, você não perde mais nada. A porta de entrada mais simples para ver o que sabemos fazer.",
    veilleCta: "Reservar meu resumo",
    transEyebrow: "Casos de uso",
    transH2: "O que a IA muda concretamente, função por função.",
    transSub: "Situações que sabemos assumir, do follow-up comercial ao monitoramento jurídico, explicadas em detalhe: o que conectamos e o que muda no dia a dia.",
    readArticle: "Ler o artigo →",
    allArticles: "Todos os artigos →",
    launchEyebrow: "Build in public",
    launchH2: "Uma prova de fabricação, toda semana.",
    allLaunches: "Todos os launches →",
    ctaH: "Vamos conversar 15 minutos?",
    ctaP: "Partimos de um cargo a preencher, não de uma transformação abstrata. Em 15 minutos, escolhemos o primeiro agente útil.",
    ctaOld: "Ver o percurso completo, nível por nível →",
  },
  "zh-CN": {
    badge: "分时 AI 运营伙伴",
    h1a: "我们不卖 AI。我们",
    h1red: "招募智能体",
    h1b: "，让它们在你的公司里干活。",
    lede: "拥有岗位职责、明确边界、受限权限和人类负责人的虚拟同事。它们运行在你真实的工作流上，而不是在演示文稿里。",
    ctaHire: "招募一个智能体",
    ctaDemo: "预约演示",
    changeEyebrow: "之前 / 之后",
    changeH: "具体改变了什么。",
    changeSub: "真实案例，已在生产环境运行。之前，之后。",
    changeAvant: "之前",
    changeApres: "之后",
    changeRows: [
      { cas: "智能体 CRM · 商务", avant: "CRM 靠手动填写，然后被遗忘。", apres: "每次往来后自动更新。" },
      { cas: "情报监测 · 管理层", avant: "信息源分散，每周耗费数小时。", apres: "每天早晨一封浓缩邮件。" },
      { cas: "Operating system · 律师事务所", avant: "邮件、日程与文档全靠手动处理。", apres: "系统全部备好——人工把关。" },
      { cas: "统筹 · 门店加盟开设", avant: "每家门店开设散落在各种表格里跟踪。", apres: "一个工具集中管理所有开设进度。" },
      { cas: "Claude Code · DTC 品牌", avant: "产品与技术卡在缓慢的来回沟通上。", apres: "团队每周自己交付。" },
    ],
    trust: "已在以下公司投入生产",
    terrainEyebrow: "在一线",
    terrainH: "我们和你的团队一起部署，而不是远程交付。",
    terrainP: "梳理工作流、团队培训、现场分享：我们在你的团队身边、在你的办公室里落地 AI。",
    terrainCaps: ["工作流梳理 · 工作坊", "团队培训 masterclass", "主题分享 · 全体会议"],
    catEyebrow: "目录",
    catH2: "不是幻灯片，而是真正在生产环境运行的智能体。",
    catSub: "随时可以进入你运营的角色：获客、监测、数据、内容、支持与统筹。每个案例都是一个真实、已在生产环境运行的智能体。",
    catFoot: (count) => `${count} 个智能体已在生产环境运行。向目录添加一个案例，它就会出现在这里。`,
    agentMore: (list) => `同样在生产中：${list}。`,
    offersEyebrow: "我们的服务",
    offersH2: "让 AI 在你公司里干活的三种方式。",
    offersFoot: "各服务的定价详见对应页面。",
    offers: [
      { n: "01", eyebrow: "AI 转型", title: "让 AI 成为真正的杠杆，而不是一堆概念验证。", desc: "审计、优先用例梳理、部署。一个从头到尾主导转型的合作伙伴。", points: ["审计", "优先用例", "部署", "交接"], audience: "面向管理层与 IT 负责人。", cta: "了解转型服务", href: "croissance" },
      { n: "02", eyebrow: "AI 智能体", title: "招募一个智能体，投入生产。", desc: "我们挑选一个有用的工作流，把智能体投入生产，再交接给你的团队。一个智能体，一个边界。", points: ["诊断", "清晰边界", "投入生产", "交接"], audience: "面向业务部门、管理层与 IT。", cta: "了解智能体部署", href: "deployer" },
      { n: "03", eyebrow: "陪跑培训", title: "我们让你的团队自主上手。", desc: "我们搭好技术栈，和你一起部署第一个智能体，每个人离开时都能自己再造更多。", points: ["Claude Code + Codex", "实操工作坊", "Qualiopi 认证"], audience: "面向管理层与业务部门。", cta: "了解陪跑培训", href: "transmettre" },
    ],
    veilleEyebrow: "先从这里开始 · 无需承诺",
    veilleH: "把你的情报，浓缩进一封邮件。",
    veilleP: "把你所有的信息源浓缩进一封邮件，按你的格式。我们帮你清理收件箱，你不再错过任何要紧事。这是了解我们能做什么的最简单入口。",
    veilleCta: "预约我的简报",
    transEyebrow: "应用场景",
    transH2: "AI 究竟改变了什么，一个岗位一个岗位地看。",
    transSub: "我们能接手的真实场景，从商务跟进到法律监测，都有详细说明：我们接入了什么，以及它如何改变日常。",
    readArticle: "阅读文章 →",
    allArticles: "全部文章 →",
    launchEyebrow: "Build in public",
    launchH2: "每周一份制造的证据。",
    allLaunches: "全部发布 →",
    ctaH: "聊 15 分钟？",
    ctaP: "我们从一个要招的岗位出发，而不是抽象的转型。15 分钟内，我们一起选出第一个有用的智能体。",
    ctaOld: "查看完整路径，逐级了解 →",
  },
};

function AgentCard({ group }: { group: AgentGroup }) {
  const agentCase = group.cases[0];
  return (
    <article className="hd-agent">
      <div className="hd-agent-top">
        <h3 className="hd-agent-fn">{group.persona.label}</h3>
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

export default function HomeDeux({
  lang,
  launches = [],
  posts = [],
}: {
  lang: Locale;
  launches?: Launch[];
  posts?: BlogPost[];
}) {
  const t = DICT[lang] ?? DICT.fr;
  const featured = posts[0];
  const rest = posts.slice(1, 5);
  const catalog = getCatalog({ perDept: 1, lang });
  return (
    <main className="hd">
      <style>{CSS}</style>

      {/* ===== HERO ===== */}
      <header className="hd-hero">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img className="hd-lockup" src="/brand/parrit-lockup.svg" alt="Parrit·ai" />
        <p className="hd-badge">{t.badge}</p>
        <h1 className="hd-h1">
          {t.h1a}<span className="hd-red">{t.h1red}</span>{t.h1b}
        </h1>
        <p className="hd-lede">{t.lede}</p>
        <div className="hd-hero-cta">
          <Link className="hd-btn primary" href={`/${lang}/rendez-vous?source=home-hire-agent`}>
            {t.ctaHire}
          </Link>
          <Link className="hd-btn ghost" href={`/${lang}/rendez-vous?source=home-demo`}>
            {t.ctaDemo}
          </Link>
        </div>
      </header>

      {/* ===== AVANT / APRES (preuve concrete, cas reels) ===== */}
      <section className="hd-change" aria-labelledby="hd-change-h">
        <div className="hd-change-head">
          <p className="hd-eyebrow">{t.changeEyebrow}</p>
          <h2 id="hd-change-h" className="hd-h2">{t.changeH}</h2>
          <p className="hd-change-sub">{t.changeSub}</p>
        </div>
        <div className="hd-change-table">
          {t.changeRows.map((r) => (
            <div className="hd-change-row" key={r.cas}>
              <p className="hd-change-cas">{r.cas}</p>
              <div className="hd-change-pair">
                <span className="hd-change-cell avant">{r.avant}</span>
                <span className="hd-change-cell apres">{r.apres}</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ===== TRUST ===== */}
      <section className="hd-trust" aria-label={t.trust}>
        <p className="hd-trust-lab">{t.trust}</p>
        <div className="hd-logos">
          {CLIENT_LOGOS.map((l) => (
            // eslint-disable-next-line @next/next/no-img-element
            <img key={l.alt} className={l.cn ? "logo-cn" : ""} src={l.src} alt={l.alt} loading="lazy" />
          ))}
        </div>
      </section>

      {/* ===== CATALOGUE ===== */}
      <section className="hd-catalog" id="catalogue-agents" aria-labelledby="hd-catalog-h">
        <div className="hd-catalog-head">
          <p className="hd-eyebrow">{t.catEyebrow}</p>
          <h2 id="hd-catalog-h" className="hd-h2">{t.catH2}</h2>
          <p className="hd-catalog-sub">{t.catSub}</p>
        </div>
        <div className="hd-agent-grid">
          {catalog.groups.map((group) => (
            <AgentCard group={group} key={group.persona.key} />
          ))}
        </div>
        <p className="hd-catalog-foot">{t.catFoot(catalog.deployedCount)}</p>
      </section>

      {/* ===== SUR LE TERRAIN (preuve d'execution, vraies photos) ===== */}
      <section className="hd-terrain" aria-labelledby="hd-terrain-h">
        <div className="hd-terrain-head">
          <p className="hd-eyebrow">{t.terrainEyebrow}</p>
          <h2 id="hd-terrain-h" className="hd-h2">{t.terrainH}</h2>
          <p className="hd-terrain-sub">{t.terrainP}</p>
        </div>
        <div className="hd-terrain-grid">
          {TERRAIN_PHOTOS.map((src, i) => (
            <figure className="hd-terrain-item" key={src}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img className="hd-terrain-photo" src={src} alt={t.terrainCaps[i]} loading="lazy" />
              <figcaption className="hd-terrain-cap">{t.terrainCaps[i]}</figcaption>
            </figure>
          ))}
        </div>
      </section>

      {/* ===== OFFRES (sans prix sur la home, detailles sur chaque page offre) ===== */}
      <section className="hd-pricing" id="offres" aria-labelledby="hd-offers-h">
        <div className="hd-piliers-head">
          <p className="hd-eyebrow">{t.offersEyebrow}</p>
          <h2 id="hd-offers-h" className="hd-h2">{t.offersH2}</h2>
        </div>
        <div className="hd-price-grid">
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
              <Link className="hd-pilier-link" href={`/${lang}/${p.href}`}>
                {p.cta} →
              </Link>
            </article>
          ))}
        </div>
        <p className="hd-catalog-foot">{t.offersFoot}</p>
      </section>

      {/* ===== PRODUIT D'APPEL - La Veille ===== */}
      <section className="hd-veille" aria-labelledby="hd-veille-h">
        <div className="hd-veille-inner">
          <div className="hd-veille-text">
            <p className="hd-veille-eyebrow">{t.veilleEyebrow}</p>
            <h2 id="hd-veille-h" className="hd-veille-h">{t.veilleH}</h2>
            <p className="hd-veille-p">{t.veilleP}</p>
          </div>
          <div className="hd-veille-action">
            <Link className="hd-btn onink" href={`/${lang}/rendez-vous`}>{t.veilleCta}</Link>
          </div>
        </div>
      </section>

      {/* ===== TRANSFORMATIONS (blog reel) ===== */}
      {featured && (
        <section className="hd-transfos" aria-labelledby="hd-transfos-h">
          <div className="hd-transfos-head">
            <p className="hd-eyebrow">{t.transEyebrow}</p>
            <h2 id="hd-transfos-h" className="hd-h2">{t.transH2}</h2>
            <p className="hd-transfos-sub">{t.transSub}</p>
          </div>

          <div className="hd-transfos-grid">
            {/* Article vedette */}
            <Link className="hd-feat" href={`/${lang}/blog/${featured.slug}`}>
              <div className="hd-feat-body">
                <p className="hd-art-meta">
                  <span className="hd-art-cat">{featured.category}</span>
                  <span className="hd-art-time">{featured.readingTime}</span>
                </p>
                <h3 className="hd-feat-title">{featured.title}</h3>
                <p className="hd-feat-desc">{featured.description}</p>
                <span className="hd-feat-link">{t.readArticle}</span>
              </div>
            </Link>

            {/* Liste des autres */}
            <ul className="hd-art-list">
              {rest.map((p) => (
                <li key={p.slug}>
                  <Link className="hd-art" href={`/${lang}/blog/${p.slug}`}>
                    <p className="hd-art-meta">
                      <span className="hd-art-cat">{p.category}</span>
                      <span className="hd-art-time">{p.readingTime}</span>
                    </p>
                    <h4 className="hd-art-title">{p.title}</h4>
                    <p className="hd-art-desc">{p.description}</p>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="hd-transfos-foot">
            <Link className="hd-btn ghost" href={`/${lang}/blog`}>
              {t.allArticles}
            </Link>
          </div>
        </section>
      )}

      {/* ===== LAUNCHES ===== */}
      {launches.length > 0 && (
        <section className="hd-launches" aria-labelledby="hd-launches-h">
          <div className="hd-launches-head">
            <p className="hd-eyebrow">{t.launchEyebrow}</p>
            <h2 id="hd-launches-h" className="hd-h2">{t.launchH2}</h2>
            <Link href={`/${lang}/launches`} className="hd-launches-all">{t.allLaunches}</Link>
          </div>
          <div className="hd-launch-grid">
            {launches.slice(0, 3).map((launch) => (
              <LaunchCard href={`/${lang}/launches/${launch.slug}`} key={launch.slug} launch={launch} />
            ))}
          </div>
        </section>
      )}

      {/* ===== CTA FINAL ===== */}
      <footer className="hd-cta">
        <h2 className="hd-cta-h">{t.ctaH}</h2>
        <p className="hd-cta-p">{t.ctaP}</p>
        <Link className="hd-btn primary lg" href={`/${lang}/rendez-vous?source=home-final-hire-agent`}>
          {t.ctaHire}
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
.hd-btn { display: inline-block; font-family: var(--font-mono); font-size: 14px; font-weight: 500; letter-spacing: .02em; padding: 12px 24px; text-decoration: none; border: 1px solid transparent; }
.hd-btn.primary { background: var(--ink); color: #fff; }
.hd-btn.primary:hover { background: var(--red); }
.hd-btn.ghost { background: transparent; color: var(--ink); border-color: var(--ink); }
.hd-btn.ghost:hover { background: var(--ink); color: var(--bg); }
.hd-btn.lg { padding: 16px 34px; font-size: 15px; }

/* HERO */
.hd-hero { max-width: 860px; margin: 0 auto; padding: 84px 24px 56px; text-align: center; }
.hd-lockup { height: 34px; width: auto; margin: 0 auto 34px; display: block; }
.hd-badge { display: inline-block; font-family: var(--font-mono); font-size: 11px; font-weight: 500; letter-spacing: .14em; text-transform: uppercase; color: var(--muted); margin: 0 0 26px; }
.hd-h1 { font-family: var(--font-body); font-size: clamp(40px, 6vw, 72px); line-height: 1.02; font-weight: 600; letter-spacing: -0.04em; text-wrap: balance; margin: 0; }
.hd-red { color: var(--ink); }
.hd-lede { max-width: 620px; margin: 26px auto 0; font-family: var(--font-mono); font-size: 15px; line-height: 1.65; color: var(--muted); }
.hd-hero-cta { display: flex; gap: 12px; justify-content: center; flex-wrap: wrap; margin-top: 34px; }

/* AVANT / APRES (preuve concrete) */
.hd-change { max-width: 1060px; margin: 0 auto; padding: 60px 24px 58px; }
.hd-change-head { text-align: center; max-width: 640px; margin: 0 auto 34px; }
.hd-change-sub { font-family: var(--font-mono); font-size: 14px; line-height: 1.6; color: var(--muted); margin: 14px auto 0; }
.hd-change-table { border: 1px solid var(--line); }
.hd-change-row { padding: 18px 24px 19px; }
.hd-change-row + .hd-change-row { border-top: 1px solid var(--line); }
.hd-change-cas { font-family: var(--font-mono); font-size: 11px; letter-spacing: .12em; text-transform: uppercase; color: var(--red); margin: 0 0 11px; }
.hd-change-pair { display: grid; grid-template-columns: 1fr 1fr; align-items: baseline; }
.hd-change-cell { font-family: var(--font-mono); font-size: 14px; line-height: 1.5; }
.hd-change-cell.avant { color: var(--muted); padding-right: 24px; }
.hd-change-cell.apres { color: var(--ink); font-weight: 500; position: relative; padding-left: 28px; }
.hd-change-cell.apres::before { content: "→"; position: absolute; left: 0; color: var(--red); font-weight: 600; }

/* SUR LE TERRAIN (vraies photos) */
.hd-terrain { max-width: 1120px; margin: 0 auto; padding: 66px 24px 24px; border-top: 1px solid var(--line); }
.hd-terrain-head { max-width: 720px; margin: 0 auto 34px; text-align: center; }
.hd-terrain-sub { font-family: var(--font-mono); font-size: 14px; line-height: 1.6; color: var(--muted); margin: 16px auto 0; max-width: 620px; }
.hd-terrain-grid { display: grid; grid-template-columns: repeat(3, 1fr); border: 1px solid var(--line); }
.hd-terrain-item { min-width: 0; margin: 0; display: flex; flex-direction: column; }
.hd-terrain-item + .hd-terrain-item { border-left: 1px solid var(--line); }
.hd-terrain-photo { display: block; width: 100%; aspect-ratio: 4 / 5; object-fit: cover; object-position: center; }
.hd-terrain-cap { font-family: var(--font-mono); font-size: 11px; letter-spacing: .1em; text-transform: uppercase; color: var(--muted); padding: 14px 18px 16px; border-top: 1px solid var(--line); }

/* TRUST */
.hd-trust { border-top: 1px solid var(--line); border-bottom: 1px solid var(--line); padding: 32px 24px; }
.hd-trust-lab { color: var(--faint); font-family: var(--font-mono); font-size: 11px; letter-spacing: .2em; text-transform: uppercase; text-align: center; margin: 0 0 24px; }
.hd-logos { display: flex; flex-wrap: wrap; align-items: center; justify-content: center; gap: clamp(26px, 5vw, 56px); max-width: 1000px; margin: 0 auto; }
.hd-logos img { height: 28px; max-width: 130px; width: auto; object-fit: contain; filter: grayscale(1); opacity: .68; transition: opacity .2s, filter .2s; }
.hd-logos img:hover { opacity: 1; filter: grayscale(0); }
.hd-logos img.logo-cn { height: 48px; max-width: 190px; }

/* CATALOGUE */
.hd-catalog { max-width: 1180px; margin: 0 auto; padding: 72px 24px 24px; }
.hd-catalog-head { max-width: 720px; margin: 0 auto 38px; text-align: center; }
.hd-catalog-sub { font-family: var(--font-mono); font-size: 14px; line-height: 1.6; color: var(--muted); margin: 16px auto 0; max-width: 660px; }
.hd-agent-grid { display: grid; grid-template-columns: repeat(4, minmax(0, 1fr)); grid-auto-rows: 1fr; border-top: 1px solid var(--line); border-left: 1px solid var(--line); }
.hd-agent { min-width: 0; display: flex; flex-direction: column; background: var(--bg); border-right: 1px solid var(--line); border-bottom: 1px solid var(--line); }
.hd-agent-top { display: flex; flex-direction: column; justify-content: flex-end; min-height: 60px; padding: 20px 20px 16px; border-bottom: 1px solid var(--line); }
.hd-agent-fn { font-family: var(--font-body); font-size: 20px; line-height: 1.12; font-weight: 600; letter-spacing: -0.03em; color: var(--ink); margin: 0; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; }
.hd-agent-case { flex: 1; display: flex; flex-direction: column; padding: 18px 20px 20px; }
.hd-case-title { display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; font-family: var(--font-body); font-size: 16px; line-height: 1.2; font-weight: 600; letter-spacing: -0.03em; color: var(--ink); margin: 0 0 8px; min-height: 2.4em; }
.hd-case-desc { display: -webkit-box; -webkit-line-clamp: 3; -webkit-box-orient: vertical; overflow: hidden; font-family: var(--font-mono); font-size: 12.5px; line-height: 1.5; color: var(--muted); margin: 0 0 14px; }
.hd-case-meta { align-self: flex-start; margin-top: auto; max-width: 100%; font-family: var(--font-mono); font-size: 10px; letter-spacing: .09em; text-transform: uppercase; color: var(--red); background: var(--tint); padding: 4px 7px; overflow-wrap: anywhere; }
.hd-catalog-foot { font-family: var(--font-mono); font-size: 12px; line-height: 1.5; color: var(--muted); text-align: center; margin: 22px auto 0; }

/* PRIX */
.hd-pricing { max-width: 1120px; margin: 0 auto; padding: 72px 24px 54px; }
.hd-price-grid { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); border: 1px solid var(--line); }
.hd-price + .hd-price { border-left: 1px solid var(--line); }
.hd-price.featured { border-left: 1px solid var(--line); }
.hd-price.featured .hd-pilier-format { color: var(--red); border-color: var(--red); }

/* PRODUIT D'APPEL - bandeau Veille */
.hd-veille { background: var(--ink); color: var(--bg); }
.hd-veille-inner { max-width: 1120px; margin: 0 auto; padding: 44px 24px; display: grid; grid-template-columns: 1fr auto; gap: 28px; align-items: center; }
.hd-veille-eyebrow { font-family: var(--font-mono); font-size: 11px; letter-spacing: .16em; text-transform: uppercase; color: var(--bg); margin: 0 0 12px; }
.hd-veille-h { font-family: var(--font-body); font-size: clamp(24px, 3.2vw, 36px); line-height: 1.05; font-weight: 600; letter-spacing: -0.04em; margin: 0 0 12px; color: var(--bg); }
.hd-veille-p { font-family: var(--font-mono); font-size: 14px; line-height: 1.6; color: rgba(255,253,250,.72); margin: 0; max-width: 620px; }
.hd-btn.onink { background: var(--bg); color: var(--ink); white-space: nowrap; }
.hd-btn.onink:hover { background: var(--red); color: #fff; }

/* PILIERS */
.hd-piliers { max-width: 1120px; margin: 0 auto; padding: 72px 24px 24px; }
.hd-piliers-head { text-align: center; margin: 0 0 40px; }
.hd-eyebrow { font-family: var(--font-mono); font-size: 12px; letter-spacing: .16em; text-transform: uppercase; color: var(--red); margin: 0 0 12px; }
.hd-h2 { font-family: var(--font-body); font-size: clamp(26px, 3.4vw, 40px); line-height: 1.1; font-weight: 600; letter-spacing: -0.04em; text-wrap: balance; margin: 0; }
.hd-grid { display: grid; grid-template-columns: 1fr 1fr; border: 1px solid var(--line); }
.hd-pilier { display: flex; flex-direction: column; padding: 36px 34px 34px; }
.hd-pilier + .hd-pilier { border-left: 1px solid var(--line); }
.hd-pilier-tag { display: flex; align-items: center; gap: 12px; margin: 0 0 18px; }
.hd-pilier-n { font-family: var(--font-mono); font-size: 12px; font-weight: 600; color: #fff; background: var(--ink); padding: 4px 9px; }
.hd-pilier-eye { font-family: var(--font-mono); font-size: 12px; letter-spacing: .14em; text-transform: uppercase; color: var(--muted); }
.hd-pilier-title { font-family: var(--font-body); font-size: clamp(22px, 2.6vw, 30px); line-height: 1.12; font-weight: 600; letter-spacing: -0.04em; margin: 0 0 14px; }
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

/* TRANSFORMATIONS */
.hd-transfos { max-width: 1120px; margin: 0 auto; padding: 72px 24px 24px; border-top: 1px solid var(--line); }
.hd-transfos-head { max-width: 720px; margin: 0 0 40px; }
.hd-transfos-sub { font-family: var(--font-mono); font-size: 14px; line-height: 1.6; color: var(--muted); margin: 16px 0 0; }
.hd-transfos-grid { display: grid; grid-template-columns: 1.15fr 1fr; border: 1px solid var(--line); }
.hd-feat { display: flex; text-decoration: none; color: inherit; background: var(--ink); }
.hd-feat-body { display: flex; flex-direction: column; padding: 34px 32px; }
.hd-feat .hd-art-cat { color: #fff; background: var(--red); }
.hd-feat .hd-art-time { color: rgba(255,255,255,.55); }
.hd-feat-title { font-family: var(--font-body); font-size: clamp(24px, 2.8vw, 34px); line-height: 1.1; font-weight: 600; letter-spacing: -0.04em; color: #fff; margin: 16px 0 14px; }
.hd-feat-desc { font-family: var(--font-mono); font-size: 14px; line-height: 1.65; color: rgba(255,255,255,.72); margin: 0 0 24px; }
.hd-feat-link { margin-top: auto; font-family: var(--font-mono); font-size: 14px; font-weight: 500; color: #fff; }
.hd-feat:hover .hd-feat-link { color: var(--red); }

.hd-art-list { list-style: none; margin: 0; padding: 0; display: flex; flex-direction: column; border-left: 1px solid var(--line); }
.hd-art-list li + li { border-top: 1px solid var(--line); }
.hd-art { display: block; text-decoration: none; color: inherit; padding: 22px 26px; transition: background .15s ease; }
.hd-art:hover { background: var(--band); }
.hd-art-meta { display: flex; align-items: center; gap: 12px; margin: 0 0 10px; }
.hd-art-cat { font-family: var(--font-mono); font-size: 10px; font-weight: 600; letter-spacing: .1em; text-transform: uppercase; color: var(--red); background: var(--tint); padding: 4px 8px; }
.hd-art-time { font-family: var(--font-mono); font-size: 11px; letter-spacing: .08em; text-transform: uppercase; color: var(--faint); }
.hd-art-title { font-family: var(--font-body); font-size: 18px; line-height: 1.2; font-weight: 600; letter-spacing: -0.03em; color: var(--ink); margin: 0 0 6px; }
.hd-art-desc { font-family: var(--font-mono); font-size: 12.5px; line-height: 1.55; color: var(--muted); margin: 0; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; }
.hd-transfos-foot { display: flex; justify-content: center; margin: 34px 0 0; }

/* LAUNCHES */
.hd-launches { max-width: 1120px; margin: 0 auto; padding: 64px 24px 24px; border-top: 1px solid var(--line); }
.hd-launches-head { display: flex; flex-direction: column; align-items: center; text-align: center; gap: 6px; margin: 0 0 34px; }
.hd-launches-all { font-family: var(--font-mono); font-size: 13px; letter-spacing: .04em; color: var(--red); text-decoration: none; margin-top: 6px; }
.hd-launch-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 20px; }

/* CTA */
.hd-cta { max-width: 720px; margin: 0 auto; padding: 80px 24px 110px; text-align: center; }
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
  .hd-launch-grid { grid-template-columns: 1fr; }
  .hd-transfos-grid { grid-template-columns: 1fr; }
  .hd-art-list { border-left: 0; border-top: 1px solid var(--line); }
  .hd-veille-inner { grid-template-columns: 1fr; }
  .hd-terrain-grid { grid-template-columns: 1fr; }
  .hd-terrain-item + .hd-terrain-item { border-left: 0; border-top: 1px solid var(--line); }
  .hd-terrain-photo { aspect-ratio: 16 / 10; }
}
@media (max-width: 520px) {
  .hd-change-pair { grid-template-columns: 1fr; gap: 9px; }
  .hd-change-cell.avant { padding-right: 0; }
  .hd-hero { padding-top: 58px; }
  .hd-h1 { font-size: clamp(36px, 13vw, 52px); }
  .hd-agent-grid { grid-template-columns: 1fr; }
  .hd-agent-top { padding: 20px 18px 16px; }
  .hd-transfo { grid-template-columns: 1fr; }
  .hd-transfo-col.apres { border-left: 0; border-top: 1px solid var(--line); }
  .hd-transfo-arrow { display: none; }
}
.hd-legal { text-align: center; font-family: var(--font-mono); font-size: 12px; color: var(--muted); letter-spacing: .02em; padding: 24px 20px 40px; border-top: 1px solid var(--line); }
.hd-legal a { color: inherit; text-decoration: underline; text-underline-offset: 2px; }
.hd-legal a:hover { color: var(--ink); }
`;
