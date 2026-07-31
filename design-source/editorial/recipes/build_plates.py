#!/usr/bin/env python3
"""PARRIT-VISUAL-RESET-V2 — deux plaques éditoriales originales.

Composées, pas générées : la recette assemble de VRAIES photographies terrain
Parrit avec de la géométrie. Aucun modèle d'image n'intervient, donc aucune
scène client fabriquée, aucun faux logo, aucune légende anglaise parasite.

Les plaques empruntent aux références leurs PRINCIPES — noir et blanc
documentaire, un seul rouge éditorial, fil rouge à nœuds, champ de trame,
blocs de document — jamais leur composition, leur cadrage ni leur texte.

Aucun texte n'est cuit dans l'image : les légendes se composent en HTML,
en Geist Mono, en français.

Usage : python3 design-source/editorial/recipes/build_plates.py
"""
import math
from pathlib import Path

from PIL import Image, ImageDraw, ImageFilter

from build_portraits import to_bw, halftone

ROOT = Path(__file__).resolve().parents[3]
TERRAIN = ROOT / "public/brand/terrain"
EXPORTS = ROOT / "design-source/editorial/exports"
WEB = ROOT / "public/brand/editorial/plates"

W, H = 2000, 1125  # 16:9
INK = (12, 12, 13)
RED = (209, 19, 47)
PAPER = (255, 253, 250)
SUP = 3  # suréchantillonnage global : traits fins nets, cercles sans crénelage


def photo(name: str, box: tuple[int, int], crop_x: float = 0.5) -> Image.Image:
    """Photo terrain réelle, passée en noir et blanc documentaire, recadrée
    en remplissage. `crop_x` choisit la zone conservée horizontalement."""
    src = Image.open(TERRAIN / name).convert("RGBA")
    tw, th = box
    scale = max(tw / src.width, th / src.height)
    src = src.resize((round(src.width * scale), round(src.height * scale)), Image.LANCZOS)
    x = int((src.width - tw) * crop_x)
    y = int((src.height - th) * 0.42)
    return to_bw(src.crop((x, y, x + tw, y + th)), 1.30, 22, 236)


