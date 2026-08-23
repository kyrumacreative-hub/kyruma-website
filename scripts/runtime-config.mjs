const requiredProductionValues = [
  "DATABASE_URL",
  "NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY",
  "CLERK_SECRET_KEY",
  "ACCESS_INVITATION_TOKEN_SECRET",
  "APP_URL",
  "CRON_SECRET",
  "KYRUMA_INTERNAL_ADMIN_EMAILS",
  "KYRUMA_DEFAULT_LEAD_OWNER_ID",
  "RESEND_API_KEY",
];

export function validateProductionEnvironment(environment) {
  const failures = [];
  for (const key of requiredProductionValues) {
    if (!environment[key]?.trim()) failures.push(`${key}:missing`);
  }

  if (environment.ACCESS_INVITATION_TOKEN_SECRET && environment.ACCESS_INVITATION_TOKEN_SECRET.length < 32) {
    failures.push("ACCESS_INVITATION_TOKEN_SECRET:too_short");
  }
  if (environment.CRON_SECRET && environment.CRON_SECRET.length < 32) failures.push("CRON_SECRET:too_short");
  if (environment.APP_URL) {
    try {
      const url = new URL(environment.APP_URL);
      if (url.protocol !== "https:") failures.push("APP_URL:https_required");
      if (url.username || url.password) failures.push("APP_URL:credentials_forbidden");
      if (url.pathname !== "/" || url.search || url.hash) failures.push("APP_URL:origin_only");
    } catch {
      failures.push("APP_URL:invalid");
    }
  }
  if (environment.TEST_DATABASE_URL && environment.TEST_DATABASE_URL === environment.DATABASE_URL) {
    failures.push("TEST_DATABASE_URL:matches_production");
  }
  return { ok: failures.length === 0, failures };
}

export { requiredProductionValues };
