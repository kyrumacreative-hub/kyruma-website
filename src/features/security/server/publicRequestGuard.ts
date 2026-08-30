import "server-only";

import { createHmac } from "node:crypto";
import { prisma } from "../../../lib/prisma";
import { assertTrustedPublicOrigin, PublicRequestError } from "./publicRequestPolicy";

export class PublicRateLimitError extends Error {
  readonly status = 429;
  constructor(readonly retryAfterSeconds: number) {
    super("RATE_LIMITED");
  }
}

function requestSubject(request: Request): string {
  const forwarded = request.headers.get("x-vercel-forwarded-for") ?? request.headers.get("x-forwarded-for");
  const address = forwarded?.split(",")[0]?.trim().slice(0, 128);
  if (address) return `ip:${address}`;
  return `fallback:${(request.headers.get("user-agent") ?? "unknown").slice(0, 256)}`;
}

export async function enforcePublicRequestGuard(request: Request, input: {
  readonly route: string;
  readonly limit: number;
  readonly windowMs: number;
}): Promise<void> {
  assertTrustedPublicOrigin(request, process.env);
  const secret = process.env.FORM_RATE_LIMIT_SECRET ?? "";
  if (secret.length < 32) throw new PublicRequestError("SECURITY_CONFIGURATION_REQUIRED", 503);

  const now = Date.now();
  const windowStartedAtMs = Math.floor(now / input.windowMs) * input.windowMs;
  const windowStartedAt = new Date(windowStartedAtMs);
  const expiresAt = new Date(windowStartedAtMs + input.windowMs * 2);
  const subjectHash = createHmac("sha256", secret)
    .update(`public-rate-limit:v1:${input.route}:${requestSubject(request)}`, "utf8")
    .digest("hex");
  const id = createHmac("sha256", secret)
    .update(`public-rate-limit-window:v1:${input.route}:${subjectHash}:${windowStartedAt.toISOString()}`, "utf8")
    .digest("hex");

  const bucket = await prisma.publicRequestRateLimit.upsert({
    where: { id },
    create: { id, route: input.route, subjectHash, windowStartedAt, requestCount: 1, expiresAt, createdAt: new Date(now), updatedAt: new Date(now) },
    update: { requestCount: { increment: 1 }, updatedAt: new Date(now) },
    select: { requestCount: true },
  });
  if (bucket.requestCount > input.limit) {
    throw new PublicRateLimitError(Math.max(1, Math.ceil((windowStartedAtMs + input.windowMs - now) / 1000)));
  }
}
