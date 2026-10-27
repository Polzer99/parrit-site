"""Passe 4 de la maquette (Paul, 27/10 après-midi) : cas d'usage qui défilent par service,
partenaires qui deviennent leurs offres, trajet d'une donnée sans notre outillage interne."""
import json, pathlib, re

d = pathlib.Path(__file__).parent
p = d / "index.html"
s = p.read_text()

# ---------- 1. services : quatre cas d'usage qui défilent, back-office et nouveau ----------
SVC = [
    ("Direction", [
        ("bo", "Résume les décisions de chaque réunion, et qui s'en charge."),
        ("bo", "Prépare le tableau de bord du lundi."),
        ("new", "Simule l'effet d'une décision sur la marge avant de la prendre."),
        ("new", "Répond à une question sur toute l'entreprise, sources à l'appui."),
    ]),
    ("Finance", [
        ("bo", "Rapproche les relevés bancaires et le grand livre."),
        ("bo", "Relance les factures échues, sur le bon ton."),
        ("new", "Prévoit la trésorerie à treize semaines, à jour chaque matin."),
        ("new", "Repère une dépense anormale le jour même."),
    ]),
    ("Commercial", [
        ("bo", "Met à jour la base clients après chaque rendez-vous."),
        ("bo", "Prépare les devis selon vos conditions."),
        ("new", "Repère les entreprises qui viennent d'avoir besoin de vous."),
        ("new", "Prépare chaque rendez-vous avec tout l'historique du client."),
    ]),
    ("Administration des ventes", [
        ("bo", "Saisit les commandes reçues par e-mail."),
        ("bo", "Confirme les délais de livraison au client."),
        ("new", "Lit un bon de commande scanné ou manuscrit."),
        ("new", "Prévient le client d'un retard avant qu'il n'appelle."),
    ]),
    ("Achats", [
        ("bo", "Compare les offres des fournisseurs."),
        ("bo", "Vérifie chaque facture contre sa commande."),
        ("new", "Surveille le prix des matières et alerte au bon moment."),
        ("new", "Évalue un nouveau fournisseur à partir de sources publiques."),
    ]),
    ("Logistique", [
        ("bo", "Prévient quand une livraison prend du retard."),
        ("bo", "Prépare les documents d'expédition."),
        ("new", "Recalcule les tournées chaque matin selon les commandes du jour."),
        ("new", "Anticipe une rupture avant qu'elle n'arrive."),
    ]),
    ("Production", [
        ("bo", "Prépare le planning de la semaine."),
        ("bo", "Consigne les arrêts machine."),
        ("new", "Replanifie dans l'heure quand une machine s'arrête."),
        ("new", "Répond aux opérateurs à partir des notices techniques."),
    ]),
    ("Qualité", [
        ("bo", "Classe les réclamations par cause."),
        ("bo", "Tient à jour les fiches de non-conformité."),
        ("new", "Relie chaque réclamation au lot et à la machine en cause."),
        ("new", "Rassemble les preuves d'un audit avant qu'il commence."),
    ]),
    ("Service client", [
        ("bo", "Propose une réponse à chaque demande."),
        ("bo", "Trie les demandes par urgence."),
        ("new", "Répond la nuit et le week-end, dans votre ton."),
        ("new", "Repère un client sur le point de partir."),
    ]),
    ("Ressources humaines", [
        ("bo", "Vérifie qu'un dossier est complet."),
        ("bo", "Prépare l'arrivée d'un nouveau salarié."),
        ("new", "Répond aux questions des salariés sur leurs droits, à toute heure."),
        ("new", "Trouve qui, en interne, a déjà résolu ce problème."),
    ]),
    ("Marketing", [
        ("bo", "Adapte un même texte à chaque canal."),
        ("bo", "Fait le bilan de chaque campagne."),
        ("new", "Écrit une version par secteur client, en une fois."),
        ("new", "Suit chaque semaine ce que publient vos concurrents."),
    ]),
    ("Juridique", [
        ("bo", "Prépare un projet de contrat à relire."),
        ("bo", "Suit les échéances de vos contrats."),
        ("new", "Compare un contrat reçu à vos règles et signale les écarts."),
        ("new", "Retrouve une clause dans dix ans d'archives."),
    ]),
]
TAG = {"bo": "Back-office", "new": "Nouveau"}
SVC = [(n, [c[0], c[2], c[1], c[3]]) for n, c in SVC]
cards = []
for name, cases in SVC:
    k, t = cases[0]
    cards.append(
        f'<div class="uc" data-cases=\'{json.dumps(cases, ensure_ascii=False).replace(chr(39), "&#39;")}\'>'
        f'<span class="s">{name}</span><p class="case">{t}</p>'
        f'<div class="ucfoot"><span class="tag {k}">{TAG[k]}</span><span class="dots">'
        + "".join(f'<i class="{"on" if i == 0 else ""}"></i>' for i in range(4))
        + "</span></div></div>")
