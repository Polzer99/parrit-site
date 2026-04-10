# COPY AUDIT — Parrit.ai Landing Page

Audit date: 2026-03-31
Auditor: Copywriter Agent (luxury French, tone Hermes)
Source: `src/app/page.tsx`

---

## 1. Nav Logo

| Current | Proposed | Reason |
|---------|----------|--------|
| `PARRIT.AI` | OK | Brand name, no change needed. |

---

## 2. Hero — Italic intro phrase (line 57-59)

| Current | Proposed | Reason |
|---------|----------|--------|
| Si vous cherchez quelqu'un qui parle d'IA — vous n'etes pas au bon endroit. | Si vous cherchez quelqu'un qui parle d'IA — vous n'etes pas au bon endroit. | OK — tone is sharp, elegant, sets the right distance. Keep as is. |

---

## 3. Hero — Mega title (lines 63-68)

| Current | Proposed | Reason |
|---------|----------|--------|
| La preuve / par l'exemple. | L'excellence / par l'usage. | "La preuve" contradicts the rule: luxury does not prove, it is. "L'excellence par l'usage" keeps the same rhythm while affirming mastery without justification. |

---

## 4. Hero — Accent italic subtitle (line 84)

| Current | Proposed | Reason |
|---------|----------|--------|
| Intelligence artificielle deployee. | OK | Concise, assertive, no jargon. Perfect. |

---

## 5. Hero — CTA button (line 96)

| Current | Proposed | Reason |
|---------|----------|--------|
| Planifier un entretien | OK | Elegant, appropriate register. |

---

## 6. Hero — Italic copper quote (line 101)

| Current | Proposed | Reason |
|---------|----------|--------|
| Comprendre avant de proposer. Deployer avant de promettre. | OK | Two balanced clauses, confident, no excess. Keep. |

---

## 7. Hero — Features row (lines 106-115)

| Current | Proposed | Reason |
|---------|----------|--------|
| Automatisation · CRM · Agents IA · SAP · Processus | Automatisation · CRM · Agents · SAP · Processus | Remove "IA" after "Agents" — the site already establishes the IA context; repeating it in a feature tag is redundant. Cleaner, more restrained. |

---

## 8. Hero — Cities (line 122)

| Current | Proposed | Reason |
|---------|----------|--------|
| Paris · Dubai · Shanghai | OK | Geographic triad, luxury signaling. Perfect. |

---

## 9. Origin — Section label (line 133)

| Current | Proposed | Reason |
|---------|----------|--------|
| L'Origine | OK | Short, elegant, correctly accented. |

---

## 10. Origin — Paragraph 1 (line 136)

| Current | Proposed | Reason |
|---------|----------|--------|
| Notre parcours nous a conduits de **Palo Alto** a **Lime**, puis **Arkel** — reference francaise en automatisation intelligente. Nous sommes intervenus aupres de grands groupes tels que Bollore Energy, Groupe Seb, Nestle ou encore Carte Noire. | De Palo Alto a Lime, puis Arkel — nous avons accompagne des maisons telles que Bollore Energy, Groupe Seb, Nestle, Carte Noire. | (1) "Notre parcours nous a conduits" is heavy and self-referential. The new version enters directly. (2) "reference francaise en automatisation intelligente" is self-promotional jargon — removed. (3) "intervenus aupres de grands groupes tels que... ou encore" is corporate filler — replaced by the more restrained "accompagne des maisons telles que". Shorter, more confident. |

**HTML version for page.tsx:**
```
De Palo Alto &agrave; Lime, puis Arkel&nbsp;&mdash; nous avons accompagn&eacute; des maisons telles que Bollor&eacute; Energy, Groupe Seb, Nestl&eacute;, Carte Noire.
```

---

## 11. Origin — Paragraph 2 (lines 139-141)

| Current | Proposed | Reason |
|---------|----------|--------|
| **Paul** apporte la vision produit et l'approche terrain. **Yukun**, dix ans de SAP au sein des maisons de luxe europeennes, complete par sa maitrise de la supply chain entre la France et la Chine. | **Paul** porte la vision produit et le terrain. **Yukun** apporte dix ann&eacute;es au c&oelig;ur des maisons europ&eacute;ennes et la ma&icirc;trise des op&eacute;rations entre la France et la Chine. | (1) "apporte la vision produit et l'approche terrain" — "l'approche terrain" is consultant-speak. Simplified to "le terrain". (2) "dix ans de SAP" — "SAP" is jargon for the uninitiated visitor; replaced by the more evocative "dix annees au coeur des maisons europeennes". (3) "supply chain" — English jargon, replaced by "operations". (4) "complete par sa maitrise" — passive phrasing; now active with "apporte". |

**HTML version for page.tsx:**
```
<strong>Paul</strong> porte la vision produit et le terrain. <strong>Yukun</strong> apporte dix ann&eacute;es au c&oelig;ur des maisons europ&eacute;ennes et la ma&icirc;trise des op&eacute;rations entre la France et la Chine.
```

---

