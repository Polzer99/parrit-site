import pathlib, re
d = pathlib.Path(__file__).parent
T = "file:///Users/paullarmaraud/parrit-site-worktrees/scenario-donnee/public/tools/"
I = "file://" + str(d / "icons") + "/"

cols = [
    (0, 150, "1. Les modèles"),
    (210, 150, "2. L'aiguillage"),
    (420, 170, "3. Les agents"),
    (650, 170, "4. Hébergement et données"),
    (880, 200, "5. Là où vous travaillez"),
]
H = 40
nodes = {
    "ChatGPT": (0, 60, T + "openai.svg"), "Claude": (0, 112, T + "claude.svg"), "Gemini": (0, 164, T + "googlegemini.svg"),
    "Mistral": (0, 216, I + "mistralai.svg"), "Qwen": (0, 268, I + "qwen.svg"), "DeepSeek": (0, 320, I + "deepseek.svg"),
    "OpenRouter": (210, 190, I + "openrouter.svg"),
    "Claude Code": (420, 86, T + "claude.svg"), "Codex": (420, 138, T + "openai.svg"), "OpenCode": (420, 190, T + "opencode.png"), "n8n": (420, 268, T + "n8n.svg"),
    "GitHub": (650, 86, T + "github.svg"), "Vercel": (650, 138, T + "vercel.svg"), "OVH": (650, 216, I + "ovh.svg"), "Supabase": (650, 268, T + "supabase.svg"),
    "Votre application": (880, 60, None), "WhatsApp": (880, 112, I + "whatsapp.svg"), "iMessage": (880, 164, I + "imessage.svg"),
    "Votre e-mail": (880, 216, I + "gmail.svg"), "Telegram": (880, 268, T + "telegram.svg"),
}
width = {x: w for x, w, _ in cols}
def L(n): x, y, _ = nodes[n]; return (x, y + H / 2)
def R(n): x, y, _ = nodes[n]; return (x + width[x], y + H / 2)
edges = [(m, "OpenRouter") for m in ["ChatGPT", "Claude", "Gemini", "Mistral", "Qwen", "DeepSeek"]]
edges += [("Claude", "Claude Code"), ("ChatGPT", "Codex"), ("OpenRouter", "OpenCode"), ("OpenRouter", "n8n")]
edges += [("Claude Code", "GitHub"), ("Codex", "GitHub"), ("OpenCode", "GitHub"), ("n8n", "Supabase"), ("n8n", "OVH")]
edges += [("Vercel", "Votre application"), ("OVH", "WhatsApp"), ("OVH", "iMessage"), ("OVH", "Votre e-mail"), ("Supabase", "Telegram"), ("Supabase", "Votre application")]
out = ['<svg class="arch" viewBox="0 0 1080 430" aria-hidden="true">']
for x, w, t in cols:
    out.append(f'<text x="{x}" y="28" class="col">{t}</text>')
ids = {}
for i, (a, b) in enumerate(edges):
    (x1, y1), (x2, y2) = R(a), L(b)
    mx = (x1 + x2) / 2
    ids[(a, b)] = f"e{i}"
    out.append(f'<path id="e{i}" d="M{x1} {y1} C{mx} {y1} {mx} {y2} {x2} {y2}" class="edge"/>')
# GitHub -> Vercel, GitHub -> OVH (même colonne)
out.append('<path id="g1" d="M820 106 L836 106 L836 158 L820 158" class="edge"/>')
out.append('<path id="g2" d="M820 106 L842 106 L842 236 L820 236" class="edge"/>')
# interfaces -> vous validez
out.append('<path id="v1" d="M1080 80 L1092 80 L1092 400 L1080 400" class="edge"/>')
for n, (x, y, icon) in nodes.items():
    w = width[x]
    key = " key" if n in ("OpenRouter", "Supabase", "GitHub") else ""
    out.append(f'<g><rect x="{x}" y="{y}" width="{w}" height="{H}" class="nodebox{key}"/>')
    tx = x + 14
    if icon:
        out.append(f'<image href="{icon}" x="{x + 12}" y="{y + 10}" width="20" height="20"/>')
        tx = x + 42
    else:
        out.append(f'<rect x="{x + 13}" y="{y + 11}" width="18" height="18" class="appic"/>')
        tx = x + 42
    out.append(f'<text x="{tx}" y="{y + 26}" class="nl">{n}</text></g>')
out.append('<rect x="880" y="380" width="200" height="40" class="you"/><text x="980" y="406" text-anchor="middle" class="yout">Vous validez</text>')
out.append('<text x="650" y="335" class="lane">Vos données restent</text><text x="650" y="353" class="lane">dans une seule base</text>')
routes = [["e1", "e6"], ["e3", "e9", "e14"], ["e5", "e9", "e15"], ["e0", "e7", "e11"], ["e4", "e8", "e12"], ["e2", "e9", "e14", "e20"]]
for ri, r in enumerate(routes):
    for i, pid in enumerate(r):
        out.append(f'<rect width="8" height="8" x="-4" y="-4" class="p"><animateMotion dur="1.2s" begin="{ri * 1.4 + i * 1.2:.1f}s" repeatCount="indefinite"><mpath href="#{pid}"/></animateMotion></rect>')
out.append("</svg>")
svg = "\n".join(out)

p = d / "index.html"; s = p.read_text()
s = re.sub(r'<svg class="arch".*?</svg>', lambda m: svg, s, count=1, flags=re.S)
if ".arch .appic" not in s:
    s = s.replace(".arch .you{", ".arch .appic{fill:var(--canard)}\n.arch .you{", 1)
p.write_text(s)
print("ok", len(edges))
