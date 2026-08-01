/**
 * PARRIT-TECH-TRUST-V1 — couche système du concept D.
 *
 * ATTENTION. Ce fichier ne contient AUCUNE copie canonique. Le wording de la
 * page vit dans `../content.ts` et n'est pas touché par cette tranche.
 *
 * Ce qui est ici, c'est le vocabulaire d'interface : états, sources,
 * horodatages, propriétaires, versions. Il est prescrit par le cadrage, il
 * décrit le fonctionnement du système, il ne promet rien.
 *
 * RÈGLE DE PROBITÉ. Rien ici ne prétend représenter des données client
 * réelles. Chaque bloc de démonstration porte un label explicite, et les
 * horodatages sont relatifs, jamais présentés comme des relevés.
 */

/** Labels de démonstration. Obligatoires sur tout bloc non réel. */
export const SPECIMEN = {
  trace: "Exemple de trace",
  interface: "Interface de démonstration",
  flux: "Flux type",
  registre: "Specimen",
} as const;

/** Vocabulaire de confiance. Une couche d'interface, pas une liste marketing. */
export const ETAT = {
  autorisee: "Action autorisée",
  bloquee: "Action bloquée",
  validation: "Validation requise",
  sortie: "Sortie produite",
  retour: "Retour possible",
} as const;

/**
 * Trace d'exécution du hero. Une chaîne complète, décomposée.
 * Les libellés métier viennent du premier cas de `content.ts`.
 */
export const TRACE = {
  id: "TR-4192",
  version: "v3",
  source: "Boîte partagée · WhatsApp Business",
  proprietaire: "Direction commerciale",
  verifie: "il y a 4 min",
  /* La chaîne doit se comprendre avant d'être lue : elle commence par un
     objet nommé et se termine par un objet nommé. */
  entree: "Un message reçu ce matin",
  sortie: "Fiche à jour · relance datée",
  etapes: [
    { n: "01", label: "Réception", etat: "terminée", t: "00:00" },
    { n: "02", label: "Rapprochement du dossier", etat: "terminée", t: "00:02" },
    { n: "03", label: "Complétion de la fiche", etat: "terminée", t: "00:05" },
    { n: "04", label: "Priorité de rappel", etat: "attente", t: "00:05" },
    { n: "05", label: "Relance posée", etat: "bloquée", t: "en attente" },
  ],
} as const;

/**
 * Topologie. Des relations, pas un diagramme à bulles.
 * `vers` référence l'`id` d'un autre nœud.
 */
export const TOPOLOGIE = [
  { id: "src", couche: "Données", label: "Canaux entrants", detail: "mail · formulaire · téléphone", vers: ["regle"] },
  { id: "regle", couche: "Règles", label: "Règles métier", detail: "priorité, doublons, exclusions", vers: ["agent"] },
  { id: "agent", couche: "Agents", label: "Exécution", detail: "rapproche, complète, rédige", vers: ["gate"] },
  { id: "gate", couche: "Humain", label: "Point de décision", detail: "un propriétaire nommé tranche", vers: ["crm"] },
  { id: "crm", couche: "Logiciels", label: "Systèmes existants", detail: "CRM et facturation conservés", vers: [] },
] as const;

/**
 * Registre de mission. Ce n'est pas une série de statistiques : c'est le
 * périmètre d'un engagement, lu comme un contrat d'exécution. Chaque ligne
 * porte son rang et son rôle dans la mission.
 */
export const MISSION = [
  { n: "M.01", role: "Durée" },
  { n: "M.02", role: "Engagement économique" },
  { n: "M.03", role: "Objet livré" },
  { n: "M.04", role: "Condition de sortie" },
] as const;

/**
 * Séquence opératoire. Chaque étape reçoit un objet, le transforme, et le
 * passe à la suivante. La responsabilité change en cours de route : c'est
 * tout le sujet de la mission.
 */
export const SEQUENCE = [
  { entrant: "Vos opérations", sortant: "Un processus retenu", qui: "Parrit et vous", etat: "cadrage" },
  { entrant: "Un processus retenu", sortant: "Un système en production", qui: "Parrit", etat: "exécution" },
  { entrant: "Un système en production", sortant: "Vos équipes autonomes", qui: "Vos équipes", etat: "transfert" },
] as const;

/** Registre de preuves. Chaque ligne porte sa source ET sa limite. */
export const PREUVES = [
  {
    element: "Cas d'usage affichés",
    source: "content/agents/catalog.json",
    etat: "vérifié",
    verifie: "01/08/2026",
    limite: "Statut deployed uniquement. Les cas en démonstration sont exclus.",
  },
  {
    element: "Photographies",
    source: "Prises en mission, sans mise en scène",
    etat: "vérifié",
    verifie: "01/08/2026",
    limite: "Aucune banque d'images. Les visages ne sont pas générés.",
  },
  {
    element: "Traces affichées sur cette page",
    source: "Composées pour la démonstration",
    etat: "specimen",
    verifie: "01/08/2026",
    limite: "Aucune donnée client. Structure réelle, contenu illustratif.",
  },
  {
    element: "Résultats chiffrés",
    source: "Aucune",
    etat: "absent",
    verifie: "01/08/2026",
    limite: "Aucun volume, aucune durée, aucun gain n'est publié tant qu'il n'est pas mesuré.",
  },
] as const;

/** Avant et après, sur la même matière. Pas deux cartes génériques. */
export const AVANT_APRES = {
  avant: [
    "Message reçu, non rattaché",
    "Relance notée sur un carnet",
    "Fiche à jour dans une seule tête",
    "Priorité décidée de mémoire",
  ],
  apres: [
    "Message rattaché au dossier",
    "Relance datée, visible de tous",
    "Fiche à jour dans le CRM",
    "Priorité proposée, tranchée par un humain",
  ],
} as const;

/** Journal Hermes. Attribution portée par le composant lui-même. */
export const JOURNAL = [
  { t: "il y a 2 min", label: "Sortie produite", detail: "fiche mise à jour", etat: "ok" },
  { t: "il y a 4 min", label: "Validation requise", detail: "priorité de rappel", etat: "gate" },
  { t: "il y a 11 min", label: "Action bloquée", detail: "règle métier absente", etat: "stop" },
  { t: "il y a 26 min", label: "Retour effectué", detail: "version précédente restaurée", etat: "back" },
  { t: "il y a 41 min", label: "Sortie produite", detail: "relance datée", etat: "ok" },
] as const;

/** Rail de confiance. Rien qui ressemble à une certification non acquise. */
export const TRUST = [
  "Un humain dans la boucle, nommé",
  "Chaque action laisse une trace",
  "Retour à la version précédente possible",
  "Vos systèmes existants sont conservés",
  "Hermes Agent, open source by Nous Research, MIT License",
] as const;
