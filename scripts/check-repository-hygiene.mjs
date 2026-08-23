import { execFileSync } from "node:child_process";
import fs from "node:fs";

const tracked = execFileSync("git", ["ls-files", "-z"], { encoding: "utf8" }).split("\0").filter(Boolean);
const forbiddenFiles = tracked.filter((file) => /(^|\/)\.env(?:\.|$)/.test(file) && !file.endsWith(".env.example"));
const secretPatterns = [
  /-----BEGIN (?:RSA |EC |OPENSSH )?PRIVATE KEY-----/,
  /\bAKIA[0-9A-Z]{16}\b/,
  /\bgh[pousr]_[A-Za-z0-9]{30,}\b/,
  /\bsk-(?:proj-|live-|test-)[A-Za-z0-9_-]{20,}\b/,
  /\bre_[A-Za-z0-9]{24,}\b/,
];
const findings = [...forbiddenFiles.map((file) => `${file}:tracked_environment_file`)];

for (const file of tracked) {
  let content;
  try { content = fs.readFileSync(file, "utf8"); } catch { continue; }
  if (content.includes("\0")) continue;
  if (secretPatterns.some((pattern) => pattern.test(content))) findings.push(`${file}:high_confidence_secret_pattern`);
}

if (findings.length) {
  console.error("Repository hygiene gate: FAIL");
  for (const finding of findings) console.error(`- ${finding}`);
  process.exitCode = 1;
} else {
  console.log("Repository hygiene gate: PASS");
}

