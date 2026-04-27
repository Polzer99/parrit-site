import { exec } from "child_process";
import { NextResponse } from "next/server";
import { promisify } from "util";
import { readFile, writeFile } from "fs/promises";

const execAsync = promisify(exec);
const IDEAS_PATH =
  "/Users/paullarmaraud/Parrit.ai/Projets-Dev/parrit-site/public/os-ideas.json";

export async function POST(req: Request) {
  const { title, body, tags } = await req.json();
  if (!title || !body)
    return NextResponse.json({ ok: false, error: "missing fields" }, { status: 400 });

  try {
    // Insert into SQLite via Python
    const py = `
import sys, json
sys.path.insert(0, '/Users/paullarmaraud/parrit-os/signals')
import db
ws = db.get_workspace('parrit')
idea_id = db.insert_content_idea(
    ws['id'] if ws else None,
    title=${JSON.stringify(title)},
    body=${JSON.stringify(body)},
    tags=${JSON.stringify(tags || [])},
    source='dashboard_os',
)
print(idea_id)
`;
    const { stdout } = await execAsync(`python3 -c ${JSON.stringify(py)}`, {
      timeout: 15000,
    });
    const id = stdout.trim();

    // Refresh ideas JSON for Next.js
    const refreshPy = `
import sys, json
sys.path.insert(0, '/Users/paullarmaraud/parrit-os/signals')
import db
ideas = db.list_content_ideas(limit=200)
print(json.dumps(ideas, default=str, ensure_ascii=False))
`;
    const { stdout: ideasJson } = await execAsync(
      `python3 -c ${JSON.stringify(refreshPy)}`,
      { timeout: 15000, maxBuffer: 10 * 1024 * 1024 }
    );
    await writeFile(IDEAS_PATH, ideasJson);

    const created = {
      id,
      title,
      body,
      tags: tags || [],
      source: "dashboard_os",
      created_at: new Date().toISOString(),
    };
    return NextResponse.json({ ok: true, idea: created });
  } catch (e: any) {
    return NextResponse.json({ ok: false, error: e.message?.slice(-400) }, { status: 500 });
  }
}
