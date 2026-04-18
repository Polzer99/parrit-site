import { NextRequest, NextResponse } from "next/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/**
 * POST /api/transcribe
 *
 * Proxy vers Groq Whisper large-v3-turbo. Le client envoie un blob audio
 * (webm/mp4/ogg) en multipart form-data sous la clé "file", on forward à Groq.
 *
 * Pattern copié de parrit-os/call-copilot — chunks 5s du MediaRecorder côté
 * client, transcription quasi-temps réel.
 */
export async function POST(request: NextRequest) {
  const GROQ_API_KEY = process.env.GROQ_API_KEY;
  if (!GROQ_API_KEY) {
    return NextResponse.json(
      { error: "GROQ_API_KEY not configured" },
      { status: 500 },
    );
  }

  try {
    const formData = await request.formData();
    const file = formData.get("file");
    if (!(file instanceof File)) {
      return NextResponse.json({ error: "No audio file provided" }, { status: 400 });
    }

    const language = (formData.get("language") as string | null) || undefined;

    const groqFormData = new FormData();
    groqFormData.append("file", file);
    groqFormData.append("model", "whisper-large-v3-turbo");
    if (language) groqFormData.append("language", language);
    groqFormData.append("response_format", "json");

    const resp = await fetch(
      "https://api.groq.com/openai/v1/audio/transcriptions",
      {
        method: "POST",
        headers: { Authorization: `Bearer ${GROQ_API_KEY}` },
        body: groqFormData,
      },
    );

    if (!resp.ok) {
      const errText = await resp.text();
      console.error("[Transcribe] Groq error:", resp.status, errText);
      return NextResponse.json(
        { error: `Groq ${resp.status}`, detail: errText.slice(0, 300) },
        { status: 502 },
      );
    }

    const data = await resp.json();
    return NextResponse.json({ text: (data.text || "").trim() });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    console.error("[Transcribe] Error:", message);
    return NextResponse.json(
      { error: "Transcription failed", detail: message },
      { status: 500 },
    );
  }
}
