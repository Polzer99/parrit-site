import { exec } from "child_process";
import { NextResponse } from "next/server";
import { promisify } from "util";

const execAsync = promisify(exec);

export async function POST(req: Request) {
  const { id } = await req.json();
  if (!id) return NextResponse.json({ ok: false, error: "missing id" }, { status: 400 });
  try {
    const py = `
import sys
sys.path.insert(0, '/Users/paullarmaraud/parrit-os/signals')
import db
p = db.get_prospect_by_id(${JSON.stringify(id)})
if not p:
    print('NOT_FOUND'); exit(1)
db.insert_touchpoint(p['workspace_id'], p['id'], 'rdv_pris',
                     note='RDV pris via dashboard /os', source_channel='dashboard')
db.update_prospect(p['id'], status='rdv_pris')
print('OK')
`;
    const { stdout } = await execAsync(
      `python3 -c ${JSON.stringify(py)}`,
      { timeout: 20000 }
    );
    // Regen snapshot
    exec("python3 /Users/paullarmaraud/parrit-os/signals/export_os_snapshot.py");
    return NextResponse.json({ ok: stdout.includes("OK") });
  } catch (e: any) {
    return NextResponse.json(
      { ok: false, error: e.message?.slice(-300) },
      { status: 500 }
    );
  }
}