svc_html = '<div class="svc">\n' + "\n".join(cards) + "\n</div>"
s, n = re.subn(r'<div class="svc">.*?\n</div>\n', svc_html + "\n", s, count=1, flags=re.S)
assert n == 1, "svc"

# ---------- 2. partenaires : le type devient « avec eux, nous livrons » ----------
TEAM = [
    ("Ingénieurs IA", "Plus de dix, chacun sa spécialité : vision, agents, intégration.",
     ["Des agents sur mesure", "La vision par ordinateur", "L'intégration à vos logiciels"]),
    ("Automatisation et assistants", "Des développeurs et des studios : assistants écrits, vocaux et vidéo.",
     ["Des assistants écrits", "Des assistants vocaux", "Des vidéos générées"]),
    ("Transformation et projet", "Conduite du changement et pilotage de projet.",
     ["La conduite du changement", "Le pilotage de projet", "Votre feuille de route IA"]),
    ("Marque et marketing", "Image de marque, contenus et vente.",
     ["Votre identité de marque", "Vos contenus", "Votre prospection"]),
    ("Formation", "Une quinzaine de formateurs et un organisme certifié.",
     ["Des formations certifiées", "Des ateliers par métier", "La formation à Claude Code"]),
    ("Conseil et qualité", "Des cabinets partenaires et des relecteurs de nos livrables.",
     ["L'audit de vos processus", "Le diagnostic IA", "La relecture de chaque livrable"]),
    ("Chercheurs du MIT", "Des chercheurs du MIT dans notre réseau, pour vos déploiements d'agents les plus exigeants.",
     ["Vos déploiements d'agents les plus exigeants", "La revue d'architecture"]),
]
tcards = []
for name, desc, offers in TEAM:
    tcards.append(
        f'<div class="pt" data-offers=\'{json.dumps(offers, ensure_ascii=False).replace(chr(39), "&#39;")}\'>'
        f'<div class="face who"><span class="s">{name}</span><p>{desc}</p></div>'
        f'<div class="face what" aria-hidden="true"><span class="s">Avec eux, nous livrons</span><p class="offer"></p></div></div>')
team_html = '<div class="team">\n    ' + "\n    ".join(tcards) + "\n  </div>"
s, n = re.subn(r'<div class="team">.*?\n  </div>', team_html, s, count=1, flags=re.S)
assert n == 1, "team"
s = s.replace('<span><i></i>Une équipe composée pour chaque diagnostic</span>',
              '<span><i></i>Une équipe composée pour chaque diagnostic, et ce qu\'elle livre</span>')

# ---------- 3. trajet d'une donnée : plus d'outils clients, le local, votre application ----------
def chip(label, cls=""):
    return f'<span class="chip {cls}">{label}</span>'
stages = [
    ("Vos sources", "Tout ce que vos équipes utilisent déjà.",
     ["E-mails", "Agenda", "Téléphone et messages vocaux", "WhatsApp", "Teams et Slack", "ERP", "CRM",
      "Comptabilité", "Paie", "Tableurs", "Documents et PDF", "Scans et photos", "Sites web",
      "Machines et capteurs"]),
    ("Votre base", "Une seule base, où vous le décidez.",
     ["Dans le cloud, en Europe", "Sur vos serveurs", "En local, sur vos machines"]),
    ("Les agents", "Le bon modèle en face de chaque tâche, dans un harnais construit pour vous.",
     ["Le bon modèle pour chaque tâche", "En ligne ou en local", "Vos règles et vos contrôles", "Des tests à chaque changement"]),
    ("Vous validez", "Là où vous êtes déjà.",
     ["__APP__", "WhatsApp", "iMessage", "E-mail", "Teams", "Telegram"]),
]
html = ['<div class="flowmap">', '    <div class="rail"><i></i></div>']
for i, (title, desc, items) in enumerate(stages, 1):
    chips = "".join(
        '<span class="chip app"><b>Votre propre application</b></span>' if c == "__APP__" else chip(c)
        for c in items)
    html.append(f'<div class="stage st{i}"><span class="num">{i}</span><h3>{title}</h3><p>{desc}</p><div class="chips">{chips}</div></div>')
