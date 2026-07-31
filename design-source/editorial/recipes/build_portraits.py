#!/usr/bin/env python3
"""PARRIT-VISUAL-RESET-V2 — portraits éditoriaux, recette reproductible.

Part TOUJOURS de vraies photographies. Aucune génération de visage, aucune
retouche de morphologie, aucun lissage de peau. Les seules opérations sont :
détourage, désaturation, courbe de contraste, trame de demi-teintes.

Sources (règle d'or Parrit) :
  ~/parrit-os/tools/clones-loupe/photos/refs/paul/

Sorties :
  design-source/editorial/originals/  copies des sources retenues (jamais écrasées)
  design-source/editorial/masks/      masques alpha en niveaux de gris
  design-source/editorial/exports/    variantes pleine résolution
  public/brand/editorial/portraits/   exports web réellement servis

Usage : python3 design-source/editorial/recipes/build_portraits.py
"""
from pathlib import Path
import shutil

from PIL import Image, ImageOps, ImageDraw, ImageEnhance

ROOT = Path(__file__).resolve().parents[3]
SRC = Path.home() / "parrit-os/tools/clones-loupe/photos/refs/paul"
ORIG = ROOT / "design-source/editorial/originals"
MASKS = ROOT / "design-source/editorial/masks"
EXPORTS = ROOT / "design-source/editorial/exports"
WEB = ROOT / "public/brand/editorial/portraits"

INK = (12, 12, 13)
RED = (209, 19, 47)
PAPER = (255, 253, 250)

# Photo source -> rôle. Choisies pour ce qu'elles montrent, pas pour leur cadrage.
#   frontal   : regard direct, posture posée, registre manifeste
#   roses     : sourire réel, registre chaleureux
SOURCES = {
    "paul-frontal-01.jpg": "manifeste",
    "paul-roses.jpg": "chaleureux",
}


def ensure_dirs() -> None:
    for d in (ORIG, MASKS, EXPORTS, WEB):
        d.mkdir(parents=True, exist_ok=True)


def copy_originals() -> None:
    """La photo source n'est jamais modifiée ni écrasée."""
    for name in SOURCES:
        dst = ORIG / name
        if not dst.exists():
            shutil.copy2(SRC / name, dst)


def cutout(name: str) -> Image.Image:
    """Détourage réel avec couche alpha. Le masque est conservé séparément."""
    from rembg import remove, new_session

    session = new_session("isnet-general-use")
    src = Image.open(ORIG / name).convert("RGB")
    out = remove(
        src,
        session=session,
        alpha_matting=True,
        alpha_matting_foreground_threshold=248,
        alpha_matting_background_threshold=12,
        alpha_matting_erode_size=6,
    ).convert("RGBA")

    # Anti-halo : on décontamine les pixels semi-transparents, dont les cheveux.
    # Sans ça, la frange claire de la photo laisse un liseré blanc sur fond noir.
    out = decontaminate(out)
    (MASKS / f"{Path(name).stem}-alpha.png").write_bytes(b"")
    out.getchannel("A").save(MASKS / f"{Path(name).stem}-alpha.png")
    return out


def decontaminate(im: Image.Image) -> Image.Image:
    """Retire la frange de fond héritée dans les pixels partiellement opaques."""
    import numpy as np

    a = np.asarray(im).astype(np.float32)
    rgb, alpha = a[..., :3], a[..., 3:4] / 255.0
    edge = (alpha > 0.02) & (alpha < 0.98)
    # Sur la frange, on suppose une composition source = premier plan * a + fond * (1-a).
    # Le fond des deux photos est clair (ciel, mur) : on le soustrait.
    # `safe` borne la division : trop bas, la frange vire au gris sale sur papier ;
    # trop haut, le liseré clair du fond survit sur fond noir. 0,40 tient les deux.
    bg = np.array([232.0, 236.0, 240.0])
    safe = np.clip(alpha, 0.40, 1.0)
    fixed = (rgb - bg * (1.0 - alpha)) / safe
    rgb = np.where(edge, np.clip(fixed, 0, 255), rgb)
    return Image.fromarray(
        np.concatenate([rgb, alpha * 255.0], axis=-1).astype("uint8"), "RGBA"
    )


def to_bw(im: Image.Image, contrast: float, black: int, white: int) -> Image.Image:
    """Noir et blanc documentaire. `black`/`white` posent les points de courbe."""
    alpha = im.getchannel("A")
    grey = ImageOps.grayscale(im.convert("RGB"))
    grey = ImageEnhance.Contrast(grey).enhance(contrast)
    lut = []
    for i in range(256):
        if i <= black:
            v = 0
        elif i >= white:
            v = 255
        else:
            v = int(round(255 * (i - black) / (white - black)))
        lut.append(v)
    grey = grey.point(lut)
    out = Image.merge("RGBA", (grey, grey, grey, alpha))
    return out


