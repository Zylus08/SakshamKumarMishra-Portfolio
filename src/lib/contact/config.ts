import { z } from "zod";
import { origin } from "../profile";
export type ContactEnvironment = Record<string, string | undefined>;
export function contactMode(
  env: ContactEnvironment = process.env,
): "mock" | "live" | "disabled" {
  if (env.CONTACT_TRANSPORT === "mock") return "mock";
  if (env.CONTACT_TRANSPORT === "resend") return "live";
  return env.NODE_ENV === "development" ? "mock" : "disabled";
}
export function allowedOrigins(env: ContactEnvironment) {
  return [
    origin,
    ...(env.CONTACT_ALLOWED_ORIGINS || "")
      .split(",")
      .map((value) => value.trim())
      .filter((value) => {
        try {
          return new URL(value).origin === value;
        } catch {
          return false;
        }
      }),
    ...(env.NODE_ENV === "development"
      ? ["http://localhost:3000", "http://127.0.0.1:3000"]
      : []),
  ];
}
export function liveConfiguration(env: ContactEnvironment) {
  const from = z.string().email().safeParse(env.CONTACT_FROM_EMAIL),
    to = z.string().email().safeParse(env.CONTACT_TO_EMAIL);
  if (
    !env.RESEND_API_KEY ||
    !from.success ||
    !to.success ||
    !env.UPSTASH_REDIS_REST_URL ||
    !env.UPSTASH_REDIS_REST_TOKEN ||
    (env.CONTACT_RATE_LIMIT_SECRET?.length || 0) < 32
  )
    throw new Error("Contact unavailable");
  const domain = from.data.split("@")[1].toLowerCase();
  if (!domain.endsWith(".sakshamkumarmishra.cv"))
    throw new Error("A portfolio sending subdomain is required");
  const redis = new URL(env.UPSTASH_REDIS_REST_URL);
  if (redis.protocol !== "https:" || redis.username || redis.password)
    throw new Error("Invalid limiter configuration");
  return {
    from: from.data,
    to: to.data,
    key: env.RESEND_API_KEY,
    redis: redis.origin,
    token: env.UPSTASH_REDIS_REST_TOKEN,
    secret: env.CONTACT_RATE_LIMIT_SECRET!,
  };
}
