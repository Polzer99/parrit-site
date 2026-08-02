import "server-only";

import { requeteSupabase } from "./supabase";

/**
 * PERSISTANCE D'UN LEAD DE RESSOURCE.
 *
 * AUCUN NOUVEAU SCHÉMA. La grammaire existe déjà en base et on l'utilise telle
 * quelle :
 *
 *   — `prospects`   : la personne. Dédupliquée par `(workspace_id, slug)`, la
 *                     contrainte d'unicité déjà en place. Le slug vient de
 *                     l'e-mail : deux demandes de la même personne ne créent
 *                     jamais deux fiches ;
 *   — `touchpoints` : l'événement « a demandé telle ressource ». Une ligne par
 *                     demande, `kind = 'ressource_demandee'`, dans le même
 *                     esprit que le `catalog_visit` déjà utilisé par le site.
 *
 * Le contexte structuré (identifiant de soumission, ressource, article, UTM)
 * vit dans `prospects.metadata`, une colonne `jsonb` qui existe. Il n'est pas
 * enfoui dans du texte libre, et surtout : **aucune migration n'est nécessaire**.
 * `touchpoints` n'a pas de colonne `jsonb` ; lui en ajouter une serait un
 * changement de structure, donc une décision de Paul et de Maxime, pas la
 * mienne.
 *
 * IDEMPOTENCE. Le `submission_id` est cherché dans `metadata` avant toute
 * écriture. Un renvoi après panne réseau retrouve la soumission et ne crée ni
 * seconde fiche, ni second touchpoint.
 */

/** Le workspace Parrit.ai. Jamais fourni par le client : ce serait une injection. */
const WORKSPACE_PARRIT = "3cd72035-f601-4946-94be-9baae74e3388";

/**
 * Le workspace de test. Les adresses `+test@` y vont, pour qu'un bout-en-bout
 * puisse être joué sans salir le CRM — « jamais de test sur la prod ».
 */
const WORKSPACE_TEST = "0000c0de-0000-4000-8000-000000000001";

export type ContexteLead = {
  submissionId: string;
  email: string;
  /** Le nom si le formulaire en demande un. Beaucoup n'en demandent pas. */
  nom?: string;
  ressourceSlug: string;
  /** L'URL de l'expérience réellement livrée. */
  ressourceUrl: string;
  /** L'article d'où vient la demande, s'il y en a un. */
  articleSlug?: string;
  source: string;
  pageOrigine: string;
  lang: string;
  /** `utm_*`, `referrer`, `landing_page`, first/last touch. */
  attribution: Record<string, string>;
  /** Réponses facultatives du formulaire, telles que saisies. */
  reponses?: Record<string, string>;
};

export type ResultatPersistance = {
  prospectId: string;
  touchpointId: string;
  /** Vrai quand la soumission existait déjà : la reprise n'a rien dupliqué. */
  dejaEnregistre: boolean;
  workspaceId: string;
};

type LigneProspect = {
  id: string;
  metadata: Record<string, unknown> | null;
};

type LigneTouchpoint = { id: string };

/** Un slug stable et lisible, dérivé de l'e-mail. C'est la clé de déduplication. */
export function slugDepuisEmail(email: string): string {
  const normalise = email
    .trim()
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9@.]+/g, "-")
    .replace(/^-+|-+$/g, "");
  return `site-${normalise}`.slice(0, 120);
}

/** Les adresses de test ne vont pas dans le CRM. */
export function estAdresseDeTest(email: string): boolean {
  return /\+test[0-9a-z-]*@/i.test(email);
}

function workspacePour(email: string): string {
  return estAdresseDeTest(email) ? WORKSPACE_TEST : WORKSPACE_PARRIT;
}

type DemandeEnregistree = {
  submission_id: string;
  ressource_slug: string;
  ressource_url: string;
  article_slug?: string;
  source: string;
  page_origine: string;
  lang: string;
  attribution: Record<string, string>;
  reponses?: Record<string, string>;
  demande_le: string;
};

function demandesExistantes(metadata: Record<string, unknown> | null): DemandeEnregistree[] {
  const brut = metadata?.["demandes_ressource"];
  return Array.isArray(brut) ? (brut as DemandeEnregistree[]) : [];
}

/**
 * Écrit le lead, et ne rend la main qu'une fois la base l'ayant confirmé.
 * Toute erreur remonte : c'est l'appelant qui décide quoi montrer, et il ne
 * doit jamais annoncer un succès qui n'a pas eu lieu.
 */
