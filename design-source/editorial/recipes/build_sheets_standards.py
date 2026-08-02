#!/usr/bin/env python3
"""SILICON-VALLEY-AI-PRODUCT-STANDARDS-V1 — planches pour Figma.

Les planches de benchmark sont composées à partir du document canonique
`docs/design-system/SILICON-VALLEY-AI-PRODUCT-STANDARDS.md`. Les planches de
produit assemblent les captures RÉELLES du harnais du hero.

Usage : python3 design-source/editorial/recipes/build_sheets_standards.py
"""
from pathlib import Path

from PIL import Image, ImageDraw, ImageFont

ROOT = Path(__file__).resolve().parents[3]
Q = ROOT / "docs/design-system/qa/hero-proof"
S = ROOT / "docs/design-system/qa/standards"
F = Path(__file__).parent

PAPER = (255, 253, 250)
INK = (12, 12, 13)
MUTED = (107, 110, 118)
FAINT = (150, 153, 160)
RED = (209, 19, 47)
W = 1440


def bc(s: int):
    return ImageFont.truetype(str(F / "BarlowCondensed-Black.ttf"), s)


def mono(s: int):
    return ImageFont.truetype("/System/Library/Fonts/Menlo.ttc", s)


def entete(c: Image.Image, titre: str, sous: str) -> int:
    d = ImageDraw.Draw(c)
    d.rectangle([64, 56, 76, 68], fill=RED)
    d.text((92, 42), titre, INK, bc(54))
    d.text((92, 106), sous, MUTED, mono(14))
    return 170


def enroule(texte: str, largeur: int, police) -> list[str]:
    mots, lignes, courante = texte.split(), [], ""
    for m in mots:
        essai = f"{courante} {m}".strip()
        if police.getlength(essai) > largeur and courante:
            lignes.append(courante)
            courante = m
        else:
            courante = essai
    if courante:
        lignes.append(courante)
    return lignes


def principes(nom: str, sous: str, lignes: list[tuple[str, str]],
              applicable: str, refuse: str) -> Image.Image:
    """Une planche par produit : ce qu'on prend, ce qu'on ne prend pas."""
    p14 = mono(14)
    corps = []
    for cle, val in lignes:
        corps.append((cle, enroule(val, W - 480, p14)))
    haut = sum(max(1, len(v)) * 24 + 16 for _, v in corps)
    c = Image.new("RGB", (W, 170 + haut + 260), PAPER)
    y = entete(c, nom.upper(), sous)
    d = ImageDraw.Draw(c)
    for cle, val in corps:
        d.line([(92, y - 10), (W - 92, y - 10)], (228, 226, 222), 1)
        d.text((92, y), cle.upper(), MUTED, mono(13))
        for i, l in enumerate(val):
            d.text((380, y + i * 24), l, INK, p14)
        y += max(1, len(val)) * 24 + 16

    y += 24
    d.rectangle([92, y, W - 92, y + 2], fill=INK)
    y += 20
    d.text((92, y), "CE QU'ON PREND", RED, mono(13))
    for i, l in enumerate(enroule(applicable, W - 480, p14)):
        d.text((380, y + i * 24), l, INK, p14)
    y += max(1, len(enroule(applicable, W - 480, p14))) * 24 + 24
    d.text((92, y), "CE QU'ON NE PREND PAS", MUTED, mono(13))
    for i, l in enumerate(enroule(refuse, W - 480, p14)):
        d.text((380, y + i * 24), l, FAINT, p14)
    return c


def matrice() -> Image.Image:
    """Le benchmark d'un coup d'œil : un principe retenu par produit."""
    rangs = [
        ("ChatGPT", "Entrée triviale, travail lourd déporté dans un objet"),
        ("Claude", "Objet autonome, versionné, modifiable de façon ciblée"),
        ("Linear", "Simple first · vocabulaire court · propriétaire nommé"),
        ("ElevenLabs", "Déployer, surveiller, améliorer · limites démontrées"),
        ("Vercel", "Complexity available, not required · traiter chaque état"),
        ("Stripe", "Les états ne se confondent jamais · rien d'engageant par accident"),
        ("Figma", "Tester le comportement · comparer deux directions au même instant"),
    ]
    c = Image.new("RGB", (W, 170 + len(rangs) * 74 + 230), PAPER)
    y = entete(c, "BENCHMARK", "PRINCIPES DE PRODUIT · AUCUNE ESTHÉTIQUE IMPORTÉE")
    d = ImageDraw.Draw(c)
    for nom, principe in rangs:
        d.line([(92, y - 12), (W - 92, y - 12)], (228, 226, 222), 1)
        d.text((92, y), nom.upper(), INK, bc(30))
        d.text((380, y + 8), principe, MUTED, mono(15))
        y += 74
    y += 20
    d.rectangle([92, y, W - 92, y + 2], fill=INK)
    y += 20
    d.text((92, y), "REFUSÉ", RED, mono(13))
    for i, l in enumerate([
        "La conversation comme interface principale.",
        "L'éditeur de graphe de nœuds.",
        "Le journal d'exécution en façade.",
        "La densité pour experts en première lecture.",
        "Toute couleur, tout composant, toute typographie de ces produits.",
    ]):
        d.text((380, y + i * 26), l, INK, mono(15))
    return c