html.append('<div class="stage st5"><span class="num">5</span><h3>Le résultat</h3><p>Le travail est fait.</p>'
            '<div class="chips"><div class="results"><span>Relance envoyée</span><span>Commande saisie</span><span>Tableau à jour</span></div></div></div>')
html.append("  </div>")
s, n = re.subn(r'<div class="flowmap">.*?</div>\s*<div class="builders">.*?</div>', "\n".join(html), s, count=1, flags=re.S)
assert n == 1, "flowmap"
s = s.replace("<p class=\"archnote\">Les marques citées appartiennent à leurs propriétaires. Nous les utilisons ; aucun partenariat n'est sous-entendu.</p>", "")

# ---------- 4. Laparra : outil de pilotage agentique ----------
s = s.replace("Grossiste en fruits et légumes du MIN de Rungis : des agents qui gèrent la base clients, et un outil de pilotage de l'entreprise.",
              "Grossiste du MIN de Rungis : un outil de pilotage agentique pour les fruits et légumes.")

css = r'''
/* passe 4 */
.svc>div.uc{min-height:200px}
.uc .case{font-size:18px;line-height:1.45;margin-top:12px;min-height:78px;transition:opacity .12s}
.uc.blink .case,.uc.blink .tag{opacity:0}
.ucfoot{margin-top:auto;padding-top:18px;display:flex;justify-content:space-between;align-items:center}
.tag{font-size:15px;font-weight:600;padding:5px 10px;border:1.5px solid var(--canard);color:var(--canard);transition:opacity .12s}
.tag.new{background:var(--canard);color:var(--white)}
.dots{display:flex;gap:6px}.dots i{width:7px;height:7px;background:var(--line)}.dots i.on{background:var(--canard)}
.team>div.pt{min-height:150px;padding:0}
.pt .face{padding:28px;transition:opacity .15s}
.pt .what{position:absolute;inset:0;background:var(--canard);color:var(--white);opacity:0}
.pt .what .s{color:var(--on-canard)}
.pt .what .offer{font-size:22px;font-weight:600;margin-top:10px;line-height:1.3}
.pt.flip .what{opacity:1}.pt.flip .who{opacity:0}
.pt.blink .offer{opacity:0}
.chip.app{background:var(--canard);border-color:var(--canard);color:var(--white);font-size:16px;padding:9px 12px}
.flowmap{grid-template-columns:1.7fr 1fr 1fr 1fr .9fr}
.in .team>div::after{animation:none}
'''
s = s.replace("</style>", css + "</style>", 1)

js = r'''
<script>
(function(){
  const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
  const TAG = {bo:"Back-office", new:"Nouveau"};
  // Services : chaque case garde un cas 3,5 s (le temps de le lire), clignote 120 ms, passe au suivant.
  document.querySelectorAll(".uc").forEach((c, idx) => {
    const cases = JSON.parse(c.dataset.cases); let k = idx % 2;
    const show = () => { const [t, txt] = cases[k]; c.querySelector(".case").textContent = txt; const tag = c.querySelector(".tag"); tag.textContent = TAG[t]; tag.className = "tag " + t; c.querySelectorAll(".dots i").forEach((d, j) => d.classList.toggle("on", j === k)); };
    show(); if (reduce) return;
    setTimeout(() => setInterval(() => { c.classList.add("blink"); setTimeout(() => { k = (k + 1) % cases.length; show(); c.classList.remove("blink"); }, 120); }, 3500), idx * 290);
  });
  // Partenaires : une carte à la fois (au plus deux), le type puis « avec eux, nous livrons » et chaque offre 2,2 s.
  const pts = [...document.querySelectorAll(".pt")];
  const play = c => { const offers = JSON.parse(c.dataset.offers), o = c.querySelector(".offer"); let k = 0; o.textContent = offers[0]; c.classList.add("flip");
    const next = () => { k++; if (k < offers.length) { c.classList.add("blink"); setTimeout(() => { o.textContent = offers[k]; c.classList.remove("blink"); setTimeout(next, 2200); }, 150); } else c.classList.remove("flip"); };
    setTimeout(next, 2200); };
  if (!reduce) { let i = 0; const tick = () => { play(pts[i]); i = (i + 1) % pts.length; setTimeout(tick, 3400); }; setTimeout(tick, 1200); }
})();
</script>
'''
s = s.replace('<script src="hero.js"></script>', js + '<script src="hero.js"></script>', 1)
p.write_text(s)
print("ok")

