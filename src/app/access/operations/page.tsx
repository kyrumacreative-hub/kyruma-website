import { UserButton } from "@clerk/nextjs";
import { getOperatingDashboard } from "@/features/operating-layer/server/dashboard";
import { completeOperationalTaskAction, qualifyLeadAction } from "./actions";

export const dynamic = "force-dynamic";

const funnelLabels: Record<string, string> = {
  identified: "Lead",
  discovery_in_progress: "Discovery en curso",
  discovery_completed: "Discovery completado",
  qualified: "Calificado",
  partner_created: "Partner",
  archived: "Archivado",
};

function count(value: Readonly<Record<string, number>>, key: string): number {
  return value[key] ?? 0;
}

function date(value?: string): string {
  return value ? new Intl.DateTimeFormat("es-ES", { dateStyle: "medium", timeStyle: "short" }).format(new Date(value)) : "Sin fecha";
}

export default async function OperationsPage() {
  const dashboard = await getOperatingDashboard();
  const funnelOrder = ["identified", "discovery_in_progress", "discovery_completed", "qualified", "partner_created"];
  const awaitingHumanReview = count(dashboard.intelligenceCounts, "generated") + count(dashboard.intelligenceCounts, "review_required");

  return (
    <main className="min-h-screen bg-[var(--background)] px-6 pb-24 pt-32 text-[var(--foreground)]">
      <div className="mx-auto max-w-6xl">
        <header className="flex items-start justify-between gap-8 border-b border-[var(--border)] pb-10">
          <div>
            <p className="text-xs uppercase tracking-[.28em] text-[var(--primary)]">KYRUMA OS + AI</p>
            <h1 className="mt-4 text-4xl font-light">Centro de operación interno</h1>
            <p className="mt-3 max-w-2xl text-[var(--muted)]">Funnel, clientes activos, Event Bus, tareas automáticas y revisión humana en una sola vista.</p>
          </div>
          <UserButton />
        </header>

        <section className="mt-10 grid gap-4 md:grid-cols-5">
          {funnelOrder.map((status) => (
            <article key={status} className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-5">
              <p className="text-sm text-[var(--muted)]">{funnelLabels[status]}</p>
              <p className="mt-3 text-3xl font-light">{count(dashboard.funnel, status)}</p>
            </article>
          ))}
        </section>

        <section className="mt-8 grid gap-6 lg:grid-cols-3">
          <article className="rounded-3xl border border-[var(--border)] bg-[var(--surface)] p-7">
            <p className="text-xs uppercase tracking-[.22em] text-[var(--primary)]">Automatizaciones</p>
            <h2 className="mt-3 text-2xl font-light">{count(dashboard.automationCounts, "completed")} completadas</h2>
            <p className="mt-3 text-sm text-[var(--muted)]">{count(dashboard.automationCounts, "failed")} fallidas · {count(dashboard.taskCounts, "open")} tareas abiertas</p>
          </article>
          <article className="rounded-3xl border border-[var(--border)] bg-[var(--surface)] p-7">
            <p className="text-xs uppercase tracking-[.22em] text-[var(--primary)]">KYRUMA AI</p>
            <h2 className="mt-3 text-2xl font-light">{awaitingHumanReview} pendientes de revisión</h2>
            <p className="mt-3 text-sm text-[var(--muted)]">Ningún output se vuelve operativo sin aprobación humana.</p>
          </article>
          <article className="rounded-3xl border border-[var(--border)] bg-[var(--surface)] p-7">
            <p className="text-xs uppercase tracking-[.22em] text-[var(--primary)]">Event Bus</p>
            <h2 className="mt-3 text-2xl font-light">{count(dashboard.eventBus.deliveries, "dead_letter")} dead letters</h2>
            <p className="mt-3 text-sm text-[var(--muted)]">{count(dashboard.eventBus.outbox, "pending")} eventos pendientes · {dashboard.eventBus.retryAttempts} reprocesos</p>
          </article>
        </section>

        <section className="mt-8 rounded-3xl border border-[var(--border)] bg-[var(--surface)] p-7">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div><p className="text-xs uppercase tracking-[.22em] text-[var(--primary)]">Clientes operativos</p><h2 className="mt-3 text-2xl font-light">Workspaces y proyectos</h2></div>
            <span className="text-sm text-[var(--muted)]">KYRUMA OS</span>
          </div>
          <div className="mt-6 grid gap-4 md:grid-cols-2">
            {dashboard.clients.map((client) => (
              <article key={client.code} className="rounded-2xl bg-[var(--surface-soft)] p-5">
                <div className="flex items-start justify-between gap-4">
                  <div><h3 className="text-xl font-light">{client.code}</h3><p className="mt-1 text-sm text-[var(--muted)]">{client.workspaceName ?? "Workspace pendiente"}</p></div>
                  <span className="rounded-full border border-[var(--border)] px-3 py-1 text-xs">{client.present ? client.status ?? "activo" : "pendiente"}</span>
                </div>
                <p className="mt-4 text-sm text-[var(--muted)]">{client.activeProjectCount}/{client.projectCount} proyectos activos</p>
              </article>
            ))}
          </div>
        </section>

        <section className="mt-8 grid gap-6 lg:grid-cols-[1.15fr_.85fr]">
          <article className="rounded-3xl border border-[var(--border)] bg-[var(--surface)] p-7">
            <div className="flex items-end justify-between gap-4">
              <div><p className="text-xs uppercase tracking-[.22em] text-[var(--primary)]">Funnel operativo</p><h2 className="mt-3 text-2xl font-light">Leads recientes</h2></div>
              <span className="text-sm text-[var(--muted)]">Máximo 50</span>
            </div>
            <div className="mt-6 space-y-4">
              {dashboard.leads.length ? dashboard.leads.map((lead) => (
                <div key={lead.id} className="rounded-2xl bg-[var(--surface-soft)] p-5">
                  <div className="flex flex-wrap items-start justify-between gap-4">
                    <div><h3 className="font-medium">{lead.company}</h3><p className="mt-1 text-sm text-[var(--muted)]">{lead.contactName} · {lead.email}</p></div>
                    <span className="rounded-full border border-[var(--border)] px-3 py-1 text-xs">{funnelLabels[lead.status] ?? lead.status}</span>
                  </div>
                  <p className="mt-3 text-xs text-[var(--muted)]">Entrada: {date(lead.createdAt)}{lead.discoveryCompletedAt ? ` · Discovery: ${date(lead.discoveryCompletedAt)}` : ""}</p>
                  {lead.status === "discovery_completed" ? (
                    <form action={qualifyLeadAction} className="mt-4 flex flex-col gap-3 sm:flex-row">
                      <input name="leadId" type="hidden" value={lead.id} />
                      <input className="min-w-0 flex-1 rounded-xl border border-[var(--border)] bg-transparent px-4 py-2 text-sm" name="reason" placeholder="Razón de calificación" required maxLength={1000} />
                      <button className="rounded-full bg-[var(--primary)] px-5 py-2 text-sm font-medium text-black" type="submit">Calificar</button>
                    </form>
                  ) : null}
                </div>
              )) : <p className="text-sm text-[var(--muted)]">Todavía no hay Leads persistidos.</p>}
            </div>
          </article>

          <article className="rounded-3xl border border-[var(--border)] bg-[var(--surface)] p-7">
            <p className="text-xs uppercase tracking-[.22em] text-[var(--primary)]">Trabajo siguiente</p>
            <h2 className="mt-3 text-2xl font-light">Tareas abiertas</h2>
            <div className="mt-6 space-y-4">
              {dashboard.openTasks.length ? dashboard.openTasks.map((task) => (
                <div key={task.id} className="rounded-2xl bg-[var(--surface-soft)] p-5">
                  <h3 className="font-medium">{task.title}</h3>
                  <p className="mt-2 text-xs text-[var(--muted)]">{task.taskType} · vence {date(task.dueAt)}</p>
                  <form action={completeOperationalTaskAction} className="mt-4">
                    <input name="taskId" type="hidden" value={task.id} />
                    <button className="rounded-full border border-[var(--border)] px-4 py-2 text-sm" type="submit">Marcar completada</button>
                  </form>
                </div>
              )) : <p className="text-sm text-[var(--muted)]">No hay tareas abiertas.</p>}
            </div>
          </article>
        </section>
      </div>
    </main>
  );
}
