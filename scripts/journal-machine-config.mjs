export class ConfigurationError extends Error {}

function tokens(env, name, fallback) {
  const value = env[name] || String(fallback);
  if (!/^\d+$/.test(value) || !Number.isSafeInteger(Number(value)) || Number(value) <= 0) {
    throw new ConfigurationError(`${name} invalide`);
  }
  return Number(value);
}

function reasoning(env, name) {
  try {
    const value = JSON.parse(env[name] || '{"max_tokens":4000}');
    if (!value || typeof value !== 'object' || Array.isArray(value)) throw new Error();
    if ('effort' in value && !['none', 'minimal', 'low', 'medium', 'high', 'xhigh', 'max'].includes(value.effort)) throw new Error();
    if ('max_tokens' in value && (!Number.isSafeInteger(value.max_tokens) || value.max_tokens < 0)) throw new Error();
    for (const field of ['enabled', 'exclude']) if (field in value && typeof value[field] !== 'boolean') throw new Error();
    if ('effort' in value && 'max_tokens' in value) throw new Error();
    return value;
  } catch {
    // Never echo configuration values: they may contain accidentally pasted secrets.
    throw new ConfigurationError(`${name} invalide`);
  }
}

export function generationSettings(env) {
  return {
    writing: { max_tokens: tokens(env, 'JOURNAL_REDACTION_MAX_TOKENS', 32000), reasoning: reasoning(env, 'JOURNAL_RAISONNEMENT_REDACTION') },
    judge: { max_tokens: tokens(env, 'JOURNAL_JUGE_MAX_TOKENS', 8000), reasoning: reasoning(env, 'JOURNAL_RAISONNEMENT_JUGE') },
  };
}
