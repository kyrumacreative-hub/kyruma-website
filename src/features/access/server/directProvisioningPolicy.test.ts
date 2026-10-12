import assert from "node:assert/strict";
import test from "node:test";
import { assertDirectPartnerProvisioningAllowed } from "./directProvisioningPolicy";

test("fails closed if the opt-in is absent or false", () => {
  assert.throws(() => assertDirectPartnerProvisioningAllowed({ NODE_ENV: "test" }), /ACCESS_DIRECT_PROVISIONING_DISABLED/);
  assert.throws(() => assertDirectPartnerProvisioningAllowed({ NODE_ENV: "test", KYRUMA_ALLOW_DIRECT_PARTNER_PROVISIONING: "false" }), /ACCESS_DIRECT_PROVISIONING_DISABLED/);
});

test("production refuses direct provisioning even when explicitly enabled", () => {
  assert.throws(() => assertDirectPartnerProvisioningAllowed({ NODE_ENV: "production", KYRUMA_ALLOW_DIRECT_PARTNER_PROVISIONING: "true" }), /ACCESS_DIRECT_PROVISIONING_DISABLED/);
});

test("non-production isolated tests may explicitly opt in", () => {
  assert.doesNotThrow(() => assertDirectPartnerProvisioningAllowed({ NODE_ENV: "test", KYRUMA_ALLOW_DIRECT_PARTNER_PROVISIONING: "true" }));
});
