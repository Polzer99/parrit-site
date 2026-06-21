import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";
import type { NextRequest } from "next/server";

type GuardConfig = {
  endpoint: "diagnostic" | "bullshit";
  rateLimit: {
    env: string;
    defaultRequests: number;
    windowEnv: string;
    defaultWindowSeconds: number;
  };
  dailyCost: {
    capEnv: string;
    estimatedCostEnv: string;
    defaultEstimatedCostUsd: number;
  };
};

type LimitResult = {
  ok: boolean;
  limit?: number;
  remaining?: number;
  reset?: number;
};

type MemoryBucket = {
  count: number;
  usedUsd: number;
  resetAt: number;
};

const memoryBuckets = new Map<string, MemoryBucket>();

const hasUpstashEnv =
  Boolean(process.env.UPSTASH_REDIS_REST_URL) &&
  Boolean(process.env.UPSTASH_REDIS_REST_TOKEN);

const redis = hasUpstashEnv ? Redis.fromEnv() : null;
const upstashLimiters = new Map<string, Ratelimit>();

function readPositiveNumber(
  envName: string,
  fallback: number,
): { ok: true; value: number } | { ok: false; error: string } {
  const raw = process.env[envName];
  if (raw === undefined || raw === "") return { ok: true, value: fallback };
  const n = Number(raw);
  if (!Number.isFinite(n) || n <= 0) {
    return { ok: false, error: `${envName} doit être un nombre positif.` };
  }
  return { ok: true, value: n };
}

function readOptionalCap(
  envName: string,
): { ok: true; value: number | null } | { ok: false; error: string } {
  const raw = process.env[envName];
  if (raw === undefined || raw === "") return { ok: true, value: null };
  const n = Number(raw);
  if (!Number.isFinite(n) || n < 0) {
    return { ok: false, error: `${envName} doit être un nombre positif ou 0.` };
  }
  return { ok: true, value: n };
}

function clientIp(req: NextRequest): string {
  const forwarded = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim();
  return (
    forwarded ||
    req.headers.get("x-real-ip") ||
    req.headers.get("cf-connecting-ip") ||
    "unknown"
  );
}

function secondsUntilTomorrowUtc(): number {
  const now = new Date();
  const tomorrow = Date.UTC(
    now.getUTCFullYear(),
    now.getUTCMonth(),
    now.getUTCDate() + 1,
  );
  return Math.max(60, Math.ceil((tomorrow - now.getTime()) / 1000));
}

function dayKey(): string {
  return new Date().toISOString().slice(0, 10);
}

function getMemoryBucket(key: string, ttlMs: number): MemoryBucket {
  const now = Date.now();
  const current = memoryBuckets.get(key);
  if (current && current.resetAt > now) return current;
  const next = { count: 0, usedUsd: 0, resetAt: now + ttlMs };
  memoryBuckets.set(key, next);
  return next;
}

async function checkRateLimit(
  cfg: GuardConfig,
  ip: string,
): Promise<LimitResult | { configError: string }> {
  const maxRequests = readPositiveNumber(
    cfg.rateLimit.env,
    cfg.rateLimit.defaultRequests,
  );
  if (!maxRequests.ok) return { configError: maxRequests.error };
  const windowSeconds = readPositiveNumber(
    cfg.rateLimit.windowEnv,
    cfg.rateLimit.defaultWindowSeconds,
  );
  if (!windowSeconds.ok) return { configError: windowSeconds.error };

  if (redis) {
    const key = `${cfg.endpoint}:${maxRequests.value}:${windowSeconds.value}`;
    let limiter = upstashLimiters.get(key);
    if (!limiter) {
      limiter = new Ratelimit({
        redis,
        limiter: Ratelimit.fixedWindow(
          maxRequests.value,
          `${windowSeconds.value} s`,
        ),
        analytics: false,
        prefix: `parrit:${cfg.endpoint}:rate`,
      });
      upstashLimiters.set(key, limiter);
    }
    const result = await limiter.limit(ip);
    return {
      ok: result.success,
      limit: result.limit,
      remaining: result.remaining,
      reset: result.reset,
    };
  }

  const bucket = getMemoryBucket(
    `rate:${cfg.endpoint}:${ip}`,
    windowSeconds.value * 1000,
  );
  bucket.count += 1;
  return {
    ok: bucket.count <= maxRequests.value,
    limit: maxRequests.value,
    remaining: Math.max(0, maxRequests.value - bucket.count),
    reset: bucket.resetAt,
  };
}

async function reserveDailyCost(
  cfg: GuardConfig,
): Promise<LimitResult | { configError: string }> {
  const cap = readOptionalCap(cfg.dailyCost.capEnv);
  if (!cap.ok) return { configError: cap.error };
  if (cap.value === null) return { ok: true };

  const estimate = readPositiveNumber(
    cfg.dailyCost.estimatedCostEnv,
    cfg.dailyCost.defaultEstimatedCostUsd,
  );
  if (!estimate.ok) return { configError: estimate.error };

  const ttlSeconds = secondsUntilTomorrowUtc();
  const reset = Date.now() + ttlSeconds * 1000;

  if (redis) {
    const key = `parrit:${cfg.endpoint}:cost:${dayKey()}`;
    const used = await redis.incrbyfloat(key, estimate.value);
    await redis.expire(key, ttlSeconds);
    return { ok: used <= cap.value, limit: cap.value, reset };
  }

  const bucket = getMemoryBucket(
    `cost:${cfg.endpoint}:${dayKey()}`,
    ttlSeconds * 1000,
  );
  bucket.usedUsd += estimate.value;
  return { ok: bucket.usedUsd <= cap.value, limit: cap.value, reset };
}

function rateHeaders(result: LimitResult): HeadersInit {
  const headers: Record<string, string> = {};
  if (result.limit !== undefined) headers["X-RateLimit-Limit"] = String(result.limit);
  if (result.remaining !== undefined) headers["X-RateLimit-Remaining"] = String(result.remaining);
  if (result.reset !== undefined) headers["X-RateLimit-Reset"] = String(Math.ceil(result.reset / 1000));
  return headers;
}

export async function guardModelEndpoint(
  req: NextRequest,
  cfg: GuardConfig,
): Promise<Response | null> {
  const rate = await checkRateLimit(cfg, clientIp(req));
  if ("configError" in rate) {
    return Response.json({ error: rate.configError }, { status: 503 });
  }
  if (!rate.ok) {
    return Response.json(
      { error: "Trop de requêtes. Réessayez dans un instant." },
      { status: 429, headers: rateHeaders(rate) },
    );
  }

  const budget = await reserveDailyCost(cfg);
  if ("configError" in budget) {
    return Response.json({ error: budget.configError }, { status: 503 });
  }
  if (!budget.ok) {
    return Response.json(
      { error: "Plafond quotidien atteint. Réessayez demain." },
      { status: 429, headers: rateHeaders(budget) },
    );
  }

  return null;
}
