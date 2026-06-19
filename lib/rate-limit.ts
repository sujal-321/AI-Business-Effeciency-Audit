import { config } from "@/lib/config";

type Bucket = { count: number; resetsAt: number };
declare global { var __auditRateLimits: Map<string, Bucket> | undefined }
const buckets = globalThis.__auditRateLimits ?? new Map<string, Bucket>();
globalThis.__auditRateLimits = buckets;

export function checkRateLimit(key: string) {
  const now = Date.now();
  const bucket = buckets.get(key);
  if (!bucket || bucket.resetsAt <= now) {
    buckets.set(key, { count: 1, resetsAt: now + 3_600_000 });
    return { allowed: true, remaining: config.rateLimit - 1, resetsAt: now + 3_600_000 };
  }
  if (bucket.count >= config.rateLimit) return { allowed: false, remaining: 0, resetsAt: bucket.resetsAt };
  bucket.count += 1;
  return { allowed: true, remaining: config.rateLimit - bucket.count, resetsAt: bucket.resetsAt };
}
