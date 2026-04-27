import { exec } from "child_process";
import { NextResponse } from "next/server";
import { promisify } from "util";

const execAsync = promisify(exec);

export async function POST(req: Request) {
  const { slug } = await req.json();
  if (!slug) return NextResponse.json({ ok: false, error: "missing slug" }, { status: 400 });
  try {
    const { stdout, stderr } = await execAsync(
      `python3 /Users/paullarmaraud/parrit-os/signals/relance.py --slug ${JSON.stringify(slug)}`,
      { timeout: 180000, maxBuffer: 10 * 1024 * 1024 }
    );
    const insufficient = (stdout + stderr).includes("INSUFFICIENT_CONTEXT");
    return NextResponse.json({
      ok: true,
      insufficient,
      output: stdout.slice(-4000),
    });
  } catch (e: any) {
    return NextResponse.json(
      { ok: false, error: e.message?.slice(-500) },
      { status: 500 }
    );
  }
}
