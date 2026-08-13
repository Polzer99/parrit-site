# ARCHITECTURE DE CONTENU

`ACTIVE` · 12/08/2026

---

## Deux domaines, deux rôles

**`paul-larmaraud.com` — la voix de l'opérateur.** Convictions, observations, construction, retours
de terrain, décortiquages, notes, essais, décisions. Ce qu'on pense en faisant.

**`parrit.ai` — la mémoire institutionnelle.** Méthodes, cas structurés, preuves, systèmes, guides,
ressources, patrimoine. Ce qui reste après.

## Une pièce a une source principale

Ne pas dupliquer un article intégralement. L'autre domaine peut le résumer, le commenter,
l'adapter ou le citer, jamais le republier.

## Comment se publie une note

Un fichier Markdown dans `paul-larmaraud-site/src/content/posts/` :

```markdown
---
title: Le titre
date: 2026-08-20
excerpt: Une phrase qui donne envie de lire.
---
```

L'article, la liste `/blog`, le sitemap, la ligne dans `llms.txt` et le lien du pied de page
apparaissent seuls. `draft: true` garde un texte hors ligne.

**Aucune note n'est publiée à ce jour, et c'est volontaire :** la voix publique de Paul ne s'écrit
pas sans lui.

## Vidéo

Chaque section de la landing porte un emplacement `media`. Remplir le champ dans
`src/content/landing.ts` insère une vidéo YouTube, Vimeo ou un fichier, sans toucher au layout.

## Lecture par les modèles

`/llms.txt` dit la page en clair, généré depuis le même contenu — rien à tenir en double. Données
structurées `Person`, `Service`, `FAQPage`, `WebSite`, et `BlogPosting` par article. `robots.txt`
autorise explicitement GPTBot, OAI-SearchBot, ClaudeBot, PerplexityBot et Google-Extended.

Le principe : **répondre à l'intention avant de placer un mot-clé.** Une FAQ dont les réponses sont
exactes et sourçables est citée ; un paragraphe optimisé ne l'est pas.

## Ce qu'on n'ajoute pas

Pas de CMS lourd, pas de popup, pas d'aimant à prospects, pas de newsletter, pas de second CTA, pas
d'agent conversationnel. La page fait une chose : donner envie de réserver l'audit offert.
