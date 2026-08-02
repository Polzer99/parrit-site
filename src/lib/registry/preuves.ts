/**
 * REGISTRE DES PREUVES — polymorphe.
 *
 * Huit natures de preuve, un seul contrat de lecture. Un template demande
 * « donne-moi les preuves publiables de cette liste » et sait les rendre, quelle
 * que soit leur nature.
 *
 * DEUX RÈGLES DURES, appliquées par le code et pas seulement écrites :
 *
 *  1. Un chiffre ne s'affiche qu'accompagné de sa période ET de sa méthode de
 *     mesure (`11-CONTENT-MODEL.json`, entité `preuve`).
 *  2. Une preuve NOMINATIVE — nom d'organisation, logo, personne citée — exige
 *     `publicationPermission: true`. Sans permission écrite, elle est filtrée à
 *     la lecture. Aucun template n'exige jamais un nom ni un logo pour se rendre :
 *     une preuve nominative est un bonus, jamais une dépendance.
 *
 * Au 01/08/2026 le Consolidation Gate compte 0 initiative de niveau 5 : aucune
 * métrique client n'est publiable, et le registre n'en contient aucune.
 */

/* ------------------------------------------------------------- natures */

export type TypePreuve =
  /** Un mécanisme interne documenté, sans mesure chiffrée. */
  | "preuve_interne"
  /** Un système qui tourne, avec son périmètre et son propriétaire. */
  | "systeme_en_fonctionnement"
  /** Une trace d'exécution, avec ses états — y compris un échec. */
  | "trace"
  /** Une mesure faite sur nos propres systèmes. */
  | "metrique_interne"
  /** Un cas client dont l'organisation n'est pas identifiable. */
  | "cas_anonymise"
  /** Une parole rapportée, attribuée ou anonymisée. */
  | "temoignage"
  /** Une capture, une photo, une vidéo qui prouve quelque chose. */
  | "media"
  /** Une organisation citée par son nom, avec autorisation écrite. */
  | "client_nominatif_autorise";

export type Confidentialite = "interne" | "anonymisable" | "publiable";

/* -------------------------------------------------------------- pièces */

/** Attaché à toute preuve chiffrée. Les trois champs vont ensemble. */
export type Mesure = {
  metrique: string;
  periode: string;
  methodeMesure: string;
};

/** Attaché à `trace`. Reprend le vocabulaire d'états de `HermesTraceLevel0`. */
export type EtapeTrace = {
  time: string;
  action: string;
  source?: string;
  state:
    | "success"
    | "failure"
    | "waiting"
    | "blocked"
    | "human-review"
    | "improvement-proposed"
    | "improvement-accepted"
    | "improvement-rejected";
};

/** Attaché à `media`. Le média porte toujours la couche expressive. */
export type MediaPreuve = {
  src: string;
  alt: string;
  legende?: string;
  /** `photo` et `capture` sont réels. Aucune image générée ne prouve rien. */
  nature: "photo" | "capture" | "video" | "document";
};

/** Attaché à `temoignage`. */
export type Temoignage = {
  texte: string;
  /** Non renseigné = témoignage anonyme, et c'est valide. */
  auteur?: string;
  role?: string;
  date: string;
};

/**
 * Identification d'un tiers. Sa seule présence impose `publicationPermission`.
 */
export type Nominatif = {
  organisation: string;
  personne?: string;
  logo?: string;
  /**
   * OBLIGATOIRE et vrai pour être publiable. Sans autorisation écrite, la
   * preuve est filtrée — pas affichée en gris, pas affichée à moitié : filtrée.
   */
  publicationPermission: boolean;
  /** Trace de l'autorisation : qui, quand, sur quel support. */
  sourceAutorisation?: string;
};

/* ------------------------------------------------------------- l'entité */

export type Preuve = {
  id: string;
  type: TypePreuve;
  titre: string;
  description: string;
  /** 0 à 6, échelle du Consolidation Gate. */
  niveauPreuve: number;
  /** D'où vient cette preuve : fichier, rapport, exécution. */
  source: string;
  confidentialite: Confidentialite;

  /* Charges utiles, selon la nature. Toutes facultatives : un template lit ce
     qui est là et ignore le reste. */
  mesure?: Mesure;
  trace?: { etapes: EtapeTrace[]; perimetre: string };
  media?: MediaPreuve;
  temoignage?: Temoignage;
  nominatif?: Nominatif;

  /** Description utilisable quand l'organisation ne peut pas être nommée. */
  descriptifAnonymise?: string;
};

/* ------------------------------------------------------------ registre */

