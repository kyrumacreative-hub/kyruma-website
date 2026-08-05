import assert from "node:assert/strict";
import test from "node:test";
import {
  InvalidLeadOriginError,
  InvalidLeadStateError,
  MissingOrganizationError,
  MissingOwnerError,
  MissingPrimaryContactError,
} from "./errors";
import { LeadFactory } from "./leadFactory";
import { LeadOrigin, LeadStatus } from "./valueObjects";

const input = { id: "lead-1", organizationId: "org-1", ownerId: "user-1", primaryContactId: "contact-1", origin: "manual", createdAt: new Date("2026-08-05"), createdBy: "user-1" };

test("factory creates the only valid initial Lead state", () => {
  const lead = LeadFactory.create(input);
  assert.equal(lead.status.value, "identified");
  assert.equal(lead.organizationId.value, "org-1");
  assert.equal(lead.origin.value, "manual");
  assert.equal(lead.createdBy, "user-1");
});

test("factory rejects missing Organization, Owner and Contact", () => {
  assert.throws(() => LeadFactory.create({ ...input, organizationId: "" }), MissingOrganizationError);
  assert.throws(() => LeadFactory.create({ ...input, ownerId: "" }), MissingOwnerError);
  assert.throws(() => LeadFactory.create({ ...input, primaryContactId: "" }), MissingPrimaryContactError);
});

test("value objects reject invalid origin and state", () => {
  assert.throws(() => LeadOrigin.create(""), InvalidLeadOriginError);
  assert.throws(() => LeadStatus.create("partner_created"), InvalidLeadStateError);
});
