#!/usr/bin/env python3
"""PARRIT-TECH-TRUST-V1 — portrait de référence du fondateur.

Source retenue par Paul le 01/08/2026 :
  design-source/editorial/originals/paul-founder-2026-08-01.jpg

Photographie réelle. Aucune génération de visage, aucune retouche de
morphologie, aucun lissage de peau, aucune tenue inventée. Les seules
opérations sont : détourage, recadrage, désaturation, courbe de contraste.

Trois sorties, pour trois rôles distincts dans la page :
  paul-founder-cutout.png    silhouette complète, couleur, présence humaine
  paul-founder-bw.png        silhouette complète, noir et blanc documentaire
  paul-founder-gate.png      buste serré, noir et blanc, pour la validation

Usage : python3 design-source/editorial/recipes/build_founder.py
"""
from pathlib import Path

from PIL import Image

from build_portraits import to_bw, trim, MASKS, ORIG, EXPORTS, WEB

SRC = "paul-founder-2026-08-01.jpg"


def clean_edge(im: Image.Image) -> Image.Image:
    """Décontamination de frange, avec le fond MESURÉ sur la photo.

    `build_portraits.decontaminate` suppose un fond clair, ce qui est vrai des
    photos de jardin. Ici le fond est une salle sombre : soustraire un fond
    clair noircissait la frange et posait un halo gris sur papier.

    On mesure donc la couleur médiane des pixels réellement transparents,
    on lisse l'alpha pour supprimer l'escalier du masque, et on rogne d'un
    pixel pour que le liseré du fond ne survive pas.
    """
    import numpy as np
    from PIL import ImageFilter

    # Le masque brut est en escalier : un flou d'un demi-pixel suffit, plus
    # dissoudrait les mèches de cheveux.
    alpha_img = im.getchannel("A").filter(ImageFilter.GaussianBlur(0.6))
    # Rognage d'un pixel : la frange appartient au fond, pas au sujet.
    alpha_img = alpha_img.point(lambda v: max(0, min(255, int((v - 26) * 1.12))))

    a = np.asarray(im.convert("RGB")).astype(np.float32)
    alpha = np.asarray(alpha_img).astype(np.float32)[..., None] / 255.0

    outside = alpha[..., 0] < 0.02
    bg = np.median(a[outside], axis=0) if outside.sum() > 500 else np.array([40.0, 40.0, 40.0])

    edge = (alpha > 0.02) & (alpha < 0.98)
    safe = np.clip(alpha, 0.40, 1.0)
    fixed = (a - bg * (1.0 - alpha)) / safe
    rgb = np.where(edge, np.clip(fixed, 0, 255), a)

    print(f"  fond mesuré RVB {tuple(int(v) for v in bg)}")
    return Image.fromarray(
        np.concatenate([rgb, alpha * 255.0], axis=-1).astype("uint8"), "RGBA"
    )


def neutralise_cast(im: Image.Image) -> Image.Image:
    """La verdure éclairée derrière la baie pose une dominante verte sur
    l'épaule gauche. C'est une dominante de lumière, pas la couleur du
    vêtement : on la retire, on ne retouche rien d'autre."""
    r, g, b, a = im.split()
    g = g.point(lambda v: int(v * 0.955))
    b = b.point(lambda v: min(255, int(v * 1.012)))
    return Image.merge("RGBA", (r, g, b, a))


def cutout() -> Image.Image:
    """Détourage avec couche alpha. Le fond est un intérieur sombre et
    encombré : le modèle généraliste s'en sort mieux que le modèle portrait."""
    from rembg import remove, new_session

    src = Image.open(ORIG / SRC).convert("RGB")
    out = remove(
        src,
        session=new_session("isnet-general-use"),
        alpha_matting=True,
        alpha_matting_foreground_threshold=250,
        alpha_matting_background_threshold=10,
        alpha_matting_erode_size=8,
    ).convert("RGBA")
    out = neutralise_cast(clean_edge(out))
    out.getchannel("A").save(MASKS / "paul-founder-alpha.png")
    return trim(out, pad=12)


def gate(cut: Image.Image) -> Image.Image:
    """Buste serré. Le cadrage part du haut de la silhouette détourée : le
    visage est le sujet, la salle et les jambes ne le sont pas."""
    w, h = cut.size
    # La tête occupe environ le premier quart d'une silhouette debout.
    box = (int(w * 0.10), 0, int(w * 0.92), int(h * 0.34))
    crop = cut.crop(box)
    return to_bw(crop, 1.34, 24, 234)


def main() -> None:
    for d in (MASKS, EXPORTS, WEB):
        d.mkdir(parents=True, exist_ok=True)

    cut = cutout()
    cut.save(EXPORTS / "paul-founder-cutout.png")
    print(f"  détourage {cut.size}")

    bw = to_bw(cut, 1.30, 20, 238)
    bw.save(EXPORTS / "paul-founder-bw.png")

    g = gate(cut)
    g.save(EXPORTS / "paul-founder-gate.png")

    from build_portraits import web

    # Le costume est un dégradé de bleus très proches : la quantification
    # octree le transforme en aplats. Cette sortie reste en RGBA pleine.
    col = cut.copy()
    col.thumbnail((900, 3600), Image.LANCZOS)
    col.save(WEB / "paul-founder-cutout.png", optimize=True)
    print(
        f"  → public/brand/editorial/portraits/paul-founder-cutout.png  {col.size}"
        f"  {(WEB / 'paul-founder-cutout.png').stat().st_size // 1024} ko"
    )
    web(bw, "paul-founder-bw.png", 900, colors=120)
    web(g, "paul-founder-gate.png", 640, colors=110)


if __name__ == "__main__":
    main()
