import assert from "node:assert/strict";
import test from "node:test";
import {
  requireStableSubjectBinding,
  requireVerifiedPrimaryEmail,
} from "./identityClaim";

test("normalizes a verified Clerk primary email", () => {
  assert.equal(
    requireVerifiedPrimaryEmail(" Partner@Example.com ", "verified"),
    "partner@example.com",
  );
});

test("rejects unverified or missing primary email claims", () => {
  assert.throws(
    () => requireVerifiedPrimaryEmail("partner@example.com", "unverified"),
    /IDENTITY_EMAIL_UNVERIFIED/,
  );
  assert.throws(
    () => requireVerifiedPrimaryEmail(undefined, "verified"),
    /IDENTITY_EMAIL_REQUIRED/,
  );
});

test("prevents rebinding an existing identity to another Clerk subject", () => {
  assert.doesNotThrow(() => requireStableSubjectBinding("clerk-1", "clerk-1"));
  assert.throws(
    () => requireStableSubjectBinding("clerk-1", "clerk-2"),
    /IDENTITY_SUBJECT_CONFLICT/,
  );
});
