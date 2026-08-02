/**
 * PROJECTION VERS LE COCKPIT — une ligne lisible par personne.
 *
 * INVARIANT : le Google Sheet reste le cockpit de l'acquisition. Supabase garde
 * l'historique et fait le calcul ; le Sheet reçoit une **projection**, pas une
 * source de vérité concurrente.
 *
 * Deux règles qui découlent de cet invariant, et qui ne se négocient pas :
 *
 *   1. **on n'écrase aucune écriture existante.** Le classeur reçoit déjà, en
 *      tête de chaîne n8n, une ligne par soumission. Cette projection vit dans
 *      un onglet distinct et ne touche pas à l'historique événementiel ;
 *   2. **l'idempotence repose sur `submission_id`.** Une nouvelle demande
 *      complète la ligne de la personne, elle ne remplace jamais les
 *      précédentes : `resources_consumed` s'accumule, et la liste des
 *      soumissions déjà projetées est portée par la ligne elle-même.
 *
 * Ce fichier est pur. Il calcule la ligne ; il ne l'écrit pas.
 */

import type { Ressource } from "../registry/ressources";
import type { ProfilInteret, Signal } from "./profil";
import { AUCUNE_RESSOURCE, type Decision } from "./selection";

export type LigneCockpit = {
  email: string;
  /** Le domaine observé, jamais demandé : il est dans l'adresse. */
  organisation: string;
  premier_canal: string;
  dernier_canal: string;
  pilier_dominant: string;
  niveau_engagement: string;
  ressources_consommees: string;
  prochaine_ressource: string;
  prochaine_action: string;
  raison_recommandation: string;
  date_prochaine_action: string;
  handoff_humain: string;
  statut_sync_supabase: string;
  /** Toutes les soumissions déjà reflétées ici. C'est la clé d'idempotence. */
  submission_ids: string;
};

/** Les domaines qui ne disent rien de l'organisation. */
const DOMAINES_GENERIQUES = new Set([
  "gmail.com",
  "outlook.com",
  "outlook.fr",
  "hotmail.com",
  "hotmail.fr",
  "yahoo.com",
  "yahoo.fr",
  "icloud.com",
  "free.fr",
  "orange.fr",
  "protonmail.com",
  "proton.me",
]);

/**
 * L'organisation, déduite du domaine. Un domaine générique n'est pas une
 * organisation : on le dit, au lieu d'écrire « gmail » dans une colonne société.
 */
export function organisationObservee(email: string): string {
  const domaine = email.split("@")[1]?.trim().toLowerCase() ?? "";
  if (!domaine) return "";
  return DOMAINES_GENERIQUES.has(domaine) ? "(adresse personnelle)" : domaine;
}

/** Le premier et le dernier canal, dans l'ordre chronologique des signaux. */
export function canaux(signaux: readonly Signal[]): { premier: string; dernier: string } {
  const avecCanal = [...signaux]
    .filter((s) => s.canal)
    .sort((a, b) => (a.date < b.date ? -1 : a.date > b.date ? 1 : 0));
  return {
    premier: avecCanal[0]?.canal ?? "",
    dernier: avecCanal[avecCanal.length - 1]?.canal ?? "",
  };
}

/**
 * Le délai avant la prochaine action, en jours. Il dépend de l'état, pas d'une
 * cadence fixe : quelqu'un de chaud n'attend pas le même temps qu'un premier
 * signal, et un handoff n'attend pas du tout.
 */
export function delaiEnJours(profil: Pick<ProfilInteret, "nurture_state" | "engagement_level">): number {
  if (profil.nurture_state === "handoff_humain") return 0;
  if (profil.nurture_state === "intention_forte") return 1;
  return profil.engagement_level === "chaud" ? 2 : 4;
}

export function dateProchaineAction(
  profil: Pick<ProfilInteret, "nurture_state" | "engagement_level">,
  /** Fourni par l'appelant : le calcul n'appelle jamais l'horloge. */
  maintenantIso: string,
): string {
  const base = Date.parse(maintenantIso);
  if (!Number.isFinite(base)) return "";
  const jours = delaiEnJours(profil);
  return new Date(base + jours * 24 * 3600 * 1000).toISOString().slice(0, 10);
}

