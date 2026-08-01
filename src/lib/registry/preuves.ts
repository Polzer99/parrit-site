/**
 * REGISTRE DES PREUVES — contrat de TEMPLATE-GRAMMAR.md §2, règle 2.
 *
 * Une preuve n'est publiable que si elle est vérifiable. La règle dure vient de
 * 11-CONTENT-MODEL.json : « metrique n'est affichable que si periode ET
 * methode_mesure sont renseignées. »
 *
 * Le registre ne contient QUE des preuves de systèmes internes, mesurées, sans
 * nom de tiers. Au 01/08/2026, le Consolidation Gate compte 0 initiative de
 * niveau 5 : aucune métrique client n'a le droit d'apparaître ici.
 */

export type TypePreuve =
  | "systeme_interne"
  | "mecanisme_anonymise"
  | "incident_documente"
  | "mesure_interne";

export type Confidentialite = "interne" | "anonymisable" | "publiable";

export type Preuve = {
  id: string;
  type: TypePreuve;
  titre: string;
  description: string;
  /** 0 à 6, échelle du Consolidation Gate. */
  niveauPreuve: number;
  source: string;
  confidentialite: Confidentialite;
  /** Les trois vont ensemble ou aucun ne s'affiche. */
  metrique?: string;
  periode?: string;
  methodeMesure?: string;
};

const REGISTRE: Preuve[] = [
  {
    id: "preuve.derive-openrouter",
    type: "incident_documente",
    titre: "Une boucle qui repayait le même travail, tous les jours",
    description:
      "Un workflow retraitait les huit mêmes messages à chaque exécution parce qu'une " +
      "écriture d'idempotence échouait dans un catch vide. Le workflow restait vert. " +
      "Le défaut a été trouvé en comparant le nombre d'items traités entre deux runs.",
    niveauPreuve: 4,
    source: "signals/tools/n8n_loop_detector.py",
    confidentialite: "publiable",
    metrique: "21 $/jour ramenés à 0 $ sur 2,2 h de mesure",
    periode: "1er août 2026",
    methodeMesure:
      "Delta de crédits OpenRouter entre deux relevés /api/v1/credits espacés de 2,2 h, " +
      "après coupure de la boucle.",
  },
  {
    id: "preuve.capture-site",
    type: "mesure_interne",
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
    type: "systeme_interne",
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
    id: "preuve.consolidation-gate",
    type: "mesure_interne",
    titre: "Cent trois initiatives passées au registre, et ce qu'il en reste",
    description:
      "Chaque initiative jamais imaginée, prototypée, vendue ou abandonnée a été " +
      "reprise et requalifiée sur preuve, pas sur vocabulaire. Le mot « client » dans " +
      "un document ne vaut pas un client.",
    niveauPreuve: 4,
    source: "00_CONSOLIDATION_GATE/GATE_CLOSURE_REPORT.md",
    confidentialite: "publiable",
  },
];

export function getPreuve(id: string): Preuve | undefined {
  return REGISTRE.find((p) => p.id === id);
}

export function getPreuves(ids: readonly string[]): Preuve[] {
  return ids.map(getPreuve).filter((p): p is Preuve => Boolean(p));
}

/**
 * La garde. Un chiffre sans période ni méthode ne s'affiche pas — et on ne rend
 * pas un trou à la place : on rend la preuve sans son chiffre.
 */
export function metriqueAffichable(p: Preuve): boolean {
  return Boolean(p.metrique && p.periode && p.methodeMesure);
}

/** Une preuve `interne` ne sort jamais sur une surface publique. */
export function preuvesPubliables(preuves: Preuve[]): Preuve[] {
  return preuves.filter((p) => p.confidentialite === "publiable");
}
