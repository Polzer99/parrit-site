import "server-only";

import { requeteSupabase } from "./supabase";
import type { Interet } from "./interets";

/**
 * LECTURE d'une esquisse : la déclaration d'intérêt est retrouvée par son
 * `submission_id` (UUID serveur, non devinable — c'est le jeton d'accès).
 * Lecture seule, tous workspaces (les adresses de test voient leur esquisse).
 */

export type Esquisse = {
  interet: Interet;
  entreprise: string;
  declareLe: string;
};

type LigneProspect = {
  id: string;
  email: string | null;
  entreprise?: string | null;
  metadata: Record<string, unknown> | null;
};

type Declaration = {
  submission_id: string;
  interet: Interet;
  entreprise?: string;
  declare_le: string;
};

function entrepriseDepuisEmail(email: string): string {
  const domaine = email.split("@")[1] ?? "";
  const racine = domaine.split(".")[0] ?? "";
  const generiques = ["gmail", "outlook", "hotmail", "yahoo", "icloud", "proton", "protonmail", "orange", "free", "sfr", "laposte"];
  if (!racine || generiques.includes(racine.toLowerCase())) return "your company";
  return racine.charAt(0).toUpperCase() + racine.slice(1);
}

export async function lireEsquisse(submissionId: string): Promise<Esquisse | null> {
  if (!/^[0-9a-f-]{36}$/i.test(submissionId)) return null;

  const contains = encodeURIComponent(
    JSON.stringify({ interets_declares: [{ submission_id: submissionId }] }),
  );
  const lignes = await requeteSupabase<LigneProspect>({
    methode: "GET",
    chemin: `prospects?select=id,email,entreprise,metadata&metadata=cs.${contains}&limit=1`,
  });

  const prospect = lignes[0];
  if (!prospect) return null;

  const declarations = (prospect.metadata?.["interets_declares"] ?? []) as Declaration[];
  const declaration = declarations.find((d) => d.submission_id === submissionId);
  if (!declaration) return null;

  const entreprise =
    declaration.entreprise?.trim() ||
    prospect.entreprise?.trim() ||
    entrepriseDepuisEmail(prospect.email ?? "");

  return {
    interet: declaration.interet,
    entreprise,
    declareLe: declaration.declare_le,
  };
}
