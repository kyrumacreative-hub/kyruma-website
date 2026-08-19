import { UserButton } from "@clerk/nextjs";
import { redirect } from "next/navigation";
import {
  issuePartnerInvitation,
  linkWorkspaceFigmaResource,
  provisionPartnerWorkspace,
} from "./actions";
import { requireCurrentActor } from "@/features/access/server/currentActor";
import { isInternalAdminEmail } from "@/features/access/server/internalAdmin";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export default async function AccessAdminPage({
  searchParams,
}: {
  searchParams: Promise<{
    sent?: string;
    created?: string;
    workspaceCode?: string;
    linked?: string;
  }>;
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
  const figmaResources = await prisma.portalShare.findMany({
    where: {
      workspaceId: { in: workspaces.map((workspace) => workspace.id) },
      kind: "link",
      title: "Figma",
      visibility: "shared",
    },
    orderBy: { publishedAt: "desc" },
    select: { workspaceId: true, externalUrl: true },
  });
  const figmaUrlByWorkspace = new Map(
    figmaResources.map((resource) => [resource.workspaceId, resource.externalUrl]),
  );
  const partnerOwners = await prisma.foundationMembership.findMany({
    where: {
      workspaceId: { in: workspaces.map((workspace) => workspace.id) },
      role: "partner",
      status: "active",
    },
    orderBy: { joinedAt: "asc" },
    select: {
      workspaceId: true,
      user: { select: { email: true, displayName: true } },
    },
  });
  const partnerOwnerByWorkspace = new Map(
    partnerOwners
      .filter((membership) => membership.workspaceId)
      .map((membership) => [membership.workspaceId, membership.user]),
  );

  return (
    <main className="min-h-screen bg-[var(--background)] px-6 pb-24 pt-32 text-[var(--foreground)]">
      <div className="mx-auto max-w-5xl">
        <header className="flex items-start justify-between gap-8 border-b border-[var(--border)] pb-10">
          <div>
            <p className="text-xs uppercase tracking-[.28em] text-[var(--primary)]">
              KYRUMA Platform
            </p>
            <h1 className="mt-4 text-4xl font-light">Control de acceso</h1>
            <p className="mt-3 text-[var(--muted)]">
              Administra los Workspaces y el acceso de partners a KYRUMA.
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

        {params.created === "1" ? (
          <div className="mt-8 rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-5">
            <p>Workspace {params.workspaceCode} activado correctamente.</p>
            <p className="mt-2 text-sm text-[var(--muted)]">
              El partner ya puede entrar en KYRUMA Platform con su identidad de Clerk.
            </p>
          </div>
        ) : null}

        {params.linked === "figma" ? (
          <div className="mt-8 rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-5">
            <p>Figma vinculado correctamente.</p>
            <p className="mt-2 text-sm text-[var(--muted)]">
              El recurso oficial ya está disponible para el Workspace seleccionado.
            </p>
          </div>
        ) : null}

        <section className="mt-10 rounded-3xl border border-[var(--border)] bg-[var(--surface)] p-8">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <p className="text-xs uppercase tracking-[.22em] text-[var(--primary)]">
                Workspaces
              </p>
              <h2 className="mt-3 text-2xl font-light">
                {workspaces.length
                  ? `${workspaces.length} configurado${workspaces.length === 1 ? "" : "s"}`
                  : "Sin Workspaces de cliente"}
              </h2>
            </div>
            <span className="rounded-full border border-[var(--border)] px-4 py-2 text-sm text-[var(--muted)]">
              PostgreSQL · fuente canónica
            </span>
          </div>

          {workspaces.length ? (
            <div className="mt-6 grid gap-3 sm:grid-cols-2">
              {workspaces.map((workspace) => (
                <article
                  className="rounded-2xl bg-[var(--surface-soft)] p-5"
                  key={workspace.id}
                >
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <h3>{workspace.name}</h3>
                      <p className="mt-2 text-sm text-[var(--muted)]">
                        {partnerOwnerByWorkspace.get(workspace.id)?.displayName ??
                          "Partner"}
                      </p>
                      <p className="mt-1 text-sm text-[var(--muted)]">
                        {partnerOwnerByWorkspace.get(workspace.id)?.email ??
                          "Identidad pendiente"}
                      </p>
                      {figmaUrlByWorkspace.get(workspace.id) ? (
                        <a
                          className="mt-3 inline-block text-sm text-[var(--primary)] underline underline-offset-4"
                          href={figmaUrlByWorkspace.get(workspace.id) ?? undefined}
                          rel="noreferrer"
                          target="_blank"
                        >
                          Abrir Figma ↗
                        </a>
                      ) : null}
                    </div>
                    <span className="rounded-full border border-[var(--border)] px-3 py-1 text-xs uppercase tracking-[.16em]">
                      {workspace.status}
                    </span>
                  </div>
                </article>
              ))}
            </div>
          ) : (
            <div className="mt-6 rounded-2xl bg-[var(--surface-soft)] p-6">
              <p className="font-medium">Platform está preparada.</p>
              <p className="mt-2 max-w-2xl text-sm leading-6 text-[var(--muted)]">
                El primer Workspace se crea cuando Operations convierte un Lead
                aprobado en Partner. Clerk gestiona la identidad; PostgreSQL
                conserva Organization, Partner, Workspace y permisos. No se
                crean clientes ficticios para completar esta pantalla.
              </p>
            </div>
          )}
        </section>

        <form
          action={linkWorkspaceFigmaResource}
          className="mt-8 space-y-6 rounded-3xl border border-[var(--border)] bg-[var(--surface)] p-8"
        >
          <div>
            <p className="text-xs uppercase tracking-[.22em] text-[var(--primary)]">
              Recursos externos
            </p>
            <h2 className="mt-3 text-2xl font-light">Vincular Figma</h2>
            <p className="mt-2 text-sm text-[var(--muted)]">
              Añade o actualiza el recurso oficial de Figma sin duplicar enlaces.
            </p>
          </div>
          <div className="grid gap-5 sm:grid-cols-2">
            <div>
              <label className="text-sm" htmlFor="figmaWorkspaceId">
                Workspace
              </label>
              <select
                className="mt-2 w-full rounded-xl border border-[var(--border)] bg-[var(--background)] px-4 py-3"
                disabled={!workspaces.length}
                id="figmaWorkspaceId"
                name="workspaceId"
                required
              >
                <option value="">Selecciona un Workspace</option>
                {workspaces.map((workspace) => (
                  <option
                    disabled={workspace.status !== "active"}
                    key={workspace.id}
                    value={workspace.id}
                  >
                    {workspace.name} · {workspace.status}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="text-sm" htmlFor="workspaceFigmaUrl">
                Archivo o proyecto de Figma
              </label>
              <input
                className="mt-2 w-full rounded-xl border border-[var(--border)] bg-[var(--background)] px-4 py-3"
                id="workspaceFigmaUrl"
                name="figmaUrl"
                placeholder="https://www.figma.com/..."
                required
                type="url"
              />
            </div>
          </div>
          <button
            className="rounded-full bg-[var(--foreground)] px-6 py-3 text-[var(--background)]"
            disabled={!workspaces.length}
            type="submit"
          >
            Guardar recurso de Figma
          </button>
        </form>

        <form
          action={provisionPartnerWorkspace}
          className="mt-8 space-y-6 rounded-3xl border border-[var(--border)] bg-[var(--surface)] p-8"
        >
          <div>
            <p className="text-xs uppercase tracking-[.22em] text-[var(--primary)]">
              Aprovisionamiento
            </p>
            <h2 className="mt-3 text-2xl font-light">Crear Partner Workspace</h2>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-[var(--muted)]">
              Utiliza una identidad que ya haya iniciado sesión con Clerk. Platform
              creará de forma atómica Lead importado, Partner, Workspace, owner y
              permisos. Los enlaces externos son opcionales.
            </p>
          </div>

          <div className="grid gap-5 sm:grid-cols-2">
            <div>
              <label className="text-sm" htmlFor="workspaceName">
                Nombre del Workspace
              </label>
              <input
                className="mt-2 w-full rounded-xl border border-[var(--border)] bg-[var(--background)] px-4 py-3"
                id="workspaceName"
                name="workspaceName"
                placeholder="KYR-001 · Nombre del partner"
                required
              />
            </div>
            <div>
              <label className="text-sm" htmlFor="partnerEmail">
                Identidad Clerk del partner
              </label>
              <input
                className="mt-2 w-full rounded-xl border border-[var(--border)] bg-[var(--background)] px-4 py-3"
                id="partnerEmail"
                name="partnerEmail"
                type="email"
                required
              />
            </div>
            <div>
              <label className="text-sm" htmlFor="figmaUrl">
                Archivo o proyecto de Figma · opcional
              </label>
              <input
                className="mt-2 w-full rounded-xl border border-[var(--border)] bg-[var(--background)] px-4 py-3"
                id="figmaUrl"
                name="figmaUrl"
                placeholder="https://www.figma.com/..."
                type="url"
              />
            </div>
            <div>
              <label className="text-sm" htmlFor="driveUrl">
                Carpeta de Google Drive · opcional
              </label>
              <input
                className="mt-2 w-full rounded-xl border border-[var(--border)] bg-[var(--background)] px-4 py-3"
                id="driveUrl"
                name="driveUrl"
                placeholder="https://drive.google.com/..."
                type="url"
              />
            </div>
          </div>

          <button
            className="rounded-full bg-[var(--foreground)] px-6 py-3 text-[var(--background)]"
            type="submit"
          >
            Crear Workspace y activar partner
          </button>
        </form>

        <form
          action={issuePartnerInvitation}
          className="mt-8 space-y-6 rounded-3xl border border-[var(--border)] bg-[var(--surface)] p-8"
        >
          <div>
            <p className="text-xs uppercase tracking-[.22em] text-[var(--primary)]">
              Invitaciones
            </p>
            <h2 className="mt-3 text-2xl font-light">Invitar partner</h2>
            <p className="mt-2 text-sm text-[var(--muted)]">
              Clerk enviará una invitación segura vinculada al Workspace seleccionado.
            </p>
          </div>
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
              disabled={!workspaces.length}
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
              disabled={!workspaces.length}
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
            disabled={!workspaces.length}
          >
            {workspaces.length ? "Enviar invitación" : "Esperando primer Workspace"}
          </button>
        </form>
      </div>
    </main>
  );
}
