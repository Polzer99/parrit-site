import "server-only";

import { requeteSupabase } from "./supabase";

/**
 * PERSISTANCE D'UN LEAD DE RESSOURCE.
 *
 * AUCUN NOUVEAU SCHÉMA. La grammaire existe déjà en base et on l'utilise telle
 * quelle :
 *
 *   — `prospects`   : la personne. L'identité se résout par l'E-MAIL, pas par
 *                     le slug : les gens arrivent de LinkedIn, du cold email,
 *                     d'un podcast, bientôt de la vidéo, et beaucoup sont déjà
 *                     en base sous un slug qui n'a rien à voir avec le site. On
 *                     se rattache à leur fiche au lieu d'en créer une seconde ;
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
  slug?: string;
  email?: string | null;
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

  /* L'IDENTITÉ SE RÉSOUT PAR L'E-MAIL, PAS PAR LE SLUG.
     Les gens arrivent de partout : LinkedIn, cold email, podcast, bientôt la
     vidéo. Beaucoup sont DÉJÀ dans la base sous un slug qui n'a rien à voir
     avec le site. Chercher d'abord par slug créerait une seconde fiche pour la
     même personne — la base compte déjà 111 doublons d'e-mail sur 635 fiches,
     et on ne va pas en ajouter.

     On cherche donc l'e-mail en premier, insensible à la casse, et on se
     rattache à la fiche qui existe, d'où qu'elle vienne. Le slug `site-…` n'est
     créé que pour quelqu'un de réellement inconnu. */
  const emailNormalise = contexte.email.trim().toLowerCase();
  const parEmail = (
    await requeteSupabase<LigneProspect>({
      methode: "GET",
      chemin:
        `prospects?select=id,slug,email,metadata` +
        `&workspace_id=eq.${workspaceId}&email=ilike.${encodeURIComponent(contexte.email.trim())}&limit=5`,
    })
  ).filter(
    // `ilike` traite `_` et `%` comme des jokers : on revérifie l'égalité
    // stricte, sinon `paul_x@…` se rattacherait à la fiche de `paulax@…`.
    (p) => (p.email ?? "").trim().toLowerCase() === emailNormalise,
  );

  const parSlug = parEmail[0]
    ? []
    : await requeteSupabase<LigneProspect>({
        methode: "GET",
        chemin:
          `prospects?select=id,slug,metadata` +
          `&workspace_id=eq.${workspaceId}&slug=eq.${encodeURIComponent(slug)}&limit=1`,
      });

  const existant = parEmail[0] ?? parSlug[0];
  /* On ne renomme jamais une fiche existante : son slug est peut-être référencé
     ailleurs. On écrit sur le sien. */
  const slugCible = existant?.slug ?? slug;

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

  /* DEUX CHEMINS, ET C'EST VOULU.

     Un upsert PostgREST construit toujours un INSERT : omettre une colonne
     `NOT NULL` échoue en 23502 même quand la ligne existe. Mesuré en essayant
     de rattacher une fiche réelle du CRM.

     Donc : une fiche qui existe est MISE À JOUR sur son id, avec les seuls
     champs qu'on a le droit de toucher. Une fiche inconnue est créée. Aucune
     donnée du CRM n'est écrasée par une capture web. */
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
          /* L'e-mail n'est PAS réécrit : la fiche a déjà le sien, et une
             différence de casse n'est pas une correction. */
          // Un vrai nom peut enrichir une fiche ; une adresse e-mail, jamais.
          ...(contexte.nom?.trim() ? { nom: contexte.nom.trim() } : {}),
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
            // `nom` est NOT NULL : à défaut de nom saisi, l'e-mail fait foi.
            nom: contexte.nom?.trim() || contexte.email.trim(),
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

  await poserCarteSuperApp(contexte, prospect.id, workspaceId);

  return {
    prospectId: prospect.id,
    touchpointId: touchpoint.id,
    dejaEnregistre: false,
    workspaceId,
  };
}

/**
 * LA CARTE DANS LA SUPER APP.
 *
 * Le point d'entrée existait déjà : `telegram_queue` est la file de cartes, avec
 * son `dedup_key` — donc l'idempotence est portée par la table, pas par nous.
 * On ne construit pas un second canal, on écrit dans celui qui tourne.
 *
 * La carte ne peut PAS faire échouer la capture : le lead est déjà en base. Un
 * échec ici est journalisé, il n'est jamais avalé, mais il ne coûte pas le lead.
 * Les adresses de test ne réveillent personne.
 */
async function poserCarteSuperApp(
  contexte: ContexteLead,
  prospectId: string,
  workspaceId: string,
): Promise<void> {
  if (estAdresseDeTest(contexte.email)) return;

  const campagne = contexte.attribution["utm_campaign"];
  const texte = [
    `Ressource demandée · ${contexte.ressourceSlug}`,
    contexte.email,
    contexte.articleSlug
      ? `Arrivé par l'article « ${contexte.articleSlug} »`
      : "Arrivé directement sur la ressource",
    campagne ? `Campagne ${campagne}` : "Sans campagne",
    contexte.attribution["utm_source"]
      ? `Canal ${contexte.attribution["utm_source"]}`
      : `Source ${contexte.source}`,
    "",
    "La ressource lui a été remise à l'écran. Prochaine action : proposer les 15 minutes.",
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
          card_type: "ressource_demandee",
          category: "prospection",
          card_text: texte,
          status: "pending",
          priority: 1,
          // Une soumission, une carte. La table porte la déduplication.
          dedup_key: `ressource:${contexte.submissionId}`,
          metadata: {
            submission_id: contexte.submissionId,
            ressource_slug: contexte.ressourceSlug,
            ressource_url: contexte.ressourceUrl,
            article_slug: contexte.articleSlug ?? null,
            source: contexte.source,
            attribution: contexte.attribution,
          },
        },
      ],
    });
  } catch (e) {
    // Journalisé, jamais silencieux — et sans conséquence sur le lead persisté.
    console.error("[leads] carte super app non posée", {
      submissionId: contexte.submissionId,
      message: e instanceof Error ? e.message : String(e),
    });
  }
}
