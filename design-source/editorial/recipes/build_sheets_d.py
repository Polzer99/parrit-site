#!/usr/bin/env python3
"""PARRIT-TECH-TRUST-V1 — deux planches pour la page Figma du concept D.

`sheet-d-components` assemble les captures de composants réelles, prises à
200 % par `scripts/concept-d-qa.mjs`. Rien n'est redessiné : ce sont les
composants tels qu'ils sont rendus.

`sheet-d-motion` écrit les règles de mouvement, pour que la page Figma porte
la même doctrine que le code.

Usage : python3 design-source/editorial/recipes/build_sheets_d.py
"""
from pathlib import Path

from PIL import Image, ImageDraw

from build_sheets import bc, mono, INK, MUTED, PAPER, RED, OUT

W = 1440


def components() -> Image.Image:
    items = [
        ("d-detail-panel-200.png", "ExecutionTrace", "entrée · étapes · validation · sortie · propriétaire · état"),
        ("d-detail-gate-200.png", "HumanGate", "le système s’arrête, un propriétaire nommé tranche"),
        ("d-detail-hero-200.png", "TechHero", "éditorial à gauche, exécution à droite, même grille"),
        ("d-detail-trace-200.png", "Cas d’usage", "quatre chaînes, la relation rouge relie l’entrée à la sortie"),
    ]
    blocks = []
    for f, titre, note in items:
        im = Image.open(OUT / f).convert("RGB")
        im.thumbnail((W - 128, 900), Image.LANCZOS)
        blocks.append((im, titre, note))

    h = 200 + sum(b[0].height + 120 for b in blocks)
    c = Image.new("RGB", (W, h), PAPER)
    d = ImageDraw.Draw(c)
    d.text((64, 60), "COMPOSANTS", INK, bc(900, 72))
    d.text((64, 132), "CAPTURES RÉELLES À 200 % · AUCUN REDESSIN", MUTED, mono(14))

    y = 200
    for im, titre, note in blocks:
        d.text((64, y), titre.upper(), INK, bc(800, 34))
        d.text((64, y + 40), note.upper(), MUTED, mono(13))
        c.paste(im, (64, y + 72))
        y += im.height + 120
    return c


def motion() -> Image.Image:
    lignes = [
        ("AUTORISÉ", RED, None),
        ("Une trace qui progresse", INK, "l’étape en attente pulse, 1 200 ms"),
        ("Une relation qui se construit", INK, "le filet rouge se trace, 380 ms"),
        ("Un état qui change", INK, "fond de ligne au survol, 160 ms"),
        ("Un CTA qui bascule", INK, "encre vers rouge, 160 ms"),
        ("", INK, None),
        ("INTERDIT", RED, None),
        ("Particules, parallaxe, glitch, néons", MUTED, None),
        ("Texte qui vole, animation permanente", MUTED, None),
        ("Tout mouvement sans signification", MUTED, None),
        ("", INK, None),
        ("DURÉES", RED, None),
        ("Interactions d’interface", INK, "160 ms"),
        ("Transitions de contenu", INK, "380 ms"),
        ("Démonstrations système", INK, "1 200 ms"),
        ("", INK, None),
        ("REDUCED MOTION", RED, None),
        ("Toute animation et toute transition sont coupées", INK, None),
        ("La relation rouge reste tracée, elle porte du sens", INK, None),
    ]
    c = Image.new("RGB", (W, 200 + len(lignes) * 62 + 80), PAPER)
    d = ImageDraw.Draw(c)
    d.text((64, 60), "MOUVEMENT", INK, bc(900, 72))
    d.text((64, 132), "LE MOUVEMENT SERT LA LECTURE OU N’EXISTE PAS", MUTED, mono(14))

    y = 210
    for label, colour, detail in lignes:
        if not label:
            y += 30
            continue
        if colour is RED:
            d.line([(64, y - 12), (W - 64, y - 12)], INK, 2)
            d.text((64, y), label, RED, mono(14))
            y += 46
            continue
        d.text((64, y), label, colour, bc(800, 30))
        if detail:
            d.text((W - 64, y + 8), detail.upper(), MUTED, mono(13), anchor="ra")
        d.line([(64, y + 44), (W - 64, y + 44)], (0, 0, 0, 20) and (225, 223, 219), 1)
        y += 62
    return c


if __name__ == "__main__":
    for fn, name in ((components, "sheet-d-components"), (motion, "sheet-d-motion")):
        im = fn()
        im.save(OUT / f"{name}.png")
        print(f"  → {name}.png  {im.size}")
