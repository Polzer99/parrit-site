#!/usr/bin/env python3
"""PRODUCT-LIVING-SYSTEM-SCENE-V1 — planches pour Figma.

Assemble les captures RÉELLES produites par `scripts/living-scene-qa.mjs`.
Rien n'est redessiné : les frames Figma représentent les états codés.

Usage : python3 design-source/editorial/recipes/build_sheets_scene.py
"""
from pathlib import Path

from PIL import Image, ImageDraw, ImageFont

ROOT = Path(__file__).resolve().parents[3]
Q = ROOT / "docs/design-system/qa/living-scene"
D = ROOT / "docs/design-system/qa/visual-reset-v2"
F = Path(__file__).parent

INK = (12, 12, 13)
MUTED = (110, 112, 121)
PAPER = (255, 253, 250)
RED = (209, 19, 47)
W = 1440


def bc(w: int, s: int):
    name = "BarlowCondensed-Black.ttf" if w == 900 else "BarlowCondensed-ExtraBold.ttf"
    return ImageFont.truetype(str(F / name), s)


def mono(s: int):
    return ImageFont.truetype("/System/Library/Fonts/Menlo.ttc", s)


def entete(c: Image.Image, titre: str, sous: str) -> int:
    d = ImageDraw.Draw(c)
    d.text((64, 56), titre, INK, bc(900, 66))
    d.text((64, 128), sous, MUTED, mono(14))
    return 200


def mobile_sequence() -> Image.Image:
    """Les cinq écrans mobiles, dans l'ordre du scénario."""
    shots = [
        ("mobile-390x844-01-signal.png", "1 · Signal"),
        ("mobile-390x844-02-orchestration.png", "2 · Travail parallèle"),
        ("mobile-390x844-03-humangate.png", "3 · HumanGate plein écran"),
        ("mobile-390x844-04-sortie.png", "4 · Sortie"),
        ("mobile-390x844-05-feedback.png", "5 · Amélioration"),
    ]
    h = 900
    ims = []
    for f, t in shots:
        im = Image.open(Q / f).convert("RGB")
        im.thumbnail((260, h), Image.LANCZOS)
        ims.append((im, t))

    c = Image.new("RGB", (W, 200 + max(i.height for i, _ in ims) + 90), PAPER)
    y = entete(c, "MOBILE · SÉQUENCE", "390 × 844 · UNE ACTION MAJEURE PAR ÉCRAN")
    d = ImageDraw.Draw(c)
    x = 64
    for im, t in ims:
        c.paste(im, (x, y))
        d.text((x, y + im.height + 16), t.upper(), MUTED, mono(13))
        x += im.width + 20
    return c


def components() -> Image.Image:
    """Les composants, découpés dans les captures réelles."""
    items = [
        ("desktop-03-parallele.png", (84, 240, 1360, 780), "Plateau · surfaces, faisceaux, objet central"),
        ("desktop-05-humangate.png", (430, 350, 1010, 640), "HumanDecisionGate · interruption réelle"),
        ("desktop-07-boucle.png", (64, 760, 1380, 880), "AgentIntervention · sept lignes d'exécution"),
        ("desktop-08-branche-rejet.png", (64, 600, 1380, 900), "FeedbackLoop · branche rejet"),
    ]
    blocs = []
    for f, box, t in items:
        im = Image.open(Q / f).convert("RGB").crop(box)
        im.thumbnail((W - 128, 620), Image.LANCZOS)
        blocs.append((im, t))

    c = Image.new("RGB", (W, 200 + sum(i.height + 110 for i, _ in blocs)), PAPER)
    y = entete(c, "COMPOSANTS", "CAPTURES RÉELLES · AUCUN REDESSIN")
    d = ImageDraw.Draw(c)
    for im, t in blocs:
        d.text((64, y), t.upper(), MUTED, mono(13))
        c.paste(im, (64, y + 26))
        y += im.height + 110
    return c


