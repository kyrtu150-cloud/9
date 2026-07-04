/**
 * Простой in-memory rate-limiter (sliding window) для прототипа.
 * На проде с несколькими инстансами заменить на Redis (upstash/ratelimit).
 */

const buckets = new Map<string, number[]>();

// Периодическая уборка, чтобы Map не рос бесконечно
let lastSweep = Date.now();
function sweep(windowMs: number) {
  const now = Date.now();
  if (now - lastSweep < 60_000) return;
  lastSweep = now;
  for (const [key, arr] of buckets) {
    const fresh = arr.filter((t) => now - t < windowMs);
    if (fresh.length === 0) buckets.delete(key);
    else buckets.set(key, fresh);
  }
}

/** true = запрос разрешён; false = лимит исчерпан. */
export function rateLimit(key: string, limit: number, windowMs: number): boolean {
  sweep(windowMs);
  const now = Date.now();
  const arr = (buckets.get(key) ?? []).filter((t) => now - t < windowMs);
  if (arr.length >= limit) {
    buckets.set(key, arr);
    return false;
  }
  arr.push(now);
  buckets.set(key, arr);
  return true;
}

/** IP клиента из заголовков (за прокси/Vercel). */
export function clientIp(req: Request): string {
  const fwd = req.headers.get("x-forwarded-for");
  if (fwd) return fwd.split(",")[0].trim();
  return req.headers.get("x-real-ip") ?? "unknown";
}

export function tooMany() {
  return Response.json(
    { ok: false, error: "Слишком много запросов. Подождите минуту." },
    { status: 429 }
  );
}
