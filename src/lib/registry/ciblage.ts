/**
 * CIBLAGE — offre · problème · situation · persona · maturité.
 *
 * Un template peut RÉFÉRENCER une offre. Il ne peut pas la connaître.
 *
 * Le site porte aujourd'hui DEUX taxonomies d'offre concurrentes qui ne se
 * citent jamais : trois offres (`croissance`, `deployer`, `transmettre`) et
 * sept paliers `N1` à `N7`. La contradiction est réelle et n'est pas tranchée
 * ici — elle le sera par le document de positionnement.
 *
 * D'où le contrat : les identifiants sont OPAQUES pour les composants, et le
 * nom, le nombre et la hiérarchie des offres sont de la DONNÉE. Remplacer les
 * deux taxonomies par une troisième ne doit toucher aucun composant, aucun
 * template, aucune page — seulement ce fichier.
 */

/* --------------------------------------------------------- identifiants */

/**
 * Références opaques. Volontairement des `string` : un template ne doit pas
 * pouvoir faire d'exhaustivité sur les offres, sinon ajouter une offre casse
 * la compilation de huit templates.
 */
export type OffreRef = string;
export type ProblemeRef = string;
export type SituationRef = string;
export type PersonaRef = string;

/**
 * La maturité décrit un SYSTÈME, pas une offre. Elle est stable, fermée, et ne
 * dépend d'aucune taxonomie commerciale — c'est pourquoi elle, seule, est un
 * type énuméré.
 */
export type MaturiteSysteme =
  | "en_production"
  | "utilise_en_interne"
  | "prototype"
  | "arrete_appris";

export const MATURITE_LIBELLE: Record<MaturiteSysteme, string> = {
  en_production: "En production",
  utilise_en_interne: "Utilisé en interne",
  prototype: "Prototype",
  arrete_appris: "Arrêté, appris",
};

/* -------------------------------------------------------------- entités */

export type StatutTaxonomie = "provisoire" | "canonique";

export type Offre = {
  id: OffreRef;
  nom: string;
  /** Chemin de page, sans la langue. `{lang}` est substitué à l'usage. */
  href: string;
  /** Hiérarchie configurable. `null` = racine. */
  parent: OffreRef | null;
  /** Rang d'affichage dans sa fratrie. */
  ordre: number;
  /**
   * `provisoire` tant que le document de positionnement n'a pas tranché.
   * Un template ne lit jamais ce champ : il sert au gate de build et aux
   * surfaces d'administration.
   */
  statut: StatutTaxonomie;
  /** Taxonomie d'origine, pour pouvoir les distinguer sans les mélanger. */
  taxonomie: string;
};

export type Probleme = {
  id: ProblemeRef;
  /** Ce que le visiteur dit, mot pour mot. */
  formulation: string;
  /** Ce qu'on en comprend. */
  reformulation: string;
  offreRef: OffreRef | null;
};

export type Persona = {
  id: PersonaRef;
  nomPublic: string;
  situationDepart: string;
};

export type Situation = {
  id: SituationRef;
  libelle: string;
  problemeRef: ProblemeRef | null;
};

/* ------------------------------------------------------------- registre */

/**
 * ⚠️ TOUT CE QUI SUIT EST DE LA DONNÉE PROVISOIRE.
 *
 * Les deux taxonomies sont enregistrées telles qu'elles existent, sans être
 * fusionnées ni hiérarchisées l'une sous l'autre — les fusionner serait
 * trancher à la place de Paul. Elles cohabitent, marquées, jusqu'au document
 * de positionnement.
 */
