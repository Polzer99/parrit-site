---
num: 3
slug: "capture-multicanal-artisan"
title: "Capturer les demandes client d'un artisan sur quatre canaux"
date: "2026-07-25"
category: "CRM"
sector: "Artisanat"
difficulty: 2
stack: ["Codex", "Webhook", "Google Sheets", "WhatsApp"]
devDuration: "2 jours"
summary: "Un mini-CRM regroupe WhatsApp, formulaire, appels et messages web pour eviter les relances oubliees."
draft: false
---

## Probleme

Les demandes entraient partout. Certaines etaient traitees tout de suite, d'autres disparaissaient entre deux chantiers.

## Prototype

Chaque canal alimente une meme liste de suivi. Les relances sont visibles par statut et par prochaine action.

## Architecture

Des webhooks normalisent les demandes. Une table centrale stocke le contact, le besoin, l'origine et la prochaine relance.

## Ce qu'on a appris

Pour ce type d'entreprise, la valeur est dans la simplicite : une source de verite et moins de champs, pas un CRM lourd.
