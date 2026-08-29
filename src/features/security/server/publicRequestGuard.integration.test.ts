import assert from "node:assert/strict";
import test from "node:test";
import { PrismaClient } from "@prisma/client";
import { enforcePublicRequestGuard, PublicRateLimitError } from "./publicRequestGuard";

const client = new PrismaClient();
const route = "security-integration-test";
const previous = {
  appUrl: process.env.APP_URL,
  secret: process.env.FORM_RATE_LIMIT_SECRET,
  vercelEnv: process.env.VERCEL_ENV,
};

function request() {
  return new Request("https://www.kyruma.com/api/contact", {
    method: "POST",
    headers: {
      origin: "https://www.kyruma.com",
      "sec-fetch-site": "same-origin",
      "user-agent": "KYRUMA security integration test",
      "x-vercel-forwarded-for": "192.0.2.42",
    },
    body: "{}",
  });
}

test("persists an anonymous bucket and rejects requests over the limit", async () => {
  process.env.APP_URL = "https://www.kyruma.com";
  process.env.FORM_RATE_LIMIT_SECRET = "security-test-secret".repeat(3);
  process.env.VERCEL_ENV = "production";
  await client.publicRequestRateLimit.deleteMany({ where: { route } });

  await enforcePublicRequestGuard(request(), { route, limit: 2, windowMs: 60_000 });
  await enforcePublicRequestGuard(request(), { route, limit: 2, windowMs: 60_000 });
  await assert.rejects(
    () => enforcePublicRequestGuard(request(), { route, limit: 2, windowMs: 60_000 }),
    (error) => error instanceof PublicRateLimitError && error.retryAfterSeconds > 0,
  );

  const bucket = await client.publicRequestRateLimit.findFirstOrThrow({ where: { route } });
  assert.equal(bucket.requestCount, 3);
  assert.equal(bucket.subjectHash.includes("192.0.2.42"), false);
});

test.after(async () => {
  await client.publicRequestRateLimit.deleteMany({ where: { route } });
  if (previous.appUrl === undefined) delete process.env.APP_URL; else process.env.APP_URL = previous.appUrl;
  if (previous.secret === undefined) delete process.env.FORM_RATE_LIMIT_SECRET; else process.env.FORM_RATE_LIMIT_SECRET = previous.secret;
  if (previous.vercelEnv === undefined) delete process.env.VERCEL_ENV; else process.env.VERCEL_ENV = previous.vercelEnv;
  await client.$disconnect();
});
