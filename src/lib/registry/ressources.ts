/**
 * REGISTRE DES RESSOURCES — remplace le tableau en dur de
 * `src/app/[lang]/ressources/page.tsx:83`.
 *
 * Chaque ressource porte sa promesse ET son mode de livraison. Le champ
 * `livraisonVerifiee` dit la vérité : au 01/08/2026, le mail de confirmation du
 * workflow n8n est générique et ne livre AUCUNE ressource, quelle que soit la
 * source. Une ressource `livraisonVerifiee: false` ne doit pas promettre un envoi
 * par mail — elle doit donner le lien directement dans l'état de succès.
 *
 * ARBITRAGE PAUL DU 02/08/2026 — la structure n'ajoute pas d'étape entre le
 * visiteur et la valeur. Chaque ressource déclare donc, dans `experience`,
 * l'URL UNIQUE qui rend son expérience complète. Une carte d'index pointe
 * toujours vers cette URL, jamais vers une fiche qui obligerait à recliquer.
 *
 * Deux cas, et deux seulement :
 *
 *   — `rendu: "template"` : l'expérience est rendue par T3 à
 *     `/[lang]/ressources/[slug]`. C'est le cas d'une ressource autoportante ;
 *   — `rendu: "route_dediee"` : l'expérience existe déjà à son URL historique
 *     (landing dédiée, outil interactif, formulaire). Cette URL EST la
 *     canonique ; `/[lang]/ressources/[slug]` redirige vers elle en 301 et
 *     n'est donc jamais une seconde page indexable décrivant la même chose.
 *
 * Les six ressources publiées sont aujourd'hui en `route_dediee` : leur
 * expérience complète existe déjà ailleurs, et la recopier dans un template
 * fabriquerait le doublon que cet arbitrage supprime.
 */

import type { CtaId } from "./cta";
import type { PillarSlug } from "../pillars";

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

/**
 * Où vit l'expérience complète. Une ressource en a une et une seule : c'est
 * cette URL qui est canonique, indexée, et visée par les cartes d'index.
 */
export type ExperienceRessource =
  | { rendu: "template" }
  | { rendu: "route_dediee"; url: string };

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
  /** L'URL unique qui rend l'expérience complète. Voir l'en-tête du fichier. */
  experience: ExperienceRessource;
  /**
   * Le pilier éditorial de la ressource. C'est l'AXE D'INTÉRÊT : les articles
   * en portent un, les ressources aussi, donc « ce qui intéresse quelqu'un » se
   * calcule au lieu de se demander.
   *
   * Ce rattachement vivait en dur dans `blog/[slug]/page.tsx`. Une page n'est
   * pas un endroit où ranger de la donnée : il est ici, et la page le lit.
   */
  pilier: PillarSlug;
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
    experience: { rendu: "route_dediee", url: "/architecture-claude-md" },
    pilier: "agents-ia",
    formGabarit: "G2_ressource_qualifiante",
    ctaPrincipal: "ressource.telecharger",
    niveauEngagement: "moyen",
    // Vérifié le 02/08/2026 en production : le courriel de confirmation
    // propose un créneau et ne joint AUCUNE ressource. La valeur est remise à
    // l'écran, dans la page, et c'est très bien ainsi — mais on ne promet pas
    // un envoi qui n'existe pas.
    livraisonVerifiee: false,
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
    experience: { rendu: "route_dediee", url: "/demarrer-claude-code" },
    pilier: "formation-agents-ia",
    formGabarit: "G2_ressource_qualifiante",
    ctaPrincipal: "ressource.telecharger",
    niveauEngagement: "moyen",
    // Vérifié le 02/08/2026 en production : le courriel de confirmation
    // propose un créneau et ne joint AUCUNE ressource. La valeur est remise à
    // l'écran, dans la page, et c'est très bien ainsi — mais on ne promet pas
    // un envoi qui n'existe pas.
    livraisonVerifiee: false,
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
    experience: { rendu: "route_dediee", url: "/harnais-ia" },
    pilier: "logiciel-ia-sur-mesure",
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
    experience: { rendu: "route_dediee", url: "/hr-radar" },
    pilier: "agents-ia",
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
    experience: { rendu: "route_dediee", url: "/outils/detecteur-bullshit" },
    pilier: "agents-ia",
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
    experience: { rendu: "route_dediee", url: "/diagnostic" },
    pilier: "logiciel-ia-sur-mesure",
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

/**
 * L'URL CANONIQUE d'une ressource — celle qui rend l'expérience complète, et la
 * seule qui doit être indexée. C'est aussi la cible directe des cartes d'index :
 * un clic depuis la liste amène sur la valeur, jamais sur une fiche.
 */
export function urlExperience(r: Ressource, lang: string): string {
  return r.experience.rendu === "template"
    ? `/${lang}/ressources/${r.slug}`
    : r.experience.url;
}

/** Les ressources dont T3 rend lui-même l'expérience. */
export function getRessourcesRenduesParTemplate(): Ressource[] {
  return REGISTRE.filter((r) => r.publiee && r.experience.rendu === "template");
}

/**
 * Les alias à rediriger en 301 : `/[lang]/ressources/[slug]` vers l'expérience.
 * Consommé par `next.config.ts`, pour que la redirection soit servie par le
 * routeur et non par une page — une seule redirection, jamais de chaîne.
 */
export function aliasRessourcesARediriger(): { slug: string; url: string }[] {
  return REGISTRE.filter(
    (r): r is Ressource & { experience: { rendu: "route_dediee"; url: string } } =>
      r.publiee && r.experience.rendu === "route_dediee",
  ).map((r) => ({ slug: r.slug, url: r.experience.url }));
}