def halftone(im: Image.Image, cell: int, ink=INK) -> Image.Image:
    """Trame de demi-teintes éditoriale : un point par cellule, rayon = densité.

    Grille tournée à 45°, comme une trame d'impression offset. Le rendu est
    volontairement grossier : la trame doit se voir, c'est le sujet.
    """
    import math

    base = to_bw(im, 1.15, 18, 238)
    grey = base.convert("L")
    alpha = base.getchannel("A")
    w, h = grey.size

    out = Image.new("RGBA", (w, h), (0, 0, 0, 0))
    sup = 3  # suréchantillonnage, pour des points nets sans crénelage
    layer = Image.new("L", (w * sup, h * sup), 0)
    draw = ImageDraw.Draw(layer)

    ang = math.radians(45)
    cos_a, sin_a = math.cos(ang), math.sin(ang)
    diag = int(math.hypot(w, h)) + cell * 2
    px, pa = grey.load(), alpha.load()

    for gy in range(-diag // cell, diag // cell):
        for gx in range(-diag // cell, diag // cell):
            # Centre de cellule dans le repère tourné, ramené dans l'image.
            ux, uy = gx * cell, gy * cell
            x = ux * cos_a - uy * sin_a + w / 2
            y = ux * sin_a + uy * cos_a + h / 2
            ix, iy = int(x), int(y)
            if not (0 <= ix < w and 0 <= iy < h) or pa[ix, iy] < 24:
                continue
            density = 1.0 - px[ix, iy] / 255.0
            r = (cell / 2.0) * (density ** 0.62) * 1.28
            if r < 0.35:
                continue
            draw.ellipse(
                [(x - r) * sup, (y - r) * sup, (x + r) * sup, (y + r) * sup], fill=255
            )

    dots = layer.resize((w, h), Image.LANCZOS)
    from PIL import ImageChops

    dots = ImageChops.multiply(dots, alpha)
    solid = Image.new("RGBA", (w, h), ink + (255,))
    out.paste(solid, (0, 0), dots)
    return out


def warm(im: Image.Image) -> Image.Image:
    """Version chaleureuse : couleur conservée, densité relevée, ton papier.

    On ne fabrique pas une sympathie qui n'est pas sur la photo. On évite
    seulement de la détruire en passant en noir et blanc dur.
    """
    alpha = im.getchannel("A")
    rgb = im.convert("RGB")
    rgb = ImageEnhance.Color(rgb).enhance(0.42)
    rgb = ImageEnhance.Contrast(rgb).enhance(1.08)
    rgb = ImageEnhance.Brightness(rgb).enhance(1.03)
    r, g, b = rgb.split()
    r = r.point(lambda i: min(255, int(i * 1.035 + 4)))
    b = b.point(lambda i: max(0, int(i * 0.965)))
    return Image.merge("RGBA", (r, g, b, alpha))


def trim(im: Image.Image, pad: int = 24) -> Image.Image:
    box = im.getchannel("A").getbbox()
    if not box:
        return im
    x0, y0, x1, y1 = box
    x0, y0 = max(0, x0 - pad), max(0, y0 - pad)
    x1, y1 = min(im.width, x1 + pad), min(im.height, y1 + pad)
    return im.crop((x0, y0, x1, y1))


def web(im: Image.Image, name: str, width: int, colors: int = 160) -> None:
    """Export réellement servi par le site. Quantifié : ces images pèsent lourd
    en PNG 32 bits alors qu'elles n'ont presque pas de couleurs."""
    out = im.copy()
    out.thumbnail((width, width * 4), Image.LANCZOS)
    out = out.quantize(colors=colors, method=Image.FASTOCTREE, dither=Image.NONE)
    path = WEB / name
    out.save(path, optimize=True)
    kb = path.stat().st_size // 1024
    print(f"  → public/brand/editorial/portraits/{name}  {out.size}  {kb} ko")


def main() -> None:
    ensure_dirs()
    copy_originals()

    for name, role in SOURCES.items():
        stem = Path(name).stem
        print(f"{name} ({role})")
        cut = trim(cutout(name))
        cut.save(EXPORTS / f"{stem}-cutout.png")

        bw = to_bw(cut, 1.42, 26, 232)
        bw.save(EXPORTS / f"{stem}-bw.png")

        ht = halftone(cut, cell=9)
        ht.save(EXPORTS / f"{stem}-halftone.png")

        wm = warm(cut)
        wm.save(EXPORTS / f"{stem}-warm.png")

        if role == "chaleureux":
            web(wm, "paul-warm.png", 1100, colors=200)
            web(cut, "paul-cutout.png", 1100, colors=200)
        else:
            web(bw, "paul-bw.png", 1200, colors=96)
            web(halftone(cut, cell=7), "paul-halftone.png", 1200, colors=24)
            # Manifeste : noir et blanc extrême, presque une sérigraphie.
            man = to_bw(cut, 2.1, 62, 196)
            man.save(EXPORTS / f"{stem}-manifesto.png")
            web(man, "paul-manifesto.png", 1400, colors=48)
            # La trame à l'encre disparaît sur fond sombre : il faut la trame
            # inverse, points couleur papier, pour les compositions en négatif.
            neg = Image.merge(
                "RGBA",
                (*ImageOps.invert(cut.convert("RGB")).split(), cut.getchannel("A")),
            )
            inv = halftone(neg, cell=7, ink=PAPER)
            inv.save(EXPORTS / f"{stem}-halftone-inverse.png")
            web(inv, "paul-halftone-inverse.png", 1200, colors=24)


if __name__ == "__main__":
    main()
