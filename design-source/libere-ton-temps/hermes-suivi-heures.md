# Hermès — suivi des heures depuis l'agenda

> Agent de comptage du temps. Il lit votre agenda, additionne les heures passées
> par client (ou par projet), les déduit d'un forfait, et vous envoie le solde
> chaque semaine. Lecture seule. Il ne décide rien, il ne vous fait rien signer.

Collez ce fichier dans un dossier de travail, ouvrez-y Claude Code, et suivez la
section « Démarrer ». Tout est paramétrable dans le bloc CONFIG.

---

## Ce qu'il fait pour vous

Vous vendez des forfaits d'heures. Ou vous suivez un budget de temps par projet,
par dossier, par client. La question « il me reste combien ? » n'a jamais de
réponse fiable, parce que personne ne remplit un tableur à la main.

Hermès répond à cette question tout seul. Il part du seul endroit où la vérité de
votre temps existe déjà : **votre agenda**. Chaque réunion y porte une date, une
durée et des participants. Il n'invente rien, il lit.

## La règle de comptage (une phrase)

> Toute réunion où figure un participant du client compte pour ce client.

Vous réglez ce qui définit « le client » (un domaine email, une liste de
personnes, un mot-clé dans le titre). Hermès additionne les durées et les déduit
du forfait.

## Les cas qu'il gère — sinon il ment

Un compteur naïf donne un faux chiffre. Hermès connaît les pièges :

- **Les sessions de masse** (une formation de lancement à 30 personnes, un
  séminaire) ne sont pas des heures de forfait : elles sont facturées à part.
  Règle : au-delà de `KICKOFF_SEUIL` participants côté client, la réunion est
  écartée du décompte, automatiquement — même si elle tombe après la date de
  départ.
- **La durée réelle ≠ le créneau bloqué.** Une réunion d'une heure qui se termine
  en trente minutes ne consomme que trente minutes. Vous notez l'écart dans
  `DUREE_REELLE`, sinon il compte le créneau planifié.
- **Les réunions annulées** sont ignorées.
- **Les doublons** (un même événement synchronisé deux fois) sont dédupliqués par
  identifiant.
- **La date de départ** : seules les réunions à partir de `DEBUT_DECOMPTE`
  comptent. Le cadrage initial et les échanges d'avant-vente ne grèvent pas le
  forfait.

## Ce que vous recevez

Chaque lundi matin, un message court :

```
Forfait client — 16h45 restantes sur 20h
Consommé cette semaine : 3h15
  • lun.  Point de lancement — 1h00
  • mer.  Atelier — 1h30
  • jeu.  Suivi — 45 min
RESTANT : 16h45
```

Le chiffre juste, chaque semaine, sans que vous y pensiez. Assez tôt pour
proposer un renouvellement avant de tomber à zéro — et pour ne plus offrir des
heures par accident.

## Les garde-fous — non négociables

- **Lecture seule.** Hermès n'écrit jamais dans votre agenda, ne déplace ni ne
  supprime rien. Il lit, il compte.
- **Aucun envoi au client.** Le récap part à vous, en interne. Hermès ne
  contacte personne à votre place.
- **Vous décidez.** Le renouvellement, la facturation, le geste commercial :
  c'est vous. Il pose le chiffre, vous jouez le coup.

---

## CONFIG — à régler une fois

```
CLIENT            = "Nom du client"
CLIENT_MATCH      = "@nomduclient.com"   # domaine email OU liste de personnes OU mot-clé du titre
FORFAIT_HEURES    = 20                    # taille du forfait acheté
DEBUT_DECOMPTE    = "2026-01-01"          # on ne compte rien avant cette date
KICKOFF_SEUIL     = 8                     # au-delà de N participants client = session de masse, écartée
DUREE_REELLE      = {}                    # exceptions : { "titre ou date": minutes_réels }
RECAP_JOUR        = "lundi"               # jour d'envoi du récap
RECAP_A           = "vous@votreboite.com" # destinataire interne (vous)
```

Pour suivre plusieurs clients, dupliquez le bloc CONFIG, un par client.

## Démarrer — 2 minutes

1. Ouvrez **Claude Code** dans le dossier qui contient ce fichier.
2. Connectez votre agenda en **lecture seule** (voir « Accès agenda » ci-dessous).
3. Réglez le bloc CONFIG avec vos infos.
4. Collez le prompt ci-dessous. Hermès compte, puis se programme pour tourner
   chaque semaine.

## Accès agenda (lecture seule)

Hermès a besoin de lire votre Google Calendar, rien de plus. Donnez-lui un accès
**en lecture seule** (scope « voir les événements », pas « gérer »). Aucune
permission d'écriture, de suppression ou d'envoi n'est nécessaire — s'il en
demande une, refusez.

## Le prompt à coller

```
Tu es Hermès, mon agent de suivi des heures. Utilise le bloc CONFIG de ce fichier.

Chaque semaine :
1. Lis mon agenda depuis DEBUT_DECOMPTE.
2. Garde les réunions où figure CLIENT_MATCH (participant, ou titre).
3. Écarte : les sessions de masse (plus de KICKOFF_SEUIL participants côté
   client), les réunions annulées, les doublons.
4. Pour chaque réunion gardée, compte sa durée réelle (DUREE_REELLE si précisé,
   sinon le créneau de l'agenda).
5. Additionne, déduis de FORFAIT_HEURES.
6. Envoie-moi (RECAP_A) le solde restant + le détail des réunions comptées.

Puis programme-toi pour refaire ça chaque RECAP_JOUR, tout seul.

Règles : lecture seule sur l'agenda, aucun envoi au client, tu ne décides ni
facturation ni renouvellement. Tu poses le chiffre, je joue le coup.
```

## Ce qui reste à vous

Hermès enlève la charge morte : le comptage, le rappel, le récap. Il ne remplace
pas votre jugement. Quand relancer pour renouveler, à quel prix, avec quel geste
pour un client clé : ça, ça reste vous. Et c'est très bien comme ça.

---

*Parrit.ai — au-delà de ChatGPT : des agents qui agissent, pas qui répondent.
Pour déployer Hermès et les suivants chez vous : parrit.ai*
