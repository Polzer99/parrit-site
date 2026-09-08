import { randomUUID } from "node:crypto";
import type { NextRequest } from "next/server";

import { enregistrerInteret, INTERETS, type Interet } from "@/lib/server/interets";
import { persistanceDisponible } from "@/lib/server/supabase";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/**
 * REGISTER YOUR INTEREST — capture du funnel prototype.
 *
 * Mêmes garanties que /api/ressource : `submission_id` émis par le serveur, la
 * réponse `200` n'arrive qu'après confirmation de la base, renvoyer la même
 * soumission ne duplique rien. La notification passe uniquement par la carte
 * `telegram_queue` (orchestrateur, règle 17).
 */

type Corps = {
  email?: string;
  idee?: unknown;
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

  const interet = (corps.interet ?? "full-os").trim() as Interet;
  if (!INTERETS.includes(interet)) {
    return erreur("intérêt inconnu", 400);
  }

  if (!persistanceDisponible()) {
    return erreur("capture indisponible", 503, { raison: "configuration Supabase absente" });
  }

  const idee = typeof corps.idee === "string" && corps.idee.length <= 300
    ? corps.idee.trim() || undefined
    : undefined;

  const submissionId = corps.submissionId?.trim() || randomUUID();
  const lang = ["fr", "en"].includes(corps.lang ?? "") ? (corps.lang as string) : "en";
  const source = (corps.source ?? (corps.interet ? "site:register-interest" : "site:quick-capture")).trim();

  try {
    const resultat = await enregistrerInteret({
      submissionId,
      email,
      interet,
      entreprise: corps.entreprise,
      idee,
      ouvertAppel: Boolean(corps.ouvertAppel),
      source,
      pageOrigine: (corps.pageOrigine ?? "").trim(),
      lang,
      attribution: corps.attribution ?? {},
    });

    return Response.json({
      ok: true,
      submissionId,
      prospectId: resultat.prospectId,
      dejaEnregistre: resultat.dejaEnregistre,
      sketchUrl: `/sketch/${submissionId}`,
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
