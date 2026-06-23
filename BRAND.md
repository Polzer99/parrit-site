> ⚠️ SUPERSÉDÉ le 23/06 par la DA Parrit Template — BACKUP. Tokens canon = `#F5F8FF` / `#161616` / `#2E2D2B` / `#AA0003` / `#C67C60`, Hanken Grotesk + JetBrains Mono. Source = `design-source/DA-TOKENS-EXTRACTED.md` + `src/app/globals.css`. Le logotype PARRIT·AI + sceau 速 reste valable.

# PARRIT·AI — Direction Artistique (source de vérité historique)

> DA livrée par l'agence de branding (juin 2026, inputs humains). **Ce fichier fait foi.**
> Toute UI Parrit (site, propale, deck, OG, signature, dashboard) part d'ici.
> Les tokens vivent dans `src/app/globals.css` (`:root`) + `src/app/[lang]/layout.tsx` (fonts).
> Hérite et préserve l'ADN PostHog (papier, desktop-OS, neo-brutalist) + Pancake (constellation).

> **🔑 RÈGLE DE RÉCONCILIATION (Paul, 12/06) :** couleurs + polices = **100 % DA agence**.
> PostHog & Pancake ne servent plus que pour les **FORMES** (constellation, flux pointillé,
> window-chrome, cartes neo-brutalist, desktop-OS) — **jamais** leurs couleurs/typos d'origine
> (fini le caramel, le sage, le violet, le serif calligraphique décoratif, l'arc-en-ciel d'accents).

---

## 1. Logo

Système livré : 16 wordmarks + 6 icônes, en **SVG** (vectoriel = maître) et PNG.
Master set complet : `public/brand/logo-system/` (22 SVG).

Alias canoniques (à utiliser en code) :

| Fichier | Usage |
|---|---|
| `public/brand/parrit-lockup.svg` | **Lockup principal** — `PARRIT[速]AI`, sceau rouge imbriqué. Hero, headers. |
| `public/brand/parrit-wordmark.svg` | `PARRIT·AI` + sceau à droite. Nav, pied de page. |
| `public/brand/parrit-stacked.svg` | Sceau **au-dessus** du wordmark. Lockup centré (cartes, propales). |
| `public/brand/parrit-reversed.svg` | Wordmark **blanc** `#FFFDFA`. Fonds sombres. |
| `public/brand/parrit-seal.svg` | Sceau 速 rouge + cercle. Favicon, avatar, tampon. |
| `public/brand/parrit-seal-mono.svg` | Sceau 速 noir. Mono / gravure. |

- **Wordmark** : serif romain à très fort contraste (vectorisé dans le SVG — pas besoin de webfont).
- **Sceau 速** (*sù*, « rapide / vitesse ») : caractère au pinceau dans un cachet brossé. C'est la signature franco-chinoise. **Ne jamais redessiner** — toujours réutiliser le SVG.
- Espace de protection ≥ la hauteur du sceau autour du lockup.
- ❌ Anciens logos retirés : placeholder « P » (`icon.svg` v1) et emblème perroquet `public/emblem.png` (`導航興智慧`).

## 2. Couleurs

| Token | Hex | Rôle |
|---|---|---|
| `--bg` | `#FEFDF9` | Papier crème — fond par défaut |
| `--text` | `#0C0C0D` | Encre — texte, traits, bordures, CTA |
| `--parrit-red` / `--accent` | `#D1132F` | Rouge chinois — sceau, accents, chips, ombres |
| `--accent-hover` | `#B10F27` | Rouge foncé (hover) |
| `--bg-dark` | `#0C0C0D` | Sections sombres = encre |
| `--text-muted` | `#4A4A4E` | Gris neutre secondaire |
| `--border` | `rgba(12,12,13,.10)` | Filets |

Palette **resserrée** (décision Paul 12/06) : crème + encre + rouge, point.
Le caramel `#c8956c`, le sage `#5FAF8E`, le violet formation `#7C5BA1` sont **retirés**
(micro-accents fonctionnels tolérés). Tint rouge des chips : `rgba(209,19,47,.07)` + bord `.20`.

⚠️ **Changement vs canon précédent** : le rouge passe de `#C44536` → **`#D1132F`** (agence = source de vérité).

## 3. Typographie — système à 3 niveaux