const OFFRES: Offre[] = [
  {
    id: "offre.croissance",
    nom: "Croissance",
    href: "/{lang}/croissance",
    parent: null,
    ordre: 1,
    statut: "provisoire",
    taxonomie: "trois-offres",
  },
  {
    id: "offre.deploiement",
    nom: "Déploiement",
    href: "/{lang}/deployer",
    parent: null,
    ordre: 2,
    statut: "provisoire",
    taxonomie: "trois-offres",
  },
  {
    id: "offre.transmission",
    nom: "Transmission",
    href: "/{lang}/transmettre",
    parent: null,
    ordre: 3,
    statut: "provisoire",
    taxonomie: "trois-offres",
  },
  {
    id: "offre.n1",
    nom: "Masterclass généraliste",
    href: "/{lang}/masterclass-ia",
    parent: null,
    ordre: 1,
    statut: "provisoire",
    taxonomie: "paliers",
  },
  {
    id: "offre.n2",
    nom: "Masterclass métier",
    href: "/{lang}/masterclass-metier",
    parent: null,
    ordre: 2,
    statut: "provisoire",
    taxonomie: "paliers",
  },
  {
    id: "offre.n3",
    nom: "Sessions MCP",
    href: "/{lang}/sessions-mcp",
    parent: null,
    ordre: 3,
    statut: "provisoire",
    taxonomie: "paliers",
  },
  {
    id: "offre.n4",
    nom: "Audit",
    href: "/{lang}/audit",
    parent: null,
    ordre: 4,
    statut: "provisoire",
    taxonomie: "paliers",
  },
  {
    id: "offre.n5",
    nom: "Déploiement d'agents",
    href: "/{lang}/deploiement-agents",
    parent: null,
    ordre: 5,
    statut: "provisoire",
    taxonomie: "paliers",
  },
  {
    id: "offre.n6",
    nom: "Outils agentiques",
    href: "/{lang}/outils-agentiques",
    parent: null,
    ordre: 6,
    statut: "provisoire",
    taxonomie: "paliers",
  },
  {
    id: "offre.n7",
    nom: "Optimisation de flotte",
    href: "/{lang}/optimisation-flotte",
    parent: null,
    ordre: 7,
    statut: "provisoire",
    taxonomie: "paliers",
  },
];

/** Les trois familles de problèmes de la spec homepage. */
const PROBLEMES: Probleme[] = [
  {
    id: "probleme.sujet-penible",
    formulation: "« Il y a un sujet qui nous mange du temps chaque semaine. »",
    reformulation: "Une tâche répétée, coûteuse, que personne n'a le temps d'industrialiser.",
    offreRef: null,
  },
  {
    id: "probleme.pas-assez-de-rdv",
    formulation: "« On ne remplit pas l'agenda. »",
    reformulation: "Le flux entrant ne suffit pas et le sortant n'est pas outillé.",
    offreRef: null,
  },
  {
    id: "probleme.equiper-sans-deraper",
    formulation: "« On veut équiper les équipes sans que ça parte dans tous les sens. »",
    reformulation: "Besoin d'un cadre, de droits minimaux et de garde-fous avant d'ouvrir les outils.",
    offreRef: null,
  },
];

const PERSONAS: Persona[] = [];
const SITUATIONS: Situation[] = [];

/* ------------------------------------------------------------- lecteurs */

export function getOffre(id: OffreRef): Offre | undefined {
  return OFFRES.find((o) => o.id === id);
}

/** Résout le chemin d'une offre. Retourne `null` si l'offre n'existe pas. */
export function offreHref(id: OffreRef, lang: string): string | null {
  const offre = getOffre(id);
  return offre ? offre.href.replace("{lang}", lang) : null;
}

/** Les offres d'une taxonomie, triées. Aucun composant ne code le nombre. */
export function getOffres(taxonomie?: string): Offre[] {
  return OFFRES.filter((o) => !taxonomie || o.taxonomie === taxonomie).sort(
    (a, b) => a.ordre - b.ordre,
  );
}

/** Les enfants d'une offre. La hiérarchie est de la donnée, pas du code. */
export function getEnfants(id: OffreRef): Offre[] {
  return OFFRES.filter((o) => o.parent === id).sort((a, b) => a.ordre - b.ordre);
}

export function getTaxonomies(): string[] {
  return [...new Set(OFFRES.map((o) => o.taxonomie))];
}

export function getProbleme(id: ProblemeRef): Probleme | undefined {
  return PROBLEMES.find((p) => p.id === id);
}

export function getProblemes(): Probleme[] {
  return PROBLEMES;
}

export function getPersona(id: PersonaRef): Persona | undefined {
  return PERSONAS.find((p) => p.id === id);
}

export function getSituation(id: SituationRef): Situation | undefined {
  return SITUATIONS.find((s) => s.id === id);
}

/**
 * Vrai tant qu'une taxonomie d'offre reste à trancher. Le gate de build s'en
 * sert pour rappeler que le sujet est ouvert — sans bloquer, parce que la
 * décision appartient au document de positionnement, pas au CI.
 */
export function taxonomieOffresNonTranchee(): boolean {
  return OFFRES.some((o) => o.statut === "provisoire");
}
