import { randomUUID, timingSafeEqual } from "node:crypto";
import { createInvitationWorker } from "@/features/access/server/invitationComposition";

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

  const workerId = `access-cron:${randomUUID()}`;
  const worker = createInvitationWorker();
  const dispatched = await worker.dispatch.execute({ workerId, limit: 100 });
  const processed = await worker.process.execute({ workerId, limit: 100 });
  return Response.json({ ok: true, dispatched, processed }, { headers: { "Cache-Control": "no-store" } });
}
