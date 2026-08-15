import "server-only";

import { requeteSupabase } from "./supabase";
import { estAdresseDeTest, slugDepuisEmail, type ResultatPersistance } from "./leads";

/**
 * DÉCLARATION D'INTÉRÊT (« Register your interest », funnel prototype).
 *
 * Même grammaire que la demande de ressource (`leads.ts`) : `prospects` résolu
 * par l'e-mail, `touchpoints` pour l'événement, contexte structuré dans
 * `prospects.metadata` — clé `interets_declares`, `kind = 'interet_declare'`.
 * Valeurs nouvelles dans des colonnes existantes : AUCUNE migration (§47).
 *
 * La promesse portée par ce funnel : à partir de l'intérêt déclaré, Parrit
 * esquisse un mini-prototype d'operating system pour l'entreprise. La carte
 * super app le rappelle à l'opérateur — l'envoi reste humain (§27, §30).
 */

const WORKSPACE_PARRIT = "3cd72035-f601-4946-94be-9baae74e3388";
const WORKSPACE_TEST = "0000c0de-0000-4000-8000-000000000001";

export const INTERETS = [
  "reporting",
  "client-flow",
  "mail-followups",
  "full-os",
] as const;

export type Interet = (typeof INTERETS)[number];

export type ContexteInteret = {
  submissionId: string;
  email: string;
  interet: Interet;
  entreprise?: string;
  /** La personne accepte explicitement un appel d'examination. */
  ouvertAppel: boolean;
  source: string;
  pageOrigine: string;
  lang: string;
  attribution: Record<string, string>;
};

type LigneProspect = {
  id: string;
  slug?: string;
  email?: string | null;
  metadata: Record<string, unknown> | null;
};

type LigneTouchpoint = { id: string };

type InteretEnregistre = {
  submission_id: string;
  interet: Interet;
  entreprise?: string;
  ouvert_appel: boolean;
  source: string;
  page_origine: string;
  lang: string;
  attribution: Record<string, string>;
  declare_le: string;
};

function interetsExistants(metadata: Record<string, unknown> | null): InteretEnregistre[] {
  const brut = metadata?.["interets_declares"];
  return Array.isArray(brut) ? (brut as InteretEnregistre[]) : [];
}

