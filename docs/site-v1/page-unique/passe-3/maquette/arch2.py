import pathlib, re
d = pathlib.Path(__file__).parent
T = "file:///Users/paullarmaraud/parrit-site-worktrees/scenario-donnee/public/tools/"
I = "icons/"

def chip(label, icon=None):
    img = f'<img src="{icon}" alt="">' if icon else '<i></i>'
    return f'<span class="chip">{img}{label}</span>'

stages = [
    ("Vos sources", "Là où l'information arrive aujourd'hui.",
     [chip("E-mails", I + "gmail.svg"), chip("ERP et CRM"), chip("Fichiers"), chip("WhatsApp", I + "whatsapp.svg")]),
    ("Votre base", "Une seule base, chez vous ou chez un hébergeur.",
     [chip("Supabase", T + "supabase.svg"), chip("OVH", I + "ovh.svg")]),
    ("Les agents", "Ils lisent, appliquent vos règles et préparent le travail.",
     [chip("Claude", T + "claude.svg"), chip("ChatGPT", T + "openai.svg"), chip("Gemini", T + "googlegemini.svg"), chip("Mistral", I + "mistralai.svg"), chip("Qwen", I + "qwen.svg"), chip("DeepSeek", I + "deepseek.svg"), chip("via OpenRouter", I + "openrouter.svg")]),
    ("Vous validez", "Là où vous êtes déjà.",
     [chip("Votre application"), chip("WhatsApp", I + "whatsapp.svg"), chip("iMessage", I + "imessage.svg"), chip("E-mail", I + "gmail.svg"), chip("Telegram", T + "telegram.svg")]),
    ("Le résultat", "Le travail est fait.", []),
]
cards = []
for i, (title, desc, chips) in enumerate(stages, 1):
    body = "".join(chips) if chips else '<div class="results"><span>Relance envoyée</span><span>Commande saisie</span><span>Tableau à jour</span></div>'
    cards.append(f'<div class="stage st{i}"><span class="num">{i}</span><h3>{title}</h3><p>{desc}</p><div class="chips">{body}</div></div>')
arrows = "".join(f'<svg class="arrow a{i}" viewBox="0 0 24 12" aria-hidden="true"><line x1="0" y1="6" x2="18" y2="6"/><path d="M16 1 L23 6 L16 11 Z"/></svg>' for i in range(1, 5))
builders = "".join(chip(n, ic) for n, ic in [("Claude Code", T + "claude.svg"), ("Codex", T + "openai.svg"), ("OpenCode", T + "opencode.png"), ("GitHub", T + "github.svg"), ("Vercel", T + "vercel.svg"), ("n8n", T + "n8n.svg")])
html = f'''<div class="flowmap">
    <div class="rail"><i></i></div>
    {cards[0]}{cards[1]}{cards[2]}{cards[3]}{cards[4]}
  </div>
  <div class="builders"><span>Nous construisons avec</span>{builders}</div>'''

css = '''
.flowmap{position:relative;display:grid;grid-template-columns:1fr 1fr 1.35fr 1.1fr 1fr;gap:20px;margin-top:64px;padding-top:28px}
.flowmap .rail{position:absolute;left:0;right:0;top:0;height:2px;background:var(--line)}
.flowmap .rail i{position:absolute;top:-6px;left:0;width:14px;height:14px;background:var(--canard)}
.in .flowmap .rail i{animation:railgo 12s linear infinite}
@keyframes railgo{0%{left:0}18%{left:calc(20% - 7px)}20%{left:calc(20% - 7px)}38%{left:calc(40% - 7px)}40%{left:calc(40% - 7px)}58%{left:calc(64% - 7px)}60%{left:calc(64% - 7px)}78%{left:calc(84% - 7px)}80%{left:calc(84% - 7px)}98%,100%{left:calc(100% - 14px)}}
.stage{border:1px solid var(--line);background:var(--white);padding:22px;display:flex;flex-direction:column;gap:10px;position:relative}
.stage .num{font-size:15px;font-weight:600;color:var(--canard)}
.stage h3{font-size:22px}
.stage p{font-size:16px;color:var(--ink2);line-height:1.45}
.chips{display:flex;flex-wrap:wrap;gap:8px;margin-top:6px}
.chip{display:inline-flex;align-items:center;gap:8px;font-size:15px;padding:7px 10px;border:1px solid var(--line);background:var(--off)}
.chip img{width:16px;height:16px} .chip i{width:12px;height:12px;background:var(--canard);display:inline-block}
.stage::after{content:"";position:absolute;inset:-1px;border:2px solid var(--canard);opacity:0;pointer-events:none}
.in .stage::after{animation:stagelit 12s linear infinite}
.in .st2::after{animation-delay:2.4s}.in .st3::after{animation-delay:4.8s}.in .st4::after{animation-delay:7.2s}.in .st5::after{animation-delay:9.6s}
@keyframes stagelit{0%{opacity:0}2%,18%{opacity:1}22%,100%{opacity:0}}
.results{display:flex;flex-direction:column;gap:8px;width:100%}
.results span{font-size:16px;font-weight:600;padding:10px 12px;border:1px solid var(--line);background:var(--off)}
.in .results span{animation:resultlit 12s linear infinite;animation-delay:9.6s}
@keyframes resultlit{0%{background:var(--off)}3%,18%{background:var(--rose);border-color:var(--rose)}24%,100%{background:var(--off)}}
.in .results span:nth-child(2){animation-name:resultlit2}.in .results span:nth-child(3){animation-name:resultlit3}
@keyframes resultlit2{0%,6%{background:var(--off)}9%,18%{background:var(--rose);border-color:var(--rose)}24%,100%{background:var(--off)}}
@keyframes resultlit3{0%,12%{background:var(--off)}15%,18%{background:var(--rose);border-color:var(--rose)}24%,100%{background:var(--off)}}
.builders{display:flex;flex-wrap:wrap;align-items:center;gap:10px;margin-top:40px;padding-top:24px;border-top:1px solid var(--line)}
.builders>span:first-child{font-size:16px;color:var(--ink2);margin-right:8px}
@media (max-width:960px){.flowmap{grid-template-columns:1fr}.flowmap .rail{display:none}}
'''
p = d / "index.html"; s = p.read_text()
s, n = re.subn(r'<svg class="arch".*?</svg>', lambda m: html, s, count=1, flags=re.S); assert n == 1
s = s.replace("@media (prefers-reduced-motion:reduce){", css + "\n@media (prefers-reduced-motion:reduce){", 1)
s = s.replace("<h2>Comment nos systèmes <b>sont construits.</b></h2>", "<h2>Le trajet d'une donnée, <b>de vos sources au résultat.</b></h2>")
p.write_text(s)
c = d / "capture.cjs"; t = c.read_text().replace("await shot('.arch', 's-arch', 3000);", "await shot('.flowmap', 's-arch', 6000);"); c.write_text(t)
f = d / "film.cjs"; t = f.read_text().replace("await go('.arch', 9000);", "await go('.flowmap', 13000);"); f.write_text(t)
print("ok")
