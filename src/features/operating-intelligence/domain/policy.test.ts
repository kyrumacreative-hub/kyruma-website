import assert from "node:assert/strict";
import test from "node:test";
import { assertBrainScope, assertRadarTransition, optionalNonNegativeInteger, resolveWorkflowKey } from "./policy";

test("permits approved RADAR transitions and rejects shortcuts", () => {
  assert.doesNotThrow(() => assertRadarTransition("OBSERVED", "ANALYZED"));
  assert.doesNotThrow(() => assertRadarTransition("TEST", "RESULT"));
  assert.throws(() => assertRadarTransition("OBSERVED", "ACTION"), /RADAR_TRANSITION_INVALID/);
});

test("enforces isolated Brain scope references", () => {
  assert.doesNotThrow(() => assertBrainScope("GLOBAL"));
  assert.doesNotThrow(() => assertBrainScope("CLIENT", "workspace-1"));
  assert.doesNotThrow(() => assertBrainScope("PROJECT", "workspace-1", "project-1"));
  assert.throws(() => assertBrainScope("CLIENT"), /BRAIN_CLIENT_SCOPE_INVALID/);
  assert.throws(() => assertBrainScope("GLOBAL", "workspace-1"), /BRAIN_GLOBAL_SCOPE_INVALID/);
});

test("routes only the seven approved content workflows", () => {
  assert.equal(resolveWorkflowKey("reel-script"), "reel-script");
  assert.equal(resolveWorkflowKey("strategy"), undefined);
});

test("accepts non-negative operational metrics only", () => {
  assert.equal(optionalNonNegativeInteger("15"), 15);
  assert.equal(optionalNonNegativeInteger(""), undefined);
  assert.throws(() => optionalNonNegativeInteger("-1"), /OPERATING_INTELLIGENCE_NUMBER_INVALID/);
});
