#!/usr/bin/env python3
"""PARRIT-VISUAL-RESET-V2 — planches de comparaison pour Figma.

Trois planches que le laboratoire web ne montre pas d'un seul coup :
le spécimen typographique, les variantes de portrait, les deux plaques.

Usage : python3 design-source/editorial/recipes/build_sheets.py
"""
from pathlib import Path

from PIL import Image, ImageDraw, ImageFont

ROOT = Path(__file__).resolve().parents[3]
OUT = ROOT / "docs/design-system/qa/visual-reset-v2"
FONTS = ROOT / "public/fonts/barlow-condensed"
PORTRAITS = ROOT / "public/brand/editorial/portraits"
PLATES = ROOT / "public/brand/editorial/plates"

PAPER = (255, 253, 250)
INK = (12, 12, 13)
RED = (209, 19, 47)
MUTED = (110, 112, 121)

# Les chaînes imposées par la commande.
STRINGS = [
    "PRISE DE CONSCIENCE",
    "EXÉCUTION",
    "ÉQUIPES",
    "DÉPLOIEMENT",
    "MÉTIERS",
    "AMÉLIORATION",
    "RÉDUCTION",
]
PHRASE = "D’UNE IA QUI PARLE À DES AGENTS QUI EXÉCUTENT"

W = 1440


def bc(weight: int, size: int) -> ImageFont.FreeTypeFont:
    name = "BarlowCondensed-Black" if weight == 900 else "BarlowCondensed-ExtraBold"
    # Les woff2 servis au site ne sont pas lisibles par FreeType : on repasse
    # par les TTF d'origine, strictement les mêmes dessins.
    ttf = Path(__file__).parent / f"{name}.ttf"
    return ImageFont.truetype(str(ttf), size)


def mono(size: int) -> ImageFont.FreeTypeFont:
    for p in (
        "/System/Library/Fonts/Menlo.ttc",
        "/System/Library/Fonts/Monaco.ttf",
        "/System/Library/Fonts/Supplemental/Courier New.ttf",
    ):
        if Path(p).exists():
            return ImageFont.truetype(p, size)
    return ImageFont.load_default()


def sheet_typo() -> Image.Image:
    c = Image.new("RGB", (W, 1980), PAPER)
    d = ImageDraw.Draw(c)
    y = 64
    d.text((64, y), "BARLOW CONDENSED · SIL OFL 1.1 · AUTO-HÉBERGÉE", MUTED, mono(15))
    y += 40
    d.text((64, y), "TEST FRANÇAIS", INK, bc(900, 96))
    y += 118

    for weight in (900, 800):
        d.line([(64, y), (W - 64, y)], INK, 2)
        y += 22
        label = "BLACK 900 · TITRES-MANIFESTES" if weight == 900 else "EXTRABOLD 800 · QUAND BLACK DEVIENT TROP MASSIF"
        d.text((64, y), label, RED, mono(14))
        y += 34
        for s in STRINGS:
            f = bc(weight, 68)
            d.text((64, y), s, INK, f)
            box = d.textbbox((64, y), s, font=f)
            d.text((W - 64, y + 22), f"{box[2] - box[0]} px", MUTED, mono(13), anchor="ra")
            y += 78
        y += 26

    d.line([(64, y), (W - 64, y)], INK, 2)
    y += 22
    d.text((64, y), "INTERLIGNAGE 0,94 · DEUX LIGNES ACCENTUÉES SUPERPOSÉES", RED, mono(14))
    y += 34
    f = bc(900, 84)
    for line in ("D’UNE IA QUI PARLE", "À DES AGENTS QUI EXÉCUTENT"):
        d.text((64, y), line, INK, f)
        y += int(84 * 0.94)
    y += 60
    d.text((64, y), "AUCUNE COMPRESSION ARTIFICIELLE DE LA CHASSE.", MUTED, mono(14))
    return c.crop((0, 0, W, y + 60))


def sheet_portraits() -> Image.Image:
    items = [
        ("paul-cutout.png", "DÉTOURÉ", "couche alpha réelle"),
        ("paul-warm.png", "CHALEUREUX", "couleur conservée"),
        ("paul-bw.png", "NOIR ET BLANC", "contraste 1,42"),
        ("paul-manifesto.png", "MANIFESTE", "presque une sérigraphie"),
        ("paul-halftone.png", "TRAME", "cellule 7 px, grille 45°"),
        ("paul-halftone-inverse.png", "TRAME INVERSE", "pour fond encre"),
    ]
    cols, cw, ch = 3, 440, 470
    rows = (len(items) + cols - 1) // cols
    c = Image.new("RGB", (W, 150 + rows * (ch + 90)), PAPER)
    d = ImageDraw.Draw(c)
    d.text((64, 60), "PORTRAITS ÉDITORIAUX", INK, bc(900, 72))
    d.text((64, 132), "TOUS ISSUS DE VRAIES PHOTOGRAPHIES · AUCUN VISAGE GÉNÉRÉ", MUTED, mono(14))

    for i, (name, titre, note) in enumerate(items):
        cx = 64 + (i % cols) * ((W - 128) // cols)
        cy = 190 + (i // cols) * (ch + 90)
        # Fond adapté : la trame inverse n'existe que sur encre.
        bg = INK if "inverse" in name else PAPER
        d.rectangle([cx, cy, cx + cw - 40, cy + ch], fill=bg)
        im = Image.open(PORTRAITS / name).convert("RGBA")
        im.thumbnail((cw - 80, ch - 40), Image.LANCZOS)
        c.paste(im, (cx + 20, cy + ch - im.height), im)
        d.text((cx, cy + ch + 18), titre, INK, bc(800, 32))
        d.text((cx, cy + ch + 56), note.upper(), MUTED, mono(13))
    return c


def sheet_plates() -> Image.Image:
    items = [
        ("plate-decision.jpg", "PLATE-DECISION", "une décision d’atelier devient une règle qui tourne"),
        ("plate-repetition.jpg", "PLATE-REPETITION", "le même geste, et l’endroit où la boucle se referme"),
    ]
    pw = W - 128
    ph = int(pw * 788 / 1400)
    c = Image.new("RGB", (W, 190 + len(items) * (ph + 130)), PAPER)
    d = ImageDraw.Draw(c)
    d.text((64, 60), "PLAQUES ÉDITORIALES", INK, bc(900, 72))
    d.text((64, 132), "COMPOSÉES, PAS GÉNÉRÉES · PHOTOGRAPHIES TERRAIN RÉELLES", MUTED, mono(14))
    y = 190
    for name, titre, note in items:
        im = Image.open(PLATES / name).convert("RGB").resize((pw, ph), Image.LANCZOS)
        c.paste(im, (64, y))
        d.text((64, y + ph + 18), titre, INK, bc(800, 32))
        d.text((64, y + ph + 56), note.upper(), MUTED, mono(13))
        y += ph + 130
    return c


if __name__ == "__main__":
    OUT.mkdir(parents=True, exist_ok=True)
    for fn, name in (
        (sheet_typo, "sheet-typographie"),
        (sheet_portraits, "sheet-portraits"),
        (sheet_plates, "sheet-plaques"),
    ):
        im = fn()
        im.save(OUT / f"{name}.png")
        print(f"  → {name}.png  {im.size}")
