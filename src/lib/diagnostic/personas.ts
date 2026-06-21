// Packs persona du diagnostic conversationnel (issus de docs/conversational-site/USER-STORIES.md).
// Perso des BORDS = deterministe (ces packs : chips, voix, cadrage). Perso du COEUR = le LLM (api/diagnostic).
// Doctrine : LE TAMIS, jamais de prix ni de nom client, deux fronts de poids egal.

export type SegmentId =
  | "neutre"
  | "dirigeant-pme"
  | "owner-ecommerce"
  | "profession-liberale"
  | "direction-grand-groupe";

export type Voix = "neutre" | "coup-de-poing" | "executive";

export interface SegmentPack {
  id: SegmentId;
  label: string;
  voix: Voix;
  /** amorces (cold-start) affichees en chips */
  chips: string[];
  /** cadrage des deux fronts/leviers, adapte */
  framing: string;
  front1: string;
  front2: string;
  /** un cas reel ANONYMISE qui resonne (pour ancrer, jamais de nom) */
  exampleHint: string;
  cta: string;
}

export const SEGMENTS: Record<SegmentId, SegmentPack> = {
  neutre: {
    id: "neutre",
    label: "Dirigeant",
    voix: "neutre",
    chips: ["Par où commencer", "Un cas qui tourne déjà", "Combien de temps avant un résultat"],
    framing: "Ça se joue sur deux fronts de poids égal : ce qui fait tourner votre boîte, et ce qui la fait grandir.",
    front1: "Back-office : opérer ce qui vous prend du temps en interne.",
    front2: "Business : aller chercher du revenu au bon moment.",
    exampleHint: "un négoce qui a automatisé sa capture de commandes et ses relances",
    cta: "Réserver 15 à 20 minutes avec Paul",
  },
  "dirigeant-pme": {
    id: "dirigeant-pme",
    label: "Dirigeant PME / ETI",
    voix: "coup-de-poing",
    chips: ["Par où commencer avec l'IA", "Libérer mes équipes", "Aller chercher du revenu"],
    framing: "Deux fronts de poids égal. On en prend un, on le fait tourner en quelques semaines, on mesure, on étend.",
    front1: "Back-office : la saisie, la relance, la facturation, la veille. Un agent fait, vous validez.",
    front2: "Business : capter les signaux et déclencher le bon contact au bon moment.",
    exampleHint: "une coutellerie qui capte ses leads multi-canal et relance en automatique",
    cta: "Réserver 15 à 20 minutes pour cadrer le premier chantier",
  },
  "owner-ecommerce": {
    id: "owner-ecommerce",
    label: "Chef d'entreprise e-commerce",
    voix: "coup-de-poing",
    chips: ["Automatiser mon SAV sans agence", "Mes relances clients", "Ma newsletter de marque"],
    framing: "À deux ou trois, le levier c'est l'automatisation de ce que vous faites le soir à la main.",
    front1: "Back-office : SAV, capture et relance multi-canal, newsletter, branchés sur vos outils.",
    front2: "Business : transformer vos visiteurs et vos signaux en commandes, sans agence.",
    exampleHint: "une marque qui a automatisé son SAV et ses relances sans recruter",
    cta: "20 minutes sur votre cas, le premier front à automatiser",
  },
  "profession-liberale": {
    id: "profession-liberale",
    label: "Profession réglementée",
    voix: "neutre",
    chips: ["Automatiser ma veille", "La première passe sans risque", "Confidentialité des données"],
    framing: "L'outil pousse, l'humain tranche. On enlève la mécanique répétitive, vous gardez la décision.",
    front1: "La donnée : veille, première passe, collecte, dans le respect du secret et de la conformité.",
    front2: "Le temps : libérer les heures à faible valeur pour les rendre au conseil.",
    exampleHint: "un cabinet qui a automatisé sa veille en gardant l'humain sur le jugement",
    cta: "Réserver 15 à 20 minutes pour cadrer un pilote",
  },
  "direction-grand-groupe": {
    id: "direction-grand-groupe",
    label: "Direction · Grand groupe",
    voix: "executive",
    chips: ["Passer nos POCs en production", "La donnée reste-t-elle chez nous", "Diffuser l'adoption"],
    framing: "Deux leviers : automatiser un cas propriétaire en production, et diffuser l'adoption à l'échelle.",
    front1: "Vos couches internes : un pilote sur un cas propriétaire, gouverné, agnostique, la donnée reste chez vous.",
    front2: "L'adoption : vos équipes montent en compétence en construisant, l'agentique se diffuse en cascade.",
    exampleHint: "un grand groupe qui a posé un pilote sur un cas propriétaire avec revue d'alignement",
    cta: "Réserver 15 à 20 minutes pour cadrer un cas pilote et l'archi",
  },
};

const REFERRER_HINTS: Array<[RegExp, SegmentId]> = [
  [/detecteur-bullshit|bullshit/i, "owner-ecommerce"],
];

/** Detection deterministe du segment a l'arrivee (jamais sur signal faible : defaut = neutre). */
export function detectSegment(params: URLSearchParams, referrer: string): SegmentId {
  const explicit = (params.get("seg") || params.get("utm_content") || params.get("utm_campaign") || "").toLowerCase();
  if (explicit.includes("pme") || explicit.includes("dirigeant")) return "dirigeant-pme";
  if (explicit.includes("ecom") || explicit.includes("commerce")) return "owner-ecommerce";
  if (explicit.includes("avocat") || explicit.includes("comptable") || explicit.includes("juridique") || explicit.includes("liberale")) return "profession-liberale";
  if (explicit.includes("grand-groupe") || explicit.includes("clevel") || explicit.includes("c-level") || explicit.includes("dsi") || explicit.includes("cdo") || explicit.includes("transfo")) return "direction-grand-groupe";
  for (const [re, seg] of REFERRER_HINTS) if (re.test(referrer)) return seg;
  return "neutre";
}