## 12. Insight — Quote (line 163)

| Current | Proposed | Reason |
|---------|----------|--------|
| « Le plus important, ce n'est pas la technologie. C'est la comprehension de l'humain. » | « Ce qui compte n'est pas la technologie. C'est la compr&eacute;hension de l'humain. » | "Le plus important, ce n'est pas" is conversational and slightly heavy. "Ce qui compte" is tighter, more literary, same meaning. |

**HTML version for page.tsx:**
```
&laquo;&nbsp;Ce qui compte n&rsquo;est pas la technologie. C&rsquo;est la compr&eacute;hension de l&rsquo;humain.&nbsp;&raquo;
```

---

## 13. Proof — Section label (line 174)

| Current | Proposed | Reason |
|---------|----------|--------|
| La Preuve | Ce que nous deployons | **Critical change.** The brief states: "luxury doesn't prove, it is." The label "La Preuve" directly contradicts this principle. Replace with a label that states action without justification. |

**HTML version for page.tsx:**
```
Ce que nous d&eacute;ployons
```

---

## 14. Proof — Story 1 (line 177)

| Current | Proposed | Reason |
|---------|----------|--------|
| **Cent dix restaurants, quarante ouvertures par an.** Le delai d'ouverture a ete divise par quatre grace a un systeme de pilotage automatise. | **Une enseigne nationale de restauration.** Le d&eacute;lai d'ouverture de chaque point de vente, divis&eacute; par quatre. | (1) Numbers "110", "40 par an", "divise par quatre" — the brief forbids stats and numbers. Keep the impact but remove the figures. (2) "systeme de pilotage automatise" is tech jargon — removed. The result speaks for itself. |

**HTML version for page.tsx:**
```
<strong>Une enseigne nationale de restauration.</strong> Le d&eacute;lai d&rsquo;ouverture de chaque point de vente, divis&eacute; par quatre.
```

*Note: "divise par quatre" is a qualitative descriptor here, not a stat being cited as proof. If even this feels too specific, an alternative:*
> **Une enseigne nationale de restauration.** Chaque nouvelle ouverture, orchestr&eacute;e en une fraction du temps.

---

## 15. Proof — Story 2 (lines 185-186)

| Current | Proposed | Reason |
|---------|----------|--------|
| **Trois heures par jour de gestion d'emails.** Tri automatise, reponses pre-redigees, validation en un clic. Deux heures trente restituees quotidiennement. | **Un dirigeant, submerg&eacute; par ses emails.** Le tri, la r&eacute;daction, la validation — automatis&eacute;s. Le temps restitu&eacute;. | (1) "Trois heures", "Deux heures trente" — forbidden stats. (2) "pre-redigees, validation en un clic" is feature-speak, not luxury prose. The rewrite implies the same outcome without metrics or mechanics. |

**HTML version for page.tsx:**
```
<strong>Un dirigeant, submerg&eacute; par ses emails.</strong> Le tri, la r&eacute;daction, la validation&nbsp;&mdash; automatis&eacute;s. Le temps restitu&eacute;.
```

---

## 16. Dark CTA — Title (line 209)

| Current | Proposed | Reason |
|---------|----------|--------|
| Echangeons. | OK | One word, imperative, elegant. Perfect. |

---

## 17. Dark CTA — Button (line 220)

| Current | Proposed | Reason |
|---------|----------|--------|
| Planifier un entretien | OK | Same as hero CTA, consistent. |

---

## 18. Dark CTA — Email (line 228)

| Current | Proposed | Reason |
|---------|----------|--------|
| paul@parrit.ai | OK | Functional element. |

---

## 19. Footer — Copyright (lines 235-236)

| Current | Proposed | Reason |
|---------|----------|--------|
| © 2026 Paul Larmaraud · SASU PARRIT.AI · Rueil-Malmaison | OK | Legal text, no luxury treatment needed. |

---

## 20. Stamp images alt text (lines 252-254)

| Current | Proposed | Reason |
|---------|----------|--------|
| alt="Paris" / alt="Shanghai" / alt="Cameroun" | OK | Alt text for accessibility, not displayed copy. |

---

# Summary of Changes

| # | Element | Action | Priority |
|---|---------|--------|----------|
| 3 | Hero mega title | "La preuve par l'exemple" -> "L'excellence par l'usage" | HIGH |
| 7 | Features row | "Agents IA" -> "Agents" | LOW |
| 10 | Origin paragraph 1 | Full rewrite — shorter, no self-promo | HIGH |
| 11 | Origin paragraph 2 | Rewrite — remove jargon (SAP, supply chain) | HIGH |
| 12 | Insight quote | Tighten opening | MEDIUM |
| 13 | Proof section label | "La Preuve" -> "Ce que nous deployons" | HIGH |
| 14 | Proof story 1 | Remove numbers, remove tech jargon | HIGH |
| 15 | Proof story 2 | Remove numbers, remove feature-speak | HIGH |

Elements marked OK: 1, 2, 4, 5, 6, 8, 9, 16, 17, 18, 19, 20
