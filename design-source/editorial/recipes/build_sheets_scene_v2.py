#!/usr/bin/env python3
"""PRODUCT-LIVING-SYSTEM-SCENE-V2 — planches pour Figma.

Assemble les captures RÉELLES produites par `scripts/living-scene-v2-qa.mjs`.
Rien n'est redessiné : les frames Figma représentent les états codés.

La comparaison V1 / V2 met en regard le MÊME état fonctionnel, le HumanGate,
pour que l'écart porte sur la représentation et non sur le moment choisi.

Usage : python3 design-source/editorial/recipes/build_sheets_scene_v2.py
"""
from pathlib import Path

from PIL import Image, ImageDraw, ImageFont

ROOT = Path(__file__).resolve().parents[3]
Q2 = ROOT / "docs/design-system/qa/living-scene-v2"
Q1 = ROOT / "docs/design-system/qa/living-scene"
F = Path(__file__).parent

# La planche adopte le champ de la scène : encre, pas papier.
INK = (12, 12, 13)
PAPER = (255, 253, 250)
TECH = (162, 167, 178)
DIM = (127, 132, 144)
RED = (209, 19, 47)
FIELD = (19, 20, 24)
W = 1440


def bc(w: int, s: int):
    name = "BarlowCondensed-Black.ttf" if w == 900 else "BarlowCondensed-ExtraBold.ttf"
    return ImageFont.truetype(str(F / name), s)


def mono(s: int):
    return ImageFont.truetype("/System/Library/Fonts/Menlo.ttc", s)


def entete(c: Image.Image, titre: str, sous: str) -> int:
    d = ImageDraw.Draw(c)
    d.rectangle([64, 58, 78, 72], fill=RED)
    d.text((92, 44), titre, PAPER, bc(900, 58))
    d.text((92, 112), sous, TECH, mono(14))
    return 176


def crop(nom: str, box, largeur: int, source: Path = Q2) -> Image.Image:
    im = Image.open(source / nom).convert("RGB").crop(box)
    im.thumbnail((largeur, 4000), Image.LANCZOS)
    return im


def composants() -> Image.Image:
    """Les composants du renderer, découpés dans les captures réelles."""
    items = [
        ("desktop-03-parallele.png", (455, 190, 1015, 685),
         "Objet vivant · huit modules, dépendances, verrouillage"),
        ("desktop-07-feedback.png", (1035, 70, 1410, 330),
         "Surface spécialisée · politique interne versionnée"),
        ("desktop-05-humangate.png", (20, 65, 425, 795),
         "HumanGate intégré · conséquence annoncée avant le clic"),
        ("desktop-07-feedback.png", (1035, 615, 1410, 765),
         "Sortie distribuée · le logiciel concerné a changé"),
        ("desktop-03-parallele.png", (1000, 355, 1200, 420),
         "Curseur d'agent · il transporte, il ne décore pas"),
    ]
    blocs = [(crop(f, b, 760), t) for f, b, t in items]
    haut = sum(i.height + 74 for i, _ in blocs)
    c = Image.new("RGB", (W, 176 + haut + 60), INK)
    y = entete(c, "COMPOSANTS", "CAPTURES RÉELLES · AUCUN REDESSIN")
    d = ImageDraw.Draw(c)
    for im, t in blocs:
        d.text((92, y), t.upper(), TECH, mono(13))
        c.paste(im, (92, y + 24))
        y += im.height + 74
    return c


def mouvement() -> Image.Image:
    """Le langage de mouvement V2. Chaque geste a une origine et une destination."""
    gestes = [
        ("Entrée latérale", "la surface arrive quand elle sert", "surface → champ"),
        ("Sélection", "l'agent isole un fragment précis", "surface → fragment"),
        ("Transfert", "le fragment remonte jusqu'au module", "fragment → module"),
        ("Verrouillage", "le module devient une pièce fixe", "module → objet"),
        ("Retrait", "la surface terminée recule", "champ → arrière-plan"),
        ("Focus", "la périphérie se suspend, la décision s'ouvre", "champ → humain"),
        ("Reprise", "la décision relance la machine", "humain → champ"),
        ("Commit distribué", "la sortie se dépose dans les logiciels", "objet → surfaces"),
    ]
    c = Image.new("RGB", (W, 176 + len(gestes) * 92 + 260), INK)
    y = entete(c, "LANGAGE DE MOUVEMENT", "CHAQUE DÉPLACEMENT A UNE DESTINATION")
    d = ImageDraw.Draw(c)
    for nom, quoi, sens in gestes:
        d.line([(92, y - 14), (W - 92, y - 14)], (40, 42, 48), 1)
        d.text((92, y), nom.upper(), PAPER, bc(800, 30))
        d.text((470, y + 8), quoi, TECH, mono(14))
        d.text((W - 92, y + 8), sens, DIM, mono(13), anchor="ra")
        y += 92

    y += 20
    d.line([(92, y - 14), (W - 92, y - 14)], TECH, 2)
    d.text((92, y), "SILENCES", RED, mono(14))
    for i, l in enumerate([
        "Tout ne bouge pas en même temps : 2 à 4 agents actifs, jamais sept.",
        "L'horloge s'arrête réellement au HumanGate, elle ne ralentit pas.",
        "En mouvement réduit, les déplacements tombent, le scénario reste entier.",
    ]):
        d.text((92, y + 34 + i * 32), l, PAPER, mono(15))
    return c


