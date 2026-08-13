# STATUT — lancement paul-larmaraud.com

**Dernière mise à jour :** 13/08/2026 · **Le site est EN PRODUCTION.**

---

## Où en est le graphe

| Nœud | État |
|---|---|
| G0 · freeze et audit | fait |
| G1B · lecture de la direction Figma | fait |
| G1C · réconciliation des preuves | fait, **un gate reste ouvert** |
| G1D · audit technique et domaine | fait |
| M1 · contrat d'implémentation | fait |
| G4 · implémentation | fait |
| G3 · revue visuelle | fait, 5 largeurs |
| G5 · déploiement | fait |
| G2 · page Figma finale | fait, page `172:2` |
| G1A · migration de la mémoire | fait |
| M2 · gate humain | DNS fait par Paul le 13/08 |
| G6 · branchement du domaine | **fait** |
| G7 · production et indexation | **fait**, indexation ouverte |

## Ce qui tourne aujourd'hui

- **Dépôt :** `~/paul-larmaraud-site`, branche `main`
- **En production :** `https://paul-larmaraud.com`, HTTPS Let's Encrypt émis le 13/08, valide
  jusqu'au 11/11/2026. `www` redirige en 308 vers l'apex.
- **DNS :** apex `A 76.76.21.21`. Le `CNAME www` est resté sur l'apex, ce qui suffit puisque
  l'apex pointe chez Vercel. Le `CNAME _domainconnect` n'a pas été touché.
- **Indexation ouverte**, `robots.txt` permissif sur le domaine canonique uniquement.

## Les trois choses qui attendent Paul

1. **Les noms de clients — SEUL POINT OUVERT.** La page affiche des descripteurs de secteur
   (`proof.named: false`), parce que l'indexation s'est ouverte avant qu'une décision soit prise.
   Avec les accords écrits, repasser à `true` prend dix secondes.

## Ce qui n'est pas vérifié, et doit être dit

- **L'événement `audit_cta_clicked` n'a jamais été observé.** Il passe par le même chemin que le
  `$pageview`, qui lui est confirmé, mais PostHog filtre les navigateurs automatisés — leurs
  événements n'arrivent pas du tout. Un clic humain sur le CTA, puis un coup d'œil dans PostHog,
  lèvent le doute en une minute.
- **Les variables d'environnement `preview` n'ont pas pu être créées** côté Vercel, la commande
  échouait sans message. Conséquence : les déploiements de preview ne chargent pas PostHog. C'est
  le comportement souhaitable, mais il n'a pas été choisi.

## Journal des incidents

**Le premier déploiement a été promu en production par Vercel**, sans `--prod`. Pendant quelques
minutes, `paul-larmaraud.vercel.app` a servi un `robots.txt` permissif alors que la page nomme des
clients. Corrigé par deux verrous indépendants : le `robots.txt` décide sur l'hôte de la requête,
et un en-tête `x-robots-tag: noindex` couvre tout hôte non canonique. **La leçon : ne pas faire
dépendre l'indexation de l'environnement, mais du domaine.**

**Une vérification d'analytics fausse pendant une heure.** PostHog sert des résultats de requête en
cache : la même requête renvoyait obstinément l'ancien état, ce qui m'a fait conclure à tort que
rien n'arrivait. Une requête de forme différente a montré le `$pageview` bien présent. **La leçon :
un résultat identique à répétition est un signal de cache, pas une confirmation.**
