import { assertSafeTestDatabase, loadLocalEnvironment } from "./database-safety.mjs";

try {
  assertSafeTestDatabase(loadLocalEnvironment());
  console.log("TEST database safety gate: PASS");
} catch (error) {
  console.error(`TEST database safety gate: FAIL (${error instanceof Error ? error.message : "UNKNOWN"})`);
  process.exitCode = 1;
}

