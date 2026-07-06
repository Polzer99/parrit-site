---
num: 1
slug: "sourcing-foncier-apis-publiques"
title: "Remplacer un SaaS de sourcing par deux APIs publiques"
date: "2026-07-11"
category: "Ops"
sector: "Mobilite"
difficulty: 3
stack: ["Codex", "FastAPI", "Supabase", "API publique"]
devDuration: "3 jours"
summary: "Un pipeline de sourcing consolide des donnees publiques et remplace une veille manuelle plafonnee."
resource:
  label: "Telecharger l'architecture placeholder"
  href: "/downloads/launch-001.pdf"
draft: false
---

## Probleme

L'equipe devait verifier plusieurs sources publiques, exporter des fichiers et rapprocher les resultats a la main.

## Prototype

Le prototype centralise la collecte, nettoie les doublons et produit une liste exploitable avec les champs minimums pour passer a l'action.

## Architecture

Deux connecteurs API alimentent une base Supabase. Une tache planifiee relance la collecte, puis une vue prepare les donnees pour l'equipe operationnelle.

## Ce qu'on a appris

Le gain principal ne vient pas du modele IA. Il vient du fait de rendre la donnee publique actionnable chaque matin.
