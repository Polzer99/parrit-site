---
num: 2
slug: "tri-reclamations-support"
title: "Trier 200 reclamations par jour sans perdre les urgences"
date: "2026-07-18"
category: "Support"
sector: "Services B2B"
difficulty: 4
stack: ["Claude Code", "Next.js", "Postgres", "Email parser"]
devDuration: "4 jours"
summary: "Une file support classe les messages entrants, detecte les urgences et prepare les reponses humaines."
draft: false
---

## Probleme

Les demandes arrivaient par email avec des niveaux d'urgence tres differents. Les cas critiques etaient parfois noyes dans le volume.

## Prototype

Le systeme lit les messages entrants, attribue une categorie, isole les urgences et prepare un brouillon de reponse pour validation.

## Architecture

Un parseur email depose les messages dans Postgres. Un worker applique la classification, puis une interface simple permet de traiter la file par priorite.

## Ce qu'on a appris

La bonne UX n'est pas de repondre automatiquement a tout. C'est de donner au support une file claire, fiable et facile a reprendre.
