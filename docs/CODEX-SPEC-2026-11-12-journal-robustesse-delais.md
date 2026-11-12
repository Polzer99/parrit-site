# CODEX SPEC — Journal : une page lente ne fait plus tomber le passage

Niveau de risque : faible (script de contenu désarmé).

Constat, run 43313590199 (12/11, après #380) : au bout de 70 s, `node scripts/journal-machine.mjs` meurt sur une exception non rattrapée :

```
DOMException [TimeoutError]: The operation was aborted due to timeout
    at Timeout._onTimeout (node:internal/abort_controller:155:9)
```

Aucune ligne n'est écrite dans `journal-runs.jsonl` et l'état n'est pas poussé sur `journal/etat` : le passage est perdu sans diagnostic. Origine probable : un `AbortSignal.timeout` dont le rejet s'échappe (lecture du corps `res.text()` / `arrayBuffer()` / `pdftotext` hors du `try`, ou promesse de la file parallèle « 4 par 4 » non attendue), mais à établir dans le code.

## Correction

1. **Récupération des sources** : chaque récupération (en-têtes **et** corps, HTML et PDF, y compris l'appel à `pdftotext`) est entièrement dans un `try` ; un dépassement de délai donne `rejected(source, 'delai_depasse')`, toute autre erreur réseau `reseau_<code>`, et le passage continue avec les autres sources. La file parallèle attend toutes ses promesses (`Promise.allSettled`), aucune promesse orpheline. Taille maximale lue par page : 5 Mo (au-delà, `trop_lourde`).
2. **Appels OpenRouter** : délai explicite par appel (recherche 90 s, rédaction 180 s, juge 60 s) ; un dépassement ou une erreur 5xx/429 donne **une** nouvelle tentative après 5 s ; second échec : le sujet échoue avec le motif `openrouter_<etape>_<code|delai>` et la machine passe au sujet suivant (règle existante des essais).
3. **Filet global** : `main()` attrape toute exception restante, écrit quand même une ligne dans `journal-runs.jsonl` (`issue: "crash"`, message de 300 caractères sans secret, étape en cours, sujet en cours), persiste l'état comme un run sans article (branche `journal/etat`), puis sort en code 1. Ajouter aussi `process.on('unhandledRejection')` qui fait la même chose.
4. Ne pas changer les portes, les seuils ni le gabarit.

## Tests

- Source dont le corps dépasse le délai (fetch simulé qui rejette `TimeoutError` pendant la lecture du corps) → `delai_depasse`, les autres sources sont traitées.
- `pdftotext` qui échoue ou dépasse → source écartée, pas de crash.
- OpenRouter : délai puis succès → une relance ; deux délais → motif `openrouter_recherche_delai`, sujet suivant tenté.
- Exception arbitraire dans `runMachine` → ligne `crash` écrite et état persisté (simulé).
- Ne modifie pas les tests existants, sauf ceux de la machine (`tests/journal-machine*`). Batterie : `npm ci --silent && npm run lint && npm run build -- --webpack && npm test`, entièrement verte, et deux fois de suite (un test instable a été vu le 12/11 : s'il vient de la machine, le stabiliser).