export async function enregistrerDemandeRessource(
  contexte: ContexteLead,
): Promise<ResultatPersistance> {
  const workspaceId = workspacePour(contexte.email);
  const slug = slugDepuisEmail(contexte.email);

  const existants = await requeteSupabase<LigneProspect>({
    methode: "GET",
    chemin:
      `prospects?select=id,metadata` +
      `&workspace_id=eq.${workspaceId}&slug=eq.${encodeURIComponent(slug)}&limit=1`,
  });

  const existant = existants[0];

  /* Reprise après panne : la soumission est déjà passée, on ne la rejoue pas. */
  if (existant) {
    const deja = demandesExistantes(existant.metadata).find(
      (d) => d.submission_id === contexte.submissionId,
    );
    if (deja) {
      const tp = await requeteSupabase<LigneTouchpoint>({
        methode: "GET",
        chemin:
          `touchpoints?select=id&prospect_id=eq.${existant.id}` +
          `&note=ilike.*${encodeURIComponent(contexte.submissionId)}*&limit=1`,
      });
      return {
        prospectId: existant.id,
        touchpointId: tp[0]?.id ?? "",
        dejaEnregistre: true,
        workspaceId,
      };
    }
  }

  const demande: DemandeEnregistree = {
    submission_id: contexte.submissionId,
    ressource_slug: contexte.ressourceSlug,
    ressource_url: contexte.ressourceUrl,
    ...(contexte.articleSlug ? { article_slug: contexte.articleSlug } : {}),
    source: contexte.source,
    page_origine: contexte.pageOrigine,
    lang: contexte.lang,
    attribution: contexte.attribution,
    ...(contexte.reponses ? { reponses: contexte.reponses } : {}),
    demande_le: new Date().toISOString(),
  };

  const metadata = {
    ...(existant?.metadata ?? {}),
    demandes_ressource: [...demandesExistantes(existant?.metadata ?? null), demande],
  };

  /* Upsert sur la contrainte `(workspace_id, slug)` qui existe déjà. Une
     seconde demande met à jour la fiche, elle n'en crée pas une deuxième. */
  const prospects = await requeteSupabase<LigneProspect>({
    methode: "POST",
    chemin: "prospects?on_conflict=workspace_id,slug",
    prefer: "resolution=merge-duplicates",
    corps: [
      {
        workspace_id: workspaceId,
        slug,
        // `nom` est NOT NULL en base : à défaut de nom saisi, l'e-mail fait foi.
        nom: contexte.nom?.trim() || contexte.email.trim(),
        email: contexte.email.trim(),
        source: contexte.source,
        channel: "site",
        campaign: contexte.attribution["utm_campaign"] ?? null,
        preferred_language: contexte.lang,
        metadata,
        updated_at: new Date().toISOString(),
      },
    ],
  });

  const prospect = prospects[0];
  if (!prospect?.id) {
    throw new Error("prospect non retourné par la base : persistance non confirmée");
  }

  /* La note suit la convention déjà en place sur le site (`catalog_visit`) :
     une ligne lisible, séparée par des points médians. Le contexte requêtable,
     lui, est dans `metadata`. */
  const note = [
    `Ressource demandée · ${contexte.ressourceSlug}`,
    `livrée ${contexte.ressourceUrl}`,
    contexte.articleSlug ? `depuis l'article ${contexte.articleSlug}` : "sans article d'origine",
    `source ${contexte.source}`,
    `page ${contexte.pageOrigine}`,
    contexte.attribution["utm_campaign"]
      ? `campagne ${contexte.attribution["utm_campaign"]}`
      : "sans campagne",
    `soumission ${contexte.submissionId}`,
  ].join(" · ");

  const touchpoints = await requeteSupabase<LigneTouchpoint>({
    methode: "POST",
    chemin: "touchpoints",
    corps: [
      {
        workspace_id: workspaceId,
        prospect_id: prospect.id,
        kind: "ressource_demandee",
        source_channel: `site:${contexte.ressourceSlug}`,
        note,
      },
    ],
  });

  const touchpoint = touchpoints[0];
  if (!touchpoint?.id) {
    throw new Error("touchpoint non retourné par la base : persistance non confirmée");
  }

  return {
    prospectId: prospect.id,
    touchpointId: touchpoint.id,
    dejaEnregistre: false,
    workspaceId,
  };
}
