import pathlib
p = pathlib.Path(__file__).with_name("index.html")
s = p.read_text()

def rep(old, new):
    global s
    assert old in s, old[:60]
    s = s.replace(old, new, 1)

rep('<div class="wm">SNCF<small>avec Arkel</small></div><p>Un programme de formation.</p>', '<div class="wm">SNCF<small>Formation</small></div><p>Un programme de formation.</p>')
rep('<div class="wm">Forexpert<small>Formation</small></div>', '<div class="wm">Forexpert<small>Organisme de formation</small></div>')

hero_css = pathlib.Path(__file__).with_name("hero.css").read_text()
rep('@media (prefers-reduced-motion:reduce){', hero_css + '\n@media (prefers-reduced-motion:reduce){')

rep('<body>\n', '<body>\n' + pathlib.Path(__file__).with_name("hero.html").read_text())

rep('<div class="steps">\n    <div class="track">', '<svg id="walk" class="walk" viewBox="0 0 1080 130" aria-hidden="true"></svg>\n  <div class="steps" style="margin-top:24px">\n    <div class="track">')

start = s.index('<div class="svc">')
endtok = '<div class="status"><i></i>Exemples illustratifs</div>'
end = s.index(endtok) + len(endtok)
deps = [
    ("Direction", "Elle résume les décisions de chaque réunion.", "Comité du lundi", "3 décisions"),
    ("Finance", "Elle signale les écarts entre deux fichiers.", "Relevé et grand livre", "2 écarts"),
    ("Commercial", "Elle repère les entreprises à contacter.", "Secteur et région", "12 entreprises"),
    ("Administration des ventes", "Elle saisit les commandes reçues par e-mail.", "Bons de commande", "8 commandes"),
    ("Achats", "Elle compare les offres des fournisseurs.", "Trois devis", "1 recommandation"),
    ("Logistique", "Elle prévient quand une livraison prend du retard.", "Expéditions du jour", "2 retards"),
    ("Production", "Elle prépare le planning de la semaine.", "Ordres de fabrication", "5 lignes"),
    ("Qualité", "Elle classe les réclamations par cause.", "Réclamations du mois", "4 causes"),
    ("Service client", "Elle propose une réponse à chaque demande.", "Demandes entrantes", "9 réponses"),
    ("Ressources humaines", "Elle vérifie qu'un dossier est complet.", "Dossier d'arrivée", "1 pièce manquante"),
    ("Marketing", "Elle adapte un même texte à chaque canal.", "Annonce produit", "4 versions"),
    ("Juridique", "Elle prépare un projet de contrat à relire.", "Contrat de prestation", "12 clauses"),
]
cards = "".join(f'<div><span class="s">{a}</span><p>{b}</p><div class="job"><div class="line"><span>{c}</span><span>{d}</span></div><div class="bar"><i></i></div><div class="done">Prêt à relire</div></div></div>\n' for a, b, c, d in deps)
s = s[:start] + '<div class="svc">\n' + cards + '</div>' + s[end:]
rep('.svc{display:grid;grid-template-columns:repeat(3,1fr)', '.svc{display:grid;grid-template-columns:repeat(4,1fr)')
delays = "".join(f".in .svc>div:nth-child({i}) .job *{{animation-delay:{(i - 1) * 0.45:.2f}s}}" for i in range(2, 13))
rep('.in .svc>div:nth-child(2) .job *{animation-delay:.7s}', delays)

rep("<p class=\"muted\" style=\"margin-top:28px\">À l'international : des partenaires au Brésil et en Italie, de premiers clients au Cameroun.</p>",
    pathlib.Path(__file__).with_name("world.html").read_text())

rep('</ul></div>\n</div></div></section>', '</ul></div>\n</div></div></section>\n' + pathlib.Path(__file__).with_name("contact.html").read_text())
rep('</script>', '</script>\n<script src="hero.js"></script>')
p.write_text(s)
print("ok")
