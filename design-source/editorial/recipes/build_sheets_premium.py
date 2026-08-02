#!/usr/bin/env python3
"""PRODUCT-LIVING-SYSTEM-SCENE-V2-PREMIUM-V1 — planches pour Figma.

Assemble les captures RÉELLES produites par `scripts/living-scene-premium-qa.mjs`.
Rien n'est redessiné.

La comparaison V2 / Premium met en regard le MÊME instant fonctionnel, le
HumanGate, pour que l'écart porte sur la finition et non sur le moment choisi.

Usage : python3 design-source/editorial/recipes/build_sheets_premium.py
"""
from pathlib import Path

from PIL import Image, ImageDraw, ImageFont

ROOT = Path(__file__).resolve().parents[3]
QP = ROOT / "docs/design-system/qa/living-scene-premium"
Q2 = ROOT / "docs/design-system/qa/living-scene-v2"
F = Path(__file__).parent

FIELD = (8, 8, 10)
PAPER = (255, 253, 250)
T1 = (240, 241, 244)
T2 = (167, 172, 183)
T3 = (124, 129, 140)
RED = (209, 19, 47)
W = 1440


def bc(w: int, s: int):
    name = "BarlowCondensed-Black.ttf" if w == 900 else "BarlowCondensed-ExtraBold.ttf"
    return ImageFont.truetype(str(F / name), s)


def mono(s: int):
    return ImageFont.truetype("/System/Library/Fonts/Menlo.ttc", s)


def entete(c: Image.Image, titre: str, sous: str) -> int:
    d = ImageDraw.Draw(c)
    d.rectangle([64, 58, 76, 70], fill=RED)
    d.text((92, 44), titre, PAPER, bc(900, 56))
    d.text((92, 110), sous, T2, mono(14))
    return 174


def crop(nom: str, box, largeur: int, source: Path = QP) -> Image.Image:
    im = Image.open(source / nom).convert("RGB").crop(box)
    im.thumbnail((largeur, 4000), Image.LANCZOS)
    return im


def composants() -> Image.Image:
    """Les composants de finition, découpés dans les captures réelles."""
    items = [
        ("desktop-05-humangate.png", (20, 80, 400, 750),
         "HumanGate · question, manque, action proposée, une décision évidente"),
        ("desktop-09-feedback.png", (1020, 70, 1420, 340),
         "Surface active · anatomie complète, politique versionnée"),
        ("desktop-03-parallele.png", (20, 340, 400, 500),
         "Surface contextuelle · une seule information principale"),
        ("desktop-09-feedback.png", (440, 130, 1000, 720),
         "Objet · châssis, modules de poids variable, verrouillage au commit"),
        ("desktop-09-feedback.png", (1120, 600, 1420, 740),
         "Confirmation distribuée · elle se pose dans le logiciel concerné"),
    ]
    blocs = [(crop(f, b, 720), t) for f, b, t in items]
    haut = sum(i.height + 72 for i, _ in blocs)
    c = Image.new("RGB", (W, 174 + haut + 60), FIELD)
    y = entete(c, "COMPOSANTS", "CAPTURES RÉELLES · AUCUN REDESSIN")
    d = ImageDraw.Draw(c)
    for im, t in blocs:
        d.text((92, y), t.upper(), T2, mono(13))
        c.paste(im, (92, y + 24))
        y += im.height + 72
    return c


