/**
 * Brand Lab · preuves.
 *
 * SOURCE UNIQUE : ~/parrit-os/canon/CASE-STUDIES-EVIDENCE-MATRIX.md (V3,
 * 2026-08-11), croisée avec canon/PUBLICATION-GATE-ET-PAQUET-EDITORIAL.md.
 *
 * Trois règles tenues sans exception dans ce fichier :
 *   1. Aucun nom de client (décision Paul du 2026-05-25, site/REFERENCES.md).
 *      Uniquement les formulations anonymisées déjà autorisées par la matrice.
 *   2. Aucun chiffre qui ne figure pas en source primaire dans la matrice.
 *      Aucun résultat inventé, aucun « x5 », aucun ROI.
 *   3. Chaque fiche porte son niveau de preuve RÉEL. Un démonstrateur interne
 *      n'est jamais présenté comme un cas client.
 *
 * Quand la preuve manque, on met un PROOF SLOT explicite (voir proofSlots),
 * jamais du copywriting de remplissage.
 */

export type Proof = {
  id: string;
  /** Formulation anonymisée autorisée. Jamais le nom du client. */
  who: string;
  title: string;
  /** L'état de départ, tel que constaté en source primaire. */
  before: string;
  /** Ce qui a réellement été construit. */
  built: string[];
  /** Niveau de preuve L1-L6 de la matrice. */
  level: "L4" | "L5" | "L6";
  /** Statut réel, sans lissage. */
  status: string;
  /** Ce que la preuve ne dit PAS. On montre l'écart, on ne le cache pas. */
  gap?: string;
};

export const PROOFS: Proof[] = [
  {
    id: "R-10",
    who: "Une marque de soin qui rend des comptes à ses investisseurs",
    title: "Le reporting mensuel, de l'export comptable brut au document diffusable",
    before:
      "Une balance de 508 comptes retraitée à la main dans un classeur portant 85 451 formules, 1 254 cellules en erreur et 59 liens vers un classeur de 2022. Les balances arrivaient avec deux mois de retard.",
    built: [
      "Une compétence écrite en français, pas en code : les règles de gestion, le journal des décisions, l'annexe de ce qui manque.",
      "Trois erreurs localisées à la cellule près dans les fichiers existants, dont un montant écrit en dur au milieu d'une formule.",
      "Une page de contrôles qui autorise ou interdit la diffusion du document.",
    ],
    level: "L5",
    status: "Passé en production le 06/08/2026, chez le client, opéré par ses référents.",
    gap: "L'usage récurrent n'est pas encore constaté : le système est en production depuis peu.",
  },
  {
    id: "R-02",
    who: "Un cabinet d'avocats",
    title: "Le système d'exploitation quotidien d'un dirigeant",
    before:
      "Un portefeuille de 289 clients et une boîte dense, sans rien pour faire remonter ce qui bouge ni pour tenir l'état des fils.",
    built: [
      "Deux boucles : la veille sur le portefeuille, et la tenue de la boîte mail. Brief du matin, rappels, récap du soir.",
      "Une chaîne anti-redite à quatre règles, un mode à blanc, une batterie de 38 tests qui passe.",
      "Une infrastructure souveraine : VPS en France, volume chiffré, sauvegardes chiffrées hors machine.",
    ],
    level: "L5",
    status: "En production, usage récurrent. 111 événements de relance tracés.",
  },
  {
    id: "R-09",
    who: "Un dirigeant en recherche de poste",
    title: "La veille sur un marché majoritairement caché",
    before:
      "Une méthode entièrement manuelle : un classeur de suivi tenu à la main, des contacts vérifiés un par un.",
    built: [
      "Un workflow en production, 41 nœuds, généré depuis une source de vérité unique et jamais édité à la main.",
      "Cinq lentilles d'analyse, un seuil de retenue, une déduplication entre semaines.",
      "Douze sauvegardes horodatées de l'état live avant chaque intervention. Chaque déploiement porte son chemin de retour arrière.",
    ],
    level: "L4",
    status:
      "En production, usage récurrent. Le client compare aux sorties de sa propre méthode et envoie des retours écrits datés.",
  },
  {
    id: "R-07",
    who: "Parrit, en propre",
    title: "Une chronique publiée dans la presse informatique professionnelle",
    before: "Une doctrine d'ingénierie tenue en interne, jamais soumise à une rédaction extérieure.",
    built: [
      "Un article publié, passé au fact-check d'une rédaction, sous la signature de Paul.",
      "Une série en cours sur la même méthode de travail.",
    ],
    level: "L6",
    status: "Publié. C'est la seule preuve du corpus qui soit publiable nommément.",
  },
];

/**
 * Ce qui manque VRAIMENT. Ces emplacements s'affichent tels quels dans les
 * prototypes : ils sont une commande de travail, pas un défaut de mise en page.
 */
export const PROOF_SLOTS = [
  {
    id: "SLOT-01",
    where: "Paul · Selected builds",
    need: "Une capture réelle d'un système en fonctionnement, autorisée par le client ou floutée. Aucune capture publiable n'existe aujourd'hui dans le dépôt.",
  },
  {
    id: "SLOT-02",
    where: "Maxime · Stories",
    need: "Un verbatim client écrit, daté, avec accord de citation anonymisée. La matrice atteste de retours écrits datés (R-09) mais aucun n'est autorisé à la citation.",
  },
  {
    id: "SLOT-03",
    where: "Maxime · Hero",
    need: "Portrait et vidéo de Maxime. Le dépôt ne contient aujourd'hui aucune image de Maxime.",
  },
  {
    id: "SLOT-04",
    where: "Parrit · Watch it work",
    need: "Un enregistrement d'écran d'un système réel, du signal jusqu'au résultat, sans donnée client lisible.",
  },
  {
    id: "SLOT-05",
    where: "Parrit · Super App",
    need: "Captures de l'application mobile déployée (R-13). Elles existent probablement hors de ce dépôt.",
  },
] as const;
