import type { NextRequest } from "next/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const ALLOWED_LANGS = new Set(["fr", "en", "pt-BR", "zh-CN"]);
const MAX_FIELD = 240;

function clean(value: unknown, max = MAX_FIELD): string {
  return typeof value === "string" ? value.trim().slice(0, max) : "";
}

function validEmail(value: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

export async function POST(req: NextRequest) {
  const url = process.env.SUPABASE_URL;
  const serviceRole = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !serviceRole) {
    return Response.json({ error: "Configuration serveur manquante" }, { status: 500 });
  }

  let body: Record<string, unknown>;
  try {
    body = await req.json();
  } catch {
    return Response.json({ error: "JSON invalide" }, { status: 400 });
  }

  const email = clean(body.email, 320).toLowerCase();
  const interestTag = clean(body.interest_tag || body.interestTag);
  const sourcePath = clean(body.source_path || body.sourcePath || req.headers.get("referer"));
  const lang = clean(body.lang);
  const consent = body.consent === true;

  if (!validEmail(email)) {
    return Response.json({ error: "Email invalide" }, { status: 400 });
  }
  if (!interestTag) {
    return Response.json({ error: "interest_tag manquant" }, { status: 400 });
  }
  if (!consent) {
    return Response.json({ error: "Consentement requis" }, { status: 400 });
  }

  const payload = {
    email,
    interest_tag: interestTag,
    source_path: sourcePath || "/",
    lang: ALLOWED_LANGS.has(lang) ? lang : "fr",
    consent,
    ts: new Date().toISOString(),
  };

  const res = await fetch(`${url.replace(/\/$/, "")}/rest/v1/email_leads`, {
    method: "POST",
    headers: {
      apikey: serviceRole,
      Authorization: `Bearer ${serviceRole}`,
      "Content-Type": "application/json",
      Prefer: "return=minimal",
    },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    const detail = await res.text();
    return Response.json(
      { error: "Insertion email_leads impossible", detail: detail.slice(0, 180) },
      { status: 502 },
    );
  }

  return Response.json({ ok: true });
}
