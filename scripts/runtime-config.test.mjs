import assert from "node:assert/strict";
import test from "node:test";
import { validateProductionEnvironment } from "./runtime-config.mjs";

const valid = {
  DATABASE_URL: "postgresql://user:secret@db.example.com/kyruma",
  NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY: "pk_live_example",
  CLERK_SECRET_KEY: "configured-by-vercel",
  ACCESS_INVITATION_TOKEN_SECRET: "a".repeat(32),
  APP_URL: "https://www.kyruma.com",
  CRON_SECRET: "b".repeat(32),
  KYRUMA_INTERNAL_ADMIN_EMAILS: "operations@example.com",
  RESEND_API_KEY: "configured-by-vercel",
};

test("accepts the complete production environment contract", () => {
  assert.deepEqual(validateProductionEnvironment(valid), { ok: true, failures: [] });
});

test("reports names and reasons without exposing secret values", () => {
  const result = validateProductionEnvironment({ ...valid, APP_URL: "http://user:secret@example.com/path", CRON_SECRET: "short" });
  assert.equal(result.ok, false);
  assert.deepEqual(result.failures, ["CRON_SECRET:too_short", "APP_URL:https_required", "APP_URL:credentials_forbidden", "APP_URL:origin_only"]);
  assert.equal(JSON.stringify(result).includes("user:secret"), false);
});

