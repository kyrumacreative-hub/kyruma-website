import assert from "node:assert/strict";
import test from "node:test";
import { createLead, LeadValidationError } from "./lead";

const input = { id: "lead-1", organizationId: "org-1", ownerId: "user-1", primaryContactId: "contact-1", origin: "manual", createdAt: new Date("2026-08-05"), createdBy: "user-1" };

test("creates an identified lead with all required references", () => {
  const lead = createLead(input);
  assert.equal(lead.status, "identified");
  assert.equal(lead.organizationId, "org-1");
});

test("rejects a lead without an immutable origin", () => {
  assert.throws(() => createLead({ ...input, origin: "" }), LeadValidationError);
});
