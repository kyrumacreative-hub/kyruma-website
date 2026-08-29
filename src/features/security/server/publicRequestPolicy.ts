export type PublicRequestErrorCode =
  | "BODY_INVALID"
  | "BODY_TOO_LARGE"
  | "ORIGIN_FORBIDDEN"
  | "SECURITY_CONFIGURATION_REQUIRED";

export class PublicRequestError extends Error {
  constructor(readonly code: PublicRequestErrorCode, readonly status: 400 | 403 | 413 | 503) {
    super(code);
  }
}

function asOrigin(value: string | undefined): string | null {
  if (!value?.trim()) return null;
  try {
    return new URL(value).origin;
  } catch {
    return null;
  }
}

export function allowedPublicOrigins(environment: NodeJS.ProcessEnv): ReadonlySet<string> {
  const origins = new Set<string>();
  const appOrigin = asOrigin(environment.APP_URL);
  if (appOrigin) origins.add(appOrigin);

  if (environment.VERCEL_ENV !== "production") {
    const vercelOrigin = asOrigin(environment.VERCEL_URL ? `https://${environment.VERCEL_URL}` : undefined);
    if (vercelOrigin) origins.add(vercelOrigin);
    origins.add("http://localhost:3000");
    origins.add("http://127.0.0.1:3000");
  }
  return origins;
}

export function assertTrustedPublicOrigin(request: Request, environment: NodeJS.ProcessEnv): void {
  const allowed = allowedPublicOrigins(environment);
  if (!allowed.size) throw new PublicRequestError("SECURITY_CONFIGURATION_REQUIRED", 503);

  const origin = asOrigin(request.headers.get("origin") ?? undefined);
  const fetchSite = request.headers.get("sec-fetch-site");
  if (!origin || !allowed.has(origin) || (fetchSite && fetchSite !== "same-origin" && fetchSite !== "none")) {
    throw new PublicRequestError("ORIGIN_FORBIDDEN", 403);
  }
}

export async function readLimitedJson(request: Request, maxBytes: number): Promise<unknown> {
  const declaredLength = Number(request.headers.get("content-length") ?? "0");
  if (Number.isFinite(declaredLength) && declaredLength > maxBytes) {
    throw new PublicRequestError("BODY_TOO_LARGE", 413);
  }

  const reader = request.body?.getReader();
  if (!reader) throw new PublicRequestError("BODY_INVALID", 400);
  const chunks: Uint8Array[] = [];
  let received = 0;

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    received += value.byteLength;
    if (received > maxBytes) {
      await reader.cancel();
      throw new PublicRequestError("BODY_TOO_LARGE", 413);
    }
    chunks.push(value);
  }

  const body = new Uint8Array(received);
  let offset = 0;
  for (const chunk of chunks) {
    body.set(chunk, offset);
    offset += chunk.byteLength;
  }

  try {
    return JSON.parse(new TextDecoder().decode(body)) as unknown;
  } catch {
    throw new PublicRequestError("BODY_INVALID", 400);
  }
}
