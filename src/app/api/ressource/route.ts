import { randomUUID } from "node:crypto";
import type { NextRequest } from "next/server";

import { enregistrerDemandeRessource, estAdresseDeTest } from "@/lib/server/leads";
import { persistanceDisponible } from "@/lib/server/supabase";
import { getRessource, urlExperience } from "@/lib/registry";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/**
 * CAPTURE D'UNE DEMANDE DE RESSOURCE.
 *
 * Le contrat que le front attendait (`FRONT-FORM-REQUIREMENTS.md`), et que
 * l'ancien chemin ne tenait pas : le navigateur appelait directement le webhook
 * n8n, qui répondait `200` **avant** d'avoir écrit quoi que ce soit. Un succès
 * ne prouvait rien, et les leads se perdaient sans bruit — la base ne compte
 * que trois inscriptions venues du site en quatre mois.
 *
 * Ici :
 *
 *   1. un `submission_id` est émis par le serveur, jamais par le client ;
 *   2. on n'écrit que dans des tables existantes, sans migration ;
 *   3. la réponse `200` n'arrive qu'APRÈS que la base a renvoyé les lignes ;
 *   4. un échec est explicite, avec le lien direct vers la ressource pour que
 *      la personne obtienne quand même ce qu'elle est venue chercher ;
 *   5. renvoyer la même soumission ne duplique rien.
 *
 * La notification (n8n, courriel) est faite APRÈS la persistance et **ne peut
 * pas** faire échouer la réponse : le lead est déjà en sécurité. Son échec est
 * signalé dans la réponse, il n'est pas caché.
 */

const WEBHOOK_LEAD = process.env.PARRIT_LEAD_WEBHOOK ?? "";

type CorpsDemande = {
  email?: string;
  nom?: string;
  ressourceSlug?: string;
  articleSlug?: string;
  lang?: string;
  pageOrigine?: string;
  source?: string;
  attribution?: Record<string, string>;
  reponses?: Record<string, string>;
  /** Fourni uniquement lors d'une reprise, pour rester idempotent. */
  submissionId?: string;
};

function emailValide(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email.trim());
}

function erreur(message: string, statut: number, extra: Record<string, unknown> = {}) {
  return Response.json({ ok: false, error: message, ...extra }, { status: statut });
}

export async function POST(req: NextRequest) {
  let corps: CorpsDemande;
  try {
    corps = (await req.json()) as CorpsDemande;
  } catch {
    return erreur("corps JSON invalide", 400);
  }

  const email = (corps.email ?? "").trim();
  if (!emailValide(email)) {
    return erreur("adresse e-mail requise", 400);
  }

  const ressource = getRessource((corps.ressourceSlug ?? "").trim());
  if (!ressource || !ressource.publiee) {
    // La ressource vient du REGISTRE, pas du client : on ne livre jamais une
    // URL fournie par l'appelant.
    return erreur("ressource inconnue", 400);
  }

  const lang = ["fr", "en", "pt-BR", "zh-CN"].includes(corps.lang ?? "")
    ? (corps.lang as string)
    : "fr";
  const ressourceUrl = urlExperience(ressource, lang);

  /* La configuration manque : on le dit, et on donne quand même l'accès. Une
     panne de capture ne prive personne de la ressource. */
  if (!persistanceDisponible()) {
    return erreur("capture indisponible", 503, {
      ressourceUrl,
      raison: "configuration Supabase absente",
    });
  }

  const submissionId = corps.submissionId?.trim() || randomUUID();

  try {
    const resultat = await enregistrerDemandeRessource({
      submissionId,
      email,
      nom: corps.nom,
      ressourceSlug: ressource.slug,
      ressourceUrl,
      articleSlug: corps.articleSlug?.trim() || undefined,
      source: (corps.source ?? `ressource-${ressource.slug}`).trim(),
      pageOrigine: (corps.pageOrigine ?? "").trim(),
      lang,
      attribution: corps.attribution ?? {},
      reponses: corps.reponses,
    });

    /* Notification : après la persistance, et sans pouvoir la contredire.
       Les adresses de test ne réveillent personne. */
    let notification: "envoyee" | "echouee" | "ignoree" = "ignoree";
    if (WEBHOOK_LEAD && !estAdresseDeTest(email) && !resultat.dejaEnregistre) {
      try {
        const reponse = await fetch(WEBHOOK_LEAD, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            source: `site:ressource:${ressource.slug}`,
            action: "ressource_demandee",
            submission_id: submissionId,
            prospect_id: resultat.prospectId,
            email,
            prenom: corps.nom ?? "",
            // Ce qui manquait au workflow pour aiguiller la livraison.
            ressource_slug: ressource.slug,
            ressource_titre: ressource.titre,
            ressource_url: `https://parrit.ai${ressourceUrl}`,
            livraison_verifiee: ressource.livraisonVerifiee,
            article_slug: corps.articleSlug ?? "",
            page: corps.pageOrigine ?? "",
            lang,
            timestamp: new Date().toISOString(),
            ...(corps.attribution ?? {}),
          }),
        });
        notification = reponse.ok ? "envoyee" : "echouee";
      } catch {
        notification = "echouee";
      }
    }

    return Response.json({
      ok: true,
      submissionId,
      prospectId: resultat.prospectId,
      touchpointId: resultat.touchpointId,
      dejaEnregistre: resultat.dejaEnregistre,
      /* L'accès, toujours à l'écran. `livraisonVerifiee: false` veut dire que
         le courriel ne joint rien : promettre un envoi serait mentir. */
      ressourceUrl,
      livraisonParMail: ressource.livraisonVerifiee,
      notification,
    });
  } catch (e) {
    const message = e instanceof Error ? e.message : String(e);
    console.error("[api/ressource] persistance échouée", { submissionId, message });
    return erreur("enregistrement impossible", 502, {
      submissionId,
      // La sortie de secours : la ressource reste accessible.
      ressourceUrl,
      detail: message.slice(0, 200),
    });
  }
}
