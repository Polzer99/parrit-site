#!/usr/bin/env python3
"""PARRIT-TECH-TRUST-V1 — portraits brandés.

RÈGLE D'OR PARRIT, non négociable : le portrait part TOUJOURS d'une vraie
photographie. Jamais 100 % IA. Le modèle ne fabrique pas un visage : il
rhabille la lumière et le décor autour du visage réel fourni en entrée.

Ce que le modèle a le droit de faire :
  recadrer, changer le fond, refaire la lumière, passer en noir et blanc.
Ce qu'il n'a pas le droit de faire :
  modifier la morphologie, lisser la peau, changer l'âge, inventer une tenue
  spectaculaire, ajouter un logo, ajouter du texte, fabriquer une scène client.

Sorties : design-source/editorial/exports/branded-*.png
          public/brand/editorial/portraits/*-branded.png

Usage : python3 design-source/editorial/recipes/build_branded.py [nom ...]
"""
import base64
import json
import mimetypes
import os
import sys
import urllib.request
from pathlib import Path

from PIL import Image

HERE = Path(__file__).parent
ROOT = HERE.parents[2]
ORIG = ROOT / "design-source/editorial/originals"
EXPORTS = ROOT / "design-source/editorial/exports"
WEB = ROOT / "public/brand/editorial/portraits"

ENV = Path.home() / "parrit-os/signals/.env"
if ENV.exists():
    for line in ENV.read_text().splitlines():
        line = line.strip()
        if line and not line.startswith("#") and "=" in line:
            k, v = line.split("=", 1)
            os.environ.setdefault(k.strip(), v.strip().strip('"').strip("'"))

MODELS = ["gemini-3-pro-image-preview", "gemini-2.5-flash-image"]

# Système visuel canon : design system v1.0. Le pack v1.1 (#F8F5EF, Barlow en
# tokens) a été rejeté ; gen_plates.py utilisait encore l'ancienne valeur.
STYLE = """PARRIT VISUAL SYSTEM, apply exactly:
Background: warm off-white paper #FFFDFA with a very fine, almost invisible paper grain.
Subject: black-and-white documentary photography, natural contrast, real skin texture kept.
Exactly one editorial red is allowed, #D1132F, and only as a flat geometric field or a
thin straight rule. Square geometry, no rounded corners, no shadow, no glow, no gradient.
Editorial magazine framing with generous negative space.

STRICTLY FORBIDDEN: any text, any lettering, any logo, any watermark, any user interface,
any screen, any chart, blue or purple gradients, neon, holograms, bokeh lights, lens flare,
3D render look, plastic skin, beauty retouching, teeth whitening, jaw or nose reshaping,
added muscles, changed hairline, stock-photo posing, fake colleagues, fake office."""

IDENTITY = """IDENTITY LOCK, this is the most important instruction:
The face in the supplied photograph is a real person. Reproduce that exact face.
Keep the facial proportions, the bone structure, the eyes, the nose, the mouth, the hairline,
the hair colour and the stubble exactly as they are in the source image.
Keep the person's real age. Keep the real skin, including its irregularities.
Do not beautify. Do not slim. Do not idealise. If in doubt, stay closer to the photograph."""

SHOTS = {
    "paul-authority": {
        "source": "paul-founder-2026-08-01.jpg",
        "prompt": """Editorial founder portrait, waist up, subject facing the camera,
calm and direct, a small honest smile. He keeps the same dark pinstripe suit jacket over the
same plain white t-shirt as in the photograph. Studio-clean off-white paper background.
A single flat red #D1132F rectangle sits behind him on the right third, cropped by the frame
edge, acting as a ground for the silhouette. Soft directional light from the left.
The register is a serious technology operator, not a corporate headshot and not a fashion shot.""",
    },
    "paul-working": {
        "source": "paul-founder-2026-08-01.jpg",
        "prompt": """Editorial working portrait, three quarter view, the subject looking down
and slightly to the left at something he is reading or checking, mid-thought, not posing for
the camera. Same dark pinstripe suit jacket over the same plain white t-shirt.
Off-white paper background, no office, no desk props, no computer, no screen.
A single thin red #D1132F horizontal rule crosses the frame behind him at shoulder height.
The register is someone concentrating on a decision, quiet and competent.""",
    },
}


def part_img(p: Path) -> dict:
    mime = mimetypes.guess_type(p.name)[0] or "image/jpeg"
    return {"inline_data": {"mime_type": mime, "data": base64.b64encode(p.read_bytes()).decode()}}


def generate(name: str, spec: dict) -> bool:
    src = ORIG / spec["source"]
    if not src.exists():
        print(f"  {name}: source absente, {src}")
        return False

    key = os.environ.get("GOOGLE_API_KEY")
    if not key:
        print("  GOOGLE_API_KEY absente, génération impossible")
        return False

    prompt = f"{spec['prompt']}\n\n{IDENTITY}\n\n{STYLE}"
    body = json.dumps(
        {"contents": [{"parts": [part_img(src), {"text": prompt}]}]}
    ).encode()

    for model in MODELS:
        url = (
            f"https://generativelanguage.googleapis.com/v1beta/models/"
            f"{model}:generateContent?key={key}"
        )
        req = urllib.request.Request(
            url, data=body, headers={"Content-Type": "application/json"}
        )
        try:
            with urllib.request.urlopen(req, timeout=300) as r:
                data = json.load(r)
        except Exception as e:  # réseau, quota, modèle indisponible
            print(f"  {name} / {model} : {e}")
            continue

        for cand in data.get("candidates", []):
            for part in cand.get("content", {}).get("parts", []):
                blob = part.get("inlineData") or part.get("inline_data")
                if not blob:
                    continue
                EXPORTS.mkdir(parents=True, exist_ok=True)
                WEB.mkdir(parents=True, exist_ok=True)
                raw = EXPORTS / f"branded-{name}.png"
                raw.write_bytes(base64.b64decode(blob["data"]))

                im = Image.open(raw).convert("RGB")
                out = im.copy()
                out.thumbnail((1200, 1600), Image.LANCZOS)
                out.save(WEB / f"{name}-branded.png", optimize=True)
                kb = (WEB / f"{name}-branded.png").stat().st_size // 1024
                print(f"  → {name}-branded.png  {out.size}  {kb} ko  ({model})")
                return True
        print(f"  {name} / {model} : aucune image renvoyée")
    return False


if __name__ == "__main__":
    wanted = sys.argv[1:] or list(SHOTS)
    for n in wanted:
        if n not in SHOTS:
            print(f"  {n}: inconnu. Disponibles : {', '.join(SHOTS)}")
            continue
        generate(n, SHOTS[n])