def dot_field(size: tuple[int, int], axis: str, colour) -> Image.Image:
    """Champ de trame : la densité décroît vers l'intérieur de la page.

    Ce n'est pas une texture décorative. Elle marque toujours une zone
    précise de la composition, jamais le fond entier.
    """
    w, h = size
    layer = Image.new("L", (w * SUP, h * SUP), 0)
    draw = ImageDraw.Draw(layer)
    cell = 15
    for gy in range(0, h + cell, cell):
        for gx in range(0, w + cell, cell):
            t = (gx / w) if axis == "x" else (gy / h)
            density = max(0.0, min(1.0, 1.0 - t)) ** 1.5
            r = (cell / 2.0) * density * 1.15
            if r < 0.4:
                continue
            cx, cy = gx + (cell / 2 if (gy // cell) % 2 else 0), gy
            draw.ellipse(
                [(cx - r) * SUP, (cy - r) * SUP, (cx + r) * SUP, (cy + r) * SUP], fill=255
            )
    dots = layer.resize((w, h), Image.LANCZOS)
    out = Image.new("RGBA", (w, h), (0, 0, 0, 0))
    out.paste(Image.new("RGBA", (w, h), colour + (255,)), (0, 0), dots)
    return out


def thread(canvas: Image.Image, points, node_start=True, arrow=True, width=3) -> None:
    """Fil rouge : il part d'une cause, il arrive à un effet. Jamais décoratif.

    Tracé sur un calque suréchantillonné, sinon la ligne de 3 px bave.
    """
    w, h = canvas.size
    layer = Image.new("RGBA", (w * SUP, h * SUP), (0, 0, 0, 0))
    d = ImageDraw.Draw(layer)
    pts = [(x * SUP, y * SUP) for x, y in points]
    d.line(pts, fill=RED + (255,), width=width * SUP, joint="curve")

    if node_start:
        x, y = pts[0]
        r = 9 * SUP
        d.ellipse([x - r, y - r, x + r, y + r], fill=RED + (255,))

    if arrow:
        (x0, y0), (x1, y1) = pts[-2], pts[-1]
        ang = math.atan2(y1 - y0, x1 - x0)
        L, spread = 26 * SUP, math.radians(24)
        d.polygon(
            [
                (x1, y1),
                (x1 - L * math.cos(ang - spread), y1 - L * math.sin(ang - spread)),
                (x1 - L * math.cos(ang + spread), y1 - L * math.sin(ang + spread)),
            ],
            fill=RED + (255,),
        )
    canvas.alpha_composite(layer.resize((w, h), Image.LANCZOS))


def rule(canvas: Image.Image, x0, y0, x1, y1, colour=INK, width=2, alpha=255) -> None:
    layer = Image.new("RGBA", (canvas.width * SUP, canvas.height * SUP), (0, 0, 0, 0))
    ImageDraw.Draw(layer).line(
        [(x0 * SUP, y0 * SUP), (x1 * SUP, y1 * SUP)], fill=colour + (alpha,), width=width * SUP
    )
    canvas.alpha_composite(layer.resize(canvas.size, Image.LANCZOS))


def grain(canvas: Image.Image) -> Image.Image:
    """Grain papier discret, cohérent avec `.parrit-grain` de la feuille de style."""
    import numpy as np

    rng = np.random.default_rng(20260731)  # graine fixe : recette reproductible
    noise = rng.normal(0, 5.0, (canvas.height, canvas.width, 1))
    a = np.asarray(canvas.convert("RGB")).astype(np.float32) + noise
    return Image.fromarray(np.clip(a, 0, 255).astype("uint8"), "RGB").convert("RGBA")


# --------------------------------------------------------------------------
# Plaque 1 — la matière humaine à gauche, le système ordonné à droite.
# Sujet : une décision prise en atelier finit en règle qui tourne toute seule.
# --------------------------------------------------------------------------
def plate_decision() -> Image.Image:
    c = Image.new("RGBA", (W, H), PAPER + (255,))

    ph_w, ph_h = 1010, 820
    c.alpha_composite(photo("atelier-cartographie.jpg", (ph_w, ph_h), 0.44), (0, 0))

    # Rappel serré du même atelier : le détail que la vue large avale.
    det = photo("atelier-cartographie.jpg", (300, 300), 0.20)
    c.alpha_composite(det, (72, ph_h + 46))

    # Colonne système : six enregistrements, trois portent un état.
    x0, y0, gap = 1250, 232, 84
    for i in range(6):
        y = y0 + i * gap
        w_bar = 560 if i % 3 else 430
        ImageDraw.Draw(c).rectangle([x0, y, x0 + w_bar, y + 10], fill=INK + (255,))
        if i in (1, 3, 4):
            ImageDraw.Draw(c).ellipse(
                [x0 - 46, y - 9, x0 - 18, y + 19], fill=RED + (255,)
            )

    c.alpha_composite(dot_field((330, H), "x", RED), (W - 330, 0))

    rule(c, 1250, 168, W - 360, 168)
    rule(c, 1250, y0 + 5 * gap + 76, W - 360, y0 + 5 * gap + 76)
    rule(c, 1130, 0, 1130, H, INK, 2, 60)

    # La cause est dans la salle, l'effet est dans la colonne.
    thread(c, [(742, 402), (1010, 402), (1090, 316), (1204, 316)])
    thread(c, [(372, ph_h + 196), (900, ph_h + 196), (1204, y0 + 3 * gap + 5)],
           node_start=True)
    return grain(c)


# --------------------------------------------------------------------------
# Plaque 2 — le même geste répété, et l'endroit où la boucle se referme.
# Sujet : la ressaisie quotidienne, et la seule intervention humaine qui reste.
# --------------------------------------------------------------------------
def plate_repetition() -> Image.Image:
    c = Image.new("RGBA", (W, H), PAPER + (255,))

    # Bandeau d'encre : la zone où plus personne ne regarde.
    ImageDraw.Draw(c).rectangle([0, 0, 760, H], fill=INK + (255,))

    # Trame inverse dans le noir : la même photo, illisible à force d'être répétée.
    src = photo("masterclass-acculturation.jpg", (620, 700), 0.5)
    from PIL import ImageOps

    neg = Image.merge("RGBA", (*ImageOps.invert(src.convert("RGB")).split(), src.getchannel("A")))
    c.alpha_composite(halftone(neg, cell=8, ink=PAPER), (70, 214))

    # Trois occurrences du même geste, décalées : la répétition est le sujet.
    step = photo("masterclass-acculturation.jpg", (250, 250), 0.62)
    for i in range(3):
        c.alpha_composite(step, (880 + i * 96, 150 + i * 62))

    # La sortie : une seule ligne, tenue par une main humaine.
    c.alpha_composite(photo("pleniere-prise-parole.jpg", (470, 620), 0.58), (1470, 300))
    c.alpha_composite(dot_field((520, 300), "y", RED), (760, H - 300))

    rule(c, 880, 92, W - 60, 92)
    rule(c, 880, H - 92, 1400, H - 92)

    # La boucle : le geste revient sur lui-même, puis casse vers la sortie.
    thread(c, [(1000, 460), (1000, 560), (1210, 560), (1210, 300)], arrow=False)
    thread(c, [(1130, 300), (1130, 244), (1290, 244)], node_start=False)
    thread(c, [(1348, 620), (1420, 620), (1420, 540), (1452, 540)])
    return grain(c)


def export(im: Image.Image, name: str) -> None:
    EXPORTS.mkdir(parents=True, exist_ok=True)
    WEB.mkdir(parents=True, exist_ok=True)
    im.convert("RGB").save(EXPORTS / f"{name}.png")
    web = im.convert("RGB")
    web.thumbnail((1400, 1400), Image.LANCZOS)
    web = web.filter(ImageFilter.UnsharpMask(radius=1.2, percent=55, threshold=3))
    web.save(WEB / f"{name}.jpg", quality=88, optimize=True, progressive=True)
    kb = (WEB / f"{name}.jpg").stat().st_size // 1024
    print(f"  → public/brand/editorial/plates/{name}.jpg  {web.size}  {kb} ko")


if __name__ == "__main__":
    export(plate_decision(), "plate-decision")
    export(plate_repetition(), "plate-repetition")
