import { UserButton } from "@clerk/nextjs";
import { redirect } from "next/navigation";
import {
  approveAccessRequest,
  issuePartnerInvitation,
  linkWorkspaceExternalResource,
  provisionPartnerWorkspace,
  reissuePartnerInvitation,
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
    delivery?: "sent" | "queued" | "failed";
    error?: string;
    created?: string;
    workspaceCode?: string;
    linked?: string;
    requestApproved?: string;
    reissued?: string;
  }>;
}) {
  const actor = await requireCurrentActor();

  if (!isInternalAdminEmail(actor.user.email)) {
    redirect("/access/pending");
  }

  const params = await searchParams;
  const deliveryError = params.error && /^[A-Z0-9_]{1,100}$/.test(params.error)
    ? params.error
    : "ACCESS_INVITATION_DELIVERY_FAILED";

  const accessRequests = await prisma.accessRequest.findMany({
    where: { status: "pending" },
    orderBy: { requestedAt: "asc" },
    select: {
      id: true,
      email: true,
      displayName: true,
      requestedAt: true,
      updatedAt: true,
    },
  });

  const [accessRequestHistory, invitationHistory] = await Promise.all([
    prisma.accessRequest.findMany({
      where: { status: { not: "pending" } },
      orderBy: { updatedAt: "desc" },
      take: 50,
      select: {
        id: true,
        email: true,
        displayName: true,
        status: true,
        requestedAt: true,
        updatedAt: true,
        resolvedAt: true,
        workspaceId: true,
      },
    }),
    prisma.accessInvitation.findMany({
      orderBy: { createdAt: "desc" },
      take: 50,
      select: {
        id: true,
        email: true,
        status: true,
        deliveryStatus: true,
        workspaceId: true,
        createdAt: true,
        deliveredAt: true,
        expiresAt: true,
        acceptedAt: true,
        revokedAt: true,
      },
    }),
  ]);

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
  const externalResources = await prisma.portalShare.findMany({
    where: {
      workspaceId: { in: workspaces.map((workspace) => workspace.id) },
      kind: "link",
      title: { in: ["Figma", "Google Drive"] },
      visibility: "shared",
    },
    orderBy: { publishedAt: "desc" },
    select: { workspaceId: true, title: true, externalUrl: true },
  });
  const resourcesByWorkspace = new Map<
    string,
    { title: string; externalUrl: string }[]
  >();
  for (const resource of externalResources) {
    if (!resource.externalUrl) continue;
    const resources = resourcesByWorkspace.get(resource.workspaceId) ?? [];
    if (!resources.some((item) => item.title === resource.title)) {
      resources.push({ title: resource.title, externalUrl: resource.externalUrl });
      resourcesByWorkspace.set(resource.workspaceId, resources);
    }
  }
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
  const workspaceNameById = new Map(
    workspaces.map((workspace) => [workspace.id, workspace.name]),
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

        {params.delivery === "sent" || params.sent === "1" ? (
          <div className="mt-8 rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-5">
            <p>{params.reissued === "1" ? "Invitación reemitida correctamente." : "Invitación enviada correctamente."}</p>
            <p className="mt-2 text-sm text-[var(--muted)]">
              Clerk ha aceptado la entrega del email de acceso.
            </p>
          </div>
        ) : null}

        {params.delivery === "queued" ? (
          <div className="mt-8 rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-5">
            <p>Invitación en cola de entrega.</p>
            <p className="mt-2 text-sm text-[var(--muted)]">
              El Event Bus volverá a procesarla de forma segura sin crear duplicados.
            </p>
          </div>
        ) : null}

        {params.delivery === "failed" ? (
          <div className="mt-8 rounded-2xl border border-red-300 bg-[var(--surface)] p-5">
            <p>No se ha podido entregar la invitación.</p>
            <p className="mt-2 text-sm text-[var(--muted)]">
              Revisa la configuración de Clerk y vuelve a emitirla. Código: {deliveryError}.
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

        {params.linked ? (
          <div className="mt-8 rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-5">
            <p>Recurso externo vinculado correctamente.</p>
            <p className="mt-2 text-sm text-[var(--muted)]">
              El recurso oficial ya está disponible para el Workspace seleccionado.
            </p>
          </div>
        ) : null}

        <section className="mt-10 rounded-3xl border border-[var(--border)] bg-[var(--surface)] p-8">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <p className="text-xs uppercase tracking-[.22em] text-[var(--primary)]">
                Solicitudes de acceso
              </p>
              <h2 className="mt-3 text-2xl font-light">
                {accessRequests.length
                  ? `${accessRequests.length} pendiente${accessRequests.length === 1 ? "" : "s"}`
                  : "Sin solicitudes pendientes"}
              </h2>
              <p className="mt-2 max-w-2xl text-sm leading-6 text-[var(--muted)]">
                Aquí aparecen las personas que han iniciado sesión pero todavía no
                tienen una Membership activa. Aprobar una solicitud no concede
                acceso directo: emite la invitación segura para el Workspace que
                selecciones.
              </p>
            </div>
            <span className="rounded-full border border-[var(--border)] px-4 py-2 text-sm text-[var(--muted)]">
              Revisión humana obligatoria
            </span>
          </div>

          {params.requestApproved === "1" ? (
            <div className="mt-6 rounded-2xl bg-[var(--surface-soft)] p-5">
              <p>Solicitud aprobada y vinculada a una invitación.</p>
            </div>
          ) : null}

          {accessRequests.length ? (
            <div className="mt-6 grid gap-4">
              {accessRequests.map((request) => (
                <form
                  action={approveAccessRequest}
                  className="grid gap-5 rounded-2xl bg-[var(--surface-soft)] p-5 md:grid-cols-[1fr_1fr_auto] md:items-end"
                  key={request.id}
                >
                  <input name="requestId" type="hidden" value={request.id} />
                  <div>
                    <p className="font-medium">
                      {request.displayName ?? "Identidad verificada"}
                    </p>
                    <p className="mt-1 text-sm text-[var(--muted)]">{request.email}</p>
                    <p className="mt-2 text-xs text-[var(--muted)]">
                      Solicitud: {request.requestedAt.toLocaleString("es-ES")}
                    </p>
                  </div>
                  <div>
                    <label className="text-sm" htmlFor={`request-workspace-${request.id}`}>
                      Workspace
                    </label>
                    <select
                      className="mt-2 w-full rounded-xl border border-[var(--border)] bg-[var(--background)] px-4 py-3"
                      disabled={!workspaces.length}
                      id={`request-workspace-${request.id}`}
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
                  <button
                    className="rounded-full bg-[var(--foreground)] px-6 py-3 text-[var(--background)] disabled:opacity-50"
                    disabled={!workspaces.length}
                    type="submit"
                  >
                    Aprobar e invitar
                  </button>
                </form>
              ))}
            </div>
          ) : (
            <div className="mt-6 rounded-2xl bg-[var(--surface-soft)] p-6">
              <p className="text-sm text-[var(--muted)]">
                Cuando alguien pulse “Solicitar acceso a KYRUMA” desde
                /access/pending, aparecerá aquí.
              </p>
            </div>
          )}
        </section>

        <section className="mt-10 rounded-3xl border border-[var(--border)] bg-[var(--surface)] p-8">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <p className="text-xs uppercase tracking-[.22em] text-[var(--primary)]">
                Access Operations
              </p>
              <h2 className="mt-3 text-2xl font-light">Historial operativo</h2>
              <p className="mt-2 max-w-2xl text-sm leading-6 text-[var(--muted)]">
                Trazabilidad de solicitudes resueltas e invitaciones. Las invitaciones
                pendientes pueden reemitirse: la anterior se revoca y se genera un
                token nuevo, sin conceder acceso directamente.
              </p>
            </div>
            <span className="rounded-full border border-[var(--border)] px-4 py-2 text-sm text-[var(--muted)]">
              Últimos 50 registros
            </span>
          </div>

          <div className="mt-8 grid gap-8 lg:grid-cols-2">
            <div>
              <h3 className="text-sm font-medium">Solicitudes resueltas</h3>
              <div className="mt-4 grid gap-3">
                {accessRequestHistory.length ? (
                  accessRequestHistory.map((request) => (
                    <article
                      className="rounded-2xl bg-[var(--surface-soft)] p-5"
                      key={request.id}
                    >
                      <div className="flex items-start justify-between gap-4">
                        <div>
                          <p className="font-medium">
                            {request.displayName ?? request.email}
                          </p>
                          <p className="mt-1 text-sm text-[var(--muted)]">
                            {request.email}
                          </p>
                        </div>
                        <span className="rounded-full border border-[var(--border)] px-3 py-1 text-xs uppercase tracking-[.12em]">
                          {request.status}
                        </span>
                      </div>
                      <p className="mt-3 text-xs text-[var(--muted)]">
                        {request.workspaceId
                          ? workspaceNameById.get(request.workspaceId) ?? "Workspace histórico"
                          : "Sin Workspace"}
                        {" · "}
                        {request.resolvedAt?.toLocaleString("es-ES") ??
                          request.updatedAt.toLocaleString("es-ES")}
                      </p>
                    </article>
                  ))
                ) : (
                  <p className="rounded-2xl bg-[var(--surface-soft)] p-5 text-sm text-[var(--muted)]">
                    Todavía no hay solicitudes resueltas.
                  </p>
                )}
              </div>
            </div>

            <div>
              <h3 className="text-sm font-medium">Invitaciones</h3>
              <div className="mt-4 grid gap-3">
                {invitationHistory.length ? (
                  invitationHistory.map((invitation) => {
                    const operationalStatus =
                      invitation.status === "pending" &&
                      invitation.expiresAt <= new Date()
                        ? "expired"
                        : invitation.status;
                    const canReissue =
                      invitation.status === "pending" && Boolean(invitation.workspaceId);

                    return (
                      <article
                        className="rounded-2xl bg-[var(--surface-soft)] p-5"
                        key={invitation.id}
                      >
                        <div className="flex items-start justify-between gap-4">
                          <div>
                            <p className="font-medium">{invitation.email}</p>
                            <p className="mt-1 text-sm text-[var(--muted)]">
                              {invitation.workspaceId
                                ? workspaceNameById.get(invitation.workspaceId) ??
                                  "Workspace histórico"
                                : "Ámbito sin Workspace"}
                            </p>
                          </div>
                          <span className="rounded-full border border-[var(--border)] px-3 py-1 text-xs uppercase tracking-[.12em]">
                            {operationalStatus}
                          </span>
                        </div>
                        <div className="mt-3 text-xs leading-5 text-[var(--muted)]">
                          <p>Entrega: {invitation.deliveryStatus}</p>
                          <p>
                            Emitida: {invitation.createdAt.toLocaleString("es-ES")}
                          </p>
                          {invitation.acceptedAt ? (
                            <p>
                              Aceptada: {invitation.acceptedAt.toLocaleString("es-ES")}
                            </p>
                          ) : null}
                          {invitation.revokedAt ? (
                            <p>
                              Revocada: {invitation.revokedAt.toLocaleString("es-ES")}
                            </p>
                          ) : null}
                          {!invitation.acceptedAt && !invitation.revokedAt ? (
                            <p>
                              Caduca: {invitation.expiresAt.toLocaleString("es-ES")}
                            </p>
                          ) : null}
                        </div>
                        {canReissue ? (
                          <form action={reissuePartnerInvitation} className="mt-4">
                            <input
                              name="invitationId"
                              type="hidden"
                              value={invitation.id}
                            />
                            <button
                              className="rounded-full border border-[var(--border-strong)] px-4 py-2 text-sm transition-colors hover:border-[var(--foreground)]"
                              type="submit"
                            >
                              Reemitir invitación
                            </button>
                          </form>
                        ) : null}
                      </article>
                    );
                  })
                ) : (
                  <p className="rounded-2xl bg-[var(--surface-soft)] p-5 text-sm text-[var(--muted)]">
                    Todavía no hay invitaciones registradas.
                  </p>
                )}
              </div>
            </div>
          </div>
        </section>

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
                      <div className="mt-3 flex flex-wrap gap-3">
                        {(resourcesByWorkspace.get(workspace.id) ?? []).map(
                          (resource) => (
                            <a
                              className="text-sm text-[var(--primary)] underline underline-offset-4"
                              href={resource.externalUrl}
                              key={resource.title}
                              rel="noreferrer"
                              target="_blank"
                            >
                              Abrir {resource.title} ↗
                            </a>
                          ),
                        )}
                      </div>
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
          action={linkWorkspaceExternalResource}
          className="mt-8 space-y-6 rounded-3xl border border-[var(--border)] bg-[var(--surface)] p-8"
        >
          <div>
            <p className="text-xs uppercase tracking-[.22em] text-[var(--primary)]">
              Recursos externos
            </p>
            <h2 className="mt-3 text-2xl font-light">Vincular recurso</h2>
            <p className="mt-2 text-sm text-[var(--muted)]">
              Añade o actualiza Figma o Google Drive sin duplicar enlaces.
            </p>
          </div>
          <div className="grid gap-5 sm:grid-cols-3">
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
              <label className="text-sm" htmlFor="externalResourceProvider">
                Tipo de recurso
              </label>
              <select
                className="mt-2 w-full rounded-xl border border-[var(--border)] bg-[var(--background)] px-4 py-3"
                id="externalResourceProvider"
                name="provider"
                required
              >
                <option value="figma">Figma</option>
                <option value="google-drive">Google Drive</option>
              </select>
            </div>
            <div>
              <label className="text-sm" htmlFor="workspaceExternalUrl">
                Enlace oficial
              </label>
              <input
                className="mt-2 w-full rounded-xl border border-[var(--border)] bg-[var(--background)] px-4 py-3"
                id="workspaceExternalUrl"
                name="externalUrl"
                placeholder="https://..."
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
            Guardar recurso
          </button>
        </form>

        <form
          action={provisionPartnerWorkspace}
          className="mt-8 space-y-6 rounded-3xl border border-[var(--border)] bg-[var(--surface)] p-8"
        >
          <div>
            <p className="text-xs uppercase tracking-[.22em] text-[var(--primary)]">
              Importación excepcional
            </p>
            <h2 className="mt-3 text-2xl font-light">Importar relación existente</h2>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-[var(--muted)]">
              Usa esta vía solo para migraciones, recuperación de relaciones previas
              o reparaciones administrativas justificadas. No sustituye el flujo
              canónico Lead → Discovery → Qualification → Partner. La identidad debe
              existir previamente en Clerk; Platform creará el Lead de importación,
              Partner, Workspace, owner y permisos de forma atómica.
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
            Importar Partner y crear Workspace
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
