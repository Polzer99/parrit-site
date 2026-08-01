#!/usr/bin/env python3
"""PRODUCT-LIVING-HERO-PROOF-V1 — planches pour Figma.

Assemble les captures RÉELLES produites par `scripts/hero-proof-qa.mjs`.
Rien n'est redessiné.

Les deux comparaisons portent sur le MÊME instant : l'arrêt humain, qui est
le moment distinctif du hero.

Usage : python3 design-source/editorial/recipes/build_sheets_hero_proof.py
"""
from pathlib import Path

from PIL import Image, ImageDraw, ImageFont

ROOT = Path(__file__).resolve().parents[3]
Q = ROOT / "docs/design-system/qa/hero-proof"
D = ROOT / "docs/design-system/qa/visual-reset-v2"
F = Path(__file__).parent

PAPER = (255, 253, 250)
INK = (12, 12, 13)
MUTED = (116, 119, 127)
RED = (209, 19, 47)
W = 1440

MOMENTS = [
    ("1-signal", "01 · Une demande arrive"),
    ("2-comprehension", "02 · Le système comprend de quoi il s'agit"),
    ("3-travail", "03 · Plusieurs choses sont faites en parallèle"),
    ("4-arret", "04 · Le système s'arrête"),
    ("5-decision", "05 · Un humain tranche"),
    ("6-action", "06 · L'action est préparée"),
]


def bc(s: int):
    return ImageFont.truetype(str(F / "BarlowCondensed-Black.ttf"), s)


def mono(s: int):
    return ImageFont.truetype("/System/Library/Fonts/Menlo.ttc", s)


def entete(c: Image.Image, titre: str, sous: str) -> int:
    d = ImageDraw.Draw(c)
    d.rectangle([64, 56, 76, 68], fill=RED)
    d.text((92, 42), titre, INK, bc(54))
    d.text((92, 106), sous, MUTED, mono(14))
    return 168


def six_moments() -> Image.Image:
    """Les six moments, dans l'ordre, en traitement Paper puis Ink."""
    lignes = []
    for v in ("paper", "ink"):
        ims = []
        for cle, _ in MOMENTS:
            im = Image.open(Q / f"{v}-moment-{cle}.png").convert("RGB")
            im.thumbnail((205, 700), Image.LANCZOS)
            ims.append(im)
        lignes.append((v, ims))

    haut = sum(max(i.height for i in ims) + 90 for _, ims in lignes)
    c = Image.new("RGB", (W, 168 + haut + 70), PAPER)
    y = entete(c, "LES SIX MOMENTS", "MÊME SCÉNARIO, MÊME TIMING, DEUX TRAITEMENTS")
    d = ImageDraw.Draw(c)
    for v, ims in lignes:
        d.text((92, y), v.upper(), RED if v == "ink" else MUTED, mono(14))
        x = 92
        for im, (_, libelle) in zip(ims, MOMENTS):
            c.paste(im, (x, y + 24))
            d.text((x, y + 30 + im.height), libelle.split(" · ")[0], INK, mono(13))
            x += im.width + 14
        y += max(i.height for i in ims) + 90
    return c


def motion() -> Image.Image:
    """La boucle, à l'échelle réelle. Total 9,3 s plus une respiration."""
    phases = [
        ("Une demande arrive", 1300, "le visiteur voit qu'il se passe quelque chose"),
        ("Le système comprend", 1400, "l'objet de travail apparaît"),
        ("Travail en parallèle", 2300, "trois effets, pas une liste d'agents"),
        ("Le système s'arrête", 1600, "validation requise, tenue assez longtemps"),
        ("Un humain tranche", 900, "la décision est portée par quelqu'un"),
        ("L'action est préparée", 1800, "message, agenda, dossier"),
        ("Respiration", 1100, "la boucle ne redémarre pas d'un coup sec"),
    ]
    total = sum(p[1] for p in phases)
    c = Image.new("RGB", (W, 168 + len(phases) * 92 + 220), PAPER)
    y = entete(c, "LA BOUCLE", f"{total} MS AU TOTAL · AUCUNE INTERACTION REQUISE")
    d = ImageDraw.Draw(c)
    x0, x1 = 92, W - 92
    curseur = 0
    for nom, duree, note in phases:
        d.line([(x0, y - 14), (x1, y - 14)], (226, 224, 220), 1)
        d.text((x0, y), nom.upper(), INK, bc(28))
        d.text((x1, y + 6), f"{duree} ms", MUTED, mono(13), anchor="ra")
        bar = y + 42
        a = x0 + int((x1 - x0) * curseur / total)
        b = x0 + int((x1 - x0) * (curseur + duree) / total)
        d.rectangle([x0, bar, x1, bar + 6], fill=(232, 230, 226))
        d.rectangle([a, bar, b, bar + 6], fill=RED if nom.startswith("Le système s'arrête") else INK)
        d.text((x0, bar + 16), note.upper(), MUTED, mono(13))
        curseur += duree
        y += 92

    y += 12
    d.line([(x0, y - 14), (x1, y - 14)], INK, 2)
    d.text((x0, y), "CE QUE LE HERO NE MONTRE PAS", RED, mono(14))
    for i, l in enumerate([
        "Les dix états, les quatre versions, les identifiants internes.",
        "La liste des agents, la liste des sources, les métadonnées.",
        "Les commandes de lecture : on ne pilote rien dans un hero.",
        "Tout cela reste dans la démonstration longue, derrière un lien.",
    ]):
        d.text((x0, y + 32 + i * 30), l, INK, mono(15))
    return c


