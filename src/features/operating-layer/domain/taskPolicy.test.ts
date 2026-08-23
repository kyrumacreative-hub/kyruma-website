import assert from "node:assert/strict";
import test from "node:test";
import { assertSubmissionId, normalizeFunnelEmail, parseOperationalTaskConfiguration } from "./taskPolicy";

test("validates the allowlisted operational task configuration", () => {
  assert.deepEqual(parseOperationalTaskConfiguration({ taskType: "lead.follow-up", title: "Review lead", dueHours: 24 }), {
    taskType: "lead.follow-up", title: "Review lead", dueHours: 24,
  });
  assert.throws(() => parseOperationalTaskConfiguration({ taskType: "lead", title: "Review", dueHours: 0 }), /DUE_HOURS/);
});

test("normalizes funnel identity and requires an opaque UUID submission key", () => {
  assert.equal(normalizeFunnelEmail(" Lead@Example.COM "), "lead@example.com");
  assert.equal(assertSubmissionId("d9428888-122b-4c26-9f2e-540d7c36e63f"), "d9428888-122b-4c26-9f2e-540d7c36e63f");
  assert.throws(() => normalizeFunnelEmail("invalid"), /EMAIL_INVALID/);
  assert.throws(() => assertSubmissionId("guessable"), /SUBMISSION_ID_INVALID/);
});

