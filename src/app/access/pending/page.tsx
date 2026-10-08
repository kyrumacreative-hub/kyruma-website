import { UserButton } from "@clerk/nextjs";
import { redirect } from "next/navigation";
import { requestPlatformAccess } from "./actions";
import { requireCurrentActor } from "@/features/access/server/currentActor";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export default async function PendingAccessPage({
  searchParams,
}: {
  searchParams: Promise<{ requested?: string }>;
}) {
  const actor = await requireCurrentActor();
  const params = await searchParams;

  const activeMembership = actor.memberships.find(
    (membership) =>
      membership.status === "active" &&
      Boolean(membership.scope.workspaceId),
  );

  if (activeMembership) {
    redirect("/portal");
  }

  const request = await prisma.accessRequest.findUnique({
    where: { userId: actor.user.id },
    select: {
      status: true,
      requestedAt: true,
      updatedAt: true,
    },
  });

  const pending = request?.status === "pending";
  const invited = request?.status === "invited";

  return (
    <main className="grid min-h-screen place-items-center px-6">
      <section className="w-full max-w-xl rounded-3xl border border-[var(--border)] bg-[var(--surface)] p-10 text-center">
        <div className="mx-auto w-fit">
          <UserButton />
        </div>

        <p className="mt-6 text-xs uppercase tracking-[.22em] text-[var(--primary)]">
          KYRUMA Platform
        </p>
        <h1 className="mt-3 text-3xl font-light">Acceso pendiente</h1>

        {pending ? (
          <>
            <p className="mt-4 leading-7 text-[var(--muted)]">
              Tu solicitud ya está en la cola interna de KYRUMA. Un administrador
              debe asignarte un Workspace y emitir la invitación segura antes de
              que puedas entrar.
            </p>
            <div className="mt-7 rounded-2xl bg-[var(--surface-soft)] p-5 text-left">
              <p className="text-sm font-medium">Solicitud recibida</p>
              <p className="mt-2 text-sm leading-6 text-[var(--muted)]">
                {actor.user.email}
              </p>
              <p className="mt-1 text-xs text-[var(--muted)]">
                Estado: pendiente de revisión por KYRUMA
              </p>
            </div>
          </>
        ) : invited ? (
          <>
            <p className="mt-4 leading-7 text-[var(--muted)]">
              KYRUMA ya ha revisado tu solicitud y ha emitido una invitación segura
              para el Workspace asignado.
            </p>
            <div className="mt-7 rounded-2xl bg-[var(--surface-soft)] p-5 text-left">
              <p className="text-sm font-medium">Invitación emitida</p>
              <p className="mt-2 text-sm leading-6 text-[var(--muted)]">
                Revisa el correo de {actor.user.email} y abre la invitación para
                completar el acceso.
              </p>
            </div>
          </>
        ) : (
          <>
            <p className="mt-4 leading-7 text-[var(--muted)]">
              Tu identidad está verificada, pero todavía no existe una Membership
              activa para un Workspace. Envía una solicitud para que KYRUMA pueda
              verla y asignarte el acceso correcto.
            </p>
            <form action={requestPlatformAccess} className="mt-7">
              <button
                className="rounded-full bg-[var(--foreground)] px-6 py-3 text-sm text-[var(--background)]"
                type="submit"
              >
                Solicitar acceso a KYRUMA
              </button>
            </form>
          </>
        )}

        {params.requested === "1" ? (
          <p className="mt-5 text-sm text-[var(--primary)]" aria-live="polite">
            Solicitud enviada correctamente.
          </p>
        ) : null}

        <p className="mt-7 text-xs leading-6 text-[var(--muted)]">
          Solicitar acceso no lo concede automáticamente. KYRUMA revisa la
          relación, selecciona el Workspace correspondiente y envía una
          invitación segura.
        </p>
      </section>
    </main>
  );
}
