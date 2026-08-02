#!/usr/bin/env python3
"""PARRIT-TECH-TRUST-POLISH-V2 — portrait fondateur, cadrage documentaire.

Remplace le détourage pleine hauteur de la section fondateur, qui donnait une
silhouette publicitaire flottante. Ici le fond réel est conservé : c'est une
photographie, pas une découpe.

AUCUNE OPÉRATION GÉNÉRATIVE. Le visage n'est ni régénéré, ni corrigé, ni
embelli. Les seules opérations sont : recadrage, désaturation, courbe de
contraste, grain argentique. Aucun modèle d'image n'intervient.

Source : design-source/editorial/originals/paul-founder-2026-08-01.jpg

Usage : python3 design-source/editorial/recipes/build_founder_bust.py
"""
from pathlib import Path

from PIL import Image, ImageEnhance, ImageOps

ROOT = Path(__file__).resolve().parents[3]
ORIG = ROOT / "design-source/editorial/originals"
EXPORTS = ROOT / "design-source/editorial/exports"
WEB = ROOT / "public/brand/editorial/portraits"

SRC = "paul-founder-2026-08-01.jpg"


def bust() -> Image.Image:
    """Cadrage buste, 4:5. Le sujet est décentré vers la droite : la salle
    reste lisible à gauche, c'est elle qui rend la photo documentaire."""
    im = Image.open(ORIG / SRC).convert("RGB")
    w, h = im.size  # 1200 x 1600

    # Mesuré sur la source : la tête occupe x 563-699, y 65-192. Le buste
    # descend au milieu du torse. Cadrage 4:5, sujet légèrement décentré à
    # droite pour que la salle reste lisible et rende la photo documentaire.
    box = (360, 22, 890, 684)
    crop = im.crop(box)
    return crop


def grade(im: Image.Image) -> Image.Image:
    """Noir et blanc documentaire. Le fond reste lisible mais recule ;
    le visage garde sa texture."""
    g = ImageOps.grayscale(im)
    g = ImageEnhance.Contrast(g).enhance(1.22)
    # Courbe douce : on ouvre les noirs pour ne pas boucher la salle,
    # on retient les hautes lumières pour ne pas brûler le t-shirt.
    lut = []
    for i in range(256):
        v = i / 255.0
        v = 0.045 + v * 0.93
        v = v ** 0.96
        lut.append(max(0, min(255, int(v * 255))))
    return g.point(lut).convert("RGB")


def grain(im: Image.Image, amount: float = 4.2) -> Image.Image:
    """Grain argentique fin. Graine fixe : recette reproductible."""
    import numpy as np

    rng = np.random.default_rng(20260801)
    noise = rng.normal(0, amount, (im.height, im.width, 1))
    a = np.asarray(im).astype(np.float32) + noise
    return Image.fromarray(np.clip(a, 0, 255).astype("uint8"), "RGB")


def main() -> None:
    EXPORTS.mkdir(parents=True, exist_ok=True)
    WEB.mkdir(parents=True, exist_ok=True)

    b = grain(grade(bust()))
    b.save(EXPORTS / "paul-founder-bust.png")

    out = b.copy()
    out.thumbnail((960, 1200), Image.LANCZOS)
    out.save(WEB / "paul-founder-bust.jpg", quality=90, optimize=True, progressive=True)
    kb = (WEB / "paul-founder-bust.jpg").stat().st_size // 1024
    print(f"  → public/brand/editorial/portraits/paul-founder-bust.jpg  {out.size}  {kb} ko")

    # Vignette carrée du HumanGate, recadrée sur le visage, même traitement.
    # Visage relevé sur grille dans la source : x 552-695, y 84-316. Le menton
    # descend à 316 : le carré va jusqu'à 344 pour ne pas le couper.
    face = grade(Image.open(ORIG / SRC).convert("RGB").crop((483, 66, 761, 344)))
    face = grain(face, 3.0)
    face.thumbnail((360, 360), Image.LANCZOS)
    face.save(WEB / "paul-gate.jpg", quality=90, optimize=True)
    print(
        f"  → public/brand/editorial/portraits/paul-gate.jpg  {face.size}"
        f"  {(WEB / 'paul-gate.jpg').stat().st_size // 1024} ko"
    )


if __name__ == "__main__":
    main()