export async function enregistrerInteret(
  contexte: ContexteInteret,
): Promise<ResultatPersistance> {
  const workspaceId = estAdresseDeTest(contexte.email) ? WORKSPACE_TEST : WORKSPACE_PARRIT;
  const slug = slugDepuisEmail(contexte.email);

  /* Résolution par l'e-mail d'abord — même règle et mêmes raisons que
     `enregistrerDemandeRessource` (doublons réels constatés en base). */
  const emailNormalise = contexte.email.trim().toLowerCase();
  const parEmail = (
    await requeteSupabase<LigneProspect>({
      methode: "GET",
      chemin:
        `prospects?select=id,slug,email,metadata` +
        `&workspace_id=eq.${workspaceId}&email=ilike.${encodeURIComponent(contexte.email.trim())}&limit=5`,
    })
  ).filter((p) => (p.email ?? "").trim().toLowerCase() === emailNormalise);

  const parSlug = parEmail[0]
    ? []
    : await requeteSupabase<LigneProspect>({
        methode: "GET",
        chemin:
          `prospects?select=id,slug,metadata` +
          `&workspace_id=eq.${workspaceId}&slug=eq.${encodeURIComponent(slug)}&limit=1`,
      });

  const existant = parEmail[0] ?? parSlug[0];
  const slugCible = existant?.slug ?? slug;

  if (existant) {
    const deja = interetsExistants(existant.metadata).find(
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

  const declaration: InteretEnregistre = {
    submission_id: contexte.submissionId,
    interet: contexte.interet,
    ...(contexte.entreprise?.trim() ? { entreprise: contexte.entreprise.trim() } : {}),
    ouvert_appel: contexte.ouvertAppel,
    source: contexte.source,
    page_origine: contexte.pageOrigine,
    lang: contexte.lang,
    attribution: contexte.attribution,
    declare_le: new Date().toISOString(),
  };

  const metadata = {
    ...(existant?.metadata ?? {}),
    interets_declares: [...interetsExistants(existant?.metadata ?? null), declaration],
  };

  const champsCommuns = {
    preferred_language: contexte.lang,
    metadata,
    updated_at: new Date().toISOString(),
  };

  const prospects = existant
    ? await requeteSupabase<LigneProspect>({
        methode: "PATCH",
        chemin: `prospects?id=eq.${existant.id}`,
        corps: {
          ...champsCommuns,
          ...(contexte.entreprise?.trim() ? { entreprise: contexte.entreprise.trim() } : {}),
        },
      })
    : await requeteSupabase<LigneProspect>({
        methode: "POST",
        chemin: "prospects",
        corps: [
          {
            ...champsCommuns,
            email: contexte.email.trim(),
            workspace_id: workspaceId,
            slug: slugCible,
            nom: contexte.email.trim(),
            ...(contexte.entreprise?.trim() ? { entreprise: contexte.entreprise.trim() } : {}),
            source: contexte.source,
            channel: "site",
            campaign: contexte.attribution["utm_campaign"] ?? null,
          },
        ],
      });

  const prospect = prospects[0];
  if (!prospect?.id) {
    throw new Error("prospect non retourné par la base : persistance non confirmée");
  }

  const note = [
    `Intérêt déclaré · ${contexte.interet}`,
    contexte.entreprise?.trim() ? `entreprise ${contexte.entreprise.trim()}` : "sans entreprise",
    contexte.ouvertAppel ? "ouvert à un appel" : "pas d'appel demandé",
    `source ${contexte.source}`,
    `page ${contexte.pageOrigine}`,
    `soumission ${contexte.submissionId}`,
  ].join(" · ");

  const touchpoints = await requeteSupabase<LigneTouchpoint>({
    methode: "POST",
    chemin: "touchpoints",
    corps: [
      {
        workspace_id: workspaceId,
        prospect_id: prospect.id,
        kind: "interet_declare",
        source_channel: `site:interet:${contexte.interet}`,
        note,
      },
    ],
  });

  const touchpoint = touchpoints[0];
  if (!touchpoint?.id) {
    throw new Error("touchpoint non retourné par la base : persistance non confirmée");
  }

  await poserCarteSuperApp(contexte, prospect.id, workspaceId);

  return {
    prospectId: prospect.id,
    touchpointId: touchpoint.id,
    dejaEnregistre: false,
    workspaceId,
  };
}

/** La carte dans la super app — même canal `telegram_queue`, même règle :
    elle ne peut pas coûter le lead, les adresses de test ne réveillent personne. */
async function poserCarteSuperApp(
  contexte: ContexteInteret,
  prospectId: string,
  workspaceId: string,
): Promise<void> {
  if (estAdresseDeTest(contexte.email)) return;

  const texte = [
    `Intérêt déclaré · ${contexte.interet}`,
    contexte.email,
    contexte.entreprise?.trim() ? `Entreprise : ${contexte.entreprise.trim()}` : "Entreprise non donnée",
    contexte.ouvertAppel ? "OUVERT À UN APPEL d'examination" : "Pas d'appel demandé",
    contexte.attribution["utm_campaign"]
      ? `Campagne ${contexte.attribution["utm_campaign"]}`
      : `Source ${contexte.source}`,
    "",
    "Prochaine action : esquisser le mini-prototype et l'envoyer (promesse du funnel).",
  ].join("\n");

  try {
    await requeteSupabase({
      methode: "POST",
      chemin: "telegram_queue",
      prefer: "resolution=ignore-duplicates",
      corps: [
        {
          workspace_id: workspaceId,
          prospect_id: prospectId,
          card_type: "interet_declare",
          category: "prospection",
          card_text: texte,
          status: "pending",
          priority: 1,
          dedup_key: `interet:${contexte.submissionId}`,
          metadata: {
            submission_id: contexte.submissionId,
            interet: contexte.interet,
            entreprise: contexte.entreprise ?? null,
            ouvert_appel: contexte.ouvertAppel,
            source: contexte.source,
            attribution: contexte.attribution,
          },
        },
      ],
    });
  } catch (e) {
    console.error("[interets] carte super app non posée", {
      submissionId: contexte.submissionId,
      message: e instanceof Error ? e.message : String(e),
    });
  }
}