| Axe | Police | Rôle | Token |
|---|---|---|---|
| **Serif / display** | Cormorant Garamond | Moments de marque, éditorial. Le **wordmark** lui-même est le SVG agence. | `--font-heading` |
| **Sans** | DM Sans (700 = titres) | **Headlines marketing** + corps. | `--font-body` |
| **Mono** | JetBrains Mono | **Labels, chips, eyebrows, coordonnées, code.** Signature « desktop-OS ». | `--font-mono` |

Règle : *brand = serif (ou wordmark SVG) · titres marketing = sans bold · métadonnées = mono.*

## 4. Composants signature

- **Chips** : mono, rouge sur pastille rouge-teintée, coins 6px. (`.parrit-os-chip`)
- **CTA neo-brutalist franco-chinois** : fond encre, texte crème, **ombre dure rouge** `5px 5px 0 var(--parrit-red)`, hover 7px. (`.parrit-os-cta`)
- **Cartes** : fond blanc/crème, bord 2px encre, coins 16px, ombre douce `6px 6px 0 rgba(12,12,13,.12)`.
- **Window-chrome** PostHog (barre + 3 traffic-lights + titre mono centré) : conservé.
- **Texture papier** : fractalNoise opacity ~0.04 sur les surfaces claires.

## 5. Photographie

Grain **analogique chaud** (film), aspirationnelle, métaphore effort/ascension
(fumée, architecture en contre-plongée, sommet/randonneurs, cassette, phare auto).
❌ pas de stock photo plate, pas de 3D corporate.

## 6. Logos clients

**Override §5/§6 (décision Paul 12/06)** : les vrais logos clients sont désormais
**autorisés sur le site public** (mur de logos, niveaux de gris) — comme la bannière agence
(Lavazza, SNCF, Joone, Clevery, EFI, Carte Noire, Laparra…).
> À FAIRE : sourcer les SVG officiels de ces marques (`public/brand/clients/`). En attendant, mur en placeholder texte stylé.

## 6 bis. Voix / copy — DOCTRINE COMMUNICATION (REGLES-DOR §24)

Tout texte du site passe **LE TAMIS** (8 filtres) de `parrit-os/docs/doctrine-communication/DOCTRINE-COMMUNICATION.md`.
En clair, sur ce site :
- **Posture** = « Operating Partner » (pair-à-pair, on déploie ET on opère). **Paul & Yukun = « AI Manager ».**
- **Autorité démontrée, pas décrétée** : on montre des faits (« en production », « déjà déployé »), on ne se positionne **jamais contre** (❌ « pas des slides », « pas un audit »).
- **Enargeia, pas pathos** : durées, volumes, process concrets — zéro adjectif émotionnel.
- **Sobriété** : couper 20 % des mots · **pas de tiret cadratin `—`** · pas de jargon opaque (RAG, agents cognitifs, transfo digitale).
- **Détachement** : pas de CTA mendiant ni question rhétorique.
- **Anonymat éditorial** : les cas restent anonymisés dans le TEXTE (§5/§6). Le **mur de logos clients** = preuve **visuelle** (décision Paul, override §5/§6) — distincte du texte, qui lui reste anonyme.

## 7. Anti-patterns

❌ Vercel.app en sortie runtime (REGLES-DOR §13) · ❌ jargon IA (« disruption », « GenAI »)
· ❌ dark-mode SaaS US froid · ❌ McKinsey plat · ❌ redessiner le sceau.

## 8. Dette / queue de nettoyage

**Palette dette = RÉSORBÉE (13/06).** Tout le retired (`#5FAF8E` sage, `#c8956c`/`#b8814c` caramel,
`#7C5BA1` violet, `#C44536` ancien rouge, `#2A2420` brun, `#1a1410`) a été purgé sur **toutes** les
surfaces publiques (home + modals + sprint/audit/setup/remote + glossaire + academy + fondateurs + OG image).
Résultat : 0 hex retired hors `--token`, et **0 texte noir-sur-noir** (CTA panels Cas/Paul, bouton
QuickContact, statuts) — vérifié par l'audit de contraste DOM (49 → 0). Status pills = plein encre
(livré/prod) vs contour (en cours). OG image refondue (crème/encre/rouge + voix Operating Partner).

**Garde-fou réutilisable :** `scripts/contrast-audit.py` (Playwright) marche le DOM, calcule fg/bg
effectifs et le ratio WCAG, sort tout texte < 3:1 (noir-sur-noir ≈ 1.0). À lancer avant tout push site :
`PARRIT_BASE=http://localhost:3000 python3 scripts/contrast-audit.py /fr /fr/sprint /academy …`

Reste : favicon = sceau simplifié → à passer en sceau brossé complet ; mur de logos clients = sourcer SVG officiels.