/**
 * Construit la ligne. `ligneExistante` est celle déjà présente dans l'onglet :
 * on FUSIONNE avec elle au lieu de la remplacer, pour qu'aucune information
 * antérieure ne se perde.
 */
/** Le sous-ensemble du profil dont la projection a besoin. Rien de plus. */
export type ProfilProjetable = Pick<
  ProfilInteret,
  | "dominant_pillar"
  | "engagement_level"
  | "nurture_state"
  | "resources_consumed"
  | "human_handoff_required"
>;

export function projeterLigne(params: {
  email: string;
  profil: ProfilProjetable;
  signaux: readonly Signal[];
  decision: Decision;
  action: { action: string; raison: string };
  submissionIds: readonly string[];
  maintenantIso: string;
  syncSupabase: "ok" | "echec";
  ligneExistante?: Partial<LigneCockpit>;
}): LigneCockpit {
  const { email, profil, signaux, decision, action, submissionIds, maintenantIso } = params;
  const c = canaux(signaux);

  /* Fusion, jamais remplacement : les soumissions déjà projetées restent, et
     l'union est dédupliquée. Rejouer la même soumission ne change rien. */
  const dejaProjetees = (params.ligneExistante?.submission_ids ?? "")
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);
  const toutesSoumissions = [...new Set([...dejaProjetees, ...submissionIds])];

  const ressourcesAnterieures = (params.ligneExistante?.ressources_consommees ?? "")
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);
  const toutesRessources = [
    ...new Set([...ressourcesAnterieures, ...profil.resources_consumed]),
  ];

  return {
    email,
    organisation: organisationObservee(email),
    // Le premier canal ne se réécrit jamais : c'est un fait daté.
    premier_canal: params.ligneExistante?.premier_canal || c.premier,
    dernier_canal: c.dernier || params.ligneExistante?.dernier_canal || "",
    pilier_dominant: profil.dominant_pillar ?? "",
    niveau_engagement: profil.engagement_level,
    ressources_consommees: toutesRessources.join(", "),
    prochaine_ressource:
      decision.ressource === AUCUNE_RESSOURCE ? AUCUNE_RESSOURCE : decision.ressource.slug,
    prochaine_action: action.action,
    raison_recommandation: action.raison,
    date_prochaine_action: dateProchaineAction(profil, maintenantIso),
    handoff_humain: profil.human_handoff_required ? "oui" : "non",
    statut_sync_supabase: params.syncSupabase,
    submission_ids: toutesSoumissions.join(", "),
  };
}

/* ------------------------------------------------- variables pour la copie */

/**
 * Ce que la session copie reçoit pour écrire un message — et rien de plus.
 *
 * Aucun texte n'est produit ici. Le document de positionnement de Paul décide
 * du wording ; le moteur ne décide que du QUOI et du POURQUOI.
 */
export type VariablesMessage = {
  pilier: string | null;
  ressource_precedente: string | null;
  prochaine_ressource: string | null;
  raison: string;
  niveau_engagement: string;
  /** L'article et le canal d'arrivée : de quoi parler à la bonne personne. */
  contexte_origine: { article: string | null; canal: string | null; campagne: string | null };
  etat_handoff: string;
};

export function variablesPourLaCopie(params: {
  profil: Pick<
    ProfilInteret,
    "dominant_pillar" | "engagement_level" | "nurture_state"
  >;
  signaux: readonly Signal[];
  decision: Decision;
  action: { action: string; raison: string };
  registre: readonly Ressource[];
}): VariablesMessage {
  const { profil, signaux, decision, action } = params;

  const derniereDemande = [...signaux]
    .filter((s) => s.nature === "ressource_demandee")
    .sort((a, b) => (a.date < b.date ? 1 : -1))[0];

  return {
    pilier: profil.dominant_pillar,
    ressource_precedente: derniereDemande?.ressourceSlug ?? null,
    prochaine_ressource:
      decision.ressource === AUCUNE_RESSOURCE ? null : decision.ressource.slug,
    raison: action.raison,
    niveau_engagement: profil.engagement_level,
    contexte_origine: {
      article: derniereDemande?.articleSlug ?? null,
      canal: derniereDemande?.canal ?? null,
      campagne: derniereDemande?.campagne ?? null,
    },
    etat_handoff: profil.nurture_state,
  };
}
