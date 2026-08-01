/**
 * REGISTRE DES RESSOURCES — remplace le tableau en dur de
 * `src/app/[lang]/ressources/page.tsx:83`.
 *
 * Chaque ressource porte sa promesse ET son mode de livraison. Le champ
 * `livraisonVerifiee` dit la vérité : au 01/08/2026, le mail de confirmation du
 * workflow n8n est générique et ne livre AUCUNE ressource, quelle que soit la
 * source. Une ressource `livraisonVerifiee: false` ne doit pas promettre un envoi
 * par mail — elle doit donner le lien directement dans l'état de succès.
 */

import type { CtaId } from "./cta";

export type TypeRessource =
  | "diagnostic"
  | "benchmark"
  | "matrice"
  | "guide"
  | "architecture"
  | "calculateur"
  | "prototype"
  | "audit_rapide"
  | "bibliotheque"
  | "comparatif";

export type NiveauEngagement = "faible" | "moyen" | "fort" | "tres_fort";

export type Ressource = {
  id: string;
  slug: string;
  titre: string;
  type: TypeRessource;
  promesse: string;
  /** Ce que la personne obtient concrètement, en 3 à 5 items. */
  contenu: string[];
  /** Chemin du livrable réel. Vide si la ressource est un outil, pas un fichier. */
  livrable: string;
  formGabarit: "G1_optin_leger" | "G2_ressource_qualifiante" | "G3_diagnostic" | "G4_adaptation_lab";
  ctaPrincipal: CtaId;
  niveauEngagement: NiveauEngagement;
  /** true seulement si la ressource arrive réellement chez la personne. */
  livraisonVerifiee: boolean;
  /** Langue de la ressource. */
  langue: "fr" | "en";
  publiee: boolean;
};

const REGISTRE: Ressource[] = [
  {
    id: "res.architecture-claude-md",
    slug: "architecture-claude-md",
    titre: "L'architecture CLAUDE.md",
    type: "architecture",
    promesse:
      "Les quatre couches d'un agent qui pilote vraiment, avec les blocs à coller.",
    contenu: [
      "Les quatre couches, expliquées dans l'ordre où on les écrit",
      "Les blocs de configuration, prêts à coller",
      "Ce qui casse quand une couche manque",
    ],
    livrable: "/architecture-claude-md",
    formGabarit: "G2_ressource_qualifiante",
    ctaPrincipal: "ressource.telecharger",
    niveauEngagement: "moyen",
    livraisonVerifiee: true,
    langue: "fr",
    publiee: true,
  },
  {
    id: "res.demarrer-claude-code",
    slug: "demarrer-claude-code",
    titre: "Démarrer avec Claude Code",
    type: "guide",
    promesse:
      "Le pas à pas pour installer et piloter un agent de code sans être développeur.",
    contenu: [
      "L'installation, commande par commande",
      "Le fichier de pilotage, commenté",
      "Les trois erreurs de départ et comment les éviter",
    ],
    livrable: "/demarrer-claude-code",
    formGabarit: "G2_ressource_qualifiante",
    ctaPrincipal: "ressource.telecharger",
    niveauEngagement: "moyen",
    livraisonVerifiee: true,
    langue: "fr",
    publiee: true,
  },
  {
    id: "res.harnais-ia",
    slug: "harnais-ia",
    titre: "Le harnais IA",
    type: "matrice",
    promesse:
      "La matrice tâche → modèle, et le calcul de ce que vous payez en trop.",
    contenu: [
      "La matrice tâche → modèle, avec les seuils",
      "Le calculateur de coût par tâche",
      "Les deux défauts qui font exploser une facture sans alerte",
    ],
    livrable: "/harnais-ia",
    formGabarit: "G2_ressource_qualifiante",
    ctaPrincipal: "ressource.demander",
    niveauEngagement: "moyen",
    // Le mail de confirmation ne joint rien : la page doit livrer elle-même.
    livraisonVerifiee: false,
    langue: "fr",
    publiee: true,
  },
  {
    id: "res.hr-radar",
    slug: "hr-radar",
    titre: "The Augmented HR Radar",
    type: "diagnostic",
    promesse:
      "Where your HR operations can be automated, and where they should not be.",
    contenu: [
      "A self-assessment across the HR operating chain",
      "A score with its reasons, not just a number",
      "The three tasks worth automating first",
    ],
    livrable: "/hr-radar",
    formGabarit: "G3_diagnostic",
    ctaPrincipal: "rdv.paul",
    niveauEngagement: "fort",
    livraisonVerifiee: true,
    langue: "en",
    // Orpheline en production : 0 lien entrant, absente du sitemap.
    // Publiée ici pour qu'elle cesse de l'être.
    publiee: true,
  },
  {
    id: "res.detecteur-bullshit",
    slug: "detecteur-bullshit",
    titre: "Le détecteur de bullshit IA",
    type: "audit_rapide",
    promesse: "Un score sur ce qu'on vous vend, et la raison de chaque point retiré.",
    contenu: [
      "Un score de 0 à 100 sur un contenu ou une promesse",
      "Le détail de ce qui fait baisser la note",
      "Les questions à poser au fournisseur",
    ],
    livrable: "/outils/detecteur-bullshit",
    formGabarit: "G1_optin_leger",
    ctaPrincipal: "rdv.paul",
    niveauEngagement: "faible",
    livraisonVerifiee: true,
    langue: "fr",
    publiee: true,
  },
  {
    id: "res.diagnostic",
    slug: "diagnostic",
    titre: "Le diagnostic",
    type: "diagnostic",
    promesse: "Décrivez votre cas, on vous dit où il coince et par quoi commencer.",
    contenu: [
      "Trois écrans, pas un formulaire de vingt champs",
      "Un retour relu par un humain avant envoi",
      "Ce qui est faisable maintenant, et ce qui ne l'est pas",
    ],
    livrable: "/diagnostic",
    formGabarit: "G3_diagnostic",
    ctaPrincipal: "rdv.paul",
    niveauEngagement: "fort",
    livraisonVerifiee: true,
    langue: "fr",
    publiee: true,
  },
];

export function getRessource(slug: string): Ressource | undefined {
  return REGISTRE.find((r) => r.slug === slug);
}

export function getRessourcesPubliees(langue?: "fr" | "en"): Ressource[] {
  return REGISTRE.filter((r) => r.publiee && (!langue || r.langue === langue));
}

export function getAllRessourceSlugs(): string[] {
  return REGISTRE.filter((r) => r.publiee).map((r) => r.slug);
}
