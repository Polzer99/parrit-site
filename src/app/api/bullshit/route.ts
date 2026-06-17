import type { NextRequest } from "next/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// Detecteur de Bullshit IA. Modele pas cher (deepseek/OpenRouter, REGLES-DOR §7) :
// l'intelligence est dans le prompt (grille 4 axes voix Paul). Le SCORE et les 3 garde-fous
// sont calcules EN CODE (deterministe) a partir des 4 axes notes par le modele : la faiblesse
// arithmetique d'un modele cheap ne decide jamais du verdict.
const MODEL = process.env.BULLSHIT_MODEL || "deepseek/deepseek-v3.2";

const AXIS_KEYS = [
  "preuve_execution",
  "delta_information",
  "comment_vs_promesse",
  "tromperie_vs_honnetete",
] as const;
type AxisKey = (typeof AXIS_KEYS)[number];

const WEIGHTS: Record<AxisKey, number> = {
  preuve_execution: 0.3,
  delta_information: 0.26,
  comment_vs_promesse: 0.24,
  tromperie_vs_honnetete: 0.2,
};

const SYSTEM = `Tu es l'oeil de Paul Larmaraud, fondateur-operateur de Parrit.ai. Tu demasques le BULLSHIT du contenu sur l'IA. Doctrine : l'autorite se DEMONTRE par la maitrise du reel, jamais ne se decrete. Enargeia (faits : volumes, durees, process brises, outils nommes, le COMMENT) PAS pathos. Question maitresse : cette personne a-t-elle VRAIMENT FAIT le truc, ou elle en parle de loin ? Et : qu'est-ce que j'apprends qu'elle a observe elle-meme ? ~90% du contenu IA du marche parle a 30 000 pieds, sans trace d'execution : c'est ca le bullshit.

Tu notes 4 AXES. ATTENTION AU SENS, c'est crucial : pour CHAQUE axe, 0 = irreprochable (le mieux), 100 = le PIRE (pur bullshit sur cet axe). Un contenu creux et generique doit avoir des axes HAUTS (proches de 100), jamais bas.

1. absence_preuve (poids 0.30, dominant) — mesure l'ABSENCE de preuve d'execution. 100 = AUCUNE operation reelle montree : il parle a 30 000 pieds, zero artefact, aucun outil nomme, aucun chiffre de prod, aucune etape concrete. PIEGE A EVITER : des verbes vagues comme "j'accompagne la transformation digitale", "j'aide les entreprises", "je forme" ne sont PAS des preuves d'execution, c'est du vent -> 90-100. 0 = UNIQUEMENT si recit first-person dense de ce qu'il a FAIT, avec artefacts (capture, repo, log, CSV), outils precisement nommes, etapes datees.
2. delta_information (poids 0.26) — 100 = on n'apprend RIEN : tautologie, portes ouvertes, idee recue recopiee ("l'IA ne remplace pas mais augmente", "il faut se former", "demain sera disruptif"). 0 = observation concrete, datee, non triviale qu'on ignorait.
3. comment_vs_promesse (poids 0.24) — 100 = promesse magique / resultat sans le COMMENT ("l'IA va tout changer", "x10", "+300%"). 0 = mecanique reproductible montree (comment, dans quel ordre, avec quoi).
4. tromperie_vs_honnetete (poids 0.20) — 100 = marqueurs qui SIMULENT une expertise absente, ACCUMULES (>= 2 familles) : pathos ("bluffe", "dingue", "game-changer", "fou"), autorite decretee, chiffres inventes, humilite performative + faux secrets, hook ou CTA mendiant, name-drop comme preuve, trajectoire triomphale SANS aucune friction. 0 = sincere meme plat, OU recit avec la friction reelle (ce qui a casse, recommence, contourne). Un emoji isole ou un petit hook leger sur un texte par ailleurs dense en faits NE FAIT PAS monter cet axe.

Le score global est calcule par le systeme a partir de tes 4 axes. Ne le calcule pas toi-meme : note juste les 4 axes avec justesse et dans le BON SENS.

Le verdict = VOIX de Paul : clinique, direct, sans pathos, sans complaisance, sans CTA, phrases courtes et seches, ZERO emoji, pas de tiret cadratin. Pointe ce qui MANQUE comme preuve (aucun outil nomme, zero artefact, aucune friction, il en parle de loin) ou ce qui PROUVE l'operation. Pour le vide-honnete : il ne ment pas, mais on n'apprend rien.

EXEMPLES (note bien le SENS des axes) :
Contenu : "L'IA va tout changer, ceux qui ne s'adaptent pas disparaitront. J'accompagne la transformation digitale avec des solutions revolutionnaires. Qui est pret ?"
-> {"axes":{"absence_preuve":96,"delta_information":93,"comment_vs_promesse":97,"tromperie_vs_honnetete":85},"verdict":"Promesse de la lune, zero comment. Aucun outil nomme, aucun artefact. On n'apprend rien.","flags":["aucun outil nomme","promesse sans le comment","idee recue","CTA mendiant"],"substance":[]}
Contenu : "J'ai branche un agent sur la boite support. 1er essai rate sur les remboursements, j'ai du lui donner le CSV des commandes et ecrire 40 regles metier. Il traite 120 mails/jour, j'escalade les litiges a la main. Trois soirees."
-> {"axes":{"absence_preuve":10,"delta_information":20,"comment_vs_promesse":12,"tromperie_vs_honnetete":8},"verdict":"La il a mis les mains dedans. Echec initial, CSV, regles metier, 120 mails/jour, escalade manuelle, trois soirees. La friction prouve l'operation.","flags":[],"substance":["CSV des commandes","40 regles metier","120 mails/jour","escalade manuelle"]}

Reponds UNIQUEMENT en JSON valide, meme forme que les exemples, sans aucun texte autour.`;

