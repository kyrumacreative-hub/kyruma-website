import { randomUUID, timingSafeEqual } from "node:crypto";
import { createInvitationWorker } from "@/features/access/server/invitationComposition";
import { createAutomationWorker } from "@/features/operating-layer/server/automationWorker";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

function isAuthorized(request: Request, secret: string): boolean {
  const expected = Buffer.from(`Bearer ${secret}`, "utf8");
  const actual = Buffer.from(request.headers.get("authorization") ?? "", "utf8");
  return actual.length === expected.length && timingSafeEqual(actual, expected);
}

export async function GET(request: Request): Promise<Response> {
  const secret = process.env.CRON_SECRET ?? "";
  if (secret.length < 32) return Response.json({ ok: false, error: "CRON_NOT_CONFIGURED" }, { status: 503 });
  if (!isAuthorized(request, secret)) return Response.json({ ok: false, error: "UNAUTHORIZED" }, { status: 401 });

  const executionId = randomUUID();
  try {
    const access = createInvitationWorker();
    const automations = createAutomationWorker();
    const accessDispatched = await access.dispatch.execute({ workerId: `operations:${executionId}:access-dispatch`, limit: 100 });
    const accessProcessed = await access.process.execute({ workerId: `operations:${executionId}:access-process`, limit: 100 });
    const automationsDispatched = await automations.dispatch.execute({ workerId: `operations:${executionId}:automation-dispatch`, limit: 100 });
    const automationsProcessed = await automations.process.execute({ workerId: `operations:${executionId}:automation-process`, limit: 100 });
    const expiredRateLimits = await prisma.publicRequestRateLimit.deleteMany({ where: { expiresAt: { lt: new Date() } } });
    return Response.json({
      ok: true,
      executionId,
      access: { dispatched: accessDispatched, processed: accessProcessed },
      automations: { dispatched: automationsDispatched, processed: automationsProcessed },
      maintenance: { expiredRateLimitBuckets: expiredRateLimits.count },
      capacity: { perQueue: 100, schedule: "daily" },
    }, { headers: { "Cache-Control": "no-store" } });
  } catch (error) {
    console.error("OPERATIONS_CRON_FAILED", error instanceof Error ? error.name : "UNKNOWN");
    return Response.json({ ok: false, executionId, error: "OPERATIONS_CRON_FAILED" }, { status: 500, headers: { "Cache-Control": "no-store" } });
  }
}
