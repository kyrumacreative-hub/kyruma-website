import assert from "node:assert/strict";
import test from "node:test";
import { assertSafeTestDatabase } from "./database-safety.mjs";

test("accepts an isolated PostgreSQL TEST database", () => {
  assert.deepEqual(assertSafeTestDatabase({
    DATABASE_URL: "postgresql://user:secret@db.example.com/kyruma",
    TEST_DATABASE_URL: "postgresql://user:secret@db.example.com/kyruma_test",
  }), { database: "kyruma_test" });
});

test("rejects production context, shared URLs and ambiguous database names", () => {
  const isolated = "postgresql://user:secret@localhost/kyruma_test";
  assert.throws(() => assertSafeTestDatabase({ TEST_DATABASE_URL: isolated, VERCEL_ENV: "production" }), /BLOCKED/);
  assert.throws(() => assertSafeTestDatabase({ TEST_DATABASE_URL: isolated, DATABASE_URL: isolated }), /MUST_DIFFER/);
  assert.throws(() => assertSafeTestDatabase({ TEST_DATABASE_URL: "postgresql://user:secret@localhost/kyruma" }), /EXPLICITLY_TEST/);
});

