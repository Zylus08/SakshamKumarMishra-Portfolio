import { createHmac } from "node:crypto";
import type { ContactEnvironment } from "./config";
export type LimitResult = { allowed: boolean; retryAfter: number };
// One atomic window update across all keys; shared across serverless instances.
export const RATE_SCRIPT = `local retry = 0
for i,key in ipairs(KEYS) do
 local count = tonumber(redis.call('GET', key) or '0')
 if count >= tonumber(ARGV[i+1]) then retry = math.max(retry, redis.call('TTL', key)) end
end
if retry > 0 then return {0, retry} end
for _,key in ipairs(KEYS) do
 local count = redis.call('INCR', key)
 if count == 1 then redis.call('EXPIRE', key, ARGV[1]) end
end
return {1, 0}`;
export function rateKeys(
  email: string,
  request: Request,
  secret: string,
  env: ContactEnvironment,
) {
  const hash = (value: string) =>
    createHmac("sha256", secret).update(value).digest("hex");
  // Only trust the platform-overwritten Vercel header, never arbitrary X-Forwarded-For.
  const ip =
    env.VERCEL === "1"
      ? request.headers.get("x-vercel-forwarded-for")?.split(",")[0].trim()
      : undefined;
  return [
    "skm:contact:global",
    `skm:contact:email:${hash(email.toLowerCase())}`,
    ...(ip ? [`skm:contact:ip:${hash(ip)}`] : []),
  ];
}
export async function sharedRateLimit(
  keys: string[],
  config: { redis: string; token: string },
  fetcher: typeof fetch = fetch,
): Promise<LimitResult> {
  const response = await fetcher(config.redis, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${config.token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify([
      "EVAL",
      RATE_SCRIPT,
      keys.length,
      ...keys,
      3600,
      30,
      3,
      ...(keys.length === 3 ? [5] : []),
    ]),
    signal: AbortSignal.timeout(4000),
  });
  if (!response.ok) throw new Error("Limiter unavailable");
  const data = await response.json();
  if (
    !Array.isArray(data.result) ||
    ![0, 1].includes(data.result[0]) ||
    !Number.isFinite(data.result[1])
  )
    throw new Error("Limiter unavailable");
  return {
    allowed: data.result[0] === 1,
    retryAfter: Math.max(1, data.result[1]),
  };
}
export function memoryRateLimiter() {
  const windows = new Map<string, { count: number; expires: number }>();
  return async (keys: string[], now = Date.now()): Promise<LimitResult> => {
    for (const [key, window] of windows)
      if (window.expires <= now) windows.delete(key);
    const limits = [30, 3, 5];
    for (const [i, key] of keys.entries()) {
      const window = windows.get(key);
      if (window && window.count >= limits[i])
        return {
          allowed: false,
          retryAfter: Math.ceil((window.expires - now) / 1000),
        };
    }
    for (const key of keys) {
      const window = windows.get(key) || { count: 0, expires: now + 3600000 };
      window.count++;
      windows.set(key, window);
    }
    return { allowed: true, retryAfter: 0 };
  };
}
