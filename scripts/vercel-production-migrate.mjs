import { spawnSync } from "node:child_process";

const vercelEnv = process.env.VERCEL_ENV ?? "";
const gitRef = process.env.VERCEL_GIT_COMMIT_REF ?? "";

if (vercelEnv !== "production") {
  console.log("[migration-gate] Non-production build; skipping prisma migrate deploy.");
  process.exit(0);
}

if (gitRef && gitRef !== "main") {
  console.error(`[migration-gate] Refusing production migration from non-main ref: ${gitRef}`);
  process.exit(1);
}

if (!process.env.DATABASE_URL) {
  console.error("[migration-gate] DATABASE_URL is required for a production migration.");
  process.exit(1);
}

console.log("[migration-gate] Production build detected; applying pending Prisma migrations.");

const result = spawnSync(
  process.platform === "win32" ? "npx.cmd" : "npx",
  ["prisma", "migrate", "deploy"],
  {
    stdio: "inherit",
    env: process.env,
  },
);

if (result.error) {
  console.error("[migration-gate] Failed to start prisma migrate deploy.");
  console.error(result.error.message);
  process.exit(1);
}

if (result.status !== 0) {
  console.error(`[migration-gate] prisma migrate deploy exited with code ${result.status ?? "unknown"}.`);
  process.exit(result.status ?? 1);
}

console.log("[migration-gate] Production migrations are up to date.");
