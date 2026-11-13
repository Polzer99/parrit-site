/** Historical diagnostics stay in JSONL; calls and public summaries are metadata-only. */
import { appendFileSync, existsSync, readFileSync } from 'node:fs';

const number = value => typeof value === 'number' && Number.isFinite(value) && value >= 0 ? value : null;
const identifier = value => typeof value === 'string' && /^[a-zA-Z0-9_./-]{1,160}$/.test(value) ? value : null;
const issues = /^(ok|vide|tronquee|json_invalide|delai|parametre_refuse|http_\d{3})$/;
const gateNames = new Set(['chronique-presse', 'anti-ia', 'interdits-parrit', 'structure', 'sources', 'adaptation', 'fiches', 'slug', 'noms-clients', 'repetition', 'mdx', 'entite', 'false-claims', 'certification', 'ownership', 'sujet', 'liens-internes', 'liens', 'parse', 'juge', 'build']);
const finishes = new Set(['stop', 'length', 'tool_calls', 'function_call', 'content_filter', 'error']);
const trialSettings = new Set(['effort_none', 'enabled_false', 'max_tokens_1024', 'effort_low', 'sans_parametre']);
export function visibleTokens(response) {
  const output = number(response?.usage?.completion_tokens);
  const reasoning = number(response?.usage?.completion_tokens_details?.reasoning_tokens) ?? 0;
  return output === null ? null : Math.max(0, output - reasoning);
}
export function parseResponseObject(message) {
  const text = message.trim().replace(/^```(?:json)?\s*\n/i, '').replace(/\n```\s*$/, '');
  const start = text.indexOf('{');
  let depth = 0, quoted = false, escaped = false;
  for (let index = start; start >= 0 && index < text.length; index++) {
    const char = text[index];
    if (quoted) {
      if (escaped) escaped = false;
      else if (char === '\\') escaped = true;
      else if (char === '"') quoted = false;
    } else if (char === '"') quoted = true;
    else if (char === '{') depth++;
    else if (char === '}' && --depth === 0) return JSON.parse(text.slice(start, index + 1));
  }
  throw new SyntaxError('objet JSON incomplet ou absent');
}
export function responseIssue(response, expectsJSON) {
  const choice = response?.choices?.[0];
  const empty = typeof choice?.message?.content !== 'string' || !choice.message.content.trim();
  if (empty && visibleTokens(response) === 0) return 'vide';
  if (choice?.finish_reason === 'length') return 'tronquee';
  if (empty) return 'vide';
  if (expectsJSON) {
    try { parseResponseObject(choice.message.content); } catch { return 'json_invalide'; }
  }
  return 'ok';
}
export function callTrace({ etape, modele, tentative, echelon, sujet, response, issue, duration, reglage, httpStatus }) {
  const usage = response?.usage;
  const cout = number(usage?.cost);
  return { etape, modele: identifier(modele), tentative, echelon, sujet: identifier(sujet),
    ...(reglage ? { reglage, http_status: httpStatus ?? null } : {}),
    finish_reason: finishes.has(response?.choices?.[0]?.finish_reason) ? response.choices[0].finish_reason : null,
    jetons_entree: number(usage?.prompt_tokens), jetons_sortie: number(usage?.completion_tokens),
    jetons_raisonnement: number(usage?.completion_tokens_details?.reasoning_tokens), jetons_visibles: visibleTokens(response), cout,
    duree_ms: Math.max(0, Math.round(duration)), issue,
    alerte_cout: cout !== null && cout > (etape === 'juge' ? 0.05 : ['redaction', 'secretariat'].includes(etape) ? 0.25 : Infinity) };
}
// Re-project historical data too: issue bodies must not trust arbitrary old JSONL.
export function safeCalls(calls = []) {
  return (Array.isArray(calls) ? calls : []).map(call => ({
    etape: ['recherche', 'redaction', 'secretariat', 'juge', 'essai_modeles'].includes(call.etape) ? call.etape : null,
    ...(call.etape === 'essai_modeles' ? { reglage: trialSettings.has(call.reglage) ? call.reglage : null,
      http_status: Number.isInteger(call.http_status) && call.http_status >= 100 && call.http_status <= 599 ? call.http_status : null } : {}),
    modele: identifier(call.modele), tentative: number(call.tentative), echelon: number(call.echelon), sujet: identifier(call.sujet),
    finish_reason: finishes.has(call.finish_reason) ? call.finish_reason : null,
    jetons_entree: number(call.jetons_entree), jetons_sortie: number(call.jetons_sortie), jetons_raisonnement: number(call.jetons_raisonnement), jetons_visibles: number(call.jetons_visibles),
    cout: number(call.cout), duree_ms: number(call.duree_ms), issue: issues.test(call.issue) ? call.issue : null,
    alerte_cout: call.alerte_cout === true,
  }));
}
export function technicalFailure(run) {
  return run.issue === 'crash' || run.issue === 'echec' && !/^file de sujets vide/.test(run.motif || '') &&
    !['sujets en attente de PR', 'couvert_par_chronique_presse', 'sujet écarté pour répétition'].includes(run.motif);
}
export function circuitHistory(file) {
  if (!existsSync(file)) return [];
  const runs = readFileSync(file, 'utf8').split('\n').filter(line => line.trim()).map(line => JSON.parse(line));
  // A skipped cron is not an executed run: it cannot rearm the next morning.
  const recent = runs.filter(run => !run.simulation && run.mode !== 'essai_modeles' && run.issue !== 'coupe_circuit')
    .sort((a, b) => String(a.date).localeCompare(String(b.date))).slice(-3);
  return recent.length === 3 && recent.every(technicalFailure) ? recent : [];
}
export function diagnosticReason(value) {
  if (typeof value !== 'string') return null;
  if (/^JOURNAL_(REDACTION_MAX_TOKENS|JUGE_MAX_TOKENS|RAISONNEMENT_REDACTION|RAISONNEMENT_JUGE) invalide$/.test(value)) return value;
  if (/^openrouter_(recherche|redaction|secretariat|juge)_(vide|tronquee|json_invalide|delai|parametre_refuse|http_\d{3}|\d{3}|ECONNRESET|ECONNREFUSED|ENOTFOUND|EAI_AGAIN|EPIPE|UND_ERR_SOCKET|inconnu)$/.test(value)) return value;
  if (['materiau_insuffisant', 'couvert_par_chronique_presse', 'juge_identique_au_redacteur', 'trois_echecs_techniques',
    'tarifs d’essai absents ou invalides', 'modèle d’essai indisponible',
    'file de sujets vide', 'file de sujets vide après déduplication', 'sujets en attente de PR',
    'plafond de coût atteint', 'plafond de coût dépassé', 'plafond de coût : réserve insuffisante',
    'usage.cost absent ou invalide : publication interdite'].includes(value)) return value;
  // Gates may quote article text. Keep the gate names, never their explanations.
  const gates = value.split('; ').map(part => part.split(':')[0]);
  if (gates.every(gate => gateNames.has(gate))) return gates.join('; ');
  return 'erreur_technique';
}
export function runRecord(run) {
  return { ...run,
    modeles: Object.fromEntries(Object.entries(run.modeles || {}).map(([role, model]) => [role, identifier(model)])),
    modeles_effectifs: Object.fromEntries(Object.entries(run.modeles_effectifs || {}).map(([role, model]) => [role, identifier(model)])),
    appels: safeCalls(run.appels) };
}
export function runSummary(run) {
  const cell = value => String(value ?? '—').replace(/[|\r\n<>]/g, ' ');
  const calls = safeCalls(run.appels);
  let trialSummary = '';
  if (run.mode === 'essai_modeles') {
    const models = [...new Set(['writing', 'writingFallback', 'judge', 'judgeFallback'].map(role => identifier(run.modeles?.[role])).filter(Boolean))];
    trialSummary = `dont réserves comptées pour appels sans réponse : ${cell(number(run.cout_reserves_sans_reponse) ?? 0)} USD\n\n` +
      `| Modèle | ${[...trialSettings].join(' | ')} |\n| --- | ${[...trialSettings].map(() => '---').join(' | ')} |\n` +
      models.map(model => `| ${cell(model)} | ${[...trialSettings].map(setting => {
        const call = calls.find(call => call.modele === model && call.reglage === setting);
        return cell(call ? call.issue : run.issue === 'essai_plafond' ? 'non essayé (plafond)' : 'non essayé');
      }).join(' | ')} |`).join('\n') + '\n\n';
  }
  return `\n## Journal — ${cell(run.date)}\n\nIssue : ${cell(run.issue)} · Sujet : ${cell(run.sujet)} · Motif : ${cell(diagnosticReason(run.motif))} · Coût total : ${cell(run.cout)} USD\n\n` +
    trialSummary +
    '| Étape | Modèle | Échelon | Réglage | HTTP | finish_reason | Jetons sortie | Raisonnement | Visibles | Coût USD | Durée ms | Issue |\n| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |\n' +
    calls.map(call => `| ${[call.etape, call.modele, call.echelon, call.reglage, call.http_status, call.finish_reason, call.jetons_sortie, call.jetons_raisonnement, call.jetons_visibles, call.cout, call.duree_ms, call.issue].map(cell).join(' | ')} |`).join('\n') + '\n';
}
export function writeSummary(run, file) {
  if (file) appendFileSync(file, runSummary(run));
}
