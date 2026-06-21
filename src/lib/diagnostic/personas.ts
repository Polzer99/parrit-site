// Packs persona du diagnostic conversationnel (issus de docs/conversational-site/USER-STORIES.md).
// Multilingue (fr / en / pt-BR / zh-CN). Perso des BORDS = deterministe (chips/voix/cadrage),
// perso du COEUR = le LLM (api/diagnostic) qui repond DANS la langue du visiteur.
// Doctrine : LE TAMIS, jamais de prix ni de nom client, deux fronts de poids egal.

export type SegmentId =
  | "neutre"
  | "dirigeant-pme"
  | "owner-ecommerce"
  | "profession-liberale"
  | "direction-grand-groupe";

export type Voix = "neutre" | "coup-de-poing" | "executive";
export type Lang = "fr" | "en" | "pt-BR" | "zh-CN";

export const LANGS: Lang[] = ["fr", "en", "pt-BR", "zh-CN"];
export const LANG_NAME: Record<Lang, string> = {
  fr: "francais",
  en: "English",
  "pt-BR": "portugues do Brasil",
  "zh-CN": "Chinese (Simplified, 简体中文)",
};

export interface SegmentPack {
  id: SegmentId;
  voix: Voix;
  label: Record<Lang, string>;
  chips: Record<Lang, string[]>;
  // graine SEMANTIQUE (FR) pour le prompt systeme ; le LLM repond dans la langue cible.
  framing: string;
  front1: string;
  front2: string;
  exampleHint: string;
  cta: string; // fallback (le LLM remplit cta dans la langue)
}

