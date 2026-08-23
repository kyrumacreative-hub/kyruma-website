export interface PublicOriginEnvironment {
  readonly APP_URL?: string;
  readonly NODE_ENV?: string;
}

export function resolvePublicOrigin(environment: PublicOriginEnvironment): string {
  const configured = environment.APP_URL?.trim();
  if (!configured && environment.NODE_ENV === "production") {
    throw new Error("APP_URL is required in production.");
  }

  const origin = new URL(configured || "http://localhost:3000");
  if (origin.protocol !== "http:" && origin.protocol !== "https:") {
    throw new Error("APP_URL must use http or https.");
  }
  if (environment.NODE_ENV === "production" && origin.protocol !== "https:") {
    throw new Error("APP_URL must use https in production.");
  }
  if (origin.username || origin.password) {
    throw new Error("APP_URL must not contain credentials.");
  }

  return origin.origin;
}
