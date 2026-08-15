import { UserButton } from "@clerk/nextjs";
import { redirect } from "next/navigation";
import { requireCurrentActor } from "@/features/access/server/currentActor";
import { PartnerPortalService } from "@/features/partner-portal/application/portalService";
import { PrismaPortalReader } from "@/features/partner-portal/infrastructure/PrismaPortalReader";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export default async function PortalPage() {
  const actor = await requireCurrentActor();
  const membership = actor.memberships.find((item) => item.status === "active" && item.scope.organizationId && item.scope.partnerId && item.scope.workspaceId);
  if (!membership?.scope.organizationId || !membership.scope.partnerId || !membership.scope.workspaceId) redirect("/access/pending");
  const portal = await new PartnerPortalService(new PrismaPortalReader(prisma)).get(actor, { organizationId: membership.scope.organizationId, partnerId: membership.scope.partnerId, workspaceId: membership.scope.workspaceId });
  return <main className="min-h-screen bg-[var(--background)] px-6 pb-24 pt-32 text-[var(--foreground)]"><div className="mx-auto max-w-6xl"><header className="flex items-start justify-between gap-8 border-b border-[var(--border)] pb-10"><div><p className="text-xs uppercase tracking-[.28em] text-[var(--primary)]">Partner Portal</p><h1 className="mt-4 text-4xl font-light">{portal.workspace.name}</h1><p className="mt-3 text-[var(--muted)]">Tu espacio compartido con KYRUMA.</p></div><UserButton /></header><div className="mt-10 grid gap-6 lg:grid-cols-3"><PortalSection title="Información compartida" items={portal.shared.map((item) => ({ id: item.id, title: item.title, meta: item.summary ?? item.kind, href: item.externalUrl }))} /><PortalSection title="Actividad" items={portal.activity.map((item) => ({ id: item.id, title: item.title, meta: item.description ?? item.occurredAt.toLocaleDateString("es-ES") }))} /><PortalSection title="Entregables" items={portal.deliverables.map((item) => ({ id: item.id, title: item.title, meta: `${item.status} · v${item.version}`, href: item.externalUrl }))} /></div></div></main>;
}

function PortalSection({ title, items }: { title: string; items: { id: string; title: string; meta: string; href?: string }[] }) { return <section className="rounded-3xl border border-[var(--border)] bg-[var(--surface)] p-6"><h2 className="text-lg font-medium">{title}</h2><div className="mt-5 space-y-3">{items.length ? items.map((item) => <article key={item.id} className="rounded-2xl bg-[var(--surface-soft)] p-4"><h3>{item.href ? <a className="hover:text-[var(--primary)]" href={item.href} rel="noreferrer" target="_blank">{item.title}</a> : item.title}</h3><p className="mt-2 text-sm text-[var(--muted)]">{item.meta}</p></article>) : <p className="text-sm text-[var(--muted)]">Todavía no hay elementos compartidos.</p>}</div></section>; }