export const SEGMENTS: Record<SegmentId, SegmentPack> = {
  neutre: {
    id: "neutre",
    voix: "neutre",
    label: { fr: "Dirigeant", en: "Leader", "pt-BR": "Dirigente", "zh-CN": "决策者" },
    chips: {
      fr: ["Par où commencer", "Un cas qui tourne déjà", "Combien de temps avant un résultat"],
      en: ["Where to start", "A case that already runs", "How long before a result"],
      "pt-BR": ["Por onde começar", "Um caso que já roda", "Quanto tempo até um resultado"],
      "zh-CN": ["从哪里开始", "一个已在运行的案例", "多久能见到结果"],
    },
    framing: "Ça se joue sur deux fronts de poids égal : ce qui fait tourner votre boîte, et ce qui la fait grandir.",
    front1: "Back-office : opérer ce qui vous prend du temps en interne.",
    front2: "Business : aller chercher du revenu au bon moment.",
    exampleHint: "un négoce qui a automatisé sa capture de commandes et ses relances",
    cta: "Réserver 15 à 20 minutes avec Paul",
  },
  "dirigeant-pme": {
    id: "dirigeant-pme",
    voix: "coup-de-poing",
    label: { fr: "Dirigeant PME / ETI", en: "SME / mid-market leader", "pt-BR": "Dirigente PME", "zh-CN": "中小企业负责人" },
    chips: {
      fr: ["Par où commencer avec l'IA", "Libérer mes équipes", "Aller chercher du revenu"],
      en: ["Where to start with AI", "Free up my teams", "Go win revenue"],
      "pt-BR": ["Por onde começar com IA", "Liberar minhas equipes", "Ir buscar receita"],
      "zh-CN": ["从哪里开始用 AI", "解放我的团队", "去赢得收入"],
    },
    framing: "Deux fronts de poids égal. On en prend un, on le fait tourner en quelques semaines, on mesure, on étend.",
    front1: "Back-office : la saisie, la relance, la facturation, la veille. Un agent fait, vous validez.",
    front2: "Business : capter les signaux et déclencher le bon contact au bon moment.",
    exampleHint: "une coutellerie qui capte ses leads multi-canal et relance en automatique",
    cta: "Réserver 15 à 20 minutes pour cadrer le premier chantier",
  },
  "owner-ecommerce": {
    id: "owner-ecommerce",
    voix: "coup-de-poing",
    label: { fr: "Chef d'entreprise e-commerce", en: "E-commerce founder", "pt-BR": "Dono de e-commerce", "zh-CN": "电商创始人" },
    chips: {
      fr: ["Automatiser mon SAV sans agence", "Mes relances clients", "Ma newsletter de marque"],
      en: ["Automate my support without an agency", "My customer follow-ups", "My brand newsletter"],
      "pt-BR": ["Automatizar meu SAC sem agência", "Meus follow-ups de clientes", "Minha newsletter de marca"],
      "zh-CN": ["不靠代理商自动化客服", "客户跟进", "品牌邮件通讯"],
    },
    framing: "À deux ou trois, le levier c'est l'automatisation de ce que vous faites le soir à la main.",
    front1: "Back-office : SAV, capture et relance multi-canal, newsletter, branchés sur vos outils.",
    front2: "Business : transformer vos visiteurs et vos signaux en commandes, sans agence.",
    exampleHint: "une marque qui a automatisé son SAV et ses relances sans recruter",
    cta: "20 minutes sur votre cas, le premier front à automatiser",
  },
  "profession-liberale": {
    id: "profession-liberale",
    voix: "neutre",
    label: { fr: "Profession réglementée", en: "Regulated profession", "pt-BR": "Profissão regulamentada", "zh-CN": "专业人士" },
    chips: {
      fr: ["Automatiser ma veille", "La première passe sans risque", "Confidentialité des données"],
      en: ["Automate my monitoring", "The first pass, safely", "Data confidentiality"],
      "pt-BR": ["Automatizar meu monitoramento", "A primeira triagem, sem risco", "Confidencialidade dos dados"],
      "zh-CN": ["自动化我的监测", "安全的初步筛查", "数据保密"],
    },
    framing: "L'outil pousse, l'humain tranche. On enlève la mécanique répétitive, vous gardez la décision.",
    front1: "La donnée : veille, première passe, collecte, dans le respect du secret et de la conformité.",
    front2: "Le temps : libérer les heures à faible valeur pour les rendre au conseil.",
    exampleHint: "un cabinet qui a automatisé sa veille en gardant l'humain sur le jugement",
    cta: "Réserver 15 à 20 minutes pour cadrer un pilote",
  },
  "direction-grand-groupe": {
    id: "direction-grand-groupe",
    voix: "executive",
    label: { fr: "Direction · Grand groupe", en: "Executive · Large group", "pt-BR": "Direção · Grande grupo", "zh-CN": "大型集团 · 高管" },
    chips: {
      fr: ["Passer nos POCs en production", "La donnée reste-t-elle chez nous", "Diffuser l'adoption"],
      en: ["Move our POCs to production", "Does our data stay with us", "Scale adoption"],
      "pt-BR": ["Levar nossos POCs à produção", "Os dados ficam conosco", "Escalar a adoção"],
      "zh-CN": ["把 POC 推上生产", "数据是否留在我们这边", "规模化推广"],
    },
    framing: "Deux leviers : automatiser un cas propriétaire en production, et diffuser l'adoption à l'échelle.",
    front1: "Vos couches internes : un pilote sur un cas propriétaire, gouverné, agnostique, la donnée reste chez vous.",
    front2: "L'adoption : vos équipes montent en compétence en construisant, l'agentique se diffuse en cascade.",
    exampleHint: "un grand groupe qui a posé un pilote sur un cas propriétaire avec revue d'alignement",
    cta: "Réserver 15 à 20 minutes pour cadrer un cas pilote et l'archi",
  },
};

export const OPENER: Record<Voix, Record<Lang, string>> = {
  neutre: {
    fr: "Quelle tâche pèse le plus sur vos équipes en ce moment ?",
    en: "Which task weighs most on your teams right now?",
    "pt-BR": "Qual tarefa mais pesa nas suas equipes agora?",
    "zh-CN": "目前哪项工作最拖累你的团队?",
  },
  "coup-de-poing": {
    fr: "Qu'est-ce qui vous prend le plus de temps cette semaine ?",
    en: "What takes the most of your time this week?",
    "pt-BR": "O que mais toma seu tempo esta semana?",
    "zh-CN": "这周什么最占用你的时间?",
  },
  executive: {
    fr: "Où l'adoption de l'IA cale-t-elle dans votre organisation ?",
    en: "Where does AI adoption stall in your organization?",
    "pt-BR": "Onde a adoção de IA emperra na sua organização?",
    "zh-CN": "在贵组织,AI 的落地卡在哪里?",
  },
};

