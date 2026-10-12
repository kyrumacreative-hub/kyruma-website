import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

const actions = readFileSync(new URL("../src/app/access/admin/actions.ts", import.meta.url), "utf8");
const page = readFileSync(new URL("../src/app/access/admin/page.tsx", import.meta.url), "utf8");

function sliceFunction(source, start, end) {
  const at = source.indexOf(start);
  assert.ok(at >= 0, `Missing function: ${start}`);
  const finish = source.indexOf(end, at + start.length);
  assert.ok(finish > at, `Missing following boundary: ${end}`);
  return source.slice(at, finish);
}

test("AS-001: direct partner provisioning fails closed behind internal admin and feature flag", () => {
  const body = sliceFunction(
    actions,
    "export async function provisionPartnerWorkspace(",
    "export async function linkWorkspaceExternalResource(",
  );
  const admin = body.indexOf("requireInternalAdmin(actorForGate)");
  const flag = body.indexOf("assertDirectPartnerProvisioningAllowed(process.env)");
  const denied = flag;
  const mutation = body.indexOf("await prisma.$transaction(");
  assert.ok(admin >= 0 && flag > admin && mutation > flag,
    "Admin check and fail-closed flag must precede all provisioning writes");
  assert.match(body, /status: "active"/);
});

test("AS-001: exceptional import form is guarded and canonical invitation remains available", () => {
  const guard = page.indexOf('process.env.KYRUMA_ALLOW_DIRECT_PARTNER_PROVISIONING === "true"');
  const directForm = page.indexOf("action={provisionPartnerWorkspace}");
  assert.ok(guard >= 0 && directForm > guard,
    "Exceptional form must be hidden unless explicitly enabled");
  assert.match(page, /action=\{approveAccessRequest\}/);
  assert.match(page, /action=\{issuePartnerInvitation\}/);
});

test("AS-001: normal invitation action preserves internal admin authorization", () => {
  const body = sliceFunction(
    actions,
    "export async function issuePartnerInvitation(",
    "export async function approveAccessRequest(",
  );
  assert.match(body, /requireInternalAdmin\(actor\)/);
  assert.match(body, /createInvitePartnerUseCase\(\)/);
});
