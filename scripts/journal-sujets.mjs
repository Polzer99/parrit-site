#!/usr/bin/env node
import { readFileSync, writeFileSync } from 'node:fs';
import path from 'node:path';
import { pathToFileURL } from 'node:url';
import { PILIERS, OFFRES, SAFE_SLUG, gatePressOverlap } from './journal-machine-gates.mjs';

export function topicId(query) {
  return query.normalize('NFKD').replace(/[\u0300-\u036f]/g, '').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '').slice(0, 68).replace(/-$/g, '');
}
export function validateTopics(topics) {
  if (!Array.isArray(topics)) throw new Error('file de sujets invalide');
  const ids = new Set();
  for (const topic of topics) {
    if (!SAFE_SLUG.test(topic.id) || topic.id.length > 72 || ids.has(topic.id) || typeof topic.requete !== 'string' || !topic.requete.trim() || !PILIERS.includes(topic.pilier) || !OFFRES.includes(topic.offre) || !['informationnelle', 'commerciale'].includes(topic.intention) || !['a_faire', 'publie', 'ecarte'].includes(topic.statut) || typeof topic.angle_local !== 'boolean' || (topic.essais !== undefined && (!Number.isInteger(topic.essais) || topic.essais < 0))) throw new Error(`sujet invalide ou dupliqué : ${topic.id}`);
    if (topic.these_pressentie != null && (typeof topic.these_pressentie !== 'string' || !topic.these_pressentie.trim())) throw new Error('these_pressentie invalide');
    for (const field of ['title', 'titre']) if (topic[field] !== undefined && (typeof topic[field] !== 'string' || !topic[field].trim())) throw new Error(`${field} invalide`);
    ids.add(topic.id);
  }
  return topics;
}
export function addTopic(topics, { requete, pilier, offre, angle_local = false, these_pressentie = null, titre }) {
  validateTopics(topics);
  const id = topicId(requete);
  if (topics.some(t => t.id === id || t.requete.toLowerCase() === requete.toLowerCase())) throw new Error('sujet déjà présent');
  const topic = { id, requete, intention: 'informationnelle', pilier, offre, angle_local, these_pressentie, ...(titre ? { titre } : {}), statut: 'a_faire', slug: null, publie_le: null };
  if (!gatePressOverlap(topic).ok) { topic.statut = 'ecarte'; topic.motif = 'couvert_par_chronique_presse'; }
  return validateTopics([...topics, topic]);
}
if (process.argv[1] && import.meta.url === pathToFileURL(path.resolve(process.argv[1])).href) {
  const args = process.argv.slice(2);
  const value = flag => args[args.indexOf(flag) + 1];
  if (!['--ajouter', '--pilier', '--offre'].every(flag => args.includes(flag) && value(flag) && !value(flag).startsWith('--'))) throw new Error('usage: --ajouter "requête" --pilier … --offre … [--local]');
  const file = path.resolve('content/plan/sujets.json');
  const topics = addTopic(JSON.parse(readFileSync(file, 'utf8')), { requete: value('--ajouter'), pilier: value('--pilier'), offre: value('--offre'), angle_local: args.includes('--local'), these_pressentie: args.includes('--these') ? value('--these') : null, titre: args.includes('--titre') ? value('--titre') : undefined });
  writeFileSync(file, `${JSON.stringify(topics, null, 2)}\n`);
}