def modele() -> Image.Image:
    """Les six standards Parrit, et les trois niveaux d'information."""
    std = [
        ("Object First", "L'objet métier au centre. Les agents ne sont visibles que par leurs effets."),
        ("Simple First", "L'expérience se comprend avec le seul niveau 1."),
        ("Progressive Disclosure", "Le niveau 3 n'est jamais affiché par défaut."),
        ("Human Ownership", "Qui décide, pourquoi, ce qui manque, et ce qui ne se produira pas."),
        ("Interruptibility", "Progression, pause, correction, annulation, reprise."),
        ("Concrete Output", "Préparé, validé, enregistré, envoyé, confirmé, échoué, annulé."),
    ]
    niveaux = [
        ("Niveau 1", "objet · état · action · décision · résultat", "toujours visible"),
        ("Niveau 2", "source · propriétaire · confiance · permission", "surfaces actives"),
        ("Niveau 3", "journaux · versions · règles · provenance", "jamais par défaut"),
    ]
    c = Image.new("RGB", (W, 170 + len(std) * 76 + len(niveaux) * 60 + 190), PAPER)
    y = entete(c, "MODÈLE PARRIT", "SIX STANDARDS · TROIS NIVEAUX D'INFORMATION")
    d = ImageDraw.Draw(c)
    for nom, txt in std:
        d.line([(92, y - 12), (W - 92, y - 12)], (228, 226, 222), 1)
        d.text((92, y), nom.upper(), INK, bc(28))
        d.text((450, y + 6), txt, MUTED, mono(15))
        y += 76
    y += 16
    d.rectangle([92, y, W - 92, y + 2], fill=INK)
    y += 22
    for nom, contenu, quand in niveaux:
        d.text((92, y), nom.upper(), RED if nom == "Niveau 3" else INK, mono(14))
        d.text((300, y), contenu, INK, mono(15))
        d.text((W - 92, y), quand.upper(), FAINT, mono(13), anchor="ra")
        y += 60
    return c


def bande(fichiers: list[tuple[str, str]], titre: str, sous: str, largeur: int) -> Image.Image:
    ims = []
    for f, lib in fichiers:
        im = Image.open(Q / f).convert("RGB")
        im.thumbnail((largeur, 1000), Image.LANCZOS)
        ims.append((im, lib))
    c = Image.new("RGB", (W, 170 + max(i.height for i, _ in ims) + 96), PAPER)
    y = entete(c, titre, sous)
    d = ImageDraw.Draw(c)
    x = 92
    for im, lib in ims:
        c.paste(im, (x, y))
        d.text((x, y + im.height + 18), lib.upper(), MUTED, mono(13))
        x += im.width + 18
    return c