def motion() -> Image.Image:
    """Timeline réelle de la scène, telle qu'elle est codée."""
    phases = [
        ("Veille", 0, 600, "l'interface est calme"),
        ("Signal entrant", 600, 1500, "l'objet métier est créé"),
        ("Travail parallèle", 1500, 4000, "sept agents, interventions décalées"),
        ("Convergence", 4000, 5500, "les apports se déposent dans le dossier"),
        ("Décision humaine", 5500, None, "l'horloge s'arrête réellement"),
        ("Sortie", 5500, 7500, "après validation, 2 000 ms"),
        ("Amélioration", 7500, 8700, "la règle est réécrite"),
    ]
    c = Image.new("RGB", (W, 1180), PAPER)
    y = entete(c, "MOUVEMENT", "TIMELINE CODÉE · L'HORLOGE EST LA SEULE SOURCE D'ÉTAT")
    d = ImageDraw.Draw(c)

    x0, x1 = 64, W - 64
    total = 8700
    for nom, a, b, note in phases:
        d.line([(x0, y - 12), (x1, y - 12)], INK, 1)
        d.text((x0, y), nom.upper(), INK, bc(800, 30))
        fin = "en attente" if b is None else f"{b} ms"
        d.text((x1, y + 8), f"{a} ms → {fin}", MUTED, mono(13), anchor="ra")
        # Barre de phase, à l'échelle réelle.
        bar_y = y + 44
        bx0 = x0 + int((x1 - x0) * a / total)
        bx1 = x0 + int((x1 - x0) * (b if b else total) / total)
        d.rectangle([x0, bar_y, x1, bar_y + 6], fill=(232, 230, 226))
        d.rectangle([bx0, bar_y, bx1, bar_y + 6], fill=RED if b is None else INK)
        d.text((x0, bar_y + 18), note.upper(), MUTED, mono(13))
        y += 118

    d.line([(x0, y - 12), (x1, y - 12)], INK, 2)
    d.text((x0, y), "MOUVEMENT RÉDUIT", RED, mono(14))
    for i, l in enumerate(
        [
            "Aucun déplacement long, aucune parallaxe.",
            "Chaque état apparaît par une transition de 120 ms.",
            "Le scénario reste entier : gate, branches, sortie et boucle inchangés.",
        ]
    ):
        d.text((x0, y + 34 + i * 30), l, INK, mono(15))
    return c


def comparaison() -> Image.Image:
    """Concept D contre la scène. D raconte le système, la scène le fait vivre."""
    a = Image.open(D / "concept-d-hero-1440x900.png").convert("RGB")
    b = Image.open(Q / "desktop-03-parallele.png").convert("RGB")
    half = W // 2 - 84
    a.thumbnail((half, 900), Image.LANCZOS)
    b.thumbnail((half, 900), Image.LANCZOS)

    c = Image.new("RGB", (W, 260 + max(a.height, b.height) + 120), PAPER)
    y = entete(c, "CONCEPT D CONTRE LA SCÈNE", "MÊME OFFRE, MÊME PALETTE, DEUX EXPÉRIENCES")
    d = ImageDraw.Draw(c)
    d.text((64, y), "CONCEPT D · LE SYSTÈME EST RACONTÉ", MUTED, mono(14))
    d.text((W // 2 + 20, y), "SCÈNE · LE SYSTÈME TRAVAILLE", RED, mono(14))
    y += 30
    c.paste(a, (64, y))
    c.paste(b, (W // 2 + 20, y))
    y += max(a.height, b.height) + 30
    d.text((64, y), "Registres, filets, métadonnées. Statique.", INK, mono(15))
    d.text((W // 2 + 20, y), "Entrées, agents, convergence, décision. En cours.", INK, mono(15))
    return c


if __name__ == "__main__":
    Q.mkdir(parents=True, exist_ok=True)
    for fn, name in (
        (mobile_sequence, "sheet-scene-mobile"),
        (components, "sheet-scene-components"),
        (motion, "sheet-scene-motion"),
        (comparaison, "compare-conceptd-scene"),
    ):
        im = fn()
        im.save(Q / f"{name}.png")
        print(f"  → {name}.png  {im.size}")
