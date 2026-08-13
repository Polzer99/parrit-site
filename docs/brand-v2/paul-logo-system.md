# SYSTÈME DE MARQUE — le sceau de Paul

`ACTIVE` · 13/08/2026
**Source :** Figma `Zs3WuVBkAT9Iq6S9c3XsYG`, page `V2 — PAUL MONOGRAM — ROMAN P` (`226:2`),
direction **A — IMPERIUM**.

---

## Ce que le signe est

Deux P imbriqués dans un médaillon à double anneau. Lettres dessinées en Cinzel puis vectorisées.
Il évoque le sceau, la décision, la permanence, et la dualité penser/exécuter.

Il ne doit évoquer ni un parti, ni une institution publique, ni une médaille militaire, ni une
contrefaçon de maison de luxe, ni un costume romain. **Le premium vient du tracé, pas de la
référence.**

## La règle de taille, et pourquoi elle existe

Établie sur un test réel, pas sur un aperçu à 200 px. La planche
`paul-larmaraud-site/artifacts/qa/favicon-tailles-reelles.png` rend les deux marques à 16, 24, 32,
48 et 64 px, sur fond clair et sur fond sombre.

**Sous 32 px, le double P se referme en tache.**

| Taille | Marque |
|---|---|
| 16 et 24 px | **signet**, P unique |
| 32 px et plus | **sceau**, double P |

## Les fichiers

`paul-larmaraud-site/public/brand/paul/`

| Fichier | Usage |
|---|---|
| `paul-monogram.svg` · `-dark.svg` | marque seule, sans fond, pour poser sur une surface |
| `paul-seal.svg` · `-dark.svg` | sceau avec fond, base des favicons |
| `paul-signet.svg` · `-dark.svg` | P unique, petites tailles |
| `favicon-16/24/32/48.png` | onglets |
| `apple-touch-icon.png` | 180 px |
| `icon-192.png` · `icon-512.png` et leurs versions sombres | manifeste |
| `../../favicon.ico` | 16, 32 et 48 dans un seul fichier |

Régénérer avec `node scripts/build-icons.mjs`. Le script produit aussi la planche de contrôle :
**ne jamais valider un favicon sans la regarder.**

## Le composant

`src/components/Monogram.tsx` porte le tracé en ligne et hérite de `currentColor`. Une seule
source sert le fond clair et le fond sombre, et le sceau ne coûte aucune requête.

```tsx
<Monogram size={38} />                    // sceau
<Monogram size={20} variant="signet" />   // P unique
```

## L'en-tête

Sceau 38 px · wordmark `PAUL LARMARAUD` · rôle `Président de Parrit.ai`, masqué sous 780 px.

**Le nom ne s'écrit jamais en Cinzel.** Cinzel vit dans le monogramme et nulle part ailleurs.

## Similarité

Vérification de bon sens, **et rien d'autre**. Une initiale dans un cercle est une forme
extrêmement répandue et non appropriable en soi ; la combinaison précise — Cinzel, deux P
imbriqués, double anneau, bleu `#2E4DC2` — n'évoque aucune marque connue.

**Ceci n'est pas une recherche d'antériorité.** Une vérification INPI reste à faire avant tout
dépôt, et elle ne se délègue pas à un agent.
