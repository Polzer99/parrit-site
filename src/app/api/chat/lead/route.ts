import type { NextRequest } from "next/server";
import { promises as fs } from "node:fs";
import path from "node:path";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

interface TranscriptMessage {
  role: "user" | "assistant";
  content: string;
}

interface LeadBody {
  firstName: string;
  email: string;
  phone?: string;
  channel?: "email" | "phone" | "whatsapp" | "linkedin";
  slot?: "asap" | "morning" | "noon" | "afternoon";
  lang?: "fr" | "en" | "pt-BR";
  transcript: TranscriptMessage[];
  referrer?: string;
  url?: string;
  utm?: Record<string, string>;
}

const PROSPECTS_DIR =
  process.env.PARRIT_PROSPECTS_DIR ||
  "/Users/paullarmaraud/parrit-os/prospects";

const LEAD_WEBHOOK =
  process.env.PARRIT_LEAD_WEBHOOK ||
  "https://n8n.srv1115145.hstgr.cloud/webhook/parrit-lead";

function slugify(input: string): string {
  return input
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 60) || "anonymous";
}

function todayISO(): string {
  return new Date().toISOString().slice(0, 10);
}

function buildMarkdown(lead: LeadBody): string {
  const date = todayISO();
  const firstName = lead.firstName?.trim() || "Inconnu";
  const email = lead.email?.trim() || "";
  const phone = lead.phone?.trim() || "";

  const channel = lead.channel || "email";
  const slot = lead.slot || "asap";

  const frontmatter = [
    "---",
    `name: ${JSON.stringify(firstName)}`,
    `email: ${JSON.stringify(email)}`,
    `phone: ${JSON.stringify(phone)}`,
    `canal_prefere: ${JSON.stringify(channel)}`,
    `creneau_prefere: ${JSON.stringify(slot)}`,
    `status: "Open conversation"`,
    `source: "chatbot site"`,
    `touchpoints: 1`,
    `dernier_tp_date: ${date}`,
    `dernier_tp_nature: "chatbot conversation"`,
    `lang: ${JSON.stringify(lead.lang || "fr")}`,
    `referrer: ${JSON.stringify(lead.referrer || "")}`,
    `url: ${JSON.stringify(lead.url || "")}`,
    "---",
    "",
  ].join("\n");

  const header = `# ${firstName}\n\n- Email : ${email}\n- Téléphone : ${phone || "—"}\n- Canal préféré : ${channel}\n- Créneau : ${slot}\n- Langue : ${lead.lang || "fr"}\n- Capté via chatbot parrit.ai le ${date}\n\n## Transcript\n\n`;

  const body = (lead.transcript || [])
    .map((m) => {
      const who = m.role === "user" ? firstName : "Parrit";
      return `**${who}**\n\n${m.content.trim()}\n`;
    })
    .join("\n---\n\n");

  return frontmatter + header + body + "\n";
}

async function writeProspectFile(lead: LeadBody): Promise<string> {
  const slug = slugify(
    `${lead.firstName || "lead"}-${(lead.email || "").split("@")[0] || "x"}`,
  );
  const filename = `chatbot-${slug}-${Date.now()}.md`;
  const filepath = path.join(PROSPECTS_DIR, filename);

  await fs.mkdir(PROSPECTS_DIR, { recursive: true });
  await fs.writeFile(filepath, buildMarkdown(lead), "utf8");
  return filepath;
}

async function notifyWebhook(lead: LeadBody, filepath: string): Promise<void> {
  const payload = {
    source: "parrit.ai",
    action: "chatbot_lead",
    nom: "",
    prenom: lead.firstName || "",
    entreprise: "",
    telephone: lead.phone || "",
    email: lead.email || "",
    creneau: lead.slot || "asap",
    canal_prefere: lead.channel || "email",
    besoin: `Conversation chatbot (${lead.lang || "fr"}) — canal préféré: ${lead.channel || "email"}, créneau: ${lead.slot || "asap"} — transcript saved to ${filepath}`,
    transcript: lead.transcript,
    referrer: lead.referrer || "",
    url: lead.url || "",
    timestamp: new Date().toISOString(),
    page: "landing-chatbot",
    ...(lead.utm || {}),
  };

  try {
    await fetch(LEAD_WEBHOOK, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
  } catch {
    // Non-fatal — MD file is the source of truth.
  }
}

export async function POST(req: NextRequest) {
  let lead: LeadBody;
  try {
    lead = (await req.json()) as LeadBody;
  } catch {
    return Response.json({ ok: false, error: "invalid JSON" }, { status: 400 });
  }

  if (!lead.email || !lead.email.includes("@")) {
    return Response.json({ ok: false, error: "email required" }, { status: 400 });
  }
  if (!Array.isArray(lead.transcript)) {
    lead.transcript = [];
  }

  let savedPath = "";
  try {
    savedPath = await writeProspectFile(lead);
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    // Keep going — notify webhook even if local write fails (e.g. prod env).
    savedPath = `(failed: ${message})`;
  }

  await notifyWebhook(lead, savedPath);

  return Response.json({ ok: true });
}
