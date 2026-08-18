type Bucket = { hits: number[] };

const buckets = new Map<string, Bucket>();

export function consumeRateLimit(key: string, limit = 4, windowMs = 10 * 60_000) {
  const now = Date.now();
  const cutoff = now - windowMs;
  const bucket = buckets.get(key) ?? { hits: [] };
  bucket.hits = bucket.hits.filter((timestamp) => timestamp > cutoff);

  if (bucket.hits.length >= limit) {
    const oldest = bucket.hits[0] ?? now;
    return {
      allowed: false,
      retryAfterSeconds: Math.max(1, Math.ceil((oldest + windowMs - now) / 1000)),
      remaining: 0,
    };
  }

  bucket.hits.push(now);
  buckets.set(key, bucket);
  return { allowed: true, retryAfterSeconds: 0, remaining: Math.max(0, limit - bucket.hits.length) };
}

export function cleanupRateLimits(maxAgeMs = 60 * 60_000) {
  const cutoff = Date.now() - maxAgeMs;
  for (const [key, bucket] of buckets.entries()) {
    if (!bucket.hits.some((timestamp) => timestamp > cutoff)) buckets.delete(key);
  }
}