const REGISTRE: Preuve[] = [
  {
    id: "preuve.derive-openrouter",
    type: "metrique_interne",
    titre: "Une boucle qui repayait le même travail, tous les jours",
    description:
      "Un workflow retraitait les huit mêmes messages à chaque exécution parce qu'une " +
      "écriture d'idempotence échouait dans un catch vide. Le workflow restait vert. " +
      "Le défaut a été trouvé en comparant le nombre d'items traités entre deux runs.",
    niveauPreuve: 4,
    source: "signals/tools/n8n_loop_detector.py",
    confidentialite: "publiable",
    mesure: {
      metrique: "21 $/jour ramenés à 0 $ sur 2,2 h de mesure",
      periode: "1er août 2026",
      methodeMesure:
        "Delta de crédits OpenRouter entre deux relevés /api/v1/credits espacés de 2,2 h, " +
        "après coupure de la boucle.",
    },
  },
  {
    id: "preuve.capture-site",
    type: "preuve_interne",
    titre: "Un tuyau qui marche, et personne qui verse dedans",
    description:
      "La chaîne de capture du site a été vérifiée de bout en bout : le formulaire " +
      "part, le webhook répond, la fonction de base renvoie un contact créé. Les seules " +
      "exécutions récentes étaient des tests internes.",
    niveauPreuve: 4,
    source: "_parallel/03-CAPTURE-CURRENT-FLOW.md",
    confidentialite: "publiable",
  },
  {
    id: "preuve.circuit-breaker",
    type: "systeme_en_fonctionnement",
    titre: "Un coupe-circuit qui mesure un débit, pas un total",
    description:
      "Le premier coupe-circuit se déclenchait sur la dépense du jour et aurait coupé " +
      "quatorze workflows de production pour une dépense déjà passée. Il mesure " +
      "maintenant un débit sur une fenêtre d'au moins trente minutes.",
    niveauPreuve: 4,
    source: "signals/tools/llm_circuit_breaker.py",
    confidentialite: "publiable",
  },
  {
    id: "preuve.trace-coupe-circuit",
    type: "trace",
    titre: "Ce que fait le coupe-circuit, minute par minute",
    description:
      "Une exécution réelle : relevé, comparaison, signalement, et l'arrêt qui attend " +
      "une décision humaine.",
    niveauPreuve: 4,
    source: "signals/tools/llm_circuit_breaker.py",
    confidentialite: "publiable",
    trace: {
      perimetre: "lecture des exécutions et des crédits, aucune écriture",
      etapes: [
        { time: "10:00", action: "Relevé des exécutions des dernières 24 h", state: "success" },
        { time: "10:00", action: "Comparaison des comptes d'items", state: "success" },
        { time: "10:01", action: "Deux workflows signalés en boucle", state: "human-review" },
        { time: "10:01", action: "Coupure automatique", state: "blocked" },
      ],
    },
  },
  {
    id: "preuve.consolidation-gate",
    type: "metrique_interne",
    titre: "Cent trois initiatives passées au registre, et ce qu'il en reste",
    description:
      "Chaque initiative jamais imaginée, prototypée, vendue ou abandonnée a été " +
      "reprise et requalifiée sur preuve, pas sur vocabulaire. Le mot « client » dans " +
      "un document ne vaut pas un client.",
    niveauPreuve: 4,
    source: "00_CONSOLIDATION_GATE/GATE_CLOSURE_REPORT.md",
    confidentialite: "publiable",
  },
  {
    id: "preuve.atelier-cartographie",
    type: "media",
    titre: "Une séance de cartographie des flux",
    description:
      "Photo de terrain, non générative, fond réel conservé. Elle montre le moment où " +
      "les flux sont posés sur un mur avant qu'une ligne de code soit écrite.",
    niveauPreuve: 3,
    source: "public/brand/terrain/atelier-cartographie.jpg",
    confidentialite: "publiable",
    media: {
      src: "/brand/terrain/atelier-cartographie.jpg",
      alt: "Séance de cartographie des flux, en atelier",
      legende: "Cartographie des flux, en atelier",
      nature: "photo",
    },
  },
];

/* ------------------------------------------------------------ lecteurs */

export function getPreuve(id: string): Preuve | undefined {
  return REGISTRE.find((p) => p.id === id);
}

export function getPreuves(ids: readonly string[]): Preuve[] {
  return ids.map(getPreuve).filter((p): p is Preuve => Boolean(p));
}

/** Règle 1. Un chiffre sans période ni méthode ne s'affiche pas. */
export function metriqueAffichable(p: Preuve): boolean {
  return Boolean(p.mesure?.metrique && p.mesure.periode && p.mesure.methodeMesure);
}

/**
 * Règle 2. Une preuve nominative sans autorisation écrite n'est pas publiable,
 * quelle que soit sa confidentialité déclarée.
 */
export function nominatifAutorise(p: Preuve): boolean {
  if (!p.nominatif) return true;
  return p.nominatif.publicationPermission === true;
}

/**
 * Le filtre unique que consomment les templates. Il applique les deux règles
 * d'un coup : rien d'interne, rien de nominatif sans permission.
 */
export function preuvesPubliables(preuves: Preuve[]): Preuve[] {
  return preuves.filter((p) => p.confidentialite === "publiable" && nominatifAutorise(p));
}

/**
 * Le libellé d'organisation à afficher. Retourne le nom réel si et seulement si
 * l'autorisation existe, sinon le descriptif anonymisé, sinon `null`.
 *
 * Un template appelle ceci et rend ce qu'il reçoit. Il ne teste jamais lui-même
 * la permission, et il se rend parfaitement quand la réponse est `null`.
 */
export function libelleOrganisation(p: Preuve): string | null {
  if (p.nominatif && p.nominatif.publicationPermission) return p.nominatif.organisation;
  return p.descriptifAnonymise ?? null;
}

/** Le logo, uniquement si l'autorisation existe. Jamais requis par un template. */
export function logoAutorise(p: Preuve): string | null {
  if (p.nominatif?.publicationPermission && p.nominatif.logo) return p.nominatif.logo;
  return null;
}

export function getPreuvesParType(type: TypePreuve): Preuve[] {
  return REGISTRE.filter((p) => p.type === type);
}

export function toutesLesPreuves(): Preuve[] {
  return REGISTRE;
}
