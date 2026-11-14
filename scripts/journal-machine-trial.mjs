import { appendFileSync, mkdirSync } from 'node:fs';
import path from 'node:path';
import { generationSettings, ConfigurationError } from './journal-machine-config.mjs';
import { withinDeadline, isTimeout } from './journal-machine-io.mjs';
import { callTrace, responseIssue, runRecord, writeSummary } from './journal-machine-trace.mjs';

export const TRIAL_BUDGET = 0.10;
export const TRIAL_SETTINGS = [
  { name: 'effort_none', reasoning: { effort: 'none' } },
  { name: 'enabled_false', reasoning: { enabled: false } },
  { name: 'max_tokens_1024', reasoning: { max_tokens: 1024 } },
  { name: 'effort_low', reasoning: { effort: 'low' } },
  { name: 'sans_parametre' },
];
const prompt = 'Renvoyez uniquement un objet JSON {"paragraphe":"..."} contenant un paragraphe français de 120 mots sur la lecture dans une bibliothèque. Aucun autre champ.';
// Fixed short text (<200 UTF-8 bytes); reserve 4096 input tokens including the
// provider's chat/JSON wrappers, and all 3000 output tokens (reasoning included).
function priceBound(pricing) {
  const price = field => {
    const raw = pricing?.[field];
    if (!['string', 'number'].includes(typeof raw) || String(raw).trim() === '' || !Number.isFinite(Number(raw)) || Number(raw) < 0) {
      throw new ConfigurationError('tarifs d’essai absents ou invalides');
    }
    return Number(raw);
  };
  const input = price('prompt'), output = price('completion'), request = price('request');
  const roundUp = (value, scale) => Math.ceil(value * scale) / scale;
  const max_price = { prompt: roundUp(input * 1e6, 1e6), completion: roundUp(output * 1e6, 1e6), request: roundUp(request, 1e9) };
  const reserve = max_price.prompt / 1e6 * 4096 + max_price.completion / 1e6 * 3000 + max_price.request;
  if (!Number.isFinite(reserve)) throw new ConfigurationError('tarifs d’essai absents ou invalides');
  return { reserve, provider: { max_price } };
}

/** One request per model/setting, no retries, research, topics or GitHub runtime. */
export async function runModelTrial({ root, client, models, now = () => new Date(), env = process.env, context = {} }) {
  const run = { date: now().toISOString(), mode: 'essai_modeles', issue: 'essai_termine', modeles: models, appels: [], cout: 0, cout_reserves_sans_reponse: 0 };
  context.run = run;
  let highestCost = 0;
  try {
    generationSettings(env);
    context.etape = 'catalogue';
    const available = await client.models({ withPricing: true });
    const selected = [...new Set([models.writing, models.writingFallback, models.judge, models.judgeFallback])];
    if (selected.some(model => !available.some(entry => entry.id === model))) throw new ConfigurationError('modèle d’essai indisponible');
    trial: for (const setting of TRIAL_SETTINGS) for (const model of selected) {
      context.signal?.throwIfAborted();
      const pricing = priceBound(available.find(entry => entry.id === model).pricing);
      // Cap provider prices too: the catalogue advertises starting prices, not
      // the upper bound of every routed provider. Production reserve is unchanged.
      if (run.cout >= TRIAL_BUDGET - 1e-12 || run.cout + Math.max(highestCost, pricing.reserve) > TRIAL_BUDGET + 1e-12) {
        run.issue = 'essai_plafond'; run.motif = 'plafond de coût atteint'; break trial;
      }
      context.etape = 'essai_modeles';
      const request = { model, messages: [{ role: 'user', content: prompt }], temperature: 0,
        max_tokens: 3000, response_format: { type: 'json_object' }, provider: pricing.provider,
        ...(setting.reasoning ? { reasoning: structuredClone(setting.reasoning) } : {}) };
      const deadline = AbortSignal.timeout(180_000);
      const signal = context.signal ? AbortSignal.any([context.signal, deadline]) : deadline;
      const start = performance.now();
      let response, issue, httpStatus;
      try {
        context.activeCall = withinDeadline(() => client.complete(request, { signal }), signal);
        response = await context.activeCall;
        issue = responseIssue(response, true); httpStatus = 200;
      } catch (error) {
        httpStatus = Number.isInteger(error?.status) ? error.status : undefined;
        issue = [400, 422].includes(httpStatus) ? 'parametre_refuse' : isTimeout(error) ? 'delai' : `http_${httpStatus || '000'}`;
      }
      const trace = callTrace({ etape: 'essai_modeles', modele: model, tentative: 1,
        response, issue, httpStatus, reglage: setting.name, duration: performance.now() - start });
      run.appels.push(trace);
      context.signal?.throwIfAborted();
      if (!response && issue === 'parametre_refuse') continue;
      if (httpStatus !== 200) {
        if (httpStatus === 404) trace.cout = 0;
        else {
          // Unknown transport billing: keep the trace unknown, charge the bound.
          run.cout += pricing.reserve;
          run.cout_reserves_sans_reponse += pricing.reserve;
        }
        continue;
      }
      // A response without valid billing still forbids another spend.
      if (trace.cout === null) {
        run.issue = 'echec'; run.motif = 'usage.cost absent ou invalide : publication interdite'; break trial;
      }
      run.cout += trace.cout;
      highestCost = Math.max(highestCost, trace.cout);
      if (run.cout > TRIAL_BUDGET) {
        run.issue = 'echec'; run.motif = 'plafond de coût dépassé'; break trial;
      }
    }
  } catch (error) {
    if (context.stopped) throw error;
    if (!(error instanceof ConfigurationError)) { context.fatal = true; throw error; }
    run.issue = 'echec'; run.motif = error.message;
  } finally {
    if (!context.stopped && !context.fatal) {
      mkdirSync(path.join(root, 'content/plan'), { recursive: true });
      appendFileSync(path.join(root, 'content/plan/journal-runs.jsonl'), `${JSON.stringify(runRecord(run))}\n`);
      writeSummary(run, env.GITHUB_STEP_SUMMARY);
    }
  }
  return run;
}
