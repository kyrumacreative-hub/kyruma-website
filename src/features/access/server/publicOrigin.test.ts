import assert from "node:assert/strict";
import test from "node:test";
import { resolvePublicOrigin } from "./publicOrigin";

test("uses localhost by default outside production", () => {
  assert.equal(resolvePublicOrigin({ NODE_ENV: "development" }), "http://localhost:3000");
});

test("normalizes a configured HTTPS application origin", () => {
  assert.equal(resolvePublicOrigin({ APP_URL: "https://platform.kyruma.com/access", NODE_ENV: "production" }), "https://platform.kyruma.com");
});

test("requires an explicit secure origin in production", () => {
  assert.throws(() => resolvePublicOrigin({ NODE_ENV: "production" }), /required/);
  assert.throws(() => resolvePublicOrigin({ APP_URL: "http://kyruma.com", NODE_ENV: "production" }), /https/);
});

test("rejects origins containing credentials", () => {
  assert.throws(() => resolvePublicOrigin({ APP_URL: "https://user:secret@kyruma.com" }), /credentials/);
});
