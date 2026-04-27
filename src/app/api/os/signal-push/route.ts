import { exec } from "child_process";
import { NextResponse } from "next/server";
import { promisify } from "util";

const execAsync = promisify(exec);

export async function POST(req: Request) {
  const { signal_id } = await req.json();
  if (!signal_id)
    return NextResponse.json({ ok: false, error: "missing signal_id" }, { status: 400 });
  try {
    const { stdout } = await execAsync(
      `python3 /Users/paullarmaraud/parrit-os/signals/signal_telegram.py --signal-id ${JSON.stringify(signal_id)} --mark-actioned`,
      { timeout: 120000 }
    );
    // Regen snapshot
    exec("python3 /Users/paullarmaraud/parrit-os/signals/export_os_snapshot.py");
    return NextResponse.json({ ok: stdout.includes("✅"), output: stdout.slice(-500) });
  } catch (e: any) {
    return NextResponse.json({ ok: false, error: e.message?.slice(-400) }, { status: 500 });
  }
}
