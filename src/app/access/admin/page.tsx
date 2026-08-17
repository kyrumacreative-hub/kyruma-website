import { UserButton } from "@clerk/nextjs";
import { redirect } from "next/navigation";
import { issuePartnerInvitation } from "./actions";
import { requireCurrentActor } from "@/features/access/server/currentActor";
import { isInternalAdminEmail } from "@/features/access/server/internalAdmin";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export default async function AccessAdminPage({
  searchParams,
}: {
  searchParams: Promise<{ sent?: string }>;
}) {
  const actor = await requireCurrentActor();

  if (!isInternalAdminEmail(actor.user.email)) {
    redirect("/access/pending");
  }

  const params = await searchParams;

  const workspaces = await prisma.workspace.findMany({
    orderBy: [{ createdAt: "desc" }],
    select: {
      id: true,
      name: true,
      partnerId: true,
      organizationId: true,
      status: true,
    },
  });

  return (
    <main className="min-h-screen bg-[var(--background)] px-6 pb-24 pt-32 text-[var(--foreground)]">
      <div className="mx-auto max-w-3xl">
        <header className="flex items-start justify-between gap-8 border-b border-[var(--border)] pb-10">
          <div>
            <p className="text-xs uppercase tracking-[.28em] text-[var(--primary)]">
              KYRUMA Platform
            </p>
            <h1 className="mt-4 text-4xl font-light">Invitar partner</h1>
            <p className="mt-3 text-[var(--muted)]">
              Emite una invitación segura para acceder a un Workspace.
            </p>
          </div>
          <UserButton />
        </header>

        {params.sent === "1" ? (
          <div className="mt-8 rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-5">
            <p>Invitación emitida correctamente.</p>
            <p className="mt-2 text-sm text-[var(--muted)]">
              Clerk enviará el enlace de acceso al email indicado.
            </p>
          </div>
        ) : null}

        <form
          action={issuePartnerInvitation}
          className="mt-10 space-y-6 rounded-3xl border border-[var(--border)] bg-[var(--surface)] p-8"
        >
          <div>
            <label className="text-sm" htmlFor="email">
              Email del partner
            </label>
            <input
              className="mt-2 w-full rounded-xl border border-[var(--border)] bg-[var(--background)] px-4 py-3"
              id="email"
              name="email"
              type="email"
              required
            />
          </div>

          <div>
            <label className="text-sm" htmlFor="workspaceId">
              Workspace
            </label>
            <select
              className="mt-2 w-full rounded-xl border border-[var(--border)] bg-[var(--background)] px-4 py-3"
              id="workspaceId"
              name="workspaceId"
              required
            >
              <option value="">Selecciona un Workspace</option>
              {workspaces.map((workspace) => (
                <option
                  key={workspace.id}
                  value={workspace.id}
                  disabled={workspace.status !== "active"}
                >
                  {workspace.name} · {workspace.status}
                </option>
              ))}
            </select>
          </div>

          <button
            className="rounded-full bg-[var(--foreground)] px-6 py-3 text-[var(--background)]"
            type="submit"
          >
            Enviar invitación
          </button>
        </form>
      </div>
    </main>
  );
}
