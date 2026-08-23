import assert from "node:assert/strict";
import test from "node:test";
import { ClerkAccessInvitationDelivery, toAccessInvitationDeliveryError } from "./ClerkAccessInvitationDelivery";

test("creates a custom-flow invitation for an existing Clerk identity", async () => {
  let request: Record<string, unknown> | undefined;
  const delivery = new ClerkAccessInvitationDelivery(async () => ({
    invitations: {
      getInvitationList: async () => ({ data: [] }),
      createInvitation: async (input) => {
        request = input;
        return { id: "invitation_1" };
      },
    },
  }));

  const result = await delivery.create({
    email: "partner@example.com",
    invitationId: "access-invitation-1",
    workspaceId: "workspace-1",
    acceptanceUrl: "https://www.kyruma.com/access/accept?token=safe-token",
    expiresInDays: 7,
  });

  assert.equal(result.id, "invitation_1");
  assert.deepEqual(request, {
    emailAddress: "partner@example.com",
    expiresInDays: 7,
    redirectUrl: "https://www.kyruma.com/access/accept?token=safe-token",
    notify: true,
    ignoreExisting: true,
    publicMetadata: { invitationId: "access-invitation-1", workspaceId: "workspace-1" },
  });
});

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