def chapitres() -> Image.Image:
    """Les cinq écrans mobiles capturés, dans l'ordre du scénario."""
    shots = [
        ("mobile-390x844-01-signal.png", "1 · Signal"),
        ("mobile-390x844-02-parallele.png", "3 · Travail parallèle"),
        ("mobile-390x844-03-decision.png", "5 · Décision"),
        ("mobile-390x844-04-commit.png", "6 · Commit"),
        ("mobile-390x844-05-amelioration.png", "7 · Amélioration"),
    ]
    ims = []
    for f, t in shots:
        im = Image.open(Q2 / f).convert("RGB")
        im.thumbnail((250, 900), Image.LANCZOS)
        ims.append((im, t))
    c = Image.new("RGB", (W, 176 + max(i.height for i, _ in ims) + 100), INK)
    y = entete(c, "MOBILE · CHAPITRES", "SEPT CHAPITRES PLEIN ÉCRAN · UN ÉVÉNEMENT MAJEUR PAR ÉCRAN")
    d = ImageDraw.Draw(c)
    x = 92
    for im, t in ims:
        c.paste(im, (x, y))
        d.text((x, y + im.height + 18), t.upper(), TECH, mono(13))
        x += im.width + 20
    return c


def comparaison() -> Image.Image:
    """V1 contre V2, au même instant du scénario : le HumanGate."""
    a = Image.open(Q1 / "desktop-05-humangate.png").convert("RGB")
    b = Image.open(Q2 / "desktop-05-humangate.png").convert("RGB")
    demi = W // 2 - 110
    a.thumbnail((demi, 900), Image.LANCZOS)
    b.thumbnail((demi, 900), Image.LANCZOS)

    c = Image.new("RGB", (W, 176 + max(a.height, b.height) + 190), INK)
    y = entete(c, "V1 CONTRE V2", "MÊME MOTEUR · MÊME INSTANT · DEUX REPRÉSENTATIONS")
    d = ImageDraw.Draw(c)
    d.text((92, y), "V1 · LE SYSTÈME EST RAPPORTÉ", TECH, mono(14))
    d.text((W // 2 + 18, y), "V2 · LE SYSTÈME TRAVAILLE", RED, mono(14))
    y += 30
    # Le fond de la V1 est papier : un liseré évite qu'elle se fonde dans la planche.
    d.rectangle([91, y - 1, 92 + a.width, y + a.height], outline=(60, 62, 68))
    c.paste(a, (92, y))
    c.paste(b, (W // 2 + 18, y))
    y += max(a.height, b.height) + 34

    gauche = [
        "Titre éditorial, fond papier, dossier en feuille.",
        "Agents alignés en rangée d'étiquettes.",
        "HumanGate en modale noire au centre.",
        "Sortie résumée dans un rectangle de texte.",
    ]
    droite = [
        "Champ d'encre, surfaces produit, objet modulaire.",
        "Deux à quatre agents, visibles par leur action.",
        "Décision ancrée à l'objet, contexte visible.",
        "Sortie déposée dans EMAIL, CRM et CALENDAR.",
    ]
    for i, (g, dr) in enumerate(zip(gauche, droite)):
        d.text((92, y + i * 30), g, DIM, mono(14))
        d.text((W // 2 + 18, y + i * 30), dr, PAPER, mono(14))
    return c


if __name__ == "__main__":
    Q2.mkdir(parents=True, exist_ok=True)
    for fn, name in (
        (composants, "sheet-v2-components"),
        (mouvement, "sheet-v2-motion"),
        (chapitres, "sheet-v2-mobile"),
        (comparaison, "compare-v1-v2"),
    ):
        im = fn()
        im.save(Q2 / f"{name}.png")
        print(f"  → {name}.png  {im.size}")
