import type { NextRequest } from "next/server";

import { calculerLignesCockpit } from "@/lib/server/interet";
import { persistanceDisponible } from "@/lib/server/supabase";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/**
 * LA PROJECTION VERS LE COCKPIT — en LECTURE seule.
 *
 * Le Google Sheet reste le cockpit. Cette route ne l'écrit pas : elle expose la
 * projection calculée, et c'est le bras qui écrit — n8n, qui détient déjà les
 * accès du classeur — qui vient la chercher.
 *
 * Ce sens est délibéré. Écrire depuis ici demanderait d'installer un compte de
 * service Google sur le site public, alors que le droit d'écriture existe déjà
 * ailleurs. On ajoute une lecture, pas un second détenteur de secret.
 *
 * Rien n'est envoyé, rien n'est modifié : aucun message de nurturing ne part de
 * cette route, conformément au périmètre.
 */

/**
 * Un jeton partagé protège la route : la projection contient des adresses et
 * des intentions commerciales, elle n'a rien à faire en accès libre. Sans jeton
 * configuré, la route refuse de répondre plutôt que de s'ouvrir.
 */
function autorise(req: NextRequest): boolean {
  const attendu = process.env.PARRIT_PROJECTION_TOKEN;
  if (!attendu) return false;
  const fourni =
    req.headers.get("authorization")?.replace(/^Bearer\s+/i, "") ??
    req.nextUrl.searchParams.get("token") ??
    "";
  return fourni.length > 0 && fourni === attendu;
}

export async function GET(req: NextRequest) {
  if (!autorise(req)) {
    return Response.json({ ok: false, error: "non autorisé" }, { status: 401 });
  }

  if (!persistanceDisponible()) {
    return Response.json(
      { ok: false, error: "configuration Supabase absente" },
      { status: 503 },
    );
  }

  try {
    /* L'instant est posé UNE fois et traverse tout le calcul : deux lignes de la
       même exécution ne peuvent pas tomber de part et d'autre d'un minuit. */
    const maintenant = new Date().toISOString();
    const calculees = await calculerLignesCockpit(maintenant);

    return Response.json({
      ok: true,
      calcule_le: maintenant,
      lignes: calculees.map((c) => c.ligne),
      // Les variables de message, pour la session copie. Aucun texte rédigé.
      variables: calculees.map((c) => ({ email: c.ligne.email, ...c.variables })),
    });
  } catch (e) {
    const message = e instanceof Error ? e.message : String(e);
    console.error("[api/interet/projection]", message);
    return Response.json(
      { ok: false, error: "calcul impossible", detail: message.slice(0, 200) },
      { status: 502 },
    );
  }
}
