# DNS — état AVANT toute modification

**Domaine :** `paul-larmaraud.com` · **Registrar et DNS :** GoDaddy
**Relevé le :** 12/08/2026, depuis les serveurs faisant autorité
**Auteur du relevé :** Claude Code. **Aucune modification n'a été appliquée.**

---

## 1. Ce qui existe aujourd'hui

| Type | Nom | Valeur | Note |
|---|---|---|---|
| NS | `paul-larmaraud.com` | `ns39.domaincontrol.com` · `ns40.domaincontrol.com` | serveurs GoDaddy par défaut |
| A | `paul-larmaraud.com` | `76.223.105.230` · `13.248.243.5` | page de parking GoDaddy |
| CNAME | `www` | `paul-larmaraud.com` | suit l'apex |
| CNAME | `_domainconnect` | `_domainconnect.gd.domaincontrol.com.` | mécanisme GoDaddy de configuration en un clic. **Ne pas y toucher** |
| MX | — | **aucun** | |
| TXT | — | **aucun** | |
| TXT | `_dmarc` | **aucun** | |
| CAA | — | **aucun** | |

Le domaine a été **enregistré le 12/08/2026** (expiration au 12/08/2027). Il n'a jamais servi.

⚠️ Le `CNAME _domainconnect` n'apparaissait pas dans une interrogation `dig` directe ; il est bien
présent dans le panneau GoDaddy. Lire le panneau fait foi, pas seulement le résolveur.

## 2. Ce que cela implique, et c'est la bonne nouvelle

**Aucun enregistrement de messagerie n'existe.** Pas de MX, pas de SPF, pas de DKIM, pas de DMARC.
Le risque le plus sérieux d'un basculement DNS — couper les mails d'un domaine en service — **n'existe
pas ici**. Les deux enregistrements A pointent vers une page de parking GoDaddy, sans valeur.

En conséquence : **les seuls enregistrements à toucher sont l'apex A et le `www`.** Tout le reste
doit rester tel quel, c'est-à-dire vide.

## 3. Le changement à appliquer, exactement

À faire dans GoDaddy → *Mes produits* → `paul-larmaraud.com` → *DNS*.

| Action | Type | Nom | Valeur actuelle | Nouvelle valeur | TTL |
|---|---|---|---|---|---|
| **Supprimer** | A | `@` | `76.223.105.230` | — | — |
| **Supprimer** | A | `@` | `13.248.243.5` | — | — |
| **Créer** | A | `@` | — | `76.76.21.21` | 600 |
| **Modifier** | CNAME | `www` | `paul-larmaraud.com` | `cname.vercel-dns.com` | 600 |

`76.76.21.21` est la valeur donnée par Vercel pour ce projet, le 12/08/2026. Vercel accepte aussi un
`A www 76.76.21.21` ; le CNAME est préférable, il suit les changements d'infrastructure sans
intervention.

**Ne toucher à rien d'autre.** En particulier : ne pas basculer les serveurs de noms vers
`ns1.vercel-dns.com`. Vercel le propose, ce n'est pas nécessaire, et cela déplacerait toute la zone
hors de GoDaddy.

## 4. Après le changement

La propagation prend de quelques minutes à deux heures. Vercel émet le certificat automatiquement
une fois l'apex résolu. Contrôles à passer :

```bash
dig +short paul-larmaraud.com A          # attendu : 76.76.21.21
dig +short www.paul-larmaraud.com CNAME  # attendu : cname.vercel-dns.com.
curl -sI https://paul-larmaraud.com                 # attendu : 200
curl -sI https://www.paul-larmaraud.com | head -3   # attendu : 301 vers l'apex
curl -s  https://paul-larmaraud.com/robots.txt      # attendu : Allow, et non Disallow
```

Le dernier contrôle est le plus important : **c'est le passage du domaine canonique qui ouvre
l'indexation**, rien d'autre. Tant que le site répond sur une URL `*.vercel.app`, il sert un
`noindex`.

## 5. Rollback

Remettre les deux A d'origine (`76.223.105.230`, `13.248.243.5`) et le CNAME `www` vers
`paul-larmaraud.com`. Aucun autre enregistrement n'ayant été touché, il n'y a rien d'autre à
restaurer.

## 6. Ce que je n'ai pas fait

**Je n'ai pas modifié le DNS.** Je n'ai pas d'accès GoDaddy approuvé, et la §44 place la propriété du
compte au-dessus de tout accès technique. Le tableau du §3 est prêt à appliquer, il demande un
login et une validation humaine.

Côté Vercel, en revanche, `paul-larmaraud.com` et `www.paul-larmaraud.com` **sont déjà rattachés au
projet** `paul-larmaraud` : dès que le DNS pointe, le site répond, sans autre manipulation.
