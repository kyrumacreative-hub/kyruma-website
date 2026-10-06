import { NextRequest, NextResponse } from "next/server";
import { enforcePublicRequestGuard, PublicRateLimitError } from "@/features/security/server/publicRequestGuard";
import { PublicRequestError, assertPublicMutationEnvironment, readLimitedJson } from "@/features/security/server/publicRequestPolicy";
import { requestSignalSubscription } from "@/features/signal/server/subscriptionService";

export const runtime = "nodejs";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

type Payload = {
  email?: unknown;
  language?: unknown;
  privacy?: unknown;
  website?: unknown;
  startedAt?: unknown;
  source?: unknown;
};

function text(value: unknown, max = 500) {
  return typeof value === "string" ? value.trim().slice(0, max) : "";
}

export async function POST(request: NextRequest) {
  try {
    assertPublicMutationEnvironment(process.env);
    await enforcePublicRequestGuard(request, { route: "signal-subscribe", limit: 5, windowMs: 15 * 60 * 1000 });

    const body = (await readLimitedJson(request, 8 * 1024)) as Payload;
    const email = text(body.email, 180).toLowerCase();
    const language = body.language === "en" ? "en" : "es";
    const privacy = body.privacy === true;
    const honeypot = text(body.website, 200);
    const startedAt = typeof body.startedAt === "number" ? body.startedAt : 0;
    const source = text(body.source, 120) || "signal_page";

    if (honeypot || !startedAt || Date.now() - startedAt < 1800) {
      return NextResponse.json({ ok: true });
    }

    if (!EMAIL_RE.test(email) || !privacy) {
      return NextResponse.json({ ok: false, code: "INVALID" }, { status: 400 });
    }

    const result = await requestSignalSubscription({ email, language, source });
    return NextResponse.json({ ok: true, status: result.status });
  } catch (error) {
    if (error instanceof PublicRateLimitError) {
      return NextResponse.json({ ok: false, code: "RATE_LIMITED" }, {
        status: error.status,
        headers: { "Cache-Control": "no-store", "Retry-After": String(error.retryAfterSeconds) },
      });
    }
    if (error instanceof PublicRequestError) {
      return NextResponse.json({ ok: false, code: error.code }, { status: error.status, headers: { "Cache-Control": "no-store" } });
    }
    console.error("SIGNAL_SUBSCRIBE_FAILED", error instanceof Error ? error.name : "UNKNOWN");
    return NextResponse.json({ ok: false }, { status: 500, headers: { "Cache-Control": "no-store" } });
  }
}