export interface UiStrings {
  diag: string;
  live: string;
  front1: string;
  front2: string;
  idle: string;
  working: string;
  placeholder: string;
  thanks: string;
  errPrefix: string;
}
export const UI: Record<Lang, UiStrings> = {
  fr: {
    diag: "Diagnostic", live: "construit en direct", front1: "Front 1", front2: "Front 2",
    idle: "Votre diagnostic se construit ici, au fil de la conversation.",
    working: "Parrit analyse votre cas…",
    placeholder: "Décrivez une tâche qui pèse…",
    thanks: "C'est noté. Paul vous envoie votre page sur-mesure et revient vers vous.",
    errPrefix: "⚠️ ",
  },
  en: {
    diag: "Diagnosis", live: "building live", front1: "Front 1", front2: "Front 2",
    idle: "Your diagnosis builds here, as the conversation goes.",
    working: "Parrit is reading your case…",
    placeholder: "Describe a task that weighs on you…",
    thanks: "Noted. Paul sends your tailored page and gets back to you.",
    errPrefix: "⚠️ ",
  },
  "pt-BR": {
    diag: "Diagnóstico", live: "montando ao vivo", front1: "Frente 1", front2: "Frente 2",
    idle: "Seu diagnóstico se monta aqui, ao longo da conversa.",
    working: "Parrit está lendo o seu caso…",
    placeholder: "Descreva uma tarefa que pesa…",
    thanks: "Anotado. Paul envia sua página sob medida e retorna.",
    errPrefix: "⚠️ ",
  },
  "zh-CN": {
    diag: "诊断", live: "实时生成", front1: "战线 1", front2: "战线 2",
    idle: "你的诊断会在对话中逐步生成。",
    working: "Parrit 正在分析你的情况……",
    placeholder: "描述一项拖累你的工作……",
    thanks: "已记录。Paul 会把为你定制的页面发给你并与你联系。",
    errPrefix: "⚠️ ",
  },
};

const REFERRER_HINTS: Array<[RegExp, SegmentId]> = [
  [/detecteur-bullshit|bullshit/i, "owner-ecommerce"],
];

/** Detection deterministe du segment (jamais sur signal faible : defaut = neutre). */
export function detectSegment(params: URLSearchParams, referrer: string): SegmentId {
  const e = (params.get("seg") || params.get("utm_content") || params.get("utm_campaign") || "").toLowerCase();
  if (e.includes("pme") || e.includes("dirigeant")) return "dirigeant-pme";
  if (e.includes("ecom") || e.includes("commerce")) return "owner-ecommerce";
  if (e.includes("avocat") || e.includes("comptable") || e.includes("juridique") || e.includes("liberale")) return "profession-liberale";
  if (e.includes("grand-groupe") || e.includes("clevel") || e.includes("c-level") || e.includes("dsi") || e.includes("cdo") || e.includes("transfo")) return "direction-grand-groupe";
  for (const [re, seg] of REFERRER_HINTS) if (re.test(referrer)) return seg;
  return "neutre";
}

/** Detection de langue : ?lang= override, sinon navigator/Accept-Language, defaut fr. */
export function normalizeLang(raw: string): Lang {
  const v = (raw || "").toLowerCase();
  if (v.startsWith("zh")) return "zh-CN";
  if (v.startsWith("pt")) return "pt-BR";
  if (v.startsWith("en")) return "en";
  return "fr";
}
export function detectLang(params: URLSearchParams, navLang: string): Lang {
  const explicit = params.get("lang") || params.get("hl");
  if (explicit) return normalizeLang(explicit);
  return normalizeLang(navLang);
}