def duo(gauche: Path, droite: Path, titre: str, sous: str,
        lg: str, ld: str, notes_g, notes_d) -> Image.Image:
    a = Image.open(gauche).convert("RGB")
    b = Image.open(droite).convert("RGB")
    demi = W // 2 - 110
    a.thumbnail((demi, 900), Image.LANCZOS)
    b.thumbnail((demi, 900), Image.LANCZOS)
    c = Image.new("RGB", (W, 168 + max(a.height, b.height) + 90 + len(notes_g) * 30), PAPER)
    y = entete(c, titre, sous)
    d = ImageDraw.Draw(c)
    d.text((92, y), lg, MUTED, mono(14))
    d.text((W // 2 + 18, y), ld, RED, mono(14))
    y += 28
    for im, x in ((a, 92), (b, W // 2 + 18)):
        d.rectangle([x - 1, y - 1, x + im.width, y + im.height], outline=(226, 224, 220))
        c.paste(im, (x, y))
    y += max(a.height, b.height) + 30
    for i, (g, dr) in enumerate(zip(notes_g, notes_d)):
        d.text((92, y + i * 30), g, MUTED, mono(14))
        d.text((W // 2 + 18, y + i * 30), dr, INK, mono(14))
    return c


if __name__ == "__main__":
    Q.mkdir(parents=True, exist_ok=True)

    sorties = [
        (six_moments(), "sheet-six-moments"),
        (motion(), "sheet-motion"),
        (
            duo(
                Q / "paper-desktop-02-arret.png",
                Q / "ink-desktop-02-arret.png",
                "PAPER CONTRE INK",
                "MÊME COPY · MÊME SCÉNARIO · MÊME TIMING · MÊME INSTANT",
                "PAPER · LA PREUVE RESTE CLAIRE",
                "INK · LA PREUVE FORME UN CHAMP",
                [
                    "La page reste d'un seul tenant.",
                    "Le produit doit tenir sans contraste de fond.",
                    "Risque : la preuve se fond dans la page.",
                ],
                [
                    "Le panneau se détache franchement.",
                    "Le passage papier vers encre est un parti pris.",
                    "Risque : effet de bloc rapporté.",
                ],
            ),
            "compare-paper-ink",
        ),
        (
            duo(
                D / "concept-d-hero-1440x900.png",
                Q / "ink-desktop-02-arret.png",
                "CONCEPT D CONTRE LE NOUVEAU HERO",
                "MÊME CHARPENTE · PREUVE STATIQUE CONTRE PREUVE VIVANTE",
                "CONCEPT D · LA PREUVE EST RACONTÉE",
                "HERO PROOF · LA PREUVE SE PRODUIT",
                [
                    "Registre de rapport, filets, tableau de trace.",
                    "Tout est visible d'emblée, rien ne se passe.",
                    "L'arrêt humain est une ligne parmi d'autres.",
                ],
                [
                    "Six moments, dix secondes, aucune interaction.",
                    "La preuve s'accumule sous les yeux.",
                    "L'arrêt humain est le moment central.",
                ],
            ),
            "compare-concept-d-hero",
        ),
    ]
    for im, name in sorties:
        im.save(Q / f"{name}.png")
        print(f"  → {name}.png  {im.size}")
