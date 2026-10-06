import { NextRequest, NextResponse } from "next/server";
import { confirmSignalSubscription } from "@/features/signal/server/subscriptionService";

export const runtime = "nodejs";

export async function GET(request: NextRequest) {
  const id = request.nextUrl.searchParams.get("id") ?? "";
  const token = request.nextUrl.searchParams.get("token") ?? "";
  if (!id || !token) return NextResponse.redirect(new URL("/signal?status=invalid", request.url));
  try {
    const ok = await confirmSignalSubscription(id, token);
    return NextResponse.redirect(new URL(ok ? "/signal?status=confirmed" : "/signal?status=invalid", request.url));
  } catch (error) {
    console.error("SIGNAL_CONFIRM_FAILED", error instanceof Error ? error.name : "UNKNOWN");
    return NextResponse.redirect(new URL("/signal?status=error", request.url));
  }
}
