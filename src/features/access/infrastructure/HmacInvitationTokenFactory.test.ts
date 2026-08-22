import test from "node:test";
import assert from "node:assert/strict";
import { HmacInvitationTokenFactory } from "./HmacInvitationTokenFactory";

test("derives stable versioned invitation tokens without exposing the secret", () => {
  const factory = new HmacInvitationTokenFactory({ 1: "a".repeat(32), 2: "b".repeat(32) });
  const first = factory.create("invite-1", 1);
  assert.equal(first, factory.create("invite-1", 1));
  assert.notEqual(first, factory.create("invite-2", 1));
  assert.notEqual(first, factory.create("invite-1", 2));
  assert.match(first, /^v1\.[A-Za-z0-9_-]{43}$/);
  assert.equal(first.includes("a".repeat(32)), false);
});

test("rejects missing and undersized version secrets", () => {
  const factory = new HmacInvitationTokenFactory({ 1: "short" });
  assert.throws(() => factory.create("invite-1", 1), /SECRET_V1_INVALID/);
  assert.throws(() => factory.create("invite-1", 2), /SECRET_V2_INVALID/);
});
