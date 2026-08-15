import { randomUUID } from "node:crypto";
import type { NextRequest } from "next/server";

import { estAdresseDeTest } from "@/lib/server/leads";
import { enregistrerInteret, INTERETS, type Interet } from "@/lib/server/interets";
import { persistanceDisponible } from "@/lib/server/supabase";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/**
 * REGISTER YOUR INTEREST — capture du funnel prototype.
 *
 * Mêmes garanties que /api/ressource : `submission_id` émis par le serveur, la
 * réponse `200` n'arrive qu'après confirmation de la base, renvoyer la même
 * soumission ne duplique rien, la notification n8n vient APRÈS la persistance
 * et ne peut pas la contredire.
 */

const WEBHOOK_LEAD = process.env.PARRIT_LEAD_WEBHOOK ?? "";

type Corps = {
  email?: string;
  interet?: string;
  entreprise?: string;
  ouvertAppel?: boolean;
  lang?: string;
  pageOrigine?: string;
  source?: string;
  attribution?: Record<string, string>;
  submissionId?: string;
};

function emailValide(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email.trim());
}

function erreur(message: string, statut: number, extra: Record<string, unknown> = {}) {
  return Response.json({ ok: false, error: message, ...extra }, { status: statut });
}

export async function POST(req: NextRequest) {
  let corps: Corps;
  try {
    corps = (await req.json()) as Corps;
  } catch {
    return erreur("corps JSON invalide", 400);
  }

  const email = (corps.email ?? "").trim();
  if (!emailValide(email)) {
    return erreur("adresse e-mail requise", 400);
  }

  const interet = (corps.interet ?? "").trim() as Interet;
  if (!INTERETS.includes(interet)) {
    return erreur("intérêt inconnu", 400);
  }

  if (!persistanceDisponible()) {
    return erreur("capture indisponible", 503, { raison: "configuration Supabase absente" });
  }

  const submissionId = corps.submissionId?.trim() || randomUUID();
  const lang = ["fr", "en"].includes(corps.lang ?? "") ? (corps.lang as string) : "en";

  try {
    const resultat = await enregistrerInteret({
      submissionId,
      email,
      interet,
      entreprise: corps.entreprise,
      ouvertAppel: Boolean(corps.ouvertAppel),
      source: (corps.source ?? "site:register-interest").trim(),
      pageOrigine: (corps.pageOrigine ?? "").trim(),
      lang,
      attribution: corps.attribution ?? {},
    });

    let notification: "envoyee" | "echouee" | "ignoree" = "ignoree";
    if (WEBHOOK_LEAD && !estAdresseDeTest(email) && !resultat.dejaEnregistre) {
      try {
        const reponse = await fetch(WEBHOOK_LEAD, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            source: "site:register-interest",
            action: "interet_declare",
            submission_id: submissionId,
            prospect_id: resultat.prospectId,
            email,
            entreprise: corps.entreprise ?? "",
            interet,
            ouvert_appel: Boolean(corps.ouvertAppel),
            sketch_url: `https://parrit.ai/sketch/${submissionId}`,
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
      dejaEnregistre: resultat.dejaEnregistre,
      sketchUrl: `/sketch/${submissionId}`,
      notification,
    });
  } catch (e) {
    const message = e instanceof Error ? e.message : String(e);
    console.error("[api/interet] persistance échouée", { submissionId, message });
    return erreur("enregistrement impossible", 502, {
      submissionId,
      detail: message.slice(0, 200),
    });
  }
}
