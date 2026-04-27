import { exec } from "child_process";
import { NextResponse } from "next/server";
import { promisify } from "util";

const execAsync = promisify(exec);

export async function POST() {
  try {
    const { stdout, stderr } = await execAsync(
      "python3 /Users/paullarmaraud/parrit-os/signals/export_os_snapshot.py",
      { timeout: 30000 }
    );
    return NextResponse.json({ ok: true, stdout, stderr });
  } catch (e: any) {
    return NextResponse.json(
      { ok: false, error: e.message },
      { status: 500 }
    );
  }
}

export async function GET() {
  return POST();
}
