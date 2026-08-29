import assert from "node:assert/strict";
import test from "node:test";
import { PublicRequestError, allowedPublicOrigins, assertTrustedPublicOrigin, readLimitedJson } from "./publicRequestPolicy";

const production: NodeJS.ProcessEnv = { ...process.env, APP_URL: "https://www.kyruma.com", VERCEL_ENV: "production" };

test("production allows only the canonical same-origin request", () => {
  assert.deepEqual([...allowedPublicOrigins(production)], ["https://www.kyruma.com"]);
  assert.doesNotThrow(() => assertTrustedPublicOrigin(new Request("https://www.kyruma.com/api/contact", {
    method: "POST", headers: { origin: "https://www.kyruma.com", "sec-fetch-site": "same-origin" }, body: "{}",
  }), production));
  assert.throws(() => assertTrustedPublicOrigin(new Request("https://www.kyruma.com/api/contact", {
    method: "POST", headers: { origin: "https://attacker.example", "sec-fetch-site": "cross-site" }, body: "{}",
  }), production), (error) => error instanceof PublicRequestError && error.code === "ORIGIN_FORBIDDEN");
});

test("preview adds only its Vercel origin and local development origins", () => {
  const origins = allowedPublicOrigins({ ...process.env, APP_URL: "https://www.kyruma.com", VERCEL_ENV: "preview", VERCEL_URL: "preview.example.vercel.app" });
  assert.equal(origins.has("https://preview.example.vercel.app"), true);
  assert.equal(origins.has("http://localhost:3000"), true);
});

test("reads valid JSON and rejects malformed or oversized bodies", async () => {
  assert.deepEqual(await readLimitedJson(new Request("https://www.kyruma.com/api/contact", { method: "POST", body: '{"ok":true}' }), 64), { ok: true });
  await assert.rejects(() => readLimitedJson(new Request("https://www.kyruma.com/api/contact", { method: "POST", body: "{" }), 64), /BODY_INVALID/);
  await assert.rejects(() => readLimitedJson(new Request("https://www.kyruma.com/api/contact", { method: "POST", body: "x".repeat(65) }), 64), /BODY_TOO_LARGE/);
});
