import assert from "node:assert/strict";
import test from "node:test";
import { toAccessInvitationDeliveryError } from "./ClerkAccessInvitationDelivery";

test("classifies Clerk failures without persisting provider details or PII", () => {
  const rejected = toAccessInvitationDeliveryError({
    status: 422,
    errors: [{ code: "form_identifier_exists", longMessage: "partner@example.com already exists" }],
  });
  assert.equal(rejected.code, "CLERK_FORM_IDENTIFIER_EXISTS");
  assert.equal(rejected.retryable, false);
  assert.equal(rejected.message.includes("partner@example.com"), false);

  const throttled = toAccessInvitationDeliveryError({ status: 429, errors: [] });
  assert.equal(throttled.code, "CLERK_HTTP_429");
  assert.equal(throttled.retryable, true);
});
