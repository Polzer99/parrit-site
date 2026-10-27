import pathlib, re
d = pathlib.Path(__file__).parent
p = d / "index.html"; s = p.read_text()

# 1. Retirer la section garde-fous (Paul 27/10 : utile en slide, pas sur le site).
s, n = re.subn(r'<section style="background:var\(--sky\)" data-anim>.*?</div></section>\s*', '', s, count=1, flags=re.S)
assert n == 1

# 2. Références : bandeau de logos qui défile + une ligne par client.
I = "icons/"
logos = [("m-laparra.png", "Laparra"), ("m-clevery.png", "Clevery Avocats"), ("m-forexpert.png", "Forexpert"), ("m-joone.png", "Joone"), ("sncf.svg", "SNCF")]
one = "".join(f'<li><img src="{I}{f}" alt="{a}"></li>' for f, a in logos)
band = f'''<div class="marquee" aria-label="Nos clients"><ul>{one}{one.replace('alt="', 'aria-hidden="true" alt="')}</ul></div>
  <div class="reflines">
    <div><b>Laparra</b><p>Grossiste en fruits et légumes du MIN de Rungis : des agents qui gèrent la base clients, et un outil de pilotage de l'entreprise.</p></div>
    <div><b>Clevery Avocats</b><p>Un agent pour le cabinet.</p></div>
    <div><b>Forexpert</b><p>Un agent de prospection.</p></div>
    <div><b>Joone</b><p>L'accompagnement des équipes à l'IA.</p></div>
    <div><b>SNCF</b><p>Un programme de formation.</p></div>
  </div>'''
s, n = re.subn(r'<div class="refs">.*?</div>\s*</div></section>', band + '\n</div></section>', s, count=1, flags=re.S)
assert n == 1
css = '''
.marquee{margin-top:56px;overflow:hidden;border-top:1px solid var(--line);border-bottom:1px solid var(--line);padding:36px 0;-webkit-mask-image:linear-gradient(90deg,transparent,#000 8%,#000 92%,transparent);mask-image:linear-gradient(90deg,transparent,#000 8%,#000 92%,transparent)}
.marquee ul{display:flex;gap:96px;width:max-content;list-style:none;animation:defile 28s linear infinite}
.marquee:hover ul{animation-play-state:paused}
.marquee li{display:flex;align-items:center;height:64px}
.marquee img{height:56px;width:auto;display:block}
.marquee li:nth-child(5n+3) img,.marquee li:nth-child(5n+5) img{height:64px}
@keyframes defile{to{transform:translateX(calc(-50% - 48px))}}
.reflines{display:grid;grid-template-columns:2fr 1fr 1fr 1fr 1fr;gap:28px;margin-top:36px}
.reflines b{font-size:17px;font-weight:600}
.reflines p{font-size:16px;color:var(--ink2);margin-top:6px;line-height:1.45}
@media (prefers-reduced-motion:reduce){.marquee ul{animation:none;flex-wrap:wrap;width:auto}}
@media (max-width:760px){.reflines{grid-template-columns:1fr}}
'''
s = s.replace("@media (prefers-reduced-motion:reduce){", css + "\n@media (prefers-reduced-motion:reduce){", 1)
p.write_text(s)
print("ok")
