import type { NextRequest } from "next/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type ChatRole = "user" | "assistant";

interface ChatMessage {
  role: ChatRole;
  content: string;
}

interface ChatRequestBody {
  messages: ChatMessage[];
  lang?: "fr" | "en" | "pt-BR";
}

const GROQ_URL = "https://api.groq.com/openai/v1/chat/completions";
const DEFAULT_MODEL = "llama-3.3-70b-versatile";

function buildSystemPrompt(lang: string): string {
  const languageHint =
    lang === "en"
      ? "Respond primarily in English. Match the user's language if they switch."
      : lang === "pt-BR"
      ? "Responda principalmente em português do Brasil. Acompanhe o idioma do usuário se ele mudar."
      : "Réponds principalement en français. Adapte-toi à la langue de l'utilisateur s'il change.";

  return `Tu es l'assistant conversationnel de Parrit.ai. Parrit = une équipe de fondateurs + un réseau de 20+ experts techniques et métier, basée à Paris et São Paulo.

# Positionnement
On construit les outils d'IA et d'automatisation qui font tourner votre business sans vous. Pas de conseil, pas de slides — que du code en prod. Clients cibles : fondateurs non-tech, agences, ESN, e-commerce, dirigeants tech.

# Voix et style
- "On" / "nous" / "vous" (vouvoiement par défaut). Direct, court, pas de jargon IA, pas de "transformer en force", pas de "je me permets", pas de "n'hésitez pas".
- Jamais "je" tout seul (tu représentes l'équipe). Jamais "Paul tout seul" non plus — on est plusieurs.
- Phrases courtes. Ton d'entrepreneur qui code. Jamais corporate.
- Si l'utilisateur pose une question large, on recadre sur ce qu'on peut construire.
- On ne balance JAMAIS de prix dans la conversation. Si on te demande, tu réponds : "ça dépend du scope, on vous prépare une propo — laissez-nous votre email et on revient vers vous."
- Pas d'emoji, sauf exception ponctuelle.

# Offres (sans prix)
1. **Audit & setup Claude Code (1 mois)** — pour fondateurs, agences, ESN, dirigeants qui veulent Claude Code comme copilote business. Semaine 1 : audit + 1er workflow. Semaine 2-3 : workflows + formation. Semaine 4 : consolidation + support.
2. **Projet IA / automatisation sur mesure** — build dédié (CRM, veille, facturation, outbound, évaluation SAP, agent Telegram, etc.). Scope par client.
3. **Suivi mensuel (retainer)** — 1 à 2 workflows / mois + support async. Après un projet initial.

# ICP (à scorer silencieusement, ne pas réciter)
Cibles :
- Têtes de réseau franchises 10-200 PDV
- Agences acquisition 5-50p
- ESN 20-500p
- E-commerce 500K-10M€
- PME industrielles 10-250p
- ETI 250-3000p

À filtrer (décline poliment, mais qualifie pas plus loin) : consultants solo, startups digital early-stage, concurrents, groupes 5000+.

# Cas anonymes à mobiliser en exemple quand ça fait sens
- "Un cabinet d'avocats entertainment : on a automatisé la veille juridique. Email digest lundi 7h30 avec 5 recherches Perplexity. Livré en 8 jours."
- "Une ESN 50p veut interroger son ERP (BoondManager) en langage naturel. On a prototypé l'API en 5 jours."
- "Un groupe de restauration franchisé : on rotationne 100+ prospects qualifiés par jour sur Telegram avec veille auto et scoring ICP."
- "Un fonds d'audit SAP brésilien : on construit l'outil d'évaluation adoption SAP pour du CAC40 — 200 users, 2h perdues par jour, proto en 3 semaines."

Cite ces cas SANS nommer le client. "Un cabinet", "une ESN 50p", "un groupe", "un fonds brésilien".

# Flow de la conversation
- Tour 1-2 : comprendre le contexte. Pose 2 questions concrètes max par message (taille de boîte, outil actuel, vraie douleur, deadline, budget range si besoin).
- Tour 3-4 : reformule le besoin en 1 phrase, accroche avec 1 cas anonyme pertinent, propose l'offre qui fit (audit Claude Code / projet custom / retainer).
- Tour 5 max : demande "votre email et votre prénom, on vous prépare une propo". Si l'utilisateur est clairement hors ICP, reste poli, dis que ce n'est pas le cœur de cible, mais propose de laisser son email quand même pour être recontacté si une offre plus adaptée émerge.
- Si l'utilisateur demande à parler à quelqu'un directement : super, email + prénom suffisent, l'équipe rappelle.

# Règle absolue
- Jamais de prix, jamais de nom de client réel, jamais de "je ne suis qu'une IA". Tu es l'assistant de Parrit.
- Si on te demande "t'es un chatbot ?" — "Oui, je cadre le besoin avant que l'équipe Parrit prenne le relais."
- ${languageHint}
`;
}