# ---------- 5. une page = un écran (Paul, 27/10 15 h 30) ----------
s = p.read_text()
fit = r'''
/* un bloc tient dans un écran */
section{padding:clamp(56px,9vh,112px) 0}
.svc{margin-top:40px}.svc>div.uc{min-height:0;padding:22px}.uc .case{min-height:52px;font-size:17px}
.team{margin-top:40px}.team>div.pt{min-height:118px}.pt .face{padding:22px}
.flowmap{margin-top:40px;gap:14px}.stage{padding:16px;gap:8px}.stage h3{font-size:20px}.stage p{font-size:15px}
.chips{gap:6px}.chip{font-size:15px;padding:5px 8px}.chip.app{font-size:15px;padding:7px 10px}
.swipe-dots{display:none}
@media (max-width:760px){
  .svc,.team,.flowmap{display:flex;overflow-x:auto;scroll-snap-type:x mandatory;gap:12px;background:none;border:0;margin-left:-16px;margin-right:-16px;padding:0 16px 4px;scrollbar-width:none}
  .svc::-webkit-scrollbar,.team::-webkit-scrollbar,.flowmap::-webkit-scrollbar{display:none}
  .svc>div,.team>div,.flowmap>.stage{flex:0 0 84%;scroll-snap-align:start;border:1px solid var(--line)}
  .team>div:last-child{grid-column:auto}
  .flowmap .rail{display:none}
  .swipe-dots{display:flex;gap:8px;margin-top:14px}.swipe-dots i{width:8px;height:8px;background:var(--line)}.swipe-dots i.on{background:var(--canard)}
  .teamcap{font-size:15px}
}
'''
s = s.replace("</style>", fit + "</style>", 1)
# des points sous chaque carrousel (téléphone seulement)
for cls, n in (("svc", 12), ("team", 7), ("flowmap", 5)):
    s = re.sub(rf'(<div class="{cls}">.*?\n(?:  )?</div>)', lambda m: m.group(1) + f'<div class="swipe-dots" data-for="{cls}">' + "<i></i>" * n + "</div>", s, count=1, flags=re.S)
mobile_js = r'''
<script>
(function(){
  // Téléphone : points qui suivent le glissement, et le trajet d'une donnée avance seul d'étape en étape.
  document.querySelectorAll(".swipe-dots").forEach(d => {
    const box = document.querySelector("." + d.dataset.for); const dots = [...d.children];
    const items = [...box.children].filter(c => !c.classList.contains("rail"));
    const sync = () => { const i = Math.round(box.scrollLeft / (items[0].offsetWidth + 12)); dots.forEach((x, j) => x.classList.toggle("on", j === i)); };
    box.addEventListener("scroll", sync, { passive: true }); sync();
    if (d.dataset.for === "flowmap" && !matchMedia("(prefers-reduced-motion: reduce)").matches) {
      let touched = false, i = 0; box.addEventListener("touchstart", () => touched = true, { passive: true });
      setInterval(() => { if (touched || box.scrollWidth <= box.clientWidth) return; i = (i + 1) % items.length; box.scrollTo({ left: items[i].offsetLeft - 16, behavior: "smooth" }); }, 2400);
    }
  });
})();
</script>
'''
s = s.replace('<script src="hero.js"></script>', mobile_js + '<script src="hero.js"></script>', 1)
p.write_text(s)
print("ok écran")
s = p.read_text()
s = s.replace("</style>", r'''
.svc>div.uc{padding:18px 20px}.uc .case{font-size:16px;margin-top:8px;min-height:46px}.ucfoot{padding-top:12px}
.tag{font-size:15px;padding:3px 8px}
@media (max-width:760px){
  .founder .grid{grid-template-columns:38% 1fr!important;gap:16px!important;align-items:start}
  .founder h2{font-size:26px!important}
  .founder ul{grid-column:1/-1;margin-top:12px}
  .founder li{font-size:16px}
}
</style>''', 1)
p.write_text(s)
print("ok resserrage")
s = p.read_text()
s = s.replace("</style>", r'''
@media (max-width:760px){
  .steps{display:flex!important;overflow-x:auto;scroll-snap-type:x mandatory;gap:12px;margin-left:-16px;margin-right:-16px;padding:0 16px;scrollbar-width:none}
  .steps>.step{flex:0 0 84%;scroll-snap-align:start}
  #walk{margin-top:28px}
}
</style>''', 1)
p.write_text(s)
s = p.read_text()
s = s.replace("</style>", "@media (max-width:760px){.flowmap,.svc,.team{align-items:flex-start}}\n</style>", 1)
p.write_text(s)
