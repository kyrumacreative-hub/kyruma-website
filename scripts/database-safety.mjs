import fs from "node:fs";
import path from "node:path";

export function loadLocalEnvironment(cwd = process.cwd(), environment = process.env) {
  const file = path.join(cwd, ".env.local");
  if (!fs.existsSync(file)) return { ...environment };

  const loaded = { ...environment };
  for (const rawLine of fs.readFileSync(file, "utf8").split(/\r?\n/)) {
    const line = rawLine.trim();
    if (!line || line.startsWith("#")) continue;
    const separator = line.indexOf("=");
    if (separator < 1) continue;
    const key = line.slice(0, separator).trim();
    let value = line.slice(separator + 1).trim();
    if ((value.startsWith('"') && value.endsWith('"')) || (value.startsWith("'") && value.endsWith("'"))) {
      value = value.slice(1, -1);
    }
    if (loaded[key] === undefined) loaded[key] = value;
  }
  return loaded;
}

export function assertSafeTestDatabase(environment) {
  if (environment.VERCEL_ENV === "production" || environment.NODE_ENV === "production") {
    throw new Error("TEST_DATABASE_BLOCKED_IN_PRODUCTION_CONTEXT");
  }

  const testValue = environment.TEST_DATABASE_URL?.trim();
  if (!testValue) throw new Error("TEST_DATABASE_URL_REQUIRED");
  if (testValue === environment.DATABASE_URL?.trim()) throw new Error("TEST_DATABASE_MUST_DIFFER_FROM_DATABASE_URL");

  let url;
  try {
    url = new URL(testValue);
  } catch {
    throw new Error("TEST_DATABASE_URL_INVALID");
  }
  if (!["postgres:", "postgresql:"].includes(url.protocol)) throw new Error("TEST_DATABASE_MUST_BE_POSTGRESQL");

  const database = decodeURIComponent(url.pathname.replace(/^\//, "")).toLowerCase();
  if (!/(^|[-_])test($|[-_])/.test(database)) throw new Error("TEST_DATABASE_NAME_MUST_BE_EXPLICITLY_TEST");
  return { database };
}