def duo(g: Path, dr: Path, titre: str, sous: str, lg: str, ld: str,
        ng: list[str], nd: list[str]) -> Image.Image:
    a = Image.open(g).convert("RGB")
    b = Image.open(dr).convert("RGB")
    demi = W // 2 - 110
    a.thumbnail((demi, 900), Image.LANCZOS)
    b.thumbnail((demi, 900), Image.LANCZOS)
    c = Image.new("RGB", (W, 170 + max(a.height, b.height) + 90 + len(ng) * 28), PAPER)
    y = entete(c, titre, sous)
    d = ImageDraw.Draw(c)
    d.text((92, y), lg, MUTED, mono(14))
    d.text((W // 2 + 18, y), ld, RED, mono(14))
    y += 28
    for im, x in ((a, 92), (b, W // 2 + 18)):
        d.rectangle([x - 1, y - 1, x + im.width, y + im.height], outline=(226, 224, 220))
        c.paste(im, (x, y))
    y += max(a.height, b.height) + 30
    for i, (l, r) in enumerate(zip(ng, nd)):
        d.text((92, y + i * 28), l, MUTED, mono(14))
        d.text((W // 2 + 18, y + i * 28), r, INK, mono(14))
    return c


PRODUITS = [
    ("ChatGPT", "ENTRÉE SIMPLE · TRAVAIL DÉPORTÉ", [
        ("Point d'entrée", "Une zone de saisie unique, vide, sans configuration préalable."),
        ("Objet principal", "La conversation ; le travail lourd sort dans un objet séparé, éditable."),
        ("Travail long", "Un état d'avancement nommé plutôt qu'un compteur."),
        ("Rôle de l'humain", "Il redirige en cours de route ; il ne configure pas avant."),
        ("Interruption", "Arrêt immédiat, reformulation, reprise."),
    ],
     "L'entrée doit être triviale. Le travail complexe se déporte dans un objet dédié.",
     "La conversation comme interface principale. Parrit ne vend pas un chat."),
    ("Claude", "L'ARTEFACT VIT À CÔTÉ DE LA CONVERSATION", [
        ("Objet principal", "L'artefact : autonome, nommé, réutilisable, sorti du flux."),
        ("Travail long", "L'objet se construit pendant que la conversation continue."),
        ("Rôle de l'humain", "Il demande des modifications ciblées, pas une régénération complète."),
        ("Versions", "L'objet est versionné indépendamment de la conversation."),
    ],
     "Le modèle le plus proche du nôtre : séparer l'entrée, l'objet et le livrable.",
     "L'esthétique de l'éditeur, et l'idée qu'il faut converser pour obtenir un résultat."),
    ("Linear", "SIMPLE FIRST, POWERFUL LATER", [
        ("Objet principal", "L'issue, avec un propriétaire, un état, un cycle."),
        ("Progression", "Fondée sur le travail réel, pas sur une barre décorative."),
        ("Complexité", "Tout existe, presque rien n'est affiché."),
        ("Rôle de l'humain", "Ownership explicite : chaque objet a quelqu'un."),
    ],
     "Vocabulaire court et constant. Un propriétaire nommé sur chaque décision.",
     "La densité pour experts. Notre public en première lecture n'est pas technique."),
    ("ElevenLabs", "DÉPLOYER · SURVEILLER · AMÉLIORER", [
        ("Travail long", "Quatre temps lisibles : configurer, déployer, surveiller, améliorer."),
        ("Progression", "Des tests et des simulations avant la mise en production."),
        ("Complexité", "Sans code d'abord, kit de développement ensuite."),
        ("Rôle de l'humain", "Il pose les limites, écoute, corrige."),
    ],
     "La boucle déployer, surveiller, améliorer. Les limites se démontrent par le comportement.",
     "L'éditeur de workflow visuel : montrer un graphe de nœuds, c'est montrer notre plomberie."),
]

if __name__ == "__main__":
    S.mkdir(parents=True, exist_ok=True)
    sorties = [(matrice(), "sheet-benchmark-matrix"), (modele(), "sheet-parrit-model")]
    for nom, sous, lignes, prend, refuse in PRODUITS:
        sorties.append((principes(nom, sous, lignes, prend, refuse),
                        f"sheet-{nom.lower()}-principles"))

    sorties.append((
        bande([("ink-desktop-1-signal.png", "01 · Demande reçue"),
               ("ink-desktop-2-verification.png", "02 · Informations vérifiées"),
               ("ink-desktop-3-manque.png", "03 · Contexte manquant"),
               ("ink-desktop-4-decision.png", "04 · Validation humaine"),
               ("ink-desktop-5-sortie.png", "05 · Action préparée")],
              "DIVULGATION PROGRESSIVE",
              "UN CHAPITRE À LA FOIS · AUCUN NIVEAU 3 AFFICHÉ", 245),
        "sheet-progressive-disclosure"))

    sorties.append((
        duo(Q / "ink-desktop-4-decision.png", Q / "ink-desktop-5-sortie.png",
            "OWNERSHIP ET SORTIE",
            "QUI DÉCIDE · CE QUI EST PRÉPARÉ, ET CE QUI NE PART PAS",
            "VALIDATION HUMAINE", "ACTION PRÉPARÉE",
            ["L'action proposée est montrée avant.",
             "La décision porte un visage réel.",
             "Aucune sortie n'existe encore."],
            ["Préparé n'est pas envoyé.",
             "Trois destinations, pas une de plus.",
             "Rien n'a été envoyé sans vous."]),
        "sheet-ownership-output"))

    sorties.append((
        bande([("ink-mobile-1-signal.png", "01 · Signal"),
               ("ink-mobile-3-manque.png", "03 · Contexte manquant"),
               ("ink-mobile-5-sortie.png", "05 · Action préparée")],
              "MOBILE · ONE MOMENT",
              "UNE SEULE TRANSFORMATION MAJEURE PAR ÉCRAN", 300),
        "sheet-mobile-one-moment"))

    for im, name in sorties:
        im.save(S / f"{name}.png")
        print(f"  → {name}.png  {im.size}")