def mouvement() -> Image.Image:
    """Le langage de mouvement de la finition."""
    lignes = [
        ("Entrée", "la surface passe en actif et gagne sa profondeur", "560 ms · sortie douce"),
        ("Sélection", "l'agent isole un fragment dans la surface", "300 ms"),
        ("Transfert", "la charge remonte la trajectoire jusqu'au module", "durée de l'agent"),
        ("Verrouillage", "le coin se coupe, la pièce ne se défait plus", "130 ms · net"),
        ("Retrait", "la surface terminée redescend en contextuel", "560 ms"),
        ("Arrêt", "la périphérie s'estompe, la décision s'ouvre", "300 ms"),
        ("Micro-pause", "rien ne se produit pendant 700 ms après la décision", "attente tenue"),
        ("Impulsion", "une lame de lumière traverse la scène, une fois", "700 ms"),
        ("Confirmations", "les trois sorties se posent l'une après l'autre", "0 · 140 · 280 ms"),
    ]
    c = Image.new("RGB", (W, 174 + len(lignes) * 84 + 250), FIELD)
    y = entete(c, "MOUVEMENT", "DÉPART VIF, ARRIVÉE POSÉE · LE VERROUILLAGE EST NET")
    d = ImageDraw.Draw(c)
    for nom, quoi, quand in lignes:
        d.line([(92, y - 14), (W - 92, y - 14)], (34, 36, 42), 1)
        d.text((92, y), nom.upper(), PAPER, bc(800, 28))
        d.text((430, y + 6), quoi, T2, mono(14))
        d.text((W - 92, y + 6), quand, T3, mono(13), anchor="ra")
        y += 84

    y += 16
    d.line([(92, y - 14), (W - 92, y - 14)], T2, 2)
    d.text((92, y), "CE QUI A ÉTÉ RETIRÉ", RED, mono(14))
    for i, l in enumerate([
        "Le mot géant « Engagé » : il appartenait à l'affiche, pas au produit.",
        "Les cadres permanents autour de chaque module.",
        "Les métadonnées de niveau 3, affichées en continu.",
        "Cinq surfaces détaillées simultanément : il n'en reste qu'une active.",
    ]):
        d.text((92, y + 34 + i * 30), l, T1, mono(15))
    return c


def comparaison() -> Image.Image:
    """V2 contre la finition, au même instant : le HumanGate."""
    a = Image.open(Q2 / "desktop-05-humangate.png").convert("RGB")
    b = Image.open(QP / "desktop-05-humangate.png").convert("RGB")
    demi = W // 2 - 110
    a.thumbnail((demi, 900), Image.LANCZOS)
    b.thumbnail((demi, 900), Image.LANCZOS)

    c = Image.new("RGB", (W, 174 + max(a.height, b.height) + 200), FIELD)
    y = entete(c, "V2 CONTRE LA FINITION", "MÊME MOTEUR · MÊME INSTANT · MÊME WORDING")
    d = ImageDraw.Draw(c)
    d.text((92, y), "V2 · CRÉDIBLE, ENCORE OUTIL INTERNE", T2, mono(14))
    d.text((W // 2 + 18, y), "PREMIUM · PRODUIT", RED, mono(14))
    y += 30
    c.paste(a, (92, y))
    c.paste(b, (W // 2 + 18, y))
    y += max(a.height, b.height) + 34

    gauche = [
        "Six surfaces détaillées en permanence.",
        "Cadres et filets sur chaque information.",
        "Quatre décisions de poids presque égal.",
        "Métadonnées affichées en continu.",
        "31 cadres, 84 blocs de texte à l'écran.",
    ]
    droite = [
        "Une surface active, deux contextuelles, le reste en réserve.",
        "Contraste de surface et profondeur à la place des cadres.",
        "Une action évidente, trois alternatives révélables.",
        "Niveau 3 à l'inspection seulement.",
        "2 cadres, 37 blocs de texte. Mesuré, pas déclaré.",
    ]
    for i, (g, dr) in enumerate(zip(gauche, droite)):
        d.text((92, y + i * 30), g, T3, mono(14))
        d.text((W // 2 + 18, y + i * 30), dr, T1, mono(14))
    return c


if __name__ == "__main__":
    QP.mkdir(parents=True, exist_ok=True)
    for fn, name in (
        (composants, "sheet-premium-components"),
        (mouvement, "sheet-premium-motion"),
        (comparaison, "compare-v2-premium"),
    ):
        im = fn()
        im.save(QP / f"{name}.png")
        print(f"  → {name}.png  {im.size}")
