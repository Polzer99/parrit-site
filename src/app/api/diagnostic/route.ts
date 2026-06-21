import type { NextRequest } from "next/server";
import { SEGMENTS, type SegmentId } from "@/lib/diagnostic/personas";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// Diagnostic conversationnel. Meme patron que le detecteur de bullshit : modele cheap (deepseek/OpenRouter),
// l'intelligence est dans le prompt (ancre TRUTH + le pack du segment), les GARDE-FOUS sont en CODE
// (LE TAMIS deterministe : jamais de prix, jamais de nom client, pas de tiret cadratin).
const MODEL = process.env.DIAGNOSTIC_MODEL || "deepseek/deepseek-v3.2";
const MAX_TURNS = 14;
const MAX_CHARS = 1600;

// --- garde-fous deterministes (post-LLM) ---
const BANNED_CLIENTS = [
  "insead", "lvmh", "kiabi", "catho", "decathlon", "forvia", "naos", "joone",
  "clevery", "mr couteau", "babybel", "bel group", "efi energy",
];
function tamis(input: unknown): string {
  let s = typeof input === "string" ? input : "";
  s = s.replace(/[—–]/g, ", ");                                  // tirets cadratin/demi-cadratin
  s = s.replace(/€\s?\d[\d .,]*/gi, "[à cadrer ensemble]");                // €1000
  s = s.replace(/\d[\d .,]*\s?(?:k€|m€|k\s?euros?|keur|€|eur|euros?)/gi, "[à cadrer ensemble]"); // 1000€, 5 k€
  for (const c of BANNED_CLIENTS) s = s.replace(new RegExp(c, "gi"), "un client");
  return s.replace(/\s{2,}/g, " ").trim();
}
function tamisArr(a: unknown): string[] {
  return Array.isArray(a) ? a.map(tamis).filter(Boolean).slice(0, 6) : [];
}

function systemPrompt(segId: SegmentId): string {
  const p = SEGMENTS[segId] || SEGMENTS.neutre;
  const voix =
    p.voix === "executive"
      ? "Voix executive (grand groupe / C-level) : posee, precise, parle d'adoption a l'echelle, de gouvernance, d'agnosticisme (Vertex/Bedrock/Azure/souverain), la donnee reste chez eux."
      : p.voix === "coup-de-poing"
        ? "Voix Operating Partner directe (dirigeant PME) : concrete, anti-jargon, on parle de ce qui fait perdre du temps et de ce qui rapporte."
        : "Voix neutre, sobre, professionnelle.";
  return `Tu es Parrit, AI Operating Partner. Tu fais un DIAGNOSTIC conversationnel a un dirigeant, dans la voix de Paul Larmaraud.

POSITIONNEMENT : Parrit construit ET opere des outils sur-mesure avec des agents IA. Deux fronts de poids egal : (1) back-office automatise, (2) business genere. On livre la chose qui tourne, pas un deck. Paul prototype, Yukun met en production. Le site est la vitrine vivante (il fait tourner des agents).

CIBLE DETECTEE : ${p.label}. ${voix}
Cadrage a tenir : ${p.framing}
Front 1 : ${p.front1}
Front 2 : ${p.front2}
Cas reel a evoquer (ANONYMISE, jamais de nom) : ${p.exampleHint}.

DOCTRINE (LE TAMIS, imperatif) : sobre, Enargeia (faits, le COMMENT), ZERO pathos, zero hook, zero emoji, pas de tiret cadratin, phrases courtes. INTERDIT ABSOLU : citer un PRIX/montant, citer un NOM de client. Tu demontres, tu ne decretes pas.

DEROULE : pose AU PLUS 2 questions courtes et nettes pour saisir le cas reel (la friction, les volumes, le canal). Des que tu as de quoi, tu LIVRES le diagnostic (done=true) : deux fronts/leviers concrets en mini-schemas de flux (3 etapes chacun : entree -> agent -> action), la forme livree, et le prochain pas. Ne traine pas, n'en fais pas trop.

Reponds UNIQUEMENT en JSON valide :
{"reply":"<le prochain message, voix Parrit, 1-3 phrases courtes>","done":<true si tu livres le diagnostic, sinon false>,"persona":"<le profil deduit, court>","diagnostic": <null tant que done=false, sinon {"framing":"<titre court ex: Deux fronts.>","front1":{"label":"<court>","nodes":["<entree, 2-3 mots>","速 Agent","<action, 2-3 mots>"]},"front2":{"label":"<court>","nodes":["<entree>","速 Agent","<action>"]},"pills":["<forme livree, ex: agent silencieux>","<...>"],"offer":"<l'offre Parrit + le cas reel anonymise en 1 phrase>","cta":"${p.cta}"}>}`;
}

export async function POST(req: NextRequest) {
  const key = process.env.OPENROUTER_API_KEY;
  if (!key) return Response.json({ error: "Config serveur manquante" }, { status: 500 });

  let body: { messages?: Array<{ role: string; content: string }>; segment?: string };
  try {
    body = await req.json();
  } catch {
    return Response.json({ error: "JSON invalide" }, { status: 400 });
  }
  const segId = (body.segment && body.segment in SEGMENTS ? body.segment : "neutre") as SegmentId;
  const msgs = Array.isArray(body.messages) ? body.messages.slice(-MAX_TURNS) : [];
  const clean = msgs
    .filter((m) => m && (m.role === "user" || m.role === "assistant") && typeof m.content === "string")
    .map((m) => ({ role: m.role, content: m.content.slice(0, MAX_CHARS) }));
  if (!clean.length || clean[clean.length - 1].role !== "user") {
    return Response.json({ error: "Message utilisateur attendu." }, { status: 400 });
  }

  try {
    const r = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${key}`,
        "Content-Type": "application/json",
        "HTTP-Referer": "https://parrit.ai",
        "X-Title": "Parrit Diagnostic",
      },
      body: JSON.stringify({
        model: MODEL,
        messages: [{ role: "system", content: systemPrompt(segId) }, ...clean],
        temperature: 0.35,
        max_tokens: 900,
        response_format: { type: "json_object" },
      }),
    });
    if (!r.ok) {
      const t = await r.text();
      return Response.json({ error: `Modèle indisponible (${r.status})`, detail: t.slice(0, 160) }, { status: 502 });
    }
    const data = await r.json();
    const raw: string = data?.choices?.[0]?.message?.content || "{}";
    const m = raw.match(/\{[\s\S]*\}/);
    const parsed = JSON.parse(m ? m[0] : raw);

    const done = parsed.done === true && parsed.diagnostic && typeof parsed.diagnostic === "object";
    let diagnostic = null;
    if (done) {
      const d = parsed.diagnostic;
      const front = (f: { label?: unknown; nodes?: unknown }) => ({
        label: tamis(f?.label),
        nodes: (Array.isArray(f?.nodes) ? f.nodes : []).map(tamis).filter(Boolean).slice(0, 3),
      });
      diagnostic = {
        framing: tamis(d.framing) || "Deux fronts.",
        front1: front(d.front1 || {}),
        front2: front(d.front2 || {}),
        pills: tamisArr(d.pills),
        offer: tamis(d.offer),
        cta: tamis(d.cta) || (SEGMENTS[segId] || SEGMENTS.neutre).cta,
      };
    }

    return Response.json({
      reply: tamis(parsed.reply),
      done: !!done,
      persona: tamis(parsed.persona),
      diagnostic,
    });
  } catch (e) {
    return Response.json({ error: "Erreur d'analyse", detail: String(e).slice(0, 150) }, { status: 500 });
  }
}
