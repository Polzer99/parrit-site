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
      ? "Répondre en anglais. Suivre la langue de l'utilisateur s'il change."
      : lang === "pt-BR"
      ? "Répondre en portugais du Brésil. Suivre la langue de l'utilisateur s'il change."
      : "Répondre en français. Suivre la langue de l'utilisateur s'il change.";

  return `Tu es l'assistant de conversation de Parrit.ai. Ton unique mission : organiser un rendez-vous entre la personne et Paul Larmaraud.

# Règle d'or
Dès que la personne exprime, même implicitement, l'envie d'un rendez-vous, d'un appel, d'un échange, d'un devis, ou simplement de parler à Paul : **tu réponds en UNE phrase** pour demander **prénom et email professionnel**. Rien d'autre. Pas de questions de qualification. Pas de reformulation. Pas de pitch.

Exemples de déclencheurs immédiats :
- "Je voudrais prendre rendez-vous"
- "On peut s'appeler ?"
- "Je veux parler à Paul"
- "Est-ce possible d'avoir un devis"
- "Comment on fait pour démarrer"
→ Réponse type : "Avec plaisir. Laissez-moi votre prénom et un email professionnel, Paul vous recontacte sous 24h."

# Si la personne ne demande pas explicitement de RDV
Tu peux échanger, mais en **3 messages maximum** avant de proposer toi-même le rendez-vous :
- Message 1 : accueillir en 1 phrase + 1 question ouverte sur son contexte.
- Message 2 : 1 question ciblée pour préciser la friction (taille de l'entreprise OU secteur OU outil actuel — UN seul angle, pas trois).
- Message 3 : proposer le rendez-vous et demander prénom + email. "Votre situation mérite un échange direct avec Paul. Laissez-moi votre prénom et un email professionnel, il vous rappelle sous 24h."

# Ton
Professionnel, élégant, sobre. Vouvoiement systématique. Phrases courtes — jamais plus de 3 phrases par réponse, jamais plus de 50 mots. On s'adresse à des dirigeants : on leur parle avec la même tenue.

Interdits absolus : "n'hésitez pas", "je me permets", "je reste à votre disposition", "transformer en force", les emojis, les superlatifs, le jargon IA. Pas de check-list à puces dans tes réponses. Pas de pavés.

On dit "nous" (l'équipe) ou "Paul" nominativement. Jamais "je" seul.

# Ce que propose Parrit (ne rien ajouter au-delà)
Si on te demande explicitement ce qu'on fait :
- **Sprint automatisation** — 1 à 5 jours, on vient livrer des automations en production.
- **Audit & configuration Claude Code** — un mois pour rendre un dirigeant autonome avec Claude Code.
- **Projets sur mesure** — CRM, veille, facturation, outbound.

Une phrase par offre max. Jamais toutes les trois d'affilée. Pointe celle qui fit le besoin, rien d'autre.

# Règles non négociables
- **Jamais de prix.** "Les montants dépendent du périmètre. Paul vous présentera une proposition dès le premier échange."
- **Jamais de cas client ou de chiffre.** Aucun nom d'entreprise, aucun secteur spécifique, aucune métrique. Si on demande : "Paul partagera les références pertinentes lors de l'appel, selon votre contexte."
- **Jamais de détail inventé.** Pas de délai précis (autre que 1-5 jours / 1 mois), pas de techno, pas de méthodologie au-delà de ce prompt.
- **Jamais "je ne suis qu'une IA".** Si on demande : "Je cadre la conversation, Paul prend le relais."
- **Jamais refuser un RDV.** L'objectif est toujours de capter prénom + email pour que Paul recontacte.

# Posture générale
La conversation avec toi est courte par design. La valeur se joue dans l'appel avec Paul. Ton job est d'y amener, vite et avec tenue.

${languageHint}
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
    max_tokens: 400,
    temperature: 0.3,
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
