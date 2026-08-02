import "server-only";

import { requeteSupabase } from "./supabase";
import { getRessource, getRessourcesPubliees } from "../registry/ressources";
import {
  construireProfil,
  signauxDepuisDemandes,
  type DemandeStockee,
  type FaitsHumains,
} from "../interet/profil";
import { prochaineAction, selectNextResource } from "../interet/selection";
import { projeterLigne, variablesPourLaCopie, type LigneCockpit } from "../interet/projection";

/**
 * L'ADAPTATEUR — le seul endroit qui touche la base pour le moteur d'intérêt.
 *
 * Le moteur lui-même est pur : il ne sait rien de Supabase. Ce fichier lit
 * l'historique, appelle le calcul, et rend des lignes prêtes à projeter dans le
 * cockpit. Cette séparation est ce qui permet de tester la décision sans base,
 * et de changer de stockage sans retoucher la décision.
 *
 * Lecture seule sur `prospects`. Aucune écriture, aucun envoi.
 */

const WORKSPACE_PARRIT = "3cd72035-f601-4946-94be-9baae74e3388";

type LigneProspect = {
  id: string;
  email: string | null;
  preferred_language: string | null;
  metadata: Record<string, unknown> | null;
  paul_manual_followup_status: string | null;
};

/** Le pilier d'une ressource, résolu depuis le registre. */
const pilierDe = (slug: string) => getRessource(slug)?.pilier ?? null;

/**
 * Les faits humains lus en base. Aujourd'hui, seule la reprise manuelle de Paul
 * est enregistrée sur la fiche. Les réponses et les rendez-vous vivent ailleurs
 * — Gmail, le calendrier — et ne sont pas encore rapatriés : c'est documenté
 * comme un manque, pas deviné.
 */
function faitsHumains(ligne: LigneProspect): FaitsHumains {
  return {
    repriseManuelle: Boolean(ligne.paul_manual_followup_status),
  };
}

export type LigneCalculee = {
  ligne: LigneCockpit;
  variables: ReturnType<typeof variablesPourLaCopie>;
  prospectId: string;
};

/**
 * Calcule les lignes de cockpit pour toutes les personnes ayant au moins une
 * demande de ressource. `maintenantIso` est fourni par l'appelant : le calcul
 * n'appelle jamais l'horloge, donc il est rejouable à l'identique.
 */
export async function calculerLignesCockpit(maintenantIso: string): Promise<LigneCalculee[]> {
  const prospects = await requeteSupabase<LigneProspect>({
    methode: "GET",
    chemin:
      `prospects?select=id,email,preferred_language,metadata,paul_manual_followup_status` +
      `&workspace_id=eq.${WORKSPACE_PARRIT}` +
      `&metadata->demandes_ressource=not.is.null&limit=500`,
  });

  const registre = getRessourcesPubliees();
  const lignes: LigneCalculee[] = [];

  for (const p of prospects) {
    const demandes = (p.metadata?.["demandes_ressource"] ?? []) as DemandeStockee[];
    if (!Array.isArray(demandes) || demandes.length === 0 || !p.email) continue;

    const signaux = signauxDepuisDemandes(demandes, pilierDe);
    const profil = construireProfil(signaux, faitsHumains(p));

    const langue = p.preferred_language === "en" ? "en" : "fr";
    const decision = selectNextResource({ ...profil, langue }, registre);
    const action = prochaineAction(profil, decision);

    lignes.push({
      prospectId: p.id,
      ligne: projeterLigne({
        email: p.email,
        profil,
        signaux,
        decision,
        action,
        submissionIds: demandes.map((d) => d.submission_id),
        maintenantIso,
        syncSupabase: "ok",
      }),
      variables: variablesPourLaCopie({ profil, signaux, decision, action, registre }),
    });
  }

  return lignes;
}