export async function POST(req: NextRequest) {
  const apiKey = process.env.GROQ_API_KEY;
  if (!apiKey) {
    return new Response(
      JSON.stringify({ error: "GROQ_API_KEY not set" }),
      { status: 500, headers: { "Content-Type": "application/json" } },
    );
  }
  const model = process.env.GROQ_CHAT_MODEL || DEFAULT_MODEL;

  let body: ChatRequestBody;
  try {
    body = (await req.json()) as ChatRequestBody;
  } catch {
    return new Response(JSON.stringify({ error: "Invalid JSON" }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }

  const { messages, lang } = body;
  if (!Array.isArray(messages) || messages.length === 0) {
    return new Response(
      JSON.stringify({ error: "messages[] required" }),
      { status: 400, headers: { "Content-Type": "application/json" } },
    );
  }

  const cleanedMessages = messages
    .filter(
      (m) =>
        m &&
        (m.role === "user" || m.role === "assistant") &&
        typeof m.content === "string" &&
        m.content.trim().length > 0,
    )
    .map((m) => ({ role: m.role, content: m.content.trim() }));

  if (cleanedMessages.length === 0) {
    return new Response(
      JSON.stringify({ error: "no valid messages" }),
      { status: 400, headers: { "Content-Type": "application/json" } },
    );
  }

  const groqPayload = {
    model,
    stream: true,
    max_tokens: 1024,
    temperature: 0.6,
    messages: [
      { role: "system", content: buildSystemPrompt(lang || "fr") },
      ...cleanedMessages,
    ],
  };

  const upstream = await fetch(GROQ_URL, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(groqPayload),
  });

  if (!upstream.ok || !upstream.body) {
    const text = await upstream.text().catch(() => "");
    return new Response(
      JSON.stringify({ error: `Groq ${upstream.status}`, detail: text.slice(0, 400) }),
      { status: 502, headers: { "Content-Type": "application/json" } },
    );
  }

  const encoder = new TextEncoder();
  const decoder = new TextDecoder();

  const stream = new ReadableStream({
    async start(controller) {
      const reader = upstream.body!.getReader();
      let buffer = "";
      try {
        while (true) {
          const { value, done } = await reader.read();
          if (done) break;
          buffer += decoder.decode(value, { stream: true });

          // Parse OpenAI-style SSE events separated by blank lines
          const parts = buffer.split(/\r?\n\r?\n/);
          buffer = parts.pop() || "";

          for (const part of parts) {
            const lines = part.split(/\r?\n/);
            for (const raw of lines) {
              const line = raw.trim();
              if (!line.startsWith("data:")) continue;
              const data = line.slice(5).trim();
              if (!data || data === "[DONE]") continue;
              try {
                const json = JSON.parse(data);
                const delta = json.choices?.[0]?.delta?.content;
                if (typeof delta === "string" && delta.length > 0) {
                  const payload = JSON.stringify({ type: "delta", text: delta });
                  controller.enqueue(encoder.encode(`data: ${payload}\n\n`));
                }
              } catch {
                // ignore keepalive / OpenRouter "comment" pings
              }
            }
          }
        }
        controller.enqueue(encoder.encode(`data: ${JSON.stringify({ type: "done" })}\n\n`));
        controller.close();
      } catch (err) {
        const message = err instanceof Error ? err.message : "Unknown stream error";
        controller.enqueue(
          encoder.encode(`data: ${JSON.stringify({ type: "error", message })}\n\n`),
        );
        controller.close();
      }
    },
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "text/event-stream; charset=utf-8",
      "Cache-Control": "no-cache, no-transform",
      Connection: "keep-alive",
    },
  });
}