function clampN(n: number, lo: number, hi: number): number {
  return Math.max(lo, Math.min(hi, n));
}

function int0to100(v: unknown): number {
  const n = parseInt(String(v), 10);
  return Number.isFinite(n) ? clampN(n, 0, 100) : 50;
}

function bandFor(score: number): string {
  if (score <= 30) return "Substance opérée";
  if (score <= 55) return "Vide-honnête";
  if (score <= 79) return "Bullshit caractérisé";
  return "Bullshit toxique";
}

// Score deterministe = somme ponderee des 4 axes, PUIS 3 garde-fous dans cet ordre exact.
function computeScore(ax: Record<AxisKey, number>): {
  score: number;
  raw: number;
  guard: string | null;
} {
  const raw = Math.round(
    WEIGHTS.preuve_execution * ax.preuve_execution +
      WEIGHTS.delta_information * ax.delta_information +
      WEIGHTS.comment_vs_promesse * ax.comment_vs_promesse +
      WEIGHTS.tromperie_vs_honnetete * ax.tromperie_vs_honnetete,
  );
  let score = raw;
  let guard: string | null = null;

  // (1) Anti-faux-positif : un vrai operateur (preuve forte + apporte du neuf) est plafonne
  //     a 20, meme avec un emoji ou un petit hook.
  if (ax.preuve_execution <= 20 && ax.delta_information <= 25) {
    score = Math.min(score, 20);
    guard = "substance";
    // (2) Vide-mais-honnete : sincere (pas de tromperie) mais aucune preuve d'usage -> milieu ~45.
  } else if (ax.tromperie_vs_honnetete <= 25 && ax.preuve_execution >= 50) {
    score = clampN(score, 38, 52);
    guard = "vide-honnete";
  }

  // (3) Bullshit toxique : un 80+ exige le cumul d'au moins 3 axes hauts.
  if (score >= 80) {
    const high = AXIS_KEYS.filter((k) => ax[k] >= 65).length;
    if (high < 3) {
      score = 79;
      guard = guard ?? "bullshit-plein-cap";
    }
  }

  return { score, raw, guard };
}

export async function POST(req: NextRequest) {
  const key = process.env.OPENROUTER_API_KEY;
  if (!key) {
    return Response.json({ error: "Config serveur manquante" }, { status: 500 });
  }

  let text = "";
  try {
    const body = await req.json();
    text = body?.text ? String(body.text).trim() : "";
  } catch {
    text = "";
  }
  if (text.length < 15) {
    return Response.json({ error: "Collez un peu plus de texte." }, { status: 400 });
  }
  if (text.length > 6000) text = text.slice(0, 6000);

  try {
    const r = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${key}`,
        "Content-Type": "application/json",
        "HTTP-Referer": "https://parrit.ai",
        "X-Title": "Parrit Bullshit Detector",
      },
      body: JSON.stringify({
        model: MODEL,
        messages: [
          { role: "system", content: SYSTEM },
          {
            role: "user",
            content: `Contenu a passer au crible :\n\n"""\n${text}\n"""`,
          },
        ],
        temperature: 0.2,
        max_tokens: 800,
        response_format: { type: "json_object" },
      }),
    });
    if (!r.ok) {
      const t = await r.text();
      return Response.json(
        { error: `Modèle indisponible (${r.status})`, detail: t.slice(0, 200) },
        { status: 502 },
      );
    }
    const data = await r.json();
    const rawContent: string = data?.choices?.[0]?.message?.content || "{}";
    const m = rawContent.match(/\{[\s\S]*\}/);
    const parsed = JSON.parse(m ? m[0] : rawContent);
    const axRaw = parsed.axes || {};
    const ax: Record<AxisKey, number> = {
      // le modele note l'axe sous le nom "absence_preuve" (sens non inversable) ;
      // on le stocke en interne sous preuve_execution (poids, garde-fous, label UI).
      preuve_execution: int0to100(
        axRaw.absence_preuve ?? axRaw.preuve_execution,
      ),
      delta_information: int0to100(axRaw.delta_information),
      comment_vs_promesse: int0to100(axRaw.comment_vs_promesse),
      tromperie_vs_honnetete: int0to100(axRaw.tromperie_vs_honnetete),
    };
    const { score, guard } = computeScore(ax);

    return Response.json({
      score,
      band: bandFor(score),
      verdict: typeof parsed.verdict === "string" ? parsed.verdict : "",
      axes: AXIS_KEYS.map((k) => ({ key: k, score: ax[k], weight: WEIGHTS[k] })),
      flags: Array.isArray(parsed.flags) ? parsed.flags.slice(0, 12) : [],
      substance: Array.isArray(parsed.substance)
        ? parsed.substance.slice(0, 8)
        : [],
      guard,
    });
  } catch (e) {
    return Response.json(
      { error: "Erreur d'analyse", detail: String(e).slice(0, 150) },
      { status: 500 },
    );
  }
}
