import pathlib
d = pathlib.Path(__file__).parent
p = d / "index.html"; s = p.read_text()
def rep(old, new, count=1):
    global s
    assert old in s, old[:70]
    s = s.replace(old, new, count)

# Lisibilité : aucun texte utile sous 15 px, contenu à 17-18 px.
rep(".svc .s{font-size:16px", ".svc .s{font-size:17px")
rep(".job .line{font-size:14px", ".job .line{font-size:15px")
rep(".job .done{font-size:14px", ".job .done{font-size:15px")
rep(".q{font-size:15px", ".q{font-size:17px")
rep(".v{font-size:15px", ".v{font-size:17px")
rep(".flow div{font-size:15px", ".flow div{font-size:17px")
rep(".teamcap{display:flex;gap:28px;margin-top:20px;font-size:15px", ".teamcap{display:flex;gap:28px;margin-top:20px;font-size:16px")
rep(".team .s{font-size:16px", ".team .s{font-size:17px")
rep(".wm small{display:block;font-size:15px", ".wm small{display:block;font-size:16px")
rep(".refs p{font-size:15px", ".refs p{font-size:17px")
rep(".arch .col{font-size:14px", ".arch .col{font-size:16px")
rep(".arch .lane{font-size:13px", ".arch .lane{font-size:15px")
rep(".arch .nl{font-size:15px", ".arch .nl{font-size:16px")
rep(".status{font-size:14px", ".status{font-size:15px")
# Garde-fous : on garde le texte en 2 colonnes de lecture, pas en 3 étroites.
rep(".trust{display:grid;grid-template-columns:repeat(3,1fr)", ".trust{display:grid;grid-template-columns:repeat(3,minmax(0,1fr))")

# Parcours : une seule ligne de sol, plus la piste en double.
rep('<div class="track"><div class="fill"></div><div class="dot"></div></div>\n', '')
rep('.in .step{animation:lit 7.5s ease-in-out 1.6s infinite}', '.step{opacity:1}')

# Services : libellés courts, sur une ligne.
rep("<span>Bons de commande</span><span>8 commandes</span>", "<span>Commandes du jour</span><span>8 saisies</span>")
rep("<span>Dossier d'arrivée</span><span>1 pièce manquante</span>", "<span>Nouvel arrivant</span><span>1 pièce à fournir</span>")

# Architecture : libellé de couloir dans le schéma, plus de légende sous le schéma.


p.write_text(s)

h = d / "hero.css"; c = h.read_text()
c = c.replace("#onto .lab{fill:var(--on-canard);font-size:13px", "#onto .lab{fill:var(--on-canard);font-size:15px")
c = c.replace("#onto .nt{fill:var(--white);font-size:13px", "#onto .nt{fill:var(--white);font-size:14px")
c = c.replace(".humby{margin-top:10px;font-size:15px", ".humby{margin-top:10px;font-size:16px")
c = c.replace("#world .cs{font-size:14px", "#world .cs{font-size:16px")
c = c.replace(".alt h3{font-size:22px} .alt p{color:var(--on-ink);font-size:16px", ".alt h3{font-size:24px} .alt p{color:var(--on-ink);font-size:17px")
h.write_text(c)

j = d / "hero.js"; t = j.read_text()
# Les décors des étapes à côté du personnage, jamais derrière.
t = t.replace('translate(150 40)', 'translate(214 44)').replace('translate(515 34)', 'translate(574 38)').replace('translate(860 30)', 'translate(934 36)')
j.write_text(t)
print("ok")
